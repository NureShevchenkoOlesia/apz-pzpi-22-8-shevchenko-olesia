// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        proza: ['"Proza Libre"', 'sans-serif'],
        arial: ['Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
