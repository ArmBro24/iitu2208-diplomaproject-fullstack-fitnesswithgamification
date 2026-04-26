import React, { useState, useEffect } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import api from '../../utils/api';

import bgMobile from '../../assets/login_back_mob.jpg';
import bgDesktop from '../../assets/login_back_desk.jpg';
import { useNavigate } from 'react-router-dom';
import { setActiveRole } from '../../utils/roleRouting.js';

const Login = ({ onLogin }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const animation = requestAnimationFrame(() => {
            setIsLoaded(true);
        });
        return () => cancelAnimationFrame(animation);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const password = e.target.querySelector('input[type="password"]').value;

        try {
            // Делаем реальный запрос к твоему бэкенду
            const response = await api.post('/api/auth/login', {
                email: email,
                password: password
            });

            if (response.data.token) {
                // Сохраняем роль, которую прислал бэк
                const userRole = response.data.role.toLowerCase(); // станет 'coach', 'member' или 'admin'
                setActiveRole(userRole);
                onLogin(email);

                if (userRole === 'coach') {
                    navigate('/trainer/dashboard');
                } else if (userRole === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/home');
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            alert(error.response?.data?.message || 'Ошибка входа! Проверь базу данных.');
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#0a1211] overflow-hidden flex items-center justify-start font-rubik">

            {/* ФОНОВЫЕ ИЗОБРАЖЕНИЯ */}
            <div className="absolute inset-0 z-0">
                <div className="block md:hidden w-full h-full bg-cover bg-center transition-opacity duration-1000 opacity-100"
                     style={{ backgroundImage: `url(${bgMobile})` }} />
                <div className="hidden md:block w-full h-full bg-cover bg-center transition-opacity duration-1000 opacity-100"
                     style={{ backgroundImage: `url(${bgDesktop})` }} />
            </div>

            {/* ШУМ */}
            <div className="absolute inset-0 z-[5] pointer-events-none opacity-40"
                 style={{
                     backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
                     backgroundSize: '600px',
                     filter: 'invert(100%) contrast(150%)',
                     mixBlendMode: 'multiply',
                 }}>
            </div>

            {/* ВЫЕЗЖАЮЩАЯ ШТОРКА */}
            <div className={`
                absolute z-10 transition-all duration-[1000ms] ease-out flex items-center justify-center
                left-0 top-1/2 -translate-y-1/2
                ${isLoaded ? 'translate-x-0' : '-translate-x-full'}
                md:left-1/2 md:ml-[-400px] md:top-0 md:translate-x-0
                ${isLoaded ? 'md:translate-y-0' : 'md:-translate-y-full'}
            `}>
                <div
                    className={`
                        bg-[#071019]/60 backdrop-blur-sm flex flex-col justify-center px-8 shadow-2xl transition-all duration-500
                        w-[340px] h-[550px]
                        rounded-[0px_300px_40px_0px]
                        md:w-[800px] md:h-[600px]
                        md:rounded-[0px_0px_300px_300px]
                    `}
                >
                    <div className="w-full max-w-[340px] md:max-w-md mx-auto">

                        <div className="flex items-baseline gap-2 mb-10 md:mb-12 justify-start">
                            <h1 className="text-[#c1cf98] text-4xl md:text-5xl font-black tracking-tight">
                                HeroFit
                            </h1>
                            <span className="text-gray-400 text-xl font-normal">Login</span>
                        </div>

                        {/* Привязываем handleSubmit к форме */}
                        <form className="w-full space-y-6" onSubmit={handleSubmit}>
                            <div className="relative">
                                <FiMail className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="e-mail address"
                                    className="auth-input pl-12"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <FiLock className="input-icon" />
                                <input type="password" placeholder="password" className="auth-input pl-12" />
                                <button type="button" className="absolute right-5 top-1/2 -translate-y-1/2 text-[0.85rem] text-gray-500 hover:text-white transition-colors">
                                    forgot
                                </button>
                            </div>

                            <div className="flex flex-col gap-8 mt-8 w-full">
                                <p className="text-gray-500 text-[0.95rem] m-0 leading-none pl-2">
                                    Don't have an account?
                                    <button
                                        type="button"
                                        onClick={() => navigate('/register')}
                                        className="text-white hover:underline ml-1 bg-transparent border-none p-0 cursor-pointer font-medium"
                                    >
                                        Sign up
                                    </button>
                                </p>

                                <div className="w-full flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-10 py-3.5 rounded-full border border-[#c1cf98] text-[#c1cf98] hover:bg-[#c1cf98] hover:text-black transition-all flex items-center gap-2 group whitespace-nowrap"
                                    >
                                        Login <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .auth-input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid transparent;
                    border-radius: 50px;
                    padding-top: 0.9rem;
                    padding-bottom: 0.9rem;
                    color: white;
                    outline: none;
                    transition: all 0.2s ease;
                }
                .auth-input:focus {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(193, 207, 152, 0.8);
                    box-shadow: 0 0 15px rgba(193, 207, 152, 0.1);
                }
                .input-icon {
                    position: absolute;
                    left: 1.1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #6b7280;
                    font-size: 1.1rem;
                    z-index: 10;
                    pointer-events: none;
                }
                .auth-input::placeholder {
                    color: #6b7280;
                    font-size: 0.95rem;
                }
            `}</style>
        </div>
    );
};

export default Login;
