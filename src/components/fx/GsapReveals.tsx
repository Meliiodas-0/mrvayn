"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Per-variant entrance vars (pattern lifted from VengenceUI's gsap staggered-grid).
const VARIANTS: Record<string, gsap.TweenVars> = {
  up: { y: 44, opacity: 0 },
  left: { x: -56, opacity: 0 },
  right: { x: 56, opacity: 0 },
  pop: { y: 26, scale: 0.92, opacity: 0 },
  tilt: { y: 34, rotation: -2, scale: 0.97, opacity: 0 },
  glass: { y: 30, opacity: 0, filter: "blur(8px)" },
  // playing-card deal: tiles swing in from the deck like dealt cards
  "deal-l": { y: 110, rotation: -10, opacity: 0, transformOrigin: "50% 130%", scale: 0.94 },
  "deal-r": { y: 110, rotation: 10, opacity: 0, transformOrigin: "50% 130%", scale: 0.94 },
  // grid flip: compact tiles hinge up from the surface
  flip: { rotationX: -46, y: 44, opacity: 0, transformPerspective: 900, transformOrigin: "50% 100%" },
};

/**
 * GSAP ScrollTrigger reveals for every [data-sfx] container. GSAP sets the hidden
 * state AT RUNTIME (markup ships visible), so a JS failure can never blank content,
 * and reduced-motion users get no animation at all. Each element animates once as
 * it enters, honoring its inline animation-delay as the stagger.
 */
export function GsapReveals() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const tweens: gsap.core.Tween[] = [];
    document.querySelectorAll<HTMLElement>("[data-sfx]").forEach((el) => {
      const variant = VARIANTS[el.dataset.sfx ?? "up"] ?? VARIANTS.up;
      const delay = parseFloat(el.style.animationDelay || "0") || 0;
      tweens.push(
        gsap.from(el, {
          ...variant,
          duration: el.dataset.sfx?.startsWith("deal") ? 1.0 : 0.85,
          delay,
          ease: el.dataset.sfx?.startsWith("deal") ? "back.out(1.4)" : "power3.out",
          clearProps: "all",
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        }),
      );
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
    };
  }, []);

  return null;
}
