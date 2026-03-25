import React, { useState } from 'react';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';
import SubscriptionModal from '../../components/client/SubscriptionModal.jsx'; // Импорт модалки

import mem1 from '../../assets/membership/mem1.png';
import mem2 from '../../assets/membership/mem2.png';
import mem3 from '../../assets/membership/mem3.png';
import mem4 from '../../assets/membership/mem4.png';
import mem5 from '../../assets/membership/mem5.png';

const subsData = [
    { id: 1, title: "First Step", desc: "One-time visit", price: "5 000 KZT", img: mem1, features: ["Single entry", "Valid 24h", "Basic lockers"] },
    { id: 2, title: "Core Pulse", desc: "Monthly Standard", price: "15 000 KZT", img: mem2, features: ["8 sessions", "Group classes", "Shower access"] },
    { id: 3, title: "Power Drive", desc: "Frequent Training", price: "25 000 KZT", img: mem3, features: ["12 sessions", "Sauna included", "Personal locker"] },
    { id: 4, title: "Prime Strength", desc: "Premium Access", price: "45 000 KZT", img: mem4, features: ["Unlimited visits", "Towel service", "Coach support"] },
    { id: 5, title: "Ultra Infinite", desc: "Unlimited Power", price: "80 000 KZT", img: mem5, features: ["24/7 Access", "VIP Lounge", "All locations"] },
];

const Subscribtion = ({ onBack }) => {
    const [activeCard, setActiveCard] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null); // Для открытия модалки

    const handleCardClick = (sub, e) => {
        e.stopPropagation();
        if (window.innerWidth < 768) {
            // На мобилке: первый клик активирует (затемнение), второй (по кнопке) открывает модалку
            setActiveCard(activeCard === sub.id ? null : sub.id);
        } else {
            // На десктопе: клик сразу открывает модалку
            setSelectedSub(sub);
        }
    };

    return (
        <Background>
            <div
                className="relative min-h-screen text-white font-rubik flex flex-col overflow-x-hidden"
                onClick={() => setActiveCard(null)}
            >
                {/* МОБИЛЬНЫЙ ОВЕРЛЕЙ */}
                {activeCard && (
                    <div
                        className="fixed inset-0 z-[60] backdrop-blur-sm md:hidden transition-opacity duration-500 bg-black/20"
                        onClick={() => setActiveCard(null)}
                    />
                )}

                {/* МОДАЛКА ЧЕКАУТА */}
                {selectedSub && (
                    <SubscriptionModal
                        sub={selectedSub}
                        onClose={() => setSelectedSub(null)}
                    />
                )}

                <nav className="relative z-[70] px-6 md:px-10 py-6 md:py-4 flex items-center shrink-0">
                    <button
                        onClick={(e) => { e.stopPropagation(); onBack(); }}
                        className="text-2xl md:text-3xl p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all"
                    >
                        <FiArrowLeft className="text-[#c1cf98]"/>
                    </button>
                    <h1 className="flex-grow text-center text-yellow-100/80 text-2xl md:text-3xl font-medium tracking-tight pr-12">
                        Subscriptions
                    </h1>
                </nav>

                <div className="flex-grow flex items-start justify-center p-4 pt-2 md:pt-8 overflow-visible">
                    <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl pt-4 md:pt-0">
                        {subsData.map((sub, index) => {
                            const isActive = activeCard === sub.id;
                            const isSomethingActive = activeCard !== null;

                            return (
                                <div
                                    key={sub.id}
                                    onClick={(e) => handleCardClick(sub, e)}
                                    style={{ zIndex: isActive ? 100 : index + 10 }}
                                    className={`
                                        relative w-[95%] md:w-[260px] h-[180px] md:h-[500px]
                                        rounded-[20px] md:rounded-[40px]
                                        overflow-hidden shadow-2xl border-2 
                                        transition-all duration-500 ease-out cursor-pointer
                                        -mt-8 first:mt-0 md:-mt-0 md:-ml-8
                                        md:hover:-translate-y-12 md:hover:mx-2 md:hover:border-[#c1cf98]/50
                                        ${isActive
                                        ? 'border-[#c1cf98] -translate-y-6 md:translate-y-0 scale-[1.04] md:scale-100'
                                        : isSomethingActive
                                            ? 'border-white/5 grayscale-[30%] opacity-40 translate-y-0'
                                            : 'border-white/10 grayscale-0 opacity-100'
                                    }
                                        md:opacity-100 md:grayscale-0 md:border-white/10
                                    `}
                                >
                                    <img src={sub.img} alt={sub.title} className="absolute inset-0 w-full h-full object-cover" />
                                    <div className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-l from-black/100 via-black/40 to-transparent md:bg-black/30 ${isActive || isSomethingActive ? 'opacity-100' : 'opacity-80'}`} />

                                    <div className="absolute inset-0 p-5 md:p-7 flex flex-row md:flex-col justify-between items-center md:items-start">
                                        <div className="flex flex-col z-10">
                                            <span className="text-[11px] font-bold text-[#F7EBFF] uppercase tracking-widest opacity-90 transition-all">{sub.desc}</span>
                                            <h2 className="text-xl md:text-2xl font-black leading-tight">
                                                {sub.title.split(' ')[0]} <br className="hidden md:block"/> {sub.title.split(' ')[1] || ''}
                                            </h2>
                                            <div className="hidden md:flex flex-col gap-3 mt-10">
                                                {sub.features.map((feat, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-[16px] font-medium text-white/90">
                                                        <FiCheck className="text-[#c1cf98] shrink-0" size={18}/>
                                                        <span className="leading-tight">{feat}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Mobile Info/Actions */}
                                        <div className="md:hidden relative z-10 h-full w-[140px] flex items-center justify-end">
                                            <div className={`absolute flex flex-col gap-0.5 items-end transition-all duration-500 ease-in-out
                                                ${isActive ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                                                {sub.features.map((feat, i) => (
                                                    <span key={i} className="text-[12px] text-[#C2DDA0] text-right leading-tight">{feat}</span>
                                                ))}
                                            </div>

                                            <div className={`absolute flex flex-col items-end gap-3 transition-all duration-500 ease-in-out
                                                ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                                                <p className="text-2xl font-black text-yellow-100/90 leading-none">{sub.price}</p>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedSub(sub); }}
                                                    className="px-5 py-2 rounded-full border border-[#c1cf98] text-[#c1cf98] text-[11px] font-black uppercase flex items-center gap-2 transition-all active:bg-[#c1cf98] active:text-black"
                                                >
                                                    Choose <span>→</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Desktop Action */}
                                        <div className="hidden md:flex flex-col gap-5 mt-auto w-full z-10">
                                            <p className="text-2xl font-black text-yellow-100/90 leading-none">{sub.price}</p>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedSub(sub); }}
                                                className="w-fit px-8 py-3 rounded-full border border-[#c1cf98] text-[#c1cf98] text-xs font-black uppercase flex items-center gap-2 group transition-all hover:bg-[#c1cf98] hover:text-black active:scale-95"
                                            >
                                                Choose <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
            `}</style>
        </Background>
    );
};

export default Subscribtion;