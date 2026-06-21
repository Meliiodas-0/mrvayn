"use client";

import { useEffect, useRef } from "react";

/**
 * Global stickman cursor. The real cursor is hidden (desktop, fine-pointer,
 * motion allowed) and a sword-wielding stickman is drawn at the pointer:
 *  - idle  : gentle sword bob when the pointer is still
 *  - run   : legs cycle + lean while moving; an occasional front-flip on fast moves
 *  - attack: a combo of sword animations, but ONLY when you bring the cursor onto
 *            an enemy — otherwise it just idles/runs.
 * Enemies are scattered in the page's empty side-margins (viewport-fixed) so they
 * never overlap text or containers. Pointer-events:none — never blocks the page.
 * Touch / reduced-motion / narrow screens fall back to the normal cursor.
 */

const C = { bone: "#EAF0FF", volt: "#19E0FF", surge: "#FF2D6B", mist: "#8A94A7", steel: "#1A2233" };
const ATTACK_RANGE = 64;
const SWING = 0.32;
const CONTENT_MAX = 1180; // matches the centred max-width — margins outside are empty

interface Enemy { x: number; y: number; alive: boolean; dying: number; phase: number; }
interface P { x: number; y: number; vx: number; vy: number; life: number; max: number; c: string; on: boolean; }

