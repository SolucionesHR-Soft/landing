/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14161C',       // grafito, fondo principal
        paper: '#ECE8DE',     // hueso/papel, fondo alterno
        line: 'rgba(236,232,222,0.16)',
        lineOnPaper: 'rgba(20,22,28,0.14)',
        brass: '#C08A2E',     // acento cobre/soldadura
        cyan: '#4FA8C9',      // acento traza de circuito
      },
      fontFamily: {
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
