import React, { useState } from 'react';
import useStore from '../../store/useStore';

const Calendar = ({ isEdge, onDateClick }) => {
    const [tooltipDay, setTooltipDay] = useState(null);
    const sessions = useStore((state) => state.sessions);

    const now = new Date();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();

    const lastDay = new Date(currentYear, now.getMonth() + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, now.getMonth(), 0).getDay();

    const days = Array.from({ length: lastDay }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDayIndex }, (_, i) => i);

    const getSessionForDay = (day) => {
        if (!Array.isArray(sessions)) return null;
        return sessions.find((session) => {
            if (!session.startsAt) return false;
            const date = new Date(session.startsAt);
            return date.getDate() === day &&
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear();
        });
    };

    const getStatus = (day) => {
        const session = getSessionForDay(day);
        if (day === now.getDate()) return 'today';
        if (!session) return 'normal';

        const status = String(session.status).toUpperCase();
        if (['CONFIRMED', 'COMPLETED', 'ATTENDED'].includes(status)) return 'attended';
        if (status === 'REQUESTED') return 'upcoming';
        if (status === 'MISSED') return 'missed';
        return 'upcoming';
    };

    const handleDayClick = (day) => {
        if (!sessions) return;
        const session = getSessionForDay(day);
        if (!session) {
            setTooltipDay(day);
            setTimeout(() => setTooltipDay(null), 1800);
            return;
        }

        const startsAt = new Date(session.startsAt);
        const endsAt = session.endsAt ? new Date(session.endsAt) : null;
        const endTime = endsAt
            ? endsAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '';

        const dataToSet = {
            ...session,
            date: startsAt.toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
            }),
            time: `${startsAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${endTime ? ` - ${endTime}` : ''}`,
            status: String(session.status).toLowerCase()
        };

        if (onDateClick) onDateClick(dataToSet);
    };

    return (
        <div className={`w-full border-t border-white/10 bg-[rgba(18,20,24,0.82)] p-5 shadow-2xl backdrop-blur-xl md:p-7
            ${isEdge
            ? 'rounded-tr-[34px] md:rounded-tl-[56px] md:rounded-tr-0 md:rounded-bl-0 md:border-l'
            : 'rounded-[28px]'}`}>

            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#c1cf98]/75">
                        Training calendar
                    </p>
                    <h3 className="mt-1 text-2xl font-black tracking-tight text-[#f5efe7] md:text-3xl">
                        {currentMonth} {currentYear}
                    </h3>
                </div>
                <span className="rounded-full border border-[#c1cf98]/25 bg-[#c1cf98]/10 px-3 py-1 text-xs font-bold text-[#dfe9bf]">
                    Live
                </span>
            </div>

            <div className="grid grid-cols-7 gap-x-1 gap-y-2 text-center md:gap-y-3">
                {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map((day) => (
                    <span key={day} className="text-[11px] font-black uppercase tracking-[0.14em] text-white/40 md:text-xs">
                        {day}
                    </span>
                ))}
                {emptyDays.map((day) => <div key={`e-${day}`} />)}
                {days.map((day) => {
                    const status = getStatus(day);
                    return (
                        <div
                            key={day}
                            onClick={() => handleDayClick(day)}
                            className="group relative flex h-10 w-full cursor-pointer items-center justify-center md:h-11"
                        >
                            {tooltipDay === day && (
                                <span className="absolute bottom-full z-50 mb-3 whitespace-nowrap rounded-2xl border border-[#c1cf98]/40 bg-[#dfe9bf] px-4 py-2 text-xs font-black text-[#161913] shadow-2xl">
                                    No workout scheduled
                                </span>
                            )}
                            <span className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-2xl text-sm font-black transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 md:h-10 md:w-10 md:text-base ${dayStateClass(status)}`}>
                                {day}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-5">
                <LegendItem color="bg-[#8b5cf6]" label="attended" />
                <LegendItem color="bg-[#f87171]" label="missed" />
                <LegendItem color="bg-[#c1cf98]" label="upcoming" />
            </div>
        </div>
    );
};

const dayStateClass = (status) => {
    if (status === 'today') {
        return 'border border-white/25 bg-white/16 text-white shadow-[0_0_24px_rgba(255,255,255,0.12)]';
    }
    if (status === 'attended') {
        return 'border border-[#8b5cf6]/30 bg-[#8b5cf6]/14 text-[#bda7ff]';
    }
    if (status === 'missed') {
        return 'border border-[#f87171]/30 bg-[#f87171]/12 text-[#fca5a5]';
    }
    if (status === 'upcoming') {
        return 'border border-[#c1cf98]/35 bg-[#c1cf98]/12 text-[#dfe9bf]';
    }
    return 'border border-transparent text-white/72 group-hover:border-white/10 group-hover:bg-white/[0.06] group-hover:text-white';
};

const LegendItem = ({ color, label }) => (
    <div className="flex items-center gap-2 text-xs font-medium text-white/55 md:text-sm">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <span>{label}</span>
    </div>
);

export default Calendar;
