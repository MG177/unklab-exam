/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './contexts/**/*.{js,jsx}',
    './legacy/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
        DM: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
        Jose: ['var(--font-josefin)', 'Josefin Sans', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
        Nunito: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
        Roboto: ['var(--font-roboto)', 'Roboto', 'sans-serif'],
      },
      colors: {
        black: '#37474F',
        white: '#FAFAFA',
        whitePlus: '#FFFFFF',
        accent1: '#B55FFE',
        accent2: '#FF6593',
        taccent1: '#DCB5FF',
        grayPlus: '#D9D9D9',
        gray: '#98A0A4',
      },
      maxWidth: {
        xxs: '16rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
  important: true,
};
