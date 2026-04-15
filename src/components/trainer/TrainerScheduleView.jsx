import React from 'react';
import { FiArrowLeft, FiCheckSquare, FiUser } from 'react-icons/fi';
import { WorkoutCard } from './TrainerShared.jsx';

const TrainerScheduleView = ({ onBack, onOpenAttendance, onOpenProfile, scheduleItems }) => (
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

            <p className="mt-5 text-[1.7rem] font-medium text-[#cfc4c3] md:text-[2rem]">Sep 19, 2025</p>

            <div className="mt-5 flex justify-start">
                <button
                    onClick={onOpenAttendance}
                    className="inline-flex items-center gap-2 rounded-full border border-[#dbc98d]/55 bg-black/10 px-4 py-2.5 text-sm text-[#f3e7b5]"
                >
                    <FiCheckSquare size={16} />
                    Open attendance
                </button>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                {scheduleItems.map((item, index) => (
                    <WorkoutCard key={item.id} item={item} index={index} large />
                ))}
            </div>
        </div>
    </div>
);

export default TrainerScheduleView;
