import React, { useRef, useState } from 'react';
import { FiZap, FiCamera, FiX, FiCheck, FiTrash2 } from 'react-icons/fi';
import useStore from '../../store/useStore';

const ProfileCharacter = ({ alt, image, initials, level = 1, points = 0 }) => {
    const uploadAvatar = useStore((state) => state.uploadAvatar);
    const currentUser = useStore((state) => state.currentUser);
    const fileInputRef = useRef(null);
    const [cacheBuster, setCacheBuster] = useState(Date.now());

    const [selectedImgSrc, setSelectedImgSrc] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imagePos, setImagePos] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
    const [baseRenderSize, setBaseRenderSize] = useState({ width: 0, height: 0 });

    const modalImgRef = useRef(null);
    const cropAreaRef = useRef(null);

    const hasCustomAvatar = !!(currentUser?.avatarUrl && currentUser.avatarUrl.startsWith('http'));

    const getEvolutionStage = (lvl) => {
        if (lvl >= 20) return { name: 'Cyber Titan', color: '#a855f7', glow: 'shadow-[0_0_40px_rgba(168,85,247,0.5)]', coreColor: '#c084fc' };
        if (lvl >= 12) return { name: 'Elite Champion', color: '#22c55e', glow: 'shadow-[0_0_30px_rgba(34,197,94,0.4)]', coreColor: '#4ade80' };
        if (lvl >= 5) return { name: 'Iron Challenger', color: '#f97316', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]', coreColor: '#fb923c' };
        return { name: 'Novice Athlete', color: '#94a3b8', glow: '', coreColor: '#67e8f9' }; // На 0-1 уровне неоново-бирюзовое око
    };

    const stage = getEvolutionStage(level);

    const handleAvatarClick = (e) => {
        e.stopPropagation();
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImgSrc(reader.result);
                setImagePos({ x: 0, y: 0 });
                setZoom(1);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteAvatar = async (e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to remove your custom avatar?')) {
            await uploadAvatar(null);
            setCacheBuster(Date.now());
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleImageLoad = () => {
        if (!modalImgRef.current || !cropAreaRef.current) return;

        const img = modalImgRef.current;
        const crop = cropAreaRef.current;

        const nw = img.naturalWidth;
        const nh = img.naturalHeight;
        setNaturalSize({ width: nw, height: nh });

        const cropWidth = crop.offsetWidth;
        const cropHeight = crop.offsetHeight;

        const imgAspect = nw / nh;
        const cropAspect = cropWidth / cropHeight;

        let bw, bh;
        if (imgAspect > cropAspect) {
            bh = cropHeight;
            bw = cropHeight * imgAspect;
        } else {
            bw = cropWidth;
            bh = cropWidth / imgAspect;
        }

        setBaseRenderSize({ width: bw, height: bh });
        setImagePos({
            x: (cropWidth - bw) / 2,
            y: (cropHeight - bh) / 2
        });
    };

    const getBounds = () => {
        if (!cropAreaRef.current) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
        const cropWidth = cropAreaRef.current.offsetWidth;
        const cropHeight = cropAreaRef.current.offsetHeight;

        const currentWidth = baseRenderSize.width * zoom;
        const currentHeight = baseRenderSize.height * zoom;

        return {
            minX: cropWidth - currentWidth,
            maxX: 0,
            minY: cropHeight - currentHeight,
            maxY: 0
        };
    };

    const startDrag = (clientX, clientY) => {
        setIsDragging(true);
        setDragStart({
            x: clientX - imagePos.x,
            y: clientY - imagePos.y
        });
    };

    const moveDrag = (clientX, clientY, e) => {
        if (!isDragging) return;

        if (e && typeof e.preventDefault === 'function' && e.cancelable) {
            e.preventDefault();
        }

        let newX = clientX - dragStart.x;
        let newY = clientY - dragStart.y;

        const bounds = getBounds();

        if (newX > bounds.maxX) newX = bounds.maxX;
        if (newX < bounds.minX) newX = bounds.minX;
        if (newY > bounds.maxY) newY = bounds.maxY;
        if (newY < bounds.minY) newY = bounds.minY;

        setImagePos({ x: newX, y: newY });
    };

    const stopDrag = () => {
        setIsDragging(false);
    };

    const handleZoomChange = (newZoom) => {
        setZoom(newZoom);
        setImagePos((prev) => {
            if (!cropAreaRef.current) return prev;
            const cropWidth = cropAreaRef.current.offsetWidth;
            const cropHeight = cropAreaRef.current.offsetHeight;

            const currentWidth = baseRenderSize.width * newZoom;
            const currentHeight = baseRenderSize.height * newZoom;

            let x = prev.x;
            let y = prev.y;

            if (x > 0) x = 0;
            if (x < cropWidth - currentWidth) x = cropWidth - currentWidth;
            if (y > 0) y = 0;
            if (y < cropHeight - currentHeight) y = cropHeight - currentHeight;

            return { x, y };
        });
    };

    const handleSaveCrop = () => {
        if (!cropAreaRef.current) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const targetWidth = 400;
        const targetHeight = 600;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const cropWidth = cropAreaRef.current.offsetWidth;
        const cropHeight = cropAreaRef.current.offsetHeight;

        const currentRenderWidth = baseRenderSize.width * zoom;
        const currentRenderHeight = baseRenderSize.height * zoom;

        const scaleX = naturalSize.width / currentRenderWidth;
        const scaleY = naturalSize.height / currentRenderHeight;

        const sourceX = Math.abs(imagePos.x) * scaleX;
        const sourceY = Math.abs(imagePos.y) * scaleY;
        const sourceWidth = cropWidth * scaleX;
        const sourceHeight = cropHeight * scaleY;

        ctx.drawImage(
            modalImgRef.current,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, targetWidth, targetHeight
        );

        canvas.toBlob(async (blob) => {
            if (blob) {
                const croppedFile = new File([blob], "avatar.png", { type: "image/png" });
                await uploadAvatar(croppedFile);
                setCacheBuster(Date.now());
                setSelectedImgSrc(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        }, 'image/png');
    };

    const finalImageSrc = hasCustomAvatar
        ? `${currentUser.avatarUrl}?t=${cacheBuster}`
        : image;

    return (
        <div className="profile-character group flex flex-col items-center rounded-[24px] border border-white/10 bg-black/20 p-6 transition-all duration-300 hover:border-[#c1cf98]/35 hover:bg-black/25 w-full">
            <input
                accept="image/*"
                className="hidden"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            <div onClick={handleAvatarClick} className={`profile-character-stage relative flex items-center justify-center border border-white/10 bg-gradient-to-b from-neutral-800 to-neutral-900 transition-all duration-300 md:group-hover:-translate-y-1 cursor-pointer w-full max-w-[240px] md:max-w-[200px] h-auto aspect-square rounded-full ${stage.glow}`}>
                <div className="profile-aura absolute inset-[-10px] border border-white/5 transition-all duration-300 rounded-full"></div>
                <div className="profile-aura profile-aura-delayed absolute inset-[-4px] border border-white/5 transition-all duration-300 rounded-full"></div>

                <div className="profile-character-breath relative z-10 flex h-[calc(100%-16px)] w-[calc(100%-16px)] items-center justify-center overflow-hidden bg-black/30 transition-all duration-300 rounded-full">
                    {hasCustomAvatar ? (
                        <img
                            alt={alt || "Trainer Avatar"}
                            className="h-full w-full object-cover transition-transform duration-300 md:group-hover:scale-[1.045]"
                            src={finalImageSrc}
                        />
                    ) : (
                        /* ВЫСОКОТЕХНОЛОГИЧНЫЙ CLAY RPG ДРОН (БЕСПОЛЫЙ И СЛОЖНЫЙ) */
                        <svg width="130" height="130" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]">
                            <defs>
                                {/* Мягкий матовый градиент для деталей брони */}
                                <radialGradient id="clayArmor" cx="40%" cy="30%" r="60%" fx="30%" fy="20%">
                                    <stop offset="0%" stopColor="#f8fafc" />
                                    <stop offset="65%" stopColor="#cbd5e1" />
                                    <stop offset="100%" stopColor="#475569" />
                                </radialGradient>
                                {/* Темный внутренний каркас дрона */}
                                <linearGradient id="cyberChassis" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#334155" />
                                    <stop offset="100%" stopColor="#0f172a" />
                                </linearGradient>
                                {/* Неоновое свечение энергетического ядра */}
                                <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#ffffff" />
                                    <stop offset="40%" stopColor={stage.coreColor} />
                                    <stop offset="100%" stopColor={stage.coreColor} stopOpacity="0" />
                                </radialGradient>
                            </defs>

                            {/* Задняя механическая дуга/подвес */}
                            <path d="M 25 65 A 32 32 0 1 1 75 65" stroke="url(#cyberChassis)" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
                            <circle cx="25" cy="65" r="3.5" fill={stage.color} />
                            <circle cx="75" cy="65" r="3.5" fill={stage.color} />

                            {/* Левитирующие боковые модули (Появляются физически на высоком уровне) */}
                            {level >= 12 && (
                                <g className="animate-bounce">
                                    {/* Левый спутник */}
                                    <path d="M 10 45 L 5 50 L 8 58 L 15 52 Z" fill="url(#clayArmor)" />
                                    <circle cx="10" cy="51" r="1.5" fill={stage.color} />
                                    {/* Правый спутник */}
                                    <path d="M 90 45 L 95 50 L 92 58 L 85 52 Z" fill="url(#clayArmor)" />
                                    <circle cx="90" cy="51" r="1.5" fill={stage.color} />
                                </g>
                            )}

                            {/* Основной сферический корпус Дрона */}
                            <circle cx="50" cy="50" r="24" fill="url(#clayArmor)" />

                            {/* Технологичные стыки плит на корпусе (эффект сложной структуры) */}
                            <path d="M 32 36 A 24 24 0 0 1 68 36" stroke="#475569" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
                            <path d="M 26 50 L 32 50" stroke="#475569" strokeWidth="1.5" opacity="0.5" />
                            <path d="M 68 50 L 74 50" stroke="#475569" strokeWidth="1.5" opacity="0.5" />
                            <path d="M 50 74 L 50 68" stroke="#475569" strokeWidth="1.5" opacity="0.5" />

                            {/* Центральный футуристичный визор / Око ИИ */}
                            <rect x="34" y="42" width="32" height="14" rx="7" fill="url(#cyberChassis)" />

                            {/* Пульсирующее светящееся ядро внутри визора */}
                            <circle cx="50" cy="49" r="9" fill="url(#coreGlow)" className="animate-pulse" />
                            <circle cx="50" cy="49" r="3" fill="#ffffff" />

                            {/* Нижний стабилизатор полета (Глиняный хвост) */}
                            <path d="M 44 73 L 50 84 L 56 73 Z" fill="url(#clayArmor)" />
                            <line x1="50" y1="74" x2="50" y2="80" stroke="#475569" strokeWidth="1" opacity="0.4" />
                        </svg>
                    )}

                    <div className="hidden md:flex absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col items-center justify-center gap-2">
                        <div className="flex items-center gap-3">
                            <button onClick={handleAvatarClick} className="p-2 rounded-xl bg-white/10 hover:bg-[#c1cf98] text-white hover:text-black transition-all" title="Change avatar">
                                <FiCamera size={18} />
                            </button>
                            {hasCustomAvatar && (
                                <button onClick={handleDeleteAvatar} className="p-2 rounded-xl bg-white/10 hover:bg-red-500 text-white hover:text-white transition-all" title="Delete custom avatar">
                                    <FiTrash2 size={18} />
                                </button>
                            )}
                        </div>
                        <span className="text-[9px] uppercase tracking-wider text-white/80 font-bold">Manage Card</span>
                    </div>
                </div>

                {level >= 5 && !hasCustomAvatar && (
                    <div className="absolute inset-3 border border-dashed rounded-full animate-[spin_12s_linear_infinite]" style={{ borderColor: stage.color, opacity: 0.35 }} />
                )}

                {level >= 20 && !hasCustomAvatar && (
                    /* Голографическая корона лидера сверху корпуса */
                    <div className="absolute -top-5 z-20 animate-bounce">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill={stage.color} opacity="0.9" className="drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                            <path d="M2 4 L7 9 L12 3 L17 9 L22 4 L19 20 L5 20 Z" />
                        </svg>
                    </div>
                )}

                <span className="profile-level-burst absolute -right-3 -top-3 z-20 inline-flex items-center gap-1 rounded-full border border-[#c1cf98]/35 bg-[#17191d] px-3 py-1 text-xs font-black text-[#eaf2cf] shadow-[0_0_22px_rgba(193,207,152,0.2)]">
                    <FiZap size={12} className="text-[#c1cf98]" />
                    LV {level}
                </span>
                <span className="profile-points-pop absolute -bottom-3 z-20 rounded-full border border-[#c1cf98]/30 bg-[#c1cf98] px-3 py-1 text-xs font-black text-black">+{points} XP</span>

                <span className="profile-spark profile-spark-one"></span>
                <span className="profile-spark profile-spark-two"></span>
                <span className="profile-spark profile-spark-three"></span>
            </div>

            <div className="flex md:hidden flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-6 w-full max-w-[240px] z-20">
                <button onClick={handleAvatarClick} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-[#c1cf98] font-bold w-full sm:w-auto flex-1">
                    <FiCamera size={14} />
                    Change
                </button>
                {hasCustomAvatar && (
                    <button onClick={handleDeleteAvatar} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/20 bg-red-500/10 text-xs text-red-400 font-bold w-full sm:w-auto flex-1">
                        <FiTrash2 size={14} />
                        Remove
                    </button>
                )}
            </div>

            <div className="text-center mt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Character Status</p>
                <p className="text-sm font-black tracking-wide mt-0.5 transition-colors duration-500" style={{ color: stage.color }}>{stage.name}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{points} XP Accumulated</p>
            </div>

            <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-sm font-black text-[#c1cf98] transition-all duration-300 md:group-hover:bg-[#c1cf98]/10 md:group-hover:shadow-[0_0_20px_rgba(193,207,152,0.18)]">
                {initials}
            </div>

            {selectedImgSrc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-[2px] p-4 animate-fadeIn">
                    <div className="w-full max-w-sm rounded-[28px] border border-white/10 bg-[#17191d] p-5 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white/90">Adjust Avatar</h3>
                            <button onClick={() => setSelectedImgSrc(null)} className="rounded-xl bg-white/5 p-2 text-white/60 hover:bg-white/10 hover:text-white">
                                <FiX size={18} />
                            </button>
                        </div>

                        <div
                            ref={cropAreaRef}
                            className="relative mt-4 aspect-[2/3] w-full overflow-hidden rounded-[24px] border border-white/10 bg-black/40 cursor-move select-none"
                            onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
                            onMouseMove={(e) => moveDrag(e.clientX, e.clientY, e)}
                            onMouseUp={stopDrag}
                            onMouseLeave={stopDrag}
                            onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
                            onTouchMove={(e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY, e)}
                            onTouchEnd={stopDrag}
                        >
                            <img
                                ref={modalImgRef}
                                src={selectedImgSrc}
                                alt="Crop preview"
                                className="absolute origin-top-left max-w-none pointer-events-none"
                                style={{
                                    transform: `translate(${imagePos.x}px, ${imagePos.y}px) scale(${zoom})`,
                                    width: baseRenderSize.width ? `${baseRenderSize.width}px` : 'auto',
                                    height: baseRenderSize.height ? `${baseRenderSize.height}px` : 'auto'
                                }}
                                onLoad={handleImageLoad}
                            />
                        </div>

                        <div className="mt-5 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold uppercase text-white/40">Zoom</span>
                                <input
                                    type="range"
                                    min="1"
                                    max="3"
                                    step="0.01"
                                    value={zoom}
                                    onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                                    className="h-1 flex-1 accent-[#c1cf98] bg-white/10 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <button
                                onClick={handleSaveCrop}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c1cf98] py-3.5 font-bold text-black transition-all hover:bg-[#d4dfb2]"
                            >
                                <FiCheck size={18} />
                                Save & Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .dashed-border { border-style: dashed; }
                @keyframes characterIdle {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-3px) rotate(-0.6deg); }
                    50% { transform: translateY(-6px) rotate(0deg); }
                    75% { transform: translateY(-3px) rotate(0.6deg); }
                }
                @keyframes characterBreath {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.028); }
                }
                @keyframes auraPulse {
                    0%, 100% { transform: scale(0.98); opacity: 0.34; }
                    50% { transform: scale(1.06); opacity: 0.78; }
                }
                @keyframes levelBurst {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-2px) scale(1.04); }
                }
                @keyframes pointsPop {
                    0% { transform: translateY(0) scale(0.96); opacity: 0.72; }
                    38% { transform: translateY(-7px) scale(1.04); opacity: 1; }
                    100% { transform: translateY(0) scale(0.96); opacity: 0.82; }
                }
                @keyframes sparkDrift {
                    0%, 100% { transform: translate3d(0, 0, 0) scale(0.7); opacity: 0.18; }
                    45% { transform: translate3d(4px, -10px, 0) scale(1); opacity: 0.9; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
                .profile-character-stage {
                    animation: characterIdle 4.8s ease-in-out infinite;
                    will-change: transform;
                }
                .profile-character-breath {
                    animation: characterBreath 3.2s ease-in-out infinite;
                    will-change: transform;
                }
                .profile-aura {
                    animation: auraPulse 2.8s ease-in-out infinite;
                    will-change: transform, opacity;
                }
                .profile-aura-delayed { animation-delay: 0.9s; }
                .profile-level-burst { animation: levelBurst 1.8s ease-in-out infinite; }
                .profile-points-pop {
                    animation: pointsPop 2.6s ease-in-out infinite;
                    will-change: transform, opacity;
                }
                .profile-spark {
                    position: absolute;
                    height: 7px;
                    width: 7px;
                    border-radius: 999px;
                    background: #c1cf98;
                    box-shadow: 0 0 16px rgba(193, 207, 152, 0.85);
                    animation: sparkDrift 3.2s ease-in-out infinite;
                    will-change: transform, opacity;
                }
                .profile-spark-one { left: 18px; top: 28px; animation-delay: 0.2s; }
                .profile-spark-two { right: 22px; bottom: 34px; animation-delay: 1.1s; }
                .profile-spark-three { right: 36px; top: 24px; animation-delay: 1.8s; }
                @media (min-width: 768px) {
                    .profile-character:hover .profile-character-stage {
                        animation-duration: 2.7s;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProfileCharacter;