import React, { useEffect, useState } from 'react';
import { FiLock, FiMail, FiX, FiClock, FiAlertTriangle, FiPhone, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import bgMobile from '../../assets/login_back_mob.jpg';
import bgDesktop from '../../assets/login_back_desk.jpg';
import api from '../../utils/api';
import { setActiveRole } from '../../utils/roleRouting.js';
import useStore from '../../store/useStore';

const Login = ({ onLogin }) => {
    const { setCurrentUser, logout } = useStore();
    const [isLoaded, setIsLoaded] = useState(false);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const [showPendingModal, setShowPendingModal] = useState(false);
    const [showRejectedModal, setShowRejectedModal] = useState(false);
    const [reapplySuccess, setReapplySuccess] = useState(false);

    useEffect(() => {
        const animation = requestAnimationFrame(() => {
            setIsLoaded(true);
        });
        return () => cancelAnimationFrame(animation);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        logout();

        const password = e.target.querySelector('input[type="password"]').value;
        const normalizedEmail = email.trim().toLowerCase();

        try {
            const response = await api.post('/api/auth/login', {
                email: normalizedEmail,
                password,
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);

                const userId = response.data.id || response.data.userId;
                const userRole = response.data.role.toUpperCase();

                setCurrentUser({
                    id: userId,
                    role: userRole,
                    email: normalizedEmail
                });

                localStorage.setItem('userId', userId);
                localStorage.setItem('activeRole', userRole);

                setActiveRole(userRole.toLowerCase());
                onLogin(normalizedEmail);

                if (userRole === 'COACH') navigate('/trainer/dashboard');
                else if (userRole === 'ADMIN') navigate('/admin/dashboard');
                else navigate('/home');
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || '';

            if (error.response?.status === 403) {
                if (errorMessage.includes('pending')) {
                    setShowPendingModal(true);
                } else if (errorMessage.includes('rejected')) {
                    setShowRejectedModal(true);
                } else {
                    alert(errorMessage || 'Access denied.');
                }
            } else {
                alert(errorMessage || 'Login failed. Please check your credentials.');
            }
        }
    };

    const handleReapply = async () => {
        try {
            await api.post(`/api/auth/reapply?email=${encodeURIComponent(email.trim().toLowerCase())}`);
            setReapplySuccess(true);
            setTimeout(() => {
                setShowRejectedModal(false);
                setReapplySuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Reapply error:', error);
            alert(error.response?.data?.message || 'Failed to resubmit application.');
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#0a1211] font-rubik flex items-center justify-start selection:bg-[#c1cf98]/30">
            <div className="absolute inset-0 z-0">
                <div
                    className="block h-full w-full bg-cover bg-center opacity-100 transition-opacity duration-1000 md:hidden"
                    style={{ backgroundImage: `url(${bgMobile})` }}
                />
                <div
                    className="hidden h-full w-full bg-cover bg-center opacity-100 transition-opacity duration-1000 md:block"
                    style={{ backgroundImage: `url(${bgDesktop})` }}
                />
            </div>

            <div
                className="absolute inset-0 z-[5] pointer-events-none opacity-40"
                style={{
                    backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")',
                    backgroundSize: '600px',
                    filter: 'invert(100%) contrast(150%)',
                    mixBlendMode: 'multiply',
                }}
            />

            <div
                className={`
                    absolute z-10 flex items-center justify-center transition-all duration-[1000ms] ease-out
                    left-0 top-1/2 -translate-y-1/2
                    ${isLoaded ? 'translate-x-0' : '-translate-x-full'}
                    md:left-1/2 md:top-0 md:ml-[-400px] md:translate-x-0
                    ${isLoaded ? 'md:translate-y-0' : 'md:-translate-y-full'}
                `}
            >
                <div
                    className="
                        flex h-[550px] w-[340px] flex-col justify-center bg-[#071019]/60 px-8 shadow-2xl backdrop-blur-sm transition-all duration-500
                        rounded-[0px_300px_40px_0px]
                        md:h-[600px] md:w-[800px] md:rounded-[0px_0px_300px_300px]
                    "
                >
                    <div className="mx-auto w-full max-w-[340px] md:max-w-md">
                        <div className="mb-10 flex items-baseline justify-start gap-2 md:mb-12">
                            <h1 className="text-4xl font-black tracking-tight text-[#c1cf98] md:text-5xl">
                                HeroFit
                            </h1>
                            <span className="text-xl font-normal text-gray-400">Login</span>
                        </div>

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
                                <button
                                    type="button"
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[0.85rem] text-gray-500 transition-colors hover:text-white"
                                >
                                    forgot
                                </button>
                            </div>

                            <div className="mt-8 flex w-full flex-col gap-8">
                                <p className="m-0 pl-2 text-[0.95rem] leading-none text-gray-500">
                                    Don&apos;t have an account?
                                    <button
                                        type="button"
                                        onClick={() => navigate('/register')}
                                        className="ml-1 cursor-pointer border-none bg-transparent p-0 font-medium text-white hover:underline"
                                    >
                                        Sign up
                                    </button>
                                </p>

                                <div className="w-full flex justify-end">
                                    <button
                                        type="submit"
                                        className="group flex items-center gap-2 whitespace-nowrap rounded-full border border-[#c1cf98] px-10 py-3.5 text-[#c1cf98] transition-all hover:bg-[#c1cf98] hover:text-black"
                                    >
                                        Login <span className="transition-transform group-hover:translate-x-1">→</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* МОДАЛЬНОЕ ОКНО: ОЖИДАНИЕ АПРУВА */}
            {showPendingModal && (
                <div className="fixed inset-0 z-[200] overflow-y-auto text-white flex items-center justify-center p-8">
                    {/* Мягкий полупрозрачный бэкдроп вместо сплошного черного */}
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity" onClick={() => setShowPendingModal(false)} />

                    <div className="relative w-full max-w-md bg-[#1a1a1a]/85 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[40px] p-8 text-center overflow-hidden z-10 animate-in zoom-in duration-300">

                        <button onClick={() => setShowPendingModal(false)} className="absolute top-6 right-6 z-20 p-2 text-white/40 hover:text-[#c1cf98] transition-colors">
                            <FiX size={24} />
                        </button>

                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-6 mt-4 shadow-lg shadow-[#c1cf98]/5">
                            <FiClock size={36} className="text-[#c1cf98]" />
                        </div>

                        <span className="text-[#c1cf98] text-xs font-medium tracking-wide uppercase tracking-widest">Verification Stage</span>
                        <h2 className="text-2xl font-bold mt-2 mb-4 leading-tight tracking-tight">Approval Pending</h2>

                        <p className="text-white/60 text-sm leading-relaxed mb-8 px-2">
                            Please wait for administrator approval. Your trainer account registration request is currently under review.
                        </p>

                        <button
                            onClick={() => setShowPendingModal(false)}
                            className="w-full bg-transparent border border-[#c1cf98] text-[#c1cf98] font-bold py-4 rounded-2xl hover:bg-[#c1cf98] hover:text-black transition-all duration-300 active:scale-95 tracking-tight shadow-lg shadow-[#c1cf98]/5"
                        >
                            Understood
                        </button>
                    </div>
                </div>
            )}

            {/* МОДАЛЬНОЕ ОКНО: ОТКЛОНЕНО / REJECTED */}
            {showRejectedModal && (
                <div className="fixed inset-0 z-[200] overflow-y-auto text-white flex items-center justify-center p-8">
                    {/* Мягкий полупрозрачный бэкдроп вместо сплошного черного */}
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity" onClick={() => setShowRejectedModal(false)} />

                    <div className="relative w-full max-w-md bg-[#1a1a1a]/85 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[40px] p-8 text-center overflow-hidden z-10 animate-in zoom-in duration-300">

                        <button onClick={() => setShowRejectedModal(false)} className="absolute top-6 right-6 z-20 p-2 text-white/40 hover:text-[#c1cf98] transition-colors">
                            <FiX size={24} />
                        </button>

                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-6 mt-4 shadow-lg">
                            {reapplySuccess ? (
                                <FiCheckCircle size={36} className="text-[#c1cf98] animate-bounce" />
                            ) : (
                                <FiAlertTriangle size={36} className="text-red-400" />
                            )}
                        </div>

                        <span className={`${reapplySuccess ? 'text-[#c1cf98]' : 'text-red-400'} text-xs font-medium tracking-wide uppercase tracking-widest`}>
                            {reapplySuccess ? 'Success' : 'Access Restricted'}
                        </span>
                        <h2 className="text-2xl font-bold mt-2 mb-4 leading-tight tracking-tight">
                            {reapplySuccess ? 'Request Sent' : 'Application Rejected'}
                        </h2>

                        {reapplySuccess ? (
                            <p className="text-white/60 text-sm leading-relaxed mb-6 px-2 py-4">
                                Your application has been resubmitted successfully! The status has been changed back to pending.
                            </p>
                        ) : (
                            <>
                                <p className="text-white/60 text-sm leading-relaxed mb-5 px-2">
                                    Your trainer profile was not approved. Please get in touch with our security department.
                                </p>

                                {/* Полупрозрачная плашечка в стиле блока цены/описания подписок */}
                                <div className="bg-white/5 px-4 py-3.5 rounded-2xl border border-white/5 mb-6 flex items-center justify-center gap-3 text-white/80 backdrop-blur-sm">
                                    <FiPhone className="text-[#c1cf98]" size={14} />
                                    <span className="text-sm font-semibold font-mono tracking-wider">+7 (777) 777 77 77</span>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={handleReapply}
                                        className="w-full bg-transparent border border-[#c1cf98] text-[#c1cf98] font-bold py-4 rounded-2xl hover:bg-[#c1cf98] hover:text-black transition-all duration-300 active:scale-95 tracking-tight shadow-lg shadow-[#c1cf98]/5"
                                    >
                                        Re-apply for Approval
                                    </button>
                                    <button
                                        onClick={() => setShowRejectedModal(false)}
                                        className="w-full text-white/40 hover:text-white transition-colors text-xs py-2 tracking-tight"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

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