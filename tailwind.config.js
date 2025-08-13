/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  safelist: ['shadow-neo-inner'],
  theme: {
    extend: {
      fontFamily: {
        Unbounded: ['Unbounded', 'sans-serif'],
        bebas: ['Bebas Neue', 'cursive'],
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
        kalam: ['Kalam', 'cursive'],
        copernicus: ['Copernicus Book Regular', 'Copernicus Book Regular Placeholder', 'sans-serif'],
      },
      boxShadow: {
        'neo-inner': 'inset 6px 6px 12px #084d49, inset -6px -6px 12px #0c877b',
      },
    },
  },
  plugins: [],
};
