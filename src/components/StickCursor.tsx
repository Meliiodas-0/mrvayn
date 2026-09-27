"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { readThemeColors, readFonts, rgba } from "@/lib/themeColors";
import { MousePointer2 } from "lucide-react";
import {
  createAcrobat,
  findSpawn,
  stepAcrobat,
  scrollAcrobat,
  pointFree,
  airborne,
  PARKOUR,
  PARKOUR_TUNING_EVENT,
  type Acrobat,
  type World,
} from "@/lib/cursor/parkour";
import { drawAcrobat } from "@/lib/cursor/acrobatDrawing";
import { hoverSpawn, stepHover, type HoverMotion } from "@/lib/cursor/hover";
import { createObstacleReader, contentClip } from "@/lib/cursor/obstacles";

/**
 * Global stickman cursor (desktop / fine-pointer / motion-allowed only).
 * The real cursor is hidden and a sword stickman is drawn at the pointer with
 * ZERO lag: its HEAD sits on the real hotspot, the feet hang below like a native
 * arrow's tail, and a small reticle at the head fills red over anything clickable.
 * Original hovering wanderers, watchful scouts and one parkour rival coexist. DOM content,
 * media and visible rules are protected by full-body clearance and an effect
 * clipping mask. Bring the cursor onto an enemy to
 * trigger a slash combo. Enemies freeze and hide while a dialog is open (the
 * player stays, it is the only cursor). Pointer-events:none; pauses on tab hide;
 * touch / reduced-motion keep the normal cursor.
 */

const RANGE = 70,
  SWING = 0.3;
const HOT_R = 33.15; // legLen + torso + headR at scale 1.12: the head centre

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}
interface Enemy {
  x: number;
  y: number;
  alive: boolean;
  dying: number;
  home: number;
  acrobat: Acrobat;
  hover?: HoverMotion;
}
interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  c: string;
  r: number;
  on: boolean;
}
interface Shard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ang: number;
  va: number;
  len: number;
  life: number;
  max: number;
  col: string;
  on: boolean;
}
interface Slash {
  x: number;
  y: number;
  ang: number;
  life: number;
  on: boolean;
}
interface Pop {
  x: number;
  y: number;
  life: number;
  text: string;
  on: boolean;
}

