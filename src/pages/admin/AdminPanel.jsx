import React, { useState } from 'react';
import Background from '../../components/common/Background.jsx';
import AdminHomeView from '../../components/admin/AdminHomeView.jsx';
import AdminMenuView from '../../components/admin/AdminMenuView.jsx';
import AdminUsersView from '../../components/admin/AdminUsersView.jsx';
import AdminSubscriptionsView from '../../components/admin/AdminSubscriptionsView.jsx';
import AdminSupportView from '../../components/admin/AdminSupportView.jsx';

const AdminPanel = ({ onLogout }) => {
    const [view, setView] = useState('home');

    return (
        <Background>
            {view === 'home' && (
                <AdminHomeView
                    onOpenMenu={() => setView('menu')}
                    onOpenUsers={() => setView('users')}
                    onOpenSubscriptions={() => setView('subscriptions')}
                    onOpenSupport={() => setView('support')}
                />
            )}

            {view === 'menu' && (
                <AdminMenuView
                    onBack={() => setView('home')}
                    onLogout={onLogout}
                    onOpenView={setView}
                />
            )}

            {view === 'users' && (
                <AdminUsersView onBack={() => setView('home')} />
            )}

            {view === 'subscriptions' && (
                <AdminSubscriptionsView onBack={() => setView('home')} />
            )}

            {view === 'support' && (
                <AdminSupportView onBack={() => setView('home')} />
            )}
        </Background>
    );
};

export default AdminPanel;
