import type { Config } from 'tailwindcss';

/**
 * Design system « Galerie Marrakech ».
 * `majorelle` est l'accent unique : détails fins seulement, jamais en fond de section.
 */
const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '2.5rem'
      },
      screens: {
        '2xl': '1360px'
      }
    },
    extend: {
      colors: {
        chaux: '#F8F6F0',
        blanc: '#FFFFFF',
        encre: '#17170F',
        majorelle: '#2B3FA8',
        pierre: '#8A8577',
        // Tokens sémantiques shadcn/ui, mappés sur la palette via CSS variables
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        }
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-archivo)', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        eyebrow: '0.12em'
      },
      transitionDuration: {
        DEFAULT: '200ms'
      },
      transitionTimingFunction: {
        DEFAULT: 'ease-out'
      },
      borderRadius: {
        sm: '2px'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
