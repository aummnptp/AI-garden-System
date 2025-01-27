/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(-20px)' }, // แค่เลื่อนในแนว Y
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-out': {
          '0%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(-20px)' },
        },
      },
      
      animation: {
        'fade-in-out': 'fade-in 0.5s ease-out, fade-out 0.5s ease-out 4s',
      },
      
    },
    fontFamily:{
     sans:["Kanit",]
    }
  },
  plugins: [
    typography()
  ],
}

