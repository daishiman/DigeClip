/** @type {import('tailwindcss').Config} */
import { animate } from 'tailwindcss-animate';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D7DFC',
          50: '#EDF5FF',
          100: '#DEE9FF',
          200: '#BCCFFF',
          300: '#94B2FF',
          400: '#6B94FE',
          500: '#0D7DFC',
          600: '#0057C5',
          700: '#004092',
          800: '#00285F',
          900: '#00122C',
        },
        secondary: {
          DEFAULT: '#8347FF',
          50: '#F5F0FF',
          100: '#EAE0FF',
          200: '#D1BFFF',
          300: '#B79EFF',
          400: '#9D7DFF',
          500: '#8347FF',
          600: '#6620FF',
          700: '#4C00EC',
          800: '#3900B4',
          900: '#26007C',
        },
      },
    },
  },
  plugins: [animate],
};
