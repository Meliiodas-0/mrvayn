"use client";

import { useEffect } from "react";

/**
 * One tiny global effects driver (no framer, no layout writes):
 *  - Cursor spotlight: sets --mx/--my on the hovered .spot-card so its ::after
 *    radial (red-dim) tracks the pointer.
 *  - Journey scrub: fills the red spine (--tl) as the section scrolls through the
 *    viewport and flags the markers still ahead of the reader (li[data-dim]).
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
    };

    const tlList = document.querySelector<HTMLElement>("#journey ol");
    const tlItems = tlList ? Array.from(tlList.querySelectorAll<HTMLElement>(":scope > li")) : [];
    const onScroll = () => {
      if (!tlList) return;
      const r = tlList.getBoundingClientRect();
      const line = window.innerHeight * 0.75;
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      tlList.style.setProperty("--tl", p.toFixed(3));
      for (const li of tlItems) li.toggleAttribute("data-dim", li.getBoundingClientRect().top + 4 > line);
    };
    onScroll();

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
