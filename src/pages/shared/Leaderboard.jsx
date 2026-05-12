import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiArrowLeft,
    FiAward,
    FiChevronUp,
    FiShield,
    FiStar,
    FiTrendingUp,
    FiZap
} from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';
import useStore from '../../store/useStore.js';
import { getUserDisplayName } from '../../utils/userDisplay.js';

import avatarMe from '../../assets/avatars/avatar-me.png';
import avatar1 from '../../assets/avatars/avatar1.png';
import avatar2 from '../../assets/avatars/avatar2.png';
import avatar3 from '../../assets/avatars/avatar3.png';
import avatar4 from '../../assets/avatars/avatar4.png';
import avatar5 from '../../assets/avatars/avatar5.png';
import avatar6 from '../../assets/avatars/avatar6.png';
import avatar7 from '../../assets/avatars/avatar7.png';
import avatar8 from '../../assets/avatars/avatar8.png';
import avatar9 from '../../assets/avatars/avatar9.png';
import avatar10 from '../../assets/avatars/avatar10.png';

const avatars = [avatarMe, avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatar10];

const leaderboardData = [
    { id: 1, name: 'Nova Pulse', points: 1540, level: 18, streak: 21, badge: 'Champion', trend: '+2' },
    { id: 2, name: 'Iron Sage', points: 1200, level: 16, streak: 14, badge: 'Power', trend: '+1' },
    { id: 3, name: 'Luna Core', points: 950, level: 14, streak: 11, badge: 'Focus', trend: '+4' },
    { id: 4, name: 'Atlas Run', points: 880, level: 13, streak: 9, badge: 'Stamina', trend: '+1' },
    { id: 5, name: 'Vega Fit', points: 720, level: 11, streak: 7, badge: 'Quest', trend: '+3' },
    { id: 6, name: 'Kai Lift', points: 640, level: 10, streak: 5, badge: 'Strong', trend: '0' },
    { id: 7, name: 'Mira Flow', points: 590, level: 9, streak: 8, badge: 'Balance', trend: '+2' },
    { id: 8, name: 'Zed Move', points: 510, level: 8, streak: 4, badge: 'Sprint', trend: '+1' },
    { id: 9, name: 'Ari Zen', points: 430, level: 7, streak: 3, badge: 'Mindset', trend: '0' },
    { id: 10, name: 'Ray Form', points: 300, level: 5, streak: 2, badge: 'Rookie', trend: '+1' }
];

