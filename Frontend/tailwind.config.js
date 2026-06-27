/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F97316',
          'orange-dark': '#EA580C',
          light: '#FFF7ED',
          amber: '#FACC15',
        },
        surface: {
          primary: '#F8FAFC',
          secondary: '#FFFFFF',
          card: '#FFFFFF',
          elevated: '#FFFFFF',
        },
        divider: {
          DEFAULT: '#E2E8F0',
          subtle: 'rgba(226, 232, 240, 0.6)',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
          disabled: '#CBD5E1',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#EA580C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        site: '1440px',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        'glow-orange': '0 4px 24px rgba(249, 115, 22, 0.25)',
        'card': '0 2px 16px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 8px 32px rgba(249, 115, 22, 0.1)',
        'soft': '0 1px 12px rgba(15, 23, 42, 0.06)',
      },
      backgroundImage: {
        'gradient-cta': 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
        'gradient-promo': 'linear-gradient(135deg, #FB923C 0%, #EA580C 100%)',
        'gradient-hero': 'linear-gradient(180deg, #FFF7ED 0%, #FFFFFF 100%)',
        'gradient-category': 'linear-gradient(180deg, #FFFFFF 0%, #FFF7ED 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, #F97316 0%, #EA580C 100%)',
        'gradient-auth': 'linear-gradient(135deg, #FFF7ED 0%, #F8FAFC 50%, #FFFFFF 100%)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
