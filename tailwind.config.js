/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          navy: '#111827',
          indigo: '#6366F1',
          violet: '#8B5CF6',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          text: '#0F172A',
          muted: '#64748B',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'premium': '0 10px 30px -10px rgba(99, 102, 241, 0.1), 0 4px 6px -2px rgba(17, 24, 39, 0.05)',
        'card': '0 4px 20px -2px rgba(17, 24, 39, 0.06)',
        'card-hover': '0 14px 30px -4px rgba(99, 102, 241, 0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15), transparent 70%)',
      }
    },
  },
  plugins: [],
}
