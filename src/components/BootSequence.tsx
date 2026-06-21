"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Cinematic intro — a stickman warrior is swarmed by enemies (losing), unleashes
 * a power surge and cuts them all down (winning), then the MRVAYN wordmark glows
 * and disintegrates into ash (Endgame-style) before auto-transitioning to the
 * site. Canvas-based + responsive (scales to phone portrait). Plays once per
 * session, auto-dismisses on a hard timer, and skips on click / any key.
 * Honors prefers-reduced-motion (skipped entirely).
 */

const C = { void: "#07090F", bone: "#EAF0FF", volt: "#19E0FF", surge: "#FF2D6B", ion: "#B26BFF", mist: "#8A94A7" };
// phase boundaries (seconds)
const T_CLASH = 2.2, T_SURGE = 2.7, T_WIN = 4.3, T_TITLE = 5.0, T_HOLD = 6.0, T_ASH = 7.0, T_END = 7.8;

interface Foe { ang: number; rad0: number; jit: number; dead: number; dt: number; vx: number; vy: number; deathAt: number; }
interface Ash { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; c: string; on: boolean; }

export function BootSequence() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [show, setShow] = useState(false);
  const skipRef = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = sessionStorage.getItem("booted") === "1"; sessionStorage.setItem("booted", "1"); } catch { /* */ }
    if (reduce || seen) return;
    setShow(true);
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
      U = Math.max(0.85, Math.min(W, H) / 380); // figure unit scales to viewport
      cx = W / 2; cy = H * 0.58;
    };
    resize();
    addEventListener("resize", resize);

    const N = W < 640 ? 9 : 16;
    const foes: Foe[] = [];
    for (let i = 0; i < N; i++) {
      foes.push({
        ang: (i / N) * Math.PI * 2 + Math.random() * 0.3,
        rad0: Math.max(W, H) * (0.7 + Math.random() * 0.3),
        jit: Math.random() * 6.28,
        dead: 0, dt: 0.4, vx: 0, vy: 0,
        deathAt: T_SURGE + 0.1 + (i / N) * (T_WIN - T_SURGE - 0.3), // staggered cut-down wave
      });
    }
    const ash: Ash[] = [];
    for (let i = 0; i < 420; i++) ash.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 0, r: 0, c: C.surge, on: false });
    let ashSeeded = false;

    const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.max(0, Math.min(1, t));

    function stick(x: number, y: number, o: { color: string; s: number; sword: number; swordLen: number; lean: number; crouch: number; alpha: number; phase: number; moving: boolean; glow?: boolean }) {
      const { color, s, sword, swordLen, lean, crouch, alpha, phase, moving, glow } = o;
      const legLen = 13 * s * (1 - crouch * 0.5), torso = 14 * s * (1 - crouch * 0.35), headR = 5 * s;
      const hipY = y - legLen, shoulderY = hipY - torso, sx = x + lean;
      ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = 2.4 * s; ctx.lineCap = "round";
      const sw = moving ? Math.sin(phase) * 0.6 : 0.18;
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
    const hardStop = setTimeout(done, T_END * 1000 + 300); // guaranteed auto-dismiss

    function frame(now: number) {
      let t = (now - start) / 1000;
      if (skipRef.current) t = Math.max(t, T_HOLD); // skip jumps to the title/ash + fade
      if (t >= T_END) { done(); return; }

      // screen shake during clash + unleash
      let shake = 0;
      if (t > T_CLASH - 0.3 && t < T_SURGE) shake = 4 * U;
      if (t > T_SURGE && t < T_WIN) shake = 6 * U * (1 - (t - T_SURGE) / (T_WIN - T_SURGE));

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = C.void; ctx.fillRect(0, 0, W, H);
      ctx.save();
      if (shake) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

      const battleAlpha = t < T_WIN ? 1 : Math.max(0, 1 - (t - T_WIN) / (T_TITLE - T_WIN));

      if (battleAlpha > 0) {
        // surge shockwave
        if (t > T_SURGE && t < T_SURGE + 0.7) {
          const p = (t - T_SURGE) / 0.7;
          ctx.globalAlpha = (1 - p) * battleAlpha; ctx.strokeStyle = C.volt; ctx.lineWidth = 4 * U;
          ctx.beginPath(); ctx.arc(cx, cy - 14 * U, p * Math.max(W, H) * 0.6, 0, 6.2832); ctx.stroke(); ctx.globalAlpha = 1;
        }
        // speed lines during the unleash
        if (t > T_SURGE && t < T_WIN) {
          ctx.strokeStyle = "rgba(25,224,255,0.18)"; ctx.lineWidth = 1;
          for (let i = 0; i < 14; i++) { const yy = (i * 53 + t * 900) % H; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); }
        }

        // foes
        const contact = 46 * U;
        for (const f of foes) {
          let rad: number, ex: number, ey: number, alpha = battleAlpha, dyingRot = 0;
          if (t >= f.deathAt) {
            const dp = (t - f.deathAt) / 0.45;
            if (dp >= 1) continue;
            rad = contact + dp * 200 * U; alpha = (1 - dp) * battleAlpha; dyingRot = dp * 2;
            ex = cx + Math.cos(f.ang) * rad; ey = cy - 22 * U + Math.sin(f.ang) * rad * 0.6;
            if (dp < 0.12 && ash.length) seedBurst(ex, ey, 6);
          } else {
            const rushP = ease(Math.min(1, t / T_CLASH));
            rad = lerp(f.rad0, contact, rushP) + Math.sin(t * 9 + f.jit) * (t > T_CLASH ? 3 * U : 0);
            ex = cx + Math.cos(f.ang) * rad; ey = cy - 22 * U + Math.sin(f.ang) * rad * 0.6;
          }
          ctx.save(); ctx.translate(ex, ey); if (dyingRot) ctx.rotate(dyingRot);
          stick(0, 0, { color: C.mist, s: 0.92 * U, sword: Math.atan2(cy - ey, cx - ex), swordLen: 16 * U, lean: 0, crouch: 0, alpha, phase: t * 12 + f.jit, moving: true });
          ctx.restore();
        }

        // hero
        let crouch = 0, lean = 0, sword = -0.6, swordLen = 26 * U, rot = 0, hy = cy;
        const phase = t * 14;
        if (t < T_CLASH) { lean = -lerp(0, 10 * U, t / T_CLASH); sword = -0.6 + Math.sin(t * 16) * 0.5; }
        else if (t < T_SURGE) { crouch = lerp(0, 0.7, (t - T_CLASH) / (T_SURGE - T_CLASH)); lean = -8 * U; sword = 0.5; }
        else if (t < T_WIN) { const p = (t - T_SURGE) / (T_WIN - T_SURGE); crouch = lerp(0.7, 0, Math.min(1, p * 2)); rot = p * Math.PI * 6; sword = t * 30; swordLen = 30 * U; }
        else { sword = -1.4; lean = 0; } // victorious, sword raised
        ctx.save(); ctx.translate(cx, hy - 16 * U); ctx.rotate(rot); ctx.translate(0, 16 * U);
        stick(0, 0, { color: C.bone, s: 1.45 * U, sword, swordLen, lean, crouch, alpha: battleAlpha, phase, moving: t < T_CLASH, glow: true });
        ctx.restore();

        // flash at surge
        if (t > T_SURGE && t < T_SURGE + 0.18) { ctx.globalAlpha = (1 - (t - T_SURGE) / 0.18) * 0.6; ctx.fillStyle = C.bone; ctx.fillRect(-20, -20, W + 40, H + 40); ctx.globalAlpha = 1; }
      }

      // ----- title + ash -----
      if (t > T_WIN) {
        const titleP = Math.min(1, (t - T_WIN) / (T_TITLE - T_WIN));
        const dissolve = t > T_ASH ? Math.min(1, (t - T_ASH) / (T_END - T_ASH)) : 0;
        const size = Math.min(W * 0.16, 120 * U);
        ctx.font = `900 ${size}px 'Anton', 'Arial Black', sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        const ty = cy - 6 * U;
        if (dissolve === 0) {
          ctx.globalAlpha = titleP;
          ctx.shadowColor = C.surge; ctx.shadowBlur = 30 + Math.sin(t * 4) * 10;
          ctx.fillStyle = C.bone; ctx.fillText("MRVAYN", cx, ty);
          ctx.shadowBlur = 0; ctx.globalAlpha = 1;
          // subtitle
          ctx.font = `600 ${Math.max(11, 13 * U)}px 'Chakra Petch', sans-serif`;
          ctx.fillStyle = C.surge; ctx.globalAlpha = titleP;
          ctx.fillText("FOUNDER & GAME DEVELOPER", cx, ty + size * 0.62);
          ctx.globalAlpha = 1;
        } else {
          if (!ashSeeded) { seedAsh(cx, ty, size); ashSeeded = true; }
          ctx.globalAlpha = 1 - dissolve;
          ctx.shadowColor = C.surge; ctx.shadowBlur = 20; ctx.fillStyle = C.bone; ctx.fillText("MRVAYN", cx, ty); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        }
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      }

      // ash particles
      const dt = 1 / 60;
      for (const a of ash) {
        if (!a.on) continue;
        a.life -= dt; if (a.life <= 0) { a.on = false; continue; }
        a.x += a.vx; a.y += a.vy; a.vy -= 0.06 * U; a.vx *= 0.99;
        ctx.globalAlpha = Math.max(0, a.life / a.max) * 0.9; ctx.fillStyle = a.c; ctx.fillRect(a.x, a.y, a.r, a.r);
      }
      ctx.globalAlpha = 1;

      ctx.restore();

      // final fade to the site
      if (t > T_ASH) { ctx.globalAlpha = Math.min(1, (t - T_ASH) / (T_END - T_ASH)); ctx.fillStyle = C.void; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }

      raf = requestAnimationFrame(frame);
    }

    function seedBurst(x: number, y: number, n: number) {
      for (let i = 0; i < n; i++) { const p = ash.find((q) => !q.on); if (!p) break; const a = Math.random() * 6.28, s = Math.random() * 3 * U; p.on = true; p.x = x; p.y = y; p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s - U; p.max = p.life = 0.5; p.r = 2 * U; p.c = Math.random() > 0.5 ? C.surge : C.mist; }
    }
    function seedAsh(cx2: number, ty: number, size: number) {
      const w = size * 3.2, count = W < 640 ? 180 : 360;
      for (let i = 0; i < count; i++) {
        const p = ash.find((q) => !q.on); if (!p) break;
        p.on = true; p.x = cx2 + (Math.random() - 0.5) * w; p.y = ty + (Math.random() - 0.5) * size * 0.7;
        p.vx = (Math.random() - 0.5) * 0.6 * U; p.vy = -(0.4 + Math.random() * 1.2) * U; p.max = p.life = 0.6 + Math.random() * 0.7; p.r = (1 + Math.random() * 2) * U; p.c = Math.random() > 0.4 ? C.surge : C.ion;
      }
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
