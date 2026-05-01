import React, { useMemo } from 'react';
import { FiArrowRight, FiChevronRight, FiUser } from 'react-icons/fi';
import { WorkoutCard } from './TrainerShared.jsx';

const TrainerHomeView = ({
    clients,
    assignedWorkouts,
    keyMetrics,
    onOpenClients,
    onOpenSchedule,
    onOpenProfile,
    selectedClient,
    setSelectedClientId,
}) => {
    const todaySchedule = assignedWorkouts.slice(0, 4);

    const attentionClients = useMemo(() => {
        const priorityClients = clients.filter((client) =>
            client.progressRequestPending ||
            client.status === 'Needs review' ||
            client.status === 'At risk' ||
            client.status === 'Update requested'
        );

        return (priorityClients.length ? priorityClients : clients).slice(0, 5);
    }, [clients]);

    return (
        <div className="px-4 pb-24 pt-5 sm:px-6 md:px-8 md:pb-10 md:pt-7 lg:px-10 lg:py-10">
            <div className="mx-auto max-w-[1120px]">
                <nav className="flex items-center justify-between px-2 py-1 md:px-0 md:py-0">
                    <div className="w-11 md:w-14" />

                    <h1 className="font-rubik text-3xl font-black tracking-tight text-[#c1cf98] md:text-5xl">HeroFit</h1>

                    <button
                        onClick={onOpenProfile}
                        className="rounded-xl border border-white/10 bg-white/5 p-2 text-2xl transition-all hover:bg-white/10 hover:scale-105 active:scale-95 md:rounded-2xl md:p-3 md:text-3xl"
                    >
                        <FiUser className="text-[#c1cf98]" />
                    </button>
                </nav>

                <div className="mt-6">
                    <div className="flex flex-col gap-2 px-1 md:px-0">
                        <p className="text-sm uppercase tracking-[0.2em] text-white/45">Dashboard</p>
                        <h2 className="font-rubik text-[2rem] font-bold text-[#f5efe7] md:text-[2.4rem]">
                            Trainer Overview
                        </h2>
                        <p className="max-w-[640px] text-sm leading-relaxed text-white/55 md:text-base">
                            A quick overview of today&apos;s sessions and the clients who need your attention first.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {keyMetrics.map((metric) => (
                            <DashboardCard key={metric.title}>
                                <p className="text-sm text-white/55">{metric.title}</p>
                                <p className="mt-3 text-[2rem] font-black text-[#f5efe7]">{metric.value}</p>
                            </DashboardCard>
                        ))}
                    </div>

                    <div className="mt-6 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
                        <DashboardCard
                            title="Today Schedule"
                            actionLabel="Open Schedule"
                            onAction={onOpenSchedule}
                        >
                            <div className="space-y-3">
                                {todaySchedule.map((item, index) => (
                                    <WorkoutCard key={item.id} item={item} index={index} />
                                ))}

                                {!todaySchedule.length && (
                                    <EmptyState text="No sessions scheduled for today." />
                                )}
                            </div>
                        </DashboardCard>

                        <DashboardCard
                            title="Clients Needing Attention"
                            actionLabel="View Clients"
                            onAction={onOpenClients}
                        >
                            <div className="space-y-3">
                                {attentionClients.map((client) => (
                                    <button
                                        key={client.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedClientId(client.id);
                                            onOpenClients();
                                        }}
                                        className={`w-full rounded-[22px] border px-4 py-4 text-left transition-all ${
                                            selectedClient?.id === client.id
                                                ? 'border-[#c1cf98]/60 bg-white/10'
                                                : 'border-white/10 bg-white/[0.03] hover:bg-white/8'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="truncate text-[1rem] font-semibold text-[#f5efe7]">
                                                    {client.name}
                                                </p>
                                                <p className="mt-1 text-sm text-white/50">
                                                    {client.level} / {client.attendance} attendance
                                                </p>
                                            </div>

                                            <StatusPill label={client.status} />
                                        </div>

                                        <div className="mt-3 flex items-center justify-between gap-3">
                                            <p className="text-sm text-white/60">{client.nextWorkout}</p>
                                            <span className="inline-flex items-center gap-2 text-sm text-[#c1cf98]">
                                                Details <FiChevronRight size={14} />
                                            </span>
                                        </div>
                                    </button>
                                ))}

                                {!attentionClients.length && (
                                    <EmptyState text="No urgent clients right now." />
                                )}
                            </div>
                        </DashboardCard>
                    </div>

                </div>
            </div>
        </div>
    );
};

const DashboardCard = ({ title, actionLabel, onAction, children }) => (
    <section className="rounded-[28px] border border-white/10 bg-[rgba(18,20,24,0.82)] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
        {(title || actionLabel) && (
            <div className="mb-4 flex items-center justify-between gap-4">
                {title ? (
                    <h3 className="font-rubik text-[1.35rem] font-bold text-[#f5efe7]">{title}</h3>
                ) : (
                    <span />
                )}

                {actionLabel && onAction && (
                    <button
                        onClick={onAction}
                        className="inline-flex items-center gap-2 rounded-full border border-[#c1cf98]/30 px-4 py-2 text-sm text-[#c1cf98] transition-all hover:bg-white/5"
                    >
                        {actionLabel}
                        <FiArrowRight size={14} />
                    </button>
                )}
            </div>
        )}
        {children}
    </section>
);

const StatusPill = ({ label }) => (
    <span className="rounded-full border border-[#c1cf98]/20 bg-[#c1cf98]/10 px-3 py-1 text-xs text-[#eef2d7]">
        {label}
    </span>
);

const EmptyState = ({ text }) => (
    <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-white/45">
        {text}
    </div>
);

export default TrainerHomeView;
