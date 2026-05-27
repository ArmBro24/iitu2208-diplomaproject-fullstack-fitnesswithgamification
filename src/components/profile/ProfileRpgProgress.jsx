import React from 'react';
import { FiAward, FiCheckCircle, FiTarget, FiZap } from 'react-icons/fi';

const ProfileRpgProgress = ({ challenges = [], sessions = [], userStats = {} }) => {
    const points = Number(userStats?.points || 0);
    const level = Number(userStats?.level || Math.max(1, Math.floor(points / 120) + 1));
    const xpForLevel = 500;
    const currentXp = points % xpForLevel;
    const xpPercent = Math.max(8, Math.min(100, Math.round((currentXp / xpForLevel) * 100)));
    const completedSessions = sessions.filter((session) => String(session.status).toUpperCase() === 'COMPLETED').length;
    const completedChallenges = challenges.filter((challenge) => challenge.status === 'completed');
    const activeChallenge = challenges.find((challenge) => challenge.status === 'active') || challenges[0];
    const streakDays = Math.max(3, Math.min(30, Math.round((userStats?.consistency || 70) / 8)));

    const achievements = [
        { label: 'Streak Starter', unlocked: streakDays >= 3, icon: FiZap },
        { label: 'Session Done', unlocked: completedSessions > 0, icon: FiCheckCircle },
        { label: 'Challenge Win', unlocked: completedChallenges.length > 0, icon: FiAward },
    ];

    return (
        <section className="mt-5 rounded-[28px] border border-[#c1cf98]/15 bg-[rgba(18,20,24,0.84)] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.2)] md:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">Profile progression</p>
                    <div className="mt-3 flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#c1cf98]/25 bg-[#c1cf98]/10 text-[#c1cf98] shadow-[0_0_24px_rgba(193,207,152,0.12)]">
                            <FiZap size={26} />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-2xl font-black text-[#f5efe7] md:text-3xl">Level {level}</h2>
                            <p className="mt-1 text-sm font-medium text-white/50">{currentXp} / {xpForLevel} XP</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 md:min-w-40">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">Current streak</p>
                    <p className="mt-2 text-2xl font-black text-[#dfe9bf]">{streakDays} days</p>
                </div>
            </div>

            <div className="mt-5">
                <div className="h-3 overflow-hidden rounded-full border border-white/10 bg-black/25">
                    <div
                        className="xp-fill relative h-full overflow-hidden rounded-full bg-gradient-to-r from-[#8b5cf6] via-[#c1cf98] to-[#dfe9bf] shadow-[0_0_18px_rgba(193,207,152,0.35)] transition-all duration-700"
                        style={{ width: `${xpPercent}%` }}
                    />
                </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">Achievements</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        {achievements.map((achievement) => (
                            <Achievement key={achievement.label} {...achievement} />
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">Active challenge</p>
                    <ChallengePreview challenge={activeChallenge} />
                </div>
            </div>

            <style>{`
                @keyframes xpShimmer {
                    0% { transform: translateX(-120%); opacity: 0; }
                    30% { opacity: 0.5; }
                    100% { transform: translateX(160%); opacity: 0; }
                }
                .xp-fill::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    width: 42%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.58), transparent);
                    animation: xpShimmer 2.8s ease-in-out infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .xp-fill::after {
                        animation: none;
                    }
                }
            `}</style>
        </section>
    );
};

const Achievement = ({ icon: Icon, label, unlocked }) => (
    <div className={`flex items-center gap-3 rounded-2xl border px-3 py-3 transition-all duration-300 hover:-translate-y-0.5 ${
        unlocked
            ? 'border-[#c1cf98]/25 bg-[#c1cf98]/10'
            : 'border-white/10 bg-white/[0.03] opacity-55'
    }`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/25">
            <Icon className={unlocked ? 'text-[#c1cf98]' : 'text-white/35'} size={17} />
        </div>
        <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{label}</p>
            <p className="text-xs text-white/40">{unlocked ? 'Unlocked' : 'Locked'}</p>
        </div>
    </div>
);

const ChallengePreview = ({ challenge }) => {
    if (!challenge) {
        return (
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm font-bold text-[#f5efe7]">No active challenge</p>
                <p className="mt-1 text-xs text-white/45">Start a challenge to track progress here.</p>
            </div>
        );
    }

    const progress = Number(challenge.progressPercent || 0);

    return (
        <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c1cf98]/30 hover:bg-white/[0.07]">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#f5efe7]">{challenge.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-white/45">{challenge.desc}</p>
                </div>
                <span className="shrink-0 rounded-full border border-[#c1cf98]/25 bg-[#c1cf98]/10 px-2 py-1 text-xs font-black text-[#c1cf98]">
                    +{challenge.points}
                </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-[#c1cf98]" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-white/40">{challenge.currentPoints || 0} / {challenge.points} XP completed</p>
        </div>
    );
};

export default ProfileRpgProgress;
