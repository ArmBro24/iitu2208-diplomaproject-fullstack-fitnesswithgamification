import {
    FiActivity,
    FiCalendar,
    FiHelpCircle,
    FiHome,
    FiUser,
    FiUsers,
} from 'react-icons/fi';

export const createTrainerNavItems = ({
    activeView,
    onDashboard,
    onClients,
    onSchedule,
    onEvents,
    onAttendance,
    onProfile,
    onSupport,
}) => [
    {
        label: 'Dashboard',
        icon: FiHome,
        active: activeView === 'dashboard',
        onClick: onDashboard,
    },
    {
        label: 'Clients',
        icon: FiUsers,
        active: activeView === 'clients',
        onClick: onClients,
    },
    {
        label: 'Schedule',
        icon: FiCalendar,
        active: activeView === 'schedule',
        onClick: onSchedule,
    },
    {
        label: 'Events',
        icon: FiActivity,
        active: activeView === 'events',
        onClick: onEvents,
    },
    {
        label: 'Attendance',
        icon: FiActivity,
        active: activeView === 'attendance',
        onClick: onAttendance,
    },
    {
        label: 'Profile',
        icon: FiUser,
        active: activeView === 'profile',
        onClick: onProfile,
    },
    {
        label: 'Support',
        icon: FiHelpCircle,
        active: activeView === 'support',
        onClick: onSupport,
    },
];
