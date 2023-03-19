/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter"],
        DM: ["DM Sans"],
        Jose: ["Josefin Sans"],
        montserrat: ["Montserrat"],
        nunito: ["Nunito"],
        Roboto: ["Roboto"]
      },
      colors: {
        black: '#37474F',
        accent1: "#B55FFE",
        accent2: '#FF6593',
        taccent1: '#BA69FF99'
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
