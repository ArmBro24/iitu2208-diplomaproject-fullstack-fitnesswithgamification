import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';
import useStore from '../../store/useStore';
import { subsData } from './Subscription';
import { getRoleHomePath } from '../../utils/roleRouting.js';

const SubscriptionDesc = () => {
    const { subscription } = useStore();
    const navigate = useNavigate();
    const homePath = getRoleHomePath();

    const currentSub = subsData.find(s => s.id === subscription.subId);

    if (!currentSub) {
        return <Navigate to="/subscription" />;
    }

    return (
        <Background>
            <div className="relative min-h-screen text-white font-rubik flex flex-col p-6 md:p-12">

                {/* Хедер: Кнопка + Заголовок */}
                <div className="flex items-center w-full mb-8 z-10 shrink-0">
                    <button
                        onClick={() => navigate(homePath)}
                        className="p-3 bg-white/5 rounded-2xl border border-white/5 active:scale-90 transition-transform"
                    >
                        <FiArrowLeft size={24} className="text-[#c1cf98]"/>
                    </button>
                    <h1 className="flex-grow text-center text-yellow-100/80 text-2xl md:text-3xl font-medium tracking-tight pr-12">
                        My subscription
                    </h1>
                </div>

                {/* md:my-auto — центрирует ТОЛЬКО на десктопе.
                   gap-4 — аккуратный отступ на мобилке между текстом, фото и списком.
                */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-12 items-stretch justify-center max-w-6xl mx-auto w-full md:my-auto">

                    {/* 1. ДОП. ТЕКСТ (Мобилка) */}
                    <div className="block md:hidden">
                        <p className="text-white/60 text-lg leading-tight">
                            {currentSub.desc}. Enjoy all premium benefits included in your tier.
                        </p>
                    </div>

                    {/* 2. КОНТЕЙНЕР С КАРТИНКОЙ */}
                    <div className="relative w-full max-w-sm mx-auto md:mx-0 h-56 md:h-auto md:self-stretch rounded-[40px] overflow-hidden shadow-2xl border-2 border-[#c1cf98] shrink-0">
                        <img src={currentSub.img} alt={currentSub.title} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
                            <span className="text-[#c1cf98] font-bold uppercase tracking-widest text-sm mb-2 italic">Active Plan</span>
                            <h1 className="text-4xl md:text-5xl font-black mb-1 uppercase">{currentSub.title}</h1>
                            <p className="text-white/80 text-sm font-medium uppercase tracking-wider">{currentSub.desc}</p>
                        </div>
                    </div>

                    {/* 3. ПРАВАЯ КОЛОНКА */}
                    <div className="flex-1 w-full max-w-md flex flex-col justify-between">
                        <div>
                            {/* Дополнительный текст (Десктоп) */}
                            <div className="hidden md:block mb-8">
                                <p className="text-white/60 text-xl leading-relaxed">
                                    {currentSub.desc}. Enjoy all premium benefits included in your tier.
                                </p>
                            </div>

                            {/* Условия */}
                            <div className="grid gap-3 md:gap-4 mb-6 md:mb-8">
                                {currentSub.features?.map((feat, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <div className="bg-[#c1cf98]/20 p-2 rounded-lg shrink-0">
                                            <FiCheck className="text-[#c1cf98]" size={20}/>
                                        </div>
                                        <span className="text-lg font-medium text-white/90">{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Кнопка */}
                        <button
                            onClick={() => navigate('/plans')}
                            className="w-full py-5 bg-[#c1cf98] text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all shadow-lg shadow-[#c1cf98]/20 mt-4 md:mt-0"
                        >
                            Change Subscription
                        </button>
                    </div>

                </div>
            </div>
        </Background>
    );
};

export default SubscriptionDesc;
