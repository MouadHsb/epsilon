/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3C6C3F',
        'primary-dark': '#2A462B',
        'background': '#F4F7F4',
      },
    },
  },
  plugins: [],
}