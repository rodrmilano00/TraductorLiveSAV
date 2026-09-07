/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        body: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"]
      },
      colors: {
        brand: {
          cream: "#FAF7ED",
          teal: "#0D5C6F",
          deep: "#083D48",
          card: "#0C4A57",
          line: "#1A5C6A",
          cyan: "#2AABB8",
          orange: "#EC9960",
          soft: "#8AACB4",
          muted: "#5A7A82",
          mist: "#D4E4E8",
          ink: "#1A2E35",
          mint: "#A8D5BA",
          red: "#D96B6B"
        }
      },
      borderRadius: {
        'soft': '16px',
        'softer': '24px',
        'pill': '999px'
      },
      boxShadow: {
        soft: "0 20px 60px rgba(26, 46, 53, 0.09)",
        card: "0 1px 3px rgba(0, 0, 0, 0.05)",
        lift: "0 8px 24px rgba(26, 46, 59, 0.10)",
        glow: "0 0 24px rgba(42, 171, 184, 0.35)"
      },
      backgroundImage: {
        'wave-soft': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0 60 C 200 100, 400 20, 600 60 C 800 100, 1000 20, 1200 60 L 1200 120 L 0 120 Z' fill='%230D5C6F' fill-opacity='0.06'/%3E%3C/svg%3E\")"
      }
    },
  },
  plugins: []
};
