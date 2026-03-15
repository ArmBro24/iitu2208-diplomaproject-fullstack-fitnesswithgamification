import React, { useState } from 'react';
import { FiArrowLeft, FiCopy } from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';

const TrainerProfile = ({ trainer, onBack }) => {
    const [isCopied, setIsCopied] = useState(false);

    if (!trainer) return null;

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <Background>
            <div className="relative min-h-screen text-white font-rubik flex flex-col no-scrollbar overflow-x-hidden">

                {/* КНОПКА НАЗАД */}
                <nav className="absolute top-0 left-0 w-full z-50 px-6 md:px-12 py-10 md:py-24 pointer-events-none">
                    <button
                        onClick={onBack}
                        className="pointer-events-auto text-2xl md:text-3xl p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 shadow-lg"
                    >
                        <FiArrowLeft className="text-[#c1cf98]"/>
                    </button>
                </nav>

                <div className="flex flex-col md:flex-row flex-1">
                    {/* ЛЕВАЯ ЧАСТЬ: ФОТО */}
                    <div className="relative w-[85%] md:w-[40%] lg:w-[35%] h-[55vh] md:h-[90vh] pt-6 md:pt-10 shrink-0">
                        <div className="w-full h-full overflow-hidden rounded-r-[80px] md:rounded-r-[150px] border-y border-r border-white/10 shadow-2xl">
                            <img
                                src={trainer.img}
                                alt={trainer.name}
                                // object-top гарантирует, что верх картинки совпадет с верхом рамки
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                        <div className="absolute -bottom-6 right-[-20px] md:bottom-20 md:-right-8 z-20">
                            <div className="bg-[#c1cf98] text-black p-5 md:p-8 rounded-3xl shadow-xl transform rotate-3">
                                <span className="block text-4xl md:text-6xl font-black leading-none">{trainer.points}</span>
                                <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">points earned</p>
                            </div>
                        </div>
                    </div>

                    {/* ПРАВАЯ ЧАСТЬ: ИНФО */}
                    <div className="flex-1 px-6 md:px-16 flex flex-col items-center justify-center text-center pt-16 md:pt-24 pb-8 md:pb-12">
                        <span className="text-lg md:text-xl font-medium text-[#c1cf98] mb-4 opacity-80">Coach Profile</span>
                        <header className="mb-6 md:mb-12">
                            <h2 className="text-4xl md:text-7xl font-bold tracking-tight leading-tight">{trainer.name} {trainer.surname}</h2>
                        </header>
                        <div className="mb-8 md:mb-14 max-w-lg">
                            <p className="text-lg md:text-xl text-white/60 leading-relaxed italic">"{trainer.quote}"</p>
                        </div>

                        <button
                            onClick={() => copyToClipboard(trainer.phone)}
                            className="group relative flex items-center gap-6 bg-white/5 hover:bg-white/10 px-10 py-5 rounded-full transition-all border border-white/5 shadow-inner mb-8 md:mb-20"
                        >
                            <span className="text-lg md:text-xl font-medium tracking-widest">{trainer.phone}</span>
                            <div className="relative flex items-center justify-center">
                                {isCopied && (
                                    <span className="absolute bottom-full mb-3 bg-[#c1cf98] text-black text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-lg animate-bounce shadow-xl whitespace-nowrap">
                                        Copied!
                                    </span>
                                )}
                                <FiCopy className="text-[#c1cf98] text-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </button>

                        <h3 className="text-lg md:text-xl font-medium text-[#c1cf98]">Client Experience ↓</h3>
                    </div>
                </div>

                {/* НИЖНЯЯ ЧАСТЬ: КАРУСЕЛЬ ОТЗЫВОВ */}
                <div className="w-full pb-16 pt-2 md:pt-10">
                    <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 px-6 md:px-12 scroll-px-6 md:scroll-px-12">
                        {trainer.reviews?.map((review, index) => (
                            <div
                                key={index}
                                className="w-[80vw] md:w-[450px] snap-start bg-white/5 backdrop-blur-md p-6 md:p-10 rounded-[35px] md:rounded-[50px] border border-white/5 flex items-center justify-center shrink-0"
                            >
                                <p className="text-sm md:text-xl text-white/70 leading-relaxed italic text-center">
                                    "{review}"
                                </p>
                            </div>
                        ))}
                        <div className="min-w-[1px] h-full shrink-0 invisible" />
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