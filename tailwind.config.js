/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#0F1115', // Dark slate background
        surface: '#181B21', // Slightly lighter card bg
        surfaceHighlight: '#232730', 
        primary: '#3B82F6', // Modern Blue
        secondary: '#64748B', // Slate
        accent: '#EF4444', // Red
        text: {
          DEFAULT: '#F8FAFC', // Slate 50
          muted: '#94A3B8', // Slate 400
        },
        system: {
          success: '#10B981',
          warning: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        system: ['Inter', 'sans-serif'], // Reverting to Inter for clean look
      },
      boxShadow: {
        "glow-blue": "0 0 10px rgba(0, 243, 255, 0.5)",
        "glow-red": "0 0 10px rgba(255, 0, 60, 0.5)",
      },
    },
  },
  plugins: [],
};
