import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiX, FiInfo, FiAlertTriangle, FiCheckCircle, FiRotateCcw } from 'react-icons/fi';
import challengeBg from '../../assets/challenge.png'; // Возвращаем ваш фон
import Background from '../../components/common/Background.jsx';
import useStore from '../../store/useStore';

const Challenges = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('available');
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [modalType, setModalType] = useState(null); // 'accept', 'giveup', 'details', 'retry'

    const { challenges, acceptChallenge, failChallenge, completeChallenge, retryChallenge } = useStore();
    const filteredChallenges = challenges.filter(ch => ch.status === activeTab);

    const getStatusColor = (status) => {
        if (status === 'completed') return 'text-[#c3d68b]';
        if (status === 'active') return 'text-[#fef08a]';
        return 'text-white/60';
    };

    const handleAction = (id) => {
        if (modalType === 'accept') {
            acceptChallenge(id);
            setActiveTab('active');
        } else if (modalType === 'giveup') {
            failChallenge(id);
            setActiveTab('completed');
        } else if (modalType === 'retry') {
            retryChallenge(id);
            setActiveTab('active');
        }
        setSelectedChallenge(null);
        setModalType(null);
    };

    return (
        <Background>
            <div
                className="relative min-h-screen text-white font-rubik flex flex-col bg-cover bg-center bg-no-repeat overflow-hidden"
                style={{ backgroundImage: `url(${challengeBg})` }}
            >
            {/* Оригинальный Overlay с блюром */}
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
                        <span className={`text-lg md:text-xl font-medium lowercase ${getStatusColor(activeTab)}`}>
                            {activeTab}
                        </span>
                        <h1 className="text-xl md:text-3xl font-medium text-white">Challenges</h1>
                    </div>
                </nav>

                {/* TABS */}
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

                {/* CHALLENGES LIST (Старый стиль расположения карточек) */}
                <div className="flex-grow flex items-start justify-center p-6 md:p-12">
                    <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-6 w-full max-w-7xl overflow-visible">
                        {filteredChallenges.length > 0 ? (
                            filteredChallenges.map((challenge) => (
                                <div
                                    key={challenge.id}
                                    className={`
                                        group relative w-full md:w-[320px] 
                                        min-h-[160px] md:min-h-[420px]
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
                                        <div className="text-[#c1cf98]">
                                            {challenge.result === 'success' && <FiCheckCircle size={32} />}
                                            {challenge.result === 'fail' && <FiAlertTriangle size={32} className="text-red-500" />}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mt-4">
                                        <p className="text-sm md:text-base font-medium text-white/80 leading-relaxed">
                                            {challenge.desc}
                                        </p>
                                    </div>

                                    {/* Кнопки действий */}
                                    <div className="mt-6 flex flex-col gap-2 relative z-20">
                                        {activeTab === 'available' && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedChallenge(challenge); setModalType('accept'); }}
                                                className="w-full py-3 bg-[#c1cf98] text-black text-xs font-black uppercase tracking-tighter rounded-2xl hover:bg-white transition-all"
                                            >
                                                Accept Challenge
                                            </button>
                                        )}
                                        {activeTab === 'active' && (
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedChallenge(challenge); setModalType('giveup'); }}
                                                    className="w-full py-3 bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-black uppercase rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    Give Up
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); completeChallenge(challenge.id); }}
                                                    className="w-full py-2 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    [SIMULATE SUCCESS]
                                                </button>
                                            </>
                                        )}
                                        {activeTab === 'completed' && challenge.result === 'fail' && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedChallenge(challenge); setModalType('retry'); }}
                                                className="w-full py-3 bg-white/10 text-white text-xs font-black uppercase rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                                            >
                                                <FiRotateCcw size={14}/> Try Again
                                            </button>
                                        )}
                                    </div>

                                    {/* Decorative Element */}
                                    <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-white/5 rounded-full blur-3xl group-hover:bg-[#c1cf98]/20 transition-all" />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 opacity-40 italic">
                                <p className="text-xl">No challenges in this category yet...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL (Ваш стиль) */}
            {selectedChallenge && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedChallenge(null)} />
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] max-w-sm w-full shadow-2xl text-center animate-in fade-in zoom-in duration-300">
                        <button onClick={() => setSelectedChallenge(null)} className="absolute top-4 right-4 text-white/20 hover:text-white">
                            <FiX size={20} />
                        </button>

                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${modalType === 'giveup' ? 'bg-red-500/10' : 'bg-[#c1cf98]/10'}`}>
                            {modalType === 'giveup' ? <FiAlertTriangle className="text-red-500" size={32} /> : <FiInfo className="text-[#c1cf98]" size={32} />}
                        </div>

                        <h3 className="text-xl font-bold mb-4">
                            {modalType === 'accept' && "Accept Challenge?"}
                            {modalType === 'giveup' && "Are you sure?"}
                            {modalType === 'retry' && "Restart Challenge?"}
                        </h3>

                        <div className="bg-white/5 rounded-3xl p-4 mb-6 space-y-2 text-sm">
                            <div className="flex justify-between"><span className="opacity-40">Ends:</span> <span>{selectedChallenge.endDate}</span></div>
                            <div className="flex justify-between"><span className="opacity-40">Reward:</span> <span className="text-[#c1cf98] font-bold">{selectedChallenge.points} pts</span></div>
                            <div className="flex justify-between"><span className="opacity-40">Penalty:</span> <span className="text-red-400">-{Math.floor(selectedChallenge.points * 0.2)} pts</span></div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleAction(selectedChallenge.id)}
                                className={`w-full py-4 font-bold rounded-2xl transition-all shadow-lg ${modalType === 'giveup' ? 'bg-red-500 shadow-red-500/20' : 'bg-[#c1cf98] text-black shadow-[#c1cf98]/20'}`}
                            >
                                Confirm
                            </button>
                            <button onClick={() => setSelectedChallenge(null)} className="w-full py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </Background>
    );
};

export default Challenges;
