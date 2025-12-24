/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./site/**/*.{md,jinja}", "./assets/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Merriweather", "Georgia", "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
