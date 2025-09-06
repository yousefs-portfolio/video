/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Educational Color Psychology
        background: {
          cream: '#F5F1EB',
          dark: '#1a1a1a',
        },
        primary: {
          DEFAULT: '#1E88E5',
          light: '#6ab7ff',
          dark: '#005cb2',
        },
        success: {
          DEFAULT: '#43A047',
          light: '#76d275',
          dark: '#00701a',
        },
        accent: {
          cyber: '#39FF14',
          gold: '#FFD700',
          flame: '#FF6B35',
        },
        learning: {
          focus: '#4A90E2',
          progress: '#10B981',
          achievement: '#FFD700',
          streak: '#FF6B35',
        },
      },
      fontFamily: {
        sans: ['Inter Variable', 'system-ui', 'sans-serif'],
        display: ['Inter Variable', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      animation: {
        'progress-ring': 'progress-ring 1s ease-in-out',
        'achievement-bounce': 'achievement-bounce 1s ease-in-out',
        'streak-flame': 'streak-flame 2s ease-in-out infinite',
        confetti: 'confetti 3s ease-in-out',
        'level-up': 'level-up 0.5s ease-in-out',
        shimmer: 'shimmer 2s linear infinite',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'slide-in': 'slide-in 0.3s ease-in-out',
      },
      keyframes: {
        'progress-ring': {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        'achievement-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'streak-flame': {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.2)' },
        },
        confetti: {
          '0%': { transform: 'translateY(-100%) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        'level-up': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        learning: '0 4px 6px -1px rgba(30, 136, 229, 0.1), 0 2px 4px -1px rgba(30, 136, 229, 0.06)',
        achievement:
          '0 10px 25px -5px rgba(255, 215, 0, 0.3), 0 4px 10px -5px rgba(255, 215, 0, 0.2)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      scale: {
        102: '1.02',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};