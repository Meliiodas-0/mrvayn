"use client";

import { useEffect } from "react";

/**
 * Scroll reveals via IntersectionObserver, honoring the SAFETY CONTRACT in
 * globals.css: markup ships VISIBLE; this only ADDS .sfx-in, and the CSS
 * variant animates from hidden to the natural state once. If JS never runs,
 * nothing is ever hidden (the iOS rule).
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
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("sfx-in");
            io.unobserve(e.target);
          }
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
