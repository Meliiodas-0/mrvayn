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
const LAND = 0.55, LOOK = 0.85, RISE = 1.15, RISE_END = 1.55;
const E1D = 1.95, E2D = 2.6;
const SURR_APP = 2.75, SURR_SET = 3.65, EXPLODE = 4.55, KILL = 4.85, FLIP_END = 5.5;
const VEXIT = 6.1, EXIT_END = 6.6; // victory hold (FLIP_END→VEXIT) then hero ascends into the light
const BLOOM = 6.1, TITLE = 6.8, ASH = 7.8, END = 9.4;

interface Pt { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; c: string; on: boolean; }
interface Dust { hx: number; hy: number; vx: number; vy: number; delay: number; }
type V = { x: number; y: number };

export function BootSequence() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [show, setShow] = useState(false);
  const skipRef = useRef(false);

  useEffect(() => {
    if (new URLSearchParams(location.search).has("cine")) { setShow(true); return; } // dev: frame inspector
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
      const thigh = 11 * s, shin = 11 * s, upper = 8 * s, fore = 8 * s, spine = 19 * s, neck = 5 * s, headR = 4.8 * s;
      const ax = (v: V): V => ({ x: p.px + v.x * f, y: p.py + v.y }); // pelvis-relative -> abs (face flips x)
      const chest = { x: p.px + Math.sin(p.lean) * spine * f, y: p.py - Math.cos(p.lean) * spine };
      const neckTop = { x: chest.x + Math.sin(p.lean) * neck * f, y: chest.y - Math.cos(p.lean) * neck };
      const head = { x: neckTop.x + Math.sin(p.lean) * headR * f, y: neckTop.y - Math.cos(p.lean) * headR };
      const cax = (v: V): V => ({ x: chest.x + v.x * f, y: chest.y + v.y }); // chest-relative -> abs
      const fL = ax(p.fL), fR = ax(p.fR), hM = cax(p.hMain), hO = cax(p.hOff);
      const kL = ik(p.px, p.py, fL.x, fL.y, thigh, shin, f), kR = ik(p.px, p.py, fR.x, fR.y, thigh, shin, f); // knees bend forward
      const eO = ik(chest.x, chest.y, hO.x, hO.y, upper, fore, f), eM = ik(chest.x, chest.y, hM.x, hM.y, upper, fore, f);
      const hip = { x: p.px, y: p.py };

      ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = color; ctx.lineWidth = 2.8 * s;
      const seg = (a: V, b: V) => { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); };
      // back limbs dim for depth
      ctx.globalAlpha = alpha * 0.7;
      seg(hip, kL); seg(kL, fL); // back leg (straight shin, no foot kink)
      seg(chest, eO); seg(eO, hO); // back (off) arm
      // front + core
      ctx.globalAlpha = alpha;
      seg(hip, chest); seg(chest, neckTop); // spine + neck
      ctx.beginPath(); ctx.arc(head.x, head.y, headR, 0, 6.2832); ctx.stroke(); // head
      seg(hip, kR); seg(kR, fR); // front leg (straight shin, no foot kink)
      seg(chest, eM); seg(eM, hM); // sword arm
      // sword
      ctx.strokeStyle = C.volt; ctx.lineWidth = 3 * s; if (glow) { ctx.shadowColor = C.volt; ctx.shadowBlur = 13; }
      seg(hM, { x: hM.x + Math.cos(p.sword) * p.swordLen * f, y: hM.y + Math.sin(p.sword) * p.swordLen });
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      return { chest, hM };
    }

    // standing/run/idle base pose — athletic stance, knees bent, feet planted
    function basePose(px: number, ground: number, s: number, face: number, t: number, run: boolean): Pose {
      const bob = Math.sin(t * (run ? 9 : 2.2)) * (run ? 2 : 0.7) * s;
      const py = ground - 18 * s + bob; // hips low enough that IK bends the knees
      const fy = ground - py; // foot offset that lands the feet exactly on the ground
      const step = run ? Math.sin(t * 9) : 0, step2 = run ? Math.sin(t * 9 + Math.PI) : 0;
      return {
        px, py, face, lean: run ? 0.16 : Math.sin(t * 2.2) * 0.025,
        fL: { x: -7 * s + step2 * 9 * s, y: fy - Math.max(0, step2) * 7 * s },
        fR: { x: 7 * s + step * 9 * s, y: fy - Math.max(0, step) * 7 * s },
        hMain: { x: 6 * s, y: -3 * s + Math.sin(t * 2.2) * s },
        hOff: { x: 6 * s, y: 8 * s },
        sword: -0.5, swordLen: 24 * s,
      };
    }

    const lerpPose = (a: Pose, b: Pose, k: number): Pose => ({
      px: lerp(a.px, b.px, k), py: lerp(a.py, b.py, k), face: b.face, lean: lerp(a.lean, b.lean, k),
      fL: lp(a.fL, b.fL, k), fR: lp(a.fR, b.fR, k), hMain: lp(a.hMain, b.hMain, k), hOff: lp(a.hOff, b.hOff, k),
      sword: lerp(a.sword, b.sword, k), swordLen: lerp(a.swordLen, b.swordLen, k),
    });

    // landing crouch pose (shared rig) — head bows (look 0) then lifts (look 1)
    function landPose(ground: number, s: number, look: number): Pose {
      const py = ground - 12 * s, fy = ground - py;
      return { px: cx, py, face: 1, lean: lerp(0.62, 0.16, look), fL: { x: -4 * s, y: fy }, fR: { x: 13 * s, y: fy }, hMain: { x: -7 * s, y: -12 * s }, hOff: { x: 11 * s, y: 15 * s }, sword: -1.15, swordLen: 28 * s };
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

    const start = performance.now(); let raf = 0; let hardStop: ReturnType<typeof setTimeout> | undefined;

    function render(t: number) {
      let shake = 0;
      if (t > LAND - 0.04 && t < LAND + 0.2) shake = 10 * U;
      if ((t > E1D - 0.05 && t < E1D + 0.08) || (t > E2D - 0.05 && t < E2D + 0.08)) shake = 5 * U;
      if (t > KILL - 0.05 && t < KILL + 0.3) shake = 13 * U;

      ctx.clearRect(0, 0, W, H); ctx.fillStyle = C.void; ctx.fillRect(0, 0, W, H);
      ctx.save(); if (shake) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

      const bA = t < VEXIT ? 1 : cl(1 - (t - VEXIT) / (EXIT_END - VEXIT));
      const contact = 54 * U;

      // shockwaves
      if (t > LAND && t < LAND + 0.6) { const p = (t - LAND) / 0.6; ctx.globalAlpha = (1 - p) * 0.85; ctx.strokeStyle = C.volt; ctx.lineWidth = 4 * U; ctx.beginPath(); ctx.ellipse(cx, cy, p * 230 * U, p * 64 * U, 0, 0, 6.2832); ctx.stroke(); ctx.globalAlpha = 1; if (p < 0.05) burst(cx, cy, 28, true); }
      // finisher explosion — layered shockwave rings + radial impact lines (additive for punch)
      if (t > KILL && t < KILL + 0.85) {
        const p = (t - KILL) / 0.85, R = Math.max(W, H), oy = cy - 26 * U;
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        const ring = (delay: number, col: string, w: number, sp: number) => { const rp = cl((p - delay) / (1 - delay)); if (rp <= 0) return; ctx.globalAlpha = Math.pow(1 - rp, 1.5); ctx.strokeStyle = col; ctx.lineWidth = w * U * (1 - rp); ctx.beginPath(); ctx.arc(cx, oy, eOut(rp) * R * sp, 0, 6.2832); ctx.stroke(); };
        ring(0, C.bone, 9, 0.5); ring(0.07, C.volt, 6, 0.66); ring(0.16, C.surge, 6, 0.8);
        ctx.globalAlpha = (1 - p) * 0.6; ctx.strokeStyle = C.volt; ctx.lineWidth = 2 * U; ctx.lineCap = "round";
        for (let i = 0; i < 20; i++) { const a = (i / 20) * 6.2832, r0 = (0.25 + p) * 120 * U, r1 = r0 + 90 * U * (1 - p); ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r0, oy + Math.sin(a) * r0); ctx.lineTo(cx + Math.cos(a) * r1, oy + Math.sin(a) * r1); ctx.stroke(); }
        // core flash bloom
        const cp = cl(p / 0.18), cg = ctx.createRadialGradient(cx, oy, 0, cx, oy, 90 * U * (0.4 + cp)); cg.addColorStop(0, `rgba(255,255,255,${0.9 * (1 - cp)})`); cg.addColorStop(0.5, `rgba(255,200,120,${0.5 * (1 - cp)})`); cg.addColorStop(1, "rgba(255,45,107,0)");
        ctx.globalAlpha = 1; ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, oy, 90 * U * (0.4 + cp), 0, 6.2832); ctx.fill();
        ctx.restore();
      }
      if (t > KILL && t < KILL + 0.22) { ctx.globalAlpha = (1 - (t - KILL) / 0.22) * 0.85; ctx.fillStyle = C.bone; ctx.fillRect(-20, -20, W + 40, H + 40); ctx.globalAlpha = 1; }

      if (bA > 0) {
        // line enemies — run in, recoil-fly on hit
        const line = [{ side: 1, s: RISE_END, e: 1.78, d: E1D }, { side: -1, s: 2.05, e: 2.45, d: E2D }];
        line.forEach((f, i) => {
          if (t < f.s) return;
          let fx: number, a = bA, fly = 0;
          if (t >= f.d) { const dp = (t - f.d) / 0.6; if (dp >= 1) return; fx = cx + f.side * (contact + eOut(dp) * 380 * U); a = (1 - dp) * bA; fly = dp; if (!seeded.has("l" + i)) { burst(cx + f.side * contact, cy - 24 * U, 18); seeded.add("l" + i); } }
          else if (t < f.e) fx = cx + f.side * lerp(Math.max(W, H) * 0.55, contact, ease((t - f.s) / (f.e - f.s)));
          else fx = cx + f.side * contact;
          ctx.save();
          if (fly) {
            // knockback: shoved SIDEWAYS by the slash (vx≫vy), small lift then gravity fall, tumbling about the torso
            const yArc = (-6 * fly + 64 * fly * fly) * U;
            ctx.translate(fx, cy - 22 * U + yArc); ctx.rotate(fly * 3.4 * f.side);
            const ep = basePose(0, 22 * U, 0.95 * U, -f.side, t, false);
            ep.hMain = { x: 9 * U, y: -2 * U }; ep.sword = -1.0;
            figure(ep, { color: C.mist, s: 0.95 * U, alpha: a });
          } else {
            ctx.translate(fx, 0);
            const ep = basePose(0, cy, 0.95 * U, -f.side, t * 1.2 + i, t < f.e);
            ep.hMain = { x: 9 * U, y: -2 * U }; ep.sword = -1.0; // enemy sword forward
            figure(ep, { color: C.mist, s: 0.95 * U, alpha: a });
          }
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
          if (t > KILL - 0.05 && t < KILL + 0.05) { burst(cx, cy - 24 * U, 90, true); burst(cx, cy - 24 * U, 40, false); }
        }

        // ---- HERO ----
        const hs = 1.55 * U;
        if (t < RISE) { drawLanding(t, hs, bA); }
        else {
          let p: Pose;
          if (t < RISE_END) { // stand up from the landing crouch (feet stay planted)
            const k = ease((t - RISE) / (RISE_END - RISE));
            p = lerpPose(landPose(cy, hs, 1), basePose(cx, cy, hs, 1, t, false), k);
          } else if (t >= FLIP_END) { // victory hold, then ascend into the light
            p = basePose(cx, cy, hs, 1, t, false);
            p.lean = 0.02; p.hMain = { x: 1 * hs, y: -17 * hs }; p.hOff = { x: -6 * hs, y: 2 * hs }; p.sword = -1.5; p.swordLen = 30 * hs; // triumphant, sword raised
            if (t > VEXIT) p.py -= eIn(cl((t - VEXIT) / (EXIT_END - VEXIT))) * 140 * U; // rise as he fades
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

      // ---- heroic transition: light beam rises where the hero stood -> title forms ----
      if (t > VEXIT) {
        const bloomP = cl((t - VEXIT) / (TITLE - VEXIT)), fade = t > TITLE ? cl(1 - (t - TITLE) / 0.5) : 1;
        ctx.save(); const grd = ctx.createLinearGradient(cx, cy + 20 * U, cx, cy - 280 * U);
        grd.addColorStop(0, "rgba(255,45,107,0)"); grd.addColorStop(0.35, `rgba(255,45,107,${0.45 * bloomP * fade})`); grd.addColorStop(1, "rgba(255,45,107,0)");
        const bw = lerp(28, 110, eOut(bloomP)) * U; ctx.fillStyle = grd; ctx.fillRect(cx - bw / 2, cy - 280 * U, bw, 300 * U); ctx.restore();
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
    }

    function loop(now: number) {
      let t = (now - start) / 1000;
      if (skipRef.current) t = Math.max(t, TITLE);
      if (t >= END) { done(); return; }
      render(t);
      raf = requestAnimationFrame(loop);
    }

    // slash: anticipation (coil back, raise) -> strike (whip down, lunge) -> follow-through
    function slashPose(t: number, d: number, side: number, hs: number): Pose {
      const s0 = d - 0.36, p = cl((t - s0) / (d + 0.12 - s0));
      const wind = cl(p / 0.32), strike = cl((p - 0.32) / 0.36), follow = cl((p - 0.68) / 0.32);
      const pose = basePose(cx, cy, hs, side, t, false);
      const fy = cy - pose.py; // foot offset that lands feet on the ground
      const lunge = eIn(strike) * (1 - follow * 0.5);
      pose.px = cx + side * lerp(-3, 7, lunge) * U; // weight shifts back then drives forward
      pose.lean = follow > 0 ? lerp(0.25, 0.12, follow) : strike > 0 ? lerp(-0.28, 0.26, ease(strike)) : lerp(0, -0.28, eOut(wind));
      pose.fR = { x: (10 + lunge * 6) * hs, y: fy }; // front foot lunges
      pose.fL = { x: -11 * hs, y: fy };             // back foot planted (knee bent)
      const back: V = { x: -9 * hs, y: -18 * hs }, mid: V = { x: 13 * hs, y: -9 * hs }, end: V = { x: 15 * hs, y: 12 * hs };
      pose.hMain = follow > 0 ? lp(mid, end, eOut(follow)) : strike > 0 ? lp(back, mid, eOut(strike)) : lp({ x: 6 * hs, y: -3 * hs }, back, eOut(wind));
      pose.sword = follow > 0 ? lerp(0.35, 1.2, follow) : strike > 0 ? lerp(-2.4, 0.4, ease(strike)) : lerp(-0.5, -2.4, wind);
      pose.swordLen = 30 * hs;
      // slash trail through the strike
      if (strike > 0 && follow < 0.6) {
        const chestX = pose.px + Math.sin(pose.lean) * 19 * hs * side, chestY = pose.py - Math.cos(pose.lean) * 19 * hs;
        const hMx = chestX + pose.hMain.x * side, hMy = chestY + pose.hMain.y;
        ctx.save(); ctx.globalAlpha = (1 - strike) * 0.6;
        const g = ctx.createRadialGradient(hMx, hMy, 4, hMx, hMy, 32 * hs); g.addColorStop(0, "rgba(25,224,255,0)"); g.addColorStop(0.7, "rgba(25,224,255,0.28)"); g.addColorStop(1, "rgba(255,45,107,0.32)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hMx, hMy, 32 * hs, -1.7, 0.5); ctx.fill(); ctx.globalAlpha = 1; ctx.restore();
      }
      return pose;
    }

    // superhero landing drawer (drop-in + look down->up), built on landPose
    function drawLanding(t: number, s: number, alpha: number) {
      const yOff = t < LAND ? -(1 - (t / LAND) ** 2) * H * 0.85 : 0; // fast drop-in
      const look = cl((t - (LAND + 0.05)) / (LOOK - LAND)); // 0 = head down, 1 = head up
      figure(landPose(cy + yOff, s, look), { color: C.bone, s, alpha, glow: true });
    }

    const cine = new URLSearchParams(location.search).get("cine");
    if (cine !== null) { const dt = parseFloat(cine) || 0; raf = requestAnimationFrame(() => render(dt)); } // dev: freeze one frame at t
    else { hardStop = setTimeout(done, END * 1000 + 300); raf = requestAnimationFrame(loop); }
    return () => { cancelAnimationFrame(raf); if (hardStop) clearTimeout(hardStop); removeEventListener("resize", resize); };
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