export function StickCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return; // keep the normal cursor

    const canvas = canvasRef.current;
    const maybeCtx = canvas?.getContext("2d");
    if (!canvas || !maybeCtx) return; // never hide the real cursor without a stickman
    const ctx = maybeCtx;
    let W = 0, H = 0, dpr = 1;

    // state
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, has: false };
    const me = { x: mouse.x, y: mouse.y };
    let face = 1, runPhase = 0, vmag = 0;
    let atk = -1, atkType = 0, atkFace = 1;
    let flip = -1, flipCd = 0;
    const enemies: Enemy[] = [];
    const parts: P[] = [];
    for (let i = 0; i < 90; i++) parts.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 0, c: C.surge, on: false });

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const margin = () => Math.max(0, (W - CONTENT_MAX) / 2);

    const placeEnemy = (e: Enemy) => {
      const m = margin();
      if (m < 64) { e.alive = false; return; } // no safe room (narrow) — skip
      const side = Math.random() < 0.5 ? 0 : 1;
      e.x = side === 0 ? rand(16, m - 24) : rand(W - m + 24, W - 16);
      e.y = rand(96, H - 40);
      e.alive = true; e.dying = 0; e.phase = Math.random() * 6.28;
    };

    const targetCount = () => (margin() >= 64 ? 5 : 0);

    const burst = (x: number, y: number, c: string, n: number) => {
      for (let i = 0; i < n; i++) {
        const p = parts.find((q) => !q.on); if (!p) break;
        const a = Math.random() * 6.28, s = rand(40, 220);
        p.on = true; p.x = x; p.y = y; p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s;
        p.max = p.life = rand(0.3, 0.6); p.c = c;
      }
    };

    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // (re)seed enemies for the new layout
      enemies.length = 0;
      for (let i = 0; i < targetCount(); i++) { const e: Enemy = { x: 0, y: 0, alive: false, dying: 0, phase: 0 }; placeEnemy(e); enemies.push(e); }
    };

    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.has = true; };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    document.documentElement.style.cursor = "none";
    resize();

    let last = performance.now(), raf = 0, running = true;
    const onVis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
    };
    document.addEventListener("visibilitychange", onVis);

    function drawStick(x: number, y: number, o: { color: string; face: number; phase: number; moving: boolean; scale: number; sword: number; swordLen: number }) {
      const { color, face: f, phase, moving, scale, sword, swordLen } = o;
      const legLen = 12 * scale, torso = 13 * scale, headR = 4.5 * scale;
      const hipY = y - legLen, shoulderY = hipY - torso;
      ctx.strokeStyle = color; ctx.lineWidth = 2.2 * scale; ctx.lineCap = "round";
      const sw = moving ? Math.sin(phase) * 0.55 : 0.12;
      ctx.beginPath(); ctx.moveTo(x, hipY); ctx.lineTo(x + Math.sin(sw) * legLen, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, hipY); ctx.lineTo(x - Math.sin(sw) * legLen, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, hipY); ctx.lineTo(x, shoulderY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, shoulderY + 1); ctx.lineTo(x - f * 7 * scale - Math.sin(sw) * 5, shoulderY + 8 * scale); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, shoulderY - headR, headR, 0, 6.2832); ctx.stroke();
      // sword arm + blade
      const handX = x + f * 8 * scale, handY = shoulderY + 6 * scale;
      const ax = Math.cos(sword) * f, ay = Math.sin(sword);
      ctx.beginPath(); ctx.moveTo(x, shoulderY + 1); ctx.lineTo(handX, handY); ctx.stroke();
      ctx.strokeStyle = C.volt; ctx.lineWidth = 2.6 * scale; ctx.shadowColor = C.volt; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.moveTo(handX, handY); ctx.lineTo(handX + ax * swordLen, handY + ay * swordLen); ctx.stroke();
      ctx.shadowBlur = 0;
    }

    function loop(now: number) {
      if (!running) return;
      let dt = (now - last) / 1000; last = now; if (dt > 0.05) dt = 0.05;

      // follow cursor (slight lag => "runs toward" it)
      const dx = mouse.x - me.x, dy = mouse.y - me.y, dist = Math.hypot(dx, dy);
      vmag = dist;
      if (dist > 1) { const k = Math.min(1, dt * 9); me.x += dx * k; me.y += dy * k; }
      const moving = dist > 6;
      if (moving) { runPhase += dt * 16; if (Math.abs(dx) > 2) face = dx > 0 ? 1 : -1; }

      // nearest enemy
      let near: Enemy | null = null, nd = 1e9;
      for (const e of enemies) { if (!e.alive) continue; const d = Math.hypot(e.x - me.x, e.y - me.y); if (d < nd) { nd = d; near = e; } }

      // decide state: attack only when the user brings the cursor onto an enemy
      if (atk < 0 && near && nd < ATTACK_RANGE) {
        atk = 0; atkType = (atkType + 1 + Math.floor(Math.random() * 3)) % 5; atkFace = (near.x > me.x ? 1 : -1);
      }
      if (atk < 0 && flip < 0) { flipCd -= dt; if (moving && vmag > 90 && flipCd <= 0 && !near) { flip = 0; flipCd = 2.2; } }

      // attack swing
      if (atk >= 0) {
        atk += dt / SWING;
        if (atk > 0.15 && atk < 0.75) {
          const spin = atkType === 3;
          for (const e of enemies) {
            if (!e.alive) continue;
            const ex = e.x - me.x, d = Math.hypot(ex, e.y - me.y);
            if (d < ATTACK_RANGE && (spin || Math.sign(ex) === atkFace || d < 28)) {
              e.alive = false; e.dying = 0.4; burst(e.x, e.y, C.surge, 14);
              setTimeout(() => { if (canvasRef.current) placeEnemy(e); }, 1100 + Math.random() * 900);
            }
          }
        }
        if (atk >= 1) atk = -1;
      }
      if (flip >= 0) { flip += dt / 0.55; if (flip >= 1) flip = -1; }

      // particles + enemy bob
      for (const p of parts) { if (!p.on) continue; p.life -= dt; if (p.life <= 0) { p.on = false; continue; } p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.92; p.vy *= 0.92; }
      for (const e of enemies) { if (e.alive) e.phase += dt * 4; else if (e.dying > 0) e.dying -= dt; }

      // ---- render ----
      ctx.clearRect(0, 0, W, H);
      for (const e of enemies) {
        if (e.alive) {
          const f = e.x > me.x ? -1 : 1;
          drawStick(e.x, e.y, { color: C.mist, face: f, phase: e.phase, moving: true, scale: 0.92, sword: -0.7, swordLen: 16 });
          ctx.fillStyle = C.surge; ctx.fillRect(e.x - 1.5, e.y - 34, 3, 3);
        } else if (e.dying > 0) {
          ctx.globalAlpha = Math.max(0, e.dying / 0.4); ctx.save(); ctx.translate(e.x, e.y); ctx.rotate((1 - e.dying / 0.4) * 1.3);
          drawStick(0, 0, { color: C.surge, face: 1, phase: 0, moving: false, scale: 0.9, sword: -0.7, swordLen: 14 }); ctx.restore(); ctx.globalAlpha = 1;
        }
      }
      for (const p of parts) { if (!p.on) continue; ctx.globalAlpha = Math.max(0, p.life / p.max); ctx.fillStyle = p.c; ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3); }
      ctx.globalAlpha = 1;

      // player stickman at cursor
      ctx.save();
      ctx.translate(me.x, me.y + 26); // feet near the pointer
      if (flip >= 0) { ctx.translate(0, -16); ctx.rotate(flip * Math.PI * 2 * face); ctx.translate(0, 16); }
      let sword = moving ? -0.9 : -0.65 + Math.sin(now / 400) * 0.12; // idle bob
      let swordLen = 22;
      if (atk >= 0) {
        const p = atk;
        if (atkType === 0) sword = (-130 + p * 150) * (Math.PI / 180);
        else if (atkType === 1) sword = (-80 + p * 165) * (Math.PI / 180);
        else if (atkType === 2) { sword = -0.1; swordLen = 22 + Math.sin(p * Math.PI) * 16; }
        else if (atkType === 3) sword = p * Math.PI * 2 - Math.PI / 2;
        else sword = (70 - p * 150) * (Math.PI / 180);
        // swing trail
        ctx.strokeStyle = "rgba(25,224,255,0.3)"; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.arc(face * 8, -7, swordLen, sword - 0.6, sword + 0.1); ctx.stroke();
      }
      drawStick(0, 0, { color: C.bone, face, phase: runPhase, moving, scale: 1.1, sword, swordLen });
      ctx.restore();

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[95]" />;
}
