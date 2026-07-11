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
        brand: {
          black: "#0A0A0A",
          "black-light": "#161616",
          gold: "#C6A15B",
          "gold-dark": "#9C7A35",
          "gold-light": "#D9C08F",
          ivory: "#F6F0E4",
          "ivory-dark": "#E7DEC9",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #C6A15B 0%, #9C7A35 100%)",
        "brand-gradient-dark":
          "linear-gradient(135deg, #9C7A35 0%, #6E5423 100%)",
      },
      boxShadow: {
        "brand-glow": "0 8px 32px rgba(156, 122, 53, 0.25)",
        "card-hover": "0 20px 60px rgba(0, 0, 0, 0.10)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        shimmer: "shimmer 2s infinite",
        marquee: "marquee 32s linear infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;