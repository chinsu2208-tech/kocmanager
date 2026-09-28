/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b0b",
        surface: "#fcfcfb",
        page: "#f9f9f7",
        accent: "#2a78d6",
        muted: "#898781",
        line: "#e1e0d9",
      },
    },
  },
  plugins: [],
};
