/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        noto: ['"Noto Sans"', 'sans-serif'],
      },
      colors: {
        // EduPal Logo Color Palette
        primary: "#10d876", // Bright cyan-green from logo text
        secondary: "#f2f2f2",
        brand: {
          DEFAULT: "#10d876", // Bright cyan-green
          light: "#3de68f", // Lighter shade
          dark: "#0ba95f", // Darker shade
          forest: "#1a4d3a", // Dark green background from logo
          cream: "#f5f5f0", // Cream/white from logo
        },
        edupal: {
          green: {
            50: "#e8faf1",
            100: "#c4f3dc",
            200: "#9eecc6",
            300: "#77e5b0",
            400: "#51de9a",
            500: "#10d876", // Main bright green
            600: "#0ba95f",
            700: "#087a48",
            800: "#054b31",
            900: "#031c1a",
          },
          forest: {
            50: "#e6f0ec",
            100: "#b8d4c6",
            200: "#8ab8a0",
            300: "#5c9c7a",
            400: "#2e8054",
            500: "#1a4d3a", // Main dark green
            600: "#153e2e",
            700: "#102f23",
            800: "#0b2017",
            900: "#06110c",
          },
        },
      },
    },
  },
  plugins: [],
}
