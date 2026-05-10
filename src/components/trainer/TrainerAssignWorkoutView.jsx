import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiUser, FiTrash2, FiPlus } from 'react-icons/fi';
import avatarMe from '../../assets/avatars/avatar-me.png';
import { workoutTemplates } from './trainerData.js';
import { InfoBox } from './TrainerShared.jsx';

const TrainerAssignWorkoutView = ({ onBack, onOpenProfile, onAssignWorkout, selectedClient }) => {
    const [selectedTemplateName, setSelectedTemplateName] = useState(workoutTemplates[0].name);
    const [exercises, setExercises] = useState(workoutTemplates[0].exercises || []);
    const [startDateTime, setStartDateTime] = useState("");

    const currentTemplate = workoutTemplates.find(t => t.name === selectedTemplateName);

    const total = currentTemplate?.defaultPoints || currentTemplate?.points || 0;
    const points = {
        total,
        endurance: Math.floor(total * 0.4),
        consistency: Math.floor(total * 0.3),
        motivation: total - Math.floor(total * 0.4) - Math.floor(total * 0.3)
    };

    const handleTemplateChange = (template) => {
        setSelectedTemplateName(template.name);
        setExercises([...template.exercises]);
    };

    const updateEx = (index, field, value) => {
        const newEx = [...exercises];
        newEx[index][field] = field === 'planned' ? Number(value) : value;
        setExercises(newEx);
    };

    const handleAddRow = () => {
        setExercises([...exercises, { name: '', planned: 0 }]);
    };

    const removeRow = (index) => {
        setExercises(exercises.filter((_, i) => i !== index));
    };

    const handleAssignClick = () => {
        if (!startDateTime) {
            alert("Please choose a training time and date");
            return;
        }

        const clientId = selectedClient?.id || selectedClient?.clientId;

        if (!clientId) {
            console.error("Client ID is missing!", selectedClient);
            alert("Error: Could not find Client ID");
            return;
        }

        const startDate = new Date(startDateTime);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

        const payload = {
            coachId: Number(localStorage.getItem('userId')),
            memberId: Number(clientId),
            title: String(selectedTemplateName),
            type: currentTemplate?.type || "STRENGTH",
            points: points.total,
            exercises: exercises.map(ex => ({
                name: ex.name,
                planned: Number(ex.planned),
                done: 0
            })),
            startsAt: startDate.toISOString().split('.')[0],
            endsAt: endDate.toISOString().split('.')[0]
        };

        console.log("🚀 SENDING PAYLOAD:", payload);
        onAssignWorkout(payload);
    };

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
                    <div className="rounded-[30px] border border-white/10 bg-[rgba(15,16,18,0.16)] p-5 md:p-6 h-fit">
                        <div className="flex items-center gap-4">
                            <div className="h-[84px] w-[84px] overflow-hidden rounded-full border border-white/15 bg-neutral-800">
                                <img src={avatarMe} alt={selectedClient.name} className="h-full w-full object-cover p-1" />
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-widest text-white/40">Assigning to</p>
                                <h2 className="text-2xl font-black text-white">{selectedClient.name}</h2>
                            </div>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <InfoBox label="Level" value={selectedClient.level} />
                            <InfoBox label="Streak" value={selectedClient.streak} />
                        </div>
                    </div>

                    <div className="rounded-[30px] border border-white/10 bg-[rgba(15,16,18,0.16)] p-5 md:p-6">
                        <div className="grid gap-6">
                            <Field label="Workout template">
                                <div className="flex flex-wrap gap-2">
                                    {workoutTemplates.map((template) => (
                                        <button
                                            key={template.name}
                                            onClick={() => handleTemplateChange(template)}
                                            className={`rounded-xl border px-4 py-2 text-sm transition-all ${
                                                selectedTemplateName === template.name
                                                    ? 'border-[#dce8c5] bg-[#c1cf98]/20 text-white'
                                                    : 'border-white/10 text-white/60 hover:bg-white/5'
                                            }`}
                                        >
                                            {template.name}
                                        </button>
                                    ))}
                                </div>
                            </Field>

                            <Field label="Exercises list">
                                <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                                    <div className="mb-2 flex text-[10px] uppercase tracking-wider text-white/30 px-2">
                                        <span className="flex-1">Exercise Name</span>
                                        <span className="w-20 text-center">Reps/Sec</span>
                                        <span className="w-8"></span>
                                    </div>
                                    <div className="grid gap-2">
                                        {exercises.map((ex, idx) => (
                                            <div key={idx}
                                                 className="flex items-center gap-2 bg-white/5 p-2 rounded-lg group">
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
                                    value={startDateTime}
                                    onChange={(e) => setStartDateTime(e.target.value)}
                                    className="w-full rounded-[22px] border border-white/10 bg-black/15 px-4 py-4 text-[#efe4d0] outline-none focus:border-[#dce8c5]"
                                />
                            </Field>

                            <div className="mt-4 rounded-2xl border border-white/5 bg-black/20 p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] uppercase tracking-widest text-white/40">Expected Reward</span>
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
                                    Assign to {selectedClient.name.split(' ')[0]}
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

export default TrainerAssignWorkoutView;