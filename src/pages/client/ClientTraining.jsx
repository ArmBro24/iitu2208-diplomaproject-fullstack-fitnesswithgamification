import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import trainingBg from '../../assets/training.png';

const ClientTraining = ({ trainingData, onBack }) => {
    const data = trainingData || {
        status: 'attended',
        date: 'Sep 19, 2025',
        time: '13:00 - 14:00',
        title: 'Full Body Strength',
        exercises: [
            { name: 'push-ups', planned: 20, done: 24 },
            { name: 'squats', planned: 30, done: 29 },
            { name: 'plank', planned: 60, done: 55 },
            { name: 'lunges', planned: 50, done: 57 },
            { name: 'sit-ups', planned: 20, done: 23 },
            { name: 'burpees', planned: 25, done: 20 },
            { name: 'twists', planned: 15, done: 12 },   // Доп строка 1
            { name: 'climbers', planned: 40, done: 42 }, // Доп строка 2
            { name: 'wallsit', planned: 20, done: 21 },  // Доп строка 3
        ],
        points: { total: 12, endurance: 4, consistency: 3, motivation: 5 }
    };

    const [exercises, setExercises] = useState(data.exercises);

    React.useEffect(() => {
        if (trainingData && trainingData.exercises) {
            setExercises(trainingData.exercises);
        }
    }, [trainingData]);

    const handleDoneChange = (index, value) => {
        const newExercises = [...exercises];
        newExercises[index].done = value;
        setExercises(newExercises);
    };

    const getStatusColor = (status) => {
        if (status === 'attended') return 'text-[#9b87f5]';
        if (status === 'missed') return 'text-[#f87171]';
        return 'text-[#c1cf98]';
    };

    return (
        <div
            className="relative min-h-screen text-white font-rubik flex flex-col bg-cover bg-center bg-no-repeat fixed inset-0 overflow-hidden"
            style={{ backgroundImage: `url(${trainingBg})` }}
        >
            {/* Пункт 2: Вернул затемнение и небольшое размытие для глубины */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0" />

            <div className="relative z-10 flex flex-col h-full overflow-y-auto no-scrollbar">

                {/* HEADER */}
                <nav className="relative z-20 px-6 md:px-10 py-6 md:py-8 flex items-center shrink-0">
                    <button
                        onClick={onBack}
                        className="text-2xl md:text-3xl p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all"
                    >
                        {/* Пункт 6: Белая стрелка */}
                        <FiArrowLeft className="text-white"/>
                    </button>

                    <div className="flex-grow flex items-center justify-center gap-3 pr-12">
                        <span className={`text-lg md:text-xl font-medium lowercase ${getStatusColor(data.status)}`}>
                            {data.status}
                        </span>
                        <h1 className="text-xl md:text-3xl font-medium text-white">Workout</h1>
                    </div>
                </nav>

                {/* MAIN CONTAINER */}
                <div className="flex flex-col md:grid md:grid-cols-[1.2fr_0.8fr] w-full max-w-[1400px] mx-auto px-6 md:px-16 gap-4 md:gap-16 pb-12">

                    {/* 1. TITLE & INFO (Пункт 3: Цвет времени совпадает со статусом) */}
                    <div className="md:col-start-2 md:row-start-1 flex flex-col gap-0 md:justify-end">
                        <div className="flex items-center gap-4 text-gray-300 font-medium text-lg md:text-xl">
                            <span>{data.date}</span>
                            <span className={`${getStatusColor(data.status)} font-bold`}>{data.time}</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                            Full Body Strength
                        </h2>
                    </div>

                    {/* 2. TABLE */}
                    <div className="md:col-start-1 md:row-span-2 bg-black/40 backdrop-blur-md rounded-[40px] overflow-hidden border border-white/10 shadow-2xl h-fit">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="text-white/60 text-sm md:text-base border-b border-white/5">
                                <th className="p-4 md:p-5 text-left font-normal">exercise</th>
                                <th className="p-4 md:p-5 text-center font-normal">planned</th>
                                <th className="p-4 md:p-5 text-center font-normal">done</th>
                            </tr>
                            </thead>
                            <tbody className="text-sm md:text-base">
                            {exercises.map((ex, idx) => (
                                <tr key={idx} className="border-b border-white/5 last:border-none">
                                    <td className="p-4 md:p-5 text-white/90 font-medium">{ex.name}</td>
                                    <td className="p-4 md:p-5 text-center text-white/40">{ex.planned}</td>
                                    <td className="p-4 md:p-5 text-center">
                                        <input
                                            type="number"
                                            value={ex.done}
                                            onChange={(e) => handleDoneChange(idx, e.target.value)}
                                            className="w-12 md:w-16 bg-white/5 border border-white/10 rounded-lg py-1 text-center focus:outline-none focus:border-[#c1cf98] transition-all"
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 3. POINTS (Пункт 1: Уменьшен отступ сверху в десктопе mt-0) */}
                    <div className="md:col-start-2 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-4 mt-1 md:mt-0">
                        <div className="shrink-0">
                            <span className={`text-4xl md:text-6xl font-bold tracking-tighter ${data.status === 'missed' ? 'text-[#f87171]' : 'text-[#c1cf98]'}`}>
                                {data.status === 'missed' ? '-' : '+'}{data.points.total} pts
                            </span>
                        </div>

                        {/* Пункт 4: Крупнее в мобилке (md:gap-y-3, text-lg в мобилке) */}
                        <div className="flex flex-col gap-y-1 md:gap-y-3">
                            <PointItem color="bg-[#9b87f5]" value={data.points.endurance} label="endurance" />
                            <PointItem color="bg-[#60a5fa]" value={data.points.consistency} label="consistency" />
                            <PointItem color="bg-[#fbbf24]" value={data.points.motivation} label="motivation" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const PointItem = ({ color, value, label }) => (
    <div className="flex items-center gap-2 md:gap-3">
        <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${color}`} />
        <span className="text-lg md:text-2xl font-normal opacity-70 md:opacity-50 whitespace-nowrap">
            {value} <span className="ml-0.5">{label}</span>
        </span>
    </div>
);

export default ClientTraining;