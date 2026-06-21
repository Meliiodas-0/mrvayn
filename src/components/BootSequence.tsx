"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Cinematic intro with an IK-skeleton stickman (jointed elbows/knees, not stiff
 * single-line "puppet" limbs). Choreography: superhero kneel-landing → enemy 1
 * knocked → enemy 2 knocked → six surround → struggle → explosion + backflip
 * finisher → heroic light bloom → MRVAYN rises, then disintegrates Thanos-style
 * and auto-transitions to the site. Motion uses anticipation, follow-through,
 * easing and weight-shift. Canvas + responsive; once/session; skip on click/key;
 * reduced-motion skips.
 */

const C = { void: "#07090F", bone: "#EAF0FF", volt: "#19E0FF", surge: "#FF2D6B", ion: "#B26BFF", mist: "#8A94A7" };
const LAND = 0.55, LOOK = 0.85, RISE = 1.15, RISE_END = 1.45;
const E1D = 1.95, E2D = 2.6;
const SURR_APP = 2.75, SURR_SET = 3.65, EXPLODE = 4.55, KILL = 4.85, FLIP_END = 5.55;
const VICT = 5.55, BLOOM = 5.85, TITLE = 6.45, ASH = 7.45, END = 9.0;

interface Pt { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; c: string; on: boolean; }
interface Dust { hx: number; hy: number; vx: number; vy: number; delay: number; }
type V = { x: number; y: number };

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
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      U = Math.max(0.9, Math.min(W, H) / 360); cx = W / 2; cy = H * 0.6;
    };
    resize(); addEventListener("resize", resize);

    const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
    const eOut = (p: number) => 1 - Math.pow(1 - p, 3);
    const eIn = (p: number) => p * p * p;
    const cl = (p: number) => Math.max(0, Math.min(1, p));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * cl(t);
    const lp = (a: V, b: V, t: number): V => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });

    // 2-bone IK — returns the joint (knee/elbow) for hip/shoulder -> foot/hand.
    const ik = (hx: number, hy: number, fx: number, fy: number, l1: number, l2: number, bend: number): V => {
      let dx = fx - hx, dy = fy - hy, d = Math.hypot(dx, dy) || 0.001;
      const max = l1 + l2 - 0.01; if (d > max) { dx *= max / d; dy *= max / d; d = max; }
      const a = Math.atan2(dy, dx);
      const c = Math.max(-1, Math.min(1, (d * d + l1 * l1 - l2 * l2) / (2 * d * l1)));
      const ang = a + bend * Math.acos(c);
      return { x: hx + Math.cos(ang) * l1, y: hy + Math.sin(ang) * l1 };
    };

    // jointed figure driven by end-effectors (pelvis abs; targets relative)
    interface Pose { px: number; py: number; lean: number; fL: V; fR: V; hMain: V; hOff: V; sword: number; swordLen: number; face: number; }
    function figure(p: Pose, o: { color: string; s: number; alpha: number; glow?: boolean }) {
      const { color, s, alpha, glow } = o;
      const f = p.face;
      const ax = (v: V): V => ({ x: p.px + v.x * f, y: p.py + v.y }); // pelvis-relative -> abs (face flips x)
      const thigh = 12 * s, shin = 13 * s, upper = 9 * s, fore = 9 * s, spine = 18 * s, headGap = 9 * s, headR = 5 * s;
      const chest = { x: p.px + Math.sin(p.lean) * spine * f, y: p.py - Math.cos(p.lean) * spine };
      const head = { x: chest.x + Math.sin(p.lean) * headGap * f, y: chest.y - Math.cos(p.lean) * headGap };
      const cax = (v: V): V => ({ x: chest.x + v.x * f, y: chest.y + v.y }); // chest-relative -> abs
      const fL = ax(p.fL), fR = ax(p.fR), hM = cax(p.hMain), hO = cax(p.hOff);
      const kL = ik(p.px, p.py, fL.x, fL.y, thigh, shin, f), kR = ik(p.px, p.py, fR.x, fR.y, thigh, shin, f);
      const eO = ik(chest.x, chest.y, hO.x, hO.y, upper, fore, -f), eM = ik(chest.x, chest.y, hM.x, hM.y, upper, fore, -f);

      ctx.globalAlpha = alpha; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.strokeStyle = color; ctx.lineWidth = 2.6 * s;
      const seg = (a: V, b: V) => { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); };
      // back limbs slightly dim for depth
      ctx.globalAlpha = alpha * 0.78; seg({ x: p.px, y: p.py }, kL); seg(kL, fL); seg(chest, eO); seg(eO, hO);
      ctx.globalAlpha = alpha;
      seg({ x: p.px, y: p.py }, { x: chest.x, y: chest.y }); // spine
      seg({ x: p.px, y: p.py }, kR); seg(kR, fR); // front leg
      ctx.beginPath(); ctx.arc(head.x, head.y - headR, headR, 0, 6.2832); ctx.stroke(); // head
      seg(chest, eM); seg(eM, hM); // sword arm
      // sword
      ctx.strokeStyle = C.volt; ctx.lineWidth = 3 * s; if (glow) { ctx.shadowColor = C.volt; ctx.shadowBlur = 13; }
      ctx.beginPath(); ctx.moveTo(hM.x, hM.y); ctx.lineTo(hM.x + Math.cos(p.sword) * p.swordLen * f, hM.y + Math.sin(p.sword) * p.swordLen); ctx.stroke();
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      return { chest, hM };
    }

    // standing/run/idle base pose for a figure at (px feet-x, ground y)
    function basePose(px: number, ground: number, s: number, face: number, t: number, run: boolean): Pose {
      const bob = Math.sin(t * (run ? 9 : 2)) * (run ? 2 : 1) * s;
      const py = ground - 26 * s + bob; // pelvis
      const step = run ? Math.sin(t * 9) : 0, step2 = run ? Math.sin(t * 9 + Math.PI) : 0;
      return {
        px, py, lean: run ? 0.12 : 0.05 + Math.sin(t * 2) * 0.02, face,
        fL: { x: -5 * s + step2 * 9 * s, y: 26 * s - Math.max(0, step2) * 6 * s },
        fR: { x: 5 * s + step * 9 * s, y: 26 * s - Math.max(0, step) * 6 * s },
        hMain: { x: 8 * s, y: 4 * s + Math.sin(t * 2) * 1 * s },
        hOff: { x: -8 * s + (run ? -step * 5 * s : 0), y: 6 * s },
        sword: -0.7, swordLen: 26 * s,
      };
    }

    const pts: Pt[] = [];
    for (let i = 0; i < 520; i++) pts.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 0, r: 0, c: C.surge, on: false });
    const seeded = new Set<string>();
    let dust: Dust[] = [], dustBuilt = false;
    const TSIZE = Math.min(W * 0.115, 84 * U), tY = cy - 4 * U;

    const burst = (x: number, y: number, n: number, big = false) => {
      for (let i = 0; i < n; i++) { const p = pts.find((q) => !q.on); if (!p) break; const a = Math.random() * 6.28, s = (big ? 1 : 0.55) * (50 + Math.random() * 280); p.on = true; p.x = x; p.y = y; p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s - 30 * U; p.max = p.life = 0.4 + Math.random() * 0.45; p.r = (big ? 2.6 : 1.7) * U; p.c = Math.random() > 0.5 ? C.surge : C.volt; }
    };
    function buildDust() {
      const off = document.createElement("canvas"); const o = off.getContext("2d"); if (!o) { dustBuilt = true; return; }
      o.font = `900 ${TSIZE}px 'Anton','Arial Black',sans-serif`;
      const wpx = Math.ceil(o.measureText("MRVAYN").width) + 16, hpx = Math.ceil(TSIZE * 1.5);
      off.width = wpx; off.height = hpx; o.font = `900 ${TSIZE}px 'Anton','Arial Black',sans-serif`;
      o.fillStyle = "#fff"; o.textAlign = "center"; o.textBaseline = "middle"; o.fillText("MRVAYN", wpx / 2, hpx / 2);
      const data = o.getImageData(0, 0, wpx, hpx).data, step = W < 640 ? 6 : 5, ox = cx - wpx / 2, oy = tY - hpx / 2;
      dust = [];
      for (let y = 0; y < hpx; y += step) for (let x = 0; x < wpx; x += step) if (data[(y * wpx + x) * 4 + 3] > 128)
        dust.push({ hx: ox + x, hy: oy + y, vx: (60 + Math.random() * 110) * U, vy: -(15 + Math.random() * 55) * U, delay: (x / wpx) * 0.55 + Math.random() * 0.05 });
      dustBuilt = true;
    }

    const start = performance.now(); let raf = 0;
    const hardStop = setTimeout(done, END * 1000 + 300);

    function frame(now: number) {
      let t = (now - start) / 1000;
      if (skipRef.current) t = Math.max(t, TITLE);
      if (t >= END) { done(); return; }

      let shake = 0;
      if (t > LAND - 0.04 && t < LAND + 0.2) shake = 10 * U;
      if ((t > E1D - 0.05 && t < E1D + 0.08) || (t > E2D - 0.05 && t < E2D + 0.08)) shake = 5 * U;
      if (t > KILL - 0.05 && t < KILL + 0.3) shake = 13 * U;

      ctx.clearRect(0, 0, W, H); ctx.fillStyle = C.void; ctx.fillRect(0, 0, W, H);
      ctx.save(); if (shake) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

      const bA = t < VICT ? 1 : cl(1 - (t - VICT) / (BLOOM - VICT));
      const contact = 54 * U;

      // shockwaves
      if (t > LAND && t < LAND + 0.6) { const p = (t - LAND) / 0.6; ctx.globalAlpha = (1 - p) * 0.85; ctx.strokeStyle = C.volt; ctx.lineWidth = 4 * U; ctx.beginPath(); ctx.ellipse(cx, cy, p * 230 * U, p * 64 * U, 0, 0, 6.2832); ctx.stroke(); ctx.globalAlpha = 1; if (p < 0.05) burst(cx, cy, 28, true); }
      if (t > KILL && t < KILL + 0.8) { const p = (t - KILL) / 0.8; ctx.globalAlpha = (1 - p); ctx.strokeStyle = C.surge; ctx.lineWidth = 6 * U; ctx.beginPath(); ctx.arc(cx, cy - 28 * U, p * Math.max(W, H) * 0.7, 0, 6.2832); ctx.stroke(); ctx.globalAlpha = 1; }
      if (t > KILL && t < KILL + 0.18) { ctx.globalAlpha = (1 - (t - KILL) / 0.18) * 0.7; ctx.fillStyle = C.bone; ctx.fillRect(-20, -20, W + 40, H + 40); ctx.globalAlpha = 1; }

      if (bA > 0) {
        // line enemies — run in, recoil-fly on hit
        const line = [{ side: 1, s: RISE_END, e: 1.78, d: E1D }, { side: -1, s: 2.05, e: 2.45, d: E2D }];
        line.forEach((f, i) => {
          if (t < f.s) return;
          let fx: number, a = bA, fly = 0;
          if (t >= f.d) { const dp = (t - f.d) / 0.5; if (dp >= 1) return; fx = cx + f.side * (contact + eOut(dp) * 240 * U); a = (1 - dp) * bA; fly = dp; if (!seeded.has("l" + i)) { burst(cx + f.side * contact, cy - 26 * U, 16); seeded.add("l" + i); } }
          else if (t < f.e) fx = cx + f.side * lerp(Math.max(W, H) * 0.55, contact, ease((t - f.s) / (f.e - f.s)));
          else fx = cx + f.side * contact;
          ctx.save(); ctx.translate(fx, 0); if (fly) { ctx.translate(0, -fly * 30 * U); ctx.rotate(fly * 2.2 * f.side); }
          const ep = basePose(0, cy, 0.95 * U, -f.side, t * 1.2 + i, t < f.e);
          ep.hMain = { x: 9 * U, y: -2 * U }; ep.sword = -1.0; // enemy sword forward
          figure(ep, { color: C.mist, s: 0.95 * U, alpha: a });
          ctx.restore();
        });

        // six surround — converge, jab, explode-fly
        if (t > SURR_APP) {
          const R = 80 * U;
          for (let i = 0; i < 6; i++) {
            const ang = (i / 6) * 6.2832 + 0.35;
            let rad: number, a = bA, fly = 0;
            if (t >= KILL) { const dp = (t - KILL) / 0.5; if (dp >= 1) continue; rad = R + eOut(dp) * 270 * U; a = (1 - dp) * bA; fly = dp; }
            else if (t < SURR_SET) rad = lerp(Math.max(W, H) * 0.65, R, ease((t - SURR_APP) / (SURR_SET - SURR_APP)));
            else rad = R + Math.sin(t * 6 + i) * 6 * U;
            const ex = cx + Math.cos(ang) * rad, ey = cy - 18 * U + Math.sin(ang) * rad * 0.55;
            ctx.save(); ctx.translate(ex, ey); if (fly) ctx.rotate(fly * 2.4);
            const ep = basePose(0, 0, 0.92 * U, ex > cx ? -1 : 1, t * 1.1 + i, t < SURR_SET);
            ep.py = -26 * 0.92 * U; ep.hMain = { x: 9 * U, y: -2 * U }; ep.sword = ex > cx ? -2.2 : -1.0;
            figure(ep, { color: C.mist, s: 0.92 * U, alpha: a });
            ctx.restore();
          }
          if (t > KILL - 0.05 && t < KILL + 0.05) burst(cx, cy - 24 * U, 44, true);
        }

        // ---- HERO ----
        const hs = 1.55 * U;
        if (t < RISE) { drawLanding(t, hs, bA); }
        else {
          let p: Pose;
          if (t < RISE_END) { // stand up from kneel
            const k = ease((t - RISE) / (RISE_END - RISE));
            p = basePose(cx, cy, hs, 1, t, false);
            p.py = cy - lerp(14, 26, k) * hs; p.lean = lerp(0.5, 0.05, k); p.hMain = { x: lerp(2, 8, k) * hs, y: lerp(-22, 4, k) * hs }; p.sword = lerp(-1.4, -0.7, k);
          } else if (t >= EXPLODE && t < FLIP_END) {
            if (t < KILL) { const k = (t - EXPLODE) / (KILL - EXPLODE); p = basePose(cx, cy, hs, 1, t, false); p.py = cy - lerp(26, 18, k) * hs; p.fL = { x: -11 * hs, y: 26 * hs }; p.fR = { x: 11 * hs, y: 26 * hs }; p.lean = -0.15; p.hMain = { x: lerp(8, 0, k) * hs, y: lerp(4, -6, k) * hs }; p.hOff = { x: lerp(-8, 0, k) * hs, y: 6 * hs }; p.sword = -0.4; } // gather/charge
            else { const k = (t - KILL) / (FLIP_END - KILL); ctx.save(); ctx.translate(cx, cy - 16 * hs - Math.sin(k * Math.PI) * 150 * U); ctx.rotate(-ease(k) * 6.2832); ctx.translate(0, 16 * hs); const fp = basePose(0, 0, hs, 1, t, false); fp.py = -26 * hs; fp.fL = { x: -4 * hs, y: 16 * hs }; fp.fR = { x: 6 * hs, y: 18 * hs }; fp.lean = -0.3; fp.hMain = { x: 10 * hs, y: -4 * hs }; fp.sword = -0.7 + k * 7; fp.swordLen = 34 * hs; figure(fp, { color: C.bone, s: hs, alpha: bA, glow: true }); ctx.restore(); p = null as unknown as Pose; }
          } else if (t >= SURR_SET && t < EXPLODE) { // struggle — sway + recoil + guard
            const sway = Math.sin(t * 3.2), jab = Math.max(0, Math.sin(t * 9)) ** 3;
            p = basePose(cx, cy, hs, sway > 0 ? 1 : -1, t, false);
            p.lean = -0.18 * jab + sway * 0.04; p.px = cx + sway * 5 * U;
            p.hMain = { x: lerp(6, 2, jab) * hs, y: lerp(2, -16, Math.abs(sway)) * hs }; p.hOff = { x: -7 * hs, y: -10 * hs }; p.sword = lerp(-0.6, -1.7, Math.abs(sway)); // raise to guard
          } else if (t < E2D + 0.1) { // slash combos vs enemy 1 & 2
            const target = t < E1D + 0.1 ? { d: E1D, side: 1 } : { d: E2D, side: -1 };
            p = slashPose(t, target.d, target.side, hs);
          } else p = basePose(cx, cy, hs, 1, t, false);
          if (p) figure(p, { color: C.bone, s: hs, alpha: bA, glow: true });
        }
      }

      // ---- heroic transition: light bloom -> title rises ----
      if (t > VICT) {
        const bloomP = cl((t - VICT) / (BLOOM - VICT));
        // vertical light beam from where the hero stood
        ctx.save(); const grd = ctx.createLinearGradient(cx, cy, cx, cy - 260 * U);
        grd.addColorStop(0, `rgba(255,45,107,${0.5 * bloomP})`); grd.addColorStop(1, "rgba(255,45,107,0)");
        ctx.fillStyle = grd; ctx.fillRect(cx - 60 * U * bloomP, cy - 260 * U, 120 * U * bloomP, 260 * U); ctx.restore();
      }
      if (t > BLOOM) {
        const titleP = cl((t - BLOOM) / (TITLE - BLOOM));
        ctx.font = `900 ${TSIZE}px 'Anton','Arial Black',sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        if (t <= ASH) {
          ctx.save(); ctx.globalAlpha = titleP; ctx.translate(0, (1 - eOut(titleP)) * 24 * U); // rises into place
          ctx.shadowColor = C.surge; ctx.shadowBlur = 26 + Math.sin(t * 4) * 8; ctx.fillStyle = C.bone; ctx.fillText("MRVAYN", cx, tY); ctx.shadowBlur = 0;
          ctx.font = `600 ${Math.max(10, 12 * U)}px 'Chakra Petch',sans-serif`; ctx.fillStyle = C.surge; ctx.fillText("FOUNDER & GAME DEVELOPER", cx, tY + TSIZE * 0.66); ctx.restore();
        } else {
          if (!dustBuilt) buildDust();
          for (const d of dust) { const lt = t - ASH - d.delay; if (lt < 0) { ctx.fillStyle = C.bone; ctx.fillRect(d.hx, d.hy, 4.5 * U, 4.5 * U); } else { const p = lt / 0.75; if (p >= 1) continue; ctx.globalAlpha = 1 - p; ctx.fillStyle = p > 0.4 ? C.surge : C.bone; ctx.fillRect(d.hx + d.vx * lt, d.hy + d.vy * lt, 3 * U, 3 * U); ctx.globalAlpha = 1; } }
        }
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      }

      // particles
      const dt = 1 / 60;
      for (const pp of pts) { if (!pp.on) continue; pp.life -= dt; if (pp.life <= 0) { pp.on = false; continue; } pp.x += pp.vx * dt; pp.y += pp.vy * dt; pp.vy += 24 * U * dt; pp.vx *= 0.96; ctx.globalAlpha = Math.max(0, pp.life / pp.max) * 0.9; ctx.fillStyle = pp.c; ctx.fillRect(pp.x, pp.y, pp.r, pp.r); }
      ctx.globalAlpha = 1; ctx.restore();
      if (t > END - 0.6) { ctx.globalAlpha = cl((t - (END - 0.6)) / 0.6); ctx.fillStyle = C.void; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
      raf = requestAnimationFrame(frame);
    }

    // slash with anticipation -> strike -> follow-through (hand arcs; body uncoils)
    function slashPose(t: number, d: number, side: number, hs: number): Pose {
      const s0 = d - 0.36, p = cl((t - s0) / (d + 0.12 - s0));
      const wind = cl(p / 0.35), strike = cl((p - 0.35) / 0.35), follow = cl((p - 0.7) / 0.3);
      const pose = basePose(cx, cy, hs, side, t, false);
      // weight shifts back (anticipation) then forward (strike)
      pose.px = cx + side * lerp(-4, 6, eIn(strike)) * U;
      pose.lean = lerp(0, side > 0 ? 0.05 : -0.05, 1) + lerp(0.22, -0.28, ease(strike)) * 1; // coil back, uncoil forward
      pose.fR = { x: 13 * hs, y: 26 * hs }; pose.fL = { x: -9 * hs, y: 26 * hs };
      // sword hand: wind up high-back -> arc down/forward -> follow across
      const back: V = { x: -10 * hs, y: -20 * hs }, mid: V = { x: 14 * hs, y: -10 * hs }, end: V = { x: 16 * hs, y: 10 * hs };
      pose.hMain = follow > 0 ? lp(mid, end, eOut(follow)) : strike > 0 ? lp(back, mid, eOut(strike)) : lp({ x: 8 * hs, y: 4 * hs }, back, eOut(wind));
      pose.sword = follow > 0 ? lerp(0.3, 1.1, follow) : strike > 0 ? lerp(-2.4, 0.3, ease(strike)) : lerp(-0.7, -2.4, wind);
      pose.swordLen = 30 * hs;
      // slash trail at strike
      if (strike > 0 && follow < 0.5) { const hM = { x: cx + (pose.hMain.x) * side, y: (cy - 26 * hs) - Math.cos(pose.lean) * 18 * hs + pose.hMain.y }; ctx.save(); ctx.globalAlpha = (1 - strike) * 0.7; const g = ctx.createRadialGradient(hM.x, hM.y, 4, hM.x, hM.y, 30 * hs); g.addColorStop(0, "rgba(25,224,255,0)"); g.addColorStop(0.7, "rgba(25,224,255,0.3)"); g.addColorStop(1, "rgba(255,45,107,0.35)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hM.x, hM.y, 30 * hs, side > 0 ? -1.6 : -1.6, side > 0 ? 0.4 : 0.4); ctx.fill(); ctx.globalAlpha = 1; ctx.restore(); }
      return pose;
    }

    // superhero kneel-landing: knee down, head looks down->up, sword raised up-right
    function drawLanding(t: number, s: number, alpha: number) {
      const yOff = t < LAND ? -(1 - (t / LAND) ** 2) * H * 0.85 : 0;
      const look = cl((t - (LAND + 0.05)) / (LOOK - LAND)); // 0 down -> 1 up
      const land = cl((t - LAND) / 0.12); // squash on impact
      ctx.save(); ctx.translate(cx, cy + yOff);
      const px = 0, py = -lerp(10, 13, land) * s; // pelvis low (kneel)
      const lean = lerp(0.55, 0.32, look); // torso forward, eases up
      const chest = { x: px + Math.sin(lean) * 17 * s, y: py - Math.cos(lean) * 17 * s };
      const head = { x: chest.x + Math.sin(lean) * 8 * s, y: chest.y - Math.cos(lean) * 8 * s };
      ctx.globalAlpha = alpha; ctx.strokeStyle = C.bone; ctx.lineWidth = 2.7 * s; ctx.lineCap = "round"; ctx.lineJoin = "round";
      const seg = (ax: number, ay: number, bx: number, by: number) => { ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); };
      // back knee on ground (bent down), front leg planted bent
      seg(px, py, -8 * s, py + 9 * s); seg(-8 * s, py + 9 * s, -2 * s, 0); // back: thigh -> knee(ground)->shin
      const fk = ik(px, py, 13 * s, 0, 12 * s, 13 * s, 1); seg(px, py, fk.x, fk.y); seg(fk.x, fk.y, 13 * s, 0); // front leg IK
      seg(px, py, chest.x, chest.y); // spine
      ctx.beginPath(); ctx.arc(head.x - look * 1 * s, head.y - 5 * s - look * 6 * s, 5 * s, 0, 6.2832); ctx.stroke(); // head (lifts on look-up)
      // off hand (fist) planted on ground
      const ofk = ik(chest.x, chest.y, -9 * s, -1 * s, 9 * s, 9 * s, 1); seg(chest.x, chest.y, ofk.x, ofk.y); seg(ofk.x, ofk.y, -9 * s, -1 * s);
      // sword arm raised up-right
      const hand = { x: 11 * s, y: -16 * s }, ek = ik(chest.x, chest.y, hand.x, hand.y, 9 * s, 9 * s, -1);
      seg(chest.x, chest.y, ek.x, ek.y); seg(ek.x, ek.y, hand.x, hand.y);
      ctx.strokeStyle = C.volt; ctx.lineWidth = 3 * s; ctx.shadowColor = C.volt; ctx.shadowBlur = 14;
      seg(hand.x, hand.y, hand.x + Math.cos(-1.15) * 30 * s, hand.y + Math.sin(-1.15) * 30 * s); ctx.shadowBlur = 0;
      ctx.globalAlpha = 1; ctx.restore();
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
      <span className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[0.7rem] uppercase tracking-widest text-mist/50">click anywhere to skip</span>
    </div>
  );
}
