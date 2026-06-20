// Best-score persistence. Feature-detected + guarded for SSR / privacy mode.

const KEY = "overdrive_best";

export function loadBest(): number {
  if (typeof window === "undefined") return 0;
  try {
    return Math.max(0, Number(localStorage.getItem(KEY) || 0) || 0);
  } catch {
    return 0;
  }
}

export function saveBest(value: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, String(Math.floor(value)));
  } catch {
    /* privacy mode — ignore */
  }
}
