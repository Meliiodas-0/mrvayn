"use client";

import { useEffect, useRef } from "react";

/**
 * Global stickman cursor (desktop / fine-pointer / motion-allowed only).
 * The real cursor is hidden and a sword stickman is drawn at the pointer with
 * ZERO lag (it renders at the exact mouse position; run/lean/flip come from
 * mouse velocity). Enemies wander and ricochet around the page like they're
 * trapped, fleeing the cursor, and they stay out of your real content blocks
 * (any [data-solid] element) so they never overlap text/containers. Bring the
 * cursor onto one to trigger a slash combo. Pointer-events:none; pauses on tab
 * hide; touch / reduced-motion keep the normal cursor.
 */

const C = { bone: "#EAF0FF", volt: "#19E0FF", surge: "#FF2D6B", ion: "#B26BFF", mist: "#8A94A7" };
const COUNT = 13;
const E_MIN = 26, E_MAX = 78, WANDER = 240;
const FLEE_R = 130, FLEE_F = 520;
const RANGE = 70, SWING = 0.3;
const TOP = 72, SIDE = 12, BOT = 14, PAD = 16;

interface Rect { left: number; top: number; right: number; bottom: number; }
interface Enemy { x: number; y: number; vx: number; vy: number; alive: boolean; dying: number; phase: number; }
interface P { x: number; y: number; vx: number; vy: number; life: number; max: number; c: string; r: number; on: boolean; }
interface Ring { x: number; y: number; life: number; on: boolean; }
interface Pop { x: number; y: number; life: number; text: string; on: boolean; }

