import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiX, FiInfo, FiAlertTriangle, FiCheckCircle, FiRotateCcw, FiClock } from 'react-icons/fi';
import challengeBg from '../../assets/challenge.png'; // Возвращаем ваш фон
import Background from '../../components/common/Background.jsx';
import useStore from '../../store/useStore';

const tabs = [
    { id: 'available', label: 'Available' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'History' }
];

const Challenges = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('available');
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [modalType, setModalType] = useState(null); // 'accept', 'giveup', 'details', 'retry'
    const [feedback, setFeedback] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { challenges, challengesLoading, fetchChallenges, acceptChallenge, failChallenge, retryChallenge } = useStore();
    const currentUserId = useStore((state) => state.currentUser.id);
    const filteredChallenges = challenges.filter(ch => ch.status === activeTab);

    useEffect(() => {
        fetchChallenges(currentUserId || localStorage.getItem('userId'));
    }, [currentUserId, fetchChallenges]);

    const getStatusColor = (status) => {
        if (status === 'completed') return 'text-[#c3d68b]';
        if (status === 'active') return 'text-[#fef08a]';
        if (status === 'upcoming') return 'text-sky-200';
        return 'text-white/60';
    };

    const handleAction = async (id) => {
        setIsSubmitting(true);
        setFeedback(null);
        let result = { success: false, message: 'This action could not be completed.' };
        if (modalType === 'accept') {
            result = await acceptChallenge(id);
            if (result.success) setActiveTab('active');
        } else if (modalType === 'giveup') {
            result = await failChallenge(id);
            if (result.success) setActiveTab('completed');
        } else if (modalType === 'retry') {
            result = await retryChallenge(id);
            if (result.success) setActiveTab('active');
        }
        setIsSubmitting(false);
        setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
        if (result.success) {
            setSelectedChallenge(null);
            setModalType(null);
        }
    };

    const openModal = (challenge, type) => {
        setFeedback(null);
        setSelectedChallenge(challenge);
        setModalType(type);
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
                            {tabs.find((tab) => tab.id === activeTab)?.label}
                        </span>
                        <h1 className="text-xl md:text-3xl font-medium text-white">Challenges</h1>
                    </div>
                </nav>

                {/* TABS */}
                <div className="flex justify-center px-6 mb-8">
                    <div className="flex bg-black/30 backdrop-blur-xl p-1.5 rounded-full border border-white/10 w-full max-w-md">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-2.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? 'bg-[#c1cf98] text-black shadow-lg shadow-[#c1cf98]/20'
                                        : 'text-white/60 hover:text-white'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {feedback && (
                    <div className={`mx-auto mb-5 w-[calc(100%-3rem)] max-w-xl rounded-2xl border px-5 py-4 text-sm font-medium ${
                        feedback.type === 'success'
                            ? 'border-[#c1cf98]/30 bg-[#c1cf98]/10 text-[#e6efcb]'
                            : 'border-red-400/30 bg-red-500/10 text-red-200'
                    }`}>
                        {feedback.message}
                    </div>
                )}

                {/* CHALLENGES LIST (Старый стиль расположения карточек) */}
                <div className="flex-grow flex items-start justify-center p-6 md:p-12">
                    <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-6 w-full max-w-7xl overflow-visible">
                        {filteredChallenges.length > 0 ? (
                            filteredChallenges.map((challenge) => (
                                <div
                                    key={challenge.id}
                                    onClick={() => openModal(challenge, 'details')}
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
                                        <div className="mt-4 flex items-center gap-2 text-xs text-white/55">
                                            <FiClock />
                                            Ends {challenge.endDate}
                                        </div>
                                        {challenge.status === 'active' && (
                                            <div className="mt-4">
                                                <div className="mb-1 flex justify-between text-xs text-white/55">
                                                    <span>Progress</span>
                                                    <span>{challenge.currentPoints} / {challenge.points} XP</span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                                    <div className="h-full rounded-full bg-[#c1cf98]" style={{ width: `${challenge.progressPercent}%` }} />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Кнопки действий */}
                                    <div className="mt-6 flex flex-col gap-2 relative z-20">
                                        {activeTab === 'available' && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openModal(challenge, 'accept'); }}
                                                className="w-full py-3 bg-[#c1cf98] text-black text-xs font-black uppercase tracking-tighter rounded-2xl hover:bg-white transition-all"
                                            >
                                                Accept Challenge
                                            </button>
                                        )}
                                        {activeTab === 'active' && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openModal(challenge, 'giveup'); }}
                                                className="w-full py-3 bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-black uppercase rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                Give Up
                                            </button>
                                        )}
                                        {activeTab === 'upcoming' && (
                                            <div className="w-full rounded-2xl border border-sky-300/20 bg-sky-300/10 py-3 text-center text-xs font-black uppercase text-sky-100">
                                                Starts {challenge.startDate}
                                            </div>
                                        )}
                                        {activeTab === 'completed' && challenge.result === 'fail' && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openModal(challenge, 'retry'); }}
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
                        ) : challengesLoading ? (
                            <div className="text-center py-20 opacity-60">
                                <p className="text-xl">Loading challenges...</p>
                            </div>
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
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => !isSubmitting && setSelectedChallenge(null)} />
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] max-w-sm w-full shadow-2xl text-center animate-in fade-in zoom-in duration-300">
                        <button disabled={isSubmitting} onClick={() => setSelectedChallenge(null)} className="absolute top-4 right-4 text-white/20 hover:text-white disabled:opacity-30">
                            <FiX size={20} />
                        </button>

                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${modalType === 'giveup' ? 'bg-red-500/10' : 'bg-[#c1cf98]/10'}`}>
                            {modalType === 'giveup' ? <FiAlertTriangle className="text-red-500" size={32} /> : <FiInfo className="text-[#c1cf98]" size={32} />}
                        </div>

                        <h3 className="text-xl font-bold mb-4">
                            {modalType === 'accept' && "Accept Challenge?"}
                            {modalType === 'giveup' && "Leave this challenge?"}
                            {modalType === 'retry' && "Restart Challenge?"}
                            {modalType === 'details' && selectedChallenge.title}
                        </h3>

                        <p className="mb-5 text-sm leading-relaxed text-white/65">
                            {modalType === 'accept' && 'Progress will start tracking after you join.'}
                            {modalType === 'giveup' && 'Your current progress will be stopped. You may restart before the challenge ends.'}
                            {modalType === 'retry' && 'Your progress will restart from zero.'}
                            {modalType === 'details' && selectedChallenge.phase === 'upcoming' && `${selectedChallenge.desc} This challenge opens on ${selectedChallenge.startDate}.`}
                            {modalType === 'details' && selectedChallenge.phase !== 'upcoming' && selectedChallenge.desc}
                        </p>

                        <div className="bg-white/5 rounded-3xl p-4 mb-6 space-y-2 text-sm">
                            <div className="flex justify-between"><span className="opacity-40">Starts:</span> <span>{selectedChallenge.startDate}</span></div>
                            <div className="flex justify-between"><span className="opacity-40">Ends:</span> <span>{selectedChallenge.endDate}</span></div>
                            <div className="flex justify-between"><span className="opacity-40">Reward:</span> <span className="text-[#c1cf98] font-bold">{selectedChallenge.points} pts</span></div>
                            {selectedChallenge.status === 'active' && <div className="flex justify-between"><span className="opacity-40">Progress:</span> <span>{selectedChallenge.currentPoints} / {selectedChallenge.points}</span></div>}
                        </div>

                        <div className="flex flex-col gap-3">
                            {modalType !== 'details' && (
                                <button
                                    disabled={isSubmitting}
                                    onClick={() => handleAction(selectedChallenge.id)}
                                    className={`w-full py-4 font-bold rounded-2xl transition-all shadow-lg disabled:cursor-wait disabled:opacity-60 ${modalType === 'giveup' ? 'bg-red-500 shadow-red-500/20' : 'bg-[#c1cf98] text-black shadow-[#c1cf98]/20'}`}
                                >
                                    {isSubmitting ? 'Saving...' : modalType === 'accept' ? 'Join challenge' : modalType === 'giveup' ? 'Leave challenge' : 'Restart challenge'}
                                </button>
                            )}
                            <button disabled={isSubmitting} onClick={() => setSelectedChallenge(null)} className="w-full py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all disabled:opacity-50">
                                {modalType === 'details' ? 'Close' : 'Cancel'}
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
