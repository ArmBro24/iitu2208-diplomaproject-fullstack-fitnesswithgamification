import React, { useMemo, useState } from 'react';
import {
    FiActivity,
    FiAlertTriangle,
    FiAward,
    FiBarChart2,
    FiBell,
    FiCheckCircle,
    FiCreditCard,
    FiFilter,
    FiFlag,
    FiGrid,
    FiLogOut,
    FiMenu,
    FiMoreHorizontal,
    FiSearch,
    FiShield,
    FiStar,
    FiUserCheck,
    FiUsers,
    FiX
} from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';
import useStore from '../../store/useStore.js';
import { getUserDisplayName, getUserInitials, getUserNickname } from '../../utils/userDisplay.js';

const AdminPanel = ({ onLogout }) => {
    const [activeView, setActiveView] = useState('overview');
    const [query, setQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const currentUser = useStore((state) => state.currentUser);
    const displayName = getUserDisplayName(currentUser);
    const nickname = getUserNickname(currentUser);
    const initials = getUserInitials(currentUser);

    const filteredUsers = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return adminUsers.filter((user) => {
            const matchesQuery = !normalizedQuery || `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(normalizedQuery);
            const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter;
            return matchesQuery && matchesRole;
        });
    }, [query, roleFilter]);

    return (
        <Background>
            <div className="min-h-screen overflow-x-hidden px-0 py-0 text-white font-rubik md:p-5">
                <div className="mx-auto flex min-h-screen max-w-[1440px] overflow-hidden bg-[rgba(15,18,17,0.88)] md:min-h-[calc(100vh-2.5rem)] md:rounded-[34px] md:border md:border-white/10 md:shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                    <AdminSidebar
                        activeView={activeView}
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                        onLogout={onLogout}
                        onSelect={(view) => {
                            setActiveView(view);
                            setIsSidebarOpen(false);
                        }}
                    />

                    <main className="min-w-0 flex-1">
                        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#111412]/88 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex min-w-0 items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsSidebarOpen(true)}
                                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#c1cf98] lg:hidden"
                                        aria-label="Open admin navigation"
                                    >
                                        <FiMenu size={20} />
                                    </button>
                                    <div className="min-w-0">
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c1cf98]/70">HeroFit Admin</p>
                                        <h1 className="truncate text-2xl font-black tracking-tight text-[#f5efe7] md:text-3xl">
                                            {viewTitles[activeView]}
                                        </h1>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button className="hidden h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-white/70 transition-all hover:border-[#c1cf98]/30 hover:text-[#dfe9bf] sm:inline-flex">
                                        <FiBell className="text-[#c1cf98]" />
                                        12 alerts
                                    </button>
                                    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
                                        <div className="hidden min-w-0 text-right sm:block">
                                            <p className="truncate text-sm font-bold text-white">{displayName}</p>
                                            <p className="truncate text-xs text-[#c1cf98]/70">{nickname}</p>
                                        </div>
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c1cf98]/30 bg-[#c1cf98]/10 text-sm font-black text-[#c1cf98]">
                                            {initials}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div className="px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
                            {activeView === 'overview' && <OverviewView onNavigate={setActiveView} />}
                            {activeView === 'users' && (
                                <UsersView
                                    users={filteredUsers}
                                    query={query}
                                    roleFilter={roleFilter}
                                    setQuery={setQuery}
                                    setRoleFilter={setRoleFilter}
                                />
                            )}
                            {activeView === 'relationships' && <RelationshipsView />}
                            {activeView === 'reviews' && <ReviewsView />}
                            {activeView === 'payments' && <PaymentsView />}
                            {activeView === 'challenges' && <ChallengesView />}
                            {activeView === 'monitoring' && <MonitoringView />}
                        </div>
                    </main>
                </div>
            </div>
        </Background>
    );
};

const AdminSidebar = ({ activeView, isOpen, onClose, onLogout, onSelect }) => (
    <>
        <aside className={`fixed inset-y-0 left-0 z-40 w-[292px] border-r border-white/10 bg-[#111412] p-4 transition-transform duration-300 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex h-full flex-col">
                <div className="flex items-center justify-between gap-3 px-2 py-2">
                    <div>
                        <p className="text-3xl font-black tracking-tight text-[#c1cf98]">HeroFit</p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-white/35">Control Center</p>
                    </div>
                    <button className="rounded-xl p-2 text-white/50 hover:bg-white/10 lg:hidden" onClick={onClose}>
                        <FiX size={22} />
                    </button>
                </div>

                <nav className="mt-7 space-y-2">
                    {adminNavItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item.id)}
                            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition-all ${
                                activeView === item.id
                                    ? 'border border-[#c1cf98]/25 bg-[#c1cf98]/12 text-[#dfe9bf]'
                                    : 'border border-transparent text-white/58 hover:border-white/10 hover:bg-white/[0.04] hover:text-white'
                            }`}
                        >
                            <item.icon className={activeView === item.id ? 'text-[#c1cf98]' : 'text-white/35'} size={18} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c1cf98]/10 text-[#c1cf98]">
                            <FiShield />
                        </div>
                        <div>
                            <p className="text-sm font-black text-[#f5efe7]">System secure</p>
                            <p className="text-xs text-white/40">99.98% uptime</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-100 transition-all hover:bg-red-400/15"
                    >
                        <FiLogOut size={16} />
                        Log out
                    </button>
                </div>
            </div>
        </aside>
        {isOpen && <button className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} aria-label="Close admin navigation" />}
    </>
);

const OverviewView = ({ onNavigate }) => (
    <div className="space-y-5">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {overviewStats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
            ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <Panel title="Platform Analytics" eyebrow="Reports">
                <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
                    <ChartBars data={revenueData} />
                    <div className="space-y-3">
                        {analyticsRows.map((row) => (
                            <ProgressRow key={row.label} {...row} />
                        ))}
                    </div>
                </div>
            </Panel>

            <Panel title="Recent Activity" eyebrow="Live Feed">
                <div className="space-y-3">
                    {activityFeed.map((item) => (
                        <ActivityItem key={item.title} {...item} />
                    ))}
                </div>
            </Panel>
        </section>

        <section className="grid gap-5 xl:grid-cols-3">
            <QuickPanel icon={FiUsers} title="Users Management" body="Review clients, trainers, admins, verification and role states." onClick={() => onNavigate('users')} />
            <QuickPanel icon={FiUserCheck} title="Relationship Moderation" body="Inspect coach-client connections, pending approvals and declines." onClick={() => onNavigate('relationships')} />
            <QuickPanel icon={FiFlag} title="Reviews & Reports" body="Moderate verified training feedback and suspicious reports." onClick={() => onNavigate('reviews')} />
        </section>
    </div>
);

const UsersView = ({ query, roleFilter, setQuery, setRoleFilter, users }) => (
    <div className="space-y-5">
        <Toolbar
            query={query}
            setQuery={setQuery}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            placeholder="Search users by name, email, role"
        />
        <Panel title="Users Management" eyebrow="Accounts">
            <DataTable
                columns={['User', 'Role', 'Verification', 'Status', 'Last seen', 'Actions']}
                rows={users.map((user) => [
                    <UserCell key="user" user={user} />,
                    <RoleBadge key="role" role={user.role} />,
                    <StatusBadge key="verification" status={user.verification} />,
                    <StatusBadge key="status" status={user.status} />,
                    user.lastSeen,
                    <ActionMenu key="actions" />
                ])}
            />
        </Panel>
    </div>
);

const RelationshipsView = () => (
    <Panel title="Trainer / Client Relationships" eyebrow="Moderation">
        <DataTable
            columns={['Client', 'Trainer', 'Status', 'Sessions', 'Risk', 'Actions']}
            rows={relationshipRows.map((item) => [
                item.client,
                item.trainer,
                <StatusBadge key="status" status={item.status} />,
                item.sessions,
                <StatusBadge key="risk" status={item.risk} />,
                <ActionMenu key="actions" />
            ])}
        />
    </Panel>
);

const ReviewsView = () => (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.86fr]">
        <Panel title="Reviews Moderation" eyebrow="Verified Feedback">
            <div className="space-y-3">
                {reviewRows.map((review) => (
                    <ReviewModerationCard key={review.id} review={review} />
                ))}
            </div>
        </Panel>
        <Panel title="Reports Queue" eyebrow="Safety">
            <div className="space-y-3">
                {reportRows.map((report) => (
                    <ActivityItem key={report.title} {...report} />
                ))}
            </div>
        </Panel>
    </div>
);

const PaymentsView = () => (
    <div className="space-y-5">
        <section className="grid gap-4 sm:grid-cols-3">
            <StatCard label="MRR" value="3.8M KZT" trend="+14%" icon={FiCreditCard} tone="green" />
            <StatCard label="Failed payments" value="18" trend="-6%" icon={FiAlertTriangle} tone="amber" />
            <StatCard label="Active plans" value="372" trend="+21" icon={FiCheckCircle} tone="violet" />
        </section>
        <Panel title="Subscriptions / Payments" eyebrow="Billing">
            <DataTable
                columns={['Plan', 'Owner', 'Amount', 'Renewal', 'Status', 'Actions']}
                rows={paymentRows.map((item) => [
                    item.plan,
                    item.owner,
                    item.amount,
                    item.renewal,
                    <StatusBadge key="status" status={item.status} />,
                    <ActionMenu key="actions" />
                ])}
            />
        </Panel>
    </div>
);

const ChallengesView = () => (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel title="Challenges Moderation" eyebrow="Gamification">
            <div className="space-y-3">
                {challengeRows.map((challenge) => (
                    <ChallengeAdminCard key={challenge.title} challenge={challenge} />
                ))}
            </div>
        </Panel>
        <Panel title="Leaderboard Health" eyebrow="Ranking">
            <ChartBars data={leaderboardData} />
            <div className="mt-5 space-y-3">
                {leaderboardRows.map((item) => (
                    <ActivityItem key={item.title} {...item} />
                ))}
            </div>
        </Panel>
    </div>
);

const MonitoringView = () => (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Panel title="System Monitoring" eyebrow="Infrastructure">
            <div className="grid gap-3 sm:grid-cols-2">
                {serviceRows.map((service) => (
                    <ServiceCard key={service.name} service={service} />
                ))}
            </div>
        </Panel>
        <Panel title="Notifications" eyebrow="Broadcasts">
            <div className="space-y-3">
                {notificationRows.map((item) => (
                    <ActivityItem key={item.title} {...item} />
                ))}
            </div>
        </Panel>
    </div>
);

const Toolbar = ({ placeholder, query, roleFilter, setQuery, setRoleFilter }) => (
    <div className="grid gap-3 rounded-[28px] border border-white/10 bg-[rgba(18,20,24,0.74)] p-4 backdrop-blur-xl lg:grid-cols-[1fr_auto]">
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <FiSearch className="shrink-0 text-[#c1cf98]" size={18} />
            <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={placeholder}
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            />
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <FiFilter className="text-[#c1cf98]" size={17} />
            <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="bg-transparent text-sm font-bold text-white outline-none"
            >
                <option value="all" className="bg-[#17191d]">All roles</option>
                <option value="client" className="bg-[#17191d]">Clients</option>
                <option value="trainer" className="bg-[#17191d]">Trainers</option>
                <option value="admin" className="bg-[#17191d]">Admins</option>
            </select>
        </label>
    </div>
);

const Panel = ({ children, eyebrow, title }) => (
    <section className="rounded-[30px] border border-white/10 bg-[rgba(18,20,24,0.74)] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.2)] backdrop-blur-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
            <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/38">{eyebrow}</p>
                <h2 className="mt-1 text-xl font-black text-[#f5efe7] md:text-2xl">{title}</h2>
            </div>
        </div>
        {children}
    </section>
);

const StatCard = ({ icon: Icon, label, tone = 'green', trend, value }) => (
    <div className="rounded-[26px] border border-white/10 bg-[rgba(18,20,24,0.76)] p-5 shadow-[0_12px_34px_rgba(0,0,0,0.16)]">
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="text-sm font-bold text-white/45">{label}</p>
                <p className="mt-3 text-3xl font-black text-[#f5efe7]">{value}</p>
            </div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneClass[tone]}`}>
                <Icon className="text-[#dfe9bf]" size={20} />
            </div>
        </div>
        <p className="mt-4 text-sm font-bold text-[#c1cf98]">{trend}</p>
    </div>
);

const QuickPanel = ({ body, icon: Icon, onClick, title }) => (
    <button
        onClick={onClick}
        className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 text-left transition-all hover:-translate-y-1 hover:border-[#c1cf98]/35 hover:bg-white/[0.07]"
    >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c1cf98]/10 text-[#c1cf98]">
            <Icon size={22} />
        </div>
        <p className="mt-4 text-lg font-black text-[#f5efe7]">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-white/52">{body}</p>
    </button>
);

const ChartBars = ({ data }) => (
    <div className="flex h-64 items-end gap-3 rounded-[24px] border border-white/10 bg-black/18 p-4">
        {data.map((item) => (
            <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div className="flex w-full items-end rounded-full bg-white/[0.05]" style={{ height: '190px' }}>
                    <div
                        className="w-full rounded-full bg-gradient-to-t from-[#8b5cf6] via-[#c1cf98] to-[#f7d77a] shadow-[0_0_18px_rgba(193,207,152,0.18)]"
                        style={{ height: `${item.value}%` }}
                    />
                </div>
                <span className="truncate text-xs font-bold text-white/45">{item.label}</span>
            </div>
        ))}
    </div>
);

const ProgressRow = ({ label, value }) => (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-white/70">{label}</p>
            <p className="text-sm font-black text-[#dfe9bf]">{value}%</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-[#c1cf98]" style={{ width: `${value}%` }} />
        </div>
    </div>
);

const ActivityItem = ({ icon: Icon = FiActivity, status, subtitle, title }) => (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c1cf98]/10 text-[#c1cf98]">
            <Icon size={17} />
        </div>
        <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
                <p className="truncate text-sm font-black text-[#f5efe7]">{title}</p>
                {status && <StatusBadge status={status} />}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-white/45">{subtitle}</p>
        </div>
    </div>
);

const DataTable = ({ columns, rows }) => (
    <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-y-2">
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column} className="px-4 py-2 text-left text-xs font-black uppercase tracking-[0.16em] text-white/35">
                            {column}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="bg-white/[0.04]">
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className={`border-y border-white/10 px-4 py-4 text-sm text-white/68 first:rounded-l-2xl first:border-l last:rounded-r-2xl last:border-r ${cellIndex === 0 ? 'font-bold text-[#f5efe7]' : ''}`}>
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const UserCell = ({ user }) => (
    <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c1cf98]/25 bg-[#c1cf98]/10 text-xs font-black text-[#c1cf98]">
            {user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
        </div>
        <div className="min-w-0">
            <p className="truncate font-black text-[#f5efe7]">{user.name}</p>
            <p className="truncate text-xs text-white/40">{user.email}</p>
        </div>
    </div>
);

const RoleBadge = ({ role }) => (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black text-white/70">
        {role}
    </span>
);

const StatusBadge = ({ status }) => {
    const normalized = String(status).toLowerCase();
    const style = normalized.includes('active') || normalized.includes('verified') || normalized.includes('healthy') || normalized.includes('approved') || normalized.includes('connected') || normalized.includes('paid')
        ? 'border-[#c1cf98]/25 bg-[#c1cf98]/10 text-[#dfe9bf]'
        : normalized.includes('pending') || normalized.includes('review') || normalized.includes('warning')
            ? 'border-yellow-300/25 bg-yellow-300/10 text-yellow-100'
            : normalized.includes('blocked') || normalized.includes('failed') || normalized.includes('flagged') || normalized.includes('high')
                ? 'border-red-300/25 bg-red-400/10 text-red-100'
                : 'border-white/10 bg-white/[0.04] text-white/58';

    return <span className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold ${style}`}>{status}</span>;
};

const ActionMenu = () => (
    <button className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-white/50 transition-all hover:border-[#c1cf98]/30 hover:text-[#dfe9bf]">
        <FiMoreHorizontal size={18} />
    </button>
);

const ReviewModerationCard = ({ review }) => (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="font-black text-[#f5efe7]">{review.author} / {review.target}</p>
                <p className="mt-1 text-xs text-white/40">{review.session}</p>
            </div>
            <div className="flex gap-0.5 text-[#c1cf98]">
                {Array.from({ length: 5 }, (_, index) => (
                    <FiStar key={index} className={index < review.rating ? 'fill-[#c1cf98]' : 'opacity-30'} size={14} />
                ))}
            </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-white/58">{review.text}</p>
        <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status={review.status} />
            <StatusBadge status="Verified Training" />
        </div>
    </div>
);

const ChallengeAdminCard = ({ challenge }) => (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="font-black text-[#f5efe7]">{challenge.title}</p>
                <p className="mt-1 text-sm text-white/45">{challenge.participants} participants</p>
            </div>
            <StatusBadge status={challenge.status} />
        </div>
        <ProgressRow label="Completion" value={challenge.completion} />
    </div>
);

const ServiceCard = ({ service }) => (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-center justify-between gap-3">
            <p className="font-black text-[#f5efe7]">{service.name}</p>
            <StatusBadge status={service.status} />
        </div>
        <p className="mt-2 text-sm text-white/45">{service.latency} ms latency</p>
        <ProgressRow label="Load" value={service.load} />
    </div>
);

const adminNavItems = [
    { id: 'overview', label: 'Overview', icon: FiGrid },
    { id: 'users', label: 'Users', icon: FiUsers },
    { id: 'relationships', label: 'Relationships', icon: FiUserCheck },
    { id: 'reviews', label: 'Reviews', icon: FiFlag },
    { id: 'payments', label: 'Payments', icon: FiCreditCard },
    { id: 'challenges', label: 'Challenges', icon: FiAward },
    { id: 'monitoring', label: 'Monitoring', icon: FiActivity },
];

const viewTitles = {
    overview: 'Admin Dashboard',
    users: 'Users Management',
    relationships: 'Relationship Moderation',
    reviews: 'Reviews & Reports',
    payments: 'Subscriptions & Payments',
    challenges: 'Challenges & Leaderboard',
    monitoring: 'System Monitoring',
};

const toneClass = {
    green: 'bg-[#c1cf98]/12',
    violet: 'bg-[#8b5cf6]/14',
    amber: 'bg-[#f7d77a]/14',
    red: 'bg-red-400/12',
};

const overviewStats = [
    { label: 'Active users', value: '1,284', trend: '+12.4% this week', icon: FiUsers, tone: 'green' },
    { label: 'Verified trainers', value: '48', trend: '+6 pending review', icon: FiUserCheck, tone: 'violet' },
    { label: 'Monthly revenue', value: '3.8M', trend: '+14% vs last month', icon: FiCreditCard, tone: 'amber' },
    { label: 'Open reports', value: '17', trend: '4 high priority', icon: FiAlertTriangle, tone: 'red' },
];

const adminUsers = [
    { name: 'Aruzhan K.', email: 'aruzhan@herofit.kz', role: 'Client', verification: 'Verified', status: 'Active', lastSeen: 'Today, 11:42' },
    { name: 'Dias N.', email: 'dias@herofit.kz', role: 'Client', verification: 'Pending review', status: 'Flagged', lastSeen: 'Yesterday' },
    { name: 'Aigerim S.', email: 'aigerim@herofit.kz', role: 'Trainer', verification: 'Verified', status: 'Active', lastSeen: 'Today, 09:18' },
    { name: 'Madi B.', email: 'madi@herofit.kz', role: 'Trainer', verification: 'Pending review', status: 'Review', lastSeen: 'May 11' },
    { name: 'Admin Ops', email: 'admin@herofit.kz', role: 'Admin', verification: 'Verified', status: 'Active', lastSeen: 'Online' },
];

const revenueData = [
    { label: 'Mon', value: 42 },
    { label: 'Tue', value: 58 },
    { label: 'Wed', value: 64 },
    { label: 'Thu', value: 49 },
    { label: 'Fri', value: 78 },
    { label: 'Sat', value: 86 },
    { label: 'Sun', value: 72 },
];

const leaderboardData = [
    { label: 'XP', value: 82 },
    { label: 'Sessions', value: 66 },
    { label: 'Streaks', value: 74 },
    { label: 'Quests', value: 58 },
    { label: 'Reviews', value: 46 },
];

const analyticsRows = [
    { label: 'Client retention', value: 84 },
    { label: 'Trainer response SLA', value: 91 },
    { label: 'Review verification', value: 76 },
    { label: 'Challenge completion', value: 68 },
];

const activityFeed = [
    { title: 'Trainer verification approved', subtitle: 'Aigerim S. passed profile verification', status: 'Approved', icon: FiUserCheck },
    { title: 'Payment retry succeeded', subtitle: 'Hero Pass renewal recovered automatically', status: 'Paid', icon: FiCreditCard },
    { title: 'Review flagged', subtitle: 'Potential duplicate feedback requires moderation', status: 'Review', icon: FiFlag },
    { title: 'Challenge boosted', subtitle: 'Early Bird gained 42 new participants', status: 'Active', icon: FiAward },
];

const relationshipRows = [
    { client: 'Aruzhan K.', trainer: 'Aigerim S.', status: 'Connected', sessions: 14, risk: 'Healthy' },
    { client: 'Dias N.', trainer: 'Madi B.', status: 'Pending review', sessions: 2, risk: 'Warning' },
    { client: 'Mira T.', trainer: 'Aigerim S.', status: 'Connected', sessions: 8, risk: 'Healthy' },
    { client: 'Alan R.', trainer: 'Unassigned', status: 'Pending', sessions: 0, risk: 'Review' },
];

const reviewRows = [
    { id: 1, author: 'Aruzhan K.', target: 'Aigerim S.', session: 'Strength Session / May 10', rating: 5, text: 'Clear plan and strong feedback after the workout.', status: 'Approved' },
    { id: 2, author: 'Dias N.', target: 'Madi B.', session: 'HIIT / May 09', rating: 3, text: 'Session was useful but timing changed twice.', status: 'Review' },
    { id: 3, author: 'Mira T.', target: 'Aigerim S.', session: 'Mobility / May 08', rating: 5, text: 'Great recovery guidance and careful technique checks.', status: 'Approved' },
];

const reportRows = [
    { title: 'Self-review attempt blocked', subtitle: 'User #42 attempted invalid target review', status: 'Blocked', icon: FiShield },
    { title: 'Payment dispute opened', subtitle: 'Subscription renewal needs admin response', status: 'Review', icon: FiCreditCard },
    { title: 'Trainer invite spike', subtitle: 'Unusual invite volume detected', status: 'Warning', icon: FiAlertTriangle },
];

const paymentRows = [
    { plan: 'Hero Pass', owner: 'Aruzhan K.', amount: '28 000 KZT', renewal: 'May 29', status: 'Paid' },
    { plan: 'Pro Pass', owner: 'Mira T.', amount: '48 000 KZT', renewal: 'Jun 02', status: 'Paid' },
    { plan: 'Start Pass', owner: 'Dias N.', amount: '15 000 KZT', renewal: 'Retry today', status: 'Failed' },
    { plan: 'Recovery Pack', owner: 'Alan R.', amount: '18 000 KZT', renewal: 'May 18', status: 'Pending' },
];

const challengeRows = [
    { title: 'Early Bird', participants: 142, status: 'Active', completion: 68 },
    { title: 'No Skip', participants: 96, status: 'Review', completion: 42 },
    { title: 'Cardio King', participants: 74, status: 'Active', completion: 57 },
];

const leaderboardRows = [
    { title: 'XP integrity check passed', subtitle: 'No suspicious point spikes in top 50', status: 'Healthy', icon: FiShield },
    { title: 'Weekly leaderboard reset', subtitle: 'Scheduled for Sunday 23:59', status: 'Active', icon: FiBarChart2 },
    { title: 'Badge sync queue', subtitle: '12 achievements waiting for sync', status: 'Pending', icon: FiAward },
];

const serviceRows = [
    { name: 'Auth Service', status: 'Healthy', latency: 42, load: 28 },
    { name: 'Training Service', status: 'Healthy', latency: 56, load: 44 },
    { name: 'Reviews API', status: 'Warning', latency: 118, load: 62 },
    { name: 'Payments Gateway', status: 'Healthy', latency: 73, load: 36 },
];

const notificationRows = [
    { title: 'Maintenance notice', subtitle: 'Draft scheduled for trainers and admins', status: 'Pending', icon: FiBell },
    { title: 'Payment reminder', subtitle: '312 clients eligible for renewal reminder', status: 'Active', icon: FiCreditCard },
    { title: 'Challenge launch', subtitle: 'Push notification prepared for Early Bird', status: 'Review', icon: FiAward },
];

export default AdminPanel;
