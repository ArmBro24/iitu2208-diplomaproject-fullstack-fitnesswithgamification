import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    // Теперь по умолчанию после загрузки будет страница регистрации
    const [currentPage, setCurrentPage] = useState('register');

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    // Логика переключения
    return (
        <>
            {currentPage === 'register' ? (
                <Register onNavigate={() => setCurrentPage('login')} />
            ) : (
                <Login onNavigate={() => setCurrentPage('register')} />
            )}
        </>
    );
}

export default App;