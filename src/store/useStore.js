import { create } from 'zustand';
import axios from 'axios';

import tr1 from '../assets/trainers/trainer1.jpg';
import tr2 from '../assets/trainers/trainer2.jpg';
import tr3 from '../assets/trainers/trainer3.jpg';
import tr4 from '../assets/trainers/trainer4.jpg';
import tr5 from '../assets/trainers/trainer5.jpg';
import { getUserDisplayName, getUserNickname } from '../utils/userDisplay.js';

const trainerImages = {
    1: tr1, 2: tr2, 3: tr3, 4: tr4, 5: tr5
};

const API_AUTH_URL = 'http://localhost:8080/api/users';
const API_BASE_URL = 'http://localhost:8081/api/training';
const API_MENTORSHIP_URL = 'http://localhost:8081/api/training/mentorship';

const useStore = create((set, _get) => ({
    currentUser: {
        id: localStorage.getItem('userId') || null,
        role: localStorage.getItem('activeRole') || null,
        email: null
    },
    trainers: [],
    userStats: { points: 288, level: 12, endurance: 89, consistency: 96, motivation: 103 },
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

    logout: () => {
        localStorage.clear();
        set({
            currentUser: { id: null, role: null, email: null },
            sessions: [],
            clients: [],
            coachContract: { trainerId: null, status: 'none' },
            selectedTrainer: null,
            selectedTraining: null
        });
    },

    setCurrentUser: (userData) => {
        if (userData && userData.id) {
            localStorage.setItem('userId', userData.id);
        }
        if (userData && userData.role) {
            localStorage.setItem('activeRole', userData.role);
        }
        set({ currentUser: userData });
    },

    fetchUserProfile: async () => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            if (!userId || !token) return;

            const authResponse = await axios.get(`${API_AUTH_URL}/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            set({ currentUser: { ...authResponse.data } });

            try {
                const mentResponse = await axios.get(`${API_MENTORSHIP_URL}/client/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (mentResponse.data) {
                    set({
                        coachContract: {
                            trainerId: mentResponse.data.coachId,
                            status: 'active'
                        }
                    });
                }
            } catch (e) {
                console.log("No coach assigned yet in Training Service");
                set({ coachContract: { trainerId: null, status: 'none' } });
            }
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
        }
    },

    fetchMyClients: async (coachId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_MENTORSHIP_URL}/coach/${coachId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const mappedClients = response.data.map(m => ({
                id: m.clientId,
                name: m.clientNickname || `User #${m.clientId}`,
                level: "Lv. 1",
                attendance: "100%",
                progress: 0,
                status: "Active",
                goal: "Not set"
            }));

            set({ clients: mappedClients });
        } catch (error) {
            console.error("Failed to fetch clients:", error);
        }
    },

    assignCoachToClient: async (clientId, coachId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.post(`${API_MENTORSHIP_URL}/assign?clientId=${clientId}&coachId=${coachId}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            set({
                coachContract: {
                    trainerId: coachId,
                    status: 'active'
                }
            });
            console.log(`Successfully assigned coach ${coachId}`);
        } catch (error) {
            console.error("Error assigning coach:", error);
            alert("Failed to assign coach.");
        }
    },

    terminateMentorship: async (clientId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_MENTORSHIP_URL}/client/${clientId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            set({
                coachContract: { trainerId: null, status: 'none' },
                subscription: { subId: null, status: 'none' }
            });
            console.log("Mentorship terminated");
        } catch (error) {
            console.error("Failed to terminate mentorship:", error);
        }
    },

    fetchTrainers: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_AUTH_URL}/trainers`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const realTrainers = response.data.map(u => ({
                id: u.id,
                name: getUserDisplayName(u),
                surname: u.nickname ? getUserNickname(u) : "Coach",
                img: trainerImages[u.id] || tr1,
                points: 0,
                phone: "+7 (777) 000 00 00",
                reviews: ["New coach in HeroFit!"]
            }));

            set({ trainers: realTrainers });
        } catch (error) {
            console.error("Failed to fetch trainers:", error);
        }
    },

    fetchSessions: async (memberId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/sessions/member/${memberId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            set({ sessions: response.data });
        } catch (error) {
            console.error("Failed to fetch sessions:", error);
        }
    },

    createTraining: async (trainingData) => {
        try {
            const token = localStorage.getItem('token');
            const tokenRole = getTokenRole(token);
            console.log("Auth Token present:", !!token);

            if (!token) {
                throw new Error('Please log in as a trainer before assigning workouts.');
            }

            if (tokenRole && tokenRole !== 'COACH') {
                throw new Error('Workout assignment is available only for trainer accounts. Please log out and sign in as a trainer.');
            }

            const response = await axios.post(`${API_BASE_URL}/sessions`, trainingData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            set((state) => ({
                sessions: [...(state.sessions || []), response.data]
            }));

            alert("Workout assigned successfully!");
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Backend Error Details:", error.response.data);
            }
            console.error("Full Error object:", error);
            if (error.response?.status === 403) {
                throw new Error('Server rejected the request because the current token is not a trainer token. Please log out and sign in as a trainer.');
            }
            if (error.response?.status === 401) {
                throw new Error('Your session expired. Please log in again as a trainer.');
            }
            throw error;
        }
    },

    approveSession: async (sessionId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `${API_BASE_URL}/sessions/${sessionId}/status?status=CONFIRMED`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            set((state) => {
                const updatedSessions = state.sessions.map(s => s.id === sessionId ? response.data : s);
                return {
                    sessions: updatedSessions,
                    selectedTraining: response.data
                };
            });
            return true;
        } catch (error) {
            console.error("Failed to approve session:", error);
            return false;
        }
    },

    updateStatus: async (sessionId, status) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `${API_BASE_URL}/sessions/${sessionId}/status?status=${status}`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            set((state) => ({
                sessions: state.sessions.map(s => s.id === sessionId ? { ...s, ...response.data } : s),
                selectedTraining: state.selectedTraining?.id === sessionId
                    ? { ...state.selectedTraining, ...response.data }
                    : state.selectedTraining
            }));
            return true;
        } catch (error) {
            console.error("Failed to update status:", error);
            return false;
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
        return {
            userStats: { ...state.userStats, points: state.userStats.points + challenge.points },
            challenges: state.challenges.map(ch => ch.id === id ? { ...ch, status: 'completed', result: 'success' } : ch)
        };
    }),
    setCoachContract: (contract) => set({ coachContract: contract }),
    setSelectedTrainer: (trainer) => set({ selectedTrainer: trainer }),
    setSelectedTraining: (training) => set({ selectedTraining: training })
}));

const getTokenRole = (token) => {
    if (!token) return null;

    try {
        const payload = token.split('.')[1];
        const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(window.atob(normalizedPayload));
        return String(decoded.role ?? '').toUpperCase();
    } catch (error) {
        console.warn('Could not decode auth token role:', error);
        return null;
    }
};

export default useStore;
