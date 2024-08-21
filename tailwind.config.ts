import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: { max: "350px" },
      s: "470px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "main-banner": "url('../../public/main-banner.jpg')",
      },
      backgroundPosition: {
        "bottom-1": "center bottom -5rem",
      },
      fontSize: {
        h1: ["60px", { lineHeight: "1.2" }],
        h2: ["48px", { lineHeight: "1.3" }],
        h3: ["36px", { lineHeight: "1.4" }],
        h4: ["24px", { lineHeight: "1.5" }],
        h5: ["20px", { lineHeight: "1.6" }],
        h6: ["16px", { lineHeight: "1.7" }],
      },
      padding: {
        "c-padding": "0 1.5rem 0 1.5rem",
      },
      margin: {
        "74": "74px",
      },
      colors: {
        "main-color": "#000e76",
        "border-color": "#e5e7eb",
      },
      top: {
        "-7": "-7px",
        "-5": "-5px",
      },
      zIndex: {
        "1": "1",
        "2": "2",
      },
    },
  },
  plugins: [],
};
export default config;
