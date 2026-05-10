import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';
import trainingBg from '../../assets/training.png';
import useStore from '../../store/useStore';

const ClientTraining = () => {
    const navigate = useNavigate();

    const selectedTraining = useStore((state) => state.selectedTraining);
    const approveSession = useStore((state) => state.approveSession);

    const [isApproving, setIsApproving] = useState(false);

    // Переносим useState и useEffect выше всех return
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        if (selectedTraining && selectedTraining.exercises) {
            setExercises(selectedTraining.exercises);
        }
    }, [selectedTraining]);

    // Теперь, когда все хуки объявлены, можно делать проверку
    if (!selectedTraining) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white font-rubik">
                <div className="text-center">
                    <p className="mb-4 opacity-50">No training selected</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                    >
                        Back to Calendar
                    </button>
                </div>
            </div>
        );
    }

    // Вспомогательные данные (теперь мы точно знаем, что selectedTraining есть)
    const data = selectedTraining;

    const handleApprove = async () => {
        setIsApproving(true);
        await approveSession(selectedTraining.id);
        setIsApproving(false);
    };

    const handleDoneChange = (index, value) => {
        const newExercises = [...exercises];
        newExercises[index].done = Number(value);
        setExercises(newExercises);
    };

    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        if (s === 'attended') return 'text-[#9b87f5]';
        if (s === 'missed') return 'text-[#f87171]';
        if (s === 'requested') return 'text-[#fbbf24]'; // Оранжевый для запросов
        return 'text-[#c1cf98]';
    };

    if (!selectedTraining) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white font-rubik">
                <div className="text-center">
                    <p className="mb-4 opacity-50">No training selected</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                    >
                        Back to Calendar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Background>
            <div
                key={selectedTraining.id}
                className="relative min-h-screen text-white font-rubik flex flex-col bg-cover bg-center bg-no-repeat overflow-hidden"
                style={{backgroundImage: `url(${trainingBg})`}}
            >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0"/>

            <div className="relative z-10 flex flex-col h-full overflow-y-auto no-scrollbar">

                {/* HEADER */}
                <nav className="relative z-20 px-6 md:px-10 py-6 md:py-8 flex items-center shrink-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-2xl md:text-3xl p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all active:scale-95"
                    >
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
                <div
                    className="flex flex-col md:grid md:grid-cols-[1.2fr_0.8fr] w-full max-w-[1400px] mx-auto px-6 md:px-16 gap-4 md:gap-16 pb-12">

                    {/* БАННЕР ПОДТВЕРЖДЕНИЯ (показывается, если статус 'requested') */}
                    {data.status?.toLowerCase() === 'requested' && (
                        <div className="md:col-span-2 mb-2 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div
                                className="bg-[#c1cf98]/10 border border-[#c1cf98]/30 rounded-[30px] p-6 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
                                <div>
                                    <h3 className="text-[#c1cf98] text-xl font-bold">New Workout Request</h3>
                                    <p className="text-white/60 text-sm">Your coach has scheduled a new session. Please
                                        confirm that you can attend.</p>
                                </div>
                                <button
                                    onClick={handleApprove}
                                    disabled={isApproving}
                                    className="w-full md:w-auto px-8 py-4 bg-[#c1cf98] hover:bg-[#d4e2ae] text-black font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isApproving ? 'Confirming...' : 'I will attend'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 1. TITLE & INFO */}
                    <div className="md:col-start-2 md:row-start-1 flex flex-col gap-0 md:justify-end">
                        <div className="flex items-center gap-4 text-gray-300 font-medium text-lg md:text-xl">
                            <span>{data.date}</span>
                            <span className={`${getStatusColor(data.status)} font-bold`}>{data.time}</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                            {data.title}
                        </h2>
                    </div>

                    {/* 2. TABLE */}
                    <div
                        className="md:col-start-1 md:row-span-2 bg-black/40 backdrop-blur-md rounded-[40px] overflow-hidden border border-white/10 shadow-2xl h-fit">
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

                    {/* 3. POINTS */}
                    <div
                        className="md:col-start-2 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-4 mt-1 md:mt-0">
                        <div className="shrink-0">
                            <span
                                className={`text-4xl md:text-6xl font-bold tracking-tighter ${data.status === 'missed' ? 'text-[#f87171]' : 'text-[#c1cf98]'}`}>
                                {data.status === 'missed' ? '-' : '+'}{data.points.total} pts
                            </span>
                        </div>

                        <div className="flex flex-col gap-y-1 md:gap-y-3">
                            <PointItem color="bg-[#9b87f5]" value={data.points.endurance} label="endurance"/>
                            <PointItem color="bg-[#60a5fa]" value={data.points.consistency} label="consistency"/>
                            <PointItem color="bg-[#fbbf24]" value={data.points.motivation} label="motivation"/>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </Background>
    );
};

const PointItem = ({color, value, label}) => (
    <div className="flex items-center gap-2 md:gap-3">
        <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${color}`}/>
        <span className="text-lg md:text-2xl font-normal opacity-70 md:opacity-50 whitespace-nowrap">
            {value} <span className="ml-0.5">{label}</span>
        </span>
    </div>
);

export default ClientTraining;
