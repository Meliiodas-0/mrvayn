"use client";

import { useEffect, useRef } from "react";
import { readThemeColors, THEME_EVENT } from "@/lib/themeColors";

/**
 * Scroll-reactive digital glitch. A fixed, full-screen canvas overlay that
 * bursts RGB-split horizontal "tears" + scanline flicker scaled by scroll
 * velocity, then decays to nothing. Uses the live theme's accent colors. Only
 * runs its loop while glitching (idle = no rAF). Off for reduced-motion and
 * under ?still/?cine so the page can idle for screenshots.
 */
export function ScrollGlitch() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const q = new URLSearchParams(location.search);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || q.has("still") || q.has("cine")) return;

    let C = readThemeColors();
    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      W = window.innerWidth; H = window.innerHeight; dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let lastY = window.scrollY, intensity = 0, raf = 0, running = false;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      if (intensity > 0.03) {
        ctx.globalCompositeOperation = "lighter";
        const n = 1 + Math.round(intensity * 2);
        for (let i = 0; i < n; i++) {
          const sy = Math.random() * H, sh = 1 + Math.random() * intensity * 28, off = (Math.random() - 0.5) * intensity * 38;
          ctx.globalAlpha = 0.05 * intensity;
          ctx.fillStyle = C.surge; ctx.fillRect(off, sy, W, sh);
          ctx.fillStyle = C.volt; ctx.fillRect(-off * 0.7, sy + 1.5, W, sh * 0.6);
        }
        ctx.globalAlpha = 0.02 * intensity; ctx.fillStyle = C.bone;
        for (let y = 0; y < H; y += 3) if (Math.random() < intensity * 0.18) ctx.fillRect(0, y, W, 1);
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      }
      intensity *= 0.80;
      if (intensity > 0.02 && !document.hidden) { raf = requestAnimationFrame(draw); } else { running = false; ctx.clearRect(0, 0, W, H); }
    };
    const kick = () => { if (!running) { running = true; raf = requestAnimationFrame(draw); } };

    const onScroll = () => {
      const y = window.scrollY;
      intensity = Math.min(0.6, Math.max(intensity, Math.abs(y - lastY) / 95)); // subtle: less sensitive + lower ceiling
      lastY = y;
      kick();
    };
    const onTheme = () => { C = readThemeColors(); };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener(THEME_EVENT, onTheme);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener(THEME_EVENT, onTheme);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[55]" />;
}
