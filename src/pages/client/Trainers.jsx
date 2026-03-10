import React, { useState } from 'react';
import { FiArrowLeft, FiSearch, FiX } from 'react-icons/fi'; // Добавил FiX для закрытия
import Background from '../../components/common/Background.jsx';

// Импорт картинок тренеров
import tr1 from '../../assets/trainers/trainer1.jpg';
import tr2 from '../../assets/trainers/trainer2.jpg';
import tr3 from '../../assets/trainers/trainer3.jpg';
import tr4 from '../../assets/trainers/trainer4.jpg';
import tr5 from '../../assets/trainers/trainer5.jpg';

const trainersData = [
    { id: 1, name: "Alex", surname: "Rivers", img: tr1 },
    { id: 2, name: "Sarah", surname: "Jenkins", img: tr2 },
    { id: 3, name: "Marcus", surname: "Strong", img: tr3 },
    { id: 4, name: "Elena", surname: "Vance", img: tr4 },
    { id: 5, name: "David", surname: "Stone", img: tr5 },
];

const Trainers = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const filteredTrainers = trainersData.filter(trainer =>
        `${trainer.name} ${trainer.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (isSearchOpen) setSearchTerm(''); // Сброс при закрытии
    };

    return (
        <Background>
            <div className="relative min-h-screen text-white font-rubik flex flex-col overflow-y-auto no-scrollbar">

                {/* HEADER */}
                <nav className="relative z-30 px-6 md:px-10 py-6 md:py-8 flex items-center justify-between shrink-0">
                    <button
                        onClick={onBack}
                        className="text-2xl md:text-3xl p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all hover:scale-105 active:scale-95"
                    >
                        <FiArrowLeft className="text-[#c1cf98]"/>
                    </button>

                    <h1 className="text-yellow-100/80 text-2xl md:text-3xl font-medium tracking-tight">
                        Coaches
                    </h1>

                    <button
                        onClick={toggleSearch}
                        className="text-2xl md:text-3xl p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all hover:scale-105 active:scale-95"
                    >
                        {isSearchOpen ? <FiX className="text-[#c1cf98]"/> : <FiSearch className="text-[#c1cf98]"/>}
                    </button>
                </nav>

                {/* ANIMATED SEARCH BAR */}
                <div className={`relative z-20 px-6 md:px-16 transition-all duration-300 ease-in-out overflow-hidden ${
                    isSearchOpen ? 'max-h-20 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
                }`}>
                    <div className="relative max-w-md mx-auto">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c1cf98]/60 text-xl"/>
                        <input
                            autoFocus={isSearchOpen}
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/10 border-2 border-[#c1cf98]/20 focus:border-[#c1cf98]/50 rounded-2xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-white/20 text-white"
                        />
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="relative z-10 flex flex-col flex-grow">
                    {filteredTrainers.length > 0 ? (
                        <div
                            className="flex items-center overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 md:px-16 gap-6 md:gap-10 py-4">
                            {filteredTrainers.map((trainer) => (
                                <div
                                    key={trainer.id}
                                    className="relative flex-none w-[85%] sm:w-[60%] md:w-[320px] aspect-[3/4] md:aspect-[4/5]
                                               rounded-[40px] overflow-hidden snap-center
                                               group cursor-pointer border-2 border-transparent
                                               hover:border-[#c1cf98] transition-all duration-300 shadow-2xl"
                                >
                                    <img
                                        src={trainer.img}
                                        alt={trainer.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"/>

                                    <div className="absolute bottom-8 left-8">
                                        <h2 className="text-3xl md:text-4xl font-black text-white leading-none">
                                            {trainer.name}<br/>{trainer.surname}
                                        </h2>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center py-20">
                            <p className="text-red-400/60 text-xl md:text-2xl font-medium">
                                No results found
                            </p>
                            <button
                                onClick={() => setSearchTerm('')}
                                className="mt-4 text-[#c1cf98]/50 hover:text-[#c1cf98] transition-colors underline"
                            >
                                Clear search
                            </button>
                        </div>
                    )}

                    {/* BOTTOM DESCRIPTION */}
                    <div className="px-6 md:px-16 py-8 md:py-12 shrink-0">
                        <div className="flex items-center gap-4 mb-4 md:mb-6">
                            <h3 className="text-white/70 text-2xl md:text-4xl font-bold tracking-tight">
                                Mentors <span className="text-[#c1cf98]/80">&</span> Experts
                            </h3>
                            <div className="h-[1px] flex-grow bg-white/10 hidden md:block"></div>
                        </div>
                        <p className="text-[#c1cf98]/90 text-lg md:text-2xl font-medium leading-relaxed w-full max-w-5xl">
                            Train with our best coaches and get the guidance you need to reach your goals.
                            Every session is a chance to learn new skills, stay motivated, and grow stronger
                            with the support of professionals who care.
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

export default Trainers;