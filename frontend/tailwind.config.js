/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    DEFAULT: '#0f172a',
                    lighter: '#1e293b',
                    lightest: '#334155',
                },
                primary: {
                    DEFAULT: '#3b82f6',
                    glow: '#60a5fa',
                },
                accent: {
                    purple: '#8b5cf6',
                    pink: '#ec4899',
                    cyan: '#06b6d4',
                }
            },
            backgroundImage: {
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
