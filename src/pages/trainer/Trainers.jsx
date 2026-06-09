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
    noiseStyle
} from '../../components/trainer/trainerData.js';
import { setActiveRole } from '../../utils/roleRouting.js';

const TRAINER_STORAGE_KEY = 'herofit-trainer-dashboard';

const Trainers = ({ onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        clients: storeClients,
        fetchMyClients,
        createTraining,
        fetchSessions,
        fetchTrainerSchedule,
        sessions,
        trainerScheduleSessions,
        currentUser
    } = useStore();
    const currentCoachId = currentUser?.id;

    const [view, setView] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAIChatOpen, setIsAIChatOpen] = useState(false);
    const [clientsSubView, setClientsSubView] = useState(() => readStoredState().clientsSubView ?? 'list');

    const clients = useMemo(() => {
        return Array.isArray(storeClients) ? storeClients : [];
    }, [storeClients]);

    const [assignedWorkouts, setAssignedWorkouts] = useState([]);
    const [scheduleItems, setScheduleItems] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState(() => readStoredState().selectedClientId ?? null);

    const selectedClient = useMemo(
        () => clients.find((client) => String(client.id) === String(selectedClientId)) ?? clients[0],
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

    useEffect(() => {
        if (!clients.length) {
            if (selectedClientId !== null) {
                setSelectedClientId(null);
            }
            return;
        }

        const hasSelectedClient = clients.some((client) => String(client.id) === String(selectedClientId));
        if (!hasSelectedClient) {
            setSelectedClientId(clients[0].id);
        }
    }, [clients, selectedClientId]);

    useEffect(() => {
        const clientIds = (storeClients ?? []).map((client) => client.id).filter(Boolean);
        fetchTrainerSchedule(clientIds, currentCoachId);
    }, [storeClients, currentCoachId, fetchTrainerSchedule]);

    useEffect(() => {
        const realScheduleItems = (trainerScheduleSessions ?? [])
            .map((session) => mapTrainingSessionToScheduleItem(session, clients))
            .sort((a, b) => new Date(a.startsAt || 0) - new Date(b.startsAt || 0));

        setScheduleItems(realScheduleItems);
        setAssignedWorkouts(realScheduleItems);
    }, [clients, trainerScheduleSessions]);

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
            const createdSession = await createTraining(data);
            const scheduleItem = mapTrainingSessionToScheduleItem(createdSession ?? data, clients);

            setScheduleItems((current) => upsertById(current, scheduleItem));
            setAssignedWorkouts((current) => upsertById(current, scheduleItem));

            setView('schedule');
        } catch (error) {
            console.error("Failed to assign workout:", error);
            alert(error.message || "Failed to save workout on the server.");
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

    const handleRequestProgressUpdate = () => {
        alert('Progress request needs a backend endpoint before it can update live client data.');
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const payload = {
            assignedWorkouts,
            scheduleItems,
            selectedClientId,
            clientsSubView,
        };

        window.localStorage.setItem(TRAINER_STORAGE_KEY, JSON.stringify(payload));
    }, [assignedWorkouts, clientsSubView, scheduleItems, selectedClientId]);

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
                        <main className="relative h-full w-full overflow-y-auto overflow-x-hidden">
                            <TrainerDrawer
                                isOpen={isSidebarOpen}
                                items={trainerNavItems}
                                onClose={closeSidebar}
                                onOpen={() => setIsSidebarOpen(true)}
                                onLogout={() => handleSidebarNavigation(onLogout)}
                                triggerMode="page"
                            />

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
                                    onBack={() => setView('dashboard')}
                                    onOpenDetails={openClientDetails}
                                    clients={clients}
                                    setSelectedClientId={setSelectedClientId}
                                />
                            )}

                            {view === 'clients' && clientsSubView !== 'list' && !selectedClient && (
                                <TrainerClientsView
                                    onBack={() => setView('dashboard')}
                                    onOpenDetails={openClientDetails}
                                    clients={clients}
                                    setSelectedClientId={setSelectedClientId}
                                />
                            )}

                            {view === 'clients' && clientsSubView === 'details' && selectedClient && (
                                <TrainerClientDetailsView
                                    onBack={openClientsList}
                                    onOpenProfile={() => setView('profile')}
                                    onAssignWorkout={openAssignWorkout}
                                    onRequestProgressUpdate={handleRequestProgressUpdate}
                                    selectedClient={selectedClient}
                                    clientSessions={sessions}
                                    onRefreshData={() => fetchSessions(selectedClientId)}
                                />
                            )}

                            {view === 'clients' && clientsSubView === 'assign' && selectedClient && (
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
                            <AIChat
                                onClose={() => setIsAIChatOpen(false)}
                                selectedClient={selectedClient}
                                assignedWorkouts={assignedWorkouts}
                                scheduleItems={scheduleItems}
                            />
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

const upsertById = (items, nextItem) => {
    const exists = items.some((item) => item.id === nextItem.id);
    if (exists) {
        return items.map((item) => item.id === nextItem.id ? { ...item, ...nextItem } : item);
    }

    return [nextItem, ...items];
};

const mapTrainingSessionToScheduleItem = (session, clients) => {
    const startsAt = session.startsAt;
    const endsAt = session.endsAt;
    const client = clients.find((item) => Number(item.id) === Number(session.memberId));
    const startDate = startsAt ? new Date(startsAt) : null;
    const endDate = endsAt ? new Date(endsAt) : null;

    return {
        id: session.id ?? `local-${session.memberId}-${session.startsAt}`,
        name: session.title ?? session.name ?? 'Workout',
        workout: session.title ?? session.workout ?? session.name ?? 'Workout',
        client: client?.name ?? `User #${session.memberId}`,
        avatarUrl: client?.avatarUrl,
        memberId: session.memberId,
        coachId: session.coachId,
        startsAt,
        endsAt,
        time: formatSessionTime(startDate, endDate),
        status: mapTrainingStatus(session.status),
    };
};

const formatSessionTime = (startDate, endDate) => {
    if (!startDate || Number.isNaN(startDate.getTime())) return 'Time not set';

    const start = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const end = endDate && !Number.isNaN(endDate.getTime())
        ? endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : null;

    return end ? `${start} - ${end}` : start;
};

const mapTrainingStatus = (status) => {
    const normalized = String(status ?? 'REQUESTED').toUpperCase();

    if (normalized === 'MISSED') return 'missed';
    if (normalized === 'ATTENDED' || normalized === 'COMPLETED' || normalized === 'CONFIRMED') return 'present';
    if (normalized === 'LATE') return 'late';
    return 'upcoming';
};

export default Trainers;
