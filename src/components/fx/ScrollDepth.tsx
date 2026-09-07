"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-linked depth, desktop only: a few transform-only scrubs synced to Lenis
 * (SmoothScroll feeds ScrollTrigger.update). Never opacity, never gsap.from, so a
 * stale trigger can only cost a harmless few pixels of drift, never hidden content
 * (the failure class ScrollFx documents).
 *  - hero copy column drifts up as the hero leaves
 *  - every section title drifts 24px through its section
 *  - featured media parallaxes inside its overscan wrapper
 */
export function ScrollDepth() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    // one combined query: gsap.matchMedia with an object fires on ANY match
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const hero = document.querySelector<HTMLElement>('[data-depth="hero-copy"]');
      if (hero) {
        gsap.to(hero, { y: -60, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 0.6 } });
      }
      document.querySelectorAll<HTMLElement>('[data-depth="title"]').forEach((h2) => {
        gsap.fromTo(
          h2,
          { y: 24 },
          { y: -24, ease: "none", scrollTrigger: { trigger: h2.closest("section") ?? h2, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
      });
      document.querySelectorAll<HTMLElement>('[data-depth="media"]').forEach((m) => {
        gsap.fromTo(
          m,
          { yPercent: -6 },
          { yPercent: 6, ease: "none", scrollTrigger: { trigger: m.closest("[data-sfx]") ?? m, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
      });
    });

    // late layout (fonts, images) moves trigger positions: refresh after they settle
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    let t = 0;
    const ro = new ResizeObserver(() => { window.clearTimeout(t); t = window.setTimeout(refresh, 150); });
    ro.observe(document.body);

    return () => {
      ro.disconnect();
      window.clearTimeout(t);
      mm.revert();
    };
  }, []);

  return null;
}
