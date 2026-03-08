import React from 'react';

const Background = ({ children }) => {
    return (
        <div className="relative min-h-screen w-full bg-[#0a1211] overflow-hidden">

            {/* SVG ФИГУРЫ */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-full h-full filter blur-[40px] opacity-50">
                    <svg className="absolute top-[-45%] left-[-20%] w-[1000px] h-[1000px] fill-[#73369e]" viewBox="0 0 200 200">
                        <path d="M36.2,-59.3C41.7,-45.8,37.4,-28.3,42.6,-13.5C47.9,1.3,62.8,13.2,58.5,16.7C54.2,20.1,30.7,15,17.8,25.1C4.8,35.1,2.4,60.2,-7.3,70.2C-16.9,80.2,-33.8,75,-48.6,65.6C-63.4,56.2,-76.1,42.5,-78.6,27.3C-81.1,12.1,-73.5,-4.6,-58.9,-9.8C-44.4,-15,-23,-8.6,-12.1,-20.4C-1.1,-32.1,-0.5,-61.9,7.4,-72.1C15.4,-82.3,30.7,-72.9,36.2,-59.3Z" transform="translate(100 100) rotate(-90)"/>
                    </svg>
                    <svg className="absolute top-[20%] right-[7%] w-[1000px] h-[1000px] fill-[#bf5f47]" viewBox="0 0 200 200">
                        <path d="M18.6,-30.2C27.6,-19,40.8,-18.3,52.4,-10.5C63.9,-2.6,73.9,12.3,66.3,17.3C58.8,22.2,33.8,17.2,19.9,16.6C5.9,15.9,2.9,19.7,-2.9,23.6C-8.7,27.5,-17.3,31.6,-30.4,32C-43.6,32.4,-61.2,29,-69.3,19C-77.5,8.9,-76.3,-7.7,-66.8,-17C-57.3,-26.2,-39.5,-28.1,-27,-38.1C-14.5,-48.1,-7.2,-66.3,-1.2,-64.6C4.8,-62.9,9.6,-41.4,18.6,-30.2Z" transform="translate(100 100)"/>
                    </svg>
                    <svg className="absolute bottom-[25%] left-[45%] w-[950px] h-[950px] fill-[#a86a32]" viewBox="0 0 200 200">
                        <path d="M26.8,-46.4C27.8,-41.1,16.9,-21.9,17.9,-10.8C19,0.3,32,3.4,38.2,10.1C44.4,16.8,43.8,27.1,39.2,35.8C34.5,44.6,25.9,51.7,14.7,59.1C3.5,66.5,-10.2,74,-15.4,66.2C-20.6,58.4,-17.3,35.3,-26.6,23.6C-35.9,11.9,-57.8,11.7,-59.6,7.8C-61.3,3.9,-42.8,-3.6,-37.5,-17.9C-32.1,-32.1,-39.9,-53.1,-35.8,-57.1C-31.8,-61,-15.9,-47.9,-1.5,-45.6C12.9,-43.3,25.8,-51.8,26.8,-46.4Z" transform="translate(100 100) rotate(-80)"/>
                    </svg>
                </div>
            </div>

            {/* ШУМ */}
            <div className="absolute inset-0 z-[5] pointer-events-none opacity-60"
                 style={{
                     backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
                     backgroundSize: '600px',
                     filter: 'invert(100%) contrast(200%) brightness(100%)',
                     mixBlendMode: 'multiply',
                 }}>
            </div>

            {/* КОНТЕНТ СТРАНИЦЫ */}
            <div className="relative z-10 w-full min-h-screen">
                {children}
            </div>
        </div>
    );
};

export default Background;