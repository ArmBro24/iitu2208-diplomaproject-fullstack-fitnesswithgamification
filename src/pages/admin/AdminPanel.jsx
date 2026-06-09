import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    FiActivity,
    FiAlertTriangle,
    FiAward,
    FiBell,
    FiCheckCircle,
    FiCreditCard,
    FiFilter,
    FiFlag,
    FiGrid,
    FiLogOut,
    FiMenu,
    FiPlus,
    FiRefreshCw,
    FiSearch,
    FiShield,
    FiUserCheck,
    FiUsers,
    FiX,
    FiCalendar,
    FiMail,
    FiPhone,
    FiUser,
    FiTrash2
} from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';
import AdminCategoriesView from '../../components/admin/AdminCategoriesView.jsx';
import useStore from '../../store/useStore.js';
import {
    createAdminChallenge,
    fetchAdminDashboard,
    markPaymentFailed,
    markPaymentSuccess,
    refundPayment
} from '../../utils/adminApi.js';
import { getUserDisplayName, getUserInitials, getUserNickname } from '../../utils/userDisplay.js';

const AdminPanel = ({ onLogout }) => {
    const [activeView, setActiveView] = useState('overview');
    const [query, setQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [dashboard, setDashboard] = useState({ payload: {}, services: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [paymentFeedback, setPaymentFeedback] = useState('');
    const [paymentActionId, setPaymentActionId] = useState(null);

    const [selectedPendingTrainer, setSelectedPendingTrainer] = useState(null);

    const currentUser = useStore((state) => state.currentUser);
    const { pendingTrainers, fetchPendingTrainers, approveTrainer, rejectTrainer } = useStore();

    const loadDashboard = useCallback(async () => {
        setIsLoading(true);
        setLoadError('');

        try {
            await Promise.all([
                fetchAdminDashboard().then(setDashboard),
                fetchPendingTrainers(),
                useStore.getState().fetchCategories() // <--- Добавили загрузку категорий
            ]);
        } catch (error) {
            setLoadError(error.response?.data?.message || 'Could not load administrator data.');
        } finally {
            setIsLoading(false);
        }
    }, [fetchPendingTrainers]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const handleApproveTrainer = async (trainerId) => {
        try {
            await approveTrainer(trainerId);
            setSelectedPendingTrainer(null);
            await loadDashboard();
        } catch (error) {
            console.error("Failed to approve trainer:", error);
        }
    };

    const handleRejectTrainer = async (trainerId) => {
        if (window.confirm("Are you sure you want to reject and remove this trainer request?")) {
            try {
                await rejectTrainer(trainerId);
                setSelectedPendingTrainer(null);
                await loadDashboard();
            } catch (error) {
                console.error("Failed to reject trainer:", error);
            }
        }
    };

    const users = useMemo(() => dashboard.payload.auth?.users ?? [], [dashboard.payload.auth?.users]);
    const filteredUsers = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return users.filter((user) => {
            const role = String(user.role ?? '').toLowerCase();
            const haystack = `${getUserDisplayName(user)} ${user.email ?? ''} ${role}`.toLowerCase();
            const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
            const matchesRole = roleFilter === 'all' || role === roleFilter;
            return matchesQuery && matchesRole;
        });
    }, [query, roleFilter, users]);

    const unavailableServices = dashboard.services.filter((service) => service.status !== 'Online').length;

    const handlePaymentAction = async (payment, action) => {
        setPaymentActionId(`${payment.id}-${action}`);
        setPaymentFeedback('');

        try {
            if (action === 'success') {
                await markPaymentSuccess(payment.id);
            } else if (action === 'failed') {
                const reason = window.prompt('Failure reason', payment.failureReason || 'Declined by administrator');
                if (!reason) return;
                await markPaymentFailed(payment.id, reason);
            } else if (action === 'refund') {
                await refundPayment(payment.id);
            }

            setPaymentFeedback('Payment status updated.');
            await loadDashboard();
        } catch (error) {
            setPaymentFeedback(error.response?.data?.message || 'Payment action failed.');
        } finally {
            setPaymentActionId(null);
        }
    };

    return (
        <Background>
            <div className="min-h-screen overflow-x-hidden text-white font-rubik md:p-5">
                <div className="mx-auto flex min-h-screen max-w-[1440px] overflow-hidden bg-[rgba(15,18,17,0.88)] md:min-h-[calc(100vh-2.5rem)] md:rounded-[34px] md:border md:border-white/10">
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
                        <AdminHeader
                            activeView={activeView}
                            currentUser={currentUser}
                            unavailableServices={unavailableServices}
                            onMenu={() => setIsSidebarOpen(true)}
                            onRefresh={loadDashboard}
                            isLoading={isLoading}
                        />
                        <div className="px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
                            {loadError && <MessageCard tone="danger" text={loadError} />}
                            {activeView === 'overview' && (
                                <OverviewView
                                    data={dashboard.payload}
                                    isLoading={isLoading}
                                    onNavigate={setActiveView}
                                />
                            )}
                            {activeView === 'users' && (
                                <UsersView
                                    users={filteredUsers}
                                    isLoading={isLoading}
                                    query={query}
                                    roleFilter={roleFilter}
                                    setQuery={setQuery}
                                    setRoleFilter={setRoleFilter}
                                    pendingTrainers={pendingTrainers}
                                    onSelectTrainer={setSelectedPendingTrainer}
                                />
                            )}
                            {activeView === 'relationships' && (
                                <RelationshipsView
                                    relationships={dashboard.payload.relationships ?? []}
                                    users={users}
                                    isLoading={isLoading}
                                />
                            )}
                            {activeView === 'reviews' && (
                                <ReviewsView
                                    reviews={dashboard.payload.reviews ?? []}
                                    users={users}
                                    isLoading={isLoading}
                                />
                            )}
                            {activeView === 'payments' && (
                                <PaymentsView
                                    payments={dashboard.payload.payments ?? []}
                                    users={users}
                                    isLoading={isLoading}
                                    feedback={paymentFeedback}
                                    actionId={paymentActionId}
                                    onAction={handlePaymentAction}
                                />
                            )}
                            {activeView === 'challenges' && (
                                <ChallengesView
                                    challenges={dashboard.payload.challenges ?? []}
                                    isLoading={isLoading}
                                    onCreated={loadDashboard}
                                />
                            )}
                            {activeView === 'categories' && <AdminCategoriesView />}
                            {activeView === 'monitoring' && <MonitoringView services={dashboard.services} isLoading={isLoading} />}
                        </div>
                    </main>
                </div>
            </div>

            {selectedPendingTrainer && (
                <TrainerReviewModal
                    trainer={selectedPendingTrainer}
                    onClose={() => setSelectedPendingTrainer(null)}
                    onApprove={handleApproveTrainer}
                    onReject={handleRejectTrainer}
                />
            )}
        </Background>
    );
};

const TrainerReviewModal = ({ trainer, onClose, onApprove, onReject }) => {
    if (!trainer) return null;

    return (
        <div className="fixed inset-0 z-[200] overflow-y-auto font-rubik text-white selection:bg-[#c1cf98]/30">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />

            <div className="flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="relative w-full max-w-2xl bg-[#141615]/95 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[32px] md:rounded-[40px] overflow-hidden z-10 animate-in zoom-in duration-200 flex flex-col md:flex-row">

                    <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2 text-white/40 hover:text-[#c1cf98] transition-colors" aria-label="Close modal">
                        <FiX size={22} />
                    </button>

                    <div className="w-full md:w-[40%] p-6 sm:p-8 bg-white/5 border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-center justify-center text-center shrink-0">
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-yellow-500/30 bg-yellow-500/10 text-2xl font-black text-yellow-500 mb-4 shadow-inner">
                            {getUserInitials(trainer)}
                        </div>
                        <span className="text-yellow-500 text-[10px] font-black tracking-widest uppercase bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                            {roleLabel(trainer.role)} Request
                        </span>
                        <h3 className="text-xl font-black mt-3 leading-tight text-[#f5efe7] break-words max-w-full">
                            {getUserDisplayName(trainer)}
                        </h3>
                        <p className="text-xs text-[#c1cf98]/70 mt-1 break-all max-w-full">
                            {getUserNickname(trainer)}
                        </p>
                    </div>

                    <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between min-w-0">
                        <div>
                            <h4 className="text-base font-black tracking-tight text-[#c1cf98] mb-4">Application Details</h4>

                            <div className="space-y-3.5">
                                <DetailField icon={FiMail} label="Email address" value={trainer.email} isCopyable />
                                <DetailField icon={FiPhone} label="Phone number" value={trainer.phone || 'Not specified'} />
                                <div className="grid grid-cols-2 gap-3">
                                    <DetailField icon={FiUser} label="Gender" value={trainer.gender || 'Not set'} />
                                    <DetailField icon={FiCalendar} label="Birth Date" value={trainer.birthDate ? formatDate(trainer.birthDate) : 'Not set'} />
                                </div>
                                <DetailField
                                    icon={FiShield}
                                    label="Registered on"
                                    value={trainer.createdAt ? `${formatDate(trainer.createdAt)} ${new Date(trainer.createdAt).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}` : 'Unknown'}
                                />
                            </div>
                        </div>

                        <div className="mt-8 grid gap-3 sm:grid-cols-2 pt-4 border-t border-white/5">
                            <button
                                type="button"
                                onClick={() => onReject(trainer.id)}
                                className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-4 py-3 text-sm font-black text-red-300 transition-all active:scale-[0.97] w-full"
                            >
                                <FiTrash2 size={15} /> Decline Request
                            </button>
                            <button
                                type="button"
                                onClick={() => onApprove(trainer.id)}
                                className="flex items-center justify-center gap-2 rounded-2xl bg-[#c1cf98] hover:bg-[#b0be87] px-4 py-3 text-sm font-black text-[#111412] transition-all active:scale-[0.97] w-full shadow-lg shadow-[#c1cf98]/10"
                            >
                                <FiUserCheck size={15} /> Approve Access
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const DetailField = ({ icon: Icon, label, value, isCopyable }) => (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 min-w-0">
        <span className="block text-[10px] font-black uppercase tracking-wider text-white/35 flex items-center gap-1.5">
            <Icon size={11} className="text-[#c1cf98]" />
            {label}
        </span>
        <p className="mt-1 text-sm font-bold text-[#f5efe7] truncate max-w-full" title={value}>
            {value}
        </p>
    </div>
);

const AdminHeader = ({ activeView, currentUser, unavailableServices, onMenu, onRefresh, isLoading }) => (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#111412]/88 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-3">
                <button type="button" onClick={onMenu} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#c1cf98] lg:hidden" aria-label="Open navigation">
                    <FiMenu size={20} />
                </button>
                <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c1cf98]/70">HeroFit Admin</p>
                    <h1 className="max-w-full text-xl font-black leading-tight text-[#f5efe7] sm:text-2xl md:text-3xl xl:max-w-none">{viewTitles[activeView]}</h1>
                </div>
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3 xl:shrink-0 xl:justify-end">
                <button type="button" onClick={onRefresh} className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-sm font-bold text-white/70 sm:px-4">
                    <FiRefreshCw className={isLoading ? 'animate-spin' : ''} /> Refresh
                </button>
                <div className="hidden h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-white/70 md:inline-flex">
                    <FiBell className="text-[#c1cf98]" />
                    {unavailableServices ? `${unavailableServices} offline` : 'Services online'}
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-bold text-white">{getUserDisplayName(currentUser)}</p>
                        <p className="text-xs text-[#c1cf98]/70">{getUserNickname(currentUser)}</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c1cf98]/30 bg-[#c1cf98]/10 text-sm font-black text-[#c1cf98]">
                        {getUserInitials(currentUser)}
                    </div>
                </div>
            </div>
        </div>
    </header>
);

const AdminSidebar = ({ activeView, isOpen, onClose, onLogout, onSelect }) => (
    <>
        <aside className={`fixed inset-y-0 left-0 z-40 w-[292px] border-r border-white/10 bg-[#111412] p-4 transition-transform lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex h-full flex-col">
                <div className="flex items-center justify-between px-2 py-2">
                    <div>
                        <p className="text-3xl font-black tracking-tight text-[#c1cf98]">HeroFit</p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-white/35">Control Center</p>
                    </div>
                    <button type="button" className="rounded-xl p-2 text-white/50 lg:hidden" onClick={onClose}><FiX size={22} /></button>
                </div>
                <nav className="mt-7 space-y-2">
                    {adminNavItems.map((item) => (
                        <button key={item.id} type="button" onClick={() => onSelect(item.id)} className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-bold ${activeView === item.id ? 'border-[#c1cf98]/25 bg-[#c1cf98]/12 text-[#dfe9bf]' : 'border-transparent text-white/58 hover:bg-white/[0.04]'}`}>
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="mt-auto rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                    <p className="flex items-center gap-2 text-sm font-black text-[#f5efe7]"><FiShield className="text-[#c1cf98]" /> Admin session</p>
                    <p className="mt-2 text-xs text-white/40">Protected API access uses your signed-in role.</p>
                    <button type="button" onClick={onLogout} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-100">
                        <FiLogOut size={16} /> Log out
                    </button>
                </div>
            </div>
        </aside>
        {isOpen && <button type="button" className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} aria-label="Close navigation" />}
    </>
);

const OverviewView = ({ data, isLoading, onNavigate }) => {
    const auth = data.auth;
    const training = data.training;
    const stats = [
        { label: 'Registered users', value: auth?.totalUsers, icon: FiUsers, note: 'Auth database' },
        { label: 'Coaches', value: auth?.coaches, icon: FiUserCheck, note: 'Registered role' },
        { label: 'Mentorships', value: training?.mentorships, icon: FiCheckCircle, note: 'Training service' },
        { label: 'Training sessions', value: training?.totalSessions, icon: FiActivity, note: 'Training service' },
    ];
    const latestUsers = [...(auth?.users ?? [])]
        .filter((user) => user.createdAt)
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
        .slice(0, 4);

    return (
        <div className="space-y-5">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => <StatCard key={stat.label} {...stat} isLoading={isLoading} />)}
            </section>
            <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
                <Panel title="Operational Summary" eyebrow="Live API">
                    <SummaryRow label="Members" value={auth?.members} />
                    <SummaryRow label="Administrators" value={auth?.admins} />
                    <SummaryRow label="Completed sessions" value={training?.completedSessions} />
                    <SummaryRow label="Logs awaiting review" value={training?.submittedLogs} />
                </Panel>
                <Panel title="Newest Accounts" eyebrow="Auth Service">
                    {latestUsers.length ? latestUsers.map((user) => (
                        <ActivityItem
                            key={user.id}
                            title={getUserDisplayName(user)}
                            subtitle={`${roleLabel(user.role)} joined ${formatDate(user.createdAt)}`}
                            status="Registered"
                            icon={FiUsers}
                        />
                    )) : <EmptyState text={isLoading ? 'Loading accounts...' : 'No dated account records yet.'} />}
                </Panel>
            </section>
            <section className="grid gap-5 xl:grid-cols-3">
                <QuickPanel icon={FiUsers} title="Users" body="Inspect registered accounts and assigned roles." onClick={() => onNavigate('users')} />
                <QuickPanel icon={FiUserCheck} title="Relationships" body="Read live coach-client assignments." onClick={() => onNavigate('relationships')} />
                <QuickPanel icon={FiAward} title="Challenges" body="Create and review stored challenges." onClick={() => onNavigate('challenges')} />
            </section>
        </div>
    );
};

const UsersView = ({ query, roleFilter, setQuery, setRoleFilter, users, isLoading, pendingTrainers, onSelectTrainer }) => (
    <div className="space-y-5">

        {pendingTrainers && pendingTrainers.length > 0 && (
            <Panel title="Account Moderation" eyebrow="Action Required">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {pendingTrainers.map((trainer) => (
                        <div
                            key={trainer.id}
                            onClick={() => onSelectTrainer(trainer)}
                            className="flex flex-col justify-between gap-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.03] p-4 min-w-0 cursor-pointer hover:border-yellow-500/40 hover:bg-yellow-500/[0.05] transition-all group"
                        >
                            <div className="flex items-start gap-3 min-w-0">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10 text-xs font-black text-yellow-500 group-hover:scale-105 transition-transform">
                                    {getUserInitials(trainer)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-black text-[#f5efe7] text-base truncate">
                                        {getUserDisplayName(trainer)}
                                    </p>
                                    <p className="text-xs text-white/40 truncate">{trainer.email}</p>
                                    <span className="mt-2 inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 text-[10px] font-bold text-yellow-300 uppercase tracking-wider">
                                        {roleLabel(trainer.role)} (Pending)
                                    </span>
                                </div>
                            </div>

                            <div className="text-xs font-bold text-[#c1cf98] flex items-center justify-end gap-1 group-hover:translate-x-0.5 transition-transform">
                                Review application <span>{'->'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Panel>
        )}

        <Toolbar query={query} setQuery={setQuery} roleFilter={roleFilter} setRoleFilter={setRoleFilter} />

        <Panel title="Registered Accounts" eyebrow="Auth Service">
            {users.length ? (
                <DataTable
                    columns={['User', 'Role', 'Phone', 'Created', 'Record']}
                    rows={users.map((user) => [
                        <UserCell key="user" user={user} />,
                        <RoleBadge key="role" role={roleLabel(user.role)} />,
                        user.phone || 'Not provided',
                        formatDate(user.createdAt),
                        <StatusBadge key="record" status={user.status || "Registered"} />,
                    ])}
                />
            ) : <EmptyState text={isLoading ? 'Loading users...' : 'No accounts match the filter.'} />}
        </Panel>
    </div>
);

const RelationshipsView = ({ relationships, users, isLoading }) => {
    const userMap = new Map(users.map((user) => [String(user.id), user]));
    return (
        <Panel title="Trainer / Client Relationships" eyebrow="Training Service">
            {relationships.length ? (
                <DataTable
                    columns={['Client', 'Coach', 'Status', 'Created']}
                    rows={relationships.map((relation) => [
                        userNameById(userMap, relation.clientId),
                        userNameById(userMap, relation.coachId),
                        <StatusBadge key="status" status={relation.status} />,
                        formatDate(relation.createdAt),
                    ])}
                />
            ) : <EmptyState text={isLoading ? 'Loading relationships...' : 'No coach-client assignments stored.'} />}
        </Panel>
    );
};

const ReviewsView = ({ reviews, users, isLoading }) => {
    const userMap = new Map(users.map((user) => [String(user.id), user]));
    const sortedReviews = [...reviews].sort((left, right) => new Date(right.submittedAt ?? 0) - new Date(left.submittedAt ?? 0));
    const submitted = sortedReviews.filter((review) => review.status === 'SUBMITTED').length;
    const approved = sortedReviews.filter((review) => review.status === 'APPROVED').length;
    const rejected = sortedReviews.filter((review) => review.status === 'REJECTED').length;

    return (
        <div className="space-y-5">
            <section className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Awaiting review" value={submitted} icon={FiFlag} note="Submitted logs" isLoading={isLoading} />
                <StatCard label="Approved" value={approved} icon={FiCheckCircle} note="Coach accepted" isLoading={isLoading} />
                <StatCard label="Rejected" value={rejected} icon={FiAlertTriangle} note="Needs revision" isLoading={isLoading} />
            </section>

            <Panel title="Review Queue" eyebrow="Training Service">
                <div className="space-y-3">
                    {sortedReviews.length ? sortedReviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            member={userMap.get(String(review.memberId))}
                            coach={userMap.get(String(review.coachId))}
                        />
                    )) : <EmptyState text={isLoading ? 'Loading review logs...' : 'No submitted training logs yet.'} />}
                </div>
            </Panel>
        </div>
    );
};

const ReviewCard = ({ review, member, coach }) => (
    <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black text-[#f5efe7]">Log #{review.id}</p>
                    <StatusBadge status={review.status} />
                </div>
                <p className="mt-2 text-sm text-white/45">
                    Session #{review.sessionId} submitted {formatDate(review.submittedAt)}
                </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 md:w-[430px]">
                <ReviewPerson label="Member" user={member} fallback={`Member #${review.memberId}`} />
                <ReviewPerson label="Coach" user={coach} fallback={`Coach #${review.coachId}`} />
            </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <ReviewText label="Member comment" value={review.memberComment} />
            <ReviewText label="Coach comment" value={review.coachComment} />
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-white/40">
            <span>Points: {review.pointsAwarded ?? '-'}</span>
            <span>Reviewed: {formatDate(review.reviewedAt)}</span>
        </div>
    </article>
);

const ReviewPerson = ({ label, user, fallback }) => (
    <div className="min-w-0 rounded-xl border border-white/5 bg-black/10 px-3 py-2">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/30">{label}</p>
        <p className="mt-1 truncate text-sm font-black text-[#f5efe7]">{user ? getUserDisplayName(user) : fallback}</p>
        <p className="mt-0.5 truncate text-xs text-white/35">{user?.email ?? 'Profile not loaded'}</p>
    </div>
);

const ReviewText = ({ label, value }) => (
    <div className="rounded-xl border border-white/5 bg-black/10 px-3 py-3">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/30">{label}</p>
        <p className="mt-2 text-sm leading-relaxed text-white/64">{value || 'No comment provided.'}</p>
    </div>
);

const ChallengesView = ({ challenges, isLoading, onCreated }) => (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <ChallengeForm onCreated={onCreated} />
        <Panel title="Stored Challenges" eyebrow="Challenge Service">
            <div className="space-y-3">
                {challenges.length ? challenges.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                )) : <EmptyState text={isLoading ? 'Loading challenges...' : 'No challenges have been created.'} />}
            </div>
        </Panel>
    </div>
);

const PaymentsView = ({ payments, users, isLoading, feedback, actionId, onAction }) => {
    const sortedPayments = [...payments].sort((left, right) => new Date(right.createdAt ?? 0) - new Date(left.createdAt ?? 0));
    const userMap = new Map(users.map((user) => [String(user.id), user]));
    const totals = sortedPayments.reduce((acc, payment) => {
        acc.count += 1;
        if (payment.status === 'SUCCESS') acc.success += 1;
        if (payment.status === 'PENDING') acc.pending += 1;
        if (payment.status === 'REFUNDED') acc.refunded += 1;
        return acc;
    }, { count: 0, success: 0, pending: 0, refunded: 0 });

    return (
        <div className="space-y-5">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total payments" value={totals.count} icon={FiCreditCard} note="Payment service" isLoading={isLoading} />
                <StatCard label="Successful" value={totals.success} icon={FiCheckCircle} note="Completed payments" isLoading={isLoading} />
                <StatCard label="Pending" value={totals.pending} icon={FiRefreshCw} note="Awaiting action" isLoading={isLoading} />
                <StatCard label="Refunded" value={totals.refunded} icon={FiActivity} note="Returned payments" isLoading={isLoading} />
            </section>

            <Panel title="Subscriptions and Payments" eyebrow="Payment Service">
                {feedback && <div className="mb-4 rounded-2xl border border-[#c1cf98]/25 bg-[#c1cf98]/10 p-4 text-sm font-bold text-[#dfe9bf]">{feedback}</div>}
                {sortedPayments.length ? (
                    <>
                        <div className="grid gap-3 xl:hidden">
                            {sortedPayments.map((payment) => (
                                <PaymentCard key={payment.id} payment={payment} member={userMap.get(String(payment.memberId))} actionId={actionId} onAction={onAction} />
                            ))}
                        </div>
                        <PaymentsTable payments={sortedPayments} userMap={userMap} actionId={actionId} onAction={onAction} />
                    </>
                ) : <EmptyState text={isLoading ? 'Loading payments...' : 'No payments have been created yet.'} />}
            </Panel>
        </div>
    );
};

const PaymentsTable = ({ payments, userMap, actionId, onAction }) => (
    <div className="hidden overflow-x-auto xl:block">
        <table className="w-full min-w-[1040px] table-fixed border-separate border-spacing-y-2">
            <thead>
            <tr>
                {[
                    ['Payment', 'w-[90px]'],
                    ['Member', 'w-[190px]'],
                    ['Subscription', 'w-[150px]'],
                    ['Amount', 'w-[140px]'],
                    ['Method', 'w-[100px]'],
                    ['Status', 'w-[130px]'],
                    ['Created', 'w-[125px]'],
                    ['Actions', 'w-[170px]'],
                ].map(([column, width]) => (
                    <th key={column} className={`${width} px-3 py-2 text-left text-[11px] font-black uppercase tracking-[0.12em] text-white/35`}>
                        {column}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {payments.map((payment) => (
                <tr key={payment.id} className="bg-white/[0.04]">
                    <PaymentTableCell strong>#{payment.id}</PaymentTableCell>
                    <PaymentTableCell>
                        <MemberPaymentCell member={userMap.get(String(payment.memberId))} memberId={payment.memberId} />
                    </PaymentTableCell>
                    <PaymentTableCell>Subscription #{payment.subscriptionId}</PaymentTableCell>
                    <PaymentTableCell strong>{formatMoney(payment.amount, payment.currency)}</PaymentTableCell>
                    <PaymentTableCell>{payment.method}</PaymentTableCell>
                    <PaymentTableCell><StatusBadge status={payment.status} /></PaymentTableCell>
                    <PaymentTableCell>{formatDate(payment.createdAt)}</PaymentTableCell>
                    <PaymentTableCell><PaymentActions payment={payment} actionId={actionId} onAction={onAction} /></PaymentTableCell>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);

const PaymentTableCell = ({ children, strong }) => (
    <td className={`border-y border-white/10 px-3 py-3 text-sm first:rounded-l-2xl first:border-l last:rounded-r-2xl last:border-r ${strong ? 'font-black text-[#f5efe7]' : 'text-white/65'}`}>
        <div className="min-w-0" title={typeof children === 'string' ? children : undefined}>
            {children}
        </div>
    </td>
);

const PaymentCard = ({ payment, member, actionId, onAction }) => (
    <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-white/35">Payment #{payment.id}</p>
                <p className="mt-1 truncate text-xl font-black text-[#f5efe7]">
                    {formatMoney(payment.amount, payment.currency)}
                </p>
            </div>
            <StatusBadge status={payment.status} />
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <PaymentMeta label="Member" value={member ? getUserDisplayName(member) : `Member #${payment.memberId}`} note={`ID #${payment.memberId}`} />
            <PaymentMeta label="Subscription" value={`#${payment.subscriptionId}`} />
            <PaymentMeta label="Method" value={payment.method} />
            <PaymentMeta label="Created" value={formatDate(payment.createdAt)} />
        </div>
        <div className="mt-4 border-t border-white/10 pt-4">
            <PaymentActions payment={payment} actionId={actionId} onAction={onAction} />
        </div>
    </article>
);

const PaymentMeta = ({ label, value, note }) => (
    <div className="min-w-0 rounded-xl border border-white/5 bg-black/10 px-3 py-2">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/30">{label}</p>
        <p className="mt-1 truncate text-sm font-bold text-white/70">{value}</p>
        {note && <p className="mt-0.5 truncate text-xs text-white/35">{note}</p>}
    </div>
);

const MemberPaymentCell = ({ member, memberId }) => (
    <div className="min-w-0">
        <p className="truncate font-black text-[#f5efe7]">
            {member ? getUserDisplayName(member) : `Member #${memberId}`}
        </p>
        <p className="mt-0.5 truncate text-xs text-white/38">
            ID #{memberId}{member?.phone ? ` · ${member.phone}` : ''}
        </p>
    </div>
);

const PaymentActions = ({ payment, actionId, onAction }) => {
    const isPending = payment.status === 'PENDING';
    const isSuccessful = payment.status === 'SUCCESS';

    return (
        <div className="grid grid-cols-2 gap-2 xl:flex xl:flex-wrap">
            {isPending && (
                <>
                    <ActionButton disabled={actionId === `${payment.id}-success`} onClick={() => onAction(payment, 'success')}>
                        Success
                    </ActionButton>
                    <ActionButton disabled={actionId === `${payment.id}-failed`} tone="danger" onClick={() => onAction(payment, 'failed')}>
                        Fail
                    </ActionButton>
                </>
            )}
            {isSuccessful && (
                <ActionButton disabled={actionId === `${payment.id}-refund`} tone="danger" onClick={() => onAction(payment, 'refund')}>
                    Refund
                </ActionButton>
            )}
            {!isPending && !isSuccessful && <span className="text-xs font-bold text-white/35">No actions</span>}
        </div>
    );
};

const ActionButton = ({ children, disabled, onClick, tone = 'default' }) => (
    <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`inline-flex h-10 min-w-[76px] items-center justify-center rounded-xl border px-3 text-xs font-black transition disabled:opacity-50 ${
            tone === 'danger'
                ? 'border-red-300/25 bg-red-400/10 text-red-100 hover:bg-red-400/20'
                : 'border-[#c1cf98]/25 bg-[#c1cf98]/10 text-[#dfe9bf] hover:bg-[#c1cf98]/20'
        }`}
    >
        {disabled ? '...' : children}
    </button>
);

const ChallengeForm = ({ onCreated }) => {
    const categories = useStore((state) => state.categories);
    const [form, setForm] = useState({
        title: '',
        description: '',
        targetPoints: 100,
        rewardPoints: 50,
        category: '',
        startsAt: '',
        endsAt: ''
    });
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const submit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setFeedback('');
        try {
            await createAdminChallenge({
                ...form,
                targetPoints: Number(form.targetPoints),
                rewardPoints: Number(form.rewardPoints),
                category: form.category || null,
                startsAt: new Date(form.startsAt).toISOString(),
                endsAt: new Date(form.endsAt).toISOString(),
            });
            setFeedback('Challenge published successfully.');
            setForm({ title: '', description: '', targetPoints: 100, rewardPoints: 50, category: '', startsAt: '', endsAt: '' });
            await onCreated();
        } catch (error) {
            setFeedback(error.response?.data?.message || 'Failed to create challenge.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Panel title="Publish Challenge" eyebrow="Admin Action">
            <form className="space-y-3" onSubmit={submit}>
                <FormInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
                <FormInput label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />

                <label className="block">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-[0.16em] text-white/45">Workout Category</span>
                    <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-[#c1cf98]/40"
                    >
                        <option value="">Any Category</option>
                        {categories?.map((cat) => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                    <FormInput label="Target points" type="number" value={form.targetPoints} onChange={(v) => setForm({ ...form, targetPoints: v })} required />
                    <FormInput label="Reward points" type="number" value={form.rewardPoints} onChange={(v) => setForm({ ...form, rewardPoints: v })} required />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <FormInput label="Starts" type="datetime-local" value={form.startsAt} onChange={(v) => setForm({ ...form, startsAt: v })} required />
                    <FormInput label="Ends" type="datetime-local" value={form.endsAt} onChange={(v) => setForm({ ...form, endsAt: v })} required />
                </div>

                {feedback && <p className="text-sm text-[#dfe9bf]">{feedback}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#c1cf98] px-5 py-3 text-sm font-black text-[#111412] disabled:opacity-60"
                >
                    <FiPlus /> {submitting ? 'Publishing...' : 'Publish challenge'}
                </button>
            </form>
        </Panel>
    );
};

const MonitoringView = ({ services, isLoading }) => {
    const summary = services.reduce((acc, service) => {
        if (service.status === 'Online') acc.online += 1;
        else if (service.status === 'Forbidden') acc.restricted += 1;
        else acc.offline += 1;
        return acc;
    }, { online: 0, restricted: 0, offline: 0 });

    const averageLatency = services
        .filter((service) => Number.isFinite(service.latency))
        .reduce((acc, service, _, list) => acc + service.latency / list.length, 0);

    return (
        <div className="space-y-5">
            <section className="grid gap-4 sm:grid-cols-3">
                <MonitoringStat label="Online" value={summary.online} tone="online" />
                <MonitoringStat label="Restricted" value={summary.restricted} tone="restricted" />
                <MonitoringStat label="Offline" value={summary.offline} tone="offline" />
            </section>

            <Panel title="Service Health" eyebrow="Monitoring">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-sm font-bold text-white/58">
                        {isLoading ? 'Checking services...' : `${services.length} checks completed`}
                    </p>
                    <p className="text-sm font-black text-[#c1cf98]">
                        Avg latency: {averageLatency ? `${Math.round(averageLatency)} ms` : '-'}
                    </p>
                </div>

                <div className="grid gap-3">
                    {services.length ? services.map((service) => (
                        <MonitoringServiceRow key={service.id} service={service} />
                    )) : <EmptyState text={isLoading ? 'Checking services...' : 'No service checks available.'} />}
                </div>
            </Panel>
        </div>
    );
};

const MonitoringStat = ({ label, value, tone }) => {
    const toneClass = {
        online: 'border-[#c1cf98]/25 bg-[#c1cf98]/10 text-[#dfe9bf]',
        restricted: 'border-yellow-300/25 bg-yellow-300/10 text-yellow-100',
        offline: 'border-red-300/25 bg-red-400/10 text-red-100',
    }[tone];

    return (
        <div className={`rounded-2xl border px-4 py-4 ${toneClass}`}>
            <p className="text-xs font-black uppercase tracking-[0.16em] opacity-70">{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
        </div>
    );
};

const MonitoringServiceRow = ({ service }) => {
    const detail = service.status === 'Online'
        ? `${service.latency} ms response`
        : service.status === 'Forbidden'
            ? 'Request reached service, but current token has no access'
            : 'No successful response';

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="font-black text-[#f5efe7]">{service.name}</p>
                        <StatusBadge status={service.status} />
                    </div>
                    <p className="mt-2 truncate text-xs font-bold text-white/35">{service.endpoint ?? service.url}</p>
                </div>
                <div className="shrink-0 text-left md:text-right">
                    <p className="text-sm font-black text-white/70">{detail}</p>
                    {service.statusCode && <p className="mt-1 text-xs text-white/35">HTTP {service.statusCode}</p>}
                </div>
            </div>
        </div>
    );
};

const UnavailableModuleView = ({ module }) => (
    <Panel title={module} eyebrow="Not Implemented">
        <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/[0.07] p-5">
            <p className="flex items-center gap-2 font-black text-yellow-100"><FiAlertTriangle /> No backend module is connected</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/58">
                This section intentionally shows no invented records. Add a persistence model and protected administrator endpoints before enabling management actions here.
            </p>
        </div>
    </Panel>
);

const Toolbar = ({ query, roleFilter, setQuery, setRoleFilter }) => (
    <div className="grid gap-3 rounded-[28px] border border-white/10 bg-[rgba(18,20,24,0.74)] p-4 lg:grid-cols-[1fr_auto]">
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <FiSearch className="text-[#c1cf98]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users by name, email or role" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none" />
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <FiFilter className="text-[#c1cf98]" />
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="bg-transparent text-sm font-bold text-white outline-none">
                <option value="all" className="bg-[#17191d]">All roles</option>
                <option value="member" className="bg-[#17191d]">Members</option>
                <option value="coach" className="bg-[#17191d]">Coaches</option>
                <option value="admin" className="bg-[#17191d]">Admins</option>
            </select>
        </label>
    </div>
);

const Panel = ({ children, eyebrow, title }) => (
    <section className="rounded-[30px] border border-white/10 bg-[rgba(18,20,24,0.74)] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.2)]">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/38">{eyebrow}</p>
        <h2 className="mb-5 mt-1 text-xl font-black text-[#f5efe7] md:text-2xl">{title}</h2>
        {children}
    </section>
);

const StatCard = ({ icon: Icon, label, note, value, isLoading }) => (
    <div className="rounded-[26px] border border-white/10 bg-[rgba(18,20,24,0.76)] p-5">
        <div className="flex justify-between gap-3">
            <div>
                <p className="text-sm font-bold text-white/45">{label}</p>
                <p className="mt-3 text-3xl font-black text-[#f5efe7]">{isLoading ? '...' : value ?? '-'}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c1cf98]/12 text-[#dfe9bf]"><Icon size={20} /></div>
        </div>
        <p className="mt-4 text-sm font-bold text-[#c1cf98]">{note}</p>
    </div>
);

const SummaryRow = ({ label, value }) => (
    <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 last:mb-0">
        <p className="text-sm font-bold text-white/65">{label}</p>
        <p className="text-lg font-black text-[#dfe9bf]">{value ?? '-'}</p>
    </div>
);

const QuickPanel = ({ body, icon: Icon, onClick, title }) => (
    <button type="button" onClick={onClick} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 text-left hover:border-[#c1cf98]/35">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c1cf98]/10 text-[#c1cf98]"><Icon size={22} /></div>
        <p className="mt-4 text-lg font-black text-[#f5efe7]">{title}</p>
        <p className="mt-2 text-sm text-white/52">{body}</p>
    </button>
);

const DataTable = ({ columns, rows }) => (
    <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] border-separate border-spacing-y-2">
            <thead><tr>{columns.map((column) => <th key={column} className="px-4 py-2 text-left text-xs font-black uppercase tracking-[0.16em] text-white/35">{column}</th>)}</tr></thead>
            <tbody>
            {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="bg-white/[0.04]">
                    {row.map((cell, cellIndex) => <td key={cellIndex} className="border-y border-white/10 px-4 py-4 text-sm text-white/68 first:rounded-l-2xl first:border-l last:rounded-r-2xl last:border-r">{cell}</td>)}
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);

const UserCell = ({ user }) => (
    <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c1cf98]/10 text-xs font-black text-[#c1cf98]">{getUserInitials(user)}</div>
        <div>
            <p className="font-black text-[#f5efe7]">{getUserDisplayName(user)}</p>
            <p className="text-xs text-white/40">{user.email}</p>
        </div>
    </div>
);

const RoleBadge = ({ role }) => (
    <span className="whitespace-nowrap rounded-full border border-[#8b5cf6]/25 bg-[#8b5cf6]/10 px-3 py-1 text-xs font-bold text-[#ddd6fe]">
        {role}
    </span>
);

const ChallengeCard = ({ challenge }) => {
    const completion = challenge.participants
        ? Math.round((challenge.completedParticipants / challenge.participants) * 100)
        : 0;
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex justify-between gap-3">
                <div>
                    <p className="font-black text-[#f5efe7]">{challenge.title}</p>
                    <p className="mt-1 text-sm text-white/45">{challenge.participants} participants, goal {challenge.targetPoints} XP</p>
                </div>
                <StatusBadge status={challenge.status} />
            </div>
            <p className="mt-3 text-xs text-white/45">{formatDate(challenge.startsAt)} to {formatDate(challenge.endsAt)}</p>
            <div className="mt-3 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-[#c1cf98]" style={{ width: `${completion}%` }} /></div>
        </div>
    );
};

const ActivityItem = ({ icon: Icon, status, subtitle, title }) => (
    <div className="mb-3 flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 last:mb-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c1cf98]/10 text-[#c1cf98]"><Icon /></div>
        <div className="min-w-0 flex-1">
            <div className="flex justify-between gap-3"><p className="font-black text-[#f5efe7]">{title}</p><StatusBadge status={status} /></div>
            <p className="mt-1 text-xs text-white/45">{subtitle}</p>
        </div>
    </div>
);

const FormInput = ({ label, type = 'text', value, onChange, required }) => (
    <label className="block">
        <span className="mb-1 block text-xs font-bold uppercase tracking-[0.16em] text-white/45">{label}</span>
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-[#c1cf98]/40" />
    </label>
);

const StatusBadge = ({ status }) => {
    const normalized = String(status).toLowerCase();
    const style = normalized.includes('online') || normalized.includes('active') || normalized.includes('registered')
        ? 'border-[#c1cf98]/25 bg-[#c1cf98]/10 text-[#dfe9bf]'
        : normalized.includes('draft') || normalized.includes('pending')
            ? 'border-yellow-300/25 bg-yellow-300/10 text-yellow-100'
            : 'border-red-300/25 bg-red-400/10 text-red-100';
    return <span className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold ${style}`}>{status}</span>;
};

const MessageCard = ({ text }) => (
    <div className="mb-5 rounded-2xl border border-red-300/25 bg-red-400/10 p-4 text-sm text-red-100">{text}</div>
);

const EmptyState = ({ text }) => (
    <div className="rounded-2xl border border-dashed border-white/10 px-5 py-8 text-center text-sm text-white/45">{text}</div>
);

const roleLabel = (role) => ({ MEMBER: 'Member', COACH: 'Coach', ADMIN: 'Admin' }[role] ?? role ?? 'Unknown');
const formatDate = (value) => value ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(value)) : '-';
const formatMoney = (amount, currency = 'KZT') => {
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount)) return `${amount ?? '-'} ${currency ?? ''}`.trim();
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency || 'KZT' }).format(numericAmount);
};
const userNameById = (map, id) => map.has(String(id)) ? getUserDisplayName(map.get(String(id))) : `User #${id}`;

const adminNavItems = [
    { id: 'overview', label: 'Overview', icon: FiGrid },
    { id: 'users', label: 'Users', icon: FiUsers },
    { id: 'relationships', label: 'Relationships', icon: FiUserCheck },
    { id: 'categories', label: 'Workout Points', icon: FiActivity },
    { id: 'reviews', label: 'Reviews', icon: FiFlag },
    { id: 'payments', label: 'Payments', icon: FiCreditCard },
    { id: 'challenges', label: 'Challenges', icon: FiAward },
    { id: 'monitoring', label: 'Monitoring', icon: FiActivity },
];

const viewTitles = {
    overview: 'Admin Dashboard',
    users: 'Users Management',
    relationships: 'Relationship Moderation',
    categories: 'Workout Points',
    reviews: 'Reviews and Reports',
    payments: 'Payments',
    challenges: 'Challenges',
    monitoring: 'System Monitoring',
};

export default AdminPanel;
