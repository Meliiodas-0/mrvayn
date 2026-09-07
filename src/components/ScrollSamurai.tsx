"use client";

import { useEffect, useRef } from "react";
import { ROG_OFFSETS, ROG_OFFSET_MEAN } from "@/data/rogOffsets";

/** Sevarog owns the opening stage, not the reading surface behind every section.
 * The original 200-frame sequence scrubs calmly as the cover leaves the viewport.
 * Phones load nearby frames on demand; reduced motion gets one static frame. */
const FRAMES = 200;
const HERO_IDX = 0;
const frameSrc = (folder: string, i: number) => `/${folder}/f_${String(i).padStart(3, "0")}.webp?v=10`;
const offsetForFrame = (frame: number) => ROG_OFFSETS[frame] ?? ROG_OFFSET_MEAN;

export function ScrollSamurai() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current, wrap = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !wrap) return;

    let W = 0, H = 0, dpr = 1, lastGood: HTMLImageElement | null = null;
    let dxFrac = offsetForFrame(HERO_IDX);
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
      const s = Math.min(W / iw, H / ih);
      const dw = iw * s, dh = ih * s;
      // The enlarged canvas preserves transparent headroom for raised-weapon
      // frames. Fit the entire source inside it, with feet anchored and no crop.
      ctx.drawImage(im, (W - dw) / 2 + dxFrac * dw, H - dh, dw, dh);
    };

    const q = new URLSearchParams(location.search);
    const reduceOrStill = window.matchMedia("(prefers-reduced-motion: reduce)").matches || q.has("still") || q.has("cine");
    const phone = window.matchMedia("(max-width: 1023.98px)").matches;
    const hi = !phone && (window.devicePixelRatio || 1) >= 1.5;
    const folder = phone ? "rog-sm" : hi ? "rog-hi" : "rog";
    const m = "none";
    canvas.style.setProperty("mask-image", m); canvas.style.setProperty("-webkit-mask-image", m);
    // The figure now has its own space on both screen sizes.
    wrap.style.opacity = "0.92";

    resize();
    window.addEventListener("resize", resize);

    if (reduceOrStill) {
      const im = new Image(); im.decoding = "async"; im.fetchPriority = "high"; im.src = frameSrc(folder, HERO_IDX);
      const drawStatic = () => { resize(); paint(im.complete && im.naturalWidth ? im : lastGood); };
      im.onload = drawStatic; window.removeEventListener("resize", resize); window.addEventListener("resize", drawStatic); drawStatic();
      return () => window.removeEventListener("resize", drawStatic);
    }

    const N = FRAMES;
    const ease = phone ? 0.22 : 0.14;
    const lead = phone ? 9 : 0;

    let target = 0, cur = 0, raf = 0, running = false, lastI = -1;
    // Frame slots: hero first (high priority), every 5th as keyframes, a window
    // around the scrub position, then the full set (fillStep below).
    const imgs: (HTMLImageElement | null)[] = Array(N).fill(null);
    const loaded = (k: number) => { const im = imgs[k]; return im && im.complete && im.naturalWidth ? im : null; };
    const repaint = () => { lastI = -1; draw(cur); };
    const ensure = (k: number, prio: "high" | "auto" = "auto") => {
      if (k < 0 || k >= N || imgs[k]) return;
      const im = new Image(); im.decoding = "async"; im.fetchPriority = prio; im.src = frameSrc(folder, k);
      im.onload = () => { if (!running) repaint(); };
      imgs[k] = im;
    };
    // nearest loaded frame to i (worst case with 5-frame keyframes: 2 frames off)
    const nearest = (i: number) => {
      for (let d = 0; d <= 10; d++) {
        const a = loaded(i - d); if (a) return a;
        const b = loaded(i + d); if (b) return b;
      }
      return lastGood;
    };
    function draw(idx: number) {
      let i = Math.round(idx); i = Math.max(0, Math.min(N - 1, i));
      for (let k = i - (phone ? 4 : 8); k <= i + (phone ? 8 : 16); k++) ensure(k);
      if (i === lastI) return;
      lastI = i; dxFrac = offsetForFrame(i);
      paint(nearest(i));
    }
    ensure(HERO_IDX, "high");
    const keyframeStep = phone ? 20 : 5;
    for (let k = keyframeStep; k < N; k += keyframeStep) ensure(k);
    window.addEventListener("resize", repaint);

    // Fill the rest right away, nearest-to-scrub first, 24 frames every 40ms (the
    // whole set is requested within ~0.4s so an early scroll never steps). Only
    // Save-Data connections stay on the keyframes + scrub window.
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    let fillTimer = 0;
    const fillStep = () => {
      const pending: number[] = [];
      for (let k = 0; k < N; k++) if (!imgs[k]) pending.push(k);
      if (!pending.length) return;
      pending.sort((a, b) => Math.abs(a - cur) - Math.abs(b - cur));
      pending.slice(0, 24).forEach((k) => ensure(k));
      fillTimer = window.setTimeout(fillStep, 40);
    };
    if (!saveData && !phone) fillTimer = window.setTimeout(fillStep, 0);

    const tick = () => {
      cur += (target - cur) * ease;
      draw(cur);
      if (document.hidden || Math.abs(target - cur) < 0.4) { running = false; return; }
      raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!running && !document.hidden) { running = true; raf = requestAnimationFrame(tick); } };
    const compute = () => {
      const rect = wrap.closest("section")?.getBoundingClientRect();
      const p = rect ? Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height))) : 0;
      target = Math.min(N - 1, p * (N - 1) + lead);
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
      window.clearTimeout(fillTimer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      data-solid
      aria-hidden
      // Positioned by the hero, with a separate art row on narrow phones.
      className="sevarog-stage pointer-events-none absolute inset-0"
    >
      <canvas ref={canvasRef} className="absolute bottom-0 left-[-20%] h-[140%] w-[140%] invert grayscale contrast-125 mix-blend-screen" />
    </div>
  );
}
