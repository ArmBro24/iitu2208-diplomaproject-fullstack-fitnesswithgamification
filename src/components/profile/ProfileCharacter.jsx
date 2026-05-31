import React, { useRef } from 'react';
import { FiZap, FiCamera } from 'react-icons/fi';
import useStore from '../../store/useStore';

const ProfileCharacter = ({ alt, image, initials, level = 1, points = 0 }) => {
    const uploadAvatar = useStore((state) => state.uploadAvatar);
    const currentUser = useStore((state) => state.currentUser);
    const fileInputRef = useRef(null);

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            await uploadAvatar(file);
        }
    };

    const finalImageSrc = (currentUser?.avatarUrl && currentUser.avatarUrl.startsWith('http'))
        ? currentUser.avatarUrl
        : image;

    return (
        <div className="profile-character group flex flex-col items-center rounded-[24px] border border-white/10 bg-black/20 p-5 transition-all duration-300 hover:border-[#c1cf98]/35 hover:bg-black/25">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            <div
                onClick={handleAvatarClick}
                className="profile-character-stage relative flex h-36 w-36 items-center justify-center rounded-[34px] border border-[#c1cf98]/30 bg-[#c1cf98]/10 transition-transform duration-300 group-hover:-translate-y-1 md:h-44 md:w-44 cursor-pointer"
            >
                <div className="profile-aura absolute inset-[-10px] rounded-[42px] border border-[#c1cf98]/20" />
                <div className="profile-aura profile-aura-delayed absolute inset-[-4px] rounded-[38px] border border-[#c1cf98]/15" />

                <div className="profile-character-breath relative z-10 flex h-32 w-32 items-center justify-center overflow-hidden rounded-[30px] md:h-40 md:w-40 bg-black/30">
                    <img
                        src={finalImageSrc}
                        alt={alt}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.045]"
                        onError={(e) => {
                            if (e.target.src !== image) {
                                e.target.src = image;
                            }
                        }}
                    />

                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1">
                        <FiCamera size={18} className="text-[#c1cf98]" />
                        <span className="text-[9px] uppercase tracking-wider text-white/80 font-bold">Change</span>
                    </div>
                </div>

                <span className="profile-level-burst absolute -right-3 -top-3 inline-flex items-center gap-1 rounded-full border border-[#c1cf98]/35 bg-[#17191d] px-3 py-1 text-xs font-black text-[#eaf2cf] shadow-[0_0_22px_rgba(193,207,152,0.2)]">
                    <FiZap size={12} />
                    LV {level}
                </span>

                <span className="profile-points-pop absolute -bottom-3 rounded-full border border-[#c1cf98]/30 bg-[#c1cf98] px-3 py-1 text-xs font-black text-black">
                    +{points} XP
                </span>

                <span className="profile-spark profile-spark-one" />
                <span className="profile-spark profile-spark-two" />
                <span className="profile-spark profile-spark-three" />
            </div>

            <div className="mt-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-sm font-black text-[#c1cf98] transition-all duration-300 group-hover:bg-[#c1cf98]/10 group-hover:shadow-[0_0_20px_rgba(193,207,152,0.18)]">
                {initials}
            </div>

            <style>{`
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
                .profile-aura-delayed {
                    animation-delay: 0.9s;
                }
                .profile-level-burst {
                    animation: levelBurst 1.8s ease-in-out infinite;
                }
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
                .profile-character:hover .profile-character-stage {
                    animation-duration: 2.7s;
                }
            `}</style>
        </div>
    );
};

export default ProfileCharacter;