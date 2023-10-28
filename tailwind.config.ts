import { nextui } from "@nextui-org/react";
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx","./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors:{
        primary:{
          DEFAULT: "#181BAA",
          foreground:"#FFFFFF",
        },
        secondary:{
          DEFAULT:"#FFCC91",
          foreground:"#000000",
        }
      }
    },
  },
  darkMode: "class",
  plugins: [
      nextui({
    layout:{
      
    },
    themes:{
      
      light:{
        
        colors:{
          
          foreground:'#45464E',
          primary:{
            DEFAULT: "#181BAA",
            foreground:"#FFFFFF",
          },
          secondary:{
            DEFAULT:"#FFCC91",
            foreground:"#000000",
          }
        }
      },
      dark:{
        colors:{
          background:'#12121212',
          primary:{
            DEFAULT: "#8bb6fc",
            foreground:"#000000",
          },
          secondary:{
            DEFAULT:"#fcb8b8",
            foreground:"#000000",
          }
        }
      }
    }
  })],

} satisfies Config;
