import React, { useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';
import TrainerSidebar from './TrainerSidebar.jsx';

const TrainerDrawer = ({ isOpen, items, onClose, onOpen, onLogout, triggerMode = 'page' }) => {
    useEffect(() => {
        if (!isOpen || typeof document === 'undefined') return undefined;

        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
        };
    }, [isOpen]);

    const triggerClass = triggerMode === 'page' || triggerMode === 'inline'
        ? 'absolute left-4 top-4 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#c1cf98]/30 bg-[#161916]/90 text-[#c1cf98] shadow-[0_14px_35px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all hover:bg-[#c1cf98]/10 active:scale-95 sm:left-6 md:left-8 md:top-7'
        : 'fixed left-5 top-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#c1cf98]/30 bg-[#161916]/90 text-[#c1cf98] shadow-[0_14px_35px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all hover:bg-[#c1cf98]/10 active:scale-95 md:left-8 md:top-8';

    return (
        <>
            <button
                type="button"
                onClick={onOpen}
                aria-label="Open trainer navigation"
                className={triggerClass}
            >
                <FiMenu size={22} />
            </button>

            <TrainerSidebar
                isOpen={isOpen}
                items={items}
                onClose={onClose}
                onLogout={onLogout}
            />
        </>
    );
};

export default TrainerDrawer;
