import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'lg': '1040px',
        'mid': '1440px',
      },
      fontFamily: {
        rockwell: ["Rockwell", "serif"],
        "space-grotesk": ["SpaceGrotesk", "sans-serif"],
        rockybilly: ["Rockybilly", "cursive"],
        "rustic-roadway": ["RusticRoadway", "cursive"],
        angelos: ["Angelos", "cursive"],
        awesome: ["Awesome", "cursive"],
      },
      colors: {
        // Primary Brand Colors
        "sena-blue": "#3b82f6",
        "sena-orange": "#f59e0b",
        "sena-cream": "#FAF9F5",
        "sena-light-blue": "#EEF2FF",
        
        // Supporting Colors
        "sena-text-primary": "#000000",
        "sena-text-secondary": "rgba(0, 0, 0, 0.7)",
        "sena-text-muted": "#6B7280",
        "sena-white": "#FFFFFF",
        
        // Interactive States
        "sena-blue-hover": "#2563eb",
        "sena-orange-hover": "#d97706",
      },
    },
  },
  plugins: [],
};
export default config;
