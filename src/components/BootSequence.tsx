"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Cinematic intro — choreographed stickman fight:
 *  1) the hero drops a superhero landing in the centre (impact shockwave)
 *  2) enemies rush one at a time and get slashed (1 → 2 → 3 → 4 → 5)
 *  3) two more surround him; he struggles
 *  4) a backflip-slash finisher wipes them out
 *  5) MRVAYN glows, disintegrates into ash, and auto-transitions to the site.
 * Canvas + responsive (scales to phone portrait). Plays once per session, hard
 * auto-dismiss timer, click-anywhere / any-key skip, reduced-motion skips.
 */

const C = { void: "#07090F", bone: "#EAF0FF", volt: "#19E0FF", surge: "#FF2D6B", ion: "#B26BFF", mist: "#8A94A7" };

// timeline (seconds)
const LAND = 0.62, READY = 0.95;
const DEATHS = [1.5, 2.1, 2.7, 3.25, 3.75]; // single-enemy slashes
const SIDES = [1, -1, 1, -1, 1];
const SURROUND = 4.0, STRUGGLE_END = 4.8, FLIP = 4.8, FLIP_KILL = 5.2, FLIP_END = 5.7;
const BATTLE_FADE = 5.7, TITLE = 6.4, ASH = 7.4, END = 8.3;
const SLASH_W = 0.34; // slash duration

