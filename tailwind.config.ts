import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          "light-blue": "#83C5BE",
          "dark-blue": "#327C81",
          pink: "#F472B6",
        },
        gray: "#bdbdbd",
      },
      fontFamily: {
        flair: ["Comfortaa Variable", "ui-sans-serif", "system-ui"],
      },
      animation: {
        border: "border 4s ease infinite",
      },
      keyframes: {
        border: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      aspectRatio: {
        photo: "4/3",
      },
    },
  },
  plugins: [],
} satisfies Config;