export function StickCursor() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    const c2d = canvas?.getContext("2d");
    if (!canvas || !c2d) return;
    const ctx = c2d;

    let W = 0, H = 0, dpr = 1;
    const m = { x: innerWidth / 2, y: innerHeight / 2 };
    let pmx = m.x, pmy = m.y, vx = 0, vy = 0, face = 1, runPhase = 0;
    let atk = -1, atkType = 0, atkFace = 1, combo = 0, comboT = 0, flip = -1, flipCd = 0;
    let occupied: Rect[] = [];

    const enemies: Enemy[] = [];
    const parts: P[] = [];
    const rings: Ring[] = [];
    const pops: Pop[] = [];
    for (let i = 0; i < 140; i++) parts.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 0, c: C.surge, r: 2, on: false });
    for (let i = 0; i < 12; i++) rings.push({ x: 0, y: 0, life: 0, on: false });
    for (let i = 0; i < 12; i++) pops.push({ x: 0, y: 0, life: 0, text: "", on: false });

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const inOcc = (x: number, y: number, pad: number) =>
      occupied.some((r) => x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad);
    const valid = (x: number, y: number) => x > SIDE && x < W - SIDE && y > TOP && y < H - BOT && !inOcc(x, y, PAD);

    const computeOccupied = () => {
      occupied = Array.from(document.querySelectorAll<HTMLElement>("[data-solid]"))
        .map((el) => el.getBoundingClientRect())
        .filter((r) => r.width > 0 && r.bottom > 0 && r.top < H && r.right > 0 && r.left < W)
        .map((r) => ({ left: r.left, top: r.top, right: r.right, bottom: r.bottom }));
    };

    const place = (e: Enemy) => {
      for (let t = 0; t < 60; t++) {
        const x = rand(SIDE + 10, W - SIDE - 10), y = rand(TOP + 10, H - BOT - 10);
        if (valid(x, y)) {
          e.x = x; e.y = y; e.vx = rand(-1, 1) * E_MAX; e.vy = rand(-1, 1) * E_MAX;
          e.alive = true; e.dying = 0; e.phase = Math.random() * 6.28; return;
        }
      }
      e.alive = false; // no gap available right now (re-tried next frames)
    };
    for (let i = 0; i < COUNT; i++) { const e: Enemy = { x: 0, y: 0, vx: 0, vy: 0, alive: false, dying: 0, phase: 0 }; enemies.push(e); }

    const burst = (x: number, y: number, n: number) => {
      for (let i = 0; i < n; i++) {
        const p = parts.find((q) => !q.on); if (!p) break;
        const a = Math.random() * 6.28, s = rand(60, 300);
        p.on = true; p.x = x; p.y = y; p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s;
        p.max = p.life = rand(0.3, 0.7); p.r = rand(1.5, 3.5); p.c = Math.random() > 0.5 ? C.surge : C.volt;
      }
    };
    const ring = (x: number, y: number) => { const r = rings.find((q) => !q.on); if (r) { r.on = true; r.x = x; r.y = y; r.life = 0.4; } };
    const pop = (x: number, y: number, t: string) => { const p = pops.find((q) => !q.on); if (p) { p.on = true; p.x = x; p.y = y; p.life = 0.9; p.text = t; } };

    const resize = () => {
      W = innerWidth; H = innerHeight; dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      computeOccupied();
      enemies.forEach(place);
    };

    let scrollPending = false;
    const onScroll = () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(() => { computeOccupied(); scrollPending = false; }); } };
    const onMove = (e: MouseEvent) => { m.x = e.clientX; m.y = e.clientY; };
    addEventListener("mousemove", onMove, { passive: true });
    addEventListener("resize", resize);
    addEventListener("scroll", onScroll, { passive: true });
    const occInterval = setInterval(computeOccupied, 500);
    document.documentElement.style.cursor = "none";
    resize();

    function drawStick(x: number, y: number, o: { color: string; face: number; phase: number; moving: boolean; scale: number; sword: number; swordLen: number; glow?: boolean }) {
      const { color, face: f, phase, moving, scale, sword, swordLen, glow } = o;
      const legLen = 12 * scale, torso = 13 * scale, headR = 4.6 * scale;
      const hipY = y - legLen, shoulderY = hipY - torso;
      ctx.strokeStyle = color; ctx.lineWidth = 2.3 * scale; ctx.lineCap = "round";
      const sw = moving ? Math.sin(phase) * 0.6 : Math.sin(phase * 0.25) * 0.08;
      ctx.beginPath(); ctx.moveTo(x, hipY); ctx.lineTo(x + Math.sin(sw) * legLen, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, hipY); ctx.lineTo(x - Math.sin(sw) * legLen, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, hipY); ctx.lineTo(x - (moving ? f * 3 : 0), shoulderY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, shoulderY + 1); ctx.lineTo(x - f * 7 * scale - Math.sin(sw) * 5, shoulderY + 8 * scale); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, shoulderY - headR, headR, 0, 6.2832); ctx.stroke();
      const handX = x + f * 8 * scale, handY = shoulderY + 6 * scale;
      const ax = Math.cos(sword) * f, ay = Math.sin(sword);
      ctx.beginPath(); ctx.moveTo(x, shoulderY + 1); ctx.lineTo(handX, handY); ctx.stroke();
      ctx.strokeStyle = C.volt; ctx.lineWidth = 2.6 * scale;
      if (glow) { ctx.shadowColor = C.volt; ctx.shadowBlur = 9; }
      ctx.beginPath(); ctx.moveTo(handX, handY); ctx.lineTo(handX + ax * swordLen, handY + ay * swordLen); ctx.stroke();
      ctx.shadowBlur = 0;
      return { handX, handY };
    }

    let last = performance.now(), raf = 0, running = true;
    const onVis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
    };
    document.addEventListener("visibilitychange", onVis);

    function loop(now: number) {
      if (!running) return;
      let dt = (now - last) / 1000; last = now; if (dt > 0.05) dt = 0.05;
      const tNow = now / 1000;

      // mouse velocity (no positional lag — figure is drawn at the exact pointer)
      vx = (m.x - pmx) / Math.max(dt, 0.001); vy = (m.y - pmy) / Math.max(dt, 0.001); pmx = m.x; pmy = m.y;
      const speed = Math.hypot(vx, vy);
      const moving = speed > 40;
      if (moving) { runPhase += dt * 18; if (Math.abs(vx) > 12) face = vx > 0 ? 1 : -1; } else { runPhase += dt * 4; }

      // nearest enemy
      let near: Enemy | null = null, nd = 1e9;
      for (const e of enemies) { if (!e.alive) continue; const d = Math.hypot(e.x - m.x, e.y - m.y); if (d < nd) { nd = d; near = e; } }

      // attack on proximity only
      if (atk < 0 && near && nd < RANGE) { atk = 0; atkType = (atkType + 1 + (Math.random() * 3) | 0) % 5; atkFace = near.x > m.x ? 1 : -1; }
      if (atk < 0 && flip < 0 && moving && speed > 1400 && flipCd <= 0 && !near) { flip = 0; flipCd = 1.6; }
      flipCd -= dt;
      if (comboT > 0) { comboT -= dt; if (comboT <= 0) combo = 0; }

      // swing
      if (atk >= 0) {
        atk += dt / SWING;
        if (atk > 0.12 && atk < 0.72) {
          const spin = atkType === 3;
          for (const e of enemies) {
            if (!e.alive) continue;
            const ex = e.x - m.x, d = Math.hypot(ex, e.y - m.y);
            if (d < RANGE + 6 && (spin || Math.sign(ex) === atkFace || d < 30)) {
              e.alive = false; e.dying = 0.4;
              combo = comboT > 0 ? combo + 1 : 1; comboT = 1.4;
              burst(e.x, e.y, 16 + Math.min(14, combo * 2)); ring(e.x, e.y);
              pop(e.x, e.y - 16, combo > 1 ? "x" + combo : "+1");
              setTimeout(() => place(e), 700 + Math.random() * 700);
            }
          }
        }
        if (atk >= 1) atk = -1;
      }
      if (flip >= 0) { flip += dt / 0.5; if (flip >= 1) flip = -1; }

      // enemies: wander + flee + ricochet (trapped)
      for (const e of enemies) {
        if (!e.alive) { if (e.dying > 0) e.dying -= dt; else if (Math.random() < dt * 0.6) place(e); continue; }
        e.phase += dt * 5;
        // coordinated flow field -> enemies swirl in shifting patterns (not random twitching)
        const fa = Math.sin(e.x * 0.006 + tNow * 0.5) + Math.cos(e.y * 0.006 - tNow * 0.4) + tNow * 0.22;
        e.vx += Math.cos(fa) * WANDER * dt; e.vy += Math.sin(fa) * WANDER * dt;
        e.vx += rand(-1, 1) * WANDER * 0.2 * dt; e.vy += rand(-1, 1) * WANDER * 0.2 * dt;
        const dxc = e.x - m.x, dyc = e.y - m.y, dc = Math.hypot(dxc, dyc) || 1;
        if (dc < FLEE_R) { e.vx += (dxc / dc) * FLEE_F * dt; e.vy += (dyc / dc) * FLEE_F * dt; }
        // separation — keep enemies from stacking on each other
        for (const o of enemies) {
          if (o === e || !o.alive) continue;
          const sx = e.x - o.x, sy = e.y - o.y, sd = Math.hypot(sx, sy);
          if (sd > 0.1 && sd < 46) { e.vx += (sx / sd) * 680 * dt; e.vy += (sy / sd) * 680 * dt; }
        }
        let sp = Math.hypot(e.vx, e.vy);
        if (sp > E_MAX) { e.vx = (e.vx / sp) * E_MAX; e.vy = (e.vy / sp) * E_MAX; sp = E_MAX; }
        if (sp < E_MIN) { const a = Math.atan2(e.vy || rand(-1, 1), e.vx || rand(-1, 1)); e.vx = Math.cos(a) * E_MIN; e.vy = Math.sin(a) * E_MIN; }
        let nx = e.x + e.vx * dt, ny = e.y + e.vy * dt;
        if (nx < SIDE || nx > W - SIDE) { e.vx = -e.vx; nx = Math.max(SIDE, Math.min(W - SIDE, nx)); }
        if (ny < TOP || ny > H - BOT) { e.vy = -e.vy; ny = Math.max(TOP, Math.min(H - BOT, ny)); }
        if (inOcc(nx, ny, PAD)) { // ricochet off a content block
          if (!inOcc(e.x, ny, PAD)) { e.vx = -e.vx; nx = e.x; }
          else if (!inOcc(nx, e.y, PAD)) { e.vy = -e.vy; ny = e.y; }
          else { e.vx = -e.vx; e.vy = -e.vy; nx = e.x; ny = e.y; }
        }
        e.x = nx; e.y = ny;
        if (inOcc(e.x, e.y, 0)) place(e); // content scrolled onto it -> relocate
      }

      // particles / rings / pops
      for (const p of parts) { if (!p.on) continue; p.life -= dt; if (p.life <= 0) { p.on = false; continue; } p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.9; p.vy *= 0.9; }
      for (const r of rings) { if (r.on) { r.life -= dt; if (r.life <= 0) r.on = false; } }
      for (const p of pops) { if (p.on) { p.life -= dt; p.y -= dt * 26; if (p.life <= 0) p.on = false; } }

      // ---- render ----
      ctx.clearRect(0, 0, W, H);

      for (const e of enemies) {
        if (e.alive) {
          drawStick(e.x, e.y, { color: C.mist, face: e.x > m.x ? -1 : 1, phase: e.phase, moving: true, scale: 0.9, sword: -0.7, swordLen: 15 });
          ctx.fillStyle = C.surge; ctx.fillRect(e.x - 1.5, e.y - 33, 3, 3);
        } else if (e.dying > 0) {
          ctx.globalAlpha = Math.max(0, e.dying / 0.4); ctx.save(); ctx.translate(e.x, e.y); ctx.rotate((1 - e.dying / 0.4) * 1.4);
          drawStick(0, 0, { color: C.surge, face: 1, phase: 0, moving: false, scale: 0.88, sword: -0.7, swordLen: 13 }); ctx.restore(); ctx.globalAlpha = 1;
        }
      }
      for (const r of rings) { if (!r.on) continue; const t = 1 - r.life / 0.4; ctx.globalAlpha = r.life / 0.4 * 0.7; ctx.strokeStyle = C.volt; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(r.x, r.y, 6 + t * 34, 0, 6.2832); ctx.stroke(); ctx.globalAlpha = 1; }
      for (const p of parts) { if (!p.on) continue; ctx.globalAlpha = Math.max(0, p.life / p.max); ctx.fillStyle = p.c; ctx.fillRect(p.x - p.r / 2, p.y - p.r / 2, p.r, p.r); }
      ctx.globalAlpha = 1;
      for (const p of pops) { if (!p.on) continue; ctx.globalAlpha = Math.min(1, p.life / 0.5); ctx.fillStyle = C.surge; ctx.font = "700 13px 'Space Mono', monospace"; ctx.textAlign = "center"; ctx.fillText(p.text, p.x, p.y); ctx.globalAlpha = 1; }
      ctx.textAlign = "left";

      // player stickman at the exact pointer
      ctx.save();
      ctx.translate(m.x, m.y + 24);
      if (flip >= 0) { ctx.translate(0, -16); ctx.rotate(flip * 6.2832 * face); ctx.translate(0, 16); }
      let sword = moving ? -0.95 : -0.62 + Math.sin(now / 380) * 0.14;
      let swordLen = 22;
      if (atk >= 0) {
        const p = atk, e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; // easeInOutCubic
        if (atkType === 0) sword = (-135 + e * 160) * (Math.PI / 180);
        else if (atkType === 1) sword = (-85 + e * 175) * (Math.PI / 180);
        else if (atkType === 2) { sword = -0.1; swordLen = 22 + Math.sin(p * Math.PI) * 18; }
        else if (atkType === 3) sword = e * 6.2832 - Math.PI / 2;
        else sword = (75 - e * 165) * (Math.PI / 180);
        // slash wedge
        const hx = face * 8, hy = -7, a1 = sword, a0 = sword - face * 0.9;
        const g = ctx.createRadialGradient(hx, hy, 4, hx, hy, swordLen);
        g.addColorStop(0, "rgba(25,224,255,0)"); g.addColorStop(0.7, "rgba(25,224,255,0.28)"); g.addColorStop(1, "rgba(255,45,107,0.32)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.arc(hx, hy, swordLen, Math.min(a0, a1), Math.max(a0, a1)); ctx.closePath(); ctx.fill();
      }
      drawStick(0, 0, { color: C.bone, face, phase: runPhase, moving, scale: 1.12, sword, swordLen, glow: true });
      ctx.restore();

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(occInterval);
      removeEventListener("mousemove", onMove);
      removeEventListener("resize", resize);
      removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[95]" />;
}
