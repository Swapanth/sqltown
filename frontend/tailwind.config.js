/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E67350',
        'primary-hover': '#d15d3f',
        'primary-light': 'rgba(230, 115, 80, 0.1)',
        terminal: '#000000',
        'terminal-border': '#3a3d42',
        'terminal-prompt': '#E67350',
        'sky-blue': '#a9c1ed',
        'sun-yellow': '#FDB813',
        'grass-green': '#7CB342',
        'building-brown': '#8D6E63',
        success: '#28C840',
        'success-light': 'rgba(40, 200, 64, 0.1)',
        error: '#FF5F57',
        'error-light': 'rgba(255, 95, 87, 0.1)',
        warning: '#FEBC2E',
        'warning-light': 'rgba(254, 188, 46, 0.1)',
        info: '#a9c1ed',
        'info-light': 'rgba(169, 193, 237, 0.1)',
      },
      fontFamily: {
        heading: ['Comfortaa'],
        body: ['Comfortaa'],
        code: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'building-rise': 'buildingRise 1s ease-out',
        'window-light': 'windowLight 2s ease-in-out infinite',
        'walk': 'walk 10s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        buildingRise: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        windowLight: {
          '0%, 100%': { backgroundColor: '#333' },
          '50%': { backgroundColor: '#FFD700' },
        },
        walk: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(800px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      boxShadow: {
        'terminal': '0 20px 60px rgba(0, 0, 0, 0.25)',
        'card-hover': '0 10px 30px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
