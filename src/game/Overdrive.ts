// OVERDRIVE — one-input neon runner (GAME_SPEC §A/C). Framework-agnostic
// Canvas 2D engine: fixed-timestep update, object pooling, procedural VFX.
// Mounted by a thin React wrapper (GameCanvas.tsx). No DOM/listeners here
// except the canvas it's given — input arrives via action().
//
// TODO(MrVayn): swap the procedural player/obstacle shapes for custom sprite
// art if desired — see drawPlayer/drawObstacle.

import { loadBest, saveBest } from "./storage";

export type GameState = "idle" | "ready" | "playing" | "paused" | "dead";

export interface OverdriveCallbacks {
  onState?: (s: GameState) => void;
  onScore?: (score: number, combo: number) => void;
  onBest?: (best: number) => void;
  onMilestone?: (label: string) => void;
}

const C = {
  void: "#07090F",
  carbon: "#0E1320",
  steel: "#1A2233",
  mist: "#8A94A7",
  bone: "#EAF0FF",
  surge: "#FF2D6B",
  volt: "#19E0FF",
  ion: "#B26BFF",
};

interface Obstacle { x: number; w: number; h: number; passed: boolean; active: boolean; }
interface Shard { x: number; y: number; r: number; spin: number; active: boolean; }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; color: string; active: boolean; }

const FIXED_DT = 1 / 120; // deterministic physics step
const MAX_FRAME = 0.05; // clamp to avoid spiral of death

export class Overdrive {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cb: OverdriveCallbacks;
  private dpr = 1;
  private W = 0;
  private H = 0;

  private raf = 0;
  private last = 0;
  private acc = 0;
  private running = false;

  private state: GameState = "idle";
  private reduced = false;
  private lowPower = false;

  // world
  private speed = 0;
  private baseSpeed = 320;
  private distance = 0;
  private score = 0;
  private combo = 0;
  private best = 0;
  private shake = 0;
  private spawnTimer = 0;
  private shardTimer = 0;
  private bgScroll = 0;
  private nextMilestone = 600;

  // player
  private px = 0;
  private py = 0;
  private vy = 0;
  private onGround = true;
  private readonly playerSize = 26;
  private trailTimer = 0;

  // pools
  private obstacles: Obstacle[] = [];
  private shards: Shard[] = [];
  private particles: Particle[] = [];

