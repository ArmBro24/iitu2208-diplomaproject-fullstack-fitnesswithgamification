/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                // Добавляем поддержку шрифта Rubik
                rubik: ['Rubik', 'sans-serif'],
            },
            animation: {
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