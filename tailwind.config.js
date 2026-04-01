/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          navy: "#0A0A0F",
          gold: "#C9933A",
          "gold-lt": "#E2B659",
          rose: "#8B2252",
          teal: "#0F7A6E",
          offwhite: "#F5F0E8",
        },
        secondary: "#1A1A24",
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
      backgroundImage: {
        'gold-gradient': "linear-gradient(135deg, #C9933A 0%, #E2B659 50%, #C9933A 100%)",
      },
    },
  },
  plugins: [],
}
