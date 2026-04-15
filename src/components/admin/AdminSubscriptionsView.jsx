import React from 'react';
import { FiArrowLeft, FiShield } from 'react-icons/fi';
import { adminSubscriptions, adminToneClass } from './adminData.js';
import { AdminBackButton, AdminPanelCard } from './AdminShared.jsx';

const AdminSubscriptionsView = ({ onBack }) => (
    <div className="min-h-screen px-4 pb-8 pt-5 text-white md:px-8 md:pt-8">
        <div className="mx-auto max-w-[1180px]">
            <header className="flex items-center justify-between">
                <AdminBackButton icon={FiArrowLeft} onClick={onBack} />
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-[#c1cf98] md:text-5xl">HeroFit</h1>
                    <p className="text-lg text-white/60">Subscriptions</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-3">
                    <FiShield className="text-[#c1cf98]" size={22} />
                </div>
            </header>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {adminSubscriptions.map((plan) => (
                    <AdminPanelCard key={plan.id} className={`px-5 py-5 ${adminToneClass[plan.tone]}`}>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-2xl font-bold text-white">{plan.title}</p>
                                <p className="mt-2 text-sm text-white/70">{plan.visits}</p>
                            </div>
                            <span className="text-lg font-semibold text-[#f3e7b5]">{plan.price}</span>
                        </div>

                        <p className="mt-6 text-sm text-white/70">Valid for {plan.validity}</p>

                        <button className="mt-8 rounded-full border border-white/60 px-5 py-2 text-sm text-[#f8efe4] transition-all hover:bg-white/10">
                            Manage
                        </button>
                    </AdminPanelCard>
                ))}
            </div>
        </div>
    </div>
);

export default AdminSubscriptionsView;
