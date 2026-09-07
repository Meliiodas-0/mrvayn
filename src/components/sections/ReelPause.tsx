"use client";

import { useState } from "react";

/** The showreel's visible pause control. Toggles data-paused on #showreel, which
 *  globals.css turns into animation-play-state: paused. Hidden by CSS on touch and
 *  reduced-motion devices, where the strip is hand-scrolled instead. */
export function ReelPause() {
  const [paused, setPaused] = useState(false);
  const toggle = () => {
    const next = !paused;
    setPaused(next);
    document.getElementById("showreel")?.toggleAttribute("data-paused", next);
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      className="reel-pause ml-3 items-center rounded border border-white/40 px-2.5 py-1 font-mono text-meta-xs uppercase text-white/85 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
    >
      {paused ? "Play" : "Pause"}
    </button>
  );
}
