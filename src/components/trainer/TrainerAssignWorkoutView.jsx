import React, { useState, useEffect, useMemo } from 'react';
import { FiArrowLeft, FiUser, FiTrash2, FiPlus } from 'react-icons/fi';
import { workoutTemplates as staticTemplates } from './trainerData.js';
import { InfoBox } from './TrainerShared.jsx';
import { getClientAvatar } from './trainerAvatar.js';
import useStore from '../../store/useStore.js';

const TrainerAssignWorkoutView = ({ onBack, onOpenProfile, onAssignWorkout, selectedClient }) => {
    const categories = useStore((state) => state.categories);
    const fetchCategories = useStore((state) => state.fetchCategories);

    useEffect(() => {
        if (fetchCategories) {
            fetchCategories();
        }
    }, [fetchCategories]);

    const workoutTemplates = useMemo(() => {
        const liveCategories = categories || [];

        if (liveCategories.length === 0) {
            return staticTemplates;
        }

        return liveCategories.map(category => {
            const matchingStatic = staticTemplates.find(
                t => t.type === category.name || t.name.toUpperCase() === category.name.toUpperCase()
            );

            return {
                id: category.id,
                name: matchingStatic?.name || category.name.charAt(0) + category.name.slice(1).toLowerCase() + " Workout",
                type: category.name,
                defaultPoints: category.defaultPoints || 50,
                exercises: (category.defaultExercises && category.defaultExercises.length > 0)
                    ? category.defaultExercises
                    : (matchingStatic?.exercises || [{ name: 'Warm-up', planned: 5 }])
            };
        });
    }, [categories]);

    const [selectedTemplateName, setSelectedTemplateName] = useState('');
    const [customExercises, setCustomExercises] = useState(null);
    const [startDateTime, setStartDateTime] = useState("");

    const now = new Date();
    const minDateTime = now.toISOString().slice(0, 16);

    const currentTemplate = useMemo(() => {
        if (!selectedTemplateName && workoutTemplates.length > 0) {
            return workoutTemplates[0];
        }
        return workoutTemplates.find(t => t.name === selectedTemplateName) || workoutTemplates[0];
    }, [selectedTemplateName, workoutTemplates]);

    const exercises = useMemo(() => {
        if (customExercises !== null) return customExercises;
        return currentTemplate?.exercises || [];
    }, [customExercises, currentTemplate]);

    const points = useMemo(() => {
        const total = currentTemplate?.defaultPoints || currentTemplate?.points || 0;
        return {
            total,
            endurance: Math.floor(total * 0.4),
            consistency: Math.floor(total * 0.3),
            motivation: total - Math.floor(total * 0.4) - Math.floor(total * 0.3)
        };
    }, [currentTemplate]);

    const handleTemplateChange = (template) => {
        setSelectedTemplateName(template.name);
        setCustomExercises(null);
    };

    const updateEx = (index, field, value) => {
        const baseExercises = [...exercises];
        baseExercises[index][field] = field === 'planned' ? Number(value) : value;
        setCustomExercises(baseExercises);
    };

    const handleAddRow = () => {
        setCustomExercises([...exercises, { name: '', planned: 0 }]);
    };

    const removeRow = (index) => {
        setCustomExercises(exercises.filter((_, i) => i !== index));
    };

    const handleAssignClick = () => {
        if (!startDateTime) {
            alert("Please choose a training time and date");
            return;
        }

        const selectedDate = new Date(startDateTime);
        if (selectedDate < new Date()) {
            alert("You cannot schedule a workout in the past!");
            return;
        }

        const clientId = selectedClient?.id || selectedClient?.clientId;

        if (!clientId) {
            console.error("Client ID is missing!", selectedClient);
            alert("Error: Could not find Client ID");
            return;
        }

        const startDate = new Date(startDateTime);
        if (startDate.getTime() < new Date().getTime() - 60000) {
            alert("You cannot schedule a workout in the past!");
            return;
        }
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

        const payload = {
            coachId: Number(localStorage.getItem('userId')),
            memberId: Number(clientId),
            title: String(currentTemplate?.name || selectedTemplateName),
            type: currentTemplate?.type || "STRENGTH",
            points: points.total,
            exercises: exercises.map(ex => ({
                name: ex.name,
                planned: Number(ex.planned),
                done: 0
            })),
            startsAt: formatLocalDateTime(startDate),
            endsAt: formatLocalDateTime(endDate)
        };

        console.log("🚀 SENDING LIVE PAYLOAD TO BACKEND:", payload);
        onAssignWorkout(payload);
    };

    if (!currentTemplate) {
        return <div className="p-10 text-center text-white/50">Loading workout categories...</div>;
    }

    return (
        <div className="px-4 pb-24 pt-5 sm:px-6 md:px-8 md:pb-10 md:pt-7 lg:px-12 lg:py-10">
            <div className="mx-auto max-w-[1040px]">
                <header className="flex items-center justify-between">
                    <button onClick={onBack} className="rounded-full p-2 text-[#eee7da] hover:bg-white/10">
                        <FiArrowLeft size={26} />
                    </button>
                    <h1 className="text-[1.8rem] font-medium text-white">Assign Workout</h1>
                    <button onClick={onOpenProfile} className="p-2 text-[#ded6c4] lg:hidden">
                        <FiUser size={20} />
                    </button>
                    <div className="hidden lg:block lg:w-10" />
                </header>

                <div className="mt-6 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
                    <div className="h-fit rounded-[28px] border border-white/10 bg-black/15 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.14)] md:p-6">
                        <div className="flex items-center gap-4">
                            <div className="h-[84px] w-[84px] overflow-hidden rounded-full border border-white/15 bg-neutral-800">
                                <img src={getClientAvatar(selectedClient)} alt={selectedClient?.name} className="h-full w-full object-cover" />
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-widest text-white/40">Assigning to</p>
                                <h2 className="text-2xl font-black text-white">{selectedClient?.name}</h2>
                            </div>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <InfoBox label="Level" value={selectedClient?.level} />
                            <InfoBox label="Streak" value={selectedClient?.streak} />
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-black/15 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.14)] md:p-6">
                        <div className="grid gap-6">
                            <Field label="Workout template (Admin Configured)">
                                <div className="flex flex-wrap gap-2">
                                    {workoutTemplates.map((template) => (
                                        <button
                                            key={template.name}
                                            onClick={() => handleTemplateChange(template)}
                                            className={`rounded-xl border px-4 py-2 text-sm transition-all ${
                                                (currentTemplate?.name === template.name)
                                                    ? 'border-[#c1cf98]/40 bg-[#c1cf98]/12 text-[#eef2d7]'
                                                    : 'border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/8'
                                            }`}
                                        >
                                            {template.name} <span className="text-[10px] opacity-50">({template.defaultPoints} XP)</span>
                                        </button>
                                    ))}
                                </div>
                            </Field>

                            <Field label="Exercises list">
                                <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                                    <div className="mb-2 flex text-[10px] uppercase tracking-wider text-white/30 px-2">
                                        <span className="flex-1">Exercise Name</span>
                                        <span className="w-20 text-center">Reps/Sec</span>
                                        <span className="w-8"></span>
                                    </div>
                                    <div className="grid gap-2">
                                        {exercises.map((ex, idx) => (
                                            <div key={idx} className="group flex items-center gap-2 rounded-lg border border-white/10 bg-black/15 p-2">
                                                <input
                                                    value={ex.name}
                                                    onChange={(e) => updateEx(idx, 'name', e.target.value)}
                                                    placeholder="Exercise name"
                                                    className="flex-1 bg-transparent border-none text-white text-sm outline-none"
                                                />
                                                <input
                                                    type="number"
                                                    value={ex.planned}
                                                    onChange={(e) => updateEx(idx, 'planned', e.target.value)}
                                                    className="w-16 bg-white/10 rounded-md py-1 text-center text-sm text-[#c1cf98] outline-none"
                                                />
                                                <button
                                                    onClick={() => removeRow(idx)}
                                                    className="text-white/20 hover:text-red-400 transition-colors"
                                                >
                                                    <FiTrash2 size={16}/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleAddRow}
                                        className="mt-4 flex items-center gap-2 text-xs font-bold text-[#c1cf98] hover:opacity-80 transition-opacity"
                                    >
                                        <FiPlus/> ADD EXERCISE
                                    </button>
                                </div>
                            </Field>

                            <Field label="Set Date and Time">
                                <input
                                    type="datetime-local"
                                    step="900"
                                    min={minDateTime}
                                    value={startDateTime}
                                    onChange={(e) => setStartDateTime(e.target.value)}
                                    className="w-full rounded-[22px] border border-white/10 bg-black/15 px-4 py-4 text-[#efe4d0] outline-none focus:border-[#dce8c5]"
                                />
                                <p className="text-[10px] text-white/30 mt-2">Time is set in your local timezone.</p>
                            </Field>

                            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] uppercase tracking-widest text-white/40">Expected Reward (Dynamic)</span>
                                    <span className="text-[#c1cf98] font-bold">{points.total} PTS</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="text-center">
                                        <p className="text-[9px] text-white/30 uppercase">Endurance</p>
                                        <p className="text-sm text-[#9b87f5]">{points.endurance}</p>
                                    </div>
                                    <div className="text-center border-x border-white/5">
                                        <p className="text-[9px] text-white/30 uppercase">Consistency</p>
                                        <p className="text-sm text-[#60a5fa]">{points.consistency}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[9px] text-white/30 uppercase">Motivation</p>
                                        <p className="text-sm text-[#fbbf24]">{points.motivation}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row pt-4">
                                <button
                                    onClick={handleAssignClick}
                                    className="flex-1 rounded-full bg-[#c1cf98] px-6 py-4 text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Assign to {selectedClient?.name ? selectedClient.name.split(' ')[0] : 'Client'}
                                </button>
                                <button onClick={onBack} className="px-6 py-4 text-sm text-white/50">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Field = ({label, children}) => (
    <div>
        <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</p>
        {children}
    </div>
);

const formatLocalDateTime = (date) => {
    const pad = (value) => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

export default TrainerAssignWorkoutView;
