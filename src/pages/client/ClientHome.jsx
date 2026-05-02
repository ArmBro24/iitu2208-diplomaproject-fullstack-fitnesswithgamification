import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiUser, FiX, FiLogOut } from 'react-icons/fi';
import Calendar from '../../components/client/Calendar.jsx';
import Background from '../../components/common/Background.jsx';
import plansImg from '../../assets/plans.png';
import coachesImg from '../../assets/coaches.png';
import homeImg from '../../assets/home.png';
import useStore from '../../store/useStore';

const ClientHome = () => {
    const fetchSessions = useStore((state) => state.fetchSessions);
    const userId = useStore((state) => state.currentUser.id);
    const sessions = useStore((state) => state.sessions);
    useEffect(() => {
        if (userId) {
            fetchSessions(userId);
        }
    }, [userId]);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();

    const setSelectedTraining = useStore((state) => state.setSelectedTraining);

    return (
        <Background>
            <div className="relative min-h-screen text-white font-rubik flex flex-col overflow-x-hidden">

                {/* Модальное окно профиля */}
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
                                            navigate('/profile');
                                        }}
                                        className="relative w-full py-4 px-6 bg-white/5 border-2 border-transparent hover:border-[#c1cf98]/60 active:border-[#c1cf98] rounded-2xl flex items-center justify-center transition-all font-medium text-white group"
                                    >
                                        <FiUser className="absolute left-6 text-[#c1cf98]" size={20}/>
                                        <span className="text-white">Profile</span>
                                    </button>

                                    <button
                                        onClick={() => navigate('/login')}
                                        className="relative w-full py-4 px-6 bg-white/5 border-2 border-transparent hover:border-red-400/40 active:border-red-400/40 rounded-2xl flex items-center justify-center transition-all font-medium text-white group"
                                    >
                                        <FiLogOut className="absolute left-6 text-red-400/60" size={20}/>
                                        <span className="text-white">Exit</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Основная сетка */}
                <div className="relative z-10 grid w-full flex-grow
                    grid-cols-[0.8fr_1.2fr]
                    gap-x-4
                    [grid-template-areas:'header_header''decor_decor''toptext_toptext''coaches_content''calendar_calendar']
                    md:gap-x-0
                    md:grid-cols-[minmax(280px,_0.7fr)_1.6fr_min-content]
                    md:[grid-template-rows:auto_min-content_min-content_1fr]
                    md:[grid-template-areas:'header_header_header''text1_text1_plans''coaches_text2_text2''coaches_calendar_calendar']"
                >

                    {/* Хедер */}
                    <nav className="[grid-area:header] px-6 md:px-10 py-6 md:py-8 flex items-center justify-between">
                        <button
                            onClick={() => navigate('/menu')}
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

                    {/* Декор (только мобилка) */}
                    <div className="[grid-area:decor] md:hidden block">
                        <div className="w-[85%] h-64 overflow-hidden rounded-tr-[100px] rounded-br-[100px] shadow-2xl">
                            <img src={homeImg} alt="Home" className="w-full h-full object-cover"/>
                        </div>
                    </div>

                    {/* Верхний текст (только мобилка) */}
                    <div className="[grid-area:toptext] md:hidden block px-6 py-4">
                        <p className="text-[#c1cf98] text-[18px] leading-tight font-medium">
                            Level up your fitness! Complete workouts, earn XP, and unlock challenges.
                        </p>
                    </div>

                    {/* Секция Тренеров (Левая колонка) */}
                    <div className="[grid-area:coaches] flex flex-col items-stretch md:items-start md:pr-6 md:min-h-0">
                        {/* Картинка остается прижатой влево (без отступа) */}
                        <div
                            onClick={() => navigate('/trainers')}
                            className="w-full h-full md:h-fit md:max-w-[340px] rounded-tr-[80px] rounded-br-[80px] md:rounded-tr-[120px] md:rounded-br-[120px] overflow-hidden shadow-2xl relative border-2 border-transparent hover:border-[#c1cf98] active:border-[#c1cf98] transition-all duration-300 cursor-pointer"
                        >
                            <img
                                src={coachesImg}
                                alt="Coaches"
                                className="w-full h-auto block"
                            />
                        </div>

                        {/* Новое предложение под картинкой: отступ только здесь */}
                        <div className="hidden md:block mt-6 md:pl-10">
                            <p className="text-[#c1cf98] md:text-lg lg:text-[21px] leading-tight font-medium">
                                Unlock professional guidance and choose your mentor to reach new heights.
                            </p>
                        </div>
                    </div>

                    {/* Контентная область (Правая колонка) */}
                    <div className="md:contents [grid-area:content] flex flex-col h-full">

                        {/* Блок с текстом: на мобилке h-full + justify-between разносит предложения, на десктопе возвращаем стандарт */}
                        <div className="md:[grid-area:text1] px-2 md:pl-8 md:pr-12 py-2 md:pt-2 flex flex-col justify-between h-full md:h-auto md:block md:space-y-4">

                            {/* Это предложение на мобилке сверху, на десктопе просто первый абзац */}
                            <div className="block">
                                <p className="text-[#c1cf98] text-[18px] md:text-xl lg:text-[23px] leading-tight font-medium max-w-[95%] md:max-w-none">
                                    Make every session a game.
                                </p>
                            </div>

                            {/* Эти абзацы видны только на десктопе, как и было в оригинале */}
                            <p className="hidden md:block text-[#c1cf98] md:text-xl lg:text-[23px] leading-tight font-medium md:max-w-none">
                                Equip your avatar with exclusive gear and watch your hero evolve. Every workout becomes a quest to power up your hero: earn XP, unlock rare artifacts, and customize your path to the top.
                            </p>

                            <p className="hidden md:block text-[#c1cf98] md:text-xl lg:text-[23px] leading-tight font-medium md:max-w-none">
                                Our intelligent AI-Chat instantly adapts your program based on your progress, providing real-time advice to keep you supported at every stage of your fitness adventure.
                            </p>

                            {/* Это предложение на мобилке прилипнет к низу контейнера, на десктопе оно скрыто (так как уже есть в тексте выше) */}
                            <div className="block md:hidden">
                                <p className="text-[#c1cf98] text-[18px] leading-tight font-medium max-w-[95%]">
                                    Equip your avatar with exclusive gear and watch your hero evolve.
                                </p>
                            </div>
                        </div>

                        {/* Планы - без изменений */}
                        <div className="md:[grid-area:plans] flex items-stretch justify-end mt-auto md:mt-0 md:pb-6 md:min-h-0">
                            <div
                                onClick={() => navigate('/subscription')}
                                className="w-full md:w-[400px] h-36 md:h-60 lg:h-64 rounded-l-[50px] md:rounded-l-[100px] md:rounded-r-none overflow-hidden shadow-2xl relative border-2 border-transparent cursor-pointer hover:border-[#c1cf98] active:border-[#c1cf98] transition-all duration-300 group"
                            >
                                <img src={plansImg} alt="Plans"
                                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                            </div>
                        </div>

                        {/* Текст (только десктоп) - без изменений */}
                        <div className="hidden md:flex md:[grid-area:text2] px-2 md:pl-8 md:pr-10 py-4 md:items-start md:min-h-0">
                            <p className="text-[#c1cf98] text-[18px] md:text-lg lg:text-[21px] leading-tight font-medium w-full max-w-none">
                                Your fitness journey is now an adventure! Join a community, participate in raids, and prove your strength.
                                <span className="hidden md:inline"> Dive into a world of seamless gamification where your daily activity fuels the growth of your digital avatar.</span>
                            </p>
                        </div>
                    </div>

                    {/* Календарь */}
                    <div className="[grid-area:calendar] flex items-end mt-4 md:mt-0 md:min-h-0">
                        <div className="w-[85%] md:w-full overflow-hidden">
                            <Calendar
                                isEdge={true}
                                trainings={sessions}
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