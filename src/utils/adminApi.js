import api from './api.js';

const serviceRequests = [
    { id: 'auth', name: 'Auth Service', url: '/api/admin/users' },
    { id: 'training', name: 'Training Service', url: '/api/training/admin/overview' },
    { id: 'relationships', name: 'Mentorship Data', url: '/api/training/admin/relationships' },
    { id: 'challenges', name: 'Challenge Service', url: '/api/challenges/admin' },
];

const authConfig = () => ({
    headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token') ?? ''}`,
    },
});

export const fetchAdminDashboard = async () => {
    const settled = await Promise.allSettled(
        serviceRequests.map(async (service) => {
            const startedAt = performance.now();
            const response = await api.get(service.url, authConfig());
            return {
                ...service,
                data: response.data,
                latency: Math.round(performance.now() - startedAt),
            };
        })
    );

    const payload = {};
    const services = settled.map((result, index) => {
        const service = serviceRequests[index];

        if (result.status === 'fulfilled') {
            payload[service.id] = result.value.data;
            return { ...service, status: 'Online', latency: result.value.latency };
        }

        const status = result.reason?.response?.status;
        return {
            ...service,
            status: status === 403 ? 'Forbidden' : 'Unavailable',
            latency: null,
        };
    });

    return { payload, services };
};

export const createAdminChallenge = (challenge) =>
    api.post('/api/challenges', challenge, authConfig());

const API_BASE = '/api/training/admin';

export const fetchTrainingCategories = async () => {
    const response = await api.get(`${API_BASE}/categories`, authConfig());
    return response.data;
};

export const createTrainingCategory = async (categoryData) => {
    const response = await api.post(`${API_BASE}/categories`, categoryData, authConfig());
    return response.data;
};

export const updateTrainingCategory = async (id, categoryData) => {
    const response = await api.put(`${API_BASE}/categories/${id}`, categoryData, authConfig());
    return response.data;
};

export const deleteTrainingCategory = async (id) => {
    await api.delete(`${API_BASE}/categories/${id}`, authConfig());
};