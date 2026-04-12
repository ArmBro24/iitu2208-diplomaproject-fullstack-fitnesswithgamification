import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCircle, FiCheckCircle } from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';
import challengeBg from '../../assets/challenge.png';
import useStore from '../../store/useStore';

const Challenges = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('available');

    // Достаем данные из стора
    const challenges = useStore((state) => state.challenges);

    // Фильтруем их по табу
    const filteredChallenges = challenges.filter(ch => ch.status === activeTab);

    return (
        <div
            className="relative min-h-screen text-white font-rubik flex flex-col bg-cover bg-center bg-no-repeat fixed inset-0 overflow-hidden"
            style={{ backgroundImage: `url(${challengeBg})` }}
        >
            {/* Overlay с блюром как в тренировках */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px] z-0" />

            <div className="relative z-10 flex flex-col h-full overflow-y-auto no-scrollbar">

                {/* HEADER */}
                <nav className="relative z-20 px-6 md:px-10 py-6 md:py-8 flex items-center shrink-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-2xl md:text-3xl p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all active:scale-95"
                    >
                        <FiArrowLeft className="text-white"/>
                    </button>

                    <div className="flex-grow flex items-center justify-center gap-3 pr-12">
                        <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter text-white uppercase">
                            HeroFit <span className="font-light not-italic ml-2 opacity-80 uppercase tracking-normal text-xl md:text-2xl">Challenges</span>
                        </h1>
                    </div>
                </nav>

                {/* TABS (available / active / completed) */}
                <div className="flex justify-center px-6 mb-8">
                    <div className="flex bg-black/30 backdrop-blur-xl p-1.5 rounded-full border border-white/10 w-full max-w-md">
                        {['available', 'active', 'completed'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                                    activeTab === tab
                                        ? 'bg-[#c1cf98] text-black shadow-lg shadow-[#c1cf98]/20'
                                        : 'text-white/60 hover:text-white'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CHALLENGES LIST / CAROUSEL */}
                <div className="flex-grow flex items-start justify-center p-6 md:p-12">
                    <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-6 w-full max-w-7xl overflow-visible">
                        {filteredChallenges.length > 0 ? (
                            filteredChallenges.map((challenge) => (
                                <div
                                    key={challenge.id}
                                    className={`
                                        group relative w-full md:w-[320px] 
                                        min-h-[160px] md:min-h-[400px]
                                        rounded-[30px] md:rounded-[45px]
                                        p-6 md:p-8 flex flex-col justify-between
                                        border-2 border-white/10 backdrop-blur-2xl
                                        transition-all duration-500 cursor-pointer
                                        hover:border-[#c1cf98]/50 hover:-translate-y-4
                                        ${challenge.color}
                                    `}
                                >
                                    {/* Content Top */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <h2 className="text-2xl md:text-3xl font-black leading-tight group-hover:text-[#c1cf98] transition-colors">
                                                {challenge.title}
                                            </h2>
                                            <span className="text-[#c1cf98] text-xl md:text-2xl font-black mt-1">
                                                {challenge.points}
                                            </span>
                                        </div>

                                        {/* Status Icon */}
                                        <div className="text-[#c1cf98]">
                                            {activeTab === 'completed' ? (
                                                <FiCheckCircle size={32} />
                                            ) : (
                                                <FiCircle size={32} strokeWidth={3} className="opacity-40" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Bottom (Description) */}
                                    <div className="mt-4 md:mt-0">
                                        <p className="text-sm md:text-base font-medium text-white/80 leading-relaxed md:max-w-[200px]">
                                            {challenge.desc}
                                        </p>
                                    </div>

                                    {/* Decorative Element */}
                                    <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-white/5 rounded-full blur-3xl group-hover:bg-[#c1cf98]/20 transition-all" />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 opacity-40">
                                <p className="text-xl italic">No challenges in this category yet...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Challenges;