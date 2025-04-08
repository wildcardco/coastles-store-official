import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  content: ['./components/**/*.{js,vue,ts}', './layouts/**/*.vue', './pages/**/*.vue', './plugins/**/*.{js,ts}', './nuxt.config.{js,ts}', './app.vue'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        primary: {
          light: '#444444',   // coastles-600
          DEFAULT: '#222222', // coastles-800
          dark: '#111111',    // coastles-900
        },
        'coastles': {
          50: '#f7f7f7',   // Lightest gray
          100: '#e6e6e6',  // Very light gray
          200: '#d4d4d4',  // Light gray
          300: '#b0b0b0',  // Medium light gray
          400: '#888888',  // Medium gray
          500: '#666666',  // Gray
          600: '#444444',  // Medium dark gray
          700: '#333333',  // Dark gray
          800: '#222222',  // Very dark gray
          900: '#111111',  // Almost black
          950: '#000000',  // Pure black
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'], // Clean, modern font for body text
        heading: ['Georgia', 'serif'], // Georgia for headings
      },
      aspectRatio: {
        'w-1': '1',
        'h-1': '1',
        '9/8': '1 / 1.125',
      },
      screens: {
        '2xl': '1400px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
