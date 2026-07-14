/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FBBF24', // Premium Gold
          dark: '#F59E0B', 
        },
        background: {
          DEFAULT: 'var(--color-bg)',
          paper: 'var(--color-bg-paper)',
        },
        themeBg: {
          DEFAULT: 'var(--color-bg)',
          paper: 'var(--color-bg-paper)',
        },
        themeText: {
          DEFAULT: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        },
        themeBorder: 'var(--color-border)',
      }
    },
  },
  plugins: [],
}
