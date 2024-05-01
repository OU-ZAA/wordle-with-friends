/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        present: "#b59f3b",
        absent: "#787c7e",
        correct: "#538d4e",
      },
    },
  },
  plugins: [],
};
