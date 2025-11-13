/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        rubik: ['Rubik', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
      },
      colors: {
        // keep default Tailwind colors available; you can add brand colors here
      }
    }
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        pitstop: {
          'primary': '#06b6d4',
          'secondary': '#7c3aed',
          'accent': '#14b8a6',
          'neutral': '#111827',
          'base-100': '#0b1220',
          'info': '#3b82f6',
          'success': '#10b981',
          'warning': '#f59e0b',
          'error': '#ef4444',
        }
      }
    ]
  }
}
