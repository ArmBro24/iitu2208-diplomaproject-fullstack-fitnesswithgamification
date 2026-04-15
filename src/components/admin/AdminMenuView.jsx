import React from 'react';
import { FiArrowLeft, FiLogOut, FiShield } from 'react-icons/fi';
import { adminMenuItems } from './adminData.js';

const AdminMenuView = ({ onBack, onLogout, onOpenView }) => (
    <div className="min-h-screen px-4 pb-8 pt-5 text-white md:px-8 md:pt-8">
        <div className="mx-auto max-w-[980px]">
            <nav className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="rounded-full p-2 text-[#eee7da] transition-colors hover:bg-white/10"
                >
                    <FiArrowLeft size={32} />
                </button>

                <h1 className="text-3xl font-black tracking-tight text-[#c1cf98] md:text-5xl">HeroFit</h1>

                <div className="rounded-2xl bg-white/5 p-3">
                    <FiShield className="text-[#c1cf98]" size={22} />
                </div>
            </nav>

            <div className="flex min-h-[72vh] flex-col items-center justify-center gap-6">
                {adminMenuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onOpenView(item.id)}
                        className="w-full max-w-[370px] rounded-full border border-[#dbc98d]/55 bg-white/5 px-6 py-5 text-center text-2xl font-medium text-white transition-all hover:border-[#c1cf98] hover:bg-white/10"
                    >
                        {item.label}
                    </button>
                ))}

                <button
                    onClick={onLogout}
                    className="flex w-full max-w-[370px] items-center justify-center gap-3 rounded-full border border-red-300/35 bg-red-400/10 px-6 py-5 text-center text-2xl font-medium text-white transition-all hover:bg-red-400/20"
                >
                    <FiLogOut size={22} />
                    Log out
                </button>
            </div>
        </div>
    </div>
);

export default AdminMenuView;
