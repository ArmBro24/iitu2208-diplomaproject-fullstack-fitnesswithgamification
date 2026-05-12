import React, { useMemo, useState } from 'react';
import { FiArrowLeft, FiCalendar, FiCheckSquare, FiUser } from 'react-icons/fi';
import { WorkoutCard } from './TrainerShared.jsx';

const TrainerScheduleView = ({ onBack, onOpenAttendance, onOpenProfile, scheduleItems }) => {
    const today = useMemo(() => new Date(), []);
    const [selectedDay, setSelectedDay] = useState(today.getDate());

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const calendarItems = useMemo(
        () => scheduleItems.map((item, index) => ({
            ...item,
            scheduleDate: resolveScheduleDate(item, index, today),
        })),
        [scheduleItems, today]
    );

    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 0).getDay();
    const emptyDays = Array.from({ length: firstDayIndex }, (_, i) => i);
    const days = Array.from({ length: lastDay }, (_, i) => i + 1);

    const selectedItems = useMemo(
        () => calendarItems.filter((item) => isSameMonthDay(item.scheduleDate, currentYear, currentMonth, selectedDay)),
        [calendarItems, currentMonth, currentYear, selectedDay]
    );

    const selectedDateLabel = new Date(currentYear, currentMonth, selectedDay).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    const getDayStatus = (day) => {
        if (day === today.getDate()) return 'today';

        const dayItems = calendarItems.filter((item) => isSameMonthDay(item.scheduleDate, currentYear, currentMonth, day));
        if (!dayItems.length) return 'normal';
        if (dayItems.some((item) => item.status === 'missed')) return 'missed';
        if (dayItems.some((item) => item.status === 'late')) return 'late';
        if (dayItems.some((item) => item.status === 'upcoming')) return 'upcoming';
        return 'present';
    };

    return (
        <div className="px-4 pb-24 pt-5 sm:px-6 md:px-8 md:pb-10 md:pt-7 lg:px-12 lg:py-10">
            <div className="mx-auto max-w-[1080px]">
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
                        <p className="mt-2 text-[1.7rem] font-medium text-[#cfc4c3] md:text-[2rem]">
                            {monthNames[currentMonth]} {currentYear}
                        </p>
                    </div>

                    <button
                        onClick={onOpenAttendance}
                        className="inline-flex items-center gap-2 rounded-full border border-[#c1cf98]/30 bg-white/[0.03] px-4 py-2.5 text-sm text-[#c1cf98] transition-all hover:bg-white/8"
                    >
                        <FiCheckSquare size={16} />
                        Open attendance
                    </button>
                </div>

                <section className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
                    <div className="rounded-[28px] border border-white/10 bg-black/15 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-6 md:p-8">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-white/35">Calendar</p>
                                <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                                    {monthNames[currentMonth]}
                                </h2>
                            </div>
                            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#c1cf98]">
                                <FiCalendar size={20} />
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-y-3 text-center sm:gap-y-5">
                            {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map((day) => (
                                <span key={day} className="text-xs font-bold text-white/40 md:text-sm">
                                    {day}
                                </span>
                            ))}
                            {emptyDays.map((day) => <div key={`empty-${day}`} />)}
                            {days.map((day) => {
                                const status = getDayStatus(day);
                                const isSelected = selectedDay === day;

                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => setSelectedDay(day)}
                                        className={`relative mx-auto flex h-10 w-10 items-center justify-center rounded-full text-base font-bold transition-all md:h-12 md:w-12 md:text-xl ${
                                            isSelected
                                                ? 'bg-[#c1cf98] text-[#1a1f16] shadow-[0_12px_28px_rgba(193,207,152,0.22)]'
                                                : 'text-white hover:bg-white/10'
                                        }`}
                                    >
                                        {!isSelected && status !== 'normal' && (
                                            <span className={`absolute inset-0 rounded-full border ${statusRingClass(status)}`} />
                                        )}
                                        <span className={isSelected ? '' : statusTextClass(status)}>{day}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-6">
                            <LegendItem color="bg-[#d8b3ff]" label="present" />
                            <LegendItem color="bg-[#ff8383]" label="missed" />
                            <LegendItem color="bg-[#f0dd95]" label="late" />
                            <LegendItem color="bg-[#e1cb6d]" label="upcoming" />
                        </div>
                    </div>

                    <div className="min-h-[360px] rounded-[28px] border border-white/10 bg-black/15 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-white/35">Selected day</p>
                                <h2 className="mt-2 text-2xl font-bold text-[#f0e4dc]">{selectedDateLabel}</h2>
                            </div>
                            <p className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-white/55">
                                {selectedItems.length} session{selectedItems.length === 1 ? '' : 's'}
                            </p>
                        </div>

                        <div className="mt-6 grid gap-4">
                            {selectedItems.map((item, index) => (
                                <WorkoutCard key={item.id} item={item} index={index} large />
                            ))}
                        </div>

                        {!selectedItems.length && (
                            <div className="mt-6 rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-white/45">
                                No sessions scheduled for this day.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

const LegendItem = ({ color, label }) => (
    <div className="flex items-center gap-2 text-sm text-white/60 md:text-base">
        <span className={`h-3 w-3 rounded-full ${color}`} />
        <span>{label}</span>
    </div>
);

const resolveScheduleDate = (item, index, today) => {
    const explicitDate = item.startsAt ?? item.date ?? item.scheduleDate;
    if (explicitDate) {
        const parsedDate = new Date(explicitDate);
        if (!Number.isNaN(parsedDate.getTime())) return parsedDate;
    }

    const fallbackDate = new Date(today);
    const offsets = [0, 0, 1, 2, 4, 6, 8];
    fallbackDate.setDate(today.getDate() + offsets[index % offsets.length]);
    return fallbackDate;
};

const isSameMonthDay = (date, year, month, day) => (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
);

const statusTextClass = (status) => {
    if (status === 'present') return 'text-[#d8b3ff]';
    if (status === 'missed') return 'text-[#ff8383]';
    if (status === 'late') return 'text-[#f0dd95]';
    if (status === 'upcoming') return 'text-[#e1cb6d]';
    if (status === 'today') return 'text-white';
    return 'text-white';
};

const statusRingClass = (status) => {
    if (status === 'present') return 'border-[#d8b3ff]/70 bg-[#d8b3ff]/10';
    if (status === 'missed') return 'border-[#ff8383]/70 bg-[#ff8383]/10';
    if (status === 'late') return 'border-[#f0dd95]/70 bg-[#f0dd95]/10';
    if (status === 'upcoming') return 'border-[#e1cb6d]/70 bg-[#e1cb6d]/10';
    if (status === 'today') return 'border-white/30 bg-white/10';
    return 'border-transparent';
};

export default TrainerScheduleView;
