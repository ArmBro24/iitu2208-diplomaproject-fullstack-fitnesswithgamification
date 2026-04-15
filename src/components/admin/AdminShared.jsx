import React from 'react';
import { adminToneClass } from './adminData.js';

export const AdminPanelCard = ({ className = '', children, onClick }) => {
    const baseClass = 'rounded-[32px] border border-white/10 bg-black/10 shadow-[0_20px_45px_rgba(0,0,0,0.2)] backdrop-blur-[2px]';

    if (onClick) {
        return (
            <button
                onClick={onClick}
                className={`${baseClass} ${className} text-left transition-transform duration-200 hover:-translate-y-1`}
            >
                {children}
            </button>
        );
    }

    return <div className={`${baseClass} ${className}`}>{children}</div>;
};

export const AdminStatChip = ({ label, value, tone = 'rose' }) => (
    <div className={`rounded-[24px] px-4 py-4 ${adminToneClass[tone]}`}>
        <p className="text-sm text-white/70">{label}</p>
        <p className="mt-2 text-[1.7rem] font-black text-white">{value}</p>
    </div>
);

export const AdminSectionTitle = ({ eyebrow, title, body }) => (
    <div>
        {eyebrow && <p className="text-xs uppercase tracking-[0.3em] text-white/45">{eyebrow}</p>}
        <h2 className="mt-2 text-3xl font-black tracking-tight text-[#c1cf98] md:text-5xl">{title}</h2>
        {body && <p className="mt-4 max-w-[520px] text-base leading-relaxed text-[#f1e6d7] md:text-xl">{body}</p>}
    </div>
);

export const AdminBackButton = ({ icon: Icon, onClick }) => (
    <button
        onClick={onClick}
        className="rounded-full p-2 text-[#eee7da] transition-colors hover:bg-white/10"
    >
        <Icon size={30} />
    </button>
);
