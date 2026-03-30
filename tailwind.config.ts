import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E3A8A",
          50: "#EBF0FA",
          100: "#D6E1F5",
          200: "#ADC3EB",
          300: "#85A5E1",
          400: "#5C87D7",
          500: "#1E3A8A",
          600: "#1A325F",
          700: "#152A4A",
          800: "#112235",
          900: "#0D1A20",
        },
        secondary: "#0F172A",
        accent: "#F59E0B",
        success: "#10B981",
        warning: "#EF4444",
        background: "#F8FAFC",
        card: "#FFFFFF",
        "text-primary": "#1E293B",
        "text-secondary": "#64748B",
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 6px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 8px 15px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
