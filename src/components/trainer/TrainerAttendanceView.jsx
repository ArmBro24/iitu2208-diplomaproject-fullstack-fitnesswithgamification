import React from 'react';
import { FiArrowLeft, FiClock, FiUser } from 'react-icons/fi';

const TrainerAttendanceView = ({ onBack, onOpenProfile, sessions, onChangeStatus }) => {
    const editableSessions = sessions.filter((item) => item.status !== 'upcoming');

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

                    <h1 className="text-[1.8rem] font-medium tracking-tight text-white md:text-[2rem]">Attendance</h1>

                    <button
                        onClick={onOpenProfile}
                        className="rounded-full p-2 text-[#ded6c4] transition-colors hover:bg-white/10 lg:hidden"
                    >
                        <FiUser size={20} />
                    </button>

                    <div className="hidden lg:block lg:w-10" />
                </header>

                <div className="mt-5">
                    <p className="text-sm uppercase tracking-[0.18em] text-white/40">Status Update</p>
                    <p className="mt-2 text-[1.7rem] font-medium text-[#cfc4c3] md:text-[2rem]">Session List</p>
                </div>

                <div className="mt-8 space-y-4">
                    {editableSessions.map((session) => (
                        <AttendanceCard
                            key={session.id}
                            session={session}
                            onChangeStatus={onChangeStatus}
                        />
                    ))}
                </div>

                {!editableSessions.length && (
                    <div className="mt-8 rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-white/45">
                        No sessions available for attendance updates.
                    </div>
                )}
            </div>
        </div>
    );
};

const AttendanceCard = ({ session, onChangeStatus }) => (
    <div className="rounded-[28px] border border-white/10 bg-black/15 px-4 py-4 md:px-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
                <p className="text-[1.05rem] font-bold text-[#f5f1ea]">{session.client}</p>
                <p className="mt-1 text-sm text-[#d8c8b5]">{session.name}</p>

                <p className="mt-3 flex items-center gap-2 text-sm text-[#e6dbcc]">
                    <FiClock size={14} />
                    {session.time}
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                <ActionButton
                    label="Present"
                    active={session.status === 'present'}
                    onClick={() => onChangeStatus(session.id, 'present')}
                    tone="success"
                />
                <ActionButton
                    label="Missed"
                    active={session.status === 'missed'}
                    onClick={() => onChangeStatus(session.id, 'missed')}
                    tone="danger"
                />
                <ActionButton
                    label="Late"
                    active={session.status === 'late'}
                    onClick={() => onChangeStatus(session.id, 'late')}
                    tone="warning"
                />
            </div>
        </div>
    </div>
);

const ActionButton = ({ active, label, onClick, tone }) => {
    const tones = {
        success: active ? 'border-[#dce8c5] bg-[rgba(108,115,63,0.36)] text-white' : 'border-white/10 bg-white/5 text-white/70',
        danger: active ? 'border-[#ffb5b5] bg-[rgba(120,71,91,0.42)] text-white' : 'border-white/10 bg-white/5 text-white/70',
        warning: active ? 'border-[#f0dd95] bg-[rgba(122,95,42,0.34)] text-white' : 'border-white/10 bg-white/5 text-white/70',
    };

    return (
        <button
            onClick={onClick}
            className={`rounded-full border px-4 py-2 text-sm transition-all ${tones[tone]}`}
        >
            {label}
        </button>
    );
};

export default TrainerAttendanceView;
