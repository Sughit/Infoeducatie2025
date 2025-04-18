/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'highlight': '#4EA5D9',
        'dark-blue': '#122C34',
        'light-blue': '#224870',
        blue: '#2A4494',
      },
    },
  },
  plugins: [],
}