export function StickCursor() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(true);
  const [eligible, setEligible] = useState(false);
  const [controlSlot, setControlSlot] = useState<HTMLElement | null>(null);
  const scoreRef = useRef({ count: 0, best: 0 });
  const [score, setScore] = useState(scoreRef.current);

  useEffect(() => {
    const fine = matchMedia("(pointer: fine) and (min-width: 1024px)"),
      reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEligible(fine.matches && !reduce.matches);
    sync();
    fine.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    setControlSlot(document.getElementById("cursor-control-slot"));
    try {
      setEnabled(localStorage.getItem("mrvayn-cursor-effects") !== "off");
    } catch {
      /* Storage is optional. */
    }
    try {
      const number = (value: string | null) =>
        Math.min(999999, Math.max(0, Math.floor(Number(value) || 0)));
      const count = number(sessionStorage.getItem("mrvayn-cursor-score"));
      scoreRef.current = {
        count,
        best: Math.max(
          count,
          number(localStorage.getItem("mrvayn-cursor-best")),
        ),
      };
      setScore({ ...scoreRef.current });
    } catch {
      /* Scores still work when storage is unavailable. */
    }
    return () => {
      fine.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);
  const toggle = () => {
    setEnabled((value) => {
      try {
        localStorage.setItem("mrvayn-cursor-effects", value ? "off" : "on");
      } catch {
        /* Storage is optional. */
      }
      return !value;
    });
  };

  useEffect(() => {
    if (!eligible || !enabled) return;
    {
      const q = new URLSearchParams(location.search);
      if (q.has("cine") || q.has("still")) return;
    } // dev: let the page idle for screenshots
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const canvas = ref.current;
    const c2d = canvas?.getContext("2d");
    if (!canvas || !c2d) return;
    const ctx = c2d;
    const C = readThemeColors();
    const F = readFonts();

    let W = 0,
      H = 0,
      dpr = 1;
    const m = { x: innerWidth / 2, y: innerHeight / 2 };
    let hasPointer = false;
    let pmx = m.x,
      pmy = m.y,
      vx = 0,
      vy = 0,
      face = 1,
      faceVel = 0,
      runPhase = 0;
    let atk = -1,
      atkType = 0,
      atkFace = 1,
      combo = 0,
      comboT = 0,
      flip = -1,
      flipCd = 0;
    let hot = false,
      hotT = 0;
    let occupied: Rect[] = [];
    const obstacleReader = createObstacleReader();
    let enemyClip = new Path2D();
    let world: World = { width: 0, height: 0, obstacles: [] };
    let tuning = { ...PARKOUR };
    const onTuning = (event: Event) => {
      if (process.env.NODE_ENV === "development")
        tuning = { ...PARKOUR, ...(event as CustomEvent).detail };
    };
    window.addEventListener(PARKOUR_TUNING_EVENT, onTuning);

    const enemies: Enemy[] = [];
    const parts: P[] = [];
    const shards: Shard[] = [];
    const slashes: Slash[] = [];
    const pops: Pop[] = [];
    for (let i = 0; i < 140; i++)
      parts.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 0,
        max: 0,
        c: C.surge,
        r: 2,
        on: false,
      });
    for (let i = 0; i < 90; i++)
      shards.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        ang: 0,
        va: 0,
        len: 0,
        life: 0,
        max: 0,
        col: C.mist,
        on: false,
      });
    for (let i = 0; i < 10; i++)
      slashes.push({ x: 0, y: 0, ang: 0, life: 0, on: false });
    for (let i = 0; i < 12; i++)
      pops.push({ x: 0, y: 0, life: 0, text: "", on: false });

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    // A small cast, one rival. The portfolio is not a crowded arena.
    const active = () => (W >= 1600 ? 8 : W >= 1280 ? 6 : W >= 1024 ? 4 : 0);

    const computeOccupied = () => {
      occupied = obstacleReader.read(W, H);
      world = { width: W, height: H, obstacles: occupied };
      enemyClip = contentClip(W, H, occupied);
    };

    const place = (e: Enemy, idx: number) => {
      if (idx >= active()) {
        e.alive = false;
        return;
      }
      {
        const neighbours = enemies
          .filter((o) => o !== e && o.alive)
          .map((o) => ({ x: o.acrobat.x, y: o.acrobat.y }));
        if (hasPointer) neighbours.push(m);
        const p = e.hover
          ? hoverSpawn(world, neighbours, e.home, Math.random, e.hover.lane)
          : findSpawn(world, Math.random, e.home, neighbours);
        if (!p) {
          e.alive = false;
          return;
        }
        const { moves, blocked, performed, temperament } = e.acrobat;
        e.acrobat = {
          ...createAcrobat(p.x, p.y, temperament),
          moves,
          blocked,
          performed,
        };
        e.acrobat.wait = 1.2 + idx * 0.8;
        e.acrobat.facing = p.x > W / 2 ? -1 : 1;
        e.acrobat.attachment =
          e.hover || Math.abs(p.y - (H - 48)) < 2 ? "viewport" : "page";
        if (e.hover) {
          e.hover.vx = rand(-40, 40);
          e.hover.vy = rand(-40, 40);
        }
        e.x = p.x;
        e.y = p.y + 18;
        e.alive = true;
        e.dying = 0;
        return;
      }
    };
    for (let i = 0; i < 8; i++)
      enemies.push({
        x: 0,
        y: 0,
        alive: false,
        dying: 0,
        home: i % 2 === 0 ? -1 : 1,
        acrobat: createAcrobat(0, 0, i === 1 ? "rival" : "scout"),
        ...([2, 3, 5, 6, 7].includes(i)
          ? {
              hover: {
                vx: 0,
                vy: 0,
                clock: i * 2.7,
                lane:
                  i === 2
                    ? 0.2
                    : i === 3
                      ? 0.35
                      : i === 5
                        ? 0.72
                        : i === 6
                          ? 0.67
                          : 0.08,
              },
            }
          : {}),
      });

    const burst = (x: number, y: number, n: number) => {
      for (let i = 0; i < n; i++) {
        const p = parts.find((q) => !q.on);
        if (!p) break;
        const a = Math.random() * 6.28,
          s = rand(60, 300);
        p.on = true;
        p.x = x;
        p.y = y;
        p.vx = Math.cos(a) * s;
        p.vy = Math.sin(a) * s;
        p.max = p.life = rand(0.3, 0.7);
        p.r = rand(1.5, 3.5);
        p.c = Math.random() > 0.5 ? C.surge : C.volt;
      }
    };
    // a bright diagonal cut-line flash where the blade lands
    const slashFx = (x: number, y: number, dir: number) => {
      const s = slashes.find((q) => !q.on);
      if (s) {
        s.on = true;
        s.x = x;
        s.y = y - 14;
        s.ang = -0.5 + dir * 0.35;
        s.life = 0.22;
      }
    };
    // dice the enemy body into tumbling pieces that fly apart along the cut, then fade
    const sliceApart = (x: number, y: number, dir: number) => {
      const cut = -0.5 + dir * 0.35,
        n = 4;
      for (let i = 0; i < n; i++) {
        const s = shards.find((q) => !q.on);
        if (!s) break;
        const a = cut + (Math.PI / 2) * (i % 2 ? 1 : -1) + rand(-0.5, 0.5); // halves fly to either side of the cut
        const sp = rand(120, 340);
        s.on = true;
        s.x = x + rand(-5, 5);
        s.y = y - 14 + rand(-12, 8);
        s.vx = Math.cos(a) * sp + dir * 40;
        s.vy = Math.sin(a) * sp - 50;
        s.ang = rand(0, 6.28);
        s.va = rand(-13, 13);
        s.len = rand(7, 15);
        s.max = s.life = rand(0.4, 0.7);
        s.col = Math.random() > 0.55 ? C.surge : C.mist;
      }
    };
    const pop = (x: number, y: number, t: string) => {
      const p = pops.find((q) => !q.on);
      if (p) {
        p.on = true;
        p.x = x;
        p.y = y;
        p.life = 0.9;
        p.text = t;
      }
    };

    const resize = () => {
      W = innerWidth;
      H = innerHeight;
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      computeOccupied();
      enemies.forEach(place);
    };

    let geometryDirty = true,
      layoutMotionUntil = 0,
      previousScroll = window.scrollY;
    const onScroll = () => {
      geometryDirty = true;
    };
    const onLayoutMotion = () => {
      layoutMotionUntil = performance.now() + 1200;
      geometryDirty = true;
    };
    const layoutObserver = new ResizeObserver(onScroll);
    layoutObserver.observe(document.body);
    const contentObserver = new MutationObserver(() => {
      obstacleReader.scan();
      geometryDirty = true;
    });
    contentObserver.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("load", onScroll, true);
    document.addEventListener("focusin", onScroll);
    document.addEventListener("focusout", onScroll);
    document.addEventListener("animationstart", onLayoutMotion, true);
    document.addEventListener("transitionrun", onLayoutMotion, true);
    const onMove = (e: MouseEvent) => {
      if (!hasPointer) {
        hasPointer = true;
        pmx = e.clientX;
        pmy = e.clientY;
      } // no phantom flick from the viewport centre
      m.x = e.clientX;
      m.y = e.clientY;
    };
    const onLeave = () => {
      hasPointer = false;
    };
    addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    addEventListener("resize", resize);
    addEventListener("scroll", onScroll, { passive: true });
    const occInterval = setInterval(onScroll, 350);
    document.documentElement.style.cursor = "none";
    document.documentElement.dataset.stick = "1"; // globals.css: no UA hand over links/buttons
    resize();

    function drawStick(
      x: number,
      y: number,
      o: {
        color: string;
        face: number;
        phase: number;
        moving: boolean;
        scale: number;
        sword: number;
        swordLen: number;
        glow?: boolean;
        swordColor?: string;
      },
    ) {
      const {
        color,
        face: f,
        phase,
        moving,
        scale,
        sword,
        swordLen,
        glow,
        swordColor,
      } = o;
      const legLen = 12 * scale,
        torso = 13 * scale,
        headR = 4.6 * scale;
      const hipY = y - legLen,
        shoulderY = hipY - torso;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.3 * scale;
      ctx.lineCap = "round";
      const sw = moving ? Math.sin(phase) * 0.6 : Math.sin(phase * 0.25) * 0.08;
      ctx.beginPath();
      ctx.moveTo(x, hipY);
      ctx.lineTo(x + Math.sin(sw) * legLen, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, hipY);
      ctx.lineTo(x - Math.sin(sw) * legLen, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, hipY);
      ctx.lineTo(x - (moving ? f * 3 : 0), shoulderY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, shoulderY + 1);
      ctx.lineTo(x - f * 7 * scale - Math.sin(sw) * 5, shoulderY + 8 * scale);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, shoulderY - headR, headR, 0, 6.2832);
      ctx.stroke();
      const handX = x + f * 8 * scale,
        handY = shoulderY + 6 * scale;
      const ax = Math.cos(sword) * f,
        ay = Math.sin(sword);
      ctx.beginPath();
      ctx.moveTo(x, shoulderY + 1);
      ctx.lineTo(handX, handY);
      ctx.stroke();
      const sc = swordColor ?? C.volt;
      ctx.strokeStyle = sc;
      ctx.lineWidth = 2.6 * scale;
      if (glow) {
        ctx.shadowColor = sc;
        ctx.shadowBlur = 9;
      }
      ctx.beginPath();
      ctx.moveTo(handX, handY);
      ctx.lineTo(handX + ax * swordLen, handY + ay * swordLen);
      ctx.stroke();
      ctx.shadowBlur = 0;
      return { handX, handY };
    }

    let last = performance.now(),
      raf = 0,
      running = !document.hidden;
    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    function loop(now: number) {
      if (!running) return;
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;
      const modal = document.documentElement.hasAttribute("data-modal");
      const scrollDelta = window.scrollY - previousScroll;
      previousScroll = window.scrollY;
      if (scrollDelta)
        enemies.forEach((e) => {
          scrollAcrobat(e.acrobat, scrollDelta);
          e.x = e.acrobat.x;
          e.y = e.acrobat.y + 18;
        });
      if (geometryDirty || now < layoutMotionUntil) {
        computeOccupied();
        geometryDirty = false;
      }

      // mouse velocity (no positional lag, figure is drawn at the exact pointer)
      const dxRaw = m.x - pmx,
        dyRaw = m.y - pmy;
      vx = dxRaw / Math.max(dt, 0.001);
      vy = dyRaw / Math.max(dt, 0.001);
      pmx = m.x;
      pmy = m.y;
      const speed = Math.hypot(vx, vy);
      const moving = hasPointer && speed > 40;
      // facing: smoothed horizontal pixel-delta (frame-rate / browser independent, fixes Chrome not flipping)
      faceVel = faceVel * 0.8 + dxRaw * 0.2;
      if (Math.abs(faceVel) > 0.35) face = faceVel > 0 ? 1 : -1;
      runPhase += dt * (moving ? 18 : 4);

      // hover state, throttled to 10Hz (the canvas is pointer-events:none, so
      // elementFromPoint returns the page element under the hotspot)
      hotT -= dt;
      if (hotT <= 0) {
        hotT = 0.1;
        hot =
          hasPointer &&
          !!document
            .elementFromPoint(m.x, m.y)
            ?.closest('a,button,[role="button"],video,iframe,summary');
      }

      if (!modal) {
        // React before the attack test, so a planned leap can evade a sword swing.
        enemies.forEach((e, idx) => {
          if (!e.alive) return;
          if (idx >= active()) {
            e.alive = false;
            return;
          }
          if (!pointFree(e.acrobat, world)) {
            place(e, idx);
            return;
          }
          if (e.hover) {
            stepHover(
              e.acrobat,
              e.hover,
              dt,
              world,
              hasPointer && !hot ? m : null,
              enemies.filter((o) => o !== e && o.alive).map((o) => o.acrobat),
            );
            e.x = e.acrobat.x;
            e.y = e.acrobat.y + 18;
            return;
          }
          // Other bodies reserve a little room too. Do not path straight through a
          // companion. Geometry reads are still batched once, outside this loop.
          const neighbours = enemies
            .filter((o) => o !== e && o.alive)
            .map((o) => ({
              left: o.acrobat.x - 10,
              right: o.acrobat.x + 10,
              top: o.acrobat.y - 16,
              bottom: o.acrobat.y + 20,
            }));
          stepAcrobat(
            e.acrobat,
            dt,
            { ...world, obstacles: [...occupied, ...neighbours] },
            hasPointer && !hot ? m : null,
            tuning,
          );
          e.x = e.acrobat.x;
          e.y = e.acrobat.y + 18;
        });
        // nearest enemy
        let near: Enemy | null = null,
          nd = 1e9;
        for (const e of enemies) {
          if (!e.alive || e.acrobat.opacity < 0.5) continue;
          const d = Math.hypot(e.x - m.x, e.y - m.y);
          if (d < nd) {
            nd = d;
            near = e;
          }
        }

        // attack on proximity only
        if (hasPointer && !hot && atk < 0 && near && nd < RANGE) {
          atk = 0;
          atkType = ((atkType + 1 + Math.random() * 3) | 0) % 5;
          atkFace = near.x > m.x ? 1 : -1;
        }
        if (
          hasPointer &&
          atk < 0 &&
          flip < 0 &&
          moving &&
          speed > 1400 &&
          flipCd <= 0 &&
          !near
        ) {
          flip = 0;
          flipCd = 1.6;
        }
        flipCd -= dt;
        if (comboT > 0) {
          comboT -= dt;
          if (comboT <= 0) combo = 0;
        }

        // swing
        if (atk >= 0) {
          atk += dt / SWING;
          if (!hot && atk > 0.12 && atk < 0.72) {
            const spin = atkType === 3;
            for (const e of enemies) {
              if (!e.alive || airborne(e.acrobat) || e.acrobat.opacity < 0.5)
                continue;
              const ex = e.x - m.x,
                d = Math.hypot(ex, e.y - m.y);
              if (
                d < RANGE + 6 &&
                (spin || Math.sign(ex) === atkFace || d < 30)
              ) {
                e.alive = false;
                e.dying = 0.7; // respawn lock (no death-stick render; shards handle the visual)
                combo = comboT > 0 ? combo + 1 : 1;
                comboT = 1.4;
                scoreRef.current.count = Math.min(
                  999999,
                  scoreRef.current.count + 1,
                );
                scoreRef.current.best = Math.max(
                  scoreRef.current.best,
                  scoreRef.current.count,
                );
                setScore({ ...scoreRef.current });
                try {
                  sessionStorage.setItem(
                    "mrvayn-cursor-score",
                    String(scoreRef.current.count),
                  );
                  localStorage.setItem(
                    "mrvayn-cursor-best",
                    String(scoreRef.current.best),
                  );
                } catch {
                  /* A blocked storage API never interrupts the animation. */
                }
                slashFx(e.x, e.y, atkFace);
                sliceApart(e.x, e.y, atkFace);
                burst(e.x, e.y - 14, 3);
                pop(e.x, e.y - 16, combo > 1 ? "x" + combo : "+1");
                e.dying = 3 + Math.random() * 2; // Leave breathing room after a defeat.
              }
            }
          }
          if (atk >= 1) atk = -1;
        }
        if (flip >= 0) {
          flip += dt / 0.5;
          if (flip >= 1) flip = -1;
        }

        // Respawning belongs to the same paused/resumed clock as the encounter.
        enemies.forEach((e, idx) => {
          if (!e.alive) {
            if (e.dying > 0) e.dying -= dt;
            else if (idx < active() && Math.random() < dt * 0.6) place(e, idx);
            return;
          }
          if (idx >= active()) {
            e.alive = false;
            return;
          } // viewport shrank: drop the extras
        });

        // particles / shards / slash flashes / pops
        for (const p of parts) {
          if (!p.on) continue;
          p.life -= dt;
          if (p.life <= 0) {
            p.on = false;
            continue;
          }
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vx *= 0.9;
          p.vy *= 0.9;
        }
        for (const s of shards) {
          if (!s.on) continue;
          s.life -= dt;
          if (s.life <= 0) {
            s.on = false;
            continue;
          }
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.vy += 540 * dt;
          s.vx *= 0.98;
          s.ang += s.va * dt;
        }
        for (const s of slashes) {
          if (s.on) {
            s.life -= dt;
            if (s.life <= 0) s.on = false;
          }
        }
        for (const p of pops) {
          if (p.on) {
            p.life -= dt;
            p.y -= dt * 26;
            if (p.life <= 0) p.on = false;
          }
        }
      }

      // ---- render ----
      ctx.clearRect(0, 0, W, H);

      if (!modal) {
        ctx.save();
        ctx.clip(enemyClip);
        ctx.globalAlpha = 0.85;
        for (const e of enemies) {
          if (!e.alive) continue;
          if (e.acrobat.temperament === "rival") {
            drawAcrobat(
              ctx,
              e.acrobat,
              { body: "#E4E6E9", accent: "#CD8B93" },
              tuning.trails,
            );
            continue;
          }
          const travelling = e.acrobat.state === "travel";
          ctx.globalAlpha =
            e.acrobat.opacity * (e.hover ? 0.7 : travelling ? 0.7 : 0.5);
          drawStick(e.x, e.y, {
            color: C.volt,
            face: e.acrobat.facing,
            phase: e.acrobat.stride,
            moving: travelling,
            scale: 0.85,
            sword: e.hover ? -0.7 : e.acrobat.intent === "retreat" ? -0.9 : 0.9,
            swordLen: e.hover ? 14 : 11,
            swordColor: C.volt,
          });
          if (e.hover) {
            ctx.fillStyle = C.surge;
            ctx.fillRect(e.x - 1.5, e.y - 31, 3, 3);
          }
          ctx.globalAlpha = 1;
        }
        ctx.globalAlpha = 1;
        // slash cut-line flash (the blade stroke)
        for (const s of slashes) {
          if (!s.on) continue;
          const k = s.life / 0.22;
          ctx.globalAlpha = k;
          ctx.strokeStyle = C.bone;
          ctx.lineWidth = 2.5;
          ctx.lineCap = "round";
          const L = 24 * (1.25 - k * 0.4),
            cxx = Math.cos(s.ang) * L,
            cyy = Math.sin(s.ang) * L;
          ctx.beginPath();
          ctx.moveTo(s.x - cxx, s.y - cyy);
          ctx.lineTo(s.x + cxx, s.y + cyy);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        // sliced body shards tumbling away, then gone
        for (const s of shards) {
          if (!s.on) continue;
          ctx.globalAlpha = Math.max(0, s.life / s.max);
          ctx.strokeStyle = s.col;
          ctx.lineWidth = 2.2;
          ctx.lineCap = "round";
          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(s.ang);
          ctx.beginPath();
          ctx.moveTo(-s.len / 2, 0);
          ctx.lineTo(s.len / 2, 0);
          ctx.stroke();
          ctx.restore();
          ctx.globalAlpha = 1;
        }
        for (const p of parts) {
          if (!p.on) continue;
          ctx.globalAlpha = Math.max(0, p.life / p.max);
          ctx.fillStyle = p.c;
          ctx.fillRect(p.x - p.r / 2, p.y - p.r / 2, p.r, p.r);
        }
        ctx.globalAlpha = 1;
        for (const p of pops) {
          if (!p.on) continue;
          ctx.globalAlpha = Math.min(1, p.life / 0.5);
          ctx.fillStyle = C.surge;
          ctx.font = `500 13px ${F.mono}`;
          ctx.textAlign = "center";
          ctx.fillText(p.text, p.x, p.y);
          ctx.globalAlpha = 1;
        }
        ctx.textAlign = "left";
        ctx.restore();
      }

      if (process.env.NODE_ENV === "development" && now % 250 < 25) {
        canvas!.dataset.parkour = JSON.stringify({
          obstacles: occupied.length,
          modal,
          score: scoreRef.current,
          actors: enemies.map((e) => ({
            type: e.hover ? "hover" : e.acrobat.temperament,
            intent: e.acrobat.intent,
            alive: e.alive,
            x: Math.round(e.x),
            y: Math.round(e.y - 18),
            state: e.acrobat.state,
            move: e.acrobat.plan?.kind ?? "idle",
            phase: +e.acrobat.phase.toFixed(2),
            moves: e.acrobat.moves,
            performed: e.acrobat.performed,
            blocked: e.acrobat.blocked,
            safe: pointFree(e.acrobat, world),
          })),
        });
      }

      // player stickman: head on the real pointer, feet hanging below
      if (hasPointer) {
        ctx.save();
        ctx.translate(m.x, m.y + HOT_R);
        if (flip >= 0) {
          ctx.translate(0, -16);
          ctx.rotate(flip * 6.2832 * face);
          ctx.translate(0, 16);
        }
        let sword = moving ? -0.95 : -0.62 + Math.sin(now / 380) * 0.14;
        let swordLen = 22;
        if (atk >= 0) {
          const p = atk,
            e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; // easeInOutCubic
          if (atkType === 0) sword = (-135 + e * 160) * (Math.PI / 180);
          else if (atkType === 1) sword = (-85 + e * 175) * (Math.PI / 180);
          else if (atkType === 2) {
            sword = -0.1;
            swordLen = 22 + Math.sin(p * Math.PI) * 18;
          } else if (atkType === 3) sword = e * 6.2832 - Math.PI / 2;
          else sword = (75 - e * 165) * (Math.PI / 180);
          // slash wedge, red on paper
          const hx = face * 8,
            hy = -7,
            a1 = sword,
            a0 = sword - face * 0.9;
          const g = ctx.createRadialGradient(hx, hy, 4, hx, hy, swordLen);
          g.addColorStop(0, rgba("surge", 0));
          g.addColorStop(0.7, rgba("surge", 0.22));
          g.addColorStop(1, rgba("ion", 0.32));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(hx, hy);
          ctx.arc(hx, hy, swordLen, Math.min(a0, a1), Math.max(a0, a1));
          ctx.closePath();
          ctx.fill();
        }
        drawStick(0, 0, {
          color: C.bone,
          face,
          phase: runPhase,
          moving,
          scale: 1.12,
          sword,
          swordLen,
          glow: true,
          swordColor: hot ? C.surge : undefined,
        });
        // the reticle at the hotspot: a centre dot, or a filled red head over targets
        ctx.fillStyle = hot ? C.surge : C.bone;
        ctx.beginPath();
        ctx.arc(0, -HOT_R, hot ? 5.15 : 1.6, 0, 6.2832);
        ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(loop);
    }
    if (running) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(occInterval);
      layoutObserver.disconnect();
      contentObserver.disconnect();
      document.removeEventListener("load", onScroll, true);
      document.removeEventListener("focusin", onScroll);
      document.removeEventListener("focusout", onScroll);
      document.removeEventListener("animationstart", onLayoutMotion, true);
      document.removeEventListener("transitionrun", onLayoutMotion, true);
      window.removeEventListener(PARKOUR_TUNING_EVENT, onTuning);
      removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      removeEventListener("resize", resize);
      removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      document.documentElement.style.cursor = "";
      delete document.documentElement.dataset.stick;
      ctx.clearRect(0, 0, W, H);
      delete canvas.dataset.parkour;
    };
  }, [eligible, enabled]);

  return (
    <>
      <canvas
        ref={ref}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-cursor"
      />
      {eligible &&
        controlSlot &&
        createPortal(
          <div className="cursor-console" data-solid>
            <button
              type="button"
              onClick={toggle}
              aria-pressed={enabled}
              aria-label="Cursor effects"
              title={
                enabled ? "Turn cursor effects off" : "Turn cursor effects on"
              }
              className="cursor-effects-toggle"
            >
              <MousePointer2 size={14} aria-hidden />
            </button>
            {enabled && (
              <div
                className="cursor-score"
                aria-label={`Cursor score ${score.count}. Personal best ${score.best}.`}
              >
                <span className="cursor-current">
                  <small>Score</small> <b>{String(score.count).padStart(3, "0")}</b>
                </span>
                <span className="cursor-best">
                  <small>Personal best</small> <b>{String(score.best).padStart(3, "0")}</b>
                </span>
              </div>
            )}
          </div>,
          controlSlot,
        )}
    </>
  );
}
