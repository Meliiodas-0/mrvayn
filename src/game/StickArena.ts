// STICK ARENA — a clean stickman sword game. The hero stickman runs toward the
// cursor; click to swing (4 sword animations) and cut down enemies scattered
// across the arena. Power-fantasy loop: no death, no abrupt end — just kills.
// Framework-agnostic Canvas 2D: fixed-timestep update, object pooling, OVERDRIVE
// palette. Mounted by GameCanvas.tsx; input arrives via setPointer()/attack().

import { loadBest, saveBest } from "./storage";

export interface ArenaCallbacks {
  onScore?: (kills: number, best: number) => void;
  onSfx?: (t: "slash" | "kill") => void;
}

const C = {
  void: "#07090F",
  steel: "#1A2233",
  mist: "#8A94A7",
  bone: "#EAF0FF",
  surge: "#FF2D6B",
  volt: "#19E0FF",
};

const FIXED_DT = 1 / 120;
const MAX_FRAME = 0.05;
const SWING_DUR = 0.34;
const REACH = 46;

interface Enemy { x: number; y: number; vx: number; vy: number; phase: number; alive: boolean; dying: number; }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; color: string; active: boolean; }

export class StickArena {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cb: ArenaCallbacks;
  private dpr = 1;
  private W = 0;
  private H = 0;

  private raf = 0;
  private last = 0;
  private acc = 0;
  private running = false;
  private reduced = false;
  private lowPower = false;

  // player
  private px = 0;
  private py = 0;
  private face = 1;
  private runPhase = 0;
  private moving = false;
  private atk = -1; // swing progress 0..1, -1 = not attacking
  private atkType = 0;
  private atkFace = 1;

  // pointer
  private tx = 0;
  private ty = 0;
  private pointerInside = false;
  private wanderTimer = 0;

  private kills = 0;
  private best = 0;

  private enemies: Enemy[] = [];
  private particles: Particle[] = [];
  private enemyCount = 6;

