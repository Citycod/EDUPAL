/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        noto: ['"Noto Sans"', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      colors: {
        // Primary color from HTML design
        primary: "#13ec6a",

        // Background colors from HTML design
        'background-light': "#f6f8f7",
        'background-dark': "#102217",

        // Additional colors for forms
        'border-accent': "#234832",
        'input-bg': "#1c2720",

        // Legacy support (maps to new palette)
        brand: {
          DEFAULT: "#13ec6a",
          light: "#3ef082",
          dark: "#102217",
        },
        secondary: {
          DEFAULT: "#234832",
          light: "#2d5a3f",
          dark: "#1a3626",
        },
        neutral: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
    },
  },
  plugins: [],
};
