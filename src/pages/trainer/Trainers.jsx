import useStore from '../../store/useStore';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { setActiveRole } from '../../utils/roleRouting.js';

const TRAINER_STORAGE_KEY = 'herofit-trainer-dashboard';

const Trainers = ({ onLogout }) => {
    const navigate = useNavigate();
    const { clients: storeClients, fetchMyClients, createTraining, fetchSessions, sessions, currentUser } = useStore();
    const currentCoachId = currentUser?.id;

    const [view, setView] = useState('dashboard');
    const [clientsSubView, setClientsSubView] = useState(() => readStoredState().clientsSubView ?? 'list');

    const [localClients, setLocalClients] = useState(() => readStoredState().clients ?? initialClients);

    const clients = useMemo(() => {
        return (storeClients && storeClients.length > 0) ? storeClients : localClients;
    }, [storeClients, localClients]);

    const setClients = React.useCallback((val) => {
        setLocalClients(val);
    }, []);
    const [assignedWorkouts, setAssignedWorkouts] = useState(() => readStoredState().assignedWorkouts ?? initialAssignedWorkouts);
    const [scheduleItems, setScheduleItems] = useState(() => readStoredState().scheduleItems ?? initialScheduleItems);
    const [selectedClientId, setSelectedClientId] = useState(() => readStoredState().selectedClientId ?? initialClients[0].id);

    const selectedClient = useMemo(
        () => clients.find((client) => client.id === selectedClientId) ?? clients[0],
        [clients, selectedClientId]
    );

    useEffect(() => {
        setActiveRole('trainer');
    }, []);

    useEffect(() => {
        if (currentCoachId) {
            fetchMyClients(currentCoachId);
        }
    }, [currentCoachId, fetchMyClients]);

    useEffect(() => {
        if (selectedClientId) {
            fetchSessions(selectedClientId);
        }
    }, [selectedClientId, fetchSessions]);

    const keyMetrics = useMemo(() => {
        const missedWorkouts = scheduleItems.filter((item) => item.status === 'missed').length;
        const pendingUpdates = clients.filter((item) => item.progressRequestPending).length;

        return [
            { title: 'Active Clients', value: String(clients.length), accent: 'olive' },
            { title: 'Sessions Today', value: String(scheduleItems.length), accent: 'violet' },
            { title: 'Pending Updates', value: String(pendingUpdates), accent: 'gold' },
            { title: 'Missed Workouts', value: String(missedWorkouts), accent: 'rose' },
        ];
    }, [clients, scheduleItems]);

    const handleAssignWorkout = async (data) => {
        try {
            await createTraining({
                coachId: currentCoachId,
                memberId: data.clientId,
                title: data.workout,
                startsAt: data.startsAt,
                endsAt: data.endsAt
            });

            setClients((currentClients) =>
                currentClients.map((item) =>
                    item.id === data.clientId
                        ? { ...item, nextWorkout: data.workout, status: 'On track' }
                        : item
                )
            );

            setView('schedule');

        } catch (error) {
            console.error("Failed to assign workout:", error);
            alert("Ошибка при сохранении тренировки на сервере.");
        }
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
            clientsSubView,
        };

        window.localStorage.setItem(TRAINER_STORAGE_KEY, JSON.stringify(payload));
    }, [assignedWorkouts, clients, clientsSubView, scheduleItems, selectedClientId]);

    const openClientsList = () => {
        setClientsSubView('list');
        setView('clients');
    };

    const openClientDetails = () => {
        setClientsSubView('details');
        setView('clients');
    };

    const openAssignWorkout = () => {
        setClientsSubView('assign');
        setView('clients');
    };

    const handleRootNavigation = (nextView) => {
        if (nextView === 'clients') {
            openClientsList();
            return;
        }

        setView(nextView);
    };

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
                                <DesktopNavButton label="Dashboard" active={view === 'dashboard'} onClick={() => handleRootNavigation('dashboard')} />
                                <DesktopNavButton label="Clients" active={view === 'clients'} onClick={openClientsList} />
                                <DesktopNavButton label="Schedule" active={view === 'schedule'} onClick={() => handleRootNavigation('schedule')} />
                                <DesktopNavButton label="Events" onClick={() => navigate('/events', { state: { backPath: '/trainer/dashboard' } })} />
                                <DesktopNavButton label="Attendance" active={view === 'attendance'} onClick={() => handleRootNavigation('attendance')} />
                                <DesktopNavButton label="Profile" active={view === 'profile'} onClick={() => handleRootNavigation('profile')} />
                                <DesktopNavButton label="Log out" danger onClick={onLogout} />
                            </div>
                        </aside>

                        <main className="flex-1">
                            {view === 'dashboard' && (
                                <TrainerHomeView
                                    onOpenClients={openClientsList}
                                    onOpenSchedule={() => setView('schedule')}
                                    onOpenProfile={() => setView('profile')}
                                    clients={clients}
                                    assignedWorkouts={assignedWorkouts}
                                    keyMetrics={keyMetrics}
                                    selectedClient={selectedClient}
                                    selectedClientId={selectedClientId}
                                    setSelectedClientId={setSelectedClientId}
                                />
                            )}

                            {view === 'schedule' && (
                                <TrainerScheduleView
                                    onBack={() => setView('dashboard')}
                                    onOpenAttendance={() => setView('attendance')}
                                    onOpenProfile={() => setView('profile')}
                                    scheduleItems={scheduleItems}
                                />
                            )}

                            {view === 'attendance' && (
                                <TrainerAttendanceView
                                    onBack={() => setView('schedule')}
                                    onOpenProfile={() => setView('profile')}
                                    sessions={scheduleItems}
                                    onChangeStatus={handleAttendanceStatusChange}
                                />
                            )}

                            {view === 'clients' && clientsSubView === 'list' && (
                                <TrainerClientsView
                                    onBack={() => setView('dashboard')}
                                    onOpenDetails={openClientDetails}
                                    onOpenProfile={() => setView('profile')}
                                    clients={clients}
                                    selectedClient={selectedClient}
                                    setSelectedClientId={setSelectedClientId}
                                />
                            )}

                            {view === 'clients' && clientsSubView === 'details' && (
                                <TrainerClientDetailsView
                                    onBack={openClientsList}
                                    onOpenProfile={() => setView('profile')}
                                    onAssignWorkout={openAssignWorkout}
                                    onRequestProgressUpdate={handleRequestProgressUpdate}
                                    selectedClient={selectedClient}
                                    clientSessions={sessions}
                                />
                            )}

                            {view === 'clients' && clientsSubView === 'assign' && (
                                <TrainerAssignWorkoutView
                                    onBack={openClientDetails}
                                    onOpenProfile={() => setView('profile')}
                                    selectedClient={selectedClient}
                                    onAssignWorkout={handleAssignWorkout}
                                />
                            )}

                            {view === 'profile' && (
                                <TrainerProfileView
                                    onBack={() => setView('dashboard')}
                                />
                            )}
                        </main>

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

export default Trainers;