  constructor(canvas: HTMLCanvasElement, cb: OverdriveCallbacks = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D not supported");
    this.ctx = ctx;
    this.cb = cb;
    this.best = loadBest();
    this.lowPower = typeof navigator !== "undefined" && (navigator.hardwareConcurrency || 8) <= 4;
    for (let i = 0; i < 16; i++) this.obstacles.push({ x: 0, w: 0, h: 0, passed: false, active: false });
    for (let i = 0; i < 20; i++) this.shards.push({ x: 0, y: 0, r: 0, spin: 0, active: false });
    for (let i = 0; i < 160; i++) this.particles.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 0, size: 0, color: C.volt, active: false });
  }

  // ---- lifecycle ----
  init() {
    this.resize();
    this.cb.onBest?.(this.best);
    this.setState("idle");
    this.resetWorld(true);
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
    this.px = this.W * 0.22;
    if (this.onGround) this.py = this.groundY() - this.playerSize;
  }

  setReducedMotion(v: boolean) { this.reduced = v; }

  start() {
    if (this.state === "playing") return;
    this.resetWorld(false);
    this.setState("playing");
  }

  pause() {
    if (this.state === "playing") this.setState("paused");
  }

  resume() {
    if (this.state === "paused") {
      this.last = performance.now();
      this.setState("playing");
    }
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** Stop/start the whole loop when off-screen or tab hidden (CPU savings). */
  setVisible(v: boolean) {
    if (!v) {
      if (this.state === "playing") this.setState("paused");
      if (this.running) { this.running = false; cancelAnimationFrame(this.raf); }
    } else if (!this.running) {
      this.running = true;
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  /** Single abstracted input (click / tap / Space). */
  action() {
    if (this.state === "ready") { this.start(); return; }
    if (this.state === "dead") { this.start(); return; }
    if (this.state === "idle") { this.start(); return; }
    if (this.state !== "playing") return;
    this.jump();
  }

  arm() { if (this.state === "idle" || this.state === "dead") this.setState("ready"); }

  // ---- internals ----
  private setState(s: GameState) {
    this.state = s;
    this.cb.onState?.(s);
  }

  private groundY() { return this.H * 0.82; }

  private jump() {
    if (this.onGround) {
      this.vy = -Math.min(640, this.H * 0.95);
      this.onGround = false;
      if (!this.reduced) this.burst(this.px, this.py + this.playerSize, C.volt, 6, 120);
    }
  }

  private resetWorld(idle: boolean) {
    this.speed = this.baseSpeed;
    this.distance = 0;
    this.score = 0;
    this.combo = 0;
    this.shake = 0;
    this.spawnTimer = 0.6;
    this.shardTimer = 1.2;
    this.nextMilestone = 600;
    this.vy = 0;
    this.onGround = true;
    this.py = this.groundY() - this.playerSize;
    this.obstacles.forEach((o) => (o.active = false));
    this.shards.forEach((s) => (s.active = false));
    this.particles.forEach((p) => (p.active = false));
    this.cb.onScore?.(0, 0);
    if (idle) this.setState("idle");
  }

  // pools
  private spawnObstacle() {
    const o = this.obstacles.find((x) => !x.active);
    if (!o) return;
    o.active = true;
    o.passed = false;
    o.w = 16 + Math.random() * 18;
    o.h = 26 + Math.random() * Math.min(90, this.H * 0.22);
    o.x = this.W + o.w;
  }
  private spawnShard() {
    const s = this.shards.find((x) => !x.active);
    if (!s) return;
    s.active = true;
    s.r = 7;
    s.spin = 0;
    s.x = this.W + 20;
    s.y = this.groundY() - 40 - Math.random() * Math.min(140, this.H * 0.4);
  }
  private burst(x: number, y: number, color: string, n: number, spread: number) {
    if (this.reduced) return;
    const count = this.lowPower ? Math.ceil(n / 2) : n;
    for (let i = 0; i < count; i++) {
      const p = this.particles.find((q) => !q.active);
      if (!p) break;
      const a = Math.random() * Math.PI * 2;
      const sp = Math.random() * spread;
      p.active = true;
      p.x = x; p.y = y;
      p.vx = Math.cos(a) * sp;
      p.vy = Math.sin(a) * sp;
      p.max = p.life = 0.4 + Math.random() * 0.4;
      p.size = 2 + Math.random() * 2.5;
      p.color = color;
    }
  }

  private frame = (now: number) => {
    if (!this.running) return;
    let dt = (now - this.last) / 1000;
    this.last = now;
    if (dt > MAX_FRAME) dt = MAX_FRAME;
    if (this.state === "playing" || this.state === "idle") {
      this.acc += dt;
      while (this.acc >= FIXED_DT) {
        this.update(FIXED_DT, this.state === "idle");
        this.acc -= FIXED_DT;
      }
    }
    this.render();
    this.raf = requestAnimationFrame(this.frame);
  };

  private update(dt: number, attract: boolean) {
    // difficulty ramp
    this.speed = this.baseSpeed + Math.min(360, this.distance * 0.05);
    this.distance += this.speed * dt;
    this.bgScroll = (this.bgScroll + this.speed * dt * 0.3) % 2000;

    if (!attract) {
      this.score = Math.floor(this.distance * 0.1);
      this.cb.onScore?.(this.score, this.combo);
      if (this.distance >= this.nextMilestone) {
        this.nextMilestone += 700;
        this.cb.onMilestone?.("Zone cleared");
      }
    }

    // physics
    const g = Math.min(2400, this.H * 3.4);
    this.vy += g * dt;
    this.py += this.vy * dt;
    const floor = this.groundY() - this.playerSize;
    if (this.py >= floor) { this.py = floor; this.vy = 0; this.onGround = true; }

    // attract AI: jump when an obstacle is near
    if (attract && this.onGround) {
      const near = this.obstacles.find((o) => o.active && o.x - this.px < 130 && o.x - this.px > 0);
      if (near) this.jump();
    }

    // trail
    if (!this.reduced) {
      this.trailTimer -= dt;
      if (this.trailTimer <= 0) {
        this.trailTimer = 0.03;
        const p = this.particles.find((q) => !q.active);
        if (p) {
          p.active = true; p.x = this.px - 6; p.y = this.py + this.playerSize / 2;
          p.vx = -this.speed * 0.15; p.vy = (Math.random() - 0.5) * 20;
          p.max = p.life = 0.35; p.size = 2.5; p.color = Math.random() > 0.5 ? C.volt : C.surge;
        }
      }
    }

    // spawn
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnObstacle();
      const gap = Math.max(0.7, 1.5 - this.distance * 0.00008);
      this.spawnTimer = gap + Math.random() * 0.5;
    }
    this.shardTimer -= dt;
    if (this.shardTimer <= 0) { this.spawnShard(); this.shardTimer = 1.4 + Math.random() * 1.4; }

    // move + collide obstacles
    const pL = this.px - this.playerSize / 2, pR = this.px + this.playerSize / 2;
    const pT = this.py, pB = this.py + this.playerSize;
    for (const o of this.obstacles) {
      if (!o.active) continue;
      o.x -= this.speed * dt;
      const oT = this.groundY() - o.h;
      if (pR > o.x && pL < o.x + o.w && pB > oT) {
        if (!attract) { this.die(); return; }
        o.active = false;
      }
      if (!o.passed && o.x + o.w < pL) {
        o.passed = true;
        if (!attract) {
          const peakClear = oT - pB;
          if (peakClear < 26 && peakClear > -4) { this.combo++; this.cb.onMilestone?.(`Near miss x${this.combo}`); }
        }
      }
      if (o.x + o.w < -10) o.active = false;
    }

    // shards
    for (const s of this.shards) {
      if (!s.active) continue;
      s.x -= this.speed * dt;
      s.spin += dt * 6;
      const dx = s.x - this.px, dy = s.y - (this.py + this.playerSize / 2);
      if (!attract && dx * dx + dy * dy < (s.r + this.playerSize / 2) ** 2) {
        s.active = false;
        this.combo++;
        this.score += 10 * Math.max(1, Math.floor(this.combo / 3) + 1);
        this.cb.onScore?.(this.score, this.combo);
        this.burst(s.x, s.y, C.volt, 10, 180);
      }
      if (s.x < -20) s.active = false;
    }

    // particles
    for (const p of this.particles) {
      if (!p.active) continue;
      p.life -= dt;
      if (p.life <= 0) { p.active = false; continue; }
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 200 * dt;
    }

    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 40);
  }

  private die() {
    this.combo = 0;
    if (this.score > this.best) { this.best = this.score; saveBest(this.best); this.cb.onBest?.(this.best); }
    if (!this.reduced) { this.shake = 14; this.burst(this.px, this.py + this.playerSize / 2, C.surge, 28, 320); }
    this.setState("dead");
  }

  // ---- render ----
  private render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.W, this.H);

    let ox = 0, oy = 0;
    if (this.shake > 0 && !this.reduced) { ox = (Math.random() - 0.5) * this.shake; oy = (Math.random() - 0.5) * this.shake; }
    ctx.save();
    ctx.translate(ox, oy);

    this.drawBackground();
    this.drawGround();
    if (!this.reduced && this.state === "playing") this.drawSpeedLines();
    for (const p of this.particles) if (p.active) this.drawParticle(p);
    for (const s of this.shards) if (s.active) this.drawShard(s);
    for (const o of this.obstacles) if (o.active) this.drawObstacle(o);
    this.drawPlayer();

    ctx.restore();
  }

  private drawBackground() {
    const ctx = this.ctx;
    const grad = ctx.createLinearGradient(0, 0, 0, this.H);
    grad.addColorStop(0, "#0B0E18");
    grad.addColorStop(1, C.void);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.W, this.H);
    if (this.reduced) return;
    // parallax silhouettes
    ctx.fillStyle = "rgba(26,34,51,0.5)";
    const base = this.groundY();
    const off = this.bgScroll % 200;
    for (let i = -1; i < this.W / 80 + 1; i++) {
      const x = i * 80 - off;
      const h = 30 + ((i * 53) % 70);
      ctx.fillRect(x, base - h, 46, h);
    }
  }

  private drawGround() {
    const ctx = this.ctx;
    const y = this.groundY();
    ctx.strokeStyle = C.surge;
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(this.W, y); ctx.stroke();
    ctx.globalAlpha = 1;
    if (this.reduced) return;
    ctx.strokeStyle = "rgba(255,45,107,0.15)";
    ctx.lineWidth = 1;
    const off = this.bgScroll % 60;
    for (let x = -off; x < this.W; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 30, this.H); ctx.stroke();
    }
  }

  private drawSpeedLines() {
    const ctx = this.ctx;
    const n = this.lowPower ? 6 : 12;
    ctx.strokeStyle = "rgba(25,224,255,0.18)";
    ctx.lineWidth = 1;
    for (let i = 0; i < n; i++) {
      const y = (((i * 97 + this.bgScroll * 4) % this.H));
      const len = 30 + ((i * 31) % 60);
      ctx.beginPath(); ctx.moveTo(this.W - (this.bgScroll * 6 % this.W), y); ctx.lineTo(this.W - (this.bgScroll * 6 % this.W) - len, y); ctx.stroke();
    }
  }

  private drawParticle(p: Particle) {
    const ctx = this.ctx;
    ctx.globalAlpha = Math.max(0, p.life / p.max);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    ctx.globalAlpha = 1;
  }

  private drawShard(s: Shard) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.spin);
    ctx.fillStyle = C.volt;
    ctx.shadowColor = C.volt;
    ctx.shadowBlur = this.reduced ? 0 : 12;
    ctx.beginPath();
    ctx.moveTo(0, -s.r); ctx.lineTo(s.r, 0); ctx.lineTo(0, s.r); ctx.lineTo(-s.r, 0); ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.shadowBlur = 0;
  }

  private drawObstacle(o: Obstacle) {
    const ctx = this.ctx;
    const y = this.groundY() - o.h;
    ctx.fillStyle = C.carbon;
    ctx.fillRect(o.x, y, o.w, o.h);
    ctx.fillStyle = C.surge;
    ctx.fillRect(o.x, y, o.w, 3);
    if (!this.reduced) { ctx.shadowColor = C.surge; ctx.shadowBlur = 10; ctx.fillRect(o.x, y, o.w, 3); ctx.shadowBlur = 0; }
  }

  private drawPlayer() {
    const ctx = this.ctx;
    const s = this.playerSize;
    const x = this.px - s / 2, y = this.py;
    ctx.save();
    if (!this.reduced) { ctx.shadowColor = C.volt; ctx.shadowBlur = 16; }
    // bevelled chevron-ish runner
    ctx.fillStyle = C.bone;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + s, y + s * 0.32);
    ctx.lineTo(x + s, y + s);
    ctx.lineTo(x, y + s * 0.68);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = C.surge;
    ctx.fillRect(x, y + s * 0.68, s, s * 0.12);
    ctx.restore();
  }
}
