/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(214, 32%, 91%)",
        input: "hsl(214, 32%, 91%)",
        ring: "hsl(222, 84%, 4%)",
        background: "hsl(0, 0%, 100%)",
        foreground: "hsl(222, 84%, 4%)",
      },
    },
  },
  plugins: [],
}