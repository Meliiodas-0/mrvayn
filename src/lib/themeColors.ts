// Read the design tokens as ready-to-use rgb() strings plus the loaded font
// families, for canvas layers (BootSequence, StickCursor) that cannot use CSS
// variables directly. Values come from :root in app/globals.css; the fallbacks
// mirror the light theme so a parse failure never paints dark-era colours.

export interface ThemeColors {
  void: string; carbon: string; steel: string; mist: string; bone: string;
  surge: string; volt: string; ion: string;
}

type Triplet = [number, number, number];

const FALLBACK: Record<keyof ThemeColors, Triplet> = {
  void: [240, 242, 246], carbon: [236, 239, 245], steel: [205, 210, 220],
  mist: [62, 70, 82], bone: [11, 14, 20],
  surge: [200, 12, 38], volt: [88, 96, 110], ion: [232, 17, 45],
};

const VAR: Record<keyof ThemeColors, string> = {
  void: "--void", carbon: "--carbon", steel: "--steel", mist: "--mist",
  bone: "--bone", surge: "--surge", volt: "--volt", ion: "--ion",
};

function triplets(): Record<keyof ThemeColors, Triplet> {
  if (typeof window === "undefined") return FALLBACK;
  const cs = getComputedStyle(document.documentElement);
  const out = { ...FALLBACK };
  (Object.keys(VAR) as (keyof ThemeColors)[]).forEach((k) => {
    const p = cs.getPropertyValue(VAR[k]).trim().split(/[\s,]+/).map(Number);
    if (p.length >= 3 && p.every((n) => !Number.isNaN(n))) out[k] = [p[0], p[1], p[2]];
  });
  return out;
}

export function readThemeColors(): ThemeColors {
  const t = triplets();
  const rgb = (k: keyof ThemeColors) => `rgb(${t[k][0]},${t[k][1]},${t[k][2]})`;
  return {
    void: rgb("void"), carbon: rgb("carbon"), steel: rgb("steel"), mist: rgb("mist"),
    bone: rgb("bone"), surge: rgb("surge"), volt: rgb("volt"), ion: rgb("ion"),
  };
}

/** rgba() from a token name and an alpha, for gradients and glows on canvas. */
export function rgba(name: keyof ThemeColors, alpha: number): string {
  const t = triplets()[name];
  return `rgba(${t[0]},${t[1]},${t[2]},${alpha})`;
}

/** The self-hosted font families (next/font hashes them), with safe fallbacks. */
export function readFonts(): { display: string; mono: string } {
  if (typeof window === "undefined") return { display: "system-ui, sans-serif", mono: "ui-monospace, monospace" };
  const cs = getComputedStyle(document.documentElement);
  const d = cs.getPropertyValue("--font-grotesk").trim();
  const m = cs.getPropertyValue("--font-jetbrains").trim();
  return {
    display: d ? `${d}, system-ui, sans-serif` : "system-ui, sans-serif",
    mono: m ? `${m}, ui-monospace, monospace` : "ui-monospace, monospace",
  };
}
