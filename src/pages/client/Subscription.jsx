import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiActivity, FiCalendar } from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';
import SubscriptionModal from '../../components/client/SubscriptionModal.jsx';
import useStore from '../../store/useStore';
import { setActiveRole } from '../../utils/roleRouting.js';

// Импорт ассетов
import mem1 from '../../assets/membership/mem1.png';
import mem2 from '../../assets/membership/mem2.png';
import mem3 from '../../assets/membership/mem3.png';
import mem4 from '../../assets/membership/mem4.png';
import mem5 from '../../assets/membership/mem5.png';

export const subsData = [
    { id: 1, title: "First Step", desc: "One-time visit", price: "5 000 KZT", img: mem1, features: ["Single entry", "Valid 24h", "Basic lockers"] },
    { id: 2, title: "Core Pulse", desc: "Monthly Standard", price: "15 000 KZT", img: mem2, features: ["8 sessions", "Group classes", "Shower access"] },
    { id: 3, title: "Power Drive", desc: "Frequent Training", price: "25 000 KZT", img: mem3, features: ["12 sessions", "Sauna included", "Personal locker"] },
    { id: 4, title: "Prime Strength", desc: "Premium Access", price: "45 000 KZT", img: mem4, features: ["Unlimited visits", "Towel service", "Coach support"] },
    { id: 5, title: "Ultra Infinite", desc: "Unlimited Power", price: "80 000 KZT", img: mem5, features: ["24/7 Access", "VIP Lounge", "All locations"] },
];

