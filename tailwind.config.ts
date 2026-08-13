import type { Config } from "tailwindcss";

// DESIGN SYSTEM v3 tokens, see app/globals.css for the values.
// Legacy token names (void/carbon/steel/mist/bone/surge/volt/ion) are kept as
// CLASS names but remapped to the v3 graphite + red system, so the whole
// component tree re-themes from one place:
//   void=bg-0  carbon=bg-2  steel=line-1  mist=fg-2  bone=fg-1
//   surge=red-hi (text/border red)  ion=red (solid fills)  volt=fg-3
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
        // v3 additions (elevation + hover lines)
        bg1: "rgb(var(--bg-1) / <alpha-value>)",
        bg3: "rgb(var(--bg-3) / <alpha-value>)",
        line2: "rgb(var(--line-2) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        // v3: mono owns ALL meta. font-hud is kept as a class name but IS the mono voice.
        hud: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
        anton: ["var(--font-grotesk)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "4px",
        sm: "4px",
        md: "4px",
      },
      transitionTimingFunction: {
        beat: "cubic-bezier(0.22, 1.2, 0.36, 1)",
        out3: "cubic-bezier(0.16, 1, 0.3, 1)",
        snap: "cubic-bezier(0.7, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
