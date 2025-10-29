import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#edf8ff",
          100: "#d7edff",
          200: "#b6ddff",
          300: "#86c6ff",
          400: "#4ca5ff",
          500: "#1f8eff",
          600: "#0b6ff0",
          700: "#0758c7",
          800: "#094b9d",
          900: "#0d3e7c"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 20px 45px -20px rgba(9, 75, 157, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
