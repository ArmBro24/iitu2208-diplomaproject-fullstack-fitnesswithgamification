import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Добавлен импорт навигации
import { FiArrowLeft } from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';

// Импорт картинок из assets
import ev1 from '../../assets/events/ev1.jpg';
import ev2 from '../../assets/events/ev2.jpg';
import ev3 from '../../assets/events/ev3.jpg';
import ev4 from '../../assets/events/ev4.jpg';
import ev5 from '../../assets/events/ev5.jpg';

const eventsData = [
    { id: 1, title: "Fitness Flashmob", date: "25 Sep", img: ev1 },
    { id: 2, title: "FitHero Marathon", date: "8 Oct", img: ev2 },
    { id: 3, title: "Workshop", date: "23 Dec", img: ev3 },
    { id: 4, title: "FitHero Cafe Opening", date: "6 Jan", img: ev4 },
    { id: 5, title: "Black Friday", date: "28 Nov", img: ev5 },
];

const Events = () => {
    const navigate = useNavigate(); // 2. Инициализация хука

    return (
        <Background>
            <div className="relative min-h-screen text-white font-rubik flex flex-col overflow-y-auto no-scrollbar">

                {/* HEADER */}
                <nav className="relative z-20 px-6 md:px-10 py-6 md:py-8 flex items-center shrink-0">
                    <button
                        onClick={() => navigate('/menu')} // 3. Возврат в меню по роуту
                        className="text-2xl md:text-3xl p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all hover:scale-105 active:scale-95"
                    >
                        <FiArrowLeft className="text-[#c1cf98]"/>
                    </button>

                    <h1 className="flex-grow text-center text-yellow-100/80 text-2xl md:text-3xl font-medium tracking-tight pr-12">
                        Events
                    </h1>
                </nav>

                {/* MAIN CONTENT */}
                <div className="relative z-10 flex flex-col">

                    {/* HORIZONTAL CAROUSEL */}
                    <div className="flex items-center overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 md:px-16 gap-6 md:gap-10 py-4 md:py-6">
                        {eventsData.map((event) => (
                            <div
                                key={event.id}
                                className="relative flex-none w-[85%] sm:w-[60%] md:w-[350px] aspect-[3/4] md:aspect-[4/5]
                                           rounded-[40px] overflow-hidden snap-center
                                           group cursor-pointer border-2 border-transparent
                                           hover:border-[#c1cf98] active:border-[#c1cf98]
                                           transition-all duration-300 shadow-2xl"
                            >
                                <img
                                    src={event.img}
                                    alt={event.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                {/* Text Content */}
                                <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center bg-black/10">
                                    <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                                        {event.title}
                                    </h2>
                                    <p className="text-xl md:text-2xl font-bold text-yellow-100/90 uppercase tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                                        {event.date}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* BOTTOM DESCRIPTION */}
                    <div className="px-6 md:px-16 py-6 md:py-10 shrink-0">
                        <div className="flex items-center gap-4 mb-4 md:mb-6">
                            <h3 className="text-white/70 text-2xl md:text-4xl font-bold tracking-tight">
                                Community <span className="text-[#c1cf98]/80">&</span> Spirit
                            </h3>
                            <div className="h-[2px] flex-grow bg-white/10 hidden md:block"></div>
                        </div>

                        <p className="text-[#c1cf98]/90 text-lg md:text-2xl font-medium leading-relaxed w-full max-w-5xl">
                            Join marathons, flashmobs, and special challenges to push your limits and have fun with the
                            community.
                            Every event is a new opportunity to learn, grow, and connect with people who share your passion.
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </Background>
    );
};

export default Events;