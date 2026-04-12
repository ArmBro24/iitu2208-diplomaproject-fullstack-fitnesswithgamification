import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Импорт навигации
import { FiArrowLeft } from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';

// Импорт аватаров
import avatarMe from '../../assets/avatars/avatar-me.png';
import avatar1 from '../../assets/avatars/avatar1.png';
import avatar2 from '../../assets/avatars/avatar2.png';
import avatar3 from '../../assets/avatars/avatar3.png';
import avatar4 from '../../assets/avatars/avatar4.png';
import avatar5 from '../../assets/avatars/avatar5.png';
import avatar6 from '../../assets/avatars/avatar6.png';
import avatar7 from '../../assets/avatars/avatar7.png';
import avatar8 from '../../assets/avatars/avatar8.png';
import avatar9 from '../../assets/avatars/avatar9.png';
import avatar10 from '../../assets/avatars/avatar10.png';

const avatars = [null, avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatar10];

const leaderboardData = [
    { id: 1, name: "Hero", points: 1540 },
    { id: 2, name: "Hero", points: 1200 },
    { id: 3, name: "Hero", points: 950 },
    { id: 4, name: "Hero", points: 880 },
    { id: 5, name: "Hero", points: 720 },
    { id: 6, name: "Hero", points: 640 },
    { id: 7, name: "Hero", points: 590 },
    { id: 8, name: "Hero", points: 510 },
    { id: 9, name: "Hero", points: 430 },
    { id: 10, name: "Hero", points: 300 },
];

const Leaderboard = () => {
    const navigate = useNavigate(); // 2. Инициализация хука

    return (
        <Background>
            <div className="relative h-screen text-white font-rubik flex flex-col overflow-y-auto md:overflow-hidden">

                {/* HEADER */}
                <nav className="relative z-20 px-6 md:px-10 py-6 md:py-8 flex items-center shrink-0">
                    <button
                        onClick={() => navigate('/menu')} // 3. Переход в меню
                        className="text-2xl md:text-3xl p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all hover:scale-105 active:scale-95"
                    >
                        <FiArrowLeft className="text-[#c1cf98]"/>
                    </button>

                    <h1 className="flex-grow text-center text-yellow-100/80 text-2xl md:text-3xl font-medium tracking-tight pr-12">
                        Leaderboard
                    </h1>
                </nav>

                {/* MAIN CONTENT AREA */}
                <div className="relative z-10 flex-grow grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-8 px-6 md:px-16 pb-6 min-h-0 md:overflow-hidden">

                    {/* LEFT COLUMN: Podium */}
                    <div className="flex flex-col justify-start md:justify-center h-full py-4 space-y-6 md:space-y-8 md:overflow-y-auto no-scrollbar">
                        <div className="flex items-end justify-between px-2 md:px-0 gap-x-4 pt-2 my-4 md:mt-4 shrink-0">
                            {/* 3rd Place */}
                            <div className="flex flex-col items-center min-w-0">
                                <img src={avatars[3]} alt="3rd" className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain mb-2" />
                                <span className="text-base lg:text-lg font-semibold text-white/70 mb-1">Hero</span>
                                <div className="w-16 h-18 sm:w-20 sm:h-20 lg:w-28 lg:h-24 bg-[#7a6b51]/40 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl lg:text-4xl font-black text-[#c1cf98]">3</div>
                            </div>
                            {/* 1st Place */}
                            <div className="flex flex-col items-center min-w-0">
                                <img src={avatars[1]} alt="1st" className="w-18 h-18 sm:w-20 sm:h-20 lg:w-28 lg:h-28 object-contain mb-2" />
                                <span className="text-base lg:text-lg font-semibold text-white/70 mb-1">Hero</span>
                                <div className="w-20 h-36 sm:w-24 sm:h-44 lg:w-32 lg:h-56 bg-[#7a6b51]/40 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl lg:text-5xl font-black text-[#c1cf98]">1</div>
                            </div>
                            {/* 2nd Place */}
                            <div className="flex flex-col items-center min-w-0">
                                <img src={avatars[2]} alt="2nd" className="w-16 h-16 sm:w-18 sm:h-18 lg:w-24 lg:h-24 object-contain mb-2" />
                                <span className="text-base lg:text-lg font-semibold text-white/70 mb-1">Hero</span>
                                <div className="w-16 h-28 sm:w-22 sm:h-32 lg:w-30 lg:h-40 bg-[#7a6b51]/40 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl lg:text-4xl font-black text-[#c1cf98]">2</div>
                            </div>
                        </div>

                        <div className="hidden md:block shrink-0">
                            <p className="text-[#c1cf98] text-base lg:text-xl leading-relaxed font-medium">
                                No matter where you are in the world, your dedication inspires us every day. Push your limits, participate in epic challenges, and stay active during your sessions to crush records and redefine what’s possible.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: List */}
                    <div className="flex flex-col h-full overflow-y-visible md:overflow-hidden">
                        <div className="flex flex-col h-full md:overflow-y-auto md:pr-4 lg:pr-6 custom-scrollbar">

                            {/* MY RANK CARD */}
                            <div className="mb-4 bg-[#7a6b51]/70 backdrop-blur-xl rounded-[32px] p-5 lg:p-6 md:px-8 lg:px-12 flex items-center justify-between border-2 border-[#c1cf98]/30 shadow-2xl shrink-0">
                                <img src={avatarMe} alt="Me" className="w-12 h-12 lg:w-14 lg:h-14 object-contain shrink-0" />
                                <span className="flex-grow text-center text-lg lg:text-2xl font-bold px-2 truncate">You</span>
                                <span className="text-3xl lg:text-4xl font-black text-yellow-100/80 shrink-0">256</span>
                            </div>

                            {/* LIST */}
                            <div className="space-y-6 lg:space-y-8 pb-10">
                                {leaderboardData.slice(3).map((user) => (
                                    <div
                                        key={user.id}
                                        className="bg-white/5 border-[1.5px] border-[#c1cf98]/20 rounded-[24px] p-4 md:px-8 lg:px-12 flex items-center justify-between shrink-0"
                                    >
                                        <img src={avatars[user.id]} alt="Hero" className="w-10 h-10 lg:w-12 lg:h-12 object-contain shrink-0" />
                                        <span className="flex-grow text-center font-semibold text-base lg:text-lg text-white/80 px-2 truncate">Hero</span>
                                        <span className="text-2xl lg:text-3xl font-black text-[#c1cf98]/40 shrink-0">{user.id}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                @media (min-width: 1024px) { .custom-scrollbar::-webkit-scrollbar { width: 12px; } }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 20px; margin: 10px 0; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(193, 207, 152, 0.3); border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
                .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(193, 207, 152, 0.3) rgba(255, 255, 255, 0.05); }
            `}</style>
        </Background>
    );
};

export default Leaderboard;