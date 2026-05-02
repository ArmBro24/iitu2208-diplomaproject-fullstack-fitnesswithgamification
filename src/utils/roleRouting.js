const ROLE_STORAGE_KEY = 'herofit-active-role';

export const setActiveRole = (role) => {
    if (typeof window === 'undefined') return;
    // Здесь role будет 'coach', 'member' или 'admin' (из Login.jsx)
    window.localStorage.setItem(ROLE_STORAGE_KEY, role);
};

export const getActiveRole = () => {
    if (typeof window === 'undefined') return 'member'; // По умолчанию лучше member
    return window.localStorage.getItem(ROLE_STORAGE_KEY) ?? 'member';
};

export const getRoleHomePath = (role = getActiveRole()) => {
    // Исправляем условия под значения из бэкенда
    if (role === 'coach') return '/trainer/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/home'; // Для 'member' и остальных
};

export const getSharedBackPath = (role = getActiveRole()) => {
    if (role === 'coach') return '/trainer/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/menu';
};