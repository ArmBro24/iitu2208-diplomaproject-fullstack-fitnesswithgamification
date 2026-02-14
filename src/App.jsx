import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/common/LoadingScreen.jsx';
import Register from './pages/shared/Register.jsx';
import Login from './pages/shared/Login.jsx';
import ClientHome from './pages/client/ClientHome.jsx';
import Menu from './pages/client/Menu.jsx';
import Leaderboard from './pages/shared/Leaderboard.jsx';
import Events from './pages/shared/Events.jsx';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState('register');

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleLogin = (email) => {
        if (email === 'client@gmail.com') {
            setCurrentPage('clientHome');
        } else {
            setCurrentPage('login');
        }
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <>
            {currentPage === 'register' && (
                <Register onNavigate={() => setCurrentPage('login')} />
            )}

            {currentPage === 'login' && (
                <Login
                    onNavigate={() => setCurrentPage('register')}
                    onLogin={handleLogin}
                />
            )}

            {currentPage === 'clientHome' && (
                <ClientHome
                    onLogout={() => setCurrentPage('login')}
                    onOpenMenu={() => setCurrentPage('menu')}
                />
            )}

            {currentPage === 'menu' && (
                <Menu
                    onBack={() => setCurrentPage('clientHome')}
                    onLogout={() => setCurrentPage('login')}
                    onOpenLeaderboard={() => setCurrentPage('leaderboard')}
                    onOpenEvents={() => setCurrentPage('events')}
                />
            )}

            {currentPage === 'leaderboard' && (
                <Leaderboard
                    // При нажатии "Назад" на лидерборде возвращаемся в Меню
                    onBack={() => setCurrentPage('menu')}
                />
            )}

            {currentPage === 'events' && (
                <Events onBack={() => setCurrentPage('menu')} />
            )}
        </>
    );
}

export default App;