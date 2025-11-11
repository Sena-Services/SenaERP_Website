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
        "waygent-blue": "#3b82f6",
        "waygent-orange": "#f59e0b",
        "waygent-cream": "#FAF9F5",
        "waygent-light-blue": "#EEF2FF",
        
        // Supporting Colors
        "waygent-text-primary": "#000000",
        "waygent-text-secondary": "rgba(0, 0, 0, 0.7)",
        "waygent-text-muted": "#6B7280",
        "waygent-white": "#FFFFFF",
        
        // Interactive States
        "waygent-blue-hover": "#2563eb",
        "waygent-orange-hover": "#d97706",
        
        // Legacy colors for backward compatibility (will be phased out)
        "sentra-apricot-jet": "#f59e0b", // Maps to waygent-orange
        "sentra-midnight-deck": "#000000", // Maps to waygent-text-primary
        "sentra-travertine": "#FAF9F5", // Maps to waygent-cream
        "sentra-dune-mist": "#FAF9F5", // Maps to waygent-cream
        "sentra-ocean-route": "#3b82f6", // Maps to waygent-blue
      },
    },
  },
  plugins: [],
};
export default config;
