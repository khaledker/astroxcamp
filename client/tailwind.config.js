/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        space: 'rgb(var(--c-space) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        elevated: 'rgb(var(--c-elevated) / <alpha-value>)',
        star: 'rgb(var(--c-star) / <alpha-value>)',
        steel: 'rgb(var(--c-steel) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        yellow: 'rgb(var(--c-yellow) / <alpha-value>)',
        orange: 'rgb(var(--c-orange) / <alpha-value>)',
        blue: 'rgb(var(--c-blue) / <alpha-value>)',
        danger: 'rgb(var(--c-danger) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        'line-strong': 'rgb(var(--c-line-strong) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem', letterSpacing: '0.12em' }],
        label: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.14em' }],
        'label-lg': ['0.8125rem', { lineHeight: '1.125rem', letterSpacing: '0.16em' }],
        body: ['1rem', { lineHeight: '1.6' }],
        'body-lg': ['1.125rem', { lineHeight: '1.65' }],
        'body-xl': ['1.25rem', { lineHeight: '1.6' }],
        'display-sm': ['1.75rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-card': ['2rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'display-md': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'display-lg': ['clamp(2rem, 3.4vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['clamp(2.75rem, 5.2vw, 4.5rem)', { lineHeight: '1.04', letterSpacing: '-0.025em' }],
        'display-register': ['clamp(2.5rem, 4.2vw, 3.5rem)', { lineHeight: '1.06', letterSpacing: '-0.02em' }],
        'display-2xl': ['clamp(5rem, 16vw, 12rem)', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
      },
      maxWidth: {
        site: '1440px',
        form: '38.75rem',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
      boxShadow: {
        'glow-yellow': '0 0 0 1px rgb(var(--c-yellow) / 0.32), 0 10px 40px rgb(var(--c-yellow) / 0.12)',
        'glow-blue': '0 0 0 1px rgb(var(--c-blue) / 0.35), 0 10px 36px rgb(var(--c-blue) / 0.14)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'drift-a': {
          from: { backgroundPosition: '0 0, 0 0, 0 0' },
          to: { backgroundPosition: '220px 340px, -340px 220px, 520px 520px' },
        },
        'drift-b': {
          from: { backgroundPosition: '0 0, 0 0' },
          to: { backgroundPosition: '-280px 180px, 240px -320px' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 600ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'drift-a': 'drift-a 90s linear infinite',
        'drift-b': 'drift-b 130s linear infinite',
        'pulse-soft': 'pulse-soft 2.8s ease-in-out infinite',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
