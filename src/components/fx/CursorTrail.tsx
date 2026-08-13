"use client";

import { useEffect, useRef } from "react";

/** Skiper "Image Trail" adapted to the HUD voice: fast cursor movement sheds small
 *  fading red glyph quads along its path. Canvas, desktop fine-pointer only,
 *  sleeps when idle, off under reduced motion. */
export function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches) return;

    let W = 0, H = 0;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; life: number; s: number; vx: number; vy: number };
    const parts: P[] = [];
    let lastX = -1, lastY = -1, raf = 0, running = false;

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life -= 0.045; p.x += p.vx; p.y += p.vy;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.globalAlpha = p.life * 0.5;
        ctx.fillStyle = "#E8112D";
        ctx.fillRect(p.x, p.y, p.s, p.s);
      }
      ctx.globalAlpha = 1;
      if (parts.length) raf = requestAnimationFrame(loop);
      else running = false;
    };

    const onMove = (e: PointerEvent) => {
      if (lastX >= 0) {
        const d = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        if (d > 18 && parts.length < 90) {
          for (let k = 0; k < Math.min(3, Math.floor(d / 18)); k++) {
            parts.push({
              x: e.clientX + (Math.random() - 0.5) * 14,
              y: e.clientY + (Math.random() - 0.5) * 14,
              life: 1,
              s: 2 + Math.random() * 3,
              vx: (Math.random() - 0.5) * 0.8,
              vy: 0.4 + Math.random() * 0.8,
            });
          }
          if (!running) { running = true; raf = requestAnimationFrame(loop); }
        }
      }
      lastX = e.clientX; lastY = e.clientY;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[45]" />;
}
