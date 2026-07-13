import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1220",
        paper: "#F7F8FA",
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#111827",
        },
        brand: {
          50: "#EFFAF4",
          100: "#D7F3E3",
          200: "#AFE7C8",
          300: "#7DD6A8",
          400: "#45BD85",
          500: "#1FA06A",
          600: "#158055",
          700: "#116646",
          800: "#0F5138",
          900: "#0C412E",
        },
        rise: "#1FA06A",
        fall: "#D64545",
        gold: "#C99A3E",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,18,32,0.04), 0 8px 24px -8px rgba(11,18,32,0.10)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
