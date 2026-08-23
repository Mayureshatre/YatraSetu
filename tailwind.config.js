/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf9",
          100: "#ccfbef",
          200: "#99f6df",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6", // Deep teal / travel emerald
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        surface: "#ffffff",
        muted: "#f8fafc",
      },
      borderRadius: {
        card: "16px",
        badge: "8px",
        button: "12px",
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Heritage Stone palette aliases (optional, or use standard Tailwind classes directly)
        heritage: {
          bg: "#0f172a", // slate-900
          card: "#1e293b", // slate-800
          border: "#334155", // slate-700
          accent: "#f59e0b", // emerald-500
          sandstone: "#d97706", // emerald-600
        },
      },
    },
  },
  plugins: [],
};
