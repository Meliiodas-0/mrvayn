"use client";

import { useEffect, useRef } from "react";
import { ROG_OFFSETS, ROG_OFFSET_MEAN } from "@/data/rogOffsets";

/**
 * Ronin centerpiece, a background-removed (alpha) figure anchored CENTER-BOTTOM
 * of the site, drawn crisp and clear. Desktop: a 100-frame transparent-WebP
 * sequence on a canvas, scrubbed by scroll (he turns + draws as you scroll the
 * first screen, reverses up) and gently fading back as you move into the content
 * so it never covers text. Phone: one faint static frame as a background figure.
 *
 * REPLACE THE CLIP: drop a new clip in and regenerate the matte sequence into
 * `public/samurai/f_000..NNN.webp` (ffmpeg crop+fps -> rembg per frame -> webp),
 * then set FRAMES below. Nothing else changes.
 */
const FRAMES = 144;
const HERO_IDX = 0; // hero resting pose (scroll 0), used for phone/static so it matches the live hero
const frameSrc = (i: number) => `/rog/f_${String(i).padStart(3, "0")}.webp`;
// Per-frame horizontal offset that re-centres each frame's body mass, so ROG never slides
// left↔right as the sequence scrubs (his pose/mace sway ~14% of the width across 144 frames
//, that lateral slide is what looked broken on phone). Falls back to the set mean.
const offsetForFrame = (frame: number) => ROG_OFFSETS[frame] ?? ROG_OFFSET_MEAN;

export function ScrollSamurai() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current, wrap = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !wrap) return;

    let W = 0, H = 0, dpr = 1, lastGood: HTMLImageElement | null = null;
    let dxFrac = offsetForFrame(HERO_IDX); // horizontal centering offset for the frame currently drawn
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
      ctx.drawImage(im, (W - dw) / 2 + dxFrac * dw, H - dh, dw, dh); // body-centered (per-frame), bottom-anchored
    };

    const q = new URLSearchParams(location.search);
    const reduceOrStill = window.matchMedia("(prefers-reduced-motion: reduce)").matches || q.has("still") || q.has("cine");
    const phone = window.matchMedia("(max-width: 1023.98px)").matches;
    // Edge-dissolve mask on DESKTOP only — re-masking the canvas every repaint is costly on phones.
    if (!phone) { const m = "radial-gradient(64% 70% at 50% 56%, #000 52%, transparent 92%)"; canvas.style.setProperty("mask-image", m); canvas.style.setProperty("-webkit-mask-image", m); }

    resize();
    window.addEventListener("resize", resize);

    // Reduced-motion / still: one static frame, no sequence or scroll (a11y + screenshots).
    if (reduceOrStill) {
      const im = new Image(); im.decoding = "async"; im.src = frameSrc(HERO_IDX);
      const drawStatic = () => { resize(); paint(im.complete && im.naturalWidth ? im : lastGood); };
      im.onload = drawStatic; window.removeEventListener("resize", resize); window.addEventListener("resize", drawStatic); drawStatic();
      return () => window.removeEventListener("resize", drawStatic);
    }

    // Sequence + scroll scrub, on desktop AND phone. Phone reacts to scroll just like
    // desktop, but loads a DECIMATED set (every 3rd frame ≈ 48 of 144, ~1.6MB vs 4.8MB)
    // and stays fainter, to stay light on mobile data. The loop sleeps when not scrubbing.
    const STRIDE = phone ? 3 : 1;
    const idxs: number[] = [];
    for (let i = 0; i < FRAMES; i += STRIDE) idxs.push(i);
    if (idxs[idxs.length - 1] !== FRAMES - 1) idxs.push(FRAMES - 1);
    const N = idxs.length;
    const heroOp = phone ? 0.6 : 0.9, deepOp = phone ? 0.3 : 0.4; // ~2x more visible (owner request); still fades to a constant-size ghost deeper
    const ease = phone ? 0.22 : 0.12; // snappier on phone so the scrub tracks the scroll instead of trailing (fixes the "laggy" feel)

    let target = 0, cur = 0, raf = 0, running = false, lastI = -1;
    const imgs: HTMLImageElement[] = idxs.map((i) => { const im = new Image(); im.decoding = "async"; im.src = frameSrc(i); return im; });
    const draw = (idx: number) => {
      let i = Math.round(idx); i = Math.max(0, Math.min(N - 1, i));
      if (i === lastI) return; // only repaint when the frame actually changes — kills redundant redraws (big win on phone)
      lastI = i; dxFrac = offsetForFrame(idxs[i]);
      const im = imgs[i]; paint(im && im.complete && im.naturalWidth ? im : lastGood);
    };
    const repaint = () => { lastI = -1; draw(cur); }; // force a redraw (frame streamed in, or canvas resized)
    imgs.forEach((im) => { im.onload = () => { if (!running) repaint(); }; });
    window.addEventListener("resize", repaint);

    const tick = () => {
      cur += (target - cur) * ease;
      draw(cur);
      if (document.hidden || Math.abs(target - cur) < 0.4) { running = false; return; } // settle → sleep
      raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!running && !document.hidden) { running = true; raf = requestAnimationFrame(tick); } };
    const compute = () => {
      const vh = window.innerHeight, y = window.scrollY;
      const max = document.documentElement.scrollHeight - vh;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      // front-loaded over the WHOLE page: a clear turn while scrolling the hero, then keeps
      // progressing (slowly) all the way to the bottom, never finishes/stops early.
      target = Math.sqrt(p) * (N - 1);
      const fs = vh * 0.85, fe = vh * 1.5;
      wrap.style.opacity = String(y <= fs ? heroOp : y >= fe ? deepOp : heroOp - ((y - fs) / (fe - fs)) * (heroOp - deepOp)); // submerged: fainter on phone, fades to a constant-size presence deeper
      kick();
    };
    const onVis = () => { if (!document.hidden) kick(); };

    window.addEventListener("scroll", compute, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    compute();
    draw(cur);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", repaint);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      data-solid
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-0 mx-auto h-[82vh] w-full max-w-[940px] max-lg:h-[66vh] max-lg:opacity-60"
    >
      {/* spectral aura behind him, a cool, ethereal halo so the bone-white figure reads as an apparition */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(38% 36% at 50% 60%, rgb(var(--volt)/0.10), rgb(var(--ion)/0.07) 46%, transparent 70%)" }} />
      {/* a glowing rift he rises from */}
      <div className="absolute inset-x-0 bottom-0 h-3/5" style={{ background: "radial-gradient(56% 64% at 50% 100%, rgb(var(--ion)/0.16), rgb(var(--volt)/0.08) 44%, transparent 72%)" }} />
      {/* edges dissolve into the void so he's submerged in the scene, not a hard cutout */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* layered mist so he's wreathed in atmosphere + dissolves into the void */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-80 blur-2xl max-lg:blur-md" style={{ background: "radial-gradient(78% 100% at 50% 110%, rgb(var(--mist)/0.16), rgb(var(--ion)/0.06) 40%, transparent 70%)" }} />
      <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: "linear-gradient(180deg, transparent, rgb(var(--void)))" }} />
    </div>
  );
}
