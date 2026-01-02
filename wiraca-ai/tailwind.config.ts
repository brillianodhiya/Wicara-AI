import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        "primary-blue": "#0474C4",    // Vibrant Blue - Primary actions, CTAs
        "primary-slate": "#5379AE",   // Slate Blue - Secondary elements
        "primary-teal": "#2C444C",    // Dark Teal - Backgrounds, cards
        
        // Accent Colors
        "accent-light": "#A8C4EC",    // Light Blue - Highlights, hover states
        "accent-deep": "#06457F",     // Deep Blue - Active states, links
        "accent-dark": "#262B40",     // Navy - Text, borders
        
        // Mapping to Tailwind's color system
        blue: {
          DEFAULT: "#0474C4",
          50: "#F0F7FD",
          100: "#D8EBFA",
          200: "#A8C4EC",
          300: "#5379AE",
          400: "#0474C4",
          500: "#06457F",
          600: "#053A6B",
          700: "#042F57",
          800: "#032543",
          900: "#021A2F",
          950: "#01101D",
        },
        slate: {
          DEFAULT: "#5379AE",
          50: "#F5F7FA",
          100: "#E9EFF5",
          200: "#D3DFEB",
          300: "#A8C4EC",
          400: "#5379AE",
          500: "#446389",
          600: "#3A5475",
          700: "#304560",
          800: "#26364C",
          900: "#1C2838",
          950: "#262B40",
        },
        teal: {
          DEFAULT: "#2C444C",
          50: "#F2F5F5",
          100: "#E5EAEB",
          200: "#CBD5D8",
          300: "#A2B5BA",
          400: "#5A7A85",
          500: "#2C444C",
          600: "#253A40",
          700: "#1E2F34",
          800: "#172428",
          900: "#10191C",
          950: "#0A0F11",
        },
      },
    },
  },
  plugins: [],
};

export default config;
