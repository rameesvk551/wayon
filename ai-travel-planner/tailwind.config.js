/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#00C9A7",
                    light: "#5EEAD4",
                    dark: "#0D9488",
                    subtle: "#CCFBF1",
                },
                secondary: {
                    DEFAULT: "#FF6B6B",
                    light: "#FCA5A5",
                    dark: "#DC2626",
                },
                accent: {
                    DEFAULT: "#7C3AED",
                    light: "#A78BFA",
                    dark: "#5B21B6",
                },
                background: {
                    DEFAULT: "#F8FAFC",
                    secondary: "#F1F5F9",
                    tertiary: "#E2E8F0",
                },
                text: {
                    primary: "#1E293B",
                    secondary: "#475569",
                    muted: "#94A3B8",
                    light: "#CBD5E1",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                heading: ["Poppins", "sans-serif"],
            },
        },
    },
    plugins: [],
};
