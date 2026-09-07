import type { Config } from "tailwindcss";

// Design tokens live in app/globals.css (:root). Class names keep the legacy token
// names, remapped to the v5 obsidian-signal system:
//   void=page  bg1=alt section  carbon=card base  bg3=raised  steel=hairline  line2=hover line
//   bone=ink headings  mist=body  volt=meta  surge=text/border red  ion=solid-fill red
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
        ionHover: "rgb(var(--ion-hover) / <alpha-value>)",
        bg1: "rgb(var(--bg-1) / <alpha-value>)",
        bg3: "rgb(var(--bg-3) / <alpha-value>)",
        line2: "rgb(var(--line-2) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      // The two meta sizes; tracking is owned by .font-mono in globals.css.
      fontSize: {
        "meta-xs": ["11px", { lineHeight: "1.5" }],
        meta: ["13px", { lineHeight: "1.5" }],
      },
      // 4px for small hairline objects, 8px (lg) for containers, full for pills/dots.
      borderRadius: {
        none: "0",
        DEFAULT: "4px",
        sm: "4px",
        md: "4px",
        lg: "8px",
        xl: "12px",
        full: "9999px",
      },
      // One z ladder for the whole page.
      zIndex: {
        fx: "0",
        content: "10",
        hud: "40",
        nav: "50",
        chrome: "60",
        overlay: "90",
        cursor: "95",
        boot: "100",
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
