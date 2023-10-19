import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-main)"],
      },
      fontSize: {
        "2sm": [
          "0.8125rem",
          {
            lineHeight: "1.125rem",
          },
        ],
      },
      colors: {
        "main-green": "#409a88",
        "second-green": "#348e7c",
        "main-yellow": "rgb(238,238,34)",
        "gray-100": "rgb(235,235,235)",
        "gray-150": "rgb(243,243,243)",
        "gray-200": "#666",
        "gray-text": "#888888",
      },
      transitionDuration: {
        "350": "350ms",
        "400": "400ms",
        "550": "550ms",
      },
      scale: {
        "107": "1.07",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
