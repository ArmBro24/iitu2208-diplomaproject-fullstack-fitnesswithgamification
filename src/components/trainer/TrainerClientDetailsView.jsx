import React, { useState } from 'react';
import { FiArrowLeft, FiChevronRight, FiTrendingUp, FiUser, FiCalendar, FiCheck } from 'react-icons/fi';
import avatarMe from '../../assets/avatars/avatar-me.png';
import { InfoBox, SectionCard } from './TrainerShared.jsx';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/training';

const TrainerClientDetailsView = ({
                                      onBack,
                                      onOpenProfile,
                                      onAssignWorkout,
                                      onRequestProgressUpdate,
                                      selectedClient,
                                      clientSessions = [],
                                      onRefreshData
                                  }) => {
    const now = new Date();
    const [actionLoading, setActionLoading] = useState(false);

    // Логика фильтрации
    const activeWorkouts = clientSessions
        .filter(s => s.status !== 'COMPLETED')
        .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));

    const workoutHistory = clientSessions
        .filter(s => s.status === 'COMPLETED')
        .sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt));

    const pendingRequests = clientSessions
        .filter(s => s.status === 'REQUESTED')
        .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));

    const nextWorkout = activeWorkouts.find(s => new Date(s.startsAt) > now && s.status !== 'REQUESTED');

    const handleApproveLog = async (session) => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            const rewardPoints = session.points?.total || session.points || 170;

            await axios.patch(`${API_BASE_URL}/logs/${session.id}/approve`, {
                points: rewardPoints,
                coachComment: "Excellent execution! Points granted."
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert(`Workout approved! ${rewardPoints} points have been added.`);
            if (onRefreshData) onRefreshData();
        } catch (e) {
            console.error("Error approving workout log:", e);
            alert(`Failed to approve: ${e.response?.data?.message || e.message}`);
        } finally {
            setActionLoading(false);
        }
    };

    // Общий рендерер карточки
    const renderSessionCard = (session) => (
        <div key={session.id} className="rounded-[22px] border border-white/5 bg-white/[0.03] p-4 transition-all hover:bg-white/[0.06]">
            <div className="flex justify-between items-center">
                <div className="flex gap-3">
                    <div className="mt-1 text-[#dce8c5]"><FiCalendar size={16}/></div>
                    <div>
                        <p className="font-bold text-[#f8efe4]">{session.title}</p>
                        <p className="text-xs text-[#d7cabc] mt-1">
                            {new Date(session.startsAt).toLocaleDateString('ru-RU')} •
                            {new Date(session.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {session.status === 'SUBMITTED' && (
                        <button
                            onClick={() => handleApproveLog(session)}
                            disabled={actionLoading}
                            className="flex items-center gap-1 rounded-full bg-[#c1cf98] px-3 py-1 text-xs font-semibold text-black transition-all hover:bg-[#b0c085] disabled:opacity-50"
                        >
                            <FiCheck size={12}/> Review
                        </button>
                    )}
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                        session.status === 'SUBMITTED' ? 'bg-yellow-500/20 text-yellow-300' :
                            session.status === 'CONFIRMED' ? 'bg-blue-500/20 text-blue-300' :
                                session.status === 'REQUESTED' ? 'bg-purple-500/20 text-purple-300' :
                                    'bg-white/10 text-white/60'
                    }`}>
                        {session.status === 'CONFIRMED' ? 'AWAITING' : session.status}
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="px-4 pb-24 pt-5 sm:px-6 md:px-8 md:pb-10 md:pt-7 lg:px-12 lg:py-10">
            <div className="mx-auto max-w-[1040px]">
                <header className="flex items-center justify-between">
                    <button onClick={onBack} className="rounded-full p-2 text-[#eee7da] transition-colors hover:bg-white/10"><FiArrowLeft size={26} /></button>
                    <h1 className="text-[1.8rem] font-medium tracking-tight text-white md:text-[2rem]">Client Details</h1>
                    <button onClick={onOpenProfile} className="rounded-full p-2 text-[#ded6c4] transition-colors hover:bg-white/10 lg:hidden"><FiUser size={20} /></button>
                    <div className="hidden lg:block lg:w-10" />
                </header>

                <div className="mt-6 grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
                    <div className="space-y-5">
                        <div className="rounded-[28px] border border-white/10 bg-black/15 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.14)] md:p-6">
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
                            <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-[#efe4d0]/60">Next Workout</p>
                                <p className="mt-3 text-[1.1rem] font-semibold text-[#f8efe4]">
                                    {nextWorkout ? `${nextWorkout.title} (${new Date(nextWorkout.startsAt).toLocaleDateString('ru-RU')})` : 'Not scheduled'}
                                </p>
                            </div>
                        </div>

                        <SectionCard title="Active & Upcoming">
                            <div className="space-y-3">
                                {activeWorkouts.length > 0 ? activeWorkouts.map(renderSessionCard) : <p className="text-sm text-center italic py-4 text-white/50">No active workouts.</p>}
                            </div>
                        </SectionCard>

                        <SectionCard title="Workout History">
                            <div className="space-y-3">
                                {workoutHistory.length > 0 ? workoutHistory.map(renderSessionCard) : <p className="text-sm text-center italic py-4 text-white/50">No past workouts.</p>}
                            </div>
                        </SectionCard>
                    </div>

                    <div className="space-y-5">
                        <SectionCard title="Progress">
                            <div className="space-y-4">
                                <StatBar label="Challenge completion" value={selectedClient.progress}/>
                                <StatBar label="Consistency score" value={Math.min(selectedClient.progress + 8, 100)}/>
                                <StatBar label="Momentum score" value={Math.min(selectedClient.progress + 4, 100)}/>
                            </div>
                        </SectionCard>
                        <SectionCard title="Activity">
                            <div className="space-y-3">
                                {(selectedClient.activity ?? []).map((item, index) => <ActivityRow key={index} title={item.title} subtitle={item.subtitle} />)}
                            </div>
                        </SectionCard>
                        <SectionCard title="Trainer Actions">
                            <div className="space-y-3">
                                <button onClick={onAssignWorkout} className="flex w-full items-center justify-between rounded-[24px] border border-[#c1cf98]/35 bg-[#c1cf98]/10 px-5 py-4 text-left text-white transition-all hover:bg-white/10">
                                    <span className="font-medium">Assign workout</span>
                                    <FiChevronRight size={18} />
                                </button>
                                <button onClick={() => onRequestProgressUpdate(selectedClient.id)} className={`flex w-full items-center justify-between rounded-[24px] border px-5 py-4 text-left transition-all hover:bg-white/10 ${selectedClient.progressRequestPending ? 'border-[#f0dd95]/35 bg-[#f0dd95]/10 text-[#f5e6bf]' : 'border-white/10 bg-black/15 text-[#f0e4dc]'}`}>
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