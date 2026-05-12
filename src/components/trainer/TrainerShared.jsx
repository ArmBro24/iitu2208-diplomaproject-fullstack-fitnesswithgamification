import React from 'react';
import { FiClock } from 'react-icons/fi';
import avatarMe from '../../assets/avatars/avatar-me.png';
import { accentClasses, avatarFrame, statusTextClass } from './trainerData.js';

export const SectionCard = ({ title, actionLabel, onAction, children }) => (
    <section className="rounded-[28px] border border-white/10 bg-black/15 p-4 shadow-[0_10px_35px_rgba(0,0,0,0.14)] md:p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-rubik text-[1.35rem] font-bold text-[#f0e4dc] md:text-[1.5rem]">{title}</h2>
            {actionLabel && (
                <button
                    onClick={onAction}
                    className="rounded-full border border-[#c1cf98]/30 px-4 py-2 text-sm text-[#c1cf98] transition-all hover:bg-white/5"
                >
                    {actionLabel}
                </button>
            )}
        </div>
        {children}
    </section>
);

export const MetricCard = ({ title, value, icon: Icon, accent }) => (
    <div className={`rounded-[24px] px-4 py-4 ${accentClasses[accent]}`}>
        <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-[#f0e4dc]/75">{title}</p>
            <Icon size={18} className="text-white/80" />
        </div>
        <p className="mt-3 text-[1.8rem] font-black text-white">{value}</p>
    </div>
);

export const WorkoutCard = ({ item, index, large = false }) => (
    <div className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-black/15 px-4 py-4 shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-all hover:border-[#c1cf98]/35 hover:bg-white/10">
        <div className={`relative shrink-0 overflow-hidden rounded-full border border-white/15 ${large ? 'h-[72px] w-[72px]' : 'h-[58px] w-[58px]'} ${avatarFrame(index)}`}>
            <img
                src={avatarMe}
                alt={item.client}
                className="h-full w-full object-cover p-1"
            />
        </div>

        <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className={`${large ? 'text-[1.15rem]' : 'text-[1rem]'} truncate font-bold text-[#f5f1ea]`}>
                        {item.workout ?? item.name}
                    </p>
                    <p className="mt-1 truncate text-sm text-[#d8c8b5]">{item.client}</p>
                </div>

                <div className="text-right">
                    <p className="flex items-center gap-1 text-sm text-[#d7cdbd]">
                        <FiClock size={13} />
                        {item.time}
                    </p>
                    <p className={`mt-1 text-sm font-medium capitalize ${statusTextClass(item.status)}`}>{item.status}</p>
                </div>
            </div>
        </div>
    </div>
);

export const InfoBox = ({ label, value }) => (
    <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-3 py-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#f0ddd6]/55">
            {compactLabel(label)}
        </p>
        <p className="mt-2 text-sm font-semibold text-[#f6efe8]">{value}</p>
    </div>
);

const compactLabel = (label) => {
    if (label === 'Attendance') return 'Attend.';
    return label;
};

export const DesktopNavButton = ({ label, active = false, danger = false, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full rounded-full px-5 py-3 text-left text-sm transition-all ${
            danger
                ? 'bg-red-400/10 text-red-200 hover:bg-red-400/20'
                : active
                    ? 'bg-[#8a8950]/45 text-white'
                    : 'bg-white/5 text-white/65 hover:bg-white/10'
        }`}
    >
        {label}
    </button>
);
