import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Добавлен импорт
import {
    FiArrowLeft,
    FiUser,
    FiX,
    FiLogOut,
    FiBarChart2,
    FiGlobe,
    FiHelpCircle,
    FiTarget
} from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';
import { setActiveRole } from '../../utils/roleRouting.js';

const Menu = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate(); // 2. Инициализация навигации

    React.useEffect(() => {
        setActiveRole('member');
    }, []);

    const menuItems = [
        {
            name: 'Challenges',
            icon: <FiTarget size={22} />,
            path: '/challenges'
        },
        {
            name: 'Leaderboard',
            icon: <FiBarChart2 size={22} />,
            path: '/leaderboard' // 3. Пути вместо функций
        },
        {
            name: 'Events',
            icon: <FiGlobe size={22}/>,
            path: '/events'
        },
        {
            name: 'Support',
            icon: <FiHelpCircle size={22} />,
            path: '/support'
        },
    ];

    return (
        <Background>
            <div className="flex h-[100dvh] min-h-[100dvh] flex-col overflow-y-auto overscroll-contain md:h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-4rem)]">
                {/* NAVIGATION */}
                <nav className="relative z-20 flex shrink-0 items-center justify-between px-4 py-4 sm:px-6 sm:py-6 md:px-10 md:py-8">
                    <button
                        onClick={() => navigate('/home')} // 4. На главную
                        className="rounded-xl bg-white/5 p-2 text-2xl transition-all hover:bg-white/10 md:rounded-2xl md:p-3 md:text-3xl"
                    >
                        <FiArrowLeft className="text-[#c1cf98]" />
                    </button>
                    <h1 className="text-[#c1cf98] text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">HeroFit</h1>
                    <button
                        onClick={() => setIsProfileOpen(true)}
                        className="rounded-xl bg-white/5 p-2 text-2xl transition-all hover:bg-white/10 md:rounded-2xl md:p-3 md:text-3xl"
                    >
                        <FiUser className="text-[#c1cf98]" />
                    </button>
                </nav>

                {/* MENU ITEMS */}
                <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-start gap-4 overflow-y-auto px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 sm:justify-center sm:gap-6 sm:px-6 sm:pb-24 sm:pt-0">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.path)} // 5. Переход по пути
                            className="relative flex min-h-14 w-full max-w-[340px] items-center justify-center px-6 py-4
                                       bg-white/5 backdrop-blur-sm
                                       border-2 border-transparent
                                       hover:border-[#c1cf98] active:border-[#c1cf98]
                                       rounded-full text-lg font-medium tracking-wide
                                       transition-all duration-300 group sm:py-5 sm:text-xl"
                        >
                            <span className="absolute left-6 text-white opacity-80 transition-opacity group-hover:opacity-100 sm:left-8">
                                {item.icon}</span>
                            <span className="text-white">{item.name}</span>
                        </button>
                    ))}
                </div>

                {/* MODAL OVERLAY */}
                {isProfileOpen && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-md transition-all sm:p-6"
                        onClick={() => setIsProfileOpen(false)}
                    >
                        <div
                            className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-[28px] bg-white/10 p-6 shadow-2xl backdrop-blur-2xl sm:rounded-[32px] sm:p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsProfileOpen(false)}
                                className="absolute right-5 top-5 text-white/50 transition-colors hover:text-white sm:right-6 sm:top-6"
                            >
                                <FiX size={24} />
                            </button>

                            <div className="flex flex-col items-center gap-4">
                                <h2 className="text-2xl font-black tracking-tight mb-4 text-white">Client Name</h2>
                                <div className="w-full flex flex-col gap-3">
                                    <button
                                        onClick={() => navigate('/profile')} // 6. В профиль
                                        className="relative w-full py-4 px-6 bg-white/5 border-2 border-transparent hover:border-[#c1cf98] active:border-[#c1cf98] rounded-2xl flex items-center justify-center transition-all font-medium text-white group"
                                    >
                                        <FiUser className="absolute left-6 text-[#c1cf98]" size={20} />
                                        <span>Profile</span>
                                    </button>
                                    <button
                                        onClick={() => navigate('/login')} // 7. На логин (выход)
                                        className="relative w-full py-4 px-6 bg-white/5 border-2 border-transparent hover:border-red-400/40 active:border-red-400/40 rounded-2xl flex items-center justify-center transition-all font-medium text-white group"
                                    >
                                        <FiLogOut className="absolute left-6 text-red-400/60 transition-colors" size={20} />
                                        <span className="text-white">Exit</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Background>
    );
};

export default Menu;
