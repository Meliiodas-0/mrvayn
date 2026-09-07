"use client";

import { useEffect } from "react";

/**
 * Scroll reveals via IntersectionObserver, honoring the SAFETY CONTRACT in
 * globals.css: markup ships VISIBLE; this only ADDS .sfx-in, and the CSS
 * variant animates from hidden to the natural state once. If JS never runs,
 * nothing is ever hidden (the iOS rule).
 *
 * Stagger is derived from co-arrival: blocks that enter the viewport in the
 * same observer batch (document order) get 0, 60, 120ms... so a row that scrolls
 * in alone simply appears instead of waiting for a delay it never needed.
 * Authored inline delays (the hero cascade) are respected.
 *
 * Replaces the GSAP ScrollTrigger version, whose gsap.from() set opacity:0
 * up-front and then relied on trigger positions computed before late layout
 * shifts, leaving whole sections invisible when triggers never fired.
 * IO needs no position math, so it cannot go stale.
 */
export function ScrollFx() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-sfx]"));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        let k = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          if (!el.style.animationDelay) el.style.animationDelay = `${Math.min(k, 6) * 0.06}s`;
          k++;
          el.classList.add("sfx-in");
          io.unobserve(el);
        }
      },
      // fire a little before the element fully enters (mimics "top 86%")
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
