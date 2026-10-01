/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#f5f4ef',
          subtle: '#eae8e1',
        },
        ink: {
          DEFAULT: '#141518',
          secondary: '#5a5d66',
          tertiary: '#8b8f99',
        },
        line: {
          DEFAULT: 'rgba(20, 21, 24, 0.12)',
          lit: 'rgba(20, 21, 24, 0.35)',
        }
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}
