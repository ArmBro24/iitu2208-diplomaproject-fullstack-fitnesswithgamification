export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            animation: {
                // Изменили на 7s
                'spin-slow': 'spin-slow 7s linear infinite',
            },
            keyframes: {
                'spin-slow': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                }
            },
        },
    },
    plugins: [],
}