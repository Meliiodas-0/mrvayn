import type { Config } from "tailwindcss";

// OVERDRIVE design tokens, see docs/DESIGN_SYSTEM.md.
// Colors are declared as space-separated RGB channels in app/globals.css so
// Tailwind opacity modifiers (e.g. bg-surge/20) work via <alpha-value>.
export default {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "rgb(var(--void) / <alpha-value>)",
        carbon: "rgb(var(--carbon) / <alpha-value>)",
        steel: "rgb(var(--steel) / <alpha-value>)",
        mist: "rgb(var(--mist) / <alpha-value>)",
        bone: "rgb(var(--bone) / <alpha-value>)",
        surge: "rgb(var(--surge) / <alpha-value>)",
        volt: "rgb(var(--volt) / <alpha-value>)",
        ion: "rgb(var(--ion) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-archivo)", "system-ui", "sans-serif"],
        hud: ["var(--font-chakra)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
        anton: ["var(--font-anton)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "2px",
        md: "2px",
      },
    },
  },
  plugins: [],
} satisfies Config;
