import React from 'react';
import { FiMenu, FiShield, FiUser } from 'react-icons/fi';
import homeImg from '../../assets/home.png';
import coachesImg from '../../assets/coaches.png';
import plansImg from '../../assets/plans.png';
import { adminCalendarDays, adminHighlightDays, adminStats } from './adminData.js';
import { AdminPanelCard, AdminSectionTitle, AdminStatChip } from './AdminShared.jsx';

const AdminHomeView = ({ onOpenMenu, onOpenUsers, onOpenSubscriptions, onOpenSupport }) => (
    <div className="relative min-h-screen text-white font-rubik flex flex-col overflow-x-hidden">
        <div className="relative z-10 grid w-full flex-grow gap-4 px-4 pb-8 pt-5 md:px-8 md:pb-10 lg:grid-cols-[0.92fr_1.08fr] lg:grid-rows-[auto_1fr] lg:gap-6 lg:px-10 lg:pt-8">
            <nav className="col-span-full flex items-center justify-between">
                <button
                    onClick={onOpenMenu}
                    className="rounded-2xl bg-white/5 p-3 text-2xl transition-all hover:bg-white/10"
                >
                    <FiMenu className="text-[#c1cf98]" />
                </button>

                <h1 className="text-3xl font-black tracking-tight text-[#c1cf98] md:text-5xl">HeroFit</h1>

                <div className="rounded-2xl bg-white/5 p-3">
                    <FiShield className="text-[#c1cf98]" size={24} />
                </div>
            </nav>

            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr] lg:grid-cols-1">
                    <AdminPanelCard className="overflow-hidden">
                        <img src={homeImg} alt="Admin overview" className="h-[260px] w-full object-cover md:h-[320px]" />
                    </AdminPanelCard>

                    <AdminPanelCard onClick={onOpenUsers} className="relative overflow-hidden px-5 py-5 md:min-h-[270px]">
                        <span className="inline-flex rounded-full border border-[#d8d598] px-4 py-1 text-sm text-[#f5efc9]">
                            Users
                        </span>
                        <div className="mt-4 flex items-end justify-between gap-4">
                            <div>
                                <p className="max-w-[170px] text-lg leading-tight text-[#f1e6d7]">
                                    Manage clients, trainers, and account health.
                                </p>
                            </div>
                            <FiUser className="shrink-0 text-[#c1cf98]" size={30} />
                        </div>
                    </AdminPanelCard>
                </div>

                <div className="grid gap-4">
                    <AdminSectionTitle
                        title="Admin control center"
                        body="Monitor subscriptions, coordinate support, and keep the HeroFit system clean without leaving the same visual language."
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                        {adminStats.map((item) => (
                            <AdminStatChip key={item.label} label={item.label} value={item.value} tone={item.tone} />
                        ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
                        <AdminPanelCard onClick={onOpenSubscriptions} className="overflow-hidden">
                            <div className="flex items-start justify-between px-5 pb-2 pt-5">
                                <span className="text-2xl text-white">Plans</span>
                                <span className="text-xl text-white/70">{'->'}</span>
                            </div>
                            <img src={plansImg} alt="Subscriptions" className="h-[170px] w-full object-cover" />
                        </AdminPanelCard>

                        <AdminPanelCard onClick={onOpenSupport} className="overflow-hidden p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.24em] text-white/45">Support</p>
                                    <p className="mt-3 max-w-[240px] text-lg leading-tight text-[#f1e6d7]">
                                        Handle contacts, active tickets, and user-facing escalations.
                                    </p>
                                </div>
                                <img src={coachesImg} alt="Support" className="h-[150px] w-[120px] rounded-[26px] object-cover" />
                            </div>
                        </AdminPanelCard>
                    </div>
                </div>
            </div>

            <AdminPanelCard className="px-5 py-5 lg:min-h-[290px]">
                <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr] lg:items-end">
                    <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-white/45">System rhythm</p>
                        <p className="mt-3 max-w-[420px] text-lg leading-tight text-[#f1e6d7]">
                            Keep moderation, subscription renewals, and trainer supervision visible in one place.
                        </p>
                    </div>

                    <div className="rounded-[28px] bg-[rgba(122,95,42,0.24)] px-5 py-5">
                        <p className="text-2xl font-bold text-[#efe3bf]">September 2025</p>
                        <div className="mt-5 grid grid-cols-7 gap-y-3 text-center text-sm text-[#f1e6d7]">
                            {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map((day) => (
                                <span key={day} className="text-[11px] tracking-[0.14em] text-white/45">{day}</span>
                            ))}

                            {adminCalendarDays.map((day) => (
                                <span key={day} className={`${adminHighlightDays[day] ?? ''}`}>
                                    {day}
                                </span>
                            ))}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-4 text-sm text-[#f1e6d7]">
                            <LegendDot color="bg-[#c98bff]" label="maintenance" />
                            <LegendDot color="bg-[#ff9f7a]" label="support load" />
                            <LegendDot color="bg-white/40" label="today" />
                        </div>
                    </div>
                </div>
            </AdminPanelCard>
        </div>
    </div>
);

const LegendDot = ({ color, label }) => (
    <span className="inline-flex items-center gap-2">
        <span className={`h-4 w-4 rounded-full ${color}`} />
        {label}
    </span>
);

export default AdminHomeView;
