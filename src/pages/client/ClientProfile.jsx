import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiAward, FiEdit3, FiLifeBuoy, FiMail, FiSettings, FiStar, FiUser, FiZap } from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';
import useStore from '../../store/useStore.js';
import avatarImg from '../../assets/avatars/blue_haired.png';
import { getUserDisplayName, getUserInitials, getUserNickname } from '../../utils/userDisplay.js';
import ProfileCharacter from '../../components/profile/ProfileCharacter.jsx';
import ProfileReviews from '../../components/profile/ProfileReviews.jsx';
import ProfileRpgProgress from '../../components/profile/ProfileRpgProgress.jsx';

const ClientProfile = () => {
    const navigate = useNavigate();
    const { challenges, currentUser, sessions, userStats, fetchChallenges } = useStore();
    const displayName = getUserDisplayName(currentUser);
    const nickname = getUserNickname(currentUser);
    const initials = getUserInitials(currentUser);

    useEffect(() => {
        if (currentUser?.id) {
            fetchChallenges(currentUser.id);
        }
    }, [currentUser?.id, fetchChallenges]);

    const stats = [
        { label: 'Points', value: userStats?.points || 0, icon: FiAward },
        { label: 'Sessions', value: sessions?.length || 0, icon: FiZap },
        { label: 'Rating', value: '4.8', icon: FiStar },
    ];

    return (
        <Background>
            <main className="min-h-screen overflow-x-hidden px-4 py-5 font-rubik text-white sm:px-6 md:px-8 lg:px-10">
                <div className="mx-auto max-w-[960px]">
                    <header className="flex items-center justify-between gap-4">
                        <button
                            onClick={() => navigate('/home')}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#c1cf98] transition-all hover:bg-white/10"
                            aria-label="Back"
                        >
                            <FiArrowLeft size={22} />
                        </button>

                        <p className="text-2xl font-black tracking-tight text-[#c1cf98]">HeroFit</p>

                        <div className="h-11 w-11" />
                    </header>

                    <section className="mt-6 rounded-[28px] border border-white/10 bg-[rgba(18,20,24,0.86)] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.22)] md:p-7">
                        <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
                            <ProfileCharacter
                                alt={displayName}
                                image={avatarImg}
                                initials={initials}
                                level={userStats?.level || 1}
                                points={userStats?.points || 0}
                            />

                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">Client profile</p>
                                <h1 className="mt-3 break-words text-3xl font-black tracking-tight text-[#f5efe7] md:text-5xl">
                                    {displayName}
                                </h1>
                                <p className="mt-2 text-sm font-semibold text-[#c1cf98]/80">{nickname}</p>

                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                    <InfoRow icon={FiUser} label="Role" value="Client" />
                                    <InfoRow icon={FiMail} label="Email" value={currentUser?.email || 'Not provided'} />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => window.alert('Edit Profile screen can be added next.')}
                                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c1cf98] px-5 py-3 font-bold text-black transition-all hover:bg-[#d4dfb2] sm:w-auto"
                                >
                                    <FiEdit3 size={18} />
                                    Edit Profile
                                </button>

                                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                                    <ProfileActionButton
                                        icon={FiSettings}
                                        label="Settings"
                                        onClick={() => window.alert('Settings screen can be added next.')}
                                    />
                                    <ProfileActionButton
                                        icon={FiLifeBuoy}
                                        label="Support"
                                        onClick={() => navigate('/support')}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mt-5 grid gap-4 sm:grid-cols-3">
                        {stats.map((stat) => (
                            <StatCard key={stat.label} {...stat} />
                        ))}
                    </section>

                    <ProfileRpgProgress
                        challenges={challenges}
                        role="Client"
                        sessions={sessions}
                        userStats={userStats}
                    />

                    <ProfileReviews
                        currentUserLabel={displayName}
                        profileUserId={currentUser?.id}
                    />
                </div>
            </main>
        </Background>
    );
};

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
        <Icon className="shrink-0 text-[#c1cf98]" size={18} />
        <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.16em] text-white/40">{label}</p>
            <p className="mt-1 truncate text-sm font-semibold text-[#f5efe7]">{value}</p>
        </div>
    </div>
);

const StatCard = ({ icon: Icon, label, value }) => (
    <div className="rounded-[24px] border border-white/10 bg-[rgba(18,20,24,0.82)] p-5 shadow-[0_10px_28px_rgba(0,0,0,0.14)]">
        <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-white/55">{label}</p>
            <Icon className="text-[#c1cf98]" size={20} />
        </div>
        <p className="mt-4 text-3xl font-black text-[#f5efe7]">{value}</p>
    </div>
);

const ProfileActionButton = ({ icon: Icon, label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-[#f5efe7] transition-all hover:border-[#c1cf98]/35 hover:bg-white/[0.08]"
    >
        <Icon className="text-[#c1cf98]" size={17} />
        {label}
    </button>
);

export default ClientProfile;
