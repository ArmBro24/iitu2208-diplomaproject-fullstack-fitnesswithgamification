import { create } from 'zustand';

// Импорт картинок тренеров для стора
import tr1 from '../assets/trainers/trainer1.jpg';
import tr2 from '../assets/trainers/trainer2.jpg';
import tr3 from '../assets/trainers/trainer3.jpg';
import tr4 from '../assets/trainers/trainer4.jpg';
import tr5 from '../assets/trainers/trainer5.jpg';

const trainersData = [
    {
        id: 1, name: "Alex", surname: "Rivers", img: tr1,
        points: 288,
        phone: "+7 (777) 777 77 77",
        quote: "Every session is a chance to learn new skills, stay motivated, and grow stronger with the support of professionals who care.",
        reviews: [
            "Alex always pushes me to give my best without ever losing motivation",
            "I've never felt stronger and more confident since training with him."
        ]
    },
    {
        id: 2, name: "Sarah", surname: "Jenkins", img: tr2,
        points: 315,
        phone: "+7 (777) 888 88 88",
        quote: "Fitness is a journey, not a destination. It's about building habits that last a lifetime.",
        reviews: [
            "Sarah's energy is contagious! Best cardio sessions ever.",
            "She really pays attention to technique and safety."
        ]
    },
    {
        id: 3, name: "Michael", surname: "Scott", img: tr3,
        points: 210,
        phone: "+7 (777) 999 99 99",
        quote: "Consistency is key. You don't have to be the best, you just have to be better than yesterday.",
        reviews: [
            "Very professional approach to strength training.",
            "Great personality, makes the workout fly by."
        ]
    },
    {
        id: 4, name: "Elena", surname: "Vance", img: tr4,
        points: 420,
        phone: "+7 (777) 111 22 33",
        quote: "Your body can stand almost anything. It’s your mind that you have to convince.",
        reviews: [
            "Elena is a master of yoga and flexibility. Highly recommend!",
            "I recovered from my back injury thanks to her program."
        ]
    },
    {
        id: 5, name: "David", surname: "Miller", img: tr5,
        points: 156,
        phone: "+7 (777) 444 55 66",
        quote: "Train hard, eat smart, and trust the process. Results take time, but they are worth it.",
        reviews: [
            "Tough but fair. David knows how to get you in shape fast.",
            "Excellent nutrition advice alongside the training."
        ]
    }
];

const useStore = create((set) => ({
    // Список всех тренеров
    trainers: trainersData,

    // Данные клиента
    userStats: {
        points: 288,
        level: 12,
        endurance: 89,
        consistency: 96,
        motivation: 103,
        nickname: "Hero_One"
    },

    // Контракт с тренером
    coachContract: {
        trainerId: null,
        status: 'none'
    },

    // Состояние подписки (Новая правка)
    subscription: {
        subId: null, // ID купленного абонемента
        status: 'none' // 'none' или 'active'
    },

    challenges: [
        { id: 1, title: "No Skip", points: 100, desc: "Don't skip a single workout this month.", status: "available", color: "bg-red-900/40", endDate: "2024-06-01", result: null },
        { id: 2, title: "Early Bird", points: 50, desc: "Train before 10:00 AM for 7 days straight.", status: "active", color: "bg-yellow-800/40", endDate: "2024-05-15", result: null },
        { id: 3, title: "Iron Core", points: 75, desc: "Perform 100 planks in 10 days.", status: "available", color: "bg-blue-900/40", endDate: "2024-05-20", result: null },
        { id: 4, title: "Cardio King", points: 120, desc: "Run 50km total this month.", status: "completed", color: "bg-green-900/40", endDate: "2024-04-30", result: "success" },
        { id: 5, title: "Water Balance", points: 30, desc: "Drink 2L water daily.", status: "available", color: "bg-cyan-900/40", endDate: "2024-06-10", result: null }
    ],

    acceptChallenge: (id) => set((state) => ({
        challenges: state.challenges.map(ch =>
            ch.id === id ? { ...ch, status: 'active', startDate: new Date().toLocaleDateString() } : ch
        )
    })),

    // Успешное завершение
    completeChallenge: (id) => set((state) => {
        const challenge = state.challenges.find(ch => ch.id === id);
        if (!challenge) return state;

        // Начисляем баллы
        const newTotalPoints = state.userStats.points + challenge.points;
        return {
            userStats: { ...state.userStats, points: newTotalPoints },
            challenges: state.challenges.map(ch =>
                ch.id === id ? { ...ch, status: 'completed', result: 'success' } : ch
            )
        };
    }),

    // Провал (кнопка "сдаться" или симуляция провала)
    failChallenge: (id) => set((state) => {
        const challenge = state.challenges.find(ch => ch.id === id);
        if (!challenge) return state;

        const penalty = Math.floor(challenge.points * 0.2); // 20% штраф
        return {
            userStats: { ...state.userStats, points: state.userStats.points - penalty },
            challenges: state.challenges.map(ch =>
                ch.id === id ? { ...ch, status: 'completed', result: 'fail' } : ch
            )
        };
    }),

    // Попробовать снова
    retryChallenge: (id) => set((state) => ({
        challenges: state.challenges.map(ch =>
            ch.id === id ? { ...ch, status: 'active', result: null } : ch
        )
    })),

    // Состояние выбора (для навигации)
    selectedTrainer: null,
    selectedTraining: null,

    // Actions
    setCoachContract: (contract) => set({ coachContract: contract }),

    // Метод для обновления подписки (Новая правка)
    setSubscription: (sub) => set({ subscription: sub }),

    setSelectedTrainer: (trainer) => set({ selectedTrainer: trainer }),

    setSelectedTraining: (training) => set({ selectedTraining: training }),

    addPoints: (amount, statType) => set((state) => ({
        userStats: {
            ...state.userStats,
            points: state.userStats.points + amount,
            [statType]: state.userStats[statType] + Math.floor(amount / 10)
        }
    }))
}));

export default useStore;