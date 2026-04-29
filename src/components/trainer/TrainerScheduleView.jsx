import React, { useMemo, useState } from 'react';
import { FiArrowLeft, FiCheckSquare, FiUser } from 'react-icons/fi';
import { WorkoutCard } from './TrainerShared.jsx';

const TrainerScheduleView = ({ onBack, onOpenAttendance, onOpenProfile, scheduleItems }) => {
    const [filter, setFilter] = useState('today');

    const filteredItems = useMemo(() => {
        if (filter === 'upcoming') {
            return scheduleItems.filter((item) => item.status === 'upcoming');
        }

        return scheduleItems.filter((item) => item.status !== 'upcoming');
    }, [filter, scheduleItems]);

    return (
        <div className="px-4 pb-24 pt-5 sm:px-6 md:px-8 md:pb-10 md:pt-7 lg:px-12 lg:py-10">
            <div className="mx-auto max-w-[980px]">
                <header className="flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="rounded-full p-2 text-[#eee7da] transition-colors hover:bg-white/10"
                    >
                        <FiArrowLeft size={26} />
                    </button>

                    <h1 className="text-[1.8rem] font-medium tracking-tight text-white md:text-[2rem]">Schedule</h1>

                    <button
                        onClick={onOpenProfile}
                        className="rounded-full p-2 text-[#ded6c4] transition-colors hover:bg-white/10 lg:hidden"
                    >
                        <FiUser size={20} />
                    </button>

                    <div className="hidden lg:block lg:w-10" />
                </header>

                <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.18em] text-white/40">Session Management</p>
                        <p className="mt-2 text-[1.7rem] font-medium text-[#cfc4c3] md:text-[2rem]">Sep 19, 2025</p>
                    </div>

                    <button
                        onClick={onOpenAttendance}
                        className="inline-flex items-center gap-2 rounded-full border border-[#dbc98d]/55 bg-black/10 px-4 py-2.5 text-sm text-[#f3e7b5]"
                    >
                        <FiCheckSquare size={16} />
                        Open attendance
                    </button>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    <FilterButton
                        label="Today"
                        active={filter === 'today'}
                        onClick={() => setFilter('today')}
                    />
                    <FilterButton
                        label="Upcoming"
                        active={filter === 'upcoming'}
                        onClick={() => setFilter('upcoming')}
                    />
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                    {filteredItems.map((item, index) => (
                        <WorkoutCard key={item.id} item={item} index={index} large />
                    ))}
                </div>

                {!filteredItems.length && (
                    <div className="mt-8 rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-white/45">
                        No sessions in this filter yet.
                    </div>
                )}
            </div>
        </div>
    );
};

const FilterButton = ({ active, label, onClick }) => (
    <button
        onClick={onClick}
        className={`rounded-full border px-4 py-2 text-sm transition-all ${
            active
                ? 'border-[#c1cf98]/40 bg-[#c1cf98]/12 text-[#eef2d7]'
                : 'border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/8'
        }`}
    >
        {label}
    </button>
);

export default TrainerScheduleView;
