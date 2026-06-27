"use client";

import { useEffect, useState } from "react";
import { Palette, X } from "lucide-react";
import { themes, themeById, DEFAULT_THEME } from "@/data/themes";
import { THEME_EVENT } from "@/lib/themeColors";
import { cn } from "@/lib/cn";

const LS_THEME = "mv-theme", LS_GRAIN = "mv-grain", LS_SCAN = "mv-scanlines";

/** Live theme + texture customizer (top-right). Persists to localStorage and
 *  tells the canvas layers to re-read colors via the THEME_EVENT. */
export function ThemeControl() {
  const [open, setOpen] = useState(false);
  const [themeId, setThemeId] = useState(DEFAULT_THEME);
  const [grain, setGrain] = useState(false);
  const [scan, setScan] = useState(false);

  const applyTheme = (id: string, persist = true) => {
    const root = document.documentElement;
    Object.entries(themeById(id).vars).forEach(([k, v]) => root.style.setProperty(k, v));
    if (persist) try { localStorage.setItem(LS_THEME, id); } catch { /* */ }
    window.dispatchEvent(new CustomEvent(THEME_EVENT));
  };
  const applyTexture = (kind: "grain" | "scanlines", on: boolean) => {
    document.documentElement.dataset[kind] = on ? "on" : "off";
    try { localStorage.setItem(kind === "grain" ? LS_GRAIN : LS_SCAN, on ? "on" : "off"); } catch { /* */ }
  };

  useEffect(() => {
    let t = DEFAULT_THEME, g = false, s = false; // grain + scanlines OFF by default
    try {
      t = localStorage.getItem(LS_THEME) || DEFAULT_THEME;
      g = localStorage.getItem(LS_GRAIN) === "on";
      s = localStorage.getItem(LS_SCAN) === "on";
    } catch { /* */ }
    setThemeId(t); setGrain(g); setScan(s);
    applyTheme(t, false); applyTexture("grain", g); applyTexture("scanlines", s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (id: string) => { setThemeId(id); applyTheme(id); };

  return (
    <div className="fixed right-4 top-4 z-[80] flex flex-col items-end gap-3">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Customize theme"
        aria-expanded={open}
        className="bevel-sm grid h-10 w-10 place-items-center border border-steel bg-carbon/85 text-bone shadow-lg backdrop-blur-md transition-colors hover:border-surge hover:text-surge"
      >
        {open ? <X className="h-4 w-4" /> : <Palette className="h-4 w-4" />}
      </button>

      {open && (
        <div className="bevel w-64 border border-steel bg-carbon/95 p-4 shadow-2xl backdrop-blur-md">
          <p className="font-hud text-[0.62rem] uppercase tracking-[0.28em] text-mist">Theme</p>
          <div className="mt-3 space-y-1.5">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => pick(t.id)}
                className={cn(
                  "bevel-sm flex w-full items-center justify-between gap-3 border px-3 py-2 text-left transition-colors",
                  themeId === t.id ? "border-surge bg-surge/10" : "border-steel/70 hover:border-bone/30",
                )}
              >
                <span className="font-hud text-xs uppercase tracking-wide text-bone">{t.name}</span>
                <span className="flex gap-1">
                  {t.swatch.map((c, i) => (
                    <span key={i} aria-hidden className="h-3.5 w-3.5 rounded-full ring-1 ring-black/40" style={{ background: c }} />
                  ))}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-4 font-hud text-[0.62rem] uppercase tracking-[0.28em] text-mist">Texture</p>
          <div className="mt-3 space-y-2.5">
            <Toggle label="Grain" on={grain} onClick={() => { const n = !grain; setGrain(n); applyTexture("grain", n); }} />
            <Toggle label="Scanlines" on={scan} onClick={() => { const n = !scan; setScan(n); applyTexture("scanlines", n); }} />
          </div>
        </div>
      )}
    </div>
  );
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} role="switch" aria-checked={on} className="flex w-full items-center justify-between">
      <span className="font-mono text-[0.7rem] uppercase tracking-wider text-mist">{label}</span>
      <span className={cn("relative h-5 w-9 rounded-full border transition-colors", on ? "border-surge bg-surge/30" : "border-steel bg-steel/40")}>
        <span className={cn("absolute top-[3px] h-3.5 w-3.5 rounded-full transition-all", on ? "left-[18px] bg-surge" : "left-[3px] bg-mist")} />
      </span>
    </button>
  );
}
