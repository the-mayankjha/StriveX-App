/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#0F1115', // Deeper Grey-Blue
        surface: '#12141C', // Lighter Grey-Blue for surfaces
        surfaceHighlight: '#1A1D26', 
        primary: '#3B82F6', // Original Blue
        secondary: '#64748B', 
        accent: '#EF4444', 
        text: {
          DEFAULT: '#E2E8F0', // Slightly softer white
          muted: '#64748B', 
        },
        system: {
          success: '#3B82F6', 
          warning: '#F59E0B',
        }
      },

      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        system: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        "glow-blue": "0 0 15px rgba(59, 130, 246, 0.4)",
        "glow-cyan": "0 0 20px rgba(59, 130, 246, 0.6)",
        "glow-red": "0 0 15px rgba(255, 0, 60, 0.4)",
      },

    },
  },
  plugins: [],
};
