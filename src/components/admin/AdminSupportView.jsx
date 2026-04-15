import React from 'react';
import { FiArrowLeft, FiCopy, FiShield } from 'react-icons/fi';
import loginBackMob from '../../assets/login_back_mob.jpg';
import { adminSupportContacts } from './adminData.js';
import { AdminBackButton } from './AdminShared.jsx';

const AdminSupportView = ({ onBack }) => (
    <div className="relative min-h-screen overflow-hidden">
        <img src={loginBackMob} alt="Support background" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />

        <div className="relative z-10 min-h-screen px-4 pb-8 pt-5 text-white md:px-8 md:pt-8">
            <div className="mx-auto max-w-[1040px]">
                <header className="flex items-center justify-between">
                    <AdminBackButton icon={FiArrowLeft} onClick={onBack} />
                    <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-md">
                        <FiShield className="text-[#c1cf98]" size={22} />
                    </div>
                </header>

                <div className="mx-auto mt-8 max-w-[520px] rounded-[56px] bg-[rgba(244,230,213,0.24)] px-8 py-10 backdrop-blur-xl md:px-12 md:py-14">
                    <h1 className="text-center text-4xl font-black tracking-tight text-[#4f5931] md:text-5xl">HeroFit</h1>
                    <p className="mt-2 text-center text-2xl font-bold text-[#8b4f41]">is here for you!</p>

                    <div className="mt-8 space-y-4">
                        {adminSupportContacts.map((contact) => (
                            <div
                                key={contact.id}
                                className="flex items-center justify-between rounded-full bg-white/10 px-5 py-4 text-[#f8efe4] backdrop-blur-md"
                            >
                                <div>
                                    <p className="text-lg">{contact.phone}</p>
                                    <p className="mt-1 text-xs text-black/55">{contact.note}</p>
                                </div>
                                <button className="text-white/90 transition-all hover:scale-110">
                                    <FiCopy size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <p className="mx-auto mt-10 max-w-[280px] text-center text-lg leading-relaxed text-black/55">
                        Don’t worry. Your support team is ready to guide clients, trainers, and admins through any issue.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default AdminSupportView;
