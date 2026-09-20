/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f6fb',
          100: '#e7ebf6',
          500: '#2b4fa3',
          600: '#213e82',
          700: '#1a3168',
          900: '#0f1d3f',
        },
        accent: {
          500: '#d99a2b',
          600: '#b87f1c',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'ui-serif', 'serif'],
      },
    },
  },
  plugins: [],
};
