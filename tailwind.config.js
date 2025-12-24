/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./scripts/build.cjs",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#00ff66',
        'neon-yellow': '#ffcc00',
        'neon-blue': '#0099ff',
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
