    /** @type {import('tailwindcss').Config} */



    
    module.exports = {
      content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}", // Adjust based on your project structure and framework
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}", // Adjust based on your project structure and framework
      ],
      theme: {
        extend: {
          animation: {
        scroll: "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
      keyframes: {
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
      },

        },
      },
      plugins: [],
    }
