"use client";

import { useEffect, useRef } from "react";

/**
 * Ronin centerpiece — a background-removed (alpha) figure anchored CENTER-BOTTOM
 * of the site, drawn crisp and clear. Desktop: a 100-frame transparent-WebP
 * sequence on a canvas, scrubbed by scroll (he turns + draws as you scroll the
 * first screen, reverses up) and gently fading back as you move into the content
 * so it never covers text. Phone: one faint static frame as a background figure.
 *
 * REPLACE THE CLIP: drop a new clip in and regenerate the matte sequence into
 * `public/samurai/f_000..NNN.webp` (ffmpeg crop+fps -> rembg per frame -> webp),
 * then set FRAMES below. Nothing else changes.
 */
const FRAMES = 100;
const HERO_IDX = 0; // hero resting pose (scroll 0) — used for phone/static so it matches the live hero
const frameSrc = (i: number) => `/samurai/f_${String(i).padStart(3, "0")}.webp`;

export function ScrollSamurai() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current, wrap = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !wrap) return;

    let W = 0, H = 0, dpr = 1, lastGood: HTMLImageElement | null = null;
    const resize = () => {
      const r = canvas.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const paint = (im: HTMLImageElement | null) => {
      ctx.clearRect(0, 0, W, H);
      if (!im || !im.naturalWidth) return;
      lastGood = im;
      const iw = im.naturalWidth, ih = im.naturalHeight;
      const scale = Math.min(W / iw, H / ih);
      const dw = iw * scale, dh = ih * scale;
      ctx.drawImage(im, (W - dw) / 2, H - dh, dw, dh); // centered, bottom-anchored
    };

    const q = new URLSearchParams(location.search);
    const reduceOrStill = window.matchMedia("(prefers-reduced-motion: reduce)").matches || q.has("still") || q.has("cine");
    const phone = window.matchMedia("(max-width: 1023.98px)").matches;

    resize();
    window.addEventListener("resize", resize);

    // Phone / reduced-motion / still: one faint static frame, no sequence or scroll.
    if (phone || reduceOrStill) {
      const im = new Image(); im.decoding = "async"; im.src = frameSrc(HERO_IDX);
      const drawStatic = () => { resize(); paint(im.complete && im.naturalWidth ? im : lastGood); };
      im.onload = drawStatic; window.removeEventListener("resize", resize); window.addEventListener("resize", drawStatic); drawStatic();
      return () => window.removeEventListener("resize", drawStatic);
    }

    // Desktop: full sequence + scroll scrub + fade past the hero.
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < FRAMES; i++) { const im = new Image(); im.decoding = "async"; im.src = frameSrc(i); imgs[i] = im; }
    const draw = (idx: number) => { let i = Math.round(idx); i = Math.max(0, Math.min(FRAMES - 1, i)); const im = imgs[i]; paint(im && im.complete && im.naturalWidth ? im : lastGood); };

    let target = 0, cur = 0, raf = 0, running = true;
    const compute = () => {
      const vh = window.innerHeight, y = window.scrollY;
      const max = document.documentElement.scrollHeight - vh;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      // front-loaded over the WHOLE page: a clear turn while scrolling the hero, then keeps
      // progressing (slowly) all the way to the bottom — never finishes/stops early.
      target = Math.sqrt(p) * (FRAMES - 1);
      const fs = vh * 0.85, fe = vh * 1.5;
      wrap.style.opacity = String(y <= fs ? 1 : y >= fe ? 0.18 : 1 - ((y - fs) / (fe - fs)) * 0.82); // clear in hero, faint constant-size bg deeper
    };
    const tick = () => {
      if (!running) return;
      cur += (target - cur) * 0.12;
      draw(cur);
      raf = requestAnimationFrame(tick);
    };
    const onVis = () => { running = !document.hidden; if (running) raf = requestAnimationFrame(tick); };

    window.addEventListener("scroll", compute, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    compute();
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      data-solid
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-0 mx-auto h-[72vh] w-full max-w-[840px] max-lg:h-[60vh] max-lg:opacity-[0.22]"
    >
      {/* grounding glow under his feet so he stands in the scene */}
      <div className="absolute inset-x-0 bottom-0 h-2/3" style={{ background: "radial-gradient(58% 70% at 50% 100%, rgb(var(--surge)/0.13), rgb(var(--ion)/0.06) 46%, transparent 72%)" }} />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* feet dissolve into the void */}
      <div className="absolute inset-x-0 bottom-0 h-14" style={{ background: "linear-gradient(180deg, transparent, rgb(var(--void)))" }} />
    </div>
  );
}
