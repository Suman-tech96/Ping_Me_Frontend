/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#f43f5e",
        accent: "#3b82f6",
      },
      backgroundImage: {
        'mesh': "radial-gradient(circle at 0% 0%, #c4b5fd 0%, transparent 40%), radial-gradient(circle at 100% 0%, #bae6fd 0%, transparent 40%), radial-gradient(circle at 100% 100%, #fbcfe8 0%, transparent 40%), radial-gradient(circle at 0% 100%, #ddd6fe 0%, transparent 40%)",
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out 1s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        }
      }
    },
  },
  plugins: [],
}

