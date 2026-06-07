import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';
import axios from 'axios';
import trainingBg from '../../assets/training.png';
import useStore from '../../store/useStore';

const API_BASE_URL = 'http://localhost:8081/api/training';

const ClientTraining = () => {
    const navigate = useNavigate();
    const currentUser = useStore((state) => state.currentUser);
    const selectedTraining = useStore((state) => state.selectedTraining);
    const updateStatus = useStore((state) => state.updateStatus);

    const [isApproving, setIsApproving] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (selectedTraining?.exercises) {
            setExercises([...selectedTraining.exercises]);
        } else {
            setExercises([]);
        }
    }, [selectedTraining]);

    if (!selectedTraining) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white font-rubik">
                <div className="text-center">
                    <p className="mb-4 opacity-50">No training selected</p>
                    <button onClick={() => navigate('/home')} className="px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                        Back to Calendar
                    </button>
                </div>
            </div>
        );
    }

    const data = selectedTraining;

    const statusLower = data.status?.toLowerCase();
    const isRequested = statusLower === 'requested';
    const isCanceled = statusLower === 'canceled';
    const isSubmitted = statusLower === 'submitted';
    const isApproved = statusLower === 'completed';
    const isEditable = statusLower === 'confirmed';

    const isPast = new Date() > new Date(data.endsAt);
    const isMissed = data.status === 'MISSED' || (data.status === 'CONFIRMED' && isPast);
    const canSubmit = isEditable && !isPast;
    const canCancel = !isPast && (isRequested || isEditable);

    const displayPoints = {
        total: data.points?.total || 0,
        endurance: data.points?.endurance || 0,
        consistency: data.points?.consistency || 0,
        motivation: data.points?.motivation || 0
    };

    const handleApprove = async () => {
        setIsApproving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_BASE_URL}/sessions/${selectedTraining.id}/status?status=CONFIRMED`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            await updateStatus(selectedTraining.id, 'CONFIRMED');
        } catch (e) {
            console.error("Error confirming workout:", e);
            alert("Access denied (403 Forbidden). Please check authentication.");
        } finally {
            setIsApproving(false);
        }
    };

    const handleCancel = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_BASE_URL}/sessions/${selectedTraining.id}/status?status=CANCELED`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            await updateStatus(data.id, 'CANCELED');
            navigate('/home');
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmitResults = async () => {
        const now = new Date();
        const trainingEndTime = new Date(selectedTraining.endsAt);

        if (now < trainingEndTime) {
            setShowModal(true);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const logData = {
                sessionId: selectedTraining.id,
                memberId: currentUser.id,
                coachId: selectedTraining.coachId,
                memberComment: `Completed ${exercises.length} exercises.`,
                exercises: exercises.map(ex => ({
                    id: ex.id,
                    name: ex.name,
                    planned: ex.planned || 0,
                    done: (ex.done || 0) > (ex.planned || 0) ? ex.planned : (ex.done || 0)
                }))
            };

            await axios.post(`${API_BASE_URL}/logs`, logData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            await updateStatus(selectedTraining.id, 'SUBMITTED');
            navigate('/home');
        } catch (e) {
            console.error("Error submitting results:", e);
            alert("Failed to submit results to the coach.");
        }
    };

    const handleDoneChange = (index, value) => {
        const newExercises = [...exercises];
        newExercises[index] = { ...newExercises[index], done: Number(value) };
        setExercises(newExercises);
    };

    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        if (s === 'attended') return 'text-[#9b87f5]';
        if (s === 'missed') return 'text-[#f87171]';
        if (s === 'requested') return 'text-[#fbbf24]';
        return 'text-[#c1cf98]';
    };

    return (
        <Background>
            <div className="relative min-h-screen text-white font-rubik flex flex-col bg-cover bg-center bg-no-repeat fixed inset-0 overflow-hidden" style={{backgroundImage: `url(${trainingBg})`}}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0"/>
                <div className="relative z-10 flex flex-col h-full overflow-y-auto no-scrollbar">
                    <nav className="relative z-20 px-6 md:px-10 py-6 md:py-8 flex items-center shrink-0">
                        <button onClick={() => navigate(-1)} className="text-2xl p-2 bg-white/5 rounded-xl">
                            <FiArrowLeft className="text-white"/>
                        </button>
                        <div className="flex-grow flex items-center justify-center gap-3 pr-12">
                            <span className={`text-lg font-medium lowercase ${getStatusColor(isMissed ? 'missed' : data.status)}`}>{isMissed ? 'missed' : data.status}</span>
                            <h1 className="text-xl md:text-3xl font-medium text-white">Workout</h1>
                        </div>
                    </nav>

                    <div className="flex flex-col md:grid md:grid-cols-[1.2fr_0.8fr] w-full max-w-[1400px] mx-auto px-6 md:px-16 gap-4 md:gap-8 pb-12">
                        <div className="md:col-start-2 md:row-start-1 flex flex-col justify-center">
                            <div className="flex items-center gap-4 text-gray-300 font-medium text-lg">
                                <span>{data.date}</span>
                                <span className={`${getStatusColor(isMissed ? 'missed' : data.status)} font-bold`}>{data.time}</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold mt-1">{data.title}</h2>
                        </div>

                        <div className="md:col-start-1 md:row-start-1 md:row-span-2 bg-black/40 backdrop-blur-md rounded-[40px] overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-between">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className="text-white/60 border-b border-white/5">
                                    <th className="p-5 text-left font-normal">exercise</th>
                                    <th className="p-5 text-center font-normal">planned</th>
                                    <th className="p-5 text-center font-normal">done</th>
                                </tr>
                                </thead>
                                <tbody>
                                {exercises.map((ex, idx) => (
                                    <tr key={idx} className="border-b border-white/5 last:border-none">
                                        <td className="p-5 text-white/90 font-medium">{ex.name}</td>
                                        <td className="p-5 text-center text-white/40">{ex.planned}</td>
                                        <td className="p-5 text-center">
                                            {isEditable && !isPast ? (
                                                <input
                                                    type="number"
                                                    value={ex.done || 0}
                                                    onChange={(e) => handleDoneChange(idx, e.target.value)}
                                                    className="w-12 bg-white/5 border border-white/10 rounded-lg py-1 text-center"
                                                />
                                            ) : (
                                                <span className="text-white/60 font-mono">{ex.done || 0}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            {isEditable && (
                                <div className="p-6 border-t border-white/5">
                                    <button
                                        onClick={handleSubmitResults}
                                        disabled={!canSubmit}
                                        className={`w-full py-4 font-bold rounded-2xl transition-all ${
                                            canSubmit
                                                ? 'bg-[#c1cf98] text-black hover:brightness-110'
                                                : 'bg-white/5 text-white/30 cursor-not-allowed'
                                        }`}
                                    >
                                        {isPast ? "Training time has expired" : "Send Results to Coach"}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="md:col-start-2 md:row-start-2 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-4 md:gap-6 pt-4 md:pt-0">
                            <div className="shrink-0">
                                <span className={`text-4xl md:text-6xl font-bold tracking-tighter ${isMissed ? 'text-[#f87171]' : 'text-[#c1cf98]'}`}>
                                    {isMissed ? '-' : '+'}{displayPoints.total} pts
                                </span>
                            </div>
                            <div className="flex flex-col gap-y-1 md:gap-y-3">
                                <PointItem color="bg-[#9b87f5]" value={displayPoints.endurance} label="endurance"/>
                                <PointItem color="bg-[#60a5fa]" value={displayPoints.consistency} label="consistency"/>
                                <PointItem color="bg-[#fbbf24]" value={displayPoints.motivation} label="motivation"/>
                            </div>
                        </div>

                        {isRequested && (
                            <div className="md:col-span-2 bg-black/40 border border-[#c1cf98]/20 rounded-[30px] p-6 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md shadow-xl mt-4">
                                <div>
                                    <h3 className="text-[#c1cf98] text-xl font-bold">New Workout Request</h3>
                                    <p className="text-white/60 text-sm">Review the plan and confirm your attendance.</p>
                                </div>
                                <div className="flex gap-4 w-full md:w-auto">
                                    <button onClick={handleApprove} disabled={isApproving} className="flex-1 md:px-8 py-4 bg-[#c1cf98] text-black font-bold rounded-2xl">Confirm</button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={!canCancel}
                                        className={`flex-1 md:px-8 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl ${!canCancel ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        )}

                        {isSubmitted && (
                            <div className="md:col-span-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-[30px] p-8 flex items-center justify-center mt-4">
                                <div className="text-center">
                                    <h3 className="text-white text-xl font-bold mb-2">Results submitted!</h3>
                                    <p className="text-white/60">Your coach will review your performance soon.</p>
                                </div>
                            </div>
                        )}

                        {isApproved && (
                            <div className="md:col-span-2 bg-black/40 backdrop-blur-md border border-[#c1cf98]/20 rounded-[30px] p-8 flex items-center justify-center mt-4">
                                <div className="text-center">
                                    <h3 className="text-[#c1cf98] text-xl font-bold mb-2">Great job!</h3>
                                    <p className="text-white/60">Points have been credited to your profile. Keep it up!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-black/[0.45] backdrop-blur-[16px] border border-white/10 p-8 rounded-[30px] max-w-sm w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                        <h3 className="text-xl font-bold text-white mb-3">Training in Progress</h3>
                        <p className="text-white/60 mb-8 text-sm">
                            Please submit your results only after the training session has finished.
                        </p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full py-4 bg-[#626e49] text-white font-bold rounded-2xl border border-transparent hover:bg-[#707c57] transition-all duration-300"
                        >
                            Understood
                        </button>
                    </div>
                </div>
            )}
        </Background>
    );
};

const PointItem = ({color, value, label}) => (
    <div className="flex items-center gap-2 md:gap-3">
        <div className={`w-1.5 h-1.5 rounded-full ${color}`}/>
        <span className="text-lg md:text-2xl font-normal opacity-50 whitespace-nowrap">
            {value} <span className="ml-0.5">{label}</span>
        </span>
    </div>
);

export default ClientTraining;