import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';

import mem1 from '../../assets/membership/mem1.png';
import mem2 from '../../assets/membership/mem2.png';
import mem3 from '../../assets/membership/mem3.png';
import mem4 from '../../assets/membership/mem4.png';
import mem5 from '../../assets/membership/mem5.png';

const subsData = [
    { id: 1, title: "First Step", desc: "One-time visit", price: "5 000 KZT", img: mem1, stats: "XP +50" },
    { id: 2, title: "Core Pulse", desc: "Monthly Standard", price: "15 000 KZT", img: mem2, stats: "XP +200" },
    { id: 3, title: "Power Drive", desc: "Frequent Training", price: "25 000 KZT", img: mem3, stats: "XP +500" },
    { id: 4, title: "Prime Strength", desc: "Premium Access", price: "45 000 KZT", img: mem4, stats: "XP +1200" },
    { id: 5, title: "Ultra Infinite", desc: "Unlimited Power", price: "80 000 KZT", img: mem5, stats: "XP +∞" },
];

const Subscribtion = ({ onBack }) => {
    const [activeCard, setActiveCard] = useState(null);

    return (
        <Background>
            <div
                className="relative min-h-screen text-white font-rubik flex flex-col"
                onClick={() => setActiveCard(null)}
            >
                <nav className="relative z-50 px-6 md:px-10 py-6 md:py-8 flex items-center shrink-0">
                    <button
                        onClick={(e) => { e.stopPropagation(); onBack(); }}
                        className="text-2xl md:text-3xl p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all"
                    >
                        <FiArrowLeft className="text-[#c1cf98]"/>
                    </button>
                    <h1 className="flex-grow text-center text-yellow-100/80 text-2xl md:text-3xl font-medium tracking-tight pr-12 uppercase">
                        Subscriptions
                    </h1>
                </nav>

                {/* Основной контейнер: добавили pt-32 и на мобилке для места под прыжок первой карты */}
                <div className="flex-grow flex items-center justify-center p-4 md:p-12 pt-24 md:pt-32 overflow-hidden">

                    <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl pt-10 md:pt-0">
                        {subsData.map((sub, index) => {
                            const isActive = activeCard === sub.id;
                            const isSomethingActive = activeCard !== null;

                            return (
                                <div
                                    key={sub.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveCard(isActive ? null : sub.id);
                                    }}
                                    style={{ zIndex: isActive ? 60 : index + 10 }}
                                    className={`
                                        relative 
                                        w-[90%] md:w-[260px] 
                                        h-[180px] md:h-[500px]
                                        rounded-[20px] md:rounded-[40px]
                                        overflow-hidden shadow-2xl border-2 
                                        /* Плавность: используем стандартный ease-in-out для десктопа, чтобы не было "дерганий" */
                                        transition-all duration-700 ease-in-out
                                        cursor-pointer
                                        
                                        -mt-8 md:-mt-0 md:-ml-8
                                        
                                        /* Десктоп эффекты: смягчили подъем и раздвижение */
                                        md:hover:-translate-y-12 md:hover:mx-2
                                        
                                        /* Состояния: убрали затемнение и грейскейл в обычном виде */
                                        ${isActive
                                        ? 'border-[#c1cf98] -translate-y-10 md:-translate-y-16 scale-105 md:mx-4 grayscale-0'
                                        : isSomethingActive
                                            ? 'border-white/5 grayscale-[60%] opacity-60' // Сильное затемнение только если выбрана ДРУГАЯ карта
                                            : 'border-white/10 grayscale-0 opacity-100' // В обычном состоянии всё яркое
                                    }
                                        hover:grayscale-0 hover:opacity-100
                                    `}
                                >
                                    <img
                                        src={sub.img}
                                        alt={sub.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />

                                    {/* Overlay: убрали базовое затемнение, теперь оно появляется только при выборе другой карты */}
                                    <div className={`absolute inset-0 transition-opacity duration-500 
                                        ${isActive ? 'bg-black/20' : isSomethingActive ? 'bg-black/60' : 'bg-transparent'}`}
                                    />

                                    <div className="absolute inset-0 p-6 flex flex-row md:flex-col justify-between items-center md:items-start">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-[#c1cf98] uppercase tracking-widest opacity-80">
                                                {sub.desc}
                                            </span>
                                            <h2 className="text-xl md:text-2xl font-black uppercase leading-tight">
                                                {sub.title.split(' ')[0]} <br className="hidden md:block"/> {sub.title.split(' ')[1] || ''}
                                            </h2>
                                        </div>

                                        <div className={`flex flex-col items-end md:items-start gap-2 transition-all duration-500 ${isActive ? 'opacity-100 translate-x-0' : 'md:opacity-100 opacity-0 translate-x-10 md:translate-x-0'}`}>
                                            <p className="text-lg md:text-xl font-black text-yellow-100/90">
                                                {sub.price}
                                            </p>
                                            <button className="px-5 py-2 bg-[#c1cf98] text-black text-[10px] md:text-xs font-black rounded-full uppercase hover:bg-white transition-colors">
                                                Choose
                                            </button>
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

export default Subscribtion;