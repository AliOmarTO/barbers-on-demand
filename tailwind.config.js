/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    'app/index.tsx',
    './app/**/*.{js,jsx,ts,tsx}',
    './App.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#a5b4fc',
          DEFAULT: '#cc001e', // brand red
          dark: '#4338ca',
        },
      },
    },
  },
  plugins: [],
};
