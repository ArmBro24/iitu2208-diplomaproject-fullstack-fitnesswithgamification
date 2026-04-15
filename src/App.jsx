import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000); // Немного ускорил для комфорта
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <LoadingScreen />;

    return (
        <Routes>
            {/* Публичные роуты */}
            <Route path="/" element={<Navigate to="/register" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login onLogin={(email) => console.log(email)} />} />

            {/* Главные разделы клиента */}
            <Route path="/home" element={<ClientHome onLogout={() => navigate('/login')} />} />
            <Route path="/menu" element={<Menu />} />

            {/* Подписки (теперь без передачи пропсов subsData) */}
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/subscription-desc" element={<SubscriptionDesc />} />
            <Route path="/plans" element={<Subscription />} />
            <Route path="/plans/details" element={<SubscriptionDesc />} />

            {/* Тренеры и тренировки (всё состояние теперь внутри стора) */}
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/trainer-profile" element={<TrainerProfile />} />
            <Route path="/training" element={<ClientTraining />} />
            <Route path="/trainer/dashboard" element={<TrainerDashboard onLogout={() => navigate('/login')} />} />
            <Route path="/admin/dashboard" element={<AdminPanel onLogout={() => navigate('/login')} />} />

            {/* Профиль клиента (чистый роут) */}
            <Route path="/profile" element={<ClientProfile />} />

            {/* Дополнительные страницы */}
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/support" element={<Support />} />

            {/* Редирект для несуществующих страниц */}
            <Route path="*" element={<Navigate to="/login" />} />

            <Route path="/challenges" element={<Challenge />} />
        </Routes>
    );
}

export default App;
