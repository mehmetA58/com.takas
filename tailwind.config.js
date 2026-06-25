/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange:  '#E8622A',
          dark:    '#1C1917',
          light:   '#FAF8F5',
          surface: '#FFFFFF',
          gold:    '#F59E0B',
          muted:   '#78716C',
          sakla:   '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(28,25,23,0.06), 0 1px 2px rgba(28,25,23,0.04)',
        'card-hover': '0 12px 32px rgba(28,25,23,0.12), 0 4px 8px rgba(28,25,23,0.06)',
        glass: '0 4px 24px rgba(28,25,23,0.08)',
      },
    },
  },
  plugins: [],
}
