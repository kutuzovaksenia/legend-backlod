/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        accent: '#FFDB4D',
        'accent-hover': '#F5CC00',
        danger: '#FF385C',
        muted: '#B0B0B0',
      },
    },
  },
  plugins: [],
}

