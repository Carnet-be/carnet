/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        background:"#F8F8F8"
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui:{
    darkTheme: "light",
      themes: [
        {
          light: {
            ...require("daisyui/src/colors/themes")["[data-theme=light]"],
            primary: "#181BAA",
          },
        },
      ],
  }
};
