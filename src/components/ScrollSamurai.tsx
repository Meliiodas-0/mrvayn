"use client";

import { useEffect, useRef } from "react";
import { ROG_OFFSETS, ROG_OFFSET_MEAN } from "@/data/rogOffsets";

/**
 * ROG, the resident wraith. A 200-frame transparent-WebP sequence on a canvas,
 * scrubbed smoothly by scroll. CALM by design (owner: no shake): no lean, no
 * glitch, no pulses, just the eased frame scrub at a UNIFORM faint opacity so he
 * reads as the same quiet ink figure from the hero to the footer.
 * The ink treatment is baked into the frames (scripts/rog_pipeline.py), so the
 * canvas runs no CSS filter. Frames load lazily around the scrub position and
 * fill in during idle time. prefers-reduced-motion: static poster frame.
 */
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
      // Hug the RIGHT edge of the stage on every device (owner: keep him far right);
      // frames are body-centred at export, so the placement is stable.
      ctx.drawImage(im, W - dw + dxFrac * dw, H - dh, dw, dh);
    };

    const q = new URLSearchParams(location.search);
    const reduceOrStill = window.matchMedia("(prefers-reduced-motion: reduce)").matches || q.has("still") || q.has("cine");
    const phone = window.matchMedia("(max-width: 1023.98px)").matches;
    const hi = !phone && (window.devicePixelRatio || 1) >= 1.5;
    const folder = phone ? "rog-sm" : hi ? "rog-hi" : "rog";
    const m = "radial-gradient(64% 70% at 50% 56%, #000 52%, transparent 92%)";
    canvas.style.setProperty("mask-image", m); canvas.style.setProperty("-webkit-mask-image", m);
    // UNIFORM presence: same opacity everywhere. Fainter on phone where he sits
    // beside centred content. Set before the reduced-motion branch so the static
    // poster gets the same weight.
    wrap.style.opacity = String(phone ? 0.25 : 0.7);

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
    // Lazy frame slots: the hero frame first (high priority), then every 10th as
    // keyframes, then a window around the scrub position, then the rest on idle.
    const imgs: (HTMLImageElement | null)[] = Array(N).fill(null);
    const loaded = (k: number) => { const im = imgs[k]; return im && im.complete && im.naturalWidth ? im : null; };
    const repaint = () => { lastI = -1; draw(cur); };
    const ensure = (k: number, prio: "high" | "auto" = "auto") => {
      if (k < 0 || k >= N || imgs[k]) return;
      const im = new Image(); im.decoding = "async"; im.fetchPriority = prio; im.src = frameSrc(folder, k);
      im.onload = () => { if (!running) repaint(); };
      imgs[k] = im;
    };
    // nearest loaded frame to i (worst case with 10-frame keyframes: 5 frames off)
    const nearest = (i: number) => {
      for (let d = 0; d <= 10; d++) {
        const a = loaded(i - d); if (a) return a;
        const b = loaded(i + d); if (b) return b;
      }
      return lastGood;
    };
    function draw(idx: number) {
      let i = Math.round(idx); i = Math.max(0, Math.min(N - 1, i));
      for (let k = i - 8; k <= i + 16; k++) ensure(k);
      if (i === lastI) return;
      lastI = i; dxFrac = offsetForFrame(i);
      paint(nearest(i));
    }
    ensure(HERO_IDX, "high");
    for (let k = 10; k < N; k += 10) ensure(k);
    window.addEventListener("resize", repaint);

    // fill the rest after load, nearest-to-scrub first, in idle time (skips Save-Data)
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const fillRest = () => {
      if (saveData) return;
      const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
      const idle = (cb: () => void) => (w.requestIdleCallback ? w.requestIdleCallback(cb) : window.setTimeout(cb, 200));
      const step = () => {
        const pending: number[] = [];
        for (let k = 0; k < N; k++) if (!imgs[k]) pending.push(k);
        if (!pending.length) return;
        pending.sort((a, b) => Math.abs(a - cur) - Math.abs(b - cur));
        pending.slice(0, 16).forEach((k) => ensure(k));
        idle(step);
      };
      idle(step);
    };
    if (document.readyState === "complete") fillRest();
    else window.addEventListener("load", fillRest, { once: true });

    const tick = () => {
      cur += (target - cur) * ease;
      draw(cur);
      if (document.hidden || Math.abs(target - cur) < 0.4) { running = false; return; }
      raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!running && !document.hidden) { running = true; raf = requestAnimationFrame(tick); } };
    const compute = () => {
      const vh = window.innerHeight, y = window.scrollY;
      const max = document.documentElement.scrollHeight - vh;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      target = Math.min(N - 1, Math.sqrt(p) * (N - 1) + lead);
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
      window.removeEventListener("load", fillRest);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      data-solid
      aria-hidden
      // Right-anchored everywhere. Desktop: hugs the viewport edge up to 1920 and the
      // 1440 content column's edge on wider screens (2K), so he stays beside the copy
      // instead of 500px outside it. Phone: right-anchored, smaller and fainter, so he
      // never stands behind the centred CTAs. Short desktop viewports cap the height.
      className="pointer-events-none fixed bottom-0 z-fx h-[82vh] w-full max-w-[940px] max-lg:left-auto max-lg:right-[max(-18vw,-64px)] max-lg:h-[54vh] max-lg:w-[78vw] lg:left-auto lg:right-[max(1vw,calc((100vw_-_1440px)/2_-_12.5vw))] lg:w-[46vw] lg:[@media(max-height:1150px)]:h-[62vh]"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
