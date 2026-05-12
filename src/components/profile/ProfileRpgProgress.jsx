import React from 'react';
import { FiActivity, FiAward, FiCheckCircle, FiShield, FiTarget, FiTrendingUp, FiZap } from 'react-icons/fi';

const ProfileRpgProgress = ({ challenges = [], role = 'Client', sessions = [], userStats = {} }) => {
    const points = Number(userStats?.points || 0);
    const level = Number(userStats?.level || Math.max(1, Math.floor(points / 120) + 1));
    const xpForLevel = 500;
    const currentXp = points % xpForLevel;
    const xpPercent = Math.min(100, Math.round((currentXp / xpForLevel) * 100));
    const completedSessions = sessions.filter((session) => String(session.status).toUpperCase() === 'COMPLETED').length;
    const activeChallenges = challenges.filter((challenge) => challenge.status === 'active');
    const completedChallenges = challenges.filter((challenge) => challenge.status === 'completed');
    const challengeTotal = Math.max(challenges.length, 1);
    const challengePercent = Math.round((completedChallenges.length / challengeTotal) * 100);
    const streakDays = Math.max(3, Math.min(30, Math.round((userStats?.consistency || 70) / 8)));
    const rank = Math.max(1, 42 - level - completedSessions - completedChallenges.length);
    const evolutionStage = getEvolutionStage(level);

    const badges = [
        { label: 'No Skip', unlocked: streakDays >= 7, icon: FiZap },
        { label: 'Quest Hunter', unlocked: completedChallenges.length > 0, icon: FiTarget },
        { label: 'Session Verified', unlocked: completedSessions > 0, icon: FiCheckCircle },
        { label: role === 'Trainer' ? 'Coach Aura' : 'Hero Core', unlocked: points >= 250, icon: FiShield },
    ];

    const visibleChallenges = [
        ...activeChallenges,
        ...challenges.filter((challenge) => challenge.status !== 'active'),
    ].slice(0, 3);

    return (
        <section className="mt-5 overflow-hidden rounded-[28px] border border-[#c1cf98]/15 bg-[rgba(18,20,24,0.86)] shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative p-5 md:p-6">
                    <div className="pointer-events-none absolute right-5 top-5 rounded-full border border-[#c1cf98]/30 bg-[#c1cf98]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#eaf2cf] shadow-[0_0_24px_rgba(193,207,152,0.18)] animate-[levelGlow_1.9s_ease-in-out_infinite]">
                        Level Up Ready
                    </div>

                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">Character progression</p>
                    <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
                        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-[32px] border border-[#c1cf98]/25 bg-[#c1cf98]/10">
                            <div className="absolute inset-2 rounded-[26px] border border-[#c1cf98]/20 animate-[rpgPulse_2.4s_ease-in-out_infinite]" />
                            <FiZap className="text-[#c1cf98]" size={34} />
                            <span className="absolute -bottom-3 rounded-full border border-[#c1cf98]/30 bg-[#17191d] px-4 py-1 text-sm font-black text-[#eaf2cf]">
                                LV {level}
                            </span>
                        </div>

                        <div className="min-w-0 flex-1 pt-2 sm:pt-0">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-[#f5efe7] md:text-3xl">{evolutionStage.title}</h2>
                                    <p className="mt-1 text-sm text-white/50">{evolutionStage.body}</p>
                                </div>
                                <p className="text-sm font-bold text-[#c1cf98]">{currentXp} / {xpForLevel} XP</p>
                            </div>

                                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                                    <div
                                    className="xp-fill relative h-full overflow-hidden rounded-full bg-[#c1cf98] shadow-[0_0_18px_rgba(193,207,152,0.45)] transition-all duration-700"
                                    style={{ width: `${xpPercent}%` }}
                                />
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                <MiniStat icon={FiZap} label="Streak" value={`${streakDays} days`} />
                                <MiniStat icon={FiActivity} label="Completed" value={completedSessions} />
                                <MiniStat icon={FiTrendingUp} label="Rank" value={`#${rank}`} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 bg-black/18 p-5 md:p-6 lg:border-l lg:border-t-0">
                    <div className="grid gap-4">
                        <div>
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">Evolution path</p>
                                <p className="text-xs font-semibold text-[#c1cf98]">{evolutionStage.next}</p>
                            </div>
                            <div className="mt-4 grid grid-cols-4 gap-2">
                                {EVOLUTION_STAGES.map((stage) => (
                                    <div
                                        key={stage.title}
                                        className={`rounded-2xl border px-3 py-3 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(0,0,0,0.18)] ${
                                            level >= stage.minLevel
                                                ? 'border-[#c1cf98]/35 bg-[#c1cf98]/10 text-[#eaf2cf]'
                                                : 'border-white/10 bg-white/[0.03] text-white/35'
                                        }`}
                                    >
                                        <stage.icon className="mx-auto" size={18} />
                                        <p className="mt-2 truncate text-[11px] font-bold">{stage.short}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">Achievements</p>
                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {badges.map((badge) => (
                                    <Badge key={badge.label} {...badge} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 border-t border-white/10 p-5 md:grid-cols-[1fr_0.85fr] md:p-6">
                <div>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">Challenge progress</p>
                            <h3 className="mt-2 text-xl font-black text-[#f5efe7]">Quest log</h3>
                        </div>
                        <span className="rounded-full border border-[#c1cf98]/25 bg-[#c1cf98]/10 px-3 py-1 text-sm font-black text-[#c1cf98]">
                            {challengePercent}%
                        </span>
                    </div>

                    <div className="mt-4 grid gap-3">
                        {visibleChallenges.map((challenge) => (
                            <ChallengeRow key={challenge.id} challenge={challenge} />
                        ))}
                    </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">Leaderboard preview</p>
                    <div className="mt-4 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-4xl font-black text-[#f5efe7]">#{rank}</p>
                            <p className="mt-2 text-sm text-white/50">HeroFit {role} ladder</p>
                        </div>
                        <div className="rounded-2xl border border-[#c1cf98]/25 bg-[#c1cf98]/10 px-4 py-3 text-right">
                            <p className="text-xs uppercase tracking-[0.16em] text-white/45">Next Rival</p>
                            <p className="mt-1 font-bold text-[#eaf2cf]">+{Math.max(80, xpForLevel - currentXp)} XP</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes rpgPulse {
                    0%, 100% { transform: scale(1); opacity: 0.65; }
                    50% { transform: scale(1.08); opacity: 1; }
                }
                @keyframes levelGlow {
                    0%, 100% { transform: translateY(0); opacity: 0.82; }
                    50% { transform: translateY(-2px); opacity: 1; }
                }
                @keyframes xpShimmer {
                    0% { transform: translateX(-120%); opacity: 0; }
                    30% { opacity: 0.55; }
                    100% { transform: translateX(160%); opacity: 0; }
                }
                .xp-fill::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    width: 46%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.62), transparent);
                    animation: xpShimmer 2.8s ease-in-out infinite;
                    will-change: transform, opacity;
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

const EVOLUTION_STAGES = [
    { title: 'Rookie', short: 'Rookie', minLevel: 1, icon: FiActivity },
    { title: 'Adept', short: 'Adept', minLevel: 5, icon: FiTarget },
    { title: 'Elite', short: 'Elite', minLevel: 10, icon: FiShield },
    { title: 'Legend', short: 'Legend', minLevel: 15, icon: FiAward },
];

const getEvolutionStage = (level) => {
    if (level >= 15) return { title: 'Legend Form', body: 'Your character is in elite RPG fitness evolution.', next: 'Max tier active' };
    if (level >= 10) return { title: 'Elite Form', body: 'Higher intensity quests and stronger training identity unlocked.', next: 'Legend at LV 15' };
    if (level >= 5) return { title: 'Adept Form', body: 'Consistency bonuses and challenge momentum are building.', next: 'Elite at LV 10' };
    return { title: 'Rookie Form', body: 'Complete sessions and quests to evolve your character.', next: 'Adept at LV 5' };
};

const MiniStat = ({ icon: Icon, label, value }) => (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#c1cf98]/30 hover:bg-white/[0.07]">
        <Icon className="text-[#c1cf98]" size={16} />
        <p className="mt-2 text-xs text-white/40">{label}</p>
        <p className="mt-1 text-sm font-black text-[#f5efe7]">{value}</p>
    </div>
);

const Badge = ({ icon: Icon, label, unlocked }) => (
    <div className={`flex items-center gap-3 rounded-2xl border px-3 py-3 transition-all duration-300 hover:-translate-y-1 ${unlocked ? 'border-[#c1cf98]/25 bg-[#c1cf98]/10 hover:shadow-[0_10px_24px_rgba(193,207,152,0.08)]' : 'border-white/10 bg-white/[0.03] opacity-55'}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/25">
            <Icon className={unlocked ? 'text-[#c1cf98]' : 'text-white/35'} size={17} />
        </div>
        <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{label}</p>
            <p className="text-xs text-white/40">{unlocked ? 'Unlocked' : 'Locked'}</p>
        </div>
    </div>
);

const ChallengeRow = ({ challenge }) => {
    const isCompleted = challenge.status === 'completed';
    const isActive = challenge.status === 'active';
    const progress = isCompleted ? 100 : isActive ? 62 : 18;

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#c1cf98]/30 hover:bg-white/[0.07]">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">{challenge.title}</p>
                    <p className="mt-1 truncate text-xs text-white/40">{challenge.desc}</p>
                </div>
                <span className="shrink-0 text-sm font-black text-[#c1cf98]">+{challenge.points}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-[#c1cf98]" style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
};

export default ProfileRpgProgress;
