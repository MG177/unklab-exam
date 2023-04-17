/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter'],
        DM: ['DM Sans'],
        Jose: ['Josefin Sans'],
        montserrat: ['Montserrat'],
        Nunito: ['Nunito'],
        Roboto: ['Roboto']
      },
      colors: {
        black: '#37474F',
        white: '#FAFAFA',
        whitePlus: '#FFFFFF',
        accent1: '#B55FFE',
        accent2: '#FF6593',
        taccent1: '#BA69FF99',
        gray: '#98A0A4'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
