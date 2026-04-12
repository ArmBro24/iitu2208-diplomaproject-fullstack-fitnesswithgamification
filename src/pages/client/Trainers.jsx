import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiX } from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';
import useStore from '../../store/useStore'; // Импортируем стор

const Trainers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();

    // Достаем данные и экшен из стора
    const { trainers, setSelectedTrainer } = useStore();

    // Фильтрация работает с данными из стора
    const filteredTrainers = trainers.filter(trainer =>
        `${trainer.name} ${trainer.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (isSearchOpen) setSearchTerm('');
    };

    return (
        <Background>
            <div className="relative min-h-screen text-white font-rubik flex flex-col overflow-y-auto no-scrollbar">

                {/* HEADER */}
                <nav className="relative z-30 px-6 md:px-10 py-6 md:py-8 flex items-center justify-between shrink-0">
                    <button
                        onClick={() => navigate('/home')}
                        className="text-2xl md:text-3xl p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all active:scale-95"
                    >
                        <FiArrowLeft className="text-[#c1cf98]"/>
                    </button>

                    <h1 className="text-yellow-100/80 text-2xl md:text-3xl font-medium tracking-tight">
                        Coaches
                    </h1>

                    <button
                        onClick={toggleSearch}
                        className="text-2xl md:text-3xl p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all active:scale-95"
                    >
                        {isSearchOpen ? <FiX className="text-[#c1cf98]"/> : <FiSearch className="text-[#c1cf98]"/>}
                    </button>
                </nav>

                {/* SEARCH BAR */}
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

                {/* LIST CONTENT */}
                <div className="relative z-10 flex flex-col flex-grow">
                    {filteredTrainers.length > 0 ? (
                        <div className="flex items-center overflow-x-auto no-scrollbar snap-x snap-mandatory gap-6 md:gap-10 py-4">
                            <div className="min-w-[1.5rem] md:min-w-[4rem] shrink-0" />

                            {filteredTrainers.map((trainer) => (
                                <div
                                    key={trainer.id}
                                    onClick={() => {
                                        setSelectedTrainer(trainer); // Обновляем глобальный стейт
                                        navigate('/trainer-profile'); // Переходим в профиль
                                    }}
                                    className="relative flex-none w-[80vw] sm:w-[60%] md:w-[320px] aspect-[3/4] md:aspect-[4/5]
                                               rounded-[40px] overflow-hidden snap-center
                                               group cursor-pointer border-2 border-transparent
                                               hover:border-[#c1cf98] transition-all duration-300 shadow-2xl"
                                >
                                    <img
                                        src={trainer.img}
                                        alt={trainer.name}
                                        className="absolute inset-0 w-full h-full object-cover object-top"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"/>
                                    <div className="absolute bottom-8 left-8">
                                        <h2 className="text-3xl md:text-4xl font-black text-white leading-none">
                                            {trainer.name}<br/>{trainer.surname}
                                        </h2>
                                    </div>
                                </div>
                            ))}

                            <div className="min-w-[1.5rem] md:min-w-[4rem] shrink-0" />
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center py-20">
                            <p className="text-red-400/60 text-xl md:text-2xl font-medium">No results found</p>
                            <button onClick={() => setSearchTerm('')} className="mt-4 text-[#c1cf98]/50 hover:text-[#c1cf98] transition-colors underline">
                                Clear search
                            </button>
                        </div>
                    )}

                    {/* DESCRIPTION */}
                    <div className="px-6 md:px-16 py-8 md:py-12 shrink-0">
                        <div className="flex items-center gap-4 mb-4 md:mb-6">
                            <h3 className="text-white/70 text-2xl md:text-4xl font-bold tracking-tight">
                                Mentors <span className="text-[#c1cf98]/80">&</span> Experts
                            </h3>
                            <div className="h-[1px] flex-grow bg-white/10 hidden md:block"></div>
                        </div>
                        <p className="text-[#c1cf98]/90 text-lg md:text-2xl font-medium leading-relaxed w-full max-w-5xl">
                            Train with our best coaches and get the guidance you need to reach your goals.
                        </p>
                    </div>
                </div>
            </div>
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </Background>
    );
};

export default Trainers;