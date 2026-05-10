import React from 'react';
import { FiArrowLeft, FiChevronRight, FiTrendingUp, FiUser, FiCalendar } from 'react-icons/fi';
import avatarMe from '../../assets/avatars/avatar-me.png';
import { InfoBox, SectionCard } from './TrainerShared.jsx';

const TrainerClientDetailsView = ({
                                      onBack,
                                      onOpenProfile,
                                      onAssignWorkout,
                                      onRequestProgressUpdate,
                                      selectedClient,
                                      clientSessions = []
                                  }) => {
    const now = new Date();

    const nextWorkout = clientSessions
        .filter(s => new Date(s.startsAt) > now && s.status !== 'REQUESTED')
        .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt))[0];

    const pendingRequests = clientSessions
        .filter(s => s.status === 'REQUESTED')
        .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));

    const workoutHistory = clientSessions
        .filter(s => new Date(s.endsAt) < now)
        .sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt));

    return (
        <div className="px-4 pb-24 pt-5 sm:px-6 md:px-8 md:pb-10 md:pt-7 lg:px-12 lg:py-10">
            <div className="mx-auto max-w-[1040px]">
                <header className="flex items-center justify-between">
                    <button onClick={onBack} className="rounded-full p-2 text-[#eee7da] transition-colors hover:bg-white/10">
                        <FiArrowLeft size={26} />
                    </button>
                    <h1 className="text-[1.8rem] font-medium tracking-tight text-white md:text-[2rem]">Client Details</h1>
                    <button onClick={onOpenProfile} className="rounded-full p-2 text-[#ded6c4] transition-colors hover:bg-white/10 lg:hidden">
                        <FiUser size={20} />
                    </button>
                    <div className="hidden lg:block lg:w-10" />
                </header>

                <div className="mt-6 grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
                    <div className="space-y-5">
                        <div className="rounded-[30px] border border-white/10 bg-[rgba(15,16,18,0.16)] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.14)] md:p-6">
                            <p className="text-sm uppercase tracking-[0.18em] text-[#f0ddd6]/55">Profile</p>
                            <div className="mt-4 flex items-center gap-4">
                                <div className="relative h-[88px] w-[88px] overflow-hidden rounded-full border border-white/15 bg-[radial-gradient(circle_at_30%_30%,#f19add,#704436)]">
                                    <img src={avatarMe} alt={selectedClient.name} className="h-full w-full object-cover p-1" />
                                </div>
                                <div>
                                    <h2 className="text-[1.7rem] font-black text-[#f5efe7]">{selectedClient.name}</h2>
                                    <p className="mt-1 text-sm text-[#d7cabc]">{selectedClient.goal}</p>
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3">
                                <InfoBox label="Level" value={selectedClient.level} />
                                <InfoBox label="Progress" value={`${selectedClient.progress}%`} />
                                <InfoBox label="Streak" value={selectedClient.streak} />
                                <InfoBox label="Status" value={selectedClient.status} />
                            </div>

                            <div className="mt-5 rounded-[24px] bg-[rgba(108,115,63,0.3)] px-4 py-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-[#efe4d0]/60">Next Workout</p>
                                <p className="mt-3 text-[1.1rem] font-semibold text-[#f8efe4]">
                                    {nextWorkout
                                        ? `${nextWorkout.title} (${new Date(nextWorkout.startsAt).toLocaleDateString('ru-RU')})`
                                        : 'Not scheduled'}
                                </p>
                            </div>

                            <div className="mt-5 rounded-[24px] bg-[rgba(121,76,89,0.24)] px-4 py-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-[#f0ddd6]/60">Progress request</p>
                                <div className="mt-3 flex flex-col gap-2">
                                    {pendingRequests.length > 0 ? (
                                        pendingRequests.map(req => (
                                            <div key={req.id} className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                                                <span className="text-sm text-[#f8efe4] font-medium">{req.title}</span>
                                                <span className="text-xs text-[#dfd2c4]">{new Date(req.startsAt).toLocaleDateString('ru-RU')}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-sm text-[#edf0d5] bg-[rgba(108,115,63,0.3)] px-3 py-1 rounded-full w-fit">
                                            No pending requests
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <SectionCard title="Workout History">
                            <div className="space-y-3">
                                {workoutHistory.length > 0 ? (
                                    workoutHistory.map((session) => (
                                        <div key={session.id} className="rounded-[22px] border border-white/5 bg-white/[0.03] p-4 transition-all hover:bg-white/[0.06]">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-3">
                                                    <div className="mt-1 text-[#dce8c5]"><FiCalendar size={16} /></div>
                                                    <div>
                                                        <p className="font-bold text-[#f8efe4]">{session.title}</p>
                                                        <p className="text-xs text-[#d7cabc] mt-1">
                                                            {new Date(session.startsAt).toLocaleDateString('ru-RU')} • {new Date(session.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                                                    session.status === 'ATTENDED' || session.status === 'COMPLETED' ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-white/60'
                                                }`}>
                                                    {session.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm leading-relaxed text-[#f3e8dc]/50 italic py-4 text-center">No past workouts.</p>
                                )}
                            </div>
                        </SectionCard>
                    </div>

                    <div className="space-y-5">
                        <SectionCard title="Progress">
                            <div className="space-y-4">
                                <StatBar label="Challenge completion" value={selectedClient.progress} />
                                <StatBar label="Consistency score" value={Math.min(selectedClient.progress + 8, 100)} />
                                <StatBar label="Momentum score" value={Math.min(selectedClient.progress + 4, 100)} />
                            </div>
                        </SectionCard>
                        <SectionCard title="Activity">
                            <div className="space-y-3">
                                {(selectedClient.activity ?? []).map((item, index) => (
                                    <ActivityRow key={index} title={item.title} subtitle={item.subtitle} />
                                ))}
                            </div>
                        </SectionCard>
                        <SectionCard title="Trainer Actions">
                            <div className="space-y-3">
                                <button onClick={onAssignWorkout} className="flex w-full items-center justify-between rounded-[24px] border border-[#dce8c5] bg-[rgba(121,76,89,0.34)] px-5 py-4 text-left text-white">
                                    <span className="font-medium">Assign workout</span>
                                    <FiChevronRight size={18} />
                                </button>
                                <button onClick={() => onRequestProgressUpdate(selectedClient.id)} className={`flex w-full items-center justify-between rounded-[24px] border px-5 py-4 text-left ${selectedClient.progressRequestPending ? 'border-[#f0dd95]/35 bg-[rgba(122,95,42,0.22)] text-[#f5e6bf]' : 'border-white/10 bg-black/15 text-[#f0e4dc]'}`}>
                                    <span className="font-medium">{selectedClient.progressRequestPending ? 'Progress request sent' : 'Request progress update'}</span>
                                    <FiTrendingUp size={18} />
                                </button>
                            </div>
                        </SectionCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatBar = ({ label, value }) => (
    <div>
        <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm text-[#f1e6db]">{label}</span>
            <span className="text-sm font-semibold text-[#efe0a0]">{value}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-[#d8d598]" style={{ width: `${value}%` }} />
        </div>
    </div>
);

const ActivityRow = ({ title, subtitle }) => (
    <div className="rounded-[22px] border border-white/10 bg-black/15 px-4 py-4">
        <p className="font-medium text-[#f7efe5]">{title}</p>
        <p className="mt-1 text-sm text-[#d9cebf]">{subtitle}</p>
    </div>
);

export default TrainerClientDetailsView;