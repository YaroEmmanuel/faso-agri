import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        helvetica: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        primary: '#006B3F',
        secondary: '#86D52B',
        tertiary: '#EAF3DE',
      },
    },
  },
  plugins: [],
} satisfies Config
