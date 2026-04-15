import React, { useMemo } from 'react';
import { FiArrowLeft, FiCheckCircle, FiChevronRight, FiClock, FiUser, FiXCircle } from 'react-icons/fi';
import { InfoBox, SectionCard } from './TrainerShared.jsx';

const TrainerAttendanceView = ({ onBack, onOpenClients, onOpenProfile, sessions, onChangeStatus }) => {
    const summary = useMemo(() => {
        const attended = sessions.filter((item) => item.status === 'attended').length;
        const missed = sessions.filter((item) => item.status === 'missed').length;
        const upcoming = sessions.filter((item) => item.status === 'upcoming').length;

        return {
            total: sessions.length,
            attended,
            missed,
            upcoming,
            rate: sessions.length ? Math.round((attended / sessions.length) * 100) : 0,
        };
    }, [sessions]);

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

                    <h1 className="text-[1.8rem] font-medium tracking-tight text-white md:text-[2rem]">Attendance</h1>

                    <button
                        onClick={onOpenProfile}
                        className="rounded-full p-2 text-[#ded6c4] transition-colors hover:bg-white/10 lg:hidden"
                    >
                        <FiUser size={20} />
                    </button>

                    <div className="hidden lg:block lg:w-10" />
                </header>

                <div className="mt-6 grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
                    <SectionCard title="Today Check-In">
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <InfoBox label="Total" value={summary.total} />
                            <InfoBox label="Attended" value={summary.attended} />
                            <InfoBox label="Missed" value={summary.missed} />
                            <InfoBox label="Rate" value={`${summary.rate}%`} />
                        </div>

                        <div className="mt-5 rounded-[24px] bg-[rgba(108,115,63,0.28)] px-4 py-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.18em] text-[#efe4d0]/60">Trainer note</p>
                                    <p className="mt-2 max-w-[520px] text-sm leading-relaxed text-[#f5eadf]">
                                        Confirm attendance before sending penalties or challenge updates. This keeps the client flow aligned with your BPMN logic.
                                    </p>
                                </div>

                                <button
                                    onClick={onOpenClients}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#eee3d6]/65 px-4 py-2 text-sm text-white"
                                >
                                    Open clients <FiChevronRight size={15} />
                                </button>
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard title="Status Breakdown">
                        <div className="space-y-3">
                            <StatusRow
                                title="Attended"
                                value={summary.attended}
                                accent="bg-[rgba(108,115,63,0.34)] text-[#edf0d5]"
                            />
                            <StatusRow
                                title="Upcoming"
                                value={summary.upcoming}
                                accent="bg-[rgba(122,95,42,0.32)] text-[#f4e2b4]"
                            />
                            <StatusRow
                                title="Missed"
                                value={summary.missed}
                                accent="bg-[rgba(120,71,91,0.34)] text-[#ffd4d4]"
                            />
                        </div>
                    </SectionCard>
                </div>

                <SectionCard title="Session Register">
                    <div className="space-y-4">
                        {sessions.map((session) => (
                            <AttendanceCard
                                key={session.id}
                                session={session}
                                onChangeStatus={onChangeStatus}
                            />
                        ))}
                    </div>
                </SectionCard>
            </div>
        </div>
    );
};

const AttendanceCard = ({ session, onChangeStatus }) => (
    <div className="rounded-[28px] border border-white/10 bg-black/15 px-4 py-4 md:px-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                    <p className="text-[1.05rem] font-bold text-[#f5f1ea]">{session.client}</p>
                    <StatusBadge status={session.status} />
                </div>

                <p className="mt-1 text-sm text-[#d8c8b5]">{session.name}</p>

                <p className="mt-3 flex items-center gap-2 text-sm text-[#e6dbcc]">
                    <FiClock size={14} />
                    {session.time}
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                <ActionButton
                    label="Attended"
                    icon={FiCheckCircle}
                    active={session.status === 'attended'}
                    onClick={() => onChangeStatus(session.id, 'attended')}
                    tone="success"
                />
                <ActionButton
                    label="Missed"
                    icon={FiXCircle}
                    active={session.status === 'missed'}
                    onClick={() => onChangeStatus(session.id, 'missed')}
                    tone="danger"
                />
                <ActionButton
                    label="Upcoming"
                    icon={FiClock}
                    active={session.status === 'upcoming'}
                    onClick={() => onChangeStatus(session.id, 'upcoming')}
                    tone="neutral"
                />
            </div>
        </div>
    </div>
);

const ActionButton = ({ active, icon: Icon, label, onClick, tone }) => {
    const tones = {
        success: active ? 'border-[#dce8c5] bg-[rgba(108,115,63,0.36)] text-white' : 'border-white/10 bg-white/5 text-white/70',
        danger: active ? 'border-[#ffb5b5] bg-[rgba(120,71,91,0.42)] text-white' : 'border-white/10 bg-white/5 text-white/70',
        neutral: active ? 'border-[#f0dd95] bg-[rgba(122,95,42,0.34)] text-white' : 'border-white/10 bg-white/5 text-white/70',
    };

    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${tones[tone]}`}
        >
            <Icon size={15} />
            {label}
        </button>
    );
};

const StatusBadge = ({ status }) => {
    const labels = {
        attended: 'Attended',
        missed: 'Missed',
        upcoming: 'Upcoming',
    };

    const classes = {
        attended: 'bg-[rgba(108,115,63,0.28)] text-[#edf0d5]',
        missed: 'bg-[rgba(120,71,91,0.34)] text-[#ffd4d4]',
        upcoming: 'bg-[rgba(122,95,42,0.3)] text-[#f4e2b4]',
    };

    return (
        <span className={`rounded-full px-3 py-1 text-xs ${classes[status]}`}>
            {labels[status]}
        </span>
    );
};

const StatusRow = ({ accent, title, value }) => (
    <div className={`flex items-center justify-between rounded-[22px] px-4 py-4 ${accent}`}>
        <span className="text-sm uppercase tracking-[0.14em]">{title}</span>
        <span className="text-[1.5rem] font-black">{value}</span>
    </div>
);

export default TrainerAttendanceView;