const Subscription = () => {
    const navigate = useNavigate();
    const subscription = useStore((state) => state.subscription);
    const setSubscription = useStore((state) => state.setSubscription);

    const [activeCard, setActiveCard] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null);
    const [showTooltip, setShowTooltip] = useState(null);

    React.useEffect(() => {
        setActiveRole('member');
    }, []);

    const expiryDate = useMemo(() => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }, []);

    const handleChoose = (sub, e) => {
        if (e) e.stopPropagation();

        if (subscription.subId === sub.id) {
            navigate('/subscription-desc'); // Переходим на страницу описания
            return;
        }

        if (subscription.subId && subscription.subId !== sub.id) {
            setShowTooltip(sub.id);
            setTimeout(() => setShowTooltip(null), 3000);
            return;
        }

        setSelectedSub(sub);
    };

    const handleReset = () => {
        setSubscription({ subId: null, status: 'none' });
    };

    const handleCardClick = (sub, e) => {
        e.stopPropagation();
        if (window.innerWidth < 768) {
            setActiveCard(activeCard === sub.id ? null : sub.id);
        } else {
            handleChoose(sub, e);
        }
    };

    return (
        <Background>
            <div className="relative min-h-screen text-white font-rubik flex flex-col overflow-x-hidden" onClick={() => setActiveCard(null)}>

                {activeCard && (
                    <div className="fixed inset-0 z-[60] backdrop-blur-sm md:hidden transition-opacity duration-500 bg-black/20" />
                )}

                {selectedSub && (
                    <SubscriptionModal sub={selectedSub} onClose={() => setSelectedSub(null)} />
                )}

                <nav className="relative z-[70] px-6 md:px-10 py-6 md:py-4 flex items-center shrink-0">
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate('/home'); }}
                        className="text-2xl md:text-3xl p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all active:scale-95"
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
                            const isPurchased = subscription.subId === sub.id;
                            const hasOtherSub = subscription.subId !== null && !isPurchased;
                            const isActiveMobile = activeCard === sub.id;

                            return (
                                <div
                                    key={sub.id}
                                    onClick={(e) => handleCardClick(sub, e)}
                                    className={`
                                        relative w-[95%] md:w-[260px] h-[180px] md:h-[500px]
                                        rounded-[20px] md:rounded-[40px]
                                        overflow-hidden shadow-2xl border-2 transition-all duration-500 ease-out cursor-pointer
                                        -mt-8 first:mt-0 md:-mt-0 md:-ml-8
                                        ${isPurchased ? 'border-[#c1cf98] shadow-[0_0_20px_rgba(193,207,152,0.2)]' : 'border-white/10'}
                                        ${isActiveMobile ? '-translate-y-6 scale-[1.04]' : ''}
                                        md:hover:-translate-y-12 md:hover:mx-2 md:hover:border-[#c1cf98]/50
                                    `}
                                    // Изменено: теперь купленная карточка не имеет приоритета по z-index над соседями
                                    style={{zIndex: isActiveMobile ? 100 : (index + 10)}}
                                >
                                    <img src={sub.img} alt={sub.title}
                                         className="absolute inset-0 w-full h-full object-cover"/>
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent md:bg-black/20"/>
                                    <div
                                        className="absolute inset-0 p-5 md:p-7 flex flex-row md:flex-col justify-between items-center md:items-start">

                                        {/* --- ЛЕВЫЙ/ВЕРХНИЙ БЛОК: ЗАГОЛОВОК И ОПИСАНИЕ --- */}
                                        {/* --- ЛЕВЫЙ/ВЕРХНИЙ БЛОК: ЗАГОЛОВОК И ОПИСАНИЕ --- */}
                                        <div
                                            className={`flex flex-col z-10 w-full transition-all duration-300 ${isActiveMobile ? 'opacity-0 -translate-x-4 md:opacity-100 md:translate-x-0' : 'opacity-100'}`}>
                                            <div className="h-6 mb-1 flex items-center">
                                                {isPurchased && (
                                                    /* ИСПРАВЛЕНИЕ: Добавляем hidden md:flex, чтобы "Active Plan" не отображался на мобилке */
                                                    <div
                                                        className="hidden md:flex items-center gap-1.5 text-[#c1cf98] font-black uppercase tracking-widest text-[10px] animate-pulse">
                                                        <FiActivity size={12}/>
                                                        <span>Active Plan</span>
                                                    </div>
                                                )}
                                            </div>

                                            <span
                                                className="text-[11px] font-bold text-[#F7EBFF] uppercase tracking-widest opacity-60">{sub.desc}</span>
                                            <h2 className="text-xl md:text-2xl font-black leading-tight mt-1">
                                                {sub.title.split(' ')[0]} <br
                                                className="hidden md:block"/> {sub.title.split(' ')[1] || ''}
                                            </h2>

                                            {/* Этот блок с датой уже скрыт на мобилке из прошлого шага */}
                                            {isPurchased && (
                                                <div
                                                    className="hidden md:flex items-center gap-2 mt-3 text-[#c1cf98] bg-[#c1cf98]/10 w-fit px-2.5 py-1 rounded-lg border border-[#c1cf98]/20 transition-opacity duration-300">
                                                    <FiCalendar size={13}/>
                                                    <span
                                                        className="text-[11px] font-bold uppercase">Until {expiryDate}</span>
                                                </div>
                                            )}

                                            {/* Условия (features) для десктопа */}
                                            <div className="hidden md:flex flex-col gap-3 mt-8">
                                                {sub.features.map((feat, i) => (
                                                    <div key={i}
                                                         className="flex items-center gap-3 text-[14px] font-medium text-white/90">
                                                        <FiCheck className="text-[#c1cf98] shrink-0" size={16}/>
                                                        <span className="leading-tight">{feat}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* --- ПРАВЫЙ/НИЖНИЙ БЛОК: КНОПКА И ЦЕНА (Обычное состояние мобилки) --- */}
                                        <div
                                            className={`md:hidden ml-auto flex flex-col items-end justify-center gap-2 transition-all duration-300 z-10 shrink-0 ${
                                                isActiveMobile ? 'opacity-0 translate-x-4' : 'opacity-100'
                                            }`}
                                        >
                                            {isPurchased ? (
                                                /* Дизайн для активной подписки вместо цены */
                                                <div className="flex items-center gap-2 bg-[#c1cf98]/10 px-2.5 py-1.5 rounded-lg border border-[#c1cf98]/20 whitespace-nowrap">
                                                    <FiCalendar size={13} className="text-[#c1cf98]"/>
                                                    <span className="text-[11px] font-bold uppercase text-[#c1cf98]">
                Active until {expiryDate}
            </span>
                                                </div>
                                            ) : (
                                                /* Обычное отображение цены */
                                                <p className="text-xl font-black text-yellow-100/90 leading-none whitespace-nowrap">
                                                    {sub.price}
                                                </p>
                                            )}

                                            <div className="relative">
                                                {showTooltip === sub.id && (
                                                    <span className="absolute bottom-full mb-3 right-0 bg-red-400 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg z-50 whitespace-nowrap shadow-xl">
                You already have a plan!
            </span>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        isPurchased ? handleReset() : handleChoose(sub, e);
                                                    }}
                                                    className={`px-6 py-2 rounded-full text-[11px] font-black uppercase transition-all active:scale-95 cursor-pointer whitespace-nowrap ${
                                                        isPurchased || !hasOtherSub
                                                            ? 'bg-[#c1cf98] text-black shadow-lg shadow-[#c1cf98]/20'
                                                            : 'bg-white/10 text-white/40 border border-white/10'
                                                    }`}
                                                >
                                                    {isPurchased ? 'Reset' : 'Choose'}
                                                </button>
                                            </div>
                                        </div>


                                        {/* --- МОБИЛЬНЫЙ ПЕРЕКЛЮЧАТЕЛЬ (АКТИВНОЕ СОСТОЯНИЕ) --- */}
                                        {/* Появляется ТОЛЬКО приisActiveMobile и ТОЛЬКО на мобилке */}
                                        {isActiveMobile && (
                                            <div
                                                className="md:hidden absolute inset-0 z-20 p-5 flex flex-row items-center justify-between animate-in fade-in zoom-in duration-300">
                                                {/* Список подробных условий (features) */}
                                                <div className="flex flex-col gap-2 flex-grow pr-4">
                                                    {sub.features.map((feat, i) => (
                                                        <div key={i}
                                                             className="flex items-center gap-2 text-[12px] font-bold text-white/90">
                                                            <FiCheck className="text-[#c1cf98] shrink-0" size={14}/>
                                                            <span className="leading-tight">{feat}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Цена и Кнопка для активного состояния */}
                                                <div
                                                    className="flex flex-col items-end justify-center gap-3 border-l border-white/10 pl-4 h-full">
                                                    <p className="text-2xl font-black text-yellow-100/90 leading-none">{sub.price}</p>
                                                    <div className="relative">
                                                        {showTooltip === sub.id && (
                                                            <span
                                                                className="absolute bottom-full mb-3 right-0 bg-red-400 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg z-50 whitespace-nowrap shadow-xl">
                            You already have a plan!
                        </span>
                                                        )}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                isPurchased ? handleReset() : handleChoose(sub, e);
                                                            }}
                                                            className={`px-8 py-3 rounded-full text-[12px] font-black uppercase transition-all active:scale-90 shadow-2xl ${
                                                                isPurchased || !hasOtherSub
                                                                    ? 'bg-[#c1cf98] text-black shadow-[#c1cf98]/20'
                                                                    : 'bg-white/10 text-white/40 border border-white/10'
                                                            }`}
                                                        >
                                                            {isPurchased ? 'Reset' : 'Choose'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* --- ДЕСКТОПНЫЙ БЛОК (Цена и Кнопка) --- */}
                                        {/* Оставляем без изменений, как в вашем коде */}
                                        <div className="hidden md:flex flex-col gap-4 mt-auto w-full z-10">
                                            <p className="text-2xl font-black text-yellow-100/90 leading-none">{sub.price}</p>
                                            <div className="relative">
                                                {showTooltip === sub.id && (
                                                    <span
                                                        className="absolute bottom-full mb-3 left-0 bg-red-400 text-white text-[11px] font-bold px-4 py-2 rounded-xl z-50 whitespace-nowrap shadow-2xl animate-bounce">
                    You already have a plan!
                </span>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        isPurchased ? handleReset() : handleChoose(sub, e);
                                                    }}
                                                    className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group cursor-pointer ${
                                                        isPurchased || !hasOtherSub
                                                            ? 'bg-[#c1cf98] text-black hover:bg-[#d4e0ab] shadow-lg'
                                                            : 'bg-white/10 text-white/40 border border-white/5'
                                                    }`}
                                                >
                                                    {isPurchased ? 'RESET PLAN' : 'CHOOSE PLAN'}
                                                    {!isPurchased && !hasOtherSub && <span
                                                        className="group-hover:translate-x-1 transition-transform">→</span>}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Background>
    );
};

export default Subscription;
