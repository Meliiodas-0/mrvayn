"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Cinematic intro (choreographed):
 *  1) hero drops a superhero kneel-landing in the centre — one knee down, looks
 *     down then up, sword raised up-right (impact shockwave + dust).
 *  2) enemy 1 rushes in and is knocked out; enemy 2 same.
 *  3) six enemies surround him; he struggles, then unleashes an explosion that
 *     blasts them all, followed by a backflip-slash flourish.
 *  4) MRVAYN glows (modest size) and disintegrates Thanos-style (pixel dust
 *     blown away left-to-right), auto-transitioning to the site.
 * Canvas + responsive. Once per session, hard auto-dismiss, click/any-key skip,
 * reduced-motion skips.
 */

const C = { void: "#07090F", bone: "#EAF0FF", volt: "#19E0FF", surge: "#FF2D6B", ion: "#B26BFF", mist: "#8A94A7" };

const LAND = 0.55, LOOK = 0.8, RISE = 1.1, RISE_END = 1.4;
const E1D = 1.85, E2D = 2.5;
const SURR_APP = 2.65, SURR_SET = 3.55, EXPLODE = 4.5, KILL = 4.8, FLIP_END = 5.45;
const BATTLE_FADE = 5.45, TITLE = 6.15, ASH = 7.05, END = 8.6;

interface Pt { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; c: string; on: boolean; }
interface Dust { hx: number; hy: number; vx: number; vy: number; delay: number; }

