"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** The live Lenis instance (null on phones, under reduced motion, or before mount).
 *  ProjectDetail stops it while the dialog is open. */
export const lenisRef = { current: null as Lenis | null };

/**
 * Lenis smooth scrolling on the window scroller, so every existing scroll listener
 * (ROG scrub, nav spy, journey scrub) keeps working untouched. Driven by the GSAP
 * ticker and synced to ScrollTrigger so ScrollDepth's scrubbed transforms stay in
 * step. anchors: true lets Lenis own #hash clicks (it already honours the sections'
 * scroll-margin-top). Disabled for reduced motion and coarse pointers (native touch
 * scrolling already feels right on phones). Reveals stay IO-driven (ScrollFx).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({ lerp: 0.14, wheelMultiplier: 0.92, anchors: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  return null;
}
