import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        sand: "#f3efe7",
        mist: "#d8e1ec",
        slate: "#5d6d83",
        accent: "#ca6b3d",
        night: "#0e1825",
        line: "rgba(17, 17, 17, 0.08)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      boxShadow: {
        soft: "0 24px 80px rgba(14, 24, 37, 0.14)",
      },
      backgroundImage: {
        mesh: "linear-gradient(135deg, rgba(243,239,231,0.92), rgba(216,225,236,0.72) 45%, rgba(202,107,61,0.16))",
      },
      animation: {
        rise: "rise 0.8s ease-out both",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
