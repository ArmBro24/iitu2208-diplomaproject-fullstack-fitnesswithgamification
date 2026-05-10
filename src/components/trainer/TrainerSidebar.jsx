import React from 'react';
import { FiLogOut, FiX } from 'react-icons/fi';

const TrainerSidebar = ({ isOpen, items, onClose, onLogout }) => (
    <>
        <div
            className={`fixed inset-0 z-40 bg-black/55 backdrop-blur-sm transition-opacity duration-300 ${
                isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            onClick={onClose}
            aria-hidden="true"
        />

        <aside
            className={`fixed left-0 top-0 z-50 h-[100dvh] w-[min(88vw,320px)] overflow-y-auto overscroll-contain border-r border-white/10 bg-[#151716]/95 p-5 shadow-[22px_0_55px_rgba(0,0,0,0.38)] backdrop-blur-2xl transition-transform duration-300 ease-out md:w-[304px] md:rounded-r-[30px] md:p-6 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            aria-label="Trainer navigation"
        >
            <div className="flex min-h-full flex-col pb-[max(0px,env(safe-area-inset-bottom))]">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Trainer Mode</p>
                        <h2 className="mt-2 font-rubik text-[2rem] font-black leading-none text-[#a8a25f]">HeroFit</h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close trainer navigation"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white active:scale-95"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                <p className="mt-4 rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-[13px] leading-relaxed text-white/55">
                    Manage clients, sessions, and attendance from one focused workspace.
                </p>

                <nav className="mt-5 space-y-2">
                    {items.map((item) => (
                        <SidebarNavButton key={item.label} {...item} />
                    ))}
                </nav>

                <button
                    type="button"
                    onClick={onLogout}
                    className="mt-7 flex min-h-14 w-full items-center gap-3 rounded-[20px] border border-red-300/15 bg-[#422421]/70 px-4 text-left text-sm font-medium text-red-100 transition-all hover:bg-[#56302b] active:scale-[0.99]"
                >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-950/35 text-red-100">
                        <FiLogOut size={18} />
                    </span>
                    <span>Log out</span>
                </button>
            </div>
        </aside>
    </>
);

const SidebarNavButton = ({ label, icon: Icon, active = false, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex h-14 w-full items-center gap-3 rounded-[20px] border px-3 text-left text-sm font-medium transition-all active:scale-[0.99] ${
            active
                ? 'border-[#c1cf98]/35 bg-[#8a8950]/35 text-white shadow-[0_10px_26px_rgba(0,0,0,0.16)]'
                : 'border-transparent bg-white/[0.04] text-white/64 hover:border-white/10 hover:bg-white/10 hover:text-white'
        }`}
    >
        <span
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                active ? 'bg-[#c1cf98]/18 text-[#edf4cf]' : 'bg-black/12 text-white/45'
            }`}
        >
            <Icon size={18} />
        </span>
        <span>{label}</span>
    </button>
);

export default TrainerSidebar;
