import React, { useState } from 'react';
import {
    FiArrowLeft,
    FiUser,
    FiX,
    FiLogOut,
    FiBarChart2,
    FiGlobe,
    FiHelpCircle
} from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';

// Добавляем onOpenLeaderboard в пропсы
const Menu = ({ onBack, onLogout, onOpenLeaderboard, onOpenEvents, onOpenSupport}) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const menuItems = [
        {
            name: 'Leaderboard',
            icon: <FiBarChart2 size={22} />,
            action: onOpenLeaderboard // Привязываем действие
        },
        {
            name: 'Events',
            icon: <FiGlobe size={22}/>,
            action: onOpenEvents
        },
        {
            name: 'Support',
            icon: <FiHelpCircle size={22} />,
            action: onOpenSupport
        },
    ];

    return (
        <Background>
            <div className="min-h-screen flex flex-col">
                <nav className="relative z-20 px-6 md:px-10 py-6 md:py-8 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="text-2xl md:text-3xl p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all"
                    >
                        <FiArrowLeft className="text-[#c1cf98]" />
                    </button>
                    <h1 className="text-[#c1cf98] text-3xl md:text-5xl font-black tracking-tight">HeroFit</h1>
                    <button
                        onClick={() => setIsProfileOpen(true)}
                        className="text-2xl md:text-3xl p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all"
                    >
                        <FiUser className="text-[#c1cf98]" />
                    </button>
                </nav>

                <div className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 gap-6 pb-24">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={item.action} // Вешаем обработчик клика
                            className="relative w-full max-w-[340px] py-5 px-6
                                       bg-white/5 backdrop-blur-sm
                                       border-2 border-transparent
                                       hover:border-[#c1cf98] active:border-[#c1cf98]
                                       rounded-full text-xl font-medium tracking-wide
                                       flex items-center justify-center transition-all duration-300 group"
                        >
                            <span className="absolute left-8 text-white opacity-80 group-hover:opacity-100 transition-opacity">
                                {item.icon}</span>
                            <span className="text-white">{item.name}</span>
                        </button>
                    ))}
                </div>

                {/* MODAL OVERLAY оставляем без изменений */}
                {isProfileOpen && (
                    <div
                        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-6 transition-all"
                        onClick={() => setIsProfileOpen(false)}
                    >
                        <div
                            className="relative w-full max-w-sm bg-white/10 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsProfileOpen(false)}
                                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                            >
                                <FiX size={24} />
                            </button>

                            <div className="flex flex-col items-center gap-4">
                                <h2 className="text-2xl font-black tracking-tight mb-4 text-white">Client Name</h2>
                                <div className="w-full flex flex-col gap-3">
                                    <button className="relative w-full py-4 px-6 bg-white/5 border-2 border-transparent hover:border-[#c1cf98] active:border-[#c1cf98] rounded-2xl flex items-center justify-center transition-all font-medium text-white group">
                                        <FiUser className="absolute left-6 text-[#c1cf98]" size={20} />
                                        <span>Profile</span>
                                    </button>
                                    <button onClick={onLogout}
                                            className="relative w-full py-4 px-6 bg-white/5 border-2 border-transparent hover:border-red-400/40 active:border-red-400/40 rounded-2xl flex items-center justify-center transition-all font-medium text-white group">
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