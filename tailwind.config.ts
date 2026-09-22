import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sci: {
          bg: "#050510",
          deep: "#03030a",
          surface: "#101823",
          card: "rgba(16, 24, 35, 0.72)",
          cyan: "#00FFFF",
          purple: "#7B61FF",
          magenta: "#FF00FF",
        },
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        exo: ["Exo 2", "sans-serif"],
        mono: ["Share Tech Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
