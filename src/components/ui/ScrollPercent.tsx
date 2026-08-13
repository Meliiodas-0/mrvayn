"use client";

import { useEffect, useRef } from "react";

/** Live "SCROLL 34%" readout for the instrument frame. Text is server-rendered
 *  ("SCROLL 0%") so it never depends on JS to exist; JS only updates the number. */
export function ScrollPercent() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
      el.textContent = `SCROLL ${p}%`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return <span ref={ref}>SCROLL 0%</span>;
}
