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
        "brand-navy": "#0A1628",
        "brand-gold": "#D4A843",
        "brand-green": "#1A6B3A",
        "gray-light": "#F5F5F5",
        "gray-card": "#EFEFEF",
        "gray-muted": "#6B7280",
      },
      fontFamily: {
        heading: ["var(--font-manrope)", "system-ui", "sans-serif"],
        body: ["var(--font-public-sans)", "system-ui", "sans-serif"],
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
