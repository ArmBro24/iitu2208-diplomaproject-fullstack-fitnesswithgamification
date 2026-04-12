import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Добавлен импорт навигации
import { FiArrowLeft, FiCopy } from 'react-icons/fi';
import Background from '../../components/common/Background.jsx';
import supportImg from '../../assets/support.png';

const Support = () => {
    const [copiedId, setCopiedId] = useState(null);
    const navigate = useNavigate(); // 2. Инициализация хука

    const phoneNumbers = [
        "+7 (777) 777 77 77",
        "+7 (777) 777 77 77",
        "+7 (777) 777 77 77",
        "+7 (777) 777 77 77"
    ];

    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedId(index);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <Background>
            <div className="relative h-screen text-white font-rubik flex flex-col overflow-hidden">

                {/* BACKGROUND IMAGE */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={supportImg}
                        alt="Support Background"
                        className="w-full h-full object-cover object-[70%_center]"
                    />
                    <div className="absolute inset-0 bg-black/45" />
                </div>

                {/* HEADER */}
                <nav className="relative z-30 px-6 md:px-10 py-6 md:py-8 flex items-center shrink-0">
                    <button
                        onClick={() => navigate('/menu')} // 3. Навигация в меню
                        className="text-2xl md:text-3xl p-2 md:p-3 bg-white/15 hover:bg-white/25 rounded-xl md:rounded-2xl transition-all active:scale-95"
                    >
                        <FiArrowLeft className="text-yellow-100/80"/>
                    </button>
                    <h1 className="flex-grow text-center text-yellow-100/80 text-2xl md:text-3xl font-medium tracking-tight pr-12">
                        Support
                    </h1>
                </nav>

                {/* MAIN CONTENT AREA */}
                <div className="relative z-10 flex-grow flex flex-col items-center justify-start pt-12 md:pt-0 px-6">
                    <div className="relative w-full max-w-[380px] md:max-w-[500px] flex flex-col items-center py-14 md:py-20 md:-mt-8">

                        {/* SVG BLOB DECORATION */}
                        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                            <div className="relative w-full h-full scale-x-[1.6] scale-y-[1.3] md:scale-x-[1.5] md:scale-y-[1.2]">
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                        backdropFilter: 'blur(3px)',
                                        WebkitBackdropFilter: 'blur(3px)',
                                        WebkitClipPath: 'url(#blobClipPercent)',
                                        clipPath: 'url(#blobClipPercent)',
                                    }}
                                />
                            </div>

                            <svg width="0" height="0" className="absolute">
                                <defs>
                                    <clipPath id="blobClipPercent" clipPathUnits="objectBoundingBox">
                                        <path d="M0.725,0.125C0.791,0.158,0.845,0.223,0.876,0.296C0.906,0.369,0.914,0.449,0.906,0.527C0.897,0.604,0.872,0.679,0.828,0.741C0.783,0.804,0.719,0.854,0.648,0.88C0.578,0.906,0.501,0.907,0.422,0.891C0.343,0.875,0.262,0.84,0.201,0.783C0.14,0.725,0.098,0.643,0.086,0.559C0.075,0.475,0.093,0.388,0.139,0.318C0.185,0.249,0.257,0.196,0.328,0.164C0.399,0.133,0.469,0.123,0.542,0.111C0.616,0.099,0.658,0.093,0.725,0.125Z" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>

                        {/* CONTENT */}
                        <div className="relative z-10 w-full flex flex-col items-center text-center">
                            <h1 className="text-[#1a120d] text-3xl md:text-5xl font-black tracking-tight mb-1">
                                HeroFit
                            </h1>
                            <p className="text-[#c1cf98] text-xl md:text-2xl mb-6 md:mb-10">
                                is here for you!
                            </p>

                            <div className="w-full max-w-[260px] md:max-w-[320px] flex flex-col gap-3 mb-8 md:mb-10">
                                {phoneNumbers.map((num, index) => (
                                    <button
                                        key={index}
                                        onClick={() => copyToClipboard(num, index)}
                                        className="relative w-full py-3.5 px-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:border-[#c1cf98] transition-all group"
                                    >
                                        <span className="text-white/90 font-medium text-[14px] md:text-lg">{num}</span>
                                        <div className="absolute right-5 flex flex-col items-center">
                                            {copiedId === index && (
                                                <span className="absolute bottom-full mb-2 bg-[#c1cf98] text-[#1a120d] text-[10px] font-bold px-2 py-1 rounded-md animate-bounce shadow-lg">
                                                    Copied!
                                                </span>
                                            )}
                                            <FiCopy className="text-[#c1cf98] opacity-60 group-hover:opacity-100" />
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <p className="text-yellow-100/80 text-[15px] md:text-base leading-snug max-w-[240px] md:max-w-[340px] font-medium drop-shadow-sm">
                                Don’t worry — you’re not alone on this journey! Our support team is always ready to guide you.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    );
};

export default Support;