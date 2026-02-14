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
        primary: {
          light: '#8b7fc7',   // Lighter purple
          DEFAULT: '#6b5fb0', // Brighter purple (lighter than #3f4771)
          dark: '#4a3f8a',    // Medium purple
        },
        secondary: {
          light: '#ff9ec4',   // Lighter pink
          DEFAULT: '#ff6ba9', // Brighter pink (lighter than #ff4081)
          dark: '#e94f8f',    // Medium pink
        },
      },
    },
  },
  plugins: [],
}
