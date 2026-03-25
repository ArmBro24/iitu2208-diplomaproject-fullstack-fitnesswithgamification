import React, { useState } from 'react';
import { FiArrowLeft, FiCopy, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';
import CoachPaymentModal from '../../components/client/CoachPaymentModal.jsx';

const TrainerProfile = ({ trainer, onBack, coachContract, setCoachContract, trainersData = [] }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    if (!trainer || !coachContract) return null;

    const isThisTrainer = coachContract.trainerId === trainer.id;
    const hasAnotherTrainer = coachContract.trainerId !== null && !isThisTrainer;

    // Находим имя уже выбранного тренера для тултипа
    const selectedTrainerInfo = trainersData.find(t => t.id.toString() === coachContract.trainerId?.toString());
    const selectedName = selectedTrainerInfo ? `${selectedTrainerInfo.name} ${selectedTrainerInfo.surname}` : "another coach";

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleSelect = () => {
        if (hasAnotherTrainer) {
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 4000);
            return;
        }
        setCoachContract({ trainerId: trainer.id, status: 'pending' });
        setTimeout(() => {
            setCoachContract(prev => ({ ...prev, status: 'to_pay' }));
        }, 3000);
    };

    const handleCancelRequest = () => {
        if (coachContract.status === 'active') {
            if (!window.confirm("Are you sure you want to stop mentorship?")) return;
        }
        setCoachContract({ trainerId: null, status: 'none' });
    };

    const handlePaymentSuccess = () => {
        setCoachContract(prev => ({ ...prev, status: 'active' }));
        setShowPaymentModal(false);
    };

    // ТВОЙ ЭТАЛОННЫЙ СТИЛЬ (как у кнопки телефона)
    const actionBtnStyle = "group relative flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 px-10 py-5 rounded-full transition-all border border-white/5 shadow-inner w-full max-w-[340px] active:scale-95";

    return (
        <Background>
            <div className="relative min-h-screen text-white font-rubik flex flex-col no-scrollbar overflow-x-hidden">

                {showPaymentModal && (
                    <CoachPaymentModal
                        trainer={trainer}
                        onClose={() => setShowPaymentModal(false)}
                        onConfirm={handlePaymentSuccess}
                    />
                )}

                {/* НАВИГАЦИЯ */}
                <nav className="absolute top-0 left-0 w-full z-50 px-6 md:px-12 py-10 md:py-24 pointer-events-none">
                    <button
                        onClick={onBack}
                        className="pointer-events-auto text-2xl md:text-3xl p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 active:scale-95"
                    >
                        <FiArrowLeft className="text-[#c1cf98]"/>
                    </button>
                </nav>

                <div className="flex flex-col md:flex-row flex-1">
                    {/* ЛЕВАЯ ЧАСТЬ: ФОТО */}
                    <div className="relative w-[85%] md:w-[40%] lg:w-[35%] h-[55vh] md:h-[90vh] pt-6 md:pt-10 shrink-0">
                        <div className="w-full h-full overflow-hidden rounded-r-[80px] md:rounded-r-[150px] border-y border-r border-white/10 shadow-2xl">
                            <img src={trainer.img} alt={trainer.name} className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="absolute -bottom-6 right-[-20px] md:bottom-20 md:-right-8 z-20">
                            <div className="bg-[#c1cf98] text-black p-5 md:p-8 rounded-3xl shadow-xl transform rotate-3">
                                <span className="block text-4xl md:text-6xl font-black leading-none">{trainer.points}</span>
                                <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">points earned</p>
                            </div>
                        </div>
                    </div>

                    {/* ПРАВАЯ ЧАСТЬ */}
                    <div className="flex-1 px-6 md:px-16 flex flex-col items-center justify-center text-center pt-16 md:pt-24 pb-8 md:pb-12">
                        <span className="text-lg md:text-xl font-medium text-[#c1cf98] mb-4 opacity-80">Coach Profile</span>
                        <header className="mb-6 md:mb-12">
                            <h2 className="text-4xl md:text-7xl font-bold tracking-tight leading-tight">
                                {trainer.name} {trainer.surname}
                            </h2>
                        </header>

                        {/* СЕКЦИЯ ДЕЙСТВИЙ */}
                        <div className="flex flex-col items-center gap-4 mb-8 md:mb-16 w-full">

                            {/* Выбор тренера / Тултип */}
                            <div className="relative w-full flex justify-center">
                                {showTooltip && (
                                    <span className="absolute bottom-full mb-3 bg-red-400/60 backdrop-blur-md text-white text-[10px] font-bold px-4 py-2 rounded-xl animate-bounce shadow-xl whitespace-nowrap z-50 border border-white/10">
                                        <FiAlertCircle className="inline mr-1" /> You have already selected {selectedName}!
                                    </span>
                                )}

                                {(!isThisTrainer || coachContract.status === 'none') && (
                                    <button
                                        onClick={handleSelect}
                                        className={`w-full max-w-[340px] py-5 rounded-full font-black text-xl uppercase tracking-widest transition-all
                                            ${hasAnotherTrainer
                                            ? 'bg-white/5 text-white/10 border border-white/5 cursor-not-allowed opacity-50'
                                            : 'bg-[#c1cf98] text-black hover:scale-105 active:scale-95 shadow-lg'}`}
                                    >
                                        Choose Coach
                                    </button>
                                )}
                            </div>

                            {/* Состояние: REVIEWING */}
                            {isThisTrainer && coachContract.status === 'pending' && (
                                <div className="w-full flex flex-col items-center gap-4">
                                    <div className="w-full max-w-[340px] py-5 bg-white/5 border border-yellow-500/30 text-yellow-500/80 rounded-full animate-pulse font-bold uppercase tracking-widest text-center">
                                        Reviewing...
                                    </div>
                                    <button onClick={handleCancelRequest} className={actionBtnStyle}>
                                        <span className="text-lg text-red-400/60 uppercase tracking-widest">Cancel Request</span>
                                    </button>
                                </div>
                            )}

                            {/* Состояние: ОПЛАТА */}
                            {isThisTrainer && coachContract.status === 'to_pay' && (
                                <div className="w-full flex flex-col items-center gap-4">
                                    <button
                                        onClick={() => setShowPaymentModal(true)}
                                        className={`${actionBtnStyle} !bg-purple-600/15 border-purple-500/40 hover:!bg-purple-600/30`}
                                    >
                                        <span className="text-lg font-bold text-white uppercase tracking-widest">Pay for Mentor</span>
                                    </button>
                                    <button onClick={handleCancelRequest} className={actionBtnStyle}>
                                        <span className="text-lg text-red-400/60 uppercase tracking-widest">Cancel Request</span>
                                    </button>
                                </div>
                            )}

                            {/* Состояние: АКТИВНЫЙ */}
                            {isThisTrainer && coachContract.status === 'active' && (
                                <div className="w-full flex flex-col items-center gap-4">
                                    <div
                                        className="w-full max-w-[340px] py-5 bg-[#c1cf98]/10 border border-[#c1cf98]/30 text-[#c1cf98] rounded-full font-black text-xl flex items-center justify-center gap-3">
                                        <FiCheckCircle size={24}/> MY COACH
                                    </div>

                                    <button onClick={handleCancelRequest} className={actionBtnStyle}>
                                        <span className="text-lg text-red-400/60 uppercase tracking-widest">Terminate Mentorship</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* КНОПКА ТЕЛЕФОНА (Эталон стиля) */}
                        <button onClick={() => copyToClipboard(trainer.phone)} className={actionBtnStyle}>
                        <span className="text-lg md:text-xl font-medium tracking-widest">{trainer.phone}</span>
                            <div className="relative flex items-center justify-center">
                                {isCopied && (
                                    <span className="absolute bottom-full mb-3 bg-[#c1cf98] text-black text-[10px] font-bold px-3 py-1.5 rounded-lg animate-bounce shadow-xl whitespace-nowrap">
                                        Copied!
                                    </span>
                                )}
                                <FiCopy className="text-[#c1cf98] text-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </button>

                        <h3 className="text-lg md:text-xl font-medium text-[#c1cf98] mt-8">Client Experience ↓</h3>
                    </div>
                </div>

                {/* ОТЗЫВЫ */}
                <div className="w-full pb-16 pt-2 md:pt-10">
                    <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 px-6 md:px-12 scroll-px-6 md:scroll-px-12">
                        {trainer.reviews?.map((review, index) => (
                            <div key={index} className="w-[80vw] md:w-[450px] snap-start bg-white/5 backdrop-blur-md p-6 md:p-10 rounded-[35px] md:rounded-[50px] border border-white/5 flex items-center justify-center shrink-0">
                                <p className="text-sm md:text-xl text-white/70 leading-relaxed italic text-center italic">"{review}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </Background>
    );
};

export default TrainerProfile;