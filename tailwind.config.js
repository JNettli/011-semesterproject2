/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html", 
      "./**/*.{html,js}",
      "!./node_modules/**",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    darkMode: 'class',
};
