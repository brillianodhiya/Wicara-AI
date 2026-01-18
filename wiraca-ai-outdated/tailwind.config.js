const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary Colors
                "primary-blue": "#0474C4", // Vibrant Blue
                "primary-slate": "#5379AE", // Slate Blue
                "primary-teal": "#2C444C", // Dark Teal

                // Accent Colors
                "accent-light": "#A8C4EC", // Light Blue
                "accent-deep": "#06457F", // Deep Blue
                "accent-dark": "#262B40", // Navy

                // Explicit mapping for HeroUI components if theme fails
                primary: {
                    DEFAULT: "#0474C4",
                    foreground: "#FFFFFF",
                }
            },
        },
    },
    darkMode: "class",
    plugins: [
        heroui({
            themes: {
                light: {
                    colors: {
                        // Core colors
                        background: "#FFFFFF",
                        foreground: "#262B40",

                        primary: {
                            DEFAULT: "#0474C4",
                            foreground: "#FFFFFF",
                            50: "#F0F7FD",
                            100: "#D8EBFA",
                            200: "#A8C4EC",
                            300: "#5379AE",
                            400: "#36619E",
                            500: "#0474C4",
                            600: "#06457F",
                            700: "#042F57",
                            800: "#2C444C",
                            900: "#021A2F",
                        },
                        secondary: {
                            DEFAULT: "#5379AE",
                            foreground: "#FFFFFF",
                        },
                        focus: "#0474C4",
                    },
                },
            },
            layout: {
                radius: {
                    small: "0.5rem",
                    medium: "0.75rem",
                    large: "1rem",
                }
            }
        }),
    ],
};
