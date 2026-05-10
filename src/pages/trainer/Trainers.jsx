import useStore from '../../store/useStore';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TrainerClientsView from '../../components/trainer/TrainerClientsView.jsx';
import TrainerAssignWorkoutView from '../../components/trainer/TrainerAssignWorkoutView.jsx';
import TrainerAttendanceView from '../../components/trainer/TrainerAttendanceView.jsx';
import TrainerClientDetailsView from '../../components/trainer/TrainerClientDetailsView.jsx';
import TrainerHomeView from '../../components/trainer/TrainerHomeView.jsx';
import TrainerProfileView from '../../components/trainer/TrainerProfileView.jsx';
import TrainerScheduleView from '../../components/trainer/TrainerScheduleView.jsx';
import TrainerDrawer from '../../components/trainer/TrainerDrawer.jsx';
import { createTrainerNavItems } from '../../components/trainer/trainerNavigation.js';
import AIChat from '../../components/ai/AIChat.jsx';
import {
    grainGradient,
    initialAssignedWorkouts,
    initialClients,
    initialScheduleItems,
    noiseStyle
} from '../../components/trainer/trainerData.js';
import { setActiveRole } from '../../utils/roleRouting.js';

const TRAINER_STORAGE_KEY = 'herofit-trainer-dashboard';

const Trainers = ({ onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { clients: storeClients, fetchMyClients, createTraining, fetchSessions, sessions, currentUser } = useStore();
    const currentCoachId = currentUser?.id;

    const [view, setView] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAIChatOpen, setIsAIChatOpen] = useState(false);
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
        if (typeof document === 'undefined') return undefined;

        const previousBodyOverflow = document.body.style.overflow;
        const previousBodyHeight = document.body.style.height;
        const previousHtmlOverflow = document.documentElement.style.overflow;
        const previousHtmlHeight = document.documentElement.style.height;

        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
        document.documentElement.style.overflow = 'hidden';
        document.documentElement.style.height = '100vh';

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.body.style.height = previousBodyHeight;
            document.documentElement.style.overflow = previousHtmlOverflow;
            document.documentElement.style.height = previousHtmlHeight;
        };
    }, []);

    useEffect(() => {
        const requestedView = location.state?.trainerView;
        if (!requestedView) return;

        if (requestedView === 'clients') {
            setClientsSubView('list');
            setView('clients');
            return;
        }

        setView(requestedView);
    }, [location.state]);

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

    const closeSidebar = () => setIsSidebarOpen(false);

    const handleSidebarNavigation = (action) => {
        action();
        closeSidebar();
    };

    const trainerNavItems = createTrainerNavItems({
        activeView: view,
        onDashboard: () => handleSidebarNavigation(() => handleRootNavigation('dashboard')),
        onClients: () => handleSidebarNavigation(openClientsList),
        onSchedule: () => handleSidebarNavigation(() => handleRootNavigation('schedule')),
        onEvents: () => handleSidebarNavigation(() => navigate('/events', { state: { backPath: '/trainer/dashboard' } })),
        onAttendance: () => handleSidebarNavigation(() => handleRootNavigation('attendance')),
        onProfile: () => handleSidebarNavigation(() => handleRootNavigation('profile')),
        onSupport: () => handleSidebarNavigation(() => navigate('/support', { state: { backPath: '/trainer/dashboard' } })),
    });

    return (
        <div className="fixed inset-0 overflow-hidden bg-[#111412] px-0 py-0 text-white md:p-6">
            <div className="mx-auto h-full max-w-[1320px] overflow-hidden bg-[#161916] md:rounded-[38px] md:border md:border-white/10 md:shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                <div className="relative h-full overflow-hidden">
                    <div className="absolute inset-0 bg-[#151716]" />
                    <div className="absolute inset-0 opacity-95" style={{ background: grainGradient }} />
                    <div className="absolute inset-0 opacity-45 mix-blend-soft-light" style={noiseStyle} />

                    <div className="relative z-10 mx-auto h-full max-w-[1260px]">
                        <TrainerDrawer
                            isOpen={isSidebarOpen}
                            items={trainerNavItems}
                            onClose={closeSidebar}
                            onOpen={() => setIsSidebarOpen(true)}
                            onLogout={() => handleSidebarNavigation(onLogout)}
                        />

                        <main className="h-full w-full overflow-y-auto overflow-x-hidden">
                            {view === 'dashboard' && (
                                <TrainerHomeView
                                    onOpenClients={openClientsList}
                                    onOpenSchedule={() => setView('schedule')}
                                    onOpenProfile={() => setView('profile')}
                                    onOpenAIChat={() => setIsAIChatOpen(true)}
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
                                    onOpenDetails={openClientDetails}
                                    clients={clients}
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

                        {isAIChatOpen && (
                            <AIChat onClose={() => setIsAIChatOpen(false)} />
                        )}

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
