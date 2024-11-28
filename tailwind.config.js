/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html", 
      "./**/*.{html,js}",
      "!./node_modules/**",
    ],
    darkMode: ['selector', '[data-mode="dark"]'],
    theme: {
        extend: {},
    },
    plugins: [],
};
