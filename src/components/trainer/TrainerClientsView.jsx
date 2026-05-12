import React, { useMemo, useState } from 'react';
import { FiArrowLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import avatarMe from '../../assets/avatars/avatar-me.png';

const TrainerClientsView = ({
    clients,
    onBack,
    onOpenDetails,
    setSelectedClientId,
}) => {
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('all');

    const filteredClients = useMemo(() => {
        return clients.filter((client) => {
            const matchesQuery = client.name.toLowerCase().includes(query.toLowerCase());

            const matchesFilter =
                filter === 'all' ||
                (filter === 'active' && client.status === 'Active') || // Те, кто просто тренируется
                (filter === 'review' && (client.status === 'Needs review' || client.progressRequestPending)) || // Ждут оценки
                (filter === 'past' && client.status === 'Terminated'); // Те, кто ушел

            return matchesQuery && matchesFilter;
        });
    }, [clients, filter, query]);

    const handleClientClick = (clientId) => {
        setSelectedClientId(clientId);
        onOpenDetails();
    };

    return (
        <div className="px-4 pb-20 pt-5 sm:px-6 md:px-8 md:pb-10 md:pt-7 lg:px-12 lg:py-10">
            <div className="mx-auto max-w-[880px]">
                <header className="flex items-center justify-between">
                    <button
                        onClick={onBack}
                        aria-label="Back"
                        className="rounded-full p-2 text-[#eee7da] transition-colors hover:bg-white/10"
                    >
                        <FiArrowLeft size={26} />
                    </button>

                    <h1 className="text-[1.8rem] font-medium tracking-tight text-white md:text-[2rem]">Clients</h1>

                    <div className="w-10" />
                </header>

                <div className="mt-5 rounded-[26px] border border-white/10 bg-black/15 px-4 py-4 md:px-5">
                    <div className="flex items-center gap-3">
                        <FiSearch size={18} className="text-white/45" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name, level or status"
                            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/45"
                        />
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                    <FilterButton label="All" active={filter === 'all'} onClick={() => setFilter('all')}/>
                    <FilterButton label="Active" active={filter === 'active'} onClick={() => setFilter('active')}/>
                    <FilterButton label="Needs Review" active={filter === 'review'}
                                  onClick={() => setFilter('review')}/>
                    <FilterButton label="Past Clients" active={filter === 'past'} onClick={() => setFilter('past')}/>
                </div>

                <div className="mt-5 space-y-4">
                    {filteredClients.map((client, index) => (
                        <button
                            key={client.id}
                            type="button"
                            onClick={() => handleClientClick(client.id)}
                            className="group w-full rounded-[28px] border border-white/10 bg-black/15 px-4 py-4 text-left transition-all hover:border-[#c1cf98]/40 hover:bg-white/10 active:scale-[0.99] md:px-5"
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

                                    <div className="mt-3 flex items-center justify-between gap-3 text-sm text-[#ece2d4]">
                                        <span>{client.attendance} attendance</span>
                                        <span>{client.progress}% progress</span>
                                    </div>
                                </div>

                                <FiChevronRight className="shrink-0 text-white/35 transition-transform group-hover:translate-x-1 group-hover:text-[#c1cf98]" size={20} />
                            </div>
                        </button>
                    ))}

                    {!filteredClients.length && (
                        <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-white/45">
                            No clients match this filter.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const FilterButton = ({ active, label, onClick }) => (
    <button
        onClick={onClick}
        className={`rounded-full border px-4 py-2 text-sm transition-all ${
            active
                ? 'border-[#c1cf98]/40 bg-[#c1cf98]/12 text-[#eef2d7]'
                : 'border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/8'
        }`}
    >
        {label}
    </button>
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
