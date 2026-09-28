/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080808',
        graphite: '#1b1b1a',
        ivory: '#ebe6da',
        ash: '#8a877f',
      },
      fontFamily: {
        display: ['"Big Shoulders Display Variable"', 'Impact', 'sans-serif'],
        sans: ['"Instrument Sans Variable"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
