/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090d",
        pujo: {
          bg: "#08090d",
          charcoal: "#0e1118",
          dark: "#0a0c12",
          surface: "rgba(255, 255, 255, 0.03)",
          surfaceHover: "rgba(255, 255, 255, 0.06)",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(255, 255, 255, 0.18)",
          gold: "#d4af37",
          goldLight: "#f4e5a9",
          goldMuted: "rgba(212, 175, 55, 0.2)",
          crimson: "#8b1e2a",
          crimsonMuted: "rgba(139, 30, 42, 0.25)",
          cream: "#f7f5ed",
          mutedText: "#949ba4",
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Cinzel', 'Playfair Display', 'serif'],
      },
      boxShadow: {
        'glass-sm': '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px rgba(255, 255, 255, 0.12)',
        'glass-lg': '0 16px 48px -8px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
        'glass-glow': '0 0 40px -10px rgba(212, 175, 55, 0.18), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
        'glass-crimson': '0 0 40px -10px rgba(139, 30, 42, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '40px',
        '3xl': '64px',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        glowPulse: {
          '0%': { opacity: '0.4', transform: 'scale(0.98)' },
          '100%': { opacity: '0.85', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
