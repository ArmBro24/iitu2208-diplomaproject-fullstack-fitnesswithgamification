import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUserPlus, FiX, FiShield } from 'react-icons/fi'; // Добавил иконку для плана
import Background from '../../components/common/Background.jsx';
import useStore from '../../store/useStore';

import avatarImg from '../../assets/avatars/blue_haired.png';
import coachImg from '../../assets/my_coach.png';
import aiChatImg from '../../assets/ai_chat_ill.png';
import myPlanImg from '../../assets/my_plan.png';
import cupImg from '../../assets/cup.png';
import AIChat from '../../components/ai/AIChat.jsx';

const ClientProfile = ({ onNavigateToCoachProfile }) => {

    const {
        userStats,
        coachContract,
        subscription,
        setSelectedTrainer,
        trainers
    } = useStore();

    const [showNoCoachModal, setShowNoCoachModal] = useState(false);
    const [showNoSubModal, setShowNoSubModal] = useState(false);
    const [isAIChatOpen, setIsAIChatOpen] = useState(false);
    const navigate = useNavigate();

    const hasCoach = coachContract && coachContract.trainerId !== null;

    const handleCoachClick = () => {
        // Проверяем наличие тренера И статус оплаты
        if (hasCoach && coachContract.status === 'active') {

            // Ищем в массиве 'trainers', который достали из стора
            const myCoach = trainers?.find(t => String(t.id) === String(coachContract.trainerId));

            if (myCoach) {
                setSelectedTrainer(myCoach);
                if (typeof onNavigateToCoachProfile === 'function') {
                    onNavigateToCoachProfile(myCoach);
                }
                navigate('/trainer-profile');
            } else {
                // Если ID есть, но тренер не найден в списке
                setShowNoCoachModal(true);
            }
        } else {
            // Если тренера нет или статус не 'active'
            setShowNoCoachModal(true);
        }
    };

    // Логика клика по плану (из правок)
    const handlePlanClick = () => {
        if (subscription && subscription.subId) {
            navigate('/subscription-desc');
        } else {
            setShowNoSubModal(true);
        }
    };

    const statsConfig = [
        { label: 'endurance', val: userStats?.endurance || 0 },
        { label: 'consistency', val: userStats?.consistency || 0 },
        { label: 'motivation', val: userStats?.motivation || 0 }
    ];

    return (
        <Background>
            <div className="relative min-h-screen text-white font-rubik flex flex-col overflow-x-hidden">

                {/* --- MODAL: NO COACH (Обновил стиль на полупрозрачный блюр) --- */}
                {showNoCoachModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowNoCoachModal(false)} />
                        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] max-w-sm w-full shadow-2xl text-center animate-in fade-in zoom-in duration-300">
                            <button onClick={() => setShowNoCoachModal(false)} className="absolute top-4 right-4 text-white/20 hover:text-white">
                                <FiX size={20} />
                            </button>
                            <div className="w-16 h-16 bg-[#c1cf98]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiUserPlus className="text-[#c1cf98]" size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No Mentor Yet</h3>
                            <p className="text-white/40 text-sm mb-8">
                                You haven't selected a personal coach. Ready to start your transformation with a professional?
                            </p>
                            <div className="flex flex-col gap-3">
                                <button onClick={() => navigate('/trainers')} className="w-full py-4 bg-[#c1cf98] text-black font-bold rounded-2xl hover:bg-[#d4dfb2] transition-all shadow-lg shadow-[#c1cf98]/20">
                                    Find a Coach
                                </button>
                                <button onClick={() => setShowNoCoachModal(false)} className="w-full py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/5">
                                    Maybe later
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- MODAL: NO SUBSCRIPTION (из правок) --- */}
                {showNoSubModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        {/* Затемнение заднего фона */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowNoSubModal(false)} />

                        {/* Сама модалка */}
                        <div
                            className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] max-w-sm w-full shadow-2xl text-center animate-in fade-in zoom-in duration-300">
                            <button onClick={() => setShowNoSubModal(false)}
                                    className="absolute top-4 right-4 text-white/20 hover:text-white">
                                <FiX size={20}/>
                            </button>

                            <div
                                className="w-16 h-16 bg-[#c1cf98]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiShield className="text-[#c1cf98]" size={32}/>
                            </div>

                            <h3 className="text-xl font-bold mb-2">No Active Plan</h3>
                            <p className="text-white/40 text-sm mb-8">Purchase a subscription to unlock your hero's full
                                potential.</p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => navigate('/subscription')}
                                    className="w-full py-4 bg-[#c1cf98] text-black font-bold rounded-2xl hover:bg-[#d4dfb2] transition-all shadow-lg shadow-[#c1cf98]/20"
                                >
                                    View Plans
                                </button>

                                <button
                                    onClick={() => setShowNoSubModal(false)}
                                    className="w-full py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/5"
                                >
                                    Later
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MAIN GRID */}
                <div className="relative z-10 grid w-full flex-grow
                    grid-cols-[1.2fr_1fr]
                    [grid-template-areas:'header_header''avatar_right-panel''bottom_bottom']
                    gap-y-0
                    md:grid-cols-[0.8fr_1fr_1fr_0.8fr]
                    md:grid-rows-[auto_1fr_auto]
                    md:[grid-template-areas:'back_nick_nick_empty''coach_avatar_text_stats''challenges_ai_ai_plan']
                    md:gap-x-8
                    md:gap-y-3"
                >

                    {/* --- HEADER (Back Button) --- */}
                    <div className="[grid-area:header] md:[grid-area:back] px-6 py-2 h-[60px] md:h-auto md:px-10 md:pt-6 md:pb-2 flex items-center z-20">
                        <button
                            onClick={() => navigate('/home')}
                            className="p-0 md:p-3 bg-transparent md:bg-white/5 hover:bg-white/10 rounded-2xl transition-all active:scale-90"
                        >
                            <FiArrowLeft size={28} className="text-[#c1cf98]"/>
                        </button>
                    </div>

                    {/* Nickname */}
                    <div className="absolute md:static top-0 left-0 w-full h-[60px] md:h-auto md:[grid-area:nick] flex items-center justify-center pointer-events-none md:pointer-events-auto z-10 md:pt-6 md:pb-2">
                        <h1 className="text-[#c1cf98] md:text-white/90 text-2xl md:text-4xl font-black md:font-medium md:capitalize tracking-tight text-center">
                            <span className="hidden md:inline text-white/30 font-light mr-3">Personal Profile:</span>
                            {userStats?.nickname || 'Nickname'}
                        </h1>
                    </div>

                    <div className="hidden md:block [grid-area:empty]" />

                    {/* MOBILE STATS */}
                    <div className="[grid-area:right-panel] md:hidden flex flex-col justify-between py-6 items-end">
                        <div className="text-right pr-4 pb-2">
                            <span className="text-5xl font-black text-[#c1cf98] leading-none">
                                {userStats?.points || 0}
                            </span>
                            <p className="text-[#c1cf98]/60 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">points earned</p>
                        </div>
                        {statsConfig.map((stat) => (
                            <div key={stat.label} className="bg-[#4a3736]/40 backdrop-blur-md rounded-l-2xl pl-4 pr-2 py-3 flex justify-between items-center border border-white/5 w-[90%]">
                                <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest mr-2">{stat.label}</span>
                                <span className="text-[#c1cf98] font-black text-xl">{stat.val}</span>
                            </div>
                        ))}
                    </div>

                    {/* AVATAR */}
                    <div className="[grid-area:avatar] flex items-center justify-center p-4">
                        <img src={avatarImg} alt="Avatar" className="w-full max-h-[320px] md:max-h-[500px] object-contain drop-shadow-2xl" />
                    </div>

                    {/* DESKTOP STATS */}
                    <div className="hidden md:flex [grid-area:stats] flex-col justify-center w-full items-end pr-0">
                        <div className="flex items-center gap-3 mb-8 w-full max-w-[280px] justify-start pl-4">
                            <span className="text-6xl font-black text-[#c1cf98] leading-none">
                                {userStats?.points || 0}
                            </span>
                            <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] leading-tight">points <br /> earned</p>
                        </div>
                        <div className="flex flex-col gap-5 w-full items-end">
                            {statsConfig.map((stat) => (
                                <div key={stat.label} className="bg-white/5 backdrop-blur-md rounded-l-2xl rounded-r-none px-6 py-4 flex justify-between items-center border-y border-l border-white/10 w-full max-w-[280px]">
                                    <span className="text-white/50 text-sm font-bold uppercase tracking-widest">{stat.label}</span>
                                    <span className="text-[#c1cf98] font-black text-2xl">{stat.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TEXT (DESKTOP) */}
                    <div className="hidden md:flex [grid-area:text] items-center px-4">
                        <div className="max-w-[350px]">
                            <p className="text-base lg:text-lg text-[#c1cf98] font-medium leading-snug">
                                Your profile has reached <span className="text-white font-black italic">Level {userStats?.level || 1}</span>.
                                This achievement unlocks new high-intensity training modules specifically designed for your current stats.
                                Keep following the plan to reach the top tier.
                            </p>
                        </div>
                    </div>

                    {/* --- LOWER SECTION --- */}
                    <div className="[grid-area:bottom] md:contents flex w-full gap-x-4 px-0 pb-8">
                        <div className="w-[50%] md:contents flex flex-col gap-y-6 md:gap-y-3">
                            {/* MY COACH */}
                            <button
                                onClick={handleCoachClick}
                                className="md:[grid-area:coach] -ml-4 md:ml-0 md:mt-0 overflow-hidden
                                rounded-r-[40px] border-2 border-transparent hover:border-[#c1cf98] active:border-[#c1cf98]
                                shadow-2xl h-full min-h-[400px] relative transition-all duration-300"
                            >
                                <img src={coachImg} alt="Coach" className="w-full h-full object-cover object-top" />
                            </button>

                            {/* CHALLENGES */}
                            <div className="md:[grid-area:challenges] flex items-end justify-start md:pb-10">
                                <button
                                    onClick={() => navigate('/challenges')} // Добавили переход
                                    className="w-full md:w-[90%] h-[60px] md:h-auto py-4 md:min-h-[170px] flex flex-row md:flex-col items-center justify-center gap-3
        bg-[#4087a1]/30 md:bg-teal-900/20 backdrop-blur-md text-white
        border-2 border-transparent border-y-teal-400/20 border-r-teal-400/20
        hover:border-[#c1cf98] active:border-[#c1cf98]
        rounded-r-[30px] md:rounded-r-[40px] text-sm md:text-sm font-bold uppercase tracking-widest transition-all duration-300 group"
                                >
                                    <img
                                        src={cupImg}
                                        alt="Cup"
                                        className="hidden md:block w-16 h-auto animate-bounce-slow group-hover:scale-110 transition-transform"
                                    />
                                    <span>Challenges</span>
                                </button>
                            </div>
                        </div>

                        <div className="w-[50%] md:contents flex flex-col gap-y-6 justify-start">
                            {/* AI CHAT */}
                            <div className="md:[grid-area:ai] flex items-end justify-center md:pb-10">
                                <button
                                    type="button"
                                    onClick={() => setIsAIChatOpen(true)}
                                    className="w-full md:w-[70%] py-4 md:py-8 md:min-h-[200px] flex flex-row md:flex-col items-center justify-center gap-3
                                    bg-[#4087a1]/30 md:bg-white/5 backdrop-blur-md border-2 border-transparent md:border-white/10
                                    hover:border-[#c1cf98] active:border-[#c1cf98]
                                    rounded-l-[30px] rounded-r-none md:rounded-r-[40px] md:rounded-l-[40px] transition-all duration-300 px-4"
                                >
                                    <div className="hidden md:flex flex-col items-start w-full gap-2 text-left px-4">
                                        <span className="text-white text-sm font-bold uppercase tracking-widest mb-1">Ai Chat</span>
                                        <div className="flex items-center gap-6 w-full">
                                            <div className="flex-grow">
                                                <p className="text-white/70 text-[13px] leading-relaxed normal-case font-normal tracking-tight">
                                                    Our fitness AI chat is here to help you with your daily workout sessions.
                                                </p>
                                            </div>
                                            <div className="w-24 flex-shrink-0 animate-bounce-slow">
                                                <img src={aiChatImg} alt="AI" className="w-full h-auto" />
                                            </div>
                                        </div>
                                    </div>
                                    <span className="md:hidden text-white text-sm font-bold uppercase tracking-[0.2em]">Ai Chat</span>
                                </button>
                            </div>

                            {/* MY PLAN (Обновленная логика клика) */}
                            <div className="flex flex-col gap-y-4 md:gap-y-0">
                                <button
                                    onClick={handlePlanClick}
                                    className="md:[grid-area:plan] -mr-4 md:mr-0 relative overflow-hidden h-32 md:h-[200px]
                                    rounded-l-[40px] border-2 border-transparent hover:border-[#c1cf98] active:border-[#c1cf98]
                                    shadow-2xl md:self-end transition-all duration-300 w-full p-0"
                                >
                                    <img src={myPlanImg} alt="Plan" className="w-full h-full object-cover object-top" />
                                </button>
                                {/* MOBILE TEXT */}
                                <div className="md:hidden pr-4 mt-4">
                                    <p className="text-sm text-[#c1cf98] font-medium leading-tight">
                                        Level {userStats?.level || 1} reached. Every rep counts towards your ultimate physical transformation!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isAIChatOpen && (
                    <AIChat onClose={() => setIsAIChatOpen(false)} />
                )}
            </div>

            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
            `}</style>
        </Background>
    );
};

export default ClientProfile;
