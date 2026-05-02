import { create } from 'zustand';
import axios from 'axios';

import tr1 from '../assets/trainers/trainer1.jpg';
import tr2 from '../assets/trainers/trainer2.jpg';
import tr3 from '../assets/trainers/trainer3.jpg';
import tr4 from '../assets/trainers/trainer4.jpg';
import tr5 from '../assets/trainers/trainer5.jpg';

const trainerImages = {
    1: tr1, 2: tr2, 3: tr3, 4: tr4, 5: tr5
};

const API_AUTH_URL = 'http://localhost:8080/api/users';
const API_BASE_URL = 'http://localhost:8081/api/training';

const useStore = create((set, _get) => ({
    currentUser: {
        id: localStorage.getItem('userId') || null,
        role: localStorage.getItem('activeRole') || null,
        email: null
    },
    trainers: [],
    userStats: { points: 288, level: 12, endurance: 89, consistency: 96, motivation: 103, nickname: "Hero_One" },
    coachContract: { trainerId: null, status: 'none' },
    subscription: { subId: null, status: 'none' },
    challenges: [
        { id: 1, title: "No Skip", points: 100, desc: "Don't skip a single workout.", status: "available", color: "bg-red-900/40" },
        { id: 2, title: "Early Bird", points: 50, desc: "Train before 10:00 AM.", status: "active", color: "bg-yellow-800/40" },
        { id: 3, title: "Iron Core", points: 75, desc: "Perform 100 planks.", status: "available", color: "bg-blue-900/40" },
        { id: 4, title: "Cardio King", points: 120, desc: "Run 50km total.", status: "completed", color: "bg-green-900/40" },
        { id: 5, title: "Water Balance", points: 30, desc: "Drink 2L water daily.", status: "available", color: "bg-cyan-900/40" }
    ],
    selectedTrainer: null,
    selectedTraining: null,
    sessions: [],
    clients: [],

    setCurrentUser: (userData) => {
        if (userData && userData.id) {
            localStorage.setItem('userId', userData.id);
        }
        if (userData && userData.role) {
            localStorage.setItem('activeRole', userData.role);
        }
        set({ currentUser: userData });
    },

    fetchMyClients: async (coachId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_AUTH_URL}/my-clients/${coachId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const mappedClients = response.data.map(u => ({
                id: u.id,
                name: u.email.split('@')[0],
                level: "Lv. 1",
                attendance: "100%",
                progress: 0,
                status: "New",
                goal: "Not set",
                progressRequestPending: false
            }));

            set({ clients: mappedClients });
        } catch (error) {
            console.error("Failed to fetch clients:", error);
        }
    },

    assignCoachToClient: async (clientId, coachId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("No token found. Please relogin.");
                return;
            }

            await axios.put(`${API_AUTH_URL}/${clientId}/assign-coach/${coachId}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            set({
                coachContract: {
                    trainerId: coachId,
                    status: 'active'
                }
            });

            console.log(`Successfully assigned coach ${coachId} to client ${clientId}`);
        } catch (error) {
            console.error("Error assigning coach:", error);
            alert("Failed to save coach selection on server.");
        }
    },

    // ОБНОВЛЕННЫЙ МЕТОД С АВТОРИЗАЦИЕЙ
    fetchTrainers: async () => {
        try {
            // 1. Извлекаем токен
            const token = localStorage.getItem('token');

            const response = await axios.get(`${API_AUTH_URL}/trainers`, {
                headers: {
                    // 2. Добавляем заголовок Bearer
                    'Authorization': `Bearer ${token}`
                }
            });

            const realTrainers = response.data.map(u => ({
                id: u.id,
                name: u.email.split('@')[0],
                surname: "Coach",
                img: trainerImages[u.id] || tr1,
                points: 0,
                phone: "+7 (777) 000 00 00",
                reviews: ["New coach in HeroFit!"]
            }));

            set({ trainers: realTrainers });
        } catch (error) {
            console.error("Failed to fetch trainers:", error);

            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                alert("Сессия истекла или недостаточно прав. Войдите в систему снова.");
            }
        }
    },

    fetchSessions: async (memberId) => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.get(`${API_BASE_URL}/sessions/member/${memberId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            set({ sessions: response.data });
        } catch (error) {
            console.error("Failed to fetch sessions:", error);

            if (error.response && error.response.status === 403) {
                console.warn("Access denied to sessions. Check if token is valid.");
            }
        }
    },

    createTraining: async (trainingData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_BASE_URL}/sessions`, trainingData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            set((state) => ({
                sessions: [...state.sessions, response.data]
            }));
            console.log("Session created successfully:", response.data);
        } catch (error) {
            console.error("Error creating session:", error);
        }
    },

    acceptChallenge: (id) => set((state) => ({
        challenges: state.challenges.map(ch =>
            ch.id === id ? { ...ch, status: 'active', startDate: new Date().toLocaleDateString() } : ch
        )
    })),

    completeChallenge: (id) => set((state) => {
        const challenge = state.challenges.find(ch => ch.id === id);
        if (!challenge) return state;
        const newTotalPoints = state.userStats.points + challenge.points;
        return {
            userStats: { ...state.userStats, points: newTotalPoints },
            challenges: state.challenges.map(ch =>
                ch.id === id ? { ...ch, status: 'completed', result: 'success' } : ch
            )
        };
    }),

    failChallenge: (id) => set((state) => {
        const challenge = state.challenges.find(ch => ch.id === id);
        if (!challenge) return state;
        const penalty = Math.floor(challenge.points * 0.2);
        return {
            userStats: { ...state.userStats, points: state.userStats.points - penalty },
            challenges: state.challenges.map(ch =>
                ch.id === id ? { ...ch, status: 'completed', result: 'fail' } : ch
            )
        };
    }),

    retryChallenge: (id) => set((state) => ({
        challenges: state.challenges.map(ch =>
            ch.id === id ? { ...ch, status: 'active', result: null } : ch
        )
    })),

    setCoachContract: (contract) => set({ coachContract: contract }),
    setSubscription: (sub) => set({ subscription: sub }),
    setSelectedTrainer: (trainer) => set({ selectedTrainer: trainer }),
    setSelectedTraining: (training) => set({ selectedTraining: training }),
    addPoints: (amount, statType) => set((state) => ({
        userStats: {
            ...state.userStats,
            points: state.userStats.points + amount,
            [statType]: state.userStats[statType] + Math.floor(amount / 10)
        }
    })),

    approveSession: async (sessionId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `${API_BASE_URL}/sessions/${sessionId}/status?status=CONFIRMED`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            set((state) => {
                const updatedSessions = state.sessions.map(s =>
                    s.id === sessionId ? { ...s, ...response.data } : s
                );

                let updatedSelected = state.selectedTraining;
                if (state.selectedTraining?.id === sessionId) {

                    updatedSelected = {
                        ...state.selectedTraining,
                        ...response.data
                    };
                }

                return {
                    sessions: updatedSessions,
                    selectedTraining: updatedSelected
                };
            });

            return true;
        } catch (error) {
            console.error("Failed to approve session:", error);
            return false;
        }
    },
}));

export default useStore;