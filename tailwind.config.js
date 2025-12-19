/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './site/**/*.{md,jinja}',
    './assets/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
