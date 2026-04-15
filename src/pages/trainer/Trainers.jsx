import React, { useEffect, useMemo, useState } from 'react';
import {
    FiCalendar,
    FiCheckSquare,
    FiGrid,
    FiHome,
    FiUser
} from 'react-icons/fi';
import TrainerClientsView from '../../components/trainer/TrainerClientsView.jsx';
import TrainerAssignWorkoutView from '../../components/trainer/TrainerAssignWorkoutView.jsx';
import TrainerAttendanceView from '../../components/trainer/TrainerAttendanceView.jsx';
import TrainerClientDetailsView from '../../components/trainer/TrainerClientDetailsView.jsx';
import TrainerHomeView from '../../components/trainer/TrainerHomeView.jsx';
import TrainerProfileView from '../../components/trainer/TrainerProfileView.jsx';
import TrainerScheduleView from '../../components/trainer/TrainerScheduleView.jsx';
import {
    grainGradient,
    initialAssignedWorkouts,
    initialClients,
    initialScheduleItems,
    noiseStyle
} from '../../components/trainer/trainerData.js';
import { DesktopNavButton } from '../../components/trainer/TrainerShared.jsx';

const TRAINER_STORAGE_KEY = 'herofit-trainer-dashboard';

const Trainers = ({ onLogout }) => {
    const [view, setView] = useState('home');
    const [clients, setClients] = useState(() => readStoredState().clients ?? initialClients);
    const [assignedWorkouts, setAssignedWorkouts] = useState(() => readStoredState().assignedWorkouts ?? initialAssignedWorkouts);
    const [scheduleItems, setScheduleItems] = useState(() => readStoredState().scheduleItems ?? initialScheduleItems);
    const [selectedClientId, setSelectedClientId] = useState(() => readStoredState().selectedClientId ?? initialClients[0].id);

    const selectedClient = useMemo(
        () => clients.find((client) => client.id === selectedClientId) ?? clients[0],
        [clients, selectedClientId]
    );

    const handleAssignWorkout = ({ clientId, workout, dueDate, timeSlot }) => {
        const client = clients.find((item) => item.id === clientId);
        if (!client) return;

        const scheduleLabel = `${timeSlot}`;

        setClients((currentClients) =>
            currentClients.map((item) =>
                item.id === clientId
                    ? {
                        ...item,
                        nextWorkout: workout,
                        status: 'On track',
                    }
                    : item
            )
        );

        setAssignedWorkouts((current) => [
            {
                id: Date.now(),
                client: client.name,
                workout,
                time: scheduleLabel,
                status: 'upcoming',
            },
            ...current,
        ]);

        setScheduleItems((current) => [
            {
                id: Date.now() + 1,
                name: workout,
                client: client.name,
                time: scheduleLabel,
                status: 'upcoming',
            },
            ...current,
        ]);

        setView('schedule');
    };

    const handleAttendanceStatusChange = (sessionId, nextStatus) => {
        setScheduleItems((current) =>
            current.map((item) =>
                item.id === sessionId
                    ? {
                        ...item,
                        status: nextStatus,
                    }
                    : item
            )
        );

        setAssignedWorkouts((current) =>
            current.map((item) =>
                item.id === sessionId
                    ? {
                        ...item,
                        status: nextStatus,
                    }
                    : item
            )
        );
    };

    const handleRequestProgressUpdate = (clientId) => {
        const timestamp = formatRequestTimestamp();

        setClients((currentClients) =>
            currentClients.map((item) =>
                item.id === clientId
                    ? {
                        ...item,
                        status: 'Update requested',
                        progressRequestPending: true,
                        lastProgressRequest: timestamp,
                        note: 'Progress update requested. Waiting for the client to upload the latest workout results.',
                        activity: [
                            { title: 'Progress update requested', subtitle: timestamp },
                            ...(item.activity ?? []),
                        ].slice(0, 5),
                    }
                    : item
            )
        );
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const payload = {
            clients,
            assignedWorkouts,
            scheduleItems,
            selectedClientId,
        };

        window.localStorage.setItem(TRAINER_STORAGE_KEY, JSON.stringify(payload));
    }, [assignedWorkouts, clients, scheduleItems, selectedClientId]);

    return (
        <div className="min-h-screen bg-[#111412] px-0 py-0 text-white md:px-6 md:py-8">
            <div className="mx-auto min-h-screen max-w-[1320px] overflow-hidden bg-[#161916] md:min-h-0 md:rounded-[38px] md:border md:border-white/10 md:shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                <div className="relative min-h-screen overflow-hidden">
                    <div className="absolute inset-0 bg-[#151716]" />
                    <div className="absolute inset-0 opacity-95" style={{ background: grainGradient }} />
                    <div className="absolute inset-0 opacity-45 mix-blend-soft-light" style={noiseStyle} />

                    <div className="relative z-10 mx-auto flex min-h-screen max-w-[1260px] flex-col lg:min-h-[920px] lg:flex-row">
                        <aside className="hidden lg:flex lg:w-[250px] lg:flex-col lg:justify-between lg:border-r lg:border-white/10 lg:bg-black/10 lg:p-8">
                            <div>
                                <p className="text-sm uppercase tracking-[0.35em] text-white/35">Trainer Mode</p>
                                <h2 className="mt-4 font-rubik text-4xl font-black text-[#a8a25f]">HeroFit</h2>
                                <p className="mt-4 text-sm leading-relaxed text-white/55">
                                    Previous dashboard structure, now restyled closer to your mobile concept.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <DesktopNavButton label="Home" active={view === 'home'} onClick={() => setView('home')} />
                                <DesktopNavButton label="Schedule" active={view === 'schedule'} onClick={() => setView('schedule')} />
                                <DesktopNavButton label="Attendance" active={view === 'attendance'} onClick={() => setView('attendance')} />
                                <DesktopNavButton label="My Clients" active={view === 'clients'} onClick={() => setView('clients')} />
                                <DesktopNavButton label="Client Details" active={view === 'clientDetails'} onClick={() => setView('clientDetails')} />
                                <DesktopNavButton label="Assign Workout" active={view === 'assign'} onClick={() => setView('assign')} />
                                <DesktopNavButton label="Profile" active={view === 'profile'} onClick={() => setView('profile')} />
                                <DesktopNavButton label="Log out" danger onClick={onLogout} />
                            </div>
                        </aside>

                        <main className="flex-1">
                            {view === 'home' && (
                                <TrainerHomeView
                                    onOpenSchedule={() => setView('schedule')}
                                    onOpenProfile={() => setView('profile')}
                                    clients={clients}
                                    assignedWorkouts={assignedWorkouts}
                                    selectedClient={selectedClient}
                                    selectedClientId={selectedClientId}
                                    setSelectedClientId={setSelectedClientId}
                                />
                            )}

                            {view === 'schedule' && (
                                <TrainerScheduleView
                                    onBack={() => setView('home')}
                                    onOpenAttendance={() => setView('attendance')}
                                    onOpenProfile={() => setView('profile')}
                                    scheduleItems={scheduleItems}
                                />
                            )}

                            {view === 'attendance' && (
                                <TrainerAttendanceView
                                    onBack={() => setView('home')}
                                    onOpenProfile={() => setView('profile')}
                                    onOpenClients={() => setView('clients')}
                                    sessions={scheduleItems}
                                    onChangeStatus={handleAttendanceStatusChange}
                                />
                            )}

                            {view === 'clients' && (
                                <TrainerClientsView
                                    onBack={() => setView('home')}
                                    onOpenDetails={() => setView('clientDetails')}
                                    onOpenProfile={() => setView('profile')}
                                    onAssignWorkout={() => setView('assign')}
                                    clients={clients}
                                    selectedClient={selectedClient}
                                    setSelectedClientId={setSelectedClientId}
                                />
                            )}

                            {view === 'clientDetails' && (
                                <TrainerClientDetailsView
                                    onBack={() => setView('clients')}
                                    onOpenProfile={() => setView('profile')}
                                    onAssignWorkout={() => setView('assign')}
                                    onRequestProgressUpdate={handleRequestProgressUpdate}
                                    selectedClient={selectedClient}
                                />
                            )}

                            {view === 'assign' && (
                                <TrainerAssignWorkoutView
                                    onBack={() => setView('clients')}
                                    onOpenProfile={() => setView('profile')}
                                    selectedClient={selectedClient}
                                    onAssignWorkout={handleAssignWorkout}
                                />
                            )}

                            {view === 'profile' && (
                                <TrainerProfileView
                                    onBack={() => setView('home')}
                                    onOpenClients={() => setView('clients')}
                                    onOpenSchedule={() => setView('schedule')}
                                    onLogout={onLogout}
                                />
                            )}
                        </main>

                        <MobileBottomNav currentView={view} onChange={setView} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const readStoredState = () => {
    if (typeof window === 'undefined') return {};

    try {
        const raw = window.localStorage.getItem(TRAINER_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};

const formatRequestTimestamp = () =>
    new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date());

const MobileBottomNav = ({ currentView, onChange }) => {
    const items = [
        { id: 'home', label: 'Home', icon: FiHome },
        { id: 'schedule', label: 'Schedule', icon: FiCalendar },
        { id: 'attendance', label: 'Attend.', icon: FiCheckSquare },
        { id: 'clients', label: 'Clients', icon: FiGrid },
        { id: 'profile', label: 'Profile', icon: FiUser },
    ];

    return (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[rgba(15,16,18,0.82)] px-4 py-3 backdrop-blur-xl lg:hidden">
            <div className="mx-auto flex max-w-[520px] items-center justify-around rounded-full border border-white/10 bg-black/20 px-3 py-2">
                {items.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => onChange(id)}
                        className={`flex min-w-[72px] flex-col items-center gap-1 rounded-full px-3 py-2 text-[11px] transition-all ${
                            currentView === id
                                ? 'bg-[rgba(138,137,80,0.38)] text-white'
                                : 'text-white/60'
                        }`}
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Trainers;
