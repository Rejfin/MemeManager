/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      border: ['focus'],
    },
    colors:{
      transparent: "transparent",
      current: "currentColor",
      primary: {
          100: "#d7e9ff",
          200: "#b0d3ff",
          300: "#88bcff",
          400: "#61a6ff",
          500: "#3990ff",
          600: "#2e73cc",
          700: "#225699",
          800: "#173a66",
          900: "#0b1d33",
          default: "#3990ff"
      },
      secondary:{
        light: {

        },
        dark: {

        }
      },
      backgroundSurface:{
        DEFAULT: "#ffffff",
        dark: "#2a2c3e"
      },
      background:{
        DEFAULT:"#F5F5F5",
        dark:"#1b1c2a"
      },
      textColor:{
        DEFAULT: "#131313",
        dark: "#F0F0F0"
      },
      secondaryTextColor:{
        DEFAULT: "#F3F3F3",
        dark: "#383838"
      },
      videoColor:"#fcd31a",
      gifsColor:"#46e4ff",
      otherColor:"#e92229",
      navigationIconColor: "#777777",
      errorColor: "#DA4747",
      inputBorderColor: "#747474",
    }
  },
  plugins: [],
}
