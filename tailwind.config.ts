import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        gradientPrimary: "linear-gradient(135deg, #BE93C5 0%, #7BC6CC 100%)"
      },
      colors: {
        accent: "#A3A6C7",
        ink: {
          DEFAULT: "#111827",
          light: "#F9FAFB"
        }
      },
      fontFamily: {
        display: ["var(--font-bebas-neue)"],
        logo: ["var(--font-afacad)"],
        sans: ["var(--font-source-sans)"],
        headline: ["var(--font-bebas-neue)"]
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.7s ease forwards"
      }
    }
  },
  plugins: [animate]
};

export default config;
