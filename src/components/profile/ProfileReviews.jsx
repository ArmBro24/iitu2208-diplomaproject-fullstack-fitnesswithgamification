import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiSend, FiStar } from 'react-icons/fi';
import { getUserDisplayName, getUserInitials, getUserNickname } from '../../utils/userDisplay.js';

const API_AUTH_URL = 'http://localhost:8080/api/users';
const API_REVIEWS_URL = 'http://localhost:8081/api/training/reviews';

const ProfileReviews = ({ currentUserLabel, profileUserId }) => {
    const [reviews, setReviews] = useState([]);
    const [eligibleTargets, setEligibleTargets] = useState([]);
    const [usersById, setUsersById] = useState({});
    const [selectedSessionId, setSelectedSessionId] = useState('');
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
    const availableTargets = eligibleTargets.filter((target) => !target.alreadyReviewed);
    const selectedTarget = availableTargets.find((target) => String(target.sessionId) === String(selectedSessionId));

    const averageRating = useMemo(() => {
        if (!reviews.length) return '0.0';
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    }, [reviews]);

    useEffect(() => {
        if (!profileUserId || !token) return;

        const loadReviews = async () => {
            setIsLoading(true);
            setError('');
            try {
                const [reviewsResponse, targetsResponse] = await Promise.all([
                    axios.get(`${API_REVIEWS_URL}/received/${profileUserId}`, authHeaders(token)),
                    axios.get(`${API_REVIEWS_URL}/eligible`, authHeaders(token)),
                ]);

                setReviews(reviewsResponse.data || []);
                setEligibleTargets(targetsResponse.data || []);
                await loadUsers([
                    ...(reviewsResponse.data || []).map((review) => review.authorUserId),
                    ...(targetsResponse.data || []).map((target) => target.targetUserId),
                ]);
            } catch (requestError) {
                console.error('Failed to load profile reviews:', requestError);
                setError(requestError.response?.data?.error || 'Reviews are unavailable right now.');
            } finally {
                setIsLoading(false);
            }
        };

        loadReviews();
    }, [profileUserId, token]);

    useEffect(() => {
        if (!selectedSessionId && availableTargets.length) {
            setSelectedSessionId(String(availableTargets[0].sessionId));
        }
    }, [availableTargets, selectedSessionId]);

    const loadUsers = async (userIds) => {
        const uniqueIds = [...new Set(userIds.filter(Boolean).map(String))];
        const missingIds = uniqueIds.filter((id) => !usersById[id]);
        if (!missingIds.length) return;

        const loadedUsers = await Promise.all(
            missingIds.map(async (id) => {
                try {
                    const response = await axios.get(`${API_AUTH_URL}/${id}`, authHeaders(token));
                    return [id, response.data];
                } catch (userError) {
                    console.warn(`Failed to load user ${id}:`, userError);
                    return [id, { id, firstName: 'User', lastName: `#${id}` }];
                }
            })
        );

        setUsersById((current) => ({
            ...current,
            ...Object.fromEntries(loadedUsers),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const trimmedText = text.trim();
        if (!trimmedText || !selectedTarget) return;

        setError('');
        try {
            const response = await axios.post(
                API_REVIEWS_URL,
                {
                    sessionId: selectedTarget.sessionId,
                    targetUserId: selectedTarget.targetUserId,
                    rating,
                    text: trimmedText,
                },
                authHeaders(token)
            );

            setReviews((current) => [response.data, ...current]);
            setEligibleTargets((current) =>
                current.map((target) =>
                    target.sessionId === selectedTarget.sessionId
                        ? { ...target, alreadyReviewed: true }
                        : target
                )
            );
            await loadUsers([response.data.authorUserId]);
            setText('');
            setRating(5);
            setSelectedSessionId('');
        } catch (requestError) {
            console.error('Failed to submit review:', requestError);
            setError(requestError.response?.data?.error || 'Could not submit this review.');
        }
    };

    return (
        <section className="mt-5 rounded-[28px] border border-white/10 bg-[rgba(18,20,24,0.82)] p-5 shadow-[0_10px_28px_rgba(0,0,0,0.14)] md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">Reviews / Feedback</p>
                    <h2 className="mt-2 text-2xl font-black text-[#f5efe7]">Verified training feedback</h2>
                    <p className="mt-1 max-w-[560px] text-sm leading-relaxed text-white/50">
                        Reviews are available only between clients and trainers after completed HeroFit sessions.
                    </p>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[#c1cf98]/25 bg-[#c1cf98]/10 px-4 py-2">
                    <FiStar className="fill-[#c1cf98] text-[#c1cf98]" size={18} />
                    <span className="text-lg font-black text-[#f5efe7]">{averageRating}</span>
                </div>
            </div>

            {error && (
                <p className="mt-4 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} className="mt-5 rounded-[22px] border border-white/10 bg-black/20 p-4">
                <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-white/75">Leave feedback after a completed session</p>
                        <p className="mt-1 text-xs text-white/40">
                            {availableTargets.length
                                ? 'Choose a verified client/trainer relationship.'
                                : 'No completed sessions available for review yet.'}
                        </p>
                    </div>

                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setRating(value)}
                                className="rounded-lg p-1 text-[#c1cf98] transition-all hover:bg-white/10"
                                aria-label={`${value} star rating`}
                                disabled={!availableTargets.length}
                            >
                                <FiStar className={value <= rating ? 'fill-[#c1cf98]' : 'fill-transparent opacity-45'} size={19} />
                            </button>
                        ))}
                    </div>
                </div>

                {availableTargets.length > 0 && (
                    <select
                        value={selectedSessionId}
                        onChange={(event) => setSelectedSessionId(event.target.value)}
                        className="mt-3 w-full rounded-2xl border border-white/10 bg-[#17191d] px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#c1cf98]/50"
                    >
                        {availableTargets.map((target) => {
                            const user = usersById[String(target.targetUserId)];
                            const userName = user ? getUserDisplayName(user) : `User #${target.targetUserId}`;
                            return (
                                <option key={target.sessionId} value={target.sessionId}>
                                    {userName} / {target.sessionTitle}
                                </option>
                            );
                        })}
                    </select>
                )}

                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        placeholder="Write a short verified review..."
                        disabled={!availableTargets.length}
                        className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-[#c1cf98]/50 disabled:cursor-not-allowed disabled:opacity-45"
                    />
                    <button
                        type="submit"
                        disabled={!availableTargets.length || !text.trim()}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#c1cf98] px-5 py-3 text-sm font-bold text-black transition-all hover:bg-[#d4dfb2] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                        <FiSend size={16} />
                        Send
                    </button>
                </div>
            </form>

            <div className="mt-4 grid gap-3">
                {isLoading && (
                    <p className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4 text-sm text-white/50">
                        Loading verified feedback...
                    </p>
                )}

                {!isLoading && reviews.length === 0 && (
                    <p className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4 text-sm text-white/50">
                        No verified reviews yet. Complete a training session first.
                    </p>
                )}

                {reviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        user={usersById[String(review.authorUserId)]}
                        fallbackName={currentUserLabel}
                    />
                ))}
            </div>
        </section>
    );
};

const ReviewCard = ({ fallbackName, review, user }) => {
    const authorName = user ? getUserDisplayName(user) : fallbackName || `User #${review.authorUserId}`;
    const authorNickname = user ? getUserNickname(user) : '';
    const initials = user ? getUserInitials(user) : authorName.slice(0, 2).toUpperCase();
    const date = review.createdAt
        ? new Date(review.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Recently';

    return (
        <article className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#c1cf98]/25 bg-[#c1cf98]/10 text-sm font-black text-[#c1cf98]">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">{authorName}</p>
                        <p className="truncate text-xs text-[#c1cf98]/70">{authorNickname || date}</p>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <div className="flex gap-0.5 text-[#c1cf98]">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <FiStar key={value} className={value <= review.rating ? 'fill-[#c1cf98]' : 'fill-transparent opacity-35'} size={14} />
                        ))}
                    </div>
                    <span className="text-xs text-white/35">{date}</span>
                </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-white/65">{review.text}</p>

            {review.verifiedTrainingSession && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#c1cf98]/25 bg-[#c1cf98]/10 px-3 py-1 text-xs font-semibold text-[#dfe9bf]">
                    <FiCheckCircle size={13} />
                    Verified Training Session
                </div>
            )}
        </article>
    );
};

const authHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export default ProfileReviews;
