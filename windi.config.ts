import { defineConfig } from "windicss/helpers";

export default defineConfig({
  extract: {
    include: ["./src/**/*.{jsx,tsx,css,ts}"],
    exclude: ["node_modules", ".git", ".next/**/*"],
  },
  theme: {
    extend: {
      animation: {
        skeleton: "skeleton 3s ease infinite",
      },
      keyframes: {
        skeleton: {
          "from, 50%, to": {
            opacity: "1",
          },
          "25%, 75%": {
            opacity: "0.3",
          },
        },
      },
    },
  },
  shortcuts: {
    focusable:
      "focus-visible:ring-2 focus:outline-none focus-visible:ring-cyan-400 ",
    center: "flex items-center justify-center",
  },
  plugins: [
    require("windicss/plugin/forms"),
    require("windicss/plugin/typography")(),
    require("@windicss/plugin-animations")({
      settings: {
        animatedSpeed: 1000,
        heartBeatSpeed: 1000,
        hingeSpeed: 2000,
        bounceInSpeed: 750,
        bounceOutSpeed: 750,
        animationDelaySpeed: 1000,
      },
    }),
  ],
});
