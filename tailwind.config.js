/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#00a34a',
        'neon-yellow': '#FFCB00',
        'neon-blue': '#3b63ff',
      },
      fontFamily: {
        'futuristic': ['Orbitron', 'sans-serif'],
        'logo': ['Major Mono Display', 'monospace'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
