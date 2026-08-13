"use client";

import { useEffect, useState } from "react";

const SECTIONS = ["hero", "operator", "showreel", "loadout", "record", "arsenal", "timeline", "comms"];

/** Skiper "Dynamic Island" adapted: a live instrument pill (bottom-left) that
 *  cycles between the clock, the active section, scroll depth, and a REC pulse.
 *  Purely additive chrome; hidden on phones and under reduced motion. */
export function LiveStatus() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 1023.98px)").matches) return;
    let mode = 0;
    const compute = () => {
      const y = window.scrollY + window.innerHeight * 0.4;
      let current = "HERO";
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) current = id.toUpperCase();
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0"), mm = String(now.getMinutes()).padStart(2, "0"), ss = String(now.getSeconds()).padStart(2, "0");
      const modes = [
        `REC ● ${hh}:${mm}:${ss}`,
        `SECTION / ${current}`,
        `DEPTH ${pct}%`,
        `UE5 + NEXT.JS BUILD`,
      ];
      setMsg(modes[mode % modes.length]);
    };
    compute();
    const tick = setInterval(compute, 1000);
    const swap = setInterval(() => { mode++; }, 3200);
    return () => { clearInterval(tick); clearInterval(swap); };
  }, []);

  if (!msg) return null;
  return (
    <div
      aria-hidden
      className="glass fixed bottom-5 left-5 z-40 hidden items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-[11px] uppercase text-volt transition-all duration-300 ease-beat lg:flex"
    >
      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-ion" />
      <span className="whitespace-nowrap tabular-nums">{msg}</span>
    </div>
  );
}
