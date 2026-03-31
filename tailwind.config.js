/** @type {import('tailwindcss').Config} */

function withOpacity(variable) {
  return ({ opacityValue }) =>
    opacityValue !== undefined
      ? `rgba(var(${variable}), ${opacityValue})`
      : `rgb(var(${variable}))`
}

module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  withOpacity('--gold-50'),
          100: withOpacity('--gold-100'),
          200: withOpacity('--gold-200'),
          300: withOpacity('--gold-300'),
          400: withOpacity('--gold-400'),
          500: withOpacity('--gold-500'),
          600: withOpacity('--gold-600'),
          700: withOpacity('--gold-700'),
          800: withOpacity('--gold-800'),
          900: withOpacity('--gold-900'),
        },
        obsidian: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['var(--font-body, var(--font-inter))', 'system-ui', 'sans-serif'],
        serif: ['var(--font-display, var(--font-cormorant))', 'Georgia', 'serif'],
        display: ['var(--font-display, var(--font-cormorant))', 'Georgia', 'serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'luxury-grain': "url('/images/grain.png')",
      },
      boxShadow: {
        luxury: '0 4px 40px rgba(0,0,0,0.08)',
        'luxury-dark': '0 4px 40px rgba(0,0,0,0.4)',
        'gold-glow': '0 0 30px rgba(var(--gold-500), 0.2)',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}
