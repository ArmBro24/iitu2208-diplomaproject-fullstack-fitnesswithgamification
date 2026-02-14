import React from 'react';

const Calendar = ({ isEdge }) => {
    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();

    // Logic to get all days of the current month
    const lastDay = new Date(currentYear, now.getMonth() + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, now.getMonth(), 0).getDay(); // Starting day of week

    const days = Array.from({ length: lastDay }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDayIndex }, (_, i) => i);

    // Random logic for status (for demo)
    const getStatus = (day) => {
        if (day === now.getDate()) return 'today';
        if (day < now.getDate()) {
            return day % 3 === 0 ? 'missed' : 'attended';
        }
        return day % 5 === 0 ? 'upcoming' : 'normal';
    };

    return (
        <div className={`bg-[#4a4e3b]/30 backdrop-blur-xl p-6 md:p-10 w-full border-t border-white/5 shadow-2xl
            ${isEdge
                ? 'rounded-tr-[40px] md:rounded-tr-0 md:rounded-bl-0 md:rounded-tl-[80px] md:border-l'
                : 'rounded-[40px] md:rounded-[80px]'}`}>

            <h3 className="text-white text-xl md:text-3xl font-bold mb-8 text-left opacity-90">
                {currentMonth} {currentYear}
            </h3>

            <div className="grid grid-cols-7 gap-y-4 md:gap-y-6 text-center">
                {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map(d => (
                    <span key={d} className="text-white/40 text-xs md:text-sm font-bold">{d}</span>
                ))}

                {emptyDays.map(e => <div key={`e-${e}`}/>)}

                {days.map(day => {
                    const status = getStatus(day);
                    return (
                        <div key={day} className="relative flex justify-center items-center h-10 w-full">
                            {status === 'today' && (
                                <div
                                    className="absolute inset-0 m-auto w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full border border-white/30"/>
                            )}
                            <span className={`relative z-10 text-base md:text-xl font-bold
                ${status === 'attended' ? 'text-[#8b5cf6]' :
                                status === 'missed' ? 'text-[#f87171]' :
                                    status === 'upcoming' ? 'text-[#c1cf98]' : 'text-white'}`}
                            >
                {day}
              </span>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-10 pt-8 border-t border-white/10">
                <LegendItem color="bg-[#8b5cf6]" label="attended"/>
                <LegendItem color="bg-[#f87171]" label="missed"/>
                <LegendItem color="bg-[#c1cf98]" label="upcoming"/>
            </div>
        </div>
    );
};

const LegendItem = ({color, label}) => (
    <div className="flex items-center gap-2 text-sm md:text-base text-white/60">
        <span className={`w-3 h-3 rounded-full ${color}`}/>
        <span>— {label}</span>
    </div>
);

export default Calendar;