interface Foe { side: number; appS: number; appE: number; death: number; surround: boolean; bob: number; }
interface Pt { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; c: string; on: boolean; }

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
      U = Math.max(0.9, Math.min(W, H) / 360);
      cx = W / 2; cy = H * 0.6;
    };
    resize();
    addEventListener("resize", resize);

    const foes: Foe[] = [
      { side: 1, appS: READY, appE: 1.35, death: DEATHS[0], surround: false, bob: 0 },
      { side: -1, appS: 1.55, appE: 1.95, death: DEATHS[1], surround: false, bob: 1 },
      { side: 1, appS: 2.15, appE: 2.55, death: DEATHS[2], surround: false, bob: 2 },
      { side: -1, appS: 2.75, appE: 3.1, death: DEATHS[3], surround: false, bob: 3 },
      { side: 1, appS: 3.3, appE: 3.6, death: DEATHS[4], surround: false, bob: 4 },
      { side: -1, appS: 3.9, appE: 4.4, death: FLIP_KILL, surround: true, bob: 5 },
      { side: 1, appS: 4.05, appE: 4.5, death: FLIP_KILL, surround: true, bob: 6 },
    ];
    const pts: Pt[] = [];
    for (let i = 0; i < 460; i++) pts.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 0, r: 0, c: C.surge, on: false });
    const seededDeath = new Set<number>();
    let ashSeeded = false;

    const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    const clamp01 = (p: number) => Math.max(0, Math.min(1, p));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp01(t);

    const burst = (x: number, y: number, n: number, big = false) => {
      for (let i = 0; i < n; i++) { const p = pts.find((q) => !q.on); if (!p) break; const a = Math.random() * 6.28, s = (big ? 1 : 0.5) * (40 + Math.random() * 260); p.on = true; p.x = x; p.y = y; p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s - U * 20; p.max = p.life = 0.4 + Math.random() * 0.4; p.r = (big ? 2.5 : 1.6) * U; p.c = Math.random() > 0.5 ? C.surge : C.volt; }
    };

    function stick(x: number, y: number, o: { color: string; s: number; sword: number; swordLen: number; lean: number; crouch: number; alpha: number; phase: number; moving: boolean; glow?: boolean }) {
      const { color, s, sword, swordLen, lean, crouch, alpha, phase, moving, glow } = o;
      const legLen = 13 * s * (1 - crouch * 0.55), torso = 14 * s * (1 - crouch * 0.3), headR = 5 * s;
      const hipY = y - legLen, shoulderY = hipY - torso, sx = x + lean;
      ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = 2.4 * s; ctx.lineCap = "round";
      const sw = moving ? Math.sin(phase) * 0.6 : 0.2 + crouch * 0.4;
      ctx.beginPath(); ctx.moveTo(x, hipY); ctx.lineTo(x + Math.sin(sw) * legLen, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, hipY); ctx.lineTo(x - Math.sin(sw) * legLen, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, hipY); ctx.lineTo(sx, shoulderY); ctx.stroke();
      ctx.beginPath(); ctx.arc(sx, shoulderY - headR, headR, 0, 6.2832); ctx.stroke();
      const hX = sx + 8 * s, hY = shoulderY + 5 * s;
      ctx.beginPath(); ctx.moveTo(sx, shoulderY + 1); ctx.lineTo(hX, hY); ctx.stroke();
      ctx.strokeStyle = C.volt; ctx.lineWidth = 2.8 * s;
      if (glow) { ctx.shadowColor = C.volt; ctx.shadowBlur = 12; }
      ctx.beginPath(); ctx.moveTo(hX, hY); ctx.lineTo(hX + Math.cos(sword) * swordLen, hY + Math.sin(sword) * swordLen); ctx.stroke();
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }

    const start = performance.now();
    let raf = 0;
    const hardStop = setTimeout(done, END * 1000 + 300);

    function frame(now: number) {
      let t = (now - start) / 1000;
      if (skipRef.current) t = Math.max(t, TITLE);
      if (t >= END) { done(); return; }

      let shake = 0;
      if (t > LAND - 0.04 && t < LAND + 0.18) shake = 9 * U;
      for (const d of DEATHS) if (t > d - 0.04 && t < d + 0.1) shake = Math.max(shake, 4 * U);
      if (t > FLIP_KILL - 0.05 && t < FLIP_KILL + 0.25) shake = 11 * U;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = C.void; ctx.fillRect(0, 0, W, H);
      ctx.save();
      if (shake) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

      const battleAlpha = t < BATTLE_FADE ? 1 : clamp01(1 - (t - BATTLE_FADE) / (TITLE - BATTLE_FADE));
      const contact = 52 * U;

      if (battleAlpha > 0) {
        // landing shockwave
        if (t > LAND && t < LAND + 0.6) { const p = (t - LAND) / 0.6; ctx.globalAlpha = (1 - p) * 0.8 * battleAlpha; ctx.strokeStyle = C.volt; ctx.lineWidth = 4 * U; ctx.beginPath(); ctx.ellipse(cx, cy, p * 240 * U, p * 70 * U, 0, 0, 6.2832); ctx.stroke(); ctx.globalAlpha = 1; if (p < 0.06) burst(cx, cy, 26, true); }
        // finisher shockwave + flash
        if (t > FLIP_KILL && t < FLIP_KILL + 0.7) { const p = (t - FLIP_KILL) / 0.7; ctx.globalAlpha = (1 - p) * battleAlpha; ctx.strokeStyle = C.surge; ctx.lineWidth = 5 * U; ctx.beginPath(); ctx.arc(cx, cy - 30 * U, p * Math.max(W, H) * 0.6, 0, 6.2832); ctx.stroke(); ctx.globalAlpha = 1; }
        if (t > FLIP_KILL && t < FLIP_KILL + 0.16) { ctx.globalAlpha = (1 - (t - FLIP_KILL) / 0.16) * 0.6; ctx.fillStyle = C.bone; ctx.fillRect(-20, -20, W + 40, H + 40); ctx.globalAlpha = 1; }

        // foes
        for (const f of foes) {
          if (t < f.appS) continue;
          let x: number, alpha = battleAlpha, rot = 0;
          if (t >= f.death) {
            const dp = (t - f.death) / 0.45; if (dp >= 1) continue;
            x = cx + f.side * (contact + dp * 220 * U); alpha = (1 - dp) * battleAlpha; rot = dp * 2.2 * f.side;
            if (!seededDeath.has(f.bob)) { burst(cx + f.side * contact, cy - 18 * U, f.surround ? 22 : 14, f.surround); seededDeath.add(f.bob); }
          } else if (t < f.appE) {
            x = cx + f.side * lerp(Math.max(W, H) * 0.6, contact, ease((t - f.appS) / (f.appE - f.appS)));
          } else {
            x = cx + f.side * (contact + (f.surround ? Math.sin(t * 8 + f.bob) * 6 * U : 0)); // jab if surrounding
          }
          ctx.save(); ctx.translate(x, cy - (t >= f.death ? 10 * U : 0)); if (rot) ctx.rotate(rot);
          stick(0, 0, { color: C.mist, s: 0.95 * U, sword: f.side > 0 ? Math.PI - 0.6 : -0.6, swordLen: 16 * U, lean: 0, crouch: 0, alpha, phase: t * 12 + f.bob, moving: t < f.appE });
          ctx.restore();
        }

        // ---- hero ----
        let hy = cy, crouch = 0, lean = 0, rot = 0, sword = -0.7, swordLen = 28 * U, face = 1, moving = false;
        if (t < LAND) { // superhero drop-in
          const p = t / LAND; hy = cy - (1 - p * p) * H * 0.85; crouch = 0.2; sword = 1.2; swordLen = 30 * U;
        } else if (t < READY) { // impact crouch -> rise
          const p = (t - LAND) / (READY - LAND); crouch = lerp(0.85, 0, p); sword = lerp(1.4, -0.7, p); lean = 0;
        } else if (t >= FLIP && t < FLIP_END) { // backflip-slash finisher
          const p = (t - FLIP) / (FLIP_END - FLIP); rot = -ease(p) * Math.PI * 2; hy = cy - Math.sin(p * Math.PI) * 150 * U; sword = -0.7 + p * 6.5; swordLen = 36 * U;
          if (t > FLIP_KILL - 0.05 && t < FLIP_KILL + 0.05) burst(cx, cy - 30 * U, 30, true);
        } else if (t >= SURROUND && t < STRUGGLE_END) { // struggle while surrounded
          crouch = 0.12; lean = Math.sin(t * 22) * 3 * U; sword = -0.2 + Math.sin(t * 18) * 0.5;
        } else { // slash an incoming enemy?
          let slashing = false;
          for (let i = 0; i < DEATHS.length; i++) {
            const d = DEATHS[i], s0 = d - SLASH_W + 0.06;
            if (t >= s0 && t <= d + 0.08) { const p = clamp01((t - s0) / (d + 0.08 - s0)); face = SIDES[i]; sword = -2.3 + ease(p) * 2.7; swordLen = 30 * U; slashing = true;
              // slash arc
              const hx = SIDES[i] * 8 * U, hy2 = -shoulder(U); ctx.save(); ctx.translate(cx, cy - 7 * U); ctx.scale(SIDES[i], 1);
              ctx.globalAlpha = (1 - p) * 0.8; const g = ctx.createRadialGradient(hx, hy2, 4, hx, hy2, swordLen); g.addColorStop(0, "rgba(25,224,255,0)"); g.addColorStop(0.7, "rgba(25,224,255,0.3)"); g.addColorStop(1, "rgba(255,45,107,0.35)"); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(hx, hy2); ctx.arc(hx, hy2, swordLen, sword - 0.9, sword + 0.1); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; ctx.restore();
              break; }
          }
          if (!slashing) { sword = -0.7 + Math.sin(t * 3) * 0.08; } // ready idle
        }
        ctx.save(); ctx.translate(cx, hy - 16 * U); ctx.rotate(rot); ctx.translate(0, 16 * U); ctx.scale(face, 1);
        stick(0, 0, { color: C.bone, s: 1.5 * U, sword, swordLen, lean: lean * face, crouch, alpha: battleAlpha, phase: t * 14, moving, glow: true });
        ctx.restore();
      }

      // ---- title + ash ----
      if (t > BATTLE_FADE) {
        const titleP = clamp01((t - BATTLE_FADE) / (TITLE - BATTLE_FADE));
        const dissolve = t > ASH ? clamp01((t - ASH) / (END - ASH)) : 0;
        const size = Math.min(W * 0.16, 120 * U);
        ctx.font = `900 ${size}px 'Anton','Arial Black',sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        const ty = cy - 6 * U;
        if (dissolve === 0) {
          ctx.globalAlpha = titleP; ctx.shadowColor = C.surge; ctx.shadowBlur = 28 + Math.sin(t * 4) * 10; ctx.fillStyle = C.bone; ctx.fillText("MRVAYN", cx, ty); ctx.shadowBlur = 0;
          ctx.font = `600 ${Math.max(11, 13 * U)}px 'Chakra Petch',sans-serif`; ctx.fillStyle = C.surge; ctx.fillText("FOUNDER & GAME DEVELOPER", cx, ty + size * 0.62); ctx.globalAlpha = 1;
        } else {
          if (!ashSeeded) { seedAsh(cx, ty, size); ashSeeded = true; }
          ctx.globalAlpha = 1 - dissolve; ctx.shadowColor = C.surge; ctx.shadowBlur = 20; ctx.fillStyle = C.bone; ctx.fillText("MRVAYN", cx, ty); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        }
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      }

      // particles
      const dt = 1 / 60;
      for (const p of pts) { if (!p.on) continue; p.life -= dt; if (p.life <= 0) { p.on = false; continue; } p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 26 * U * dt; p.vx *= 0.96; ctx.globalAlpha = Math.max(0, p.life / p.max) * 0.9; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.r, p.r); }
      ctx.globalAlpha = 1;
      ctx.restore();

      if (t > ASH) { ctx.globalAlpha = clamp01((t - ASH) / (END - ASH)); ctx.fillStyle = C.void; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }

      raf = requestAnimationFrame(frame);
    }

    function shoulder(u: number) { return 13 * 1.5 * u + 14 * 1.5 * u - 7 * u; }
    function seedAsh(cx2: number, ty: number, size: number) {
      const w = size * 3.2, count = W < 640 ? 200 : 380;
      for (let i = 0; i < count; i++) { const p = pts.find((q) => !q.on); if (!p) break; p.on = true; p.x = cx2 + (Math.random() - 0.5) * w; p.y = ty + (Math.random() - 0.5) * size * 0.7; p.vx = (Math.random() - 0.5) * 0.6 * U; p.vy = -(0.4 + Math.random() * 1.2) * U * 26; p.max = p.life = 0.6 + Math.random() * 0.7; p.r = (1 + Math.random() * 2) * U; p.c = Math.random() > 0.4 ? C.surge : C.ion; }
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
