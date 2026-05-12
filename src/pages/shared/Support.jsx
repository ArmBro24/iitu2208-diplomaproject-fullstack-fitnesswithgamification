import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCopy } from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';
import TrainerDrawer from '../../components/trainer/TrainerDrawer.jsx';
import { createTrainerNavItems } from '../../components/trainer/trainerNavigation.js';
import supportImg from '../../assets/support.png';
import { getActiveRole, getSharedBackPath } from '../../utils/roleRouting.js';

const phoneNumbers = [
    '+7 (777) 777 77 77',
    '+7 (701) 111 24 24',
    '+7 (747) 880 90 12',
    '+7 (705) 555 15 15',
];

const Support = () => {
    const [copiedId, setCopiedId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
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
        activeView: 'support',
        onDashboard: () => navigateFromSidebar('/trainer/dashboard'),
        onClients: () => navigateFromSidebar('/trainer/dashboard', { trainerView: 'clients' }),
        onSchedule: () => navigateFromSidebar('/trainer/dashboard', { trainerView: 'schedule' }),
        onEvents: () => navigateFromSidebar('/events', { backPath: '/trainer/dashboard' }),
        onAttendance: () => navigateFromSidebar('/trainer/dashboard', { trainerView: 'attendance' }),
        onProfile: () => navigateFromSidebar('/trainer/dashboard', { trainerView: 'profile' }),
        onSupport: closeSidebar,
    });

    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedId(index);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <Background>
            <div className="relative h-screen overflow-hidden text-white">
                <div className="absolute inset-0 z-0">
                    <img src={supportImg} alt="Support" className="h-full w-full object-cover object-[70%_center]" />
                    <div className="absolute inset-0 bg-black/45" />
                </div>

                {isTrainerMode && (
                    <TrainerDrawer
                        isOpen={isSidebarOpen}
                        items={trainerNavItems}
                        onClose={closeSidebar}
                        onOpen={() => setIsSidebarOpen(true)}
                        onLogout={() => navigateFromSidebar('/login')}
                    />
                )}

                <nav className={`relative z-30 flex items-center px-6 py-6 md:px-10 md:py-8 ${isTrainerMode ? 'md:pl-24' : ''}`}>
                    <button
                        onClick={() => navigate(backPath, backState ? { state: backState } : undefined)}
                        aria-label="Back"
                        className="rounded-xl border border-white/10 bg-white/15 p-2 text-2xl transition-all hover:bg-white/25 active:scale-95 md:rounded-2xl md:p-3 md:text-3xl"
                    >
                        <FiArrowLeft className="text-yellow-100/80"/>
                    </button>

                    {/* Добавлен flex-grow и настроен pr для идеальной центровки */}
                    <h1 className="flex-grow text-center text-2xl font-medium tracking-tight text-yellow-100/80 md:text-3xl pr-10 md:pr-14">
                        Support
                    </h1>
                </nav>

                <div className="relative z-10 flex flex-grow flex-col items-center justify-start px-6 pt-12 md:pt-0">
                    <div className="relative w-full max-w-[380px] py-14 md:-mt-8 md:max-w-[500px] md:py-20">
                        <div className="absolute inset-0 z-0 flex items-center justify-center">
                            <div
                                className="h-full w-full scale-x-[1.6] scale-y-[1.3] md:scale-x-[1.5] md:scale-y-[1.2]">
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                        backdropFilter: 'blur(3px)',
                                        WebkitBackdropFilter: 'blur(3px)',
                                        WebkitClipPath: 'url(#blobClipPercent)',
                                        clipPath: 'url(#blobClipPercent)',
                                    }}
                                />
                            </div>

                            <svg width="0" height="0" className="absolute">
                                <defs>
                                    <clipPath id="blobClipPercent" clipPathUnits="objectBoundingBox">
                                        <path d="M0.725,0.125C0.791,0.158,0.845,0.223,0.876,0.296C0.906,0.369,0.914,0.449,0.906,0.527C0.897,0.604,0.872,0.679,0.828,0.741C0.783,0.804,0.719,0.854,0.648,0.88C0.578,0.906,0.501,0.907,0.422,0.891C0.343,0.875,0.262,0.84,0.201,0.783C0.14,0.725,0.098,0.643,0.086,0.559C0.075,0.475,0.093,0.388,0.139,0.318C0.185,0.249,0.257,0.196,0.328,0.164C0.399,0.133,0.469,0.123,0.542,0.111C0.616,0.099,0.658,0.093,0.725,0.125Z" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>

                        <div className="relative z-10 flex w-full flex-col items-center text-center">
                            <h1 className="mb-1 text-3xl font-black tracking-tight text-[#1a120d] md:text-5xl">HeroFit</h1>
                            <p className="mb-6 text-xl text-[#c1cf98] md:mb-10 md:text-2xl">is here for you!</p>

                            <div className="mb-8 flex w-full max-w-[260px] flex-col gap-3 md:mb-10 md:max-w-[320px]">
                                {phoneNumbers.map((num, index) => (
                                    <button
                                        key={num}
                                        onClick={() => copyToClipboard(num, index)}
                                        className="group relative flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3.5 backdrop-blur-md transition-all hover:border-[#c1cf98]"
                                    >
                                        <span className="text-[14px] font-medium text-white/90 md:text-lg">{num}</span>
                                        <div className="absolute right-5 flex flex-col items-center">
                                            {copiedId === index && (
                                                <span className="absolute bottom-full mb-2 rounded-md bg-[#c1cf98] px-2 py-1 text-[10px] font-bold text-[#1a120d] shadow-lg">
                                                    Copied!
                                                </span>
                                            )}
                                            <FiCopy className="text-[#c1cf98] opacity-60 transition-opacity group-hover:opacity-100" />
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <p className="max-w-[280px] text-[15px] font-medium leading-snug text-yellow-100/80 drop-shadow-sm md:max-w-[340px] md:text-base">
                                Don&apos;t worry, you&apos;re not alone on this journey. The same support page can serve clients, trainers, and admins while admin editing is added separately.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    );
};

export default Support;
