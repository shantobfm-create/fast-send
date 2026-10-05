/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#25CC71',
          'primary-dark': '#1EA85D',
          'primary-light': '#E8F8F0',
          secondary: '#2980B9',
          'secondary-dark': '#1F6391',
          slate: '#2C3E50',
          muted: '#BDBDBD',
          50: '#E8F8F0',
          100: '#C7EED8',
          500: '#25CC71',
          600: '#1EA85D',
          700: '#178449',
          800: '#2980B9',
          900: '#1C3144',
          dark: '#1C3144'
        }
      },
      fontFamily: {
        sans: ['Hind Siliguri', 'Segoe UI', 'Roboto', 'sans-serif'],
        bengali: ['Hind Siliguri', 'Noto Sans Bengali', 'sans-serif']
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
      }
    },
  },
  plugins: [],
}
