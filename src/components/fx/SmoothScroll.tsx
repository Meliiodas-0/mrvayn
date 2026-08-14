"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth scrolling (the award-site standard) on the window scroller, so
 * every existing scroll listener (ROG scrub, scroll %, nav spy) keeps working
 * untouched. Disabled for reduced-motion and coarse pointers (native touch
 * scrolling already feels right on phones). Reveals are IO-driven (ScrollFx),
 * so no ScrollTrigger sync is needed.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });

    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  return null;
}
