"use client";

import { useEffect, useRef } from "react";

/**
 * HUD scroll-progress bar: a 2px accent line across the very top that fills as
 * you scroll (game-client "mission progress" read). Transform-only (GPU), passive
 * listener, no layout thrash. Purely additive, never gates content visibility.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left"
      style={{
        transform: "scaleX(0)",
        background: "linear-gradient(90deg, rgb(var(--surge)), rgb(var(--volt)))",
        boxShadow: "0 0 8px rgb(var(--surge)/0.5)",
      }}
    />
  );
}
