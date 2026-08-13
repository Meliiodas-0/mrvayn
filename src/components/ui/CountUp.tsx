"use client";

import { useEffect, useRef } from "react";

/** v3 stat number: counts up once on first view, 900ms, ease-out. The FINAL value is
 *  server-rendered (never depends on JS to exist); JS only animates the numeric part.
 *  Non-numeric values ("IGDC", "MMO") are left alone. */
export function CountUp({ value, className, style }: { value: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const m = value.match(/^(\d+)(.*)$/);
    if (!m || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = parseInt(m[1], 10), suffix = m[2] ?? "";
    let raf = 0, done = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (done || !entries.some((e) => e.isIntersecting)) return;
        done = true;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / 900);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = `${Math.round(target * eased)}${suffix}`;
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);

  return (
    <p ref={ref} data-solid className={className} style={style}>
      {value}
    </p>
  );
}
