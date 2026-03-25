import React, { useState, useEffect } from 'react';
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
import Subscribtion from './pages/client/Subscribtion.jsx';
import TrainerProfile from './pages/client/TrainerProfile.jsx';
import ClientProfile from './pages/client/ClientProfile.jsx';
import { trainersData } from './pages/client/Trainers.jsx';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState('register');
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [coachContract, setCoachContract] = useState({
        trainerId: null,
        status: 'none'
    });

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
                    onOpenTrainers={() => setCurrentPage('trainers')}
                    onOpenSubscribtion={() => setCurrentPage('subscribtion')}
                    setCurrentPage={setCurrentPage}
                    onSelectTraining={(trainingData) => {
                        setSelectedTraining(trainingData);
                        setCurrentPage('training');
                    }}
                />
            )}

            {currentPage === 'subscribtion' && (
                <Subscribtion onBack={() => setCurrentPage('clientHome')} />
            )}

            {currentPage === 'menu' && (
                <Menu
                    onBack={() => setCurrentPage('clientHome')}
                    onLogout={() => setCurrentPage('login')}
                    onOpenLeaderboard={() => setCurrentPage('leaderboard')}
                    onOpenEvents={() => setCurrentPage('events')}
                    onOpenSupport={() => setCurrentPage('support')}
                />
            )}

            {currentPage === 'leaderboard' && (
                <Leaderboard onBack={() => setCurrentPage('menu')} />
            )}

            {currentPage === 'events' && (
                <Events onBack={() => setCurrentPage('menu')} />
            )}

            {currentPage === 'support' && (
                <Support onBack={() => setCurrentPage('menu')} />
            )}

            {currentPage === 'training' && (
                <ClientTraining
                    trainingData={selectedTraining}
                    onBack={() => setCurrentPage('clientHome')}
                />
            )}

            {currentPage === 'trainers' && (
                <Trainers
                    onBack={() => setCurrentPage('clientHome')}
                    coachContract={coachContract}
                    onSelectTrainer={(trainer) => {
                        setSelectedTrainer(trainer);
                        setCurrentPage('trainerProfile');
                    }}
                />
            )}

            {currentPage === 'trainerProfile' && (
                <TrainerProfile
                    trainer={selectedTrainer}
                    onBack={() => setCurrentPage('trainers')}
                    coachContract={coachContract}
                    setCoachContract={setCoachContract}
                    trainersData={trainersData}
                />
            )}

            {currentPage === 'profile' && (
                <ClientProfile
                    onBack={() => setCurrentPage('home')}
                    coachContract={coachContract}
                    trainersData={trainersData}
                    onNavigateToTrainers={() => setCurrentPage('trainers')}
                    onNavigateToCoachProfile={(trainer) => {
                        setSelectedTrainer(trainer);
                        setCurrentPage('trainerProfile');
                    }}
                />
            )}
        </>
    );
}

export default App;