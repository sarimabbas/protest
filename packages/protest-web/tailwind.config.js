const config = require("@protest/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...config,
  content: [
    ...config.content,
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};
