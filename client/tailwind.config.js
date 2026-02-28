/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        primaryDark: "#1e40af",
        secondary: "#f3f4f6",
        danger: "#dc2626",
        success: "#16a34a",
      },
    },
  },
  plugins: [],
}