const Leaderboard = () => {
    const navigate = useNavigate();
    const currentUser = useStore((state) => state.currentUser);
    const userStats = useStore((state) => state.userStats);
    const displayName = getUserDisplayName(currentUser);
    const myPoints = Number(userStats?.points || 288);
    const myLevel = Number(userStats?.level || Math.max(1, Math.floor(myPoints / 120) + 1));
    const myStreak = Math.max(3, Math.min(30, Math.round((userStats?.consistency || 70) / 8)));

    const myPlayer = {
        id: 0,
        name: displayName === 'Profile' ? 'You' : displayName,
        points: myPoints,
        level: myLevel,
        streak: myStreak,
        badge: 'Rising Hero',
        trend: '+5',
        isMe: true
    };

    const players = [...leaderboardData, myPlayer]
        .sort((a, b) => b.points - a.points)
        .map((player, index) => ({ ...player, rank: index + 1 }));

    const topPlayers = players.slice(0, 3);
    const restPlayers = players.slice(3);
    const me = players.find((player) => player.isMe);
    const maxPoints = Math.max(...players.map((player) => player.points), 1);

    return (
        <Background>
            <div className="relative flex min-h-screen flex-col overflow-x-hidden text-white font-rubik">
                <nav className="relative z-20 flex shrink-0 items-center px-5 py-5 sm:px-6 md:px-10 md:py-7">
                    <button
                        onClick={() => navigate('/menu')}
                        className="rounded-xl border border-white/10 bg-white/5 p-2 text-2xl transition-all hover:scale-105 hover:bg-white/10 active:scale-95 md:rounded-2xl md:p-3 md:text-3xl"
                    >
                        <FiArrowLeft className="text-[#c1cf98]" />
                    </button>

                    <div className="flex-grow pr-10 text-center">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c1cf98]/70">HeroFit Arena</p>
                        <h1 className="mt-1 text-2xl font-black tracking-tight text-[#f5efe7] md:text-4xl">Leaderboard</h1>
                    </div>
                </nav>

                <main className="relative z-10 grid flex-1 grid-cols-1 gap-5 px-5 pb-8 sm:px-6 md:grid-cols-[minmax(320px,0.9fr)_1.1fr] md:gap-7 md:px-10 md:pb-10">
                    <section className="flex min-h-0 flex-col gap-5">
                        <div className="rounded-[30px] border border-white/10 bg-[rgba(18,20,24,0.72)] p-5 shadow-[0_20px_55px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-6">
                            <div className="mb-5 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">Top 3</p>
                                    <h2 className="mt-1 text-xl font-black text-[#eef2d7]">Weekly podium</h2>
                                </div>
                                <div className="flex items-center gap-2 rounded-full border border-[#c1cf98]/20 bg-[#c1cf98]/10 px-3 py-1 text-xs font-bold text-[#dfe9bf]">
                                    <FiZap />
                                    Live XP
                                </div>
                            </div>

                            <div className="grid grid-cols-3 items-end gap-3 pt-4">
                                <PodiumPlayer player={topPlayers[1]} place="2" avatar={avatars[topPlayers[1]?.id] || avatar2} height="h-32 md:h-40" tone="silver" />
                                <PodiumPlayer player={topPlayers[0]} place="1" avatar={avatars[topPlayers[0]?.id] || avatar1} height="h-44 md:h-56" tone="gold" />
                                <PodiumPlayer player={topPlayers[2]} place="3" avatar={avatars[topPlayers[2]?.id] || avatar3} height="h-28 md:h-36" tone="bronze" />
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-[#c1cf98]/20 bg-[rgba(193,207,152,0.09)] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                                <Avatar image={avatarMe} rank={me?.rank || 1} isMe />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="truncate text-lg font-black text-[#f5efe7]">{myPlayer.name}</p>
                                        <LevelBadge level={myPlayer.level} />
                                    </div>
                                    <p className="mt-1 text-sm font-medium text-white/50">Your current arena position</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-black text-[#dfe9bf]">#{me?.rank || 1}</p>
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/40">{myPoints} XP</p>
                                </div>
                            </div>
                            <XPBar value={myPoints} max={maxPoints} className="mt-4" />
                        </div>
                    </section>

                    <section className="min-h-0 rounded-[30px] border border-white/10 bg-[rgba(18,20,24,0.62)] p-4 shadow-[0_20px_55px_rgba(0,0,0,0.22)] backdrop-blur-xl md:p-5">
                        <div className="mb-4 flex items-center justify-between gap-4 px-1">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">Global ranking</p>
                                <h2 className="mt-1 text-xl font-black text-[#eef2d7]">Fitness heroes</h2>
                            </div>
                            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-white/55 sm:flex">
                                <FiTrendingUp className="text-[#c1cf98]" />
                                Season climb
                            </div>
                        </div>

                        <div className="custom-scrollbar flex max-h-[62vh] flex-col gap-3 overflow-y-auto pr-1 md:max-h-[calc(100vh-13rem)] md:pr-2">
                            {restPlayers.map((player) => (
                                <PlayerCard
                                    key={`${player.id}-${player.name}`}
                                    player={player}
                                    avatar={player.isMe ? avatarMe : avatars[player.id]}
                                    maxPoints={maxPoints}
                                />
                            ))}
                        </div>
                    </section>
                </main>
            </div>

            <style>{`
                @keyframes xpPulse {
                    0%, 100% { opacity: .72; transform: translateX(-18%); }
                    50% { opacity: 1; transform: translateX(18%); }
                }

                @keyframes rankFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                @keyframes enterRank {
                    from { opacity: 0; transform: translateY(12px) scale(.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                .rank-card {
                    animation: enterRank .45s ease both;
                }

                .podium-float {
                    animation: rankFloat 3.6s ease-in-out infinite;
                }

                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.04); border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(193, 207, 152, 0.28); border-radius: 20px; }
                .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(193, 207, 152, 0.28) rgba(255, 255, 255, 0.04); }
            `}</style>
        </Background>
    );
};

const PodiumPlayer = ({ player, place, avatar, height, tone }) => {
    if (!player) return null;

    const toneClass = {
        gold: 'border-[#f7d77a]/45 bg-[#f7d77a]/14 text-[#f7d77a] shadow-[0_0_42px_rgba(247,215,122,0.18)]',
        silver: 'border-white/25 bg-white/10 text-white/80',
        bronze: 'border-[#d89a62]/35 bg-[#d89a62]/12 text-[#e7b17b]'
    }[tone];

    return (
        <div className={`podium-float group flex min-w-0 flex-col items-center ${place === '1' ? 'z-10' : ''}`}>
            <div className={`relative mb-3 rounded-full border p-1.5 transition-all duration-300 group-hover:-translate-y-1 ${toneClass}`}>
                <img src={avatar} alt={player.name} className="h-14 w-14 rounded-full object-contain sm:h-16 sm:w-16 md:h-20 md:w-20" />
                <div className="absolute -right-1 -top-1 rounded-full border border-black/30 bg-[#161913] p-1 text-[#c1cf98]">
                    <FiAward size={14} />
                </div>
            </div>
            <p className="w-full truncate text-center text-sm font-black text-[#f5efe7] md:text-base">{player.name}</p>
            <p className="mb-2 text-xs font-bold text-white/45">Lv {player.level} - {player.points} XP</p>
            <div className={`flex w-full items-end justify-center rounded-t-[24px] border px-3 pb-4 pt-5 ${height} ${toneClass}`}>
                <span className="text-4xl font-black md:text-5xl">#{place}</span>
            </div>
        </div>
    );
};

const PlayerCard = ({ player, avatar, maxPoints }) => (
    <div
        className={`rank-card group rounded-[24px] border p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07] ${
            player.isMe
                ? 'border-[#c1cf98]/35 bg-[#c1cf98]/10 shadow-[0_0_32px_rgba(193,207,152,0.12)]'
                : 'border-white/10 bg-white/[0.04]'
        }`}
        style={{ animationDelay: `${Math.min(player.rank, 12) * 35}ms` }}
    >
        <div className="flex items-center gap-3">
            <div className="w-10 text-center text-lg font-black text-[#c1cf98]/80">#{player.rank}</div>
            <Avatar image={avatar} rank={player.rank} isMe={player.isMe} />
            <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-base font-black text-[#f5efe7]">{player.isMe ? 'You' : player.name}</p>
                    <LevelBadge level={player.level} />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-bold text-white/45">
                    <span className="inline-flex items-center gap-1"><FiShield className="text-[#c1cf98]" />{player.badge}</span>
                    <span className="inline-flex items-center gap-1"><FiZap className="text-[#dfe9bf]" />{player.streak}d streak</span>
                    <span className="inline-flex items-center gap-1 text-[#c1cf98]"><FiChevronUp />{player.trend}</span>
                </div>
            </div>
            <div className="hidden text-right sm:block">
                <p className="text-xl font-black text-[#dfe9bf]">{player.points}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">XP</p>
            </div>
        </div>
        <XPBar value={player.points} max={maxPoints} className="mt-3" />
    </div>
);

const Avatar = ({ image, rank, isMe }) => (
    <div className={`relative shrink-0 rounded-2xl border p-1 ${isMe ? 'border-[#c1cf98]/45 bg-[#c1cf98]/12' : 'border-white/10 bg-white/[0.04]'}`}>
        <img src={image} alt="" className="h-12 w-12 rounded-xl object-contain" />
        <span className="absolute -bottom-1 -right-1 rounded-full border border-black/40 bg-[#161913] px-1.5 py-0.5 text-[10px] font-black text-[#c1cf98]">
            {rank}
        </span>
    </div>
);

const LevelBadge = ({ level }) => (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#c1cf98]/25 bg-[#c1cf98]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-[#dfe9bf]">
        <FiStar size={10} />
        Lv {level}
    </span>
);

const XPBar = ({ value, max, className = '' }) => {
    const percent = Math.max(6, Math.min(100, Math.round((value / max) * 100)));

    return (
        <div className={`h-2.5 overflow-hidden rounded-full border border-white/10 bg-black/25 ${className}`}>
            <div
                className="relative h-full rounded-full bg-gradient-to-r from-[#8b5cf6] via-[#c1cf98] to-[#f7d77a] transition-all duration-700"
                style={{ width: `${percent}%` }}
            >
                <span className="absolute inset-y-0 left-0 w-1/2 bg-white/35 blur-sm" style={{ animation: 'xpPulse 2.2s ease-in-out infinite' }} />
            </div>
        </div>
    );
};

export default Leaderboard;
