/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
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
