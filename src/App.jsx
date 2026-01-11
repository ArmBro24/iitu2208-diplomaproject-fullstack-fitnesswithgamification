import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Trainers from './pages/Trainers';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Установили 7 секунд (7000 мс)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 7000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return <Trainers />;
}

export default App;