  constructor(canvas: HTMLCanvasElement, cb: ArenaCallbacks = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D not supported");
    this.ctx = ctx;
    this.cb = cb;
    this.best = loadBest();
    this.lowPower = typeof navigator !== "undefined" && (navigator.hardwareConcurrency || 8) <= 4;
    for (let i = 0; i < 12; i++) this.enemies.push({ x: 0, y: 0, vx: 0, vy: 0, phase: 0, alive: false, dying: 0 });
    for (let i = 0; i < 120; i++) this.particles.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 0, size: 0, color: C.surge, active: false });
  }

  init() {
    this.resize();
    this.px = this.W * 0.5;
    this.py = this.H * 0.6;
    this.tx = this.px;
    this.ty = this.py;
    this.enemyCount = this.lowPower ? 4 : 6;
    for (let i = 0; i < this.enemyCount; i++) this.spawnEnemy();
    this.cb.onScore?.(0, this.best);
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, this.lowPower ? 1 : 2);
    this.W = Math.max(1, rect.width);
    this.H = Math.max(1, rect.height);
    this.canvas.width = Math.round(this.W * this.dpr);
    this.canvas.height = Math.round(this.H * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  setReducedMotion(v: boolean) { this.reduced = v; }

  setPointer(x: number, y: number, inside: boolean) {
    this.tx = x;
    this.ty = y;
    this.pointerInside = inside;
  }

  attack() {
    if (this.atk < 0) {
      this.atk = 0;
      this.atkType = Math.floor(Math.random() * 4);
      this.atkFace = this.face;
      this.cb.onSfx?.("slash");
    }
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  setVisible(v: boolean) {
    if (!v) {
      if (this.running) { this.running = false; cancelAnimationFrame(this.raf); }
    } else if (!this.running) {
      this.running = true;
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  // ---- internals ----
  private rand(a: number, b: number) { return a + Math.random() * (b - a); }

  private spawnEnemy() {
    const e = this.enemies.find((x) => !x.alive && x.dying <= 0);
    if (!e) return;
    // scatter around edges, away from the player
    let x = 0, y = 0, tries = 0;
    do {
      x = this.rand(28, this.W - 28);
      y = this.rand(28, this.H - 28);
      tries++;
    } while (Math.hypot(x - this.px, y - this.py) < 120 && tries < 8);
    e.x = x; e.y = y; e.vx = 0; e.vy = 0; e.phase = Math.random() * 6.28; e.alive = true; e.dying = 0;
  }

  private burst(x: number, y: number, color: string, n: number) {
    if (this.reduced) { n = Math.min(n, 4); }
    const count = this.lowPower ? Math.ceil(n / 2) : n;
    for (let i = 0; i < count; i++) {
      const p = this.particles.find((q) => !q.active);
      if (!p) break;
      const a = Math.random() * Math.PI * 2;
      const sp = this.rand(40, 220);
      p.active = true; p.x = x; p.y = y;
      p.vx = Math.cos(a) * sp; p.vy = Math.sin(a) * sp;
      p.max = p.life = this.rand(0.3, 0.6); p.size = this.rand(2, 4);
      p.color = color;
    }
  }

  private frame = (now: number) => {
    if (!this.running) return;
    let dt = (now - this.last) / 1000;
    this.last = now;
    if (dt > MAX_FRAME) dt = MAX_FRAME;
    this.acc += dt;
    let steps = 0;
    while (this.acc >= FIXED_DT && steps < 8) { this.update(FIXED_DT); this.acc -= FIXED_DT; steps++; }
    if (steps === 8) this.acc = 0; // never spiral
    this.render();
    this.raf = requestAnimationFrame(this.frame);
  };

  private update(dt: number) {
    // target: cursor if inside, else gentle auto-wander (attract)
    if (!this.pointerInside) {
      this.wanderTimer -= dt;
      if (this.wanderTimer <= 0) {
        // wander toward the nearest living enemy for an attract demo
        const e = this.enemies.find((q) => q.alive);
        if (e) { this.tx = e.x + this.rand(-12, 12); this.ty = e.y + this.rand(-8, 8); }
        else { this.tx = this.rand(40, this.W - 40); this.ty = this.rand(40, this.H - 40); }
        this.wanderTimer = this.rand(0.5, 1.1);
      }
    }

    // move toward target
    const dx = this.tx - this.px, dy = this.ty - this.py;
    const dist = Math.hypot(dx, dy);
    const speed = 230;
    if (dist > 10) {
      const inv = 1 / dist;
      this.px += dx * inv * speed * dt;
      this.py += dy * inv * speed * dt;
      this.moving = true;
      this.runPhase += dt * 12;
      if (Math.abs(dx) > 4) this.face = dx > 0 ? 1 : -1;
    } else {
      this.moving = false;
    }
    this.px = Math.max(18, Math.min(this.W - 18, this.px));
    this.py = Math.max(30, Math.min(this.H - 12, this.py));

    // attract auto-attack
    if (!this.pointerInside && this.atk < 0) {
      const e = this.enemies.find((q) => q.alive && Math.hypot(q.x - this.px, q.y - this.py) < REACH);
      if (e) this.attack();
    }

    // swing
    if (this.atk >= 0) {
      this.atk += dt / SWING_DUR;
      // active hit window — checked every frame; killed enemies drop out so no
      // double counting. Spin (type 3) hits all around; others hit the front
      // half-plane or anything very close.
      if (this.atk > 0.12 && this.atk < 0.78) {
        const spin = this.atkType === 3;
        for (const e of this.enemies) {
          if (!e.alive) continue;
          const ex = e.x - this.px, ey = e.y - this.py;
          const d = Math.hypot(ex, ey);
          if (d < REACH && (spin || Math.sign(ex) === this.atkFace || d < 26)) {
            e.alive = false; e.dying = 0.4;
            this.kills++;
            if (this.kills > this.best) { this.best = this.kills; saveBest(this.best); }
            this.cb.onScore?.(this.kills, this.best);
            this.cb.onSfx?.("kill");
            this.burst(e.x, e.y, C.surge, 14);
          }
        }
      }
      if (this.atk >= 1) this.atk = -1;
    }

    // enemies drift slowly toward player + bob; respawn to keep the arena full
    let living = 0;
    for (const e of this.enemies) {
      if (e.alive) {
        living++;
        e.phase += dt * 4;
        const ex = this.px - e.x, ey = this.py - e.y;
        const d = Math.hypot(ex, ey) || 1;
        const sp = 26;
        e.x += (ex / d) * sp * dt;
        e.y += (ey / d) * sp * dt;
      } else if (e.dying > 0) {
        e.dying -= dt;
      }
    }
    while (living < this.enemyCount) { this.spawnEnemy(); living++; }

    // particles
    for (const p of this.particles) {
      if (!p.active) continue;
      p.life -= dt;
      if (p.life <= 0) { p.active = false; continue; }
      p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.92; p.vy *= 0.92;
    }
  }

  // ---- render ----
  private render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.W, this.H);

    // arena bg
    const grad = ctx.createRadialGradient(this.W / 2, this.H * 0.4, 20, this.W / 2, this.H / 2, this.W);
    grad.addColorStop(0, "#0C111C");
    grad.addColorStop(1, C.void);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.W, this.H);
    if (!this.reduced) {
      ctx.strokeStyle = "rgba(26,34,51,0.6)";
      ctx.lineWidth = 1;
      for (let x = 0; x < this.W; x += 42) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, this.H); ctx.stroke(); }
      for (let y = 0; y < this.H; y += 42) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(this.W, y); ctx.stroke(); }
    }

    for (const e of this.enemies) { if (e.alive || e.dying > 0) this.drawEnemy(e); }
    for (const p of this.particles) if (p.active) {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
    this.drawPlayer();
  }

  private drawStick(x: number, y: number, opts: { color: string; face: number; phase: number; moving: boolean; scale: number; lineW: number }) {
    const ctx = this.ctx;
    const { color, face, phase, moving, scale, lineW } = opts;
    const legLen = 13 * scale, torso = 14 * scale, headR = 5 * scale;
    const hipY = y - legLen;
    const shoulderY = hipY - torso;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineW;
    ctx.lineCap = "round";
    const swing = moving ? Math.sin(phase) * 0.5 : 0.12;
    // legs
    ctx.beginPath(); ctx.moveTo(x, hipY); ctx.lineTo(x + Math.sin(swing) * legLen, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, hipY); ctx.lineTo(x - Math.sin(swing) * legLen, y); ctx.stroke();
    // torso
    ctx.beginPath(); ctx.moveTo(x, hipY); ctx.lineTo(x, shoulderY); ctx.stroke();
    // back arm (animated)
    ctx.beginPath(); ctx.moveTo(x, shoulderY + 1); ctx.lineTo(x - face * 7 * scale - Math.sin(swing) * 6, shoulderY + 9 * scale); ctx.stroke();
    // head
    ctx.beginPath(); ctx.arc(x, shoulderY - headR, headR, 0, Math.PI * 2); ctx.stroke();
    return { shoulderY };
  }

  private drawPlayer() {
    const ctx = this.ctx;
    const { shoulderY } = this.drawStick(this.px, this.py, {
      color: C.bone, face: this.face, phase: this.runPhase, moving: this.moving, scale: 1.15, lineW: 2.4,
    });
    // sword arm + sword
    const handX = this.px + this.face * 9;
    const handY = shoulderY + 7;
    let swordAng: number;
    let len = 22;
    const f = this.face;
    if (this.atk >= 0) {
      const p = this.atk;
      if (this.atkType === 0) swordAng = (-130 + p * 150) * (Math.PI / 180); // overhead
      else if (this.atkType === 1) swordAng = (-80 + p * 160) * (Math.PI / 180); // horizontal
      else if (this.atkType === 2) { swordAng = -10 * (Math.PI / 180); len = 22 + Math.sin(p * Math.PI) * 14; } // thrust
      else swordAng = p * Math.PI * 2 - Math.PI / 2; // spin
    } else {
      swordAng = (this.moving ? -50 : -38) * (Math.PI / 180);
    }
    const ax = Math.cos(swordAng) * f;
    const ay = Math.sin(swordAng);
    const tipX = handX + ax * len;
    const tipY = handY + ay * len;
    // sword arm
    ctx.strokeStyle = C.bone; ctx.lineWidth = 2.4; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(this.px, shoulderY + 1); ctx.lineTo(handX, handY); ctx.stroke();
    // swing arc trail
    if (this.atk >= 0 && this.atk < 0.8 && !this.reduced) {
      ctx.strokeStyle = "rgba(25,224,255,0.35)"; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(handX, handY, len, swordAng * 1 - 0.6, swordAng + 0.1); ctx.stroke();
    }
    // blade
    ctx.strokeStyle = C.volt; ctx.lineWidth = 3;
    if (!this.reduced) { ctx.shadowColor = C.volt; ctx.shadowBlur = 10; }
    ctx.beginPath(); ctx.moveTo(handX, handY); ctx.lineTo(tipX, tipY); ctx.stroke();
    ctx.shadowBlur = 0;
  }

  private drawEnemy(e: Enemy) {
    const ctx = this.ctx;
    if (e.dying > 0 && !e.alive) {
      ctx.globalAlpha = Math.max(0, e.dying / 0.4);
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.rotate((1 - e.dying / 0.4) * 1.2);
      this.drawStick(0, 0, { color: C.surge, face: 1, phase: 0, moving: false, scale: 0.95, lineW: 2 });
      ctx.restore();
      ctx.globalAlpha = 1;
      return;
    }
    const face = e.x > this.px ? -1 : 1;
    this.drawStick(e.x, e.y, { color: C.mist, face, phase: e.phase, moving: true, scale: 0.95, lineW: 2 });
    // small surge marker so enemies read as targets
    ctx.fillStyle = C.surge;
    ctx.fillRect(e.x - 1.5, e.y - 13 * 0.95 - 14 * 0.95 - 12, 3, 3);
  }
}
