import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAward, FiCalendar, FiMenu, FiMessageCircle, FiTrendingUp, FiUser, FiX, FiLogOut, FiZap } from 'react-icons/fi';
import Calendar from '../../components/client/Calendar.jsx';
import Background from '../../components/common/Background.jsx';
import AIChat from '../../components/ai/AIChat.jsx';
import aiChatImg from '../../assets/ai_chat_ill.png';
import plansImg from '../../assets/plans.png';
import coachesImg from '../../assets/coaches.png';
import homeImg from '../../assets/home.png';
import useStore from '../../store/useStore';
import { setActiveRole } from '../../utils/roleRouting.js';

const ClientHome = () => {
    const fetchSessions = useStore((state) => state.fetchSessions);
    const challenges = useStore((state) => state.challenges);
    const userStats = useStore((state) => state.userStats);
    const userId = useStore((state) => state.currentUser.id);
    const sessions = useStore((state) => state.sessions);
    useEffect(() => {
        setActiveRole('member');
    }, []);

    useEffect(() => {
        if (userId) {
            fetchSessions(userId);
        }
    }, [userId]);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAIChatOpen, setIsAIChatOpen] = useState(false);
    const navigate = useNavigate();

    const setSelectedTraining = useStore((state) => state.setSelectedTraining);
    const upcomingCount = sessions.filter((session) => ['REQUESTED', 'CONFIRMED'].includes(String(session.status).toUpperCase())).length;
    const activeQuestCount = challenges.filter((challenge) => challenge.status === 'active').length;
    const streakDays = Math.max(3, Math.min(30, Math.round((userStats?.consistency || 70) / 8)));
    const rank = Math.max(1, 64 - (userStats?.level || 1) - activeQuestCount);

    return (
        <Background>
            <div className="relative flex min-h-screen flex-col overflow-x-hidden text-white font-rubik">

                {/* Модальное окно профиля */}
                {isProfileOpen && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6 backdrop-blur-md transition-all"
                        onClick={() => setIsProfileOpen(false)}
                    >
                        <div
                            className="relative w-full max-w-sm rounded-[28px] border border-white/10 bg-[rgba(18,20,24,0.92)] p-7 shadow-[0_20px_55px_rgba(0,0,0,0.38)] backdrop-blur-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsProfileOpen(false)}
                                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                            >
                                <FiX size={24} />
                            </button>

                            <div className="flex flex-col items-center gap-4">
                                <h2 className="text-2xl font-black tracking-tight mb-4 text-white">Client Name</h2>
                                <div className="w-full flex flex-col gap-3">
                                    <button
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            navigate('/profile');
                                        }}
                                        className="group relative flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 font-medium text-white transition-all hover:border-[#c1cf98]/45 hover:bg-white/[0.08]"
                                    >
                                        <FiUser className="absolute left-6 text-[#c1cf98]" size={20}/>
                                        <span className="text-white">Profile</span>
                                    </button>

                                    <button
                                        onClick={() => navigate('/login')}
                                        className="group relative flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 font-medium text-white transition-all hover:border-red-400/40 hover:bg-red-400/10"
                                    >
                                        <FiLogOut className="absolute left-6 text-red-400/60" size={20}/>
                                        <span className="text-white">Exit</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Основная сетка */}
                <div className="relative z-10 grid w-full flex-grow
                    grid-cols-[0.8fr_1.2fr]
                    gap-x-4 gap-y-4 pb-8
                    [grid-template-areas:'header_header''decor_decor''toptext_toptext''coaches_content''ai_ai''calendar_calendar']
                    md:gap-x-0 md:gap-y-5
                    md:grid-cols-[minmax(280px,_0.7fr)_1.6fr_min-content]
                    md:[grid-template-rows:auto_min-content_min-content_min-content_1fr]
                    md:[grid-template-areas:'header_header_header''text1_text1_plans''coaches_text2_text2''coaches_ai_ai''coaches_calendar_calendar']"
                >

                    {/* Хедер */}
                    <nav className="[grid-area:header] flex items-center justify-between px-6 py-5 md:px-10 md:py-7">
                        <button
                            onClick={() => navigate('/menu')}
                            className="rounded-xl border border-white/10 bg-white/5 p-2 text-2xl transition-all hover:scale-105 hover:bg-white/10 active:scale-95 md:rounded-2xl md:p-3 md:text-3xl"
                        >
                            <FiMenu className="text-[#c1cf98]"/>
                        </button>

                        <h1 className="text-[#c1cf98] text-3xl md:text-5xl font-rubik font-black tracking-tight">HeroFit</h1>

                        <button
                            onClick={() => setIsProfileOpen(true)}
                            className="rounded-xl border border-white/10 bg-white/5 p-2 text-2xl transition-all hover:scale-105 hover:bg-white/10 active:scale-95 md:rounded-2xl md:p-3 md:text-3xl"
                        >
                            <FiUser className="text-[#c1cf98]"/>
                        </button>
                    </nav>

                    {/* Декор (только мобилка) */}
                    <div className="[grid-area:decor] block md:hidden">
                        <div className="group h-64 w-[88%] overflow-hidden rounded-br-[80px] rounded-tr-[80px] border border-white/10 bg-black/20 shadow-[0_18px_45px_rgba(0,0,0,0.25)]">
                            <img src={homeImg} alt="Home" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                        </div>
                    </div>

                    {/* Верхний текст (только мобилка) */}
                    <div className="[grid-area:toptext] block px-6 py-1 md:hidden">
                        <p className="text-[18px] font-black leading-tight text-[#eef2d7]">
                            Your training hub.
                        </p>
                        <CompactStats
                            activeQuestCount={activeQuestCount}
                            rank={rank}
                            streakDays={streakDays}
                            upcomingCount={upcomingCount}
                        />
                    </div>

                    {/* Секция Тренеров (Левая колонка) */}
                    <div className="[grid-area:coaches] flex min-h-0 flex-col items-stretch md:items-start md:pr-6">
                        {/* Картинка остается прижатой влево (без отступа) */}
                        <div
                            onClick={() => navigate('/trainers')}
                            className="group relative h-full w-full cursor-pointer overflow-hidden rounded-br-[64px] rounded-tr-[64px] border border-white/10 bg-black/20 shadow-[0_18px_45px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-1 hover:border-[#c1cf98]/60 hover:shadow-[0_24px_55px_rgba(0,0,0,0.3)] active:border-[#c1cf98] md:h-fit md:max-w-[340px] md:rounded-br-[92px] md:rounded-tr-[92px]"
                        >
                            <img
                                src={coachesImg}
                                alt="Coaches"
                                className="block h-auto w-full transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-5 left-5 right-7">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c1cf98]/85">Trainer link</p>
                                <p className="mt-1 text-lg font-black leading-tight text-white">Find your mentor</p>
                            </div>
                        </div>

                        {/* Новое предложение под картинкой: отступ только здесь */}
                        <div className="mt-5 hidden rounded-[22px] border border-white/10 bg-[rgba(18,20,24,0.62)] px-5 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.14)] backdrop-blur-md md:ml-10 md:block">
                            <p className="text-sm font-bold uppercase tracking-[0.14em] text-white/40">Trainer</p>
                            <p className="mt-1 text-base font-black leading-tight text-[#eef2d7] lg:text-lg">
                                Find your mentor
                            </p>
                        </div>
                    </div>

                    {/* Контентная область (Правая колонка) */}
                    <div className="md:contents [grid-area:content] flex flex-col h-full">

                        {/* Блок с текстом: на мобилке h-full + justify-between разносит предложения, на десктопе возвращаем стандарт */}
                        <div className="flex h-full flex-col justify-between px-2 py-2 md:[grid-area:text1] md:ml-8 md:mr-12 md:h-auto md:block md:rounded-[26px] md:border md:border-white/10 md:bg-[rgba(18,20,24,0.72)] md:p-5 md:shadow-[0_10px_26px_rgba(0,0,0,0.14)] md:backdrop-blur-md">

                            {/* Это предложение на мобилке сверху, на десктопе просто первый абзац */}
                            <div className="block">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c1cf98]/75">
                                    Client dashboard
                                </p>
                                <p className="mt-1 max-w-[95%] text-[18px] font-black leading-tight text-[#eef2d7] md:max-w-none md:text-xl lg:text-[24px]">
                                    Training hub
                                </p>
                            </div>

                            <div className="hidden md:block">
                                <CompactStats
                                    activeQuestCount={activeQuestCount}
                                    rank={rank}
                                    streakDays={streakDays}
                                    upcomingCount={upcomingCount}
                                />
                            </div>

                            {/* Эти абзацы видны только на десктопе, как и было в оригинале */}
                            {/* Это предложение на мобилке прилипнет к низу контейнера, на десктопе оно скрыто (так как уже есть в тексте выше) */}
                            <div className="block md:hidden">
                                <p className="max-w-[95%] text-[16px] font-medium leading-tight text-[#c1cf98]">
                                    Sessions, quests, and progress in one place.
                                </p>
                            </div>
                        </div>

                        {/* Планы - без изменений */}
                        <div className="mt-auto flex items-stretch justify-end md:[grid-area:plans] md:mt-0 md:min-h-0 md:pb-6">
                            <div
                                onClick={() => navigate('/subscription')}
                                className="group relative h-36 w-full cursor-pointer overflow-hidden rounded-l-[46px] border border-white/10 bg-black/20 shadow-[0_18px_45px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-1 hover:border-[#c1cf98]/60 active:border-[#c1cf98] md:h-60 md:w-[400px] md:rounded-l-[86px] md:rounded-r-none lg:h-64"
                            >
                                <img src={plansImg} alt="Plans"
                                     className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/10 to-transparent" />
                                <div className="absolute bottom-5 left-8">
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c1cf98]/85">Membership</p>
                                    <p className="mt-1 text-lg font-black text-white">Upgrade plan</p>
                                </div>
                            </div>
                        </div>

                        {/* Текст (только десктоп) - без изменений */}
                        <div className="hidden rounded-[26px] border border-white/10 bg-[rgba(18,20,24,0.64)] px-5 py-4 shadow-[0_10px_26px_rgba(0,0,0,0.14)] backdrop-blur-md md:ml-8 md:mr-10 md:flex md:min-h-0 md:items-center md:justify-between md:gap-4 md:[grid-area:text2]">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">Next step</p>
                                <p className="mt-1 text-base font-black text-[#eef2d7]">Check your upcoming sessions</p>
                            </div>
                            <button
                                onClick={() => navigate('/challenges')}
                                className="rounded-2xl border border-[#c1cf98]/25 bg-[#c1cf98]/10 px-4 py-2 text-sm font-bold text-[#dfe9bf] transition-all hover:-translate-y-0.5 hover:border-[#c1cf98]/45 hover:bg-[#c1cf98]/15"
                            >
                                Challenges
                            </button>
                        </div>
                    </div>

                    {/* Календарь */}
                    <button
                        type="button"
                        onClick={() => setIsAIChatOpen(true)}
                        className="ai-assistant-card mx-4 flex items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-white/[0.05] p-5 text-left shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all hover:-translate-y-1 hover:border-[#c1cf98]/45 hover:bg-white/[0.08] active:scale-[0.99] [grid-area:ai] md:mx-0 md:ml-8 md:mr-10 md:px-6"
                    >
                        <div className="flex min-w-0 items-center gap-4">
                            <div className="ai-assistant-visual hidden h-20 w-20 shrink-0 items-center justify-center rounded-[24px] bg-[#4087a1]/20 md:flex">
                                <img src={aiChatImg} alt="AI Chat" className="h-16 w-16 object-contain" />
                            </div>

                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <FiMessageCircle className="text-[#c1cf98]" size={18} />
                                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/45">Ai Chat</p>
                                </div>
                                <h3 className="mt-2 font-rubik text-[1.35rem] font-bold text-[#f5efe7] md:text-[1.55rem]">
                                    Personal coach
                                </h3>
                                <p className="mt-1 max-w-[620px] text-sm leading-relaxed text-white/55">
                                    Ask what to train today based on your profile, sessions, progress, and HeroFit points.
                                </p>
                            </div>
                        </div>

                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c1cf98]/30 bg-[#c1cf98]/10 text-[#eaf2cf]">
                            <FiTrendingUp size={18} />
                        </span>
                    </button>

                    <div className="mt-2 flex items-end md:mt-0 md:min-h-0 [grid-area:calendar]">
                        <div className="w-[90%] overflow-hidden rounded-tr-[34px] border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.25)] md:w-full md:rounded-tl-[56px]">
                            <Calendar
                                isEdge={true}
                                trainings={sessions}
                                onDateClick={(trainingData) => {
                                    setSelectedTraining(trainingData);
                                    navigate('/training');
                                }}
                            />
                        </div>
                    </div>
                </div>

                {isAIChatOpen && (
                    <AIChat onClose={() => setIsAIChatOpen(false)} />
                )}
            </div>
        </Background>
    );
};

const CompactStats = ({ activeQuestCount, rank, streakDays, upcomingCount }) => (
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <ClientStat icon={FiCalendar} label="Upcoming" value={upcomingCount} />
        <ClientStat icon={FiZap} label="Streak" value={`${streakDays}d`} />
        <ClientStat icon={FiAward} label="Quests" value={activeQuestCount} />
        <ClientStat icon={FiTrendingUp} label="Rank" value={`#${rank}`} />
    </div>
);

const ClientStat = ({ icon: Icon, label, value }) => (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#c1cf98]/30 hover:bg-white/[0.08]">
        <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-white/40">{label}</p>
            <Icon className="shrink-0 text-[#c1cf98]" size={15} />
        </div>
        <p className="mt-2 text-lg font-black text-[#f5efe7]">{value}</p>
    </div>
);

export default ClientHome;
