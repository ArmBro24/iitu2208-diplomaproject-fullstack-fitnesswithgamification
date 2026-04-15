import React from 'react';
import { FiArrowLeft, FiChevronRight, FiSearch, FiUser } from 'react-icons/fi';
import avatarMe from '../../assets/avatars/avatar-me.png';
import { InfoBox } from './TrainerShared.jsx';

const TrainerClientsView = ({ clients, onBack, onOpenDetails, onOpenProfile, onAssignWorkout, selectedClient, setSelectedClientId }) => (
    <div className="px-4 pb-24 pt-5 sm:px-6 md:px-8 md:pb-10 md:pt-7 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-[1040px]">
            <header className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="rounded-full p-2 text-[#eee7da] transition-colors hover:bg-white/10"
                >
                    <FiArrowLeft size={26} />
                </button>

                <h1 className="text-[1.8rem] font-medium tracking-tight text-white md:text-[2rem]">My Clients</h1>

                <button
                    onClick={onOpenProfile}
                    className="rounded-full p-2 text-[#ded6c4] transition-colors hover:bg-white/10 lg:hidden"
                >
                    <FiUser size={20} />
                </button>

                <div className="hidden lg:block lg:w-10" />
            </header>

            <div className="mt-5 rounded-[26px] border border-white/10 bg-black/15 px-4 py-4 md:px-5">
                <div className="flex items-center gap-3">
                    <FiSearch size={18} className="text-white/45" />
                    <span className="text-sm text-white/45">Search by name, level or status</span>
                </div>
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.92fr]">
                <div className="space-y-4">
                    {clients.map((client, index) => (
                        <button
                            key={client.id}
                            type="button"
                            onClick={() => setSelectedClientId(client.id)}
                            className={`w-full rounded-[28px] border px-4 py-4 text-left transition-all md:px-5 ${
                                selectedClient.id === client.id
                                    ? 'border-[#dce8c5] bg-[rgba(121,76,89,0.34)]'
                                    : 'border-white/10 bg-black/15 hover:bg-white/10'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full border border-white/15 ${avatarTone(index)}`}>
                                    <img
                                        src={avatarMe}
                                        alt={client.name}
                                        className="h-full w-full object-cover p-1"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-[1.08rem] font-bold text-white">{client.name}</p>
                                            <p className="mt-1 text-sm text-[#d7cabc]">
                                                {client.level} - {client.goal}
                                            </p>
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

                                    <div className="mt-3 flex items-center justify-between text-sm text-[#ece2d4]">
                                        <span>{client.attendance} attendance</span>
                                        <span>{client.progress}% progress</span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="rounded-[30px] border border-white/10 bg-[rgba(15,16,18,0.16)] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.14)] md:p-6">
                    <div className="flex items-center gap-4">
                        <div className="relative h-[84px] w-[84px] overflow-hidden rounded-full border border-white/15 bg-[radial-gradient(circle_at_30%_30%,#f19add,#704436)]">
                            <img
                                src={avatarMe}
                                alt={selectedClient.name}
                                className="h-full w-full object-cover p-1"
                            />
                        </div>

                        <div>
                            <p className="text-sm uppercase tracking-[0.18em] text-[#f0ddd6]/55">Selected client</p>
                            <h2 className="mt-1 text-[1.6rem] font-black text-[#f5efe7]">{selectedClient.name}</h2>
                            <p className="mt-1 text-sm text-[#d7cabc]">{selectedClient.goal}</p>
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                        <InfoBox label="Level" value={selectedClient.level} />
                        <InfoBox label="Attendance" value={selectedClient.attendance} />
                        <InfoBox label="Progress" value={`${selectedClient.progress}%`} />
                        <InfoBox label="Streak" value={selectedClient.streak} />
                    </div>

                    <div className="mt-5 rounded-[24px] bg-[rgba(108,115,63,0.3)] px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[#efe4d0]/60">Next workout</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[1.08rem] font-semibold text-[#f9f1e6]">{selectedClient.nextWorkout}</p>
                                <p className="mt-1 text-sm text-[#e4d6c4]">Ready for trainer review</p>
                            </div>

                            <button
                                onClick={onAssignWorkout}
                                className="inline-flex items-center gap-2 rounded-full border border-[#eee3d6]/65 px-4 py-2 text-sm text-white"
                            >
                                Assign <FiChevronRight size={15} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-5 rounded-[24px] bg-[rgba(113,67,79,0.42)] px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[#f0ddd6]/60">Coach note</p>
                        <p className="mt-3 text-sm leading-relaxed text-[#f3e8dc]">
                            {selectedClient.note}
                        </p>
                    </div>

                    <button
                        onClick={onOpenDetails}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#dbc98d]/55 px-5 py-3 text-sm text-[#f3e7b5]"
                    >
                        Open full client card <FiChevronRight size={15} />
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const avatarTone = (index) => {
    const tones = [
        'bg-[radial-gradient(circle_at_30%_30%,#f19add,#704436)]',
        'bg-[radial-gradient(circle_at_30%_30%,#dba0c0,#5f5440)]',
        'bg-[radial-gradient(circle_at_30%_30%,#f5dfe3,#7a5f50)]',
        'bg-[radial-gradient(circle_at_30%_30%,#9fd8ff,#624846)]',
    ];

    return tones[index % tones.length];
};

export default TrainerClientsView;
