import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Добавлен импорт
import { FiMenu, FiUser, FiX, FiLogOut } from 'react-icons/fi';
import Calendar from '../../components/client/Calendar.jsx';
import Background from '../../components/common/Background.jsx';
import plansImg from '../../assets/plans.png';
import coachesImg from '../../assets/coaches.png';
import homeImg from '../../assets/home.png';
import useStore from '../../store/useStore';

const ClientHome = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();

    const setSelectedTraining = useStore((state) => state.setSelectedTraining);

    return (
        <Background>
            <div className="relative min-h-screen text-white font-rubik flex flex-col overflow-x-hidden">

                {/* MODAL OVERLAY */}
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

                                    <button
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            navigate('/profile'); // 4. Переход в профиль
                                        }}
                                        className="relative w-full py-4 px-6 bg-white/5 border-2 border-transparent hover:border-[#c1cf98]/60 active:border-[#c1cf98] rounded-2xl flex items-center justify-center transition-all font-medium text-white group"
                                    >
                                        <FiUser className="absolute left-6 text-[#c1cf98] transition-colors" size={20}/>
                                        <span className="text-white">Profile</span>
                                    </button>

                                    <button
                                        onClick={() => navigate('/login')} // 5. Выход на логин
                                        className="relative w-full py-4 px-6 bg-white/5 border-2 border-transparent hover:border-red-400/40 active:border-red-400/40 rounded-2xl flex items-center justify-center transition-all font-medium text-white group"
                                    >
                                        <FiLogOut className="absolute left-6 text-red-400/60 transition-colors" size={20}/>
                                        <span className="text-white">Exit</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MAIN GRID */}
                <div className="relative z-10 grid w-full flex-grow
                    grid-cols-[0.8fr_1.2fr]
                    gap-x-4
                    [grid-template-areas:'header_header''decor_decor''toptext_toptext''coaches_content''calendar_calendar']
                    md:gap-x-0
                    md:grid-cols-[minmax(300px,_1fr)_0.8fr_1.2fr]
                    md:[grid-template-rows:auto_auto_minmax(300px,_1fr)_auto]
                    md:[grid-template-areas:'header_header_header''text1_text1_plans''coaches_text2_plans''coaches_calendar_calendar']"
                >

                    {/* HEADER */}
                    <nav className="[grid-area:header] px-6 md:px-10 py-6 md:py-8 flex items-center justify-between">
                        <button
                            onClick={() => navigate('/menu')} // 6. Переход в меню
                            className="text-2xl md:text-3xl p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all"
                        >
                            <FiMenu className="text-[#c1cf98]"/>
                        </button>

                        <h1 className="text-[#c1cf98] text-3xl md:text-5xl font-rubik font-black tracking-tight">HeroFit</h1>

                        <button
                            onClick={() => setIsProfileOpen(true)}
                            className="text-2xl md:text-3xl p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all hover:scale-105 active:scale-95"
                        >
                            <FiUser className="text-[#c1cf98]"/>
                        </button>
                    </nav>

                    {/* MOBILE DECOR */}
                    <div className="[grid-area:decor] md:hidden block">
                        <div className="w-[85%] h-64 overflow-hidden rounded-tr-[100px] rounded-br-[100px] shadow-2xl">
                            <img src={homeImg} alt="Home" className="w-full h-full object-cover"/>
                        </div>
                    </div>

                    {/* TOP TEXT MOBILE */}
                    <div className="[grid-area:toptext] md:hidden block px-6 py-4">
                        <p className="text-[#c1cf98] text-[18px] leading-tight font-medium">
                            Level up your fitness! Complete workouts, earn XP, and unlock challenges.
                        </p>
                    </div>

                    {/* COACHES BLOCK */}
                    <div className="[grid-area:coaches] flex items-stretch md:items-end md:pr-6">
                        <div
                            onClick={() => navigate('/trainers')} // 7. Переход к тренерам
                            className="w-full h-full md:h-[95%] rounded-tr-[80px] rounded-br-[80px] md:rounded-tr-[120px] md:rounded-br-none overflow-hidden shadow-2xl relative border-2 border-transparent hover:border-[#c1cf98] active:border-[#c1cf98] transition-all duration-300 cursor-pointer">
                            <img src={coachesImg} alt="Coaches" className="w-full h-full object-cover"/>
                        </div>
                    </div>

                    {/* RIGHT COLUMN CONTENT */}
                    <div className="md:contents [grid-area:content] flex flex-col">
                        <div className="md:[grid-area:text1] px-2 md:px-12 py-2 md:pt-10">
                            <p className="text-[#c1cf98] text-[18px] md:text-2xl lg:text-[26px] leading-tight font-medium max-w-[95%] md:max-w-4xl">
                                Make every session a game.
                                <span className="hidden md:inline"> Equip your avatar with exclusive gear and watch your hero evolve.</span>
                            </p>
                        </div>

                        <div className="md:[grid-area:plans] flex items-stretch md:pl-10 md:pb-10">
                            <div
                                onClick={() => navigate('/subscription')} // 8. Переход к подпискам
                                className="w-full h-40 md:h-full rounded-l-[50px] md:rounded-l-[100px] md:rounded-r-none overflow-hidden shadow-2xl relative border-2 border-transparent cursor-pointer hover:border-[#c1cf98] active:border-[#c1cf98] transition-all duration-300 group"
                            >
                                <img src={plansImg} alt="Plans"
                                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                </div>
                            </div>
                        </div>

                        <div className="md:[grid-area:text2] px-2 md:px-12 py-4 flex items-start">
                            <p className="text-[#c1cf98] text-[18px] md:text-2xl lg:text-[26px] leading-tight font-medium max-w-[95%] md:max-w-2xl">
                                Your fitness journey is now an adventure!
                                <span className="hidden md:inline"> Join a global community of heroes, participate in epic weekly raids, and prove that you have the strength to conquer the highest peaks of the fitness world.</span>
                            </p>
                        </div>
                    </div>

                    {/* CALENDAR */}
                    <div className="[grid-area:calendar] flex items-end mt-4">
                        <div className="w-[85%] md:w-full">
                            <Calendar
                                isEdge={true}
                                onDateClick={(trainingData) => {
                                    setSelectedTraining(trainingData);
                                    navigate('/training');
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    );
};

export default ClientHome;