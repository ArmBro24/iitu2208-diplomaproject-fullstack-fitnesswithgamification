import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronRight, FiMenu, FiUser } from 'react-icons/fi';
import plansImg from '../../assets/plans.png';
import ev2 from '../../assets/events/ev2.jpg';
import avatarMe from '../../assets/avatars/avatar-me.png';
import {
    alerts,
    calendarDays,
    highlightedDays,
    kpiCards,
    leaderboardPreview
} from './trainerData.js';
import { InfoBox, MetricCard, SectionCard, WorkoutCard } from './TrainerShared.jsx';

const TrainerHomeView = ({
    clients,
    assignedWorkouts,
    onOpenSchedule,
    onOpenProfile,
    selectedClient,
    selectedClientId,
    setSelectedClientId,
}) => {
    const navigate = useNavigate();

    return (
        <div className="px-4 pb-24 pt-5 sm:px-6 md:px-8 md:pb-10 md:pt-7 lg:px-10 lg:py-10">
            <div className="mx-auto max-w-[1120px]">
                <nav className="px-2 py-1 md:px-0 md:py-0 flex items-center justify-between">
                    <button
                        onClick={onOpenSchedule}
                        className="text-2xl md:text-3xl p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all"
                    >
                        <FiMenu className="text-[#c1cf98]" />
                    </button>

                    <h1 className="text-[#c1cf98] text-3xl md:text-5xl font-rubik font-black tracking-tight">HeroFit</h1>

                    <button
                        onClick={onOpenProfile}
                        className="text-2xl md:text-3xl p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all hover:scale-105 active:scale-95"
                    >
                        <FiUser className="text-[#c1cf98]" />
                    </button>
                </nav>

                <div
                    className="relative mt-4 grid w-full gap-x-4
                    grid-cols-[0.85fr_1.15fr]
                    [grid-template-areas:'decor_decor''toptext_toptext''clients_content''calendar_calendar']
                    md:gap-x-0
                    md:grid-cols-[minmax(300px,_1fr)_0.82fr_1.18fr]
                    md:[grid-template-rows:auto_auto_minmax(320px,_1fr)_auto]
                    md:[grid-template-areas:'headertext_headertext_headertext''text1_text1_plans''clients_text2_plans''clients_calendar_calendar']"
                >
                    <div className="[grid-area:decor] md:hidden block">
                        <div className="w-[85%] h-64 overflow-hidden rounded-tr-[100px] rounded-br-[100px] shadow-2xl">
                            <img src={ev2} alt="Trainer session" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="[grid-area:toptext] md:hidden block px-6 py-4">
                        <p className="text-[#c1cf98] text-[18px] leading-tight font-medium">
                            Guide clients, track attendance, and keep every training block moving smoothly.
                        </p>
                    </div>

                    <div className="hidden md:block [grid-area:headertext] px-2 md:px-12 pt-4">
                        <p className="text-[#c1cf98] text-2xl lg:text-[26px] leading-tight font-medium max-w-4xl">
                            Coach every session with the same HeroFit rhythm, but with trainer tools and live client control.
                        </p>
                    </div>

                    <div className="[grid-area:clients] flex items-stretch md:items-end md:pr-6">
                        <div
                            onClick={onOpenProfile}
                            className="w-full h-full md:h-[95%] rounded-tr-[80px] rounded-br-[80px] md:rounded-tr-[120px] md:rounded-br-none overflow-hidden shadow-2xl relative border-2 border-transparent hover:border-[#c1cf98] active:border-[#c1cf98] transition-all duration-300 cursor-pointer"
                        >
                            <img src={ev2} alt="Trainer overview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                            <div className="absolute left-6 right-6 bottom-6">
                                <span className="inline-flex rounded-full border border-[#d8d598] px-4 py-1 text-sm text-[#f5efc9]">
                                    Profile
                                </span>
                                <p className="mt-4 max-w-[240px] text-lg leading-tight text-[#f1e6d7]">
                                    Review your coach profile, points, traits, and shared role pages from one place.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="md:contents [grid-area:content] flex flex-col">
                        <div className="md:[grid-area:text1] px-2 md:px-12 py-2 md:pt-10">
                            <p className="text-[#c1cf98] text-[18px] md:text-2xl lg:text-[26px] leading-tight font-medium max-w-[95%] md:max-w-4xl">
                                Make every coaching touchpoint feel intentional.
                                <span className="hidden md:inline"> Review progress, assign the next block, and keep your leaderboard pulse alive.</span>
                            </p>
                        </div>

                        <div className="md:[grid-area:plans] flex items-stretch md:pl-10 md:pb-10">
                            <div className="w-full h-40 md:h-full rounded-l-[50px] md:rounded-l-[100px] md:rounded-r-none overflow-hidden shadow-2xl relative border-2 border-transparent transition-all duration-300 bg-black/10">
                                <img src={plansImg} alt="Shared plans" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/25 flex flex-col justify-between p-5">
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-2xl text-white">Plans</span>
                                        <button
                                            onClick={() => navigate('/plans')}
                                            className="rounded-full border border-[#dbc98d]/70 px-4 py-2 text-[1rem] text-[#f3e7b5]"
                                        >
                                            Open
                                        </button>
                                    </div>

                                    <p className="max-w-[220px] text-[1rem] leading-[1.3] text-[#e7dcca]">
                                        Shared memberships stay accessible for every role, while admin will edit them later.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="md:[grid-area:text2] px-2 md:px-12 py-4 flex items-start">
                            <div className="flex flex-wrap gap-3">
                                <QuickAction label="Leaderboard" onClick={() => navigate('/leaderboard')} />
                                <QuickAction label="Events" onClick={() => navigate('/events')} />
                                <QuickAction label="Support" onClick={() => navigate('/support')} />
                                <QuickAction label="Schedule" onClick={onOpenSchedule} />
                            </div>
                        </div>
                    </div>

                    <div className="[grid-area:calendar] flex items-end mt-4">
                        <div className="w-[85%] md:w-full rounded-[30px] bg-[rgba(108,115,63,0.58)] px-5 pb-6 pt-5">
                            <h2 className="font-rubik text-[1.6rem] font-bold text-[#d7d2c4]">September 2025</h2>
                            <div className="mt-3 grid grid-cols-7 gap-y-2 text-center text-[0.72rem] uppercase tracking-[0.22em] text-[#dad1bd]/75">
                                {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map((day) => (
                                    <span key={day}>{day}</span>
                                ))}
                            </div>

                            <div className="mt-4 grid grid-cols-7 gap-y-3 text-center">
                                {calendarDays.map((day, index) => (
                                    <span
                                        key={`${day ?? 'empty'}-${index}`}
                                        className={`text-[1.02rem] font-medium ${
                                            day ? highlightedDays[day] ?? 'text-[#f0e7d8]' : 'text-transparent'
                                        }`}
                                    >
                                        {day ?? '0'}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                    <SectionCard title="Trainer Pulse">
                        <div className="grid grid-cols-2 gap-3">
                            {kpiCards.map((card) => (
                                <MetricCard key={card.title} {...card} />
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard title="Live Alerts" actionLabel="All">
                        <div className="space-y-3">
                            {alerts.map((alert) => (
                                <div key={alert} className="rounded-[22px] border border-white/10 bg-black/15 px-4 py-3">
                                    <p className="text-sm leading-relaxed text-[#e8ddd4]/88">{alert}</p>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                    <SectionCard title="Workout Pipeline" actionLabel="Schedule" onAction={onOpenSchedule}>
                        <div className="space-y-3">
                            {assignedWorkouts.map((item, index) => (
                                <WorkoutCard key={item.id} item={item} index={index} />
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard title="Leaderboard Pulse">
                        <div className="space-y-3">
                            {leaderboardPreview.map((entry) => (
                                <div
                                    key={entry.place}
                                    className="flex items-center justify-between rounded-[24px] border border-white/10 bg-black/15 px-4 py-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[rgba(205,178,95,0.18)] text-lg font-black text-[#d7b55e]">
                                            {entry.place}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-[#f5efe7]">{entry.name}</p>
                                            <p className="text-sm text-[#d7cabc]">Updated after challenge sync</p>
                                        </div>
                                    </div>

                                    <p className="shrink-0 text-[1.3rem] font-black text-[#efe0a0]">{entry.points}</p>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </div>

                <div className="mt-5">
                    <SectionCard title="Client Monitoring">
                        <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                            <div className="space-y-3">
                                {clients.map((client) => (
                                    <button
                                        key={client.id}
                                        type="button"
                                        onClick={() => setSelectedClientId(client.id)}
                                        className={`w-full rounded-[24px] border px-4 py-4 text-left transition-all ${
                                            selectedClientId === client.id
                                                ? 'border-[#dce8c5] bg-[rgba(121,76,89,0.34)]'
                                                : 'border-white/10 bg-black/15 hover:bg-white/10'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-[1.05rem] font-bold text-white">{client.name}</p>
                                                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#d7cabc]">
                                                    <span>{client.level}</span>
                                                    <span>attendance {client.attendance}</span>
                                                </div>
                                            </div>
                                            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#f2eadf]">
                                                {client.status}
                                            </span>
                                        </div>

                                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                                            <div
                                                className="h-full rounded-full bg-[#d8d598]"
                                                style={{ width: `${client.progress}%` }}
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="rounded-[28px] bg-[rgba(113,67,79,0.52)] px-5 py-5">
                                <p className="text-sm uppercase tracking-[0.2em] text-[#f0ddd6]/60">Selected client</p>
                                <h3 className="mt-3 text-[1.75rem] font-black text-[#f5efe7]">{selectedClient.name}</h3>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <InfoBox label="Level" value={selectedClient.level} />
                                    <InfoBox label="Attendance" value={selectedClient.attendance} />
                                    <InfoBox label="Progress" value={`${selectedClient.progress}%`} />
                                    <InfoBox label="Status" value={selectedClient.status} />
                                </div>

                                <div className="mt-4 rounded-[22px] bg-black/15 px-4 py-4">
                                    <p className="text-xs uppercase tracking-[0.18em] text-[#f0ddd6]/55">Next step</p>
                                    <p className="mt-3 text-sm leading-relaxed text-[#e9ddd2]">
                                        Review the latest submission, confirm challenge ratio, and update points after session validation.
                                    </p>
                                </div>

                                <div className="mt-4 rounded-[22px] bg-[rgba(108,115,63,0.22)] px-4 py-4">
                                    <p className="text-xs uppercase tracking-[0.18em] text-[#efe4d0]/55">Next workout</p>
                                    <p className="mt-3 text-base font-semibold text-[#f5efe7]">{selectedClient.nextWorkout}</p>
                                </div>
                            </div>
                        </div>
                    </SectionCard>
                </div>
            </div>
        </div>
    );
};

const QuickAction = ({ label, onClick }) => (
    <button
        onClick={onClick}
        className="inline-flex items-center gap-2 rounded-full border border-[#eee3d6]/70 px-4 py-2 text-[1rem] text-white transition-all hover:bg-white/10"
    >
        {label} <FiChevronRight size={16} />
    </button>
);

export default TrainerHomeView;
