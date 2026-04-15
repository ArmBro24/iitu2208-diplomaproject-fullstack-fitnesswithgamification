import React from 'react';
import { FiArrowLeft, FiChevronRight, FiShield } from 'react-icons/fi';
import { adminUsers } from './adminData.js';
import { AdminBackButton, AdminPanelCard } from './AdminShared.jsx';

const AdminUsersView = ({ onBack }) => (
    <div className="min-h-screen px-4 pb-8 pt-5 text-white md:px-8 md:pt-8">
        <div className="mx-auto max-w-[1080px]">
            <header className="flex items-center justify-between">
                <AdminBackButton icon={FiArrowLeft} onClick={onBack} />
                <h1 className="text-3xl font-black tracking-tight text-[#c1cf98] md:text-5xl">Users</h1>
                <div className="rounded-2xl bg-white/5 p-3">
                    <FiShield className="text-[#c1cf98]" size={22} />
                </div>
            </header>

            <div className="mt-8 grid gap-5 lg:grid-cols-[1.02fr_0.98fr]">
                <div className="space-y-4">
                    {adminUsers.map((user) => (
                        <AdminPanelCard key={user.id} className="px-5 py-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xl font-bold text-white">{user.name}</p>
                                    <p className="mt-1 text-sm text-[#f1e6d7]">{user.role}</p>
                                </div>
                                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#f3e7b5]">
                                    {user.status}
                                </span>
                            </div>

                            <p className="mt-4 text-sm text-white/65">{user.note}</p>
                        </AdminPanelCard>
                    ))}
                </div>

                <AdminPanelCard className="px-5 py-5">
                    <p className="text-sm uppercase tracking-[0.28em] text-white/45">Admin focus</p>
                    <h2 className="mt-3 text-3xl font-black text-[#f1e6d7]">Account moderation</h2>
                    <p className="mt-4 max-w-[360px] text-base leading-relaxed text-white/70">
                        This block can later become a real admin CRUD area for blocking accounts, changing roles, and checking suspicious activity.
                    </p>

                    <div className="mt-6 space-y-3">
                        <ActionRow title="Open full user list" />
                        <ActionRow title="Review pending users" />
                        <ActionRow title="Switch trainer roles" />
                    </div>
                </AdminPanelCard>
            </div>
        </div>
    </div>
);

const ActionRow = ({ title }) => (
    <button className="flex w-full items-center justify-between rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-left text-[#f1e6d7] transition-all hover:bg-white/10">
        <span>{title}</span>
        <FiChevronRight size={18} />
    </button>
);

export default AdminUsersView;
