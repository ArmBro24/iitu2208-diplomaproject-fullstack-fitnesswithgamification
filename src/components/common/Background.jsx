import React from 'react';

export const clientFrameGradient = `
    radial-gradient(circle at 18% 8%, rgba(173, 93, 70, 0.62), transparent 26%),
    radial-gradient(circle at 78% 16%, rgba(58, 63, 73, 0.72), transparent 30%),
    radial-gradient(circle at 20% 62%, rgba(69, 42, 102, 0.5), transparent 34%),
    radial-gradient(circle at 74% 76%, rgba(138, 124, 55, 0.48), transparent 26%),
    linear-gradient(180deg, #111312 0%, #1c1d1b 36%, #232621 64%, #151616 100%)
`;

export const noiseStyle = {
    backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")',
    backgroundSize: '520px',
};

const Background = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#111412] px-0 py-0 text-white md:px-6 md:py-8">
            <div className="mx-auto min-h-screen max-w-[1320px] overflow-hidden bg-[#161916] md:min-h-0 md:rounded-[38px] md:border md:border-white/10 md:shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                <div className="relative min-h-screen w-full overflow-hidden">
                    <div className="absolute inset-0 bg-[#151716]" />
                    <div className="absolute inset-0 opacity-95" style={{ background: clientFrameGradient }} />
                    <div className="absolute inset-0 z-[5] pointer-events-none opacity-45 mix-blend-soft-light" style={noiseStyle} />

                    <div className="relative z-10 w-full min-h-screen">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Background;
