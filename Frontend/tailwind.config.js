const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  content: [
    "./node_modules/flowbite/**/*.js",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'myblack': '0 4px 6px rgba(0, 0, 0, 1)',
      },
      screens: {
        'sm-s': '370px',
        'sm-xl': '420px',
        'tablet-sm-s': '600px',
        'tablet-sm': '700px',
        'tablet-xl': '900px'
      },
    },

  },
  plugins: [require('flowbite/plugin')],
});