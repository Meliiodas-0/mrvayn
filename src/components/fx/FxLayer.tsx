"use client";

import { useEffect } from "react";

/**
 * One tiny global effects driver (no framer, no layout writes):
 *  - Cursor spotlight: sets --mx/--my on the hovered .spot-card so its ::after
 *    radial (red-dim) tracks the pointer (Vengeance "Cursor Card" pattern).
 *  - Kinetic strip: maps scroll velocity to a skew CSS var on the showreel track
 *    (Animmaster velocity pattern). Decays back to 0 when scrolling stops.
 * Renders nothing; skips itself entirely under prefers-reduced-motion.
 */
export function FxLayer() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const card = t?.closest?.(".spot-card") as HTMLElement | null;
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
      }
      // featured-tile tilt (Vengeance cursor-card): +-4deg toward the pointer
      const tilt = t?.closest?.(".tilt-card") as HTMLElement | null;
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        tilt.style.setProperty("--ry", `${(dx * 4).toFixed(2)}deg`);
        tilt.style.setProperty("--rx", `${(-dy * 4).toFixed(2)}deg`);
      }
    };
    const onOut = (e: PointerEvent) => {
      const tilt = (e.target as HTMLElement | null)?.closest?.(".tilt-card") as HTMLElement | null;
      if (tilt && !tilt.contains(e.relatedTarget as Node)) {
        tilt.style.setProperty("--rx", "0deg");
        tilt.style.setProperty("--ry", "0deg");
      }
    };

    const strip = document.querySelector<HTMLElement>("#showreel .kinetic-skew");
    let lastY = window.scrollY, lastT = performance.now(), vel = 0, raf = 0;
    const decay = () => {
      raf = 0;
      vel *= 0.82;
      if (strip) strip.style.setProperty("--reel-skew", `${(Math.max(-1, Math.min(1, vel)) * 3.5).toFixed(2)}deg`);
      if (Math.abs(vel) > 0.02) raf = requestAnimationFrame(decay);
    };
    // timeline scrub: fill the red spine as the section scrolls through the viewport
    const tlList = document.querySelector<HTMLElement>("#timeline ol");
    const onScroll = () => {
      const now = performance.now(), y = window.scrollY;
      const dt = Math.max(1, now - lastT);
      vel = vel * 0.7 + ((y - lastY) / window.innerHeight) * (1000 / dt) * 0.3;
      lastY = y; lastT = now;
      if (!raf) raf = requestAnimationFrame(decay);
      if (tlList) {
        const r = tlList.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (window.innerHeight * 0.75 - r.top) / r.height));
        tlList.style.setProperty("--tl", p.toFixed(3));
      }
    };
    onScroll();

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