export function BootSequence() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [show, setShow] = useState(false);
  const skipRef = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = sessionStorage.getItem("booted") === "1"; sessionStorage.setItem("booted", "1"); } catch { /* */ }
    if (!reduce && !seen) setShow(true);
  }, []);

  const done = useCallback(() => setShow(false), []);

  useEffect(() => {
    if (!show) return;
    const canvas = ref.current;
    const c2d = canvas?.getContext("2d");
    if (!canvas || !c2d) { const t = setTimeout(done, 100); return () => clearTimeout(t); }
    const ctx = c2d;

    let W = 0, H = 0, dpr = 1, U = 1, cx = 0, cy = 0;
    const resize = () => {
      W = innerWidth; H = innerHeight; dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      U = Math.max(0.9, Math.min(W, H) / 360); cx = W / 2; cy = H * 0.6;
    };
    resize(); addEventListener("resize", resize);

    const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    const cl = (p: number) => Math.max(0, Math.min(1, p));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * cl(t);

    const line = [
      { side: 1, appS: RISE_END, appE: 1.75, death: E1D },
      { side: -1, appS: 2.0, appE: 2.4, death: E2D },
    ];
    const ring = Array.from({ length: 6 }, (_, i) => ({ ang: (i / 6) * Math.PI * 2 + 0.35, bob: i }));

    const pts: Pt[] = [];
    for (let i = 0; i < 520; i++) pts.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 0, r: 0, c: C.surge, on: false });
    const seeded = new Set<string>();
    let dust: Dust[] = [];
    let dustBuilt = false;
    const TITLE_SIZE = Math.min(W * 0.115, 84 * U);
    const titleY = cy - 4 * U;

    const burst = (x: number, y: number, n: number, big = false) => {
      for (let i = 0; i < n; i++) { const p = pts.find((q) => !q.on); if (!p) break; const a = Math.random() * 6.28, s = (big ? 1 : 0.55) * (50 + Math.random() * 280); p.on = true; p.x = x; p.y = y; p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s - 30 * U; p.max = p.life = 0.4 + Math.random() * 0.4; p.r = (big ? 2.6 : 1.7) * U; p.c = Math.random() > 0.5 ? C.surge : C.volt; }
    };

    function stick(x: number, y: number, o: { color: string; s: number; sword: number; swordLen: number; lean: number; crouch: number; alpha: number; phase: number; moving: boolean; glow?: boolean }) {
      const { color, s, sword, swordLen, lean, crouch, alpha, phase, moving, glow } = o;
      const legLen = 13 * s * (1 - crouch * 0.5), torso = 14 * s * (1 - crouch * 0.3), headR = 5 * s;
      const hipY = y - legLen, shoulderY = hipY - torso, sx = x + lean;
      ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = 2.4 * s; ctx.lineCap = "round";
      const sw = moving ? Math.sin(phase) * 0.6 : 0.2;
      ctx.beginPath(); ctx.moveTo(x, hipY); ctx.lineTo(x + Math.sin(sw) * legLen, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, hipY); ctx.lineTo(x - Math.sin(sw) * legLen, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, hipY); ctx.lineTo(sx, shoulderY); ctx.stroke();
      ctx.beginPath(); ctx.arc(sx, shoulderY - headR, headR, 0, 6.2832); ctx.stroke();
      const hX = sx + 8 * s, hY = shoulderY + 5 * s;
      ctx.beginPath(); ctx.moveTo(sx, shoulderY + 1); ctx.lineTo(hX, hY); ctx.stroke();
      ctx.strokeStyle = C.volt; ctx.lineWidth = 2.8 * s; if (glow) { ctx.shadowColor = C.volt; ctx.shadowBlur = 12; }
      ctx.beginPath(); ctx.moveTo(hX, hY); ctx.lineTo(hX + Math.cos(sword) * swordLen, hY + Math.sin(sword) * swordLen); ctx.stroke();
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }

    // superhero kneel landing — one knee down, head look (down->up), sword up-right
    function landing(s: number, look: number, alpha: number) {
      ctx.globalAlpha = alpha; ctx.strokeStyle = C.bone; ctx.lineWidth = 2.6 * s; ctx.lineCap = "round";
      const P = [0, -13 * s];
      // back leg kneeling (shin on ground)
      ctx.beginPath(); ctx.moveTo(P[0], P[1]); ctx.lineTo(-9 * s, -2 * s); ctx.lineTo(-1 * s, 0); ctx.stroke();
      // front leg planted, bent
      ctx.beginPath(); ctx.moveTo(P[0], P[1]); ctx.lineTo(9 * s, -9 * s); ctx.lineTo(13 * s, 0); ctx.stroke();
      // torso + head (lean forward when looking down)
      const sx = lerp(7, 2, look) * s, sy = -30 * s;
      ctx.beginPath(); ctx.moveTo(P[0], P[1]); ctx.lineTo(sx, sy); ctx.stroke();
      const hcx = sx + lerp(4, -1, look) * s, hcy = sy - lerp(1, 7, look) * s;
      ctx.beginPath(); ctx.arc(hcx, hcy, 5 * s, 0, 6.2832); ctx.stroke();
      // left fist planted on the ground
      ctx.beginPath(); ctx.moveTo(sx, sy + 1); ctx.lineTo(-8 * s, -2 * s); ctx.stroke();
      // right arm + sword raised up-right
      const hX = sx + 7 * s, hY = sy + 4 * s;
      ctx.beginPath(); ctx.moveTo(sx, sy + 1); ctx.lineTo(hX, hY); ctx.stroke();
      ctx.strokeStyle = C.volt; ctx.lineWidth = 3 * s; ctx.shadowColor = C.volt; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.moveTo(hX, hY); ctx.lineTo(hX + Math.cos(-1.15) * 30 * s, hY + Math.sin(-1.15) * 30 * s); ctx.stroke();
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }

    function buildDust() {
      const off = document.createElement("canvas");
      const o = off.getContext("2d"); if (!o) return;
      o.font = `900 ${TITLE_SIZE}px 'Anton','Arial Black',sans-serif`;
      const wpx = Math.ceil(o.measureText("MRVAYN").width) + 16;
      const hpx = Math.ceil(TITLE_SIZE * 1.5);
      off.width = wpx; off.height = hpx;
      o.font = `900 ${TITLE_SIZE}px 'Anton','Arial Black',sans-serif`;
      o.fillStyle = "#fff"; o.textAlign = "center"; o.textBaseline = "middle";
      o.fillText("MRVAYN", wpx / 2, hpx / 2);
      const data = o.getImageData(0, 0, wpx, hpx).data;
      const step = W < 640 ? 6 : 5;
      const ox = cx - wpx / 2, oy = titleY - hpx / 2;
      dust = [];
      for (let y = 0; y < hpx; y += step) for (let x = 0; x < wpx; x += step) {
        if (data[(y * wpx + x) * 4 + 3] > 128) {
          dust.push({ hx: ox + x, hy: oy + y, vx: (60 + Math.random() * 110) * U, vy: -(15 + Math.random() * 55) * U, delay: (x / wpx) * 0.55 + Math.random() * 0.05 });
        }
      }
      dustBuilt = true;
    }

    const start = performance.now();
    let raf = 0;
    const hardStop = setTimeout(done, END * 1000 + 300);

    function frame(now: number) {
      let t = (now - start) / 1000;
      if (skipRef.current) t = Math.max(t, TITLE);
      if (t >= END) { done(); return; }

      let shake = 0;
      if (t > LAND - 0.04 && t < LAND + 0.2) shake = 10 * U;
      if ((t > E1D - 0.04 && t < E1D + 0.1) || (t > E2D - 0.04 && t < E2D + 0.1)) shake = 4 * U;
      if (t > KILL - 0.05 && t < KILL + 0.3) shake = 13 * U;

      ctx.clearRect(0, 0, W, H); ctx.fillStyle = C.void; ctx.fillRect(0, 0, W, H);
      ctx.save(); if (shake) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

      const bA = t < BATTLE_FADE ? 1 : cl(1 - (t - BATTLE_FADE) / (TITLE - BATTLE_FADE));
      const contact = 54 * U;

      if (bA > 0) {
        if (t > LAND && t < LAND + 0.6) { const p = (t - LAND) / 0.6; ctx.globalAlpha = (1 - p) * 0.85 * bA; ctx.strokeStyle = C.volt; ctx.lineWidth = 4 * U; ctx.beginPath(); ctx.ellipse(cx, cy, p * 230 * U, p * 64 * U, 0, 0, 6.2832); ctx.stroke(); ctx.globalAlpha = 1; if (p < 0.05) burst(cx, cy, 28, true); }
        if (t > KILL && t < KILL + 0.75) { const p = (t - KILL) / 0.75; ctx.globalAlpha = (1 - p) * bA; ctx.strokeStyle = C.surge; ctx.lineWidth = 6 * U; ctx.beginPath(); ctx.arc(cx, cy - 28 * U, p * Math.max(W, H) * 0.7, 0, 6.2832); ctx.stroke(); ctx.globalAlpha = 1; }
        if (t > KILL && t < KILL + 0.18) { ctx.globalAlpha = (1 - (t - KILL) / 0.18) * 0.7; ctx.fillStyle = C.bone; ctx.fillRect(-20, -20, W + 40, H + 40); ctx.globalAlpha = 1; }

        // line enemies (1 then 2)
        for (let i = 0; i < line.length; i++) {
          const f = line[i]; if (t < f.appS) continue;
          let x: number, a = bA, rot = 0;
          if (t >= f.death) { const dp = (t - f.death) / 0.45; if (dp >= 1) continue; x = cx + f.side * (contact + dp * 230 * U); a = (1 - dp) * bA; rot = dp * 2.3 * f.side; if (!seeded.has("l" + i)) { burst(cx + f.side * contact, cy - 18 * U, 16); seeded.add("l" + i); } }
          else if (t < f.appE) x = cx + f.side * lerp(Math.max(W, H) * 0.6, contact, ease((t - f.appS) / (f.appE - f.appS)));
          else x = cx + f.side * contact;
          ctx.save(); ctx.translate(x, cy - (t >= f.death ? 10 * U : 0)); if (rot) ctx.rotate(rot);
          stick(0, 0, { color: C.mist, s: 0.95 * U, sword: f.side > 0 ? Math.PI - 0.6 : -0.6, swordLen: 16 * U, lean: 0, crouch: 0, alpha: a, phase: t * 12 + i, moving: t < f.appE });
          ctx.restore();
        }

        // six surrounding enemies
        if (t > SURR_APP) {
          const surrR = 78 * U;
          for (const r of ring) {
            let rad: number, a = bA, rot = 0;
            if (t >= KILL) { const dp = (t - KILL) / 0.5; if (dp >= 1) continue; rad = surrR + dp * 260 * U; a = (1 - dp) * bA; rot = dp * 2.4; if (!seeded.has("r" + r.bob)) { seeded.add("r" + r.bob); } }
            else if (t < SURR_SET) rad = lerp(Math.max(W, H) * 0.7, surrR, ease((t - SURR_APP) / (SURR_SET - SURR_APP)));
            else rad = surrR + Math.sin(t * 7 + r.bob) * 6 * U; // jab while surrounding
            const ex = cx + Math.cos(r.ang) * rad, ey = cy - 20 * U + Math.sin(r.ang) * rad * 0.55;
            ctx.save(); ctx.translate(ex, ey); if (rot) ctx.rotate(rot);
            stick(0, 0, { color: C.mist, s: 0.92 * U, sword: Math.atan2(cy - ey, cx - ex), swordLen: 15 * U, lean: 0, crouch: 0, alpha: a, phase: t * 11 + r.bob, moving: t < SURR_SET });
            ctx.restore();
          }
        }
        if (t > KILL - 0.05 && t < KILL + 0.05) burst(cx, cy - 24 * U, 40, true);

        // ---- hero ----
        if (t < RISE) {
          const yOff = t < LAND ? -(1 - (t / LAND) * (t / LAND)) * H * 0.85 : 0;
          const look = cl((t - (LAND + 0.05)) / (LOOK + 0.2 - LAND)); // down -> up
          ctx.save(); ctx.translate(cx, cy + yOff); landing(1.5 * U, t < LAND ? 0 : look, bA); ctx.restore();
        } else {
          let crouch = 0, lean = 0, rot = 0, sword = -0.7, swordLen = 28 * U, face = 1, hy = cy, moving = false;
          if (t < RISE_END) { crouch = lerp(0.6, 0, (t - RISE) / (RISE_END - RISE)); sword = -1.0; }
          else if (t >= EXPLODE && t < FLIP_END) {
            if (t < KILL) { const p = (t - EXPLODE) / (KILL - EXPLODE); crouch = lerp(0, 0.5, p); sword = -0.4; } // charge
            else { const p = (t - KILL) / (FLIP_END - KILL); rot = -ease(p) * Math.PI * 2; hy = cy - Math.sin(p * Math.PI) * 150 * U; sword = -0.7 + p * 6.5; swordLen = 36 * U; }
          } else if (t >= SURR_SET && t < EXPLODE) { crouch = 0.12; lean = Math.sin(t * 22) * 3 * U; sword = -0.2 + Math.sin(t * 18) * 0.5; } // struggle
          else { // ready / slash incoming
            let slashing = false;
            for (const d of [E1D, E2D]) {
              const sd = line.find((l) => l.death === d)!.side, s0 = d - 0.32;
              if (t >= s0 && t <= d + 0.08) { const p = cl((t - s0) / (d + 0.08 - s0)); face = sd; sword = -2.3 + ease(p) * 2.7; swordLen = 30 * U; slashing = true;
                ctx.save(); ctx.translate(cx, cy - 7 * U); ctx.scale(sd, 1); ctx.globalAlpha = (1 - p) * 0.8;
                const hx = 8 * U, hyy = -32 * U, g = ctx.createRadialGradient(hx, hyy, 4, hx, hyy, swordLen); g.addColorStop(0, "rgba(25,224,255,0)"); g.addColorStop(0.7, "rgba(25,224,255,0.3)"); g.addColorStop(1, "rgba(255,45,107,0.35)");
                ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(hx, hyy); ctx.arc(hx, hyy, swordLen, sword - 0.9, sword + 0.1); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; ctx.restore(); break; }
            }
            if (!slashing) sword = -0.7 + Math.sin(t * 3) * 0.08;
          }
          ctx.save(); ctx.translate(cx, hy - 16 * U); ctx.rotate(rot); ctx.translate(0, 16 * U); ctx.scale(face, 1);
          stick(0, 0, { color: C.bone, s: 1.5 * U, sword, swordLen, lean: lean * face, crouch, alpha: bA, phase: t * 14, moving, glow: true });
          ctx.restore();
        }
      }

      // ---- title + Thanos dust ----
      if (t > BATTLE_FADE) {
        const titleP = cl((t - BATTLE_FADE) / (TITLE - BATTLE_FADE));
        ctx.font = `900 ${TITLE_SIZE}px 'Anton','Arial Black',sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        if (t <= ASH) {
          ctx.globalAlpha = titleP; ctx.shadowColor = C.surge; ctx.shadowBlur = 26 + Math.sin(t * 4) * 8; ctx.fillStyle = C.bone; ctx.fillText("MRVAYN", cx, titleY); ctx.shadowBlur = 0;
          ctx.font = `600 ${Math.max(10, 12 * U)}px 'Chakra Petch',sans-serif`; ctx.fillStyle = C.surge; ctx.fillText("FOUNDER & GAME DEVELOPER", cx, titleY + TITLE_SIZE * 0.66); ctx.globalAlpha = 1;
        } else {
          if (!dustBuilt) buildDust();
          for (const d of dust) {
            const lt = t - ASH - d.delay;
            if (lt < 0) { ctx.fillStyle = C.bone; ctx.fillRect(d.hx, d.hy, 5 * U * 0.9, 5 * U * 0.9); }
            else { const p = lt / 0.75; if (p >= 1) continue; ctx.globalAlpha = (1 - p); ctx.fillStyle = p > 0.4 ? C.surge : C.bone; ctx.fillRect(d.hx + d.vx * lt, d.hy + d.vy * lt, 3 * U, 3 * U); ctx.globalAlpha = 1; }
          }
        }
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      }

      // combat particles
      const dt = 1 / 60;
      for (const p of pts) { if (!p.on) continue; p.life -= dt; if (p.life <= 0) { p.on = false; continue; } p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 24 * U * dt; p.vx *= 0.96; ctx.globalAlpha = Math.max(0, p.life / p.max) * 0.9; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.r, p.r); }
      ctx.globalAlpha = 1; ctx.restore();

      if (t > ASH) { ctx.globalAlpha = cl((t - (END - 0.6)) / 0.6); ctx.fillStyle = C.void; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); clearTimeout(hardStop); removeEventListener("resize", resize); };
  }, [show, done]);

  useEffect(() => {
    if (!show) return;
    const skip = () => { skipRef.current = true; };
    window.addEventListener("keydown", skip, { once: true });
    return () => window.removeEventListener("keydown", skip);
  }, [show]);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[100] cursor-pointer bg-void" onClick={() => (skipRef.current = true)}>
      <canvas ref={ref} className="block h-full w-full" />
      <span className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[0.7rem] uppercase tracking-widest text-mist/50">
        click anywhere to skip
      </span>
    </div>
  );
}
