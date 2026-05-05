/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        surface: {
          950: '#030712',
          900: '#0b1220',
          850: '#111c2e',
          800: '#152238',
        },
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(148,163,184,0.06) inset, 0 0 0 1px rgba(15,23,42,0.85)',
        card: '0 1px 0 0 rgba(148,163,184,0.04) inset, 0 12px 40px -12px rgba(0,0,0,0.45)',
      },
    },
  },
  plugins: [],
};
