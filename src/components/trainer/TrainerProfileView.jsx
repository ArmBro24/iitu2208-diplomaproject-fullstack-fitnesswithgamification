import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLogOut, FiSettings, FiUser } from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';
import avatarMe from '../../assets/avatars/avatar-me.png';
import { trainer } from './trainerData.js';

const TrainerProfileView = ({ onBack, onLogout }) => {
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
                    md:[grid-template-areas:'back_nick_nick_exit''avatar_avatar_text_stats''actions_actions_actions_actions']
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

                    <div className="absolute md:static top-0 left-0 w-full h-[60px] md:h-auto md:[grid-area:nick] flex items-center justify-center pointer-events-none z-10 md:pt-6 md:pb-2">
                        <h1 className="text-[#c1cf98] md:text-white/90 text-2xl md:text-4xl font-black md:font-medium md:capitalize tracking-tight text-center">
                            <span className="hidden md:inline text-white/30 font-light mr-3">Personal Profile:</span>
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
                            <div
                                key={trait.label}
                                className="bg-[#4a3736]/40 backdrop-blur-md rounded-l-2xl pl-4 pr-2 py-3 flex justify-between items-center border border-white/5 w-[90%]"
                            >
                                <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest mr-2">{trait.label}</span>
                                <span className="text-[#c1cf98] font-black text-xl">{trait.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="[grid-area:avatar] flex items-center justify-center p-4">
                        <img
                            src={avatarMe}
                            alt="Coach avatar"
                            className="w-full max-h-[320px] md:max-h-[500px] object-contain drop-shadow-2xl"
                        />
                    </div>

                    <div className="hidden md:flex [grid-area:stats] flex-col justify-center w-full items-end pr-0">
                        <div className="flex items-center gap-3 mb-8 w-full max-w-[280px] justify-start pl-4">
                            <span className="text-6xl font-black text-[#c1cf98] leading-none">{trainer.points}</span>
                            <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] leading-tight">
                                points <br /> earned
                            </p>
                        </div>
                        <div className="flex flex-col gap-5 w-full items-end">
                            {trainer.traits.map((trait) => (
                                <div
                                    key={trait.label}
                                    className="bg-white/5 backdrop-blur-md rounded-l-2xl rounded-r-none px-6 py-4 flex justify-between items-center border-y border-l border-white/10 w-full max-w-[280px]"
                                >
                                    <span className="text-white/50 text-sm font-bold uppercase tracking-widest">{trait.label}</span>
                                    <span className="text-[#c1cf98] font-black text-2xl">{trait.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex [grid-area:text] items-center px-4">
                        <div className="max-w-[350px]">
                            <p className="text-base lg:text-lg text-[#c1cf98] font-medium leading-snug">
                                Keep your trainer identity, personal performance, and account actions in one clean place.
                            </p>
                        </div>
                    </div>

                    <div className="[grid-area:bottom] md:[grid-area:actions] px-4 pb-8 pt-6 md:px-10">
                        <div className="grid gap-4 md:grid-cols-3">
                            <ActionCard
                                icon={FiSettings}
                                title="Settings"
                                body="Manage trainer preferences and account setup."
                                onClick={() => window.alert('Settings screen can be added next.')}
                            />

                            <ActionCard
                                icon={FiUser}
                                title="Support"
                                body="Open support contacts and shared help information."
                                onClick={() => navigate('/support')}
                            />

                            <ActionCard
                                icon={FiLogOut}
                                title="Logout"
                                body="Sign out from the trainer account."
                                onClick={onLogout}
                                danger
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    );
};

const ActionCard = ({ body, danger = false, icon: Icon, onClick, title }) => (
    <button
        onClick={onClick}
        className={`rounded-[28px] border p-5 text-left transition-all ${
            danger
                ? 'border-red-400/20 bg-red-400/10 hover:bg-red-400/15'
                : 'border-white/10 bg-white/5 hover:bg-white/10'
        }`}
    >
        <Icon className={danger ? 'text-red-300/80' : 'text-[#c1cf98]'} size={22} />
        <h3 className="mt-4 text-[1.2rem] font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
    </button>
);

export default TrainerProfileView;
