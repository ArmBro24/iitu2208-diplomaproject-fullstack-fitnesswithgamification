import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import useStore from './store/useStore';
import LoadingScreen from './components/common/LoadingScreen.jsx';
import Register from './pages/shared/Register.jsx';
import Login from './pages/shared/Login.jsx';
import ClientHome from './pages/client/ClientHome.jsx';
import Menu from './pages/client/Menu.jsx';
import Leaderboard from './pages/shared/Leaderboard.jsx';
import Events from './pages/shared/Events.jsx';
import Support from './pages/shared/Support.jsx';
import ClientTraining from './pages/client/ClientTraining.jsx';
import Trainers from './pages/client/Trainers.jsx';
import Subscription from './pages/client/Subscription.jsx';
import SubscriptionDesc from './pages/client/SubscriptionDesc.jsx';
import TrainerProfile from './pages/client/TrainerProfile.jsx';
import ClientProfile from './pages/client/ClientProfile.jsx';
import Challenge from './pages/client/Challenge.jsx';
import TrainerDashboard from './pages/trainer/Trainers.jsx';
import AdminPanel from './pages/admin/AdminPanel.jsx';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const { fetchUserProfile, currentUser, logout } = useStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        if (currentUser.id) {
            fetchUserProfile();
        }
    }, [currentUser.id]);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <LoadingScreen />;

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/register" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login onLogin={(email) => console.log(email)} />} />

            <Route path="/home" element={<ClientHome onLogout={handleLogout} />} />
            <Route path="/menu" element={<Menu />} />

            <Route path="/subscription" element={<Subscription />} />
            <Route path="/subscription-desc" element={<SubscriptionDesc />} />
            <Route path="/plans" element={<Subscription />} />
            <Route path="/plans/details" element={<SubscriptionDesc />} />

            <Route path="/trainers" element={<Trainers />} />
            <Route path="/trainer-profile" element={<TrainerProfile />} />
            <Route path="/training" element={<ClientTraining />} />
            <Route path="/trainer/dashboard" element={<TrainerDashboard onLogout={handleLogout} />} />
            <Route path="/admin/dashboard" element={<AdminPanel onLogout={handleLogout} />} />

            <Route path="/profile" element={<ClientProfile />} />

            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/support" element={<Support />} />

            <Route path="*" element={<Navigate to="/login" />} />

            <Route path="/challenges" element={<Challenge />} />
        </Routes>
    );
}

export default App;