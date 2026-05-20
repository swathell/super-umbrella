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
        ink: "#121212",
        sand: "#f3efe7",
        mist: "#d9e4ef",
        slate: "#4d5d73",
        accent: "#ca6b3d",
        night: "#0d1824",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      boxShadow: {
        soft: "0 18px 60px rgba(13, 24, 36, 0.12)",
      },
      backgroundImage: {
        mesh: "linear-gradient(135deg, rgba(243,239,231,0.88), rgba(217,228,239,0.74) 45%, rgba(202,107,61,0.12))",
      },
    },
  },
  plugins: [],
};

export default config;
