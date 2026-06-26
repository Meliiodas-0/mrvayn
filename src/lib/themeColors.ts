// Read the current theme's design tokens as ready-to-use rgb() strings, for
// canvas layers that can't use CSS variables directly. Re-read on the
// "mv-themechange" event that ThemeControl dispatches.

export interface ThemeColors {
  void: string; carbon: string; steel: string; mist: string; bone: string;
  surge: string; volt: string; ion: string;
}

const FALLBACK: ThemeColors = {
  void: "rgb(6,9,16)", carbon: "rgb(13,18,30)", steel: "rgb(26,34,52)",
  mist: "rgb(132,145,168)", bone: "rgb(232,240,255)",
  surge: "rgb(45,212,191)", volt: "rgb(56,189,248)", ion: "rgb(167,139,250)",
};

export function readThemeColors(): ThemeColors {
  if (typeof window === "undefined") return FALLBACK;
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string, fb: string) => {
    const raw = cs.getPropertyValue(name).trim();
    const p = raw.split(/[\s,]+/).map(Number);
    return p.length >= 3 && p.every((n) => !Number.isNaN(n)) ? `rgb(${p[0]},${p[1]},${p[2]})` : fb;
  };
  return {
    void: v("--void", FALLBACK.void), carbon: v("--carbon", FALLBACK.carbon), steel: v("--steel", FALLBACK.steel),
    mist: v("--mist", FALLBACK.mist), bone: v("--bone", FALLBACK.bone),
    surge: v("--surge", FALLBACK.surge), volt: v("--volt", FALLBACK.volt), ion: v("--ion", FALLBACK.ion),
  };
}

export const THEME_EVENT = "mv-themechange";
