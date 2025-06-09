// tailwind.config.js
export const content = [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
    extend: {
        keyframes: {
            marquee: {
                '0%': { transform: 'translateX(100%)' },
                '100%': { transform: 'translateX(-100%)' },
            },
        },
        animation: {
            marquee: 'marquee 15s linear infinite',
        },
    },
};
export const plugins = [];