"use client";

import { useEffect, useRef } from "react";
import { readThemeColors, THEME_EVENT } from "@/lib/themeColors";

/**
 * Hero environment: a few detailed gears turning at the edges (solid bodies,
 * rims, bolts, hubs) plus slow-drifting embers for atmosphere. No escalator.
 * Canvas-2D, transform/opacity only; pauses off-screen + on tab hide; reduced-
 * motion / ?still / ?cine render one static frame so the page can idle for
 * screenshots.
 */

const TAU = Math.PI * 2;

interface Gear { x: number; y: number; r: number; teeth: number; rot: number; spd: number; }
interface Ember { x: number; y: number; vx: number; vy: number; r: number; a: number; c: string; }

export function HeroMachinery() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const c2d = canvas?.getContext("2d");
    if (!canvas || !c2d) return;
    const ctx = c2d;
    let C = readThemeColors();
    const q = new URLSearchParams(location.search);
    const staticFrame = window.matchMedia("(prefers-reduced-motion: reduce)").matches || q.has("still") || q.has("cine");

    let W = 0, H = 0, dpr = 1, U = 1;
    let gears: Gear[] = [];
    let embers: Ember[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const build = () => {
      U = Math.max(0.6, Math.min(W, H) / 760);
      // refined machinery: solid, monochrome gears nested symmetrically into both
      // bottom corners, framing the central ronin
      gears = [
        { x: W * 0.03, y: H * 1.08, r: 170 * U, teeth: 24, rot: 0, spd: 0.1 },
        { x: W * 0.21, y: H * 1.14, r: 104 * U, teeth: 18, rot: 0.3, spd: -0.14 },
        { x: W * -0.05, y: H * 0.74, r: 82 * U, teeth: 15, rot: 0.1, spd: 0.16 },
        { x: W * 0.97, y: H * 1.08, r: 170 * U, teeth: 24, rot: 0.5, spd: -0.1 },
        { x: W * 0.79, y: H * 1.14, r: 104 * U, teeth: 18, rot: 0.2, spd: 0.14 },
        { x: W * 1.05, y: H * 0.74, r: 82 * U, teeth: 15, rot: 0.3, spd: -0.16 },
      ];
      const n = W < 768 ? 12 : 26;
      embers = [];
      for (let i = 0; i < n; i++) embers.push({ x: rand(0, W), y: rand(H * 0.2, H), vx: rand(-4, 4), vy: rand(-14, -4), r: rand(0.6, 2) * U, a: rand(0.08, 0.42), c: Math.random() > 0.55 ? C.volt : C.ion });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, rect.width); H = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const drawGear = (g: Gear) => {
      const ri = g.r * 0.72, tip = (TAU / g.teeth) * 0.28;
      ctx.save(); ctx.translate(g.x, g.y); ctx.rotate(g.rot);
      ctx.beginPath();
      for (let i = 0; i < g.teeth; i++) {
        const a0 = (i / g.teeth) * TAU, a1 = a0 + TAU / g.teeth, cc = a0 + (TAU / g.teeth) * 0.5;
        ctx.lineTo(Math.cos(a0) * ri, Math.sin(a0) * ri);
        ctx.lineTo(Math.cos(cc - tip) * g.r, Math.sin(cc - tip) * g.r);
        ctx.lineTo(Math.cos(cc + tip) * g.r, Math.sin(cc + tip) * g.r);
        ctx.lineTo(Math.cos(a1) * ri, Math.sin(a1) * ri);
      }
      ctx.closePath();
      // SOLID monochrome body so it reads as a real machined part, not a neon outline
      const grd = ctx.createLinearGradient(0, -g.r, 0, g.r);
      grd.addColorStop(0, "#2b3650"); grd.addColorStop(0.6, "#161e30"); grd.addColorStop(1, "#0c1320");
      ctx.fillStyle = grd; ctx.fill();
      ctx.lineWidth = 1.5 * U; ctx.strokeStyle = "rgba(138,148,167,0.45)"; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, ri * 0.84, 0, TAU); ctx.lineWidth = 2.5 * U; ctx.strokeStyle = "rgba(20,27,44,0.95)"; ctx.stroke();
      ctx.fillStyle = "rgba(138,148,167,0.35)";
      for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU; ctx.beginPath(); ctx.arc(Math.cos(a) * g.r * 0.46, Math.sin(a) * g.r * 0.46, g.r * 0.05, 0, TAU); ctx.fill(); }
      ctx.beginPath(); ctx.arc(0, 0, g.r * 0.2, 0, TAU); ctx.fillStyle = "#1a2233"; ctx.fill();
      ctx.lineWidth = 1.5 * U; ctx.strokeStyle = "rgba(138,148,167,0.4)"; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, g.r * 0.07, 0, TAU); ctx.fillStyle = "rgba(138,148,167,0.55)"; ctx.fill();
      ctx.restore();
    };

    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 0.5; // subtle background texture, never a focal point
      for (const g of gears) drawGear(g);
      ctx.globalAlpha = 1;
      for (const e of embers) { ctx.globalAlpha = e.a * 0.8; ctx.fillStyle = e.c; ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, TAU); ctx.fill(); }
      ctx.globalAlpha = 1;
    };

    let raf = 0, last = performance.now(), running = false, onScreen = true;
    const loop = (now: number) => {
      if (!running) return;
      let dt = (now - last) / 1000; last = now; if (dt > 0.05) dt = 0.05;
      for (const g of gears) g.rot += g.spd * dt;
      for (const e of embers) {
        e.x += e.vx * dt; e.y += e.vy * dt;
        if (e.y < -10 || e.x < -10 || e.x > W + 10) { e.x = rand(0, W); e.y = H + rand(0, 40); e.vy = rand(-14, -4); e.vx = rand(-4, 4); }
      }
      frame();
      raf = requestAnimationFrame(loop);
    };
    const startLoop = () => { if (!running && onScreen && !document.hidden) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); } };
    const stopLoop = () => { running = false; cancelAnimationFrame(raf); };

    resize();
    window.addEventListener("resize", resize);

    if (staticFrame) { frame(); return () => window.removeEventListener("resize", resize); }

    const onVis = () => (document.hidden ? stopLoop() : startLoop());
    document.addEventListener("visibilitychange", onVis);
    const onTheme = () => { C = readThemeColors(); build(); };
    window.addEventListener(THEME_EVENT, onTheme);
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; onScreen ? startLoop() : stopLoop(); }, { threshold: 0 });
    io.observe(canvas);
    startLoop();

    return () => {
      stopLoop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener(THEME_EVENT, onTheme);
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-0 h-full w-full" />;
}
