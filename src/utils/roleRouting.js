const ROLE_STORAGE_KEY = 'herofit-active-role';

export const setActiveRole = (role) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ROLE_STORAGE_KEY, role);
};

export const getActiveRole = () => {
    if (typeof window === 'undefined') return 'client';
    return window.localStorage.getItem(ROLE_STORAGE_KEY) ?? 'client';
};

export const getRoleHomePath = (role = getActiveRole()) => {
    if (role === 'trainer') return '/trainer/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/home';
};

export const getSharedBackPath = (role = getActiveRole()) => {
    if (role === 'trainer') return '/trainer/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/menu';
};
