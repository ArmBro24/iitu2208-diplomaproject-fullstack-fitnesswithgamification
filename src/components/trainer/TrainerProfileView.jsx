import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLogOut } from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';
import homeImg from '../../assets/home.png';
import avatarMe from '../../assets/avatars/avatar-me.png';
import { trainer } from './trainerData.js';

const TrainerProfileView = ({ onBack, onOpenClients, onOpenSchedule, onLogout }) => {
    const navigate = useNavigate();

    return (
        <Background>
            <div className="relative min-h-screen text-white font-rubik flex flex-col overflow-x-hidden">
                <div
                    className="relative z-10 grid w-full flex-grow
                    grid-cols-[1.2fr_1fr]
                    [grid-template-areas:'header_header''avatar_right-panel''bottom_bottom']
                    gap-y-0
                    md:grid-cols-[0.8fr_1fr_1fr_0.8fr]
                    md:grid-rows-[auto_1fr_auto]
                    md:[grid-template-areas:'back_nick_nick_exit''coach_avatar_text_stats''clients_shared_shared_schedule']
                    md:gap-x-8
                    md:gap-y-3"
                >
                    <div className="[grid-area:header] md:[grid-area:back] px-6 py-2 h-[60px] md:h-auto md:px-10 md:pt-6 md:pb-2 flex items-center z-20">
                        <button
                            onClick={onBack}
                            className="p-0 md:p-3 bg-transparent md:bg-white/5 hover:bg-white/10 rounded-2xl transition-all active:scale-90"
                        >
                            <FiArrowLeft size={28} className="text-[#c1cf98]" />
                        </button>
                    </div>

                    <div className="absolute md:static top-0 left-0 w-full h-[60px] md:h-auto md:[grid-area:nick] flex items-center justify-center pointer-events-none md:pointer-events-auto z-10 md:pt-6 md:pb-2">
                        <h1 className="text-[#c1cf98] md:text-white/90 text-2xl md:text-4xl font-black md:font-medium md:capitalize tracking-tight text-center">
                            <span className="hidden md:inline text-white/30 font-light mr-3">Coach Profile:</span>
                            {trainer.name}
                        </h1>
                    </div>

                    <div className="hidden md:[grid-area:exit] md:flex items-center justify-end px-10 pt-6 pb-2">
                        <button
                            onClick={onLogout}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all active:scale-90"
                        >
                            <FiLogOut size={22} className="text-red-300/80" />
                        </button>
                    </div>

                    <div className="[grid-area:right-panel] md:hidden flex flex-col justify-between py-6 items-end">
                        <div className="text-right pr-4 pb-2">
                            <span className="text-5xl font-black text-[#c1cf98] leading-none">{trainer.points}</span>
                            <p className="text-[#c1cf98]/60 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">points earned</p>
                        </div>
                        {trainer.traits.map((trait) => (
                            <div key={trait.label} className="bg-[#4a3736]/40 backdrop-blur-md rounded-l-2xl pl-4 pr-2 py-3 flex justify-between items-center border border-white/5 w-[90%]">
                                <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest mr-2">{trait.label}</span>
                                <span className="text-[#c1cf98] font-black text-xl">{trait.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="[grid-area:avatar] flex items-center justify-center p-4">
                        <img src={avatarMe} alt="Coach avatar" className="w-full max-h-[320px] md:max-h-[500px] object-contain drop-shadow-2xl" />
                    </div>

                    <div className="hidden md:flex [grid-area:stats] flex-col justify-center w-full items-end pr-0">
                        <div className="flex items-center gap-3 mb-8 w-full max-w-[280px] justify-start pl-4">
                            <span className="text-6xl font-black text-[#c1cf98] leading-none">{trainer.points}</span>
                            <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] leading-tight">points <br /> earned</p>
                        </div>
                        <div className="flex flex-col gap-5 w-full items-end">
                            {trainer.traits.map((trait) => (
                                <div key={trait.label} className="bg-white/5 backdrop-blur-md rounded-l-2xl rounded-r-none px-6 py-4 flex justify-between items-center border-y border-l border-white/10 w-full max-w-[280px]">
                                    <span className="text-white/50 text-sm font-bold uppercase tracking-widest">{trait.label}</span>
                                    <span className="text-[#c1cf98] font-black text-2xl">{trait.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex [grid-area:text] items-center px-4">
                        <div className="max-w-[350px]">
                            <p className="text-base lg:text-lg text-[#c1cf98] font-medium leading-snug">
                                Lead your clients through structured sessions, monitor attendance, and keep your coaching profile consistent with the same HeroFit visual language.
                            </p>
                        </div>
                    </div>

                    <div className="[grid-area:bottom] md:contents flex w-full gap-x-4 px-0 pb-8">
                        <div className="w-[50%] md:contents flex flex-col gap-y-6 md:gap-y-3">
                            <button
                                onClick={onOpenClients}
                                className="md:[grid-area:coach] -ml-4 md:ml-0 md:mt-0 overflow-hidden
                                rounded-r-[40px] border-2 border-transparent hover:border-[#c1cf98] active:border-[#c1cf98]
                                shadow-2xl h-full min-h-[300px] relative transition-all duration-300"
                            >
                                <img src={homeImg} alt="Clients" className="w-full h-full object-cover object-top" />
                                <div className="absolute inset-0 bg-black/30" />
                                <div className="absolute bottom-6 left-6 right-6 text-left">
                                    <span className="text-white text-xl md:text-2xl font-black">My Clients</span>
                                </div>
                            </button>

                            <div className="md:[grid-area:clients] flex items-end justify-start md:pb-10">
                                <button
                                    onClick={onOpenClients}
                                    className="w-full md:w-[90%] h-[60px] md:h-auto py-4 md:min-h-[170px] flex flex-row md:flex-col items-center justify-center gap-3
        bg-[#4087a1]/30 md:bg-teal-900/20 backdrop-blur-md text-white
        border-2 border-transparent border-y-teal-400/20 border-r-teal-400/20
        hover:border-[#c1cf98] active:border-[#c1cf98]
        rounded-r-[30px] md:rounded-r-[40px] text-sm md:text-sm font-bold uppercase tracking-widest transition-all duration-300"
                                >
                                    <span>Client Cards</span>
                                </button>
                            </div>
                        </div>

                        <div className="w-[50%] md:contents flex flex-col gap-y-6 justify-start">
                            <div className="md:[grid-area:shared] flex items-end justify-center md:pb-10">
                                <div className="w-full md:w-[70%] py-4 md:py-8 md:min-h-[200px] flex flex-col items-start justify-center gap-3
                                    bg-[#4087a1]/30 md:bg-white/5 backdrop-blur-md border-2 border-transparent md:border-white/10
                                    hover:border-[#c1cf98] active:border-[#c1cf98]
                                    rounded-l-[30px] rounded-r-none md:rounded-r-[40px] md:rounded-l-[40px] transition-all duration-300 px-5">
                                    <span className="text-white text-sm font-bold uppercase tracking-widest">Shared Pages</span>
                                    <div className="flex flex-wrap gap-2">
                                        <SharedButton label="Leaderboard" onClick={() => navigate('/leaderboard')} />
                                        <SharedButton label="Events" onClick={() => navigate('/events')} />
                                        <SharedButton label="Plans" onClick={() => navigate('/plans')} />
                                        <SharedButton label="Support" onClick={() => navigate('/support')} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-y-4 md:gap-y-0">
                                <button
                                    onClick={onOpenSchedule}
                                    className="md:[grid-area:schedule] -mr-4 md:mr-0 relative overflow-hidden h-32 md:h-[200px]
                                    rounded-l-[40px] border-2 border-transparent hover:border-[#c1cf98] active:border-[#c1cf98]
                                    shadow-2xl md:self-end transition-all duration-300 w-full p-0"
                                >
                                    <div className="w-full h-full bg-[linear-gradient(135deg,rgba(113,67,79,0.55),rgba(58,85,112,0.35))] flex items-center justify-center">
                                        <span className="text-white text-2xl md:text-3xl font-black">Schedule</span>
                                    </div>
                                </button>

                                <div className="md:hidden pr-4 mt-4">
                                    <p className="text-sm text-[#c1cf98] font-medium leading-tight">
                                        Keep your profile close to the client experience, but with faster access to coach tools and shared pages.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    );
};

const SharedButton = ({ label, onClick }) => (
    <button
        onClick={onClick}
        className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all hover:border-[#c1cf98]"
    >
        {label}
    </button>
);

export default TrainerProfileView;
