/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        carmine: '#931621',
        'dark-blue': '#28464B',
        'light-blue': '#326771',
        blue: '#2C8C99',
      },
    },
  },
  plugins: [],
}