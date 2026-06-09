import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';
import TrainerDrawer from '../../components/trainer/TrainerDrawer.jsx';
import { createTrainerNavItems } from '../../components/trainer/trainerNavigation.js';
import { getActiveRole, getSharedBackPath } from '../../utils/roleRouting.js';

import ev1 from '../../assets/events/ev1.jpg';
import ev2 from '../../assets/events/ev2.jpg';
import ev3 from '../../assets/events/ev3.jpg';
import ev4 from '../../assets/events/ev4.jpg';
import ev5 from '../../assets/events/ev5.jpg';

const eventsData = [
    { id: 1, title: 'Fitness Flashmob', date: '25 Sep', img: ev1 },
    { id: 2, title: 'FitHero Marathon', date: '8 Oct', img: ev2 },
    { id: 3, title: 'Workshop', date: '23 Dec', img: ev3 },
    { id: 4, title: 'FitHero Cafe Opening', date: '6 Jan', img: ev4 },
    { id: 5, title: 'Black Friday', date: '28 Nov', img: ev5 },
];

const Events = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const backPath = location.state?.backPath ?? getSharedBackPath();
    const backState = location.state?.trainerView ? { trainerView: location.state.trainerView } : undefined;
    const activeRole = getActiveRole();
    const isTrainerMode = activeRole === 'coach' || activeRole === 'trainer' || backPath === '/trainer/dashboard';

    const closeSidebar = () => setIsSidebarOpen(false);
    const navigateFromSidebar = (path, state) => {
        navigate(path, state ? { state } : undefined);
        closeSidebar();
    };

    const trainerNavItems = createTrainerNavItems({
        activeView: 'events',
        onDashboard: () => navigateFromSidebar('/trainer/dashboard'),
        onClients: () => navigateFromSidebar('/trainer/dashboard', { trainerView: 'clients' }),
        onSchedule: () => navigateFromSidebar('/trainer/dashboard', { trainerView: 'schedule' }),
        onEvents: closeSidebar,
        onAttendance: () => navigateFromSidebar('/trainer/dashboard', { trainerView: 'attendance' }),
        onProfile: () => navigateFromSidebar('/trainer/dashboard', { trainerView: 'profile' }),
        onSupport: () => navigateFromSidebar('/support', { backPath: '/trainer/dashboard' }),
    });

    return (
        <Background>
            <div className="relative min-h-screen overflow-y-auto text-white">
                {isTrainerMode && (
                    <TrainerDrawer
                        isOpen={isSidebarOpen}
                        items={trainerNavItems}
                        onClose={closeSidebar}
                        onOpen={() => setIsSidebarOpen(true)}
                        onLogout={() => navigateFromSidebar('/login')}
                        triggerMode="page"
                    />
                )}

                <nav className={`relative z-20 flex items-center px-6 py-6 md:px-10 md:py-8 ${isTrainerMode ? 'pl-20 md:pl-24' : ''}`}>
                    <button
                        onClick={() => navigate(backPath, backState ? { state: backState } : undefined)}
                        aria-label="Back"
                        className="rounded-xl border border-white/10 bg-white/5 p-2 text-2xl transition-all hover:bg-white/10 active:scale-95 md:rounded-2xl md:p-3 md:text-3xl"
                    >
                        <FiArrowLeft className="text-[#c1cf98]"/>
                    </button>

                    {/* Добавлен класс flex-grow и исправлен pr */}
                    <h1 className="flex-grow text-center text-2xl font-medium tracking-tight text-yellow-100/80 md:text-3xl pr-10 md:pr-14">
                        Events
                    </h1>
                </nav>

                <div className="relative z-10 flex flex-col">
                    <div
                        className="flex snap-x snap-mandatory items-center gap-6 overflow-x-auto px-6 py-4 md:gap-10 md:px-16 md:py-6">
                        {eventsData.map((event) => (
                            <div
                                key={event.id}
                                className="group relative aspect-[3/4] w-[85%] flex-none snap-center overflow-hidden rounded-[40px] border-2 border-transparent shadow-2xl transition-all duration-300 hover:border-[#c1cf98] sm:w-[60%] md:w-[350px] md:aspect-[4/5]"
                            >
                                <img src={event.img} alt={event.title} className="absolute inset-0 h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-black/10 p-8 text-center">
                                    <div className="flex h-full flex-col items-center justify-center">
                                        <h2 className="mb-2 text-3xl font-black leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] md:text-4xl">
                                            {event.title}
                                        </h2>
                                        <p className="text-xl font-bold uppercase tracking-wider text-yellow-100/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] md:text-2xl">
                                            {event.date}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="px-6 py-6 md:px-16 md:py-10">
                        <div className="mb-4 flex items-center gap-4 md:mb-6">
                            <h3 className="text-2xl font-bold tracking-tight text-white/70 md:text-4xl">
                                Community <span className="text-[#c1cf98]/80">&amp;</span> Spirit
                            </h3>
                            <div className="hidden h-[2px] flex-grow bg-white/10 md:block" />
                        </div>

                        <p className="w-full max-w-5xl text-lg font-medium leading-relaxed text-[#c1cf98]/90 md:text-2xl">
                            Join marathons, flashmobs, and special challenges with the same events page for every role. The experience stays shared, while admin editing can be layered on top later.
                        </p>
                    </div>
                </div>
            </div>
        </Background>
    );
};

export default Events;
