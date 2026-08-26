/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        coin: {
          gold: 'var(--coin-gold)',
          dark: 'var(--coin-dark)',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 4px)',
        md: 'var(--radius)',
        lg: 'calc(var(--radius) + 4px)',
        xl: 'calc(var(--radius) + 8px)',
        '2xl': 'calc(var(--radius) + 16px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      fontSize: {
        'hero': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
        'hero-sm': ['2rem', { lineHeight: '1.1', fontWeight: '700' }],
      },
      fontVariantNumeric: {
        tabular: 'tabular-nums',
      },
      boxShadow: {
        'card': '0 4px 16px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.4)',
        'glow-primary': '0 0 20px rgba(245, 158, 11, 0.3)',
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.3)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};