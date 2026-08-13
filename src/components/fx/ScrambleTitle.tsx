"use client";

import { useEffect, useRef } from "react";

const CHARSET = "▮▯/<>#01_";

/**
 * HUD decrypt effect (Vengeance "Morph/Flip Text" adapted to the instrument voice):
 * the FINAL text is server-rendered and always present; on first view JS scrambles
 * it with mono glyphs and resolves left-to-right over ~650ms. Once, IO-triggered,
 * skipped under prefers-reduced-motion. Never gates visibility.
 */
export function ScrambleTitle({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, done = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (done || !entries.some((e) => e.isIntersecting)) return;
        done = true;
        io.disconnect();
        const t0 = performance.now();
        const dur = 650;
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / dur);
          const solved = Math.floor(p * text.length);
          let out = text.slice(0, solved);
          for (let i = solved; i < text.length; i++) {
            const c = text[i];
            out += c === " " ? " " : CHARSET[(Math.random() * CHARSET.length) | 0];
          }
          el.textContent = out;
          if (p < 1) raf = requestAnimationFrame(tick);
          else el.textContent = text;
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [text]);

  return <span ref={ref}>{text}</span>;
}
