"use client";

import { useEffect, useRef } from "react";
import { ROG_OFFSETS, ROG_OFFSET_MEAN } from "@/data/rogOffsets";

/**
 * ROG, the resident wraith. A 200-frame transparent-WebP sequence on a canvas,
 * scrubbed smoothly by scroll. CALM by design (owner: no shake): no lean, no
 * glitch, no pulses, just the eased frame scrub at a UNIFORM faint opacity so he
 * reads as the same quiet ghost from the hero to the footer.
 * prefers-reduced-motion: static poster frame. Phone: small tier, same scrub.
 */
const FRAMES = 200;
const HERO_IDX = 0;
const frameSrc = (folder: string, i: number) => `/${folder}/f_${String(i).padStart(3, "0")}.webp?v=9`;
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
    let anchorRight = false;
    const paint = (im: HTMLImageElement | null) => {
      ctx.clearRect(0, 0, W, H);
      if (!im || !im.naturalWidth) return;
      lastGood = im;
      const iw = im.naturalWidth, ih = im.naturalHeight;
      const s = Math.min(W / iw, H / ih);
      const dw = iw * s, dh = ih * s;
      // Desktop: hug the RIGHT edge of the stage (owner: keep him far right);
      // phone: centered. Frames are body-centred at export, so both are stable.
      const x = anchorRight ? W - dw + dxFrac * dw : (W - dw) / 2 + dxFrac * dw;
      ctx.drawImage(im, x, H - dh, dw, dh);
    };

    const q = new URLSearchParams(location.search);
    const reduceOrStill = window.matchMedia("(prefers-reduced-motion: reduce)").matches || q.has("still") || q.has("cine");
    const phone = window.matchMedia("(max-width: 1023.98px)").matches;
    anchorRight = !phone;
    const hi = !phone && (window.devicePixelRatio || 1) >= 1.5;
    const folder = phone ? "rog-sm" : hi ? "rog-hi" : "rog";
    if (!phone) { const m = "radial-gradient(64% 70% at 50% 56%, #000 52%, transparent 92%)"; canvas.style.setProperty("mask-image", m); canvas.style.setProperty("-webkit-mask-image", m); }

    resize();
    window.addEventListener("resize", resize);

    if (reduceOrStill) {
      const im = new Image(); im.decoding = "async"; im.src = frameSrc(folder, HERO_IDX);
      const drawStatic = () => { resize(); paint(im.complete && im.naturalWidth ? im : lastGood); };
      im.onload = drawStatic; window.removeEventListener("resize", resize); window.addEventListener("resize", drawStatic); drawStatic();
      return () => window.removeEventListener("resize", drawStatic);
    }

    const idxs: number[] = [];
    for (let i = 0; i < FRAMES; i += 1) idxs.push(i);
    const N = idxs.length;
    // UNIFORM ink presence: same opacity everywhere. Higher on desktop so the
    // darkened wraith (canvas filter below) reads as a real anchor on the paper,
    // fainter on phone where he sits behind centered content.
    const op = phone ? 0.4 : 0.7;
    wrap.style.opacity = String(op);
    const ease = phone ? 0.22 : 0.14;
    const lead = phone ? 9 : 0;

    let target = 0, cur = 0, raf = 0, running = false, lastI = -1;
    const imgs: HTMLImageElement[] = idxs.map((i) => { const im = new Image(); im.decoding = "async"; im.src = frameSrc(folder, i); return im; });
    const draw = (idx: number) => {
      let i = Math.round(idx); i = Math.max(0, Math.min(N - 1, i));
      if (i === lastI) return;
      lastI = i; dxFrac = offsetForFrame(idxs[i]);
      const im = imgs[i]; paint(im && im.complete && im.naturalWidth ? im : lastGood);
    };
    const repaint = () => { lastI = -1; draw(cur); };
    imgs.forEach((im) => { im.onload = () => { if (!running) repaint(); }; });
    window.addEventListener("resize", repaint);

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
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      data-solid
      aria-hidden
      // Right-anchored on desktop (owner: further right = more visible next to the
      // left content columns), centered on phone. Short desktop viewports cap height.
      className="pointer-events-none fixed bottom-0 z-0 h-[82vh] w-full max-w-[940px] max-lg:inset-x-0 max-lg:mx-auto max-lg:h-[66vh] lg:left-auto lg:right-[1vw] lg:w-[46vw] lg:[@media(max-height:1150px)]:h-[62vh]"
    >
      {/* Ink-on-paper treatment: the render was lit for a black scene (bone-white),
          so on the light theme we grayscale + darken it into a solid dark wraith that
          reads as an ink illustration instead of a washed-out ghost. */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ filter: "grayscale(1) brightness(0.5) contrast(1.4)" }}
      />
    </div>
  );
}
