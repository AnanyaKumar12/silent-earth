/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: {
          950: "#0a0e12",
          900: "#0f1419",
          800: "#161c24",
          700: "#1f2731",
          600: "#2a3441",
        },
        accent: {
          500: "#ef4444",
          600: "#dc2626",
          400: "#f87171",
        },
        signal: {
          500: "#22c55e",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(239,68,68,0.25)",
      },
    },
  },
  plugins: [],
};
