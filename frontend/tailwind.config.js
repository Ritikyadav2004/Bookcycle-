/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#163D2A',
          50: '#E8F5EE',
          100: '#D1EBDD',
          200: '#A3D7BB',
          300: '#75C399',
          400: '#47AF77',
          500: '#237A57',
          600: '#1C6247',
          700: '#163D2A',
          800: '#102D1F',
          900: '#0A1D14',
        },
        emerald: {
          DEFAULT: '#237A57',
        },
        cream: {
          DEFAULT: '#F8F3E7',
          dark: '#F0E8D5',
        },
        warmWhite: {
          DEFAULT: '#FFFDF8',
        },
        amber: {
          DEFAULT: '#F4A340',
          light: '#F7BD6A',
          dark: '#E08C1F',
        },
        darkText: '#17201B',
        mutedText: '#67736B',
        error: '#DC4C4C',
        success: '#22A06B',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(22, 61, 42, 0.08)',
        'card-hover': '0 12px 32px rgba(22, 61, 42, 0.15)',
        'nav': '0 2px 16px rgba(22, 61, 42, 0.06)',
        'modal': '0 24px 64px rgba(22, 61, 42, 0.2)',
        'glass': '0 8px 32px rgba(22, 61, 42, 0.1)',
        'inner-glow': 'inset 0 2px 4px rgba(255, 253, 248, 0.1)',
      },
      backgroundImage: {
        'gradient-forest': 'linear-gradient(135deg, #163D2A 0%, #237A57 100%)',
        'gradient-cream': 'linear-gradient(180deg, #FFFDF8 0%, #F8F3E7 100%)',
        'gradient-amber': 'linear-gradient(135deg, #F4A340 0%, #E08C1F 100%)',
        'gradient-hero': 'linear-gradient(135deg, #163D2A 0%, #1C6247 50%, #237A57 100%)',
        'paper-texture': 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'page-turn': 'page-turn 0.8s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        'slide-down': {
          from: { transform: 'translateY(-10px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'scale-in': {
          from: { transform: 'scale(0.95)', opacity: 0 },
          to: { transform: 'scale(1)', opacity: 1 },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'page-turn': {
          '0%': { transform: 'perspective(1200px) rotateY(0deg)' },
          '100%': { transform: 'perspective(1200px) rotateY(-180deg)' },
        },
      },
      screens: {
        'xs': '475px',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
}
