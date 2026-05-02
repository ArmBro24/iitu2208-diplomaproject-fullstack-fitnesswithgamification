import React, { useState } from 'react';
import { FiArrowLeft, FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import avatarMe from '../../assets/avatars/avatar-me.png';
import { workoutTemplates } from './trainerData.js';
import { InfoBox } from './TrainerShared.jsx';

const TrainerAssignWorkoutView = ({ onBack, onOpenProfile, onAssignWorkout, selectedClient }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(selectedClient.nextWorkout || workoutTemplates[0]);

    const [startDateTime, setStartDateTime] = useState("");

    const handleAssignClick = () => {
        if (!startDateTime) {
            alert("Пожалуйста, выберите дату и время тренировки");
            return;
        }

        const startDate = new Date(startDateTime);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

        onAssignWorkout({
            clientId: selectedClient.id,
            workout: selectedTemplate,
            startsAt: startDate.toISOString().split('.')[0],
            endsAt: endDate.toISOString().split('.')[0],
        });
    };

    return (
        <div className="px-4 pb-24 pt-5 sm:px-6 md:px-8 md:pb-10 md:pt-7 lg:px-12 lg:py-10">
            <div className="mx-auto max-w-[1040px]">
                <header className="flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="rounded-full p-2 text-[#eee7da] transition-colors hover:bg-white/10"
                    >
                        <FiArrowLeft size={26} />
                    </button>

                    <h1 className="text-[1.8rem] font-medium tracking-tight text-white md:text-[2rem]">Assign Workout</h1>

                    <button
                        onClick={onOpenProfile}
                        className="rounded-full p-2 text-[#ded6c4] transition-colors hover:bg-white/10 lg:hidden"
                    >
                        <FiUser size={20} />
                    </button>

                    <div className="hidden lg:block lg:w-10" />
                </header>

                <div className="mt-6 grid gap-5 xl:grid-cols-[0.94fr_1.06fr]">
                    <div className="rounded-[30px] border border-white/10 bg-[rgba(15,16,18,0.16)] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.14)] md:p-6">
                        <div className="flex items-center gap-4">
                            <div className="relative h-[84px] w-[84px] overflow-hidden rounded-full border border-white/15 bg-[radial-gradient(circle_at_30%_30%,#f19add,#704436)]">
                                <img
                                    src={avatarMe}
                                    alt={selectedClient.name}
                                    className="h-full w-full object-cover p-1"
                                />
                            </div>

                            <div>
                                <p className="text-sm uppercase tracking-[0.18em] text-[#f0ddd6]/55">Assigning to</p>
                                <h2 className="mt-1 text-[1.6rem] font-black text-[#f5efe7]">{selectedClient.name}</h2>
                                <p className="mt-1 text-sm text-[#d7cabc]">{selectedClient.goal}</p>
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <InfoBox label="Level" value={selectedClient.level} />
                            <InfoBox label="Streak" value={selectedClient.streak} />
                            <InfoBox label="Attendance" value={selectedClient.attendance} />
                            <InfoBox label="Progress" value={`${selectedClient.progress}%`} />
                        </div>

                        <div className="mt-5 rounded-[24px] bg-[rgba(113,67,79,0.42)] px-4 py-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-[#f0ddd6]/60">Coach note</p>
                            <p className="mt-3 text-sm leading-relaxed text-[#f3e8dc]">
                                {selectedClient.note}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[30px] border border-white/10 bg-[rgba(15,16,18,0.16)] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.14)] md:p-6">
                        <div className="grid gap-4">
                            <Field label="Workout template">
                                <div className="grid gap-3">
                                    {workoutTemplates.map((template) => (
                                        <button
                                            key={template}
                                            type="button"
                                            onClick={() => setSelectedTemplate(template)}
                                            className={`rounded-[22px] border px-4 py-4 text-left transition-all ${
                                                selectedTemplate === template
                                                    ? 'border-[#dce8c5] bg-[rgba(121,76,89,0.34)]'
                                                    : 'border-white/10 bg-black/15 hover:bg-white/10'
                                            }`}
                                        >
                                            <span className="font-medium text-[#f4ede5]">{template}</span>
                                        </button>
                                    ))}
                                </div>
                            </Field>

                            <Field label="Set Date and Time">
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        value={startDateTime}
                                        onChange={(e) => setStartDateTime(e.target.value)}
                                        className="w-full rounded-[22px] border border-white/10 bg-black/15 px-4 py-4 text-[#efe4d0] outline-none transition-all focus:border-[#dce8c5] focus:bg-black/30"
                                    />
                                </div>
                            </Field>

                            <Field label="Trainer instructions">
                                <div className="rounded-[24px] border border-white/10 bg-black/15 px-4 py-4 text-sm leading-relaxed text-[#f0e3d8]">
                                    Focus on clean form, steady pacing, and post-session recovery notes.
                                </div>
                            </Field>

                            <div className="rounded-[26px] bg-[rgba(108,115,63,0.3)] px-5 py-5">
                                <p className="text-xs uppercase tracking-[0.18em] text-[#efe4d0]/60">Assignment preview</p>
                                <h3 className="mt-3 text-[1.35rem] font-bold text-[#faf1e7]">{selectedTemplate}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-[#e5d8c7]">
                                    {startDateTime
                                        ? `Scheduled for ${new Date(startDateTime).toLocaleString()}`
                                        : "Select a date to see the schedule preview."}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button
                                    onClick={handleAssignClick}
                                    className="flex-1 rounded-full border border-[#dce8c5] bg-[rgba(121,76,89,0.34)] px-6 py-4 text-[1rem] font-medium text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Assign workout
                                </button>
                                <button
                                    onClick={onBack}
                                    className="rounded-full border border-white/10 px-6 py-4 text-[1rem] text-[#e8ddd2] transition-colors hover:bg-white/5"
                                >
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

const Field = ({ label, children }) => (
    <div>
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#f0ddd6]/55">{label}</p>
        {children}
    </div>
);

export default TrainerAssignWorkoutView;