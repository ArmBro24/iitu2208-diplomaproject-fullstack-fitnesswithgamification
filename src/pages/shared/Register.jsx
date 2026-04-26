import React, { useState } from 'react';
import { PatternFormat } from 'react-number-format';
import { useNavigate } from 'react-router-dom'; // 1. Добавлен импорт
import api from '../../utils/api';
import {
    FiUser,
    FiMail,
    FiPhone,
    FiLock,
    FiCalendar,
    FiTag,
    FiChevronDown
} from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';



const Register = () => { // 2. Убран onNavigate из пропсов
    const [role, setRole] = useState('MEMBER');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('male');

    // 3. Инициализация навигатора
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/api/auth/register', {
                email: email,
                password: password,
                role: role // Отправляем выбранную роль
            });

            if (response.status === 201 || response.status === 200) {
                alert('Success! Now you can login.');
                navigate('/login');
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert(error.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <Background>
            <div className="flex items-center justify-center py-10 min-h-screen">

                {/* Контейнер формы */}
                <div className="w-full max-w-[340px] md:max-w-md px-6 flex flex-col items-center">

                    {/* Заголовок */}
                    <div className="flex items-baseline gap-2 mb-8 text-center">
                        <h1 className="text-[#c1cf98] text-4xl font-rubik font-black tracking-tight">
                            HeroFit
                        </h1>
                        <span className="text-gray-400 text-xl">Register</span>
                    </div>

                    <form className="w-full space-y-4" onSubmit={handleSubmit}>
                        {/* Имя и Фамилия */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <FiUser className="input-icon"/>
                                <input type="text" placeholder="name" className="auth-input pl-10"/>
                            </div>
                            <div className="relative">
                                <FiUser className="input-icon"/>
                                <input type="text" placeholder="surname" className="auth-input pl-10"/>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <FiMail className="input-icon"/>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e-mail address" className="auth-input pl-10"/>
                        </div>

                        {/* Телефон */}
                        <div className="relative">
                            <FiPhone className="input-icon"/>
                            <PatternFormat
                                format="+7 (###) ###-##-##"
                                mask="_"
                                placeholder="+7 (7__) ___-__-__"
                                className="auth-input pl-10"
                            />
                        </div>

                        {/* Никнейм */}
                        <div className="relative">
                            <FiTag className="input-icon"/>
                            <input type="text" placeholder="nickname" className="auth-input pl-10"/>
                        </div>

                        {/* Дата рождения и Роль */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <FiCalendar className="input-icon"/>
                                <input
                                    type="text"
                                    placeholder="date of birth"
                                    onFocus={(e) => e.target.type = 'date'}
                                    onBlur={(e) => !e.target.value && (e.target.type = 'text')}
                                    className="auth-input pl-10 text-sm"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    className="auth-input appearance-none cursor-pointer text-sm pl-3 pr-8"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="MEMBER">Client</option>
                                    <option value="COACH">Trainer</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                                <FiChevronDown
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"/>
                            </div>
                        </div>

                        {/* Переключатель пола */}
                        <div
                            className="relative flex bg-white/5 rounded-2xl p-1 border border-white/10 overflow-hidden">
                            <div
                                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 rounded-xl transition-all duration-300 ease-out z-0 ${
                                    gender === 'male' ? 'left-1' : 'left-[50%]'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setGender('male')}
                                className={`relative z-10 flex-1 py-2 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 ${
                                    gender === 'male' ? 'text-white' : 'text-gray-500'
                                }`}
                            >
                                ♂ male
                            </button>
                            <button
                                type="button"
                                onClick={() => setGender('female')}
                                className={`relative z-10 flex-1 py-2 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 ${
                                    gender === 'female' ? 'text-white' : 'text-gray-500'
                                }`}
                            >
                                ♀ female
                            </button>
                        </div>

                        {/* Пароль */}
                        <div className="relative">
                            <FiLock className="input-icon"/>
                            <input type="password" value={password}
                                   onChange={(e) => setPassword(e.target.value)} placeholder="password" className="auth-input pl-10"/>
                        </div>

                        {/* Нижняя панель: логин и кнопка сабмита */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-8 w-full">
                            <p className="text-gray-500 text-[0.95rem] m-0 leading-none pl-2">
                                Have an account?
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')} // Переход на логин
                                    className="text-white hover:underline bg-transparent border-none p-0 ml-1 cursor-pointer font-medium"
                                >
                                    Log in
                                </button>
                            </p>
                            <button
                                type="submit"
                                className="px-10 py-3 rounded-full border border-[#c1cf98] text-[#c1cf98] hover:bg-[#c1cf98] hover:text-black transition-all flex items-center gap-2 group whitespace-nowrap"
                            >
                                Sign in <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .auth-input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid transparent;
                    border-radius: 1rem;
                    padding-top: 0.8rem;
                    padding-bottom: 0.8rem;
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
                    left: 0.8rem;
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
                input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    opacity: 0.5;
                }
            `}</style>
        </Background>
    );
};

export default Register;