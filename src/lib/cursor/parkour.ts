/** Deterministic, DOM-free motion planning. Coordinates refer to the body's centre. */
export interface Point {
  x: number;
  y: number;
}
export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}
export interface World {
  width: number;
  height: number;
  obstacles: Rect[];
}
export type Move = "run" | "flip" | "vault" | "leap" | "wall-kick";
export type Curve = [Point, Point, Point, Point];
export interface Plan {
  kind: Move;
  curves: Curve[];
  duration: number;
  direction: number;
}
export interface Acrobat extends Point {
  attachment: "page" | "viewport";
  temperament: "scout" | "rival";
  intent: "watch" | "patrol" | "retreat" | "engage" | "recover";
  lastEvasion: Point | null;
  plan: Plan | null;
  time: number;
  phase: number;
  facing: number;
  state: "idle" | "anticipate" | "travel" | "land" | "brake";
  wait: number;
  cooldown: number;
  opacity: number;
  stride: number;
  history: Array<{
    x: number;
    y: number;
    phase: number;
    kind: Move;
    facing: number;
  }>;
  trailClock: number;
  moves: number;
  blocked: number;
  performed: Record<Move, number>;
}
export const PARKOUR = {
  speed: 300,
  jump: 100,
  anticipation: 0.15,
  landing: 0.38,
  rest: 2.6,
  trails: 2,
};
export const PARKOUR_TUNING_EVENT = "portfolio:parkour-tuning";
export const BODY_RADIUS = 25;
export const CLEARANCE = 7;
export const TOP_EDGE = 96;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const mix = (a: Point, b: Point, t: number): Point => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});
export const distance = (a: Point, b: Point) =>
  Math.hypot(a.x - b.x, a.y - b.y);
const inflated = (r: Rect, pad: number): Rect => ({
  left: r.left - pad,
  top: r.top - pad,
  right: r.right + pad,
  bottom: r.bottom + pad,
});

export function pointFree(
  p: Point,
  w: World,
  radius = BODY_RADIUS + CLEARANCE,
): boolean {
  return (
    p.x >= radius + 8 &&
    p.x <= w.width - radius - 8 &&
    p.y >= TOP_EDGE + radius &&
    p.y <= w.height - radius - 12 &&
    !w.obstacles.some(
      (r) =>
        p.x >= r.left - radius &&
        p.x <= r.right + radius &&
        p.y >= r.top - radius &&
        p.y <= r.bottom + radius,
    )
  );
}

/** Slab intersection, including touching edges. No tunnelling even at low FPS. */
export function segmentHits(a: Point, b: Point, r: Rect): boolean {
  let lo = 0,
    hi = 1;
  for (const [start, delta, min, max] of [
    [a.x, b.x - a.x, r.left, r.right],
    [a.y, b.y - a.y, r.top, r.bottom],
  ]) {
    if (Math.abs(delta) < 1e-8) {
      if (start < min || start > max) return false;
    } else {
      const t0 = (min - start) / delta,
        t1 = (max - start) / delta;
      lo = Math.max(lo, Math.min(t0, t1));
      hi = Math.min(hi, Math.max(t0, t1));
      if (lo > hi) return false;
    }
  }
  return true;
}
export function sweepFree(
  a: Point,
  b: Point,
  w: World,
  radius = BODY_RADIUS + CLEARANCE,
): boolean {
  return (
    pointFree(a, w, radius) &&
    pointFree(b, w, radius) &&
    !w.obstacles.some((r) => segmentHits(a, b, inflated(r, radius)))
  );
}
export function curvePoint(c: Curve, t: number): Point {
  const u = 1 - t;
  return {
    x:
      u * u * u * c[0].x +
      3 * u * u * t * c[1].x +
      3 * u * t * t * c[2].x +
      t * t * t * c[3].x,
    y:
      u * u * u * c[0].y +
      3 * u * u * t * c[1].y +
      3 * u * t * t * c[2].y +
      t * t * t * c[3].y,
  };
}
function lineDistance(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x,
    dy = b.y - a.y,
    d = dx * dx + dy * dy;
  return distance(
    p,
    mix(a, b, d ? clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / d, 0, 1) : 0),
  );
}
/** Adaptive subdivision with an error margin, not sparse point-only collision. */
function curveFree(c: Curve, w: World, depth = 0): boolean {
  const error = Math.max(
    lineDistance(c[1], c[0], c[3]),
    lineDistance(c[2], c[0], c[3]),
  );
  if (error <= 0.4)
    return sweepFree(c[0], c[3], w, BODY_RADIUS + CLEARANCE + error);
  if (depth >= 12) return false;
  const a = mix(c[0], c[1], 0.5),
    b = mix(c[1], c[2], 0.5),
    d = mix(c[2], c[3], 0.5);
  const e = mix(a, b, 0.5),
    f = mix(b, d, 0.5),
    m = mix(e, f, 0.5);
  return (
    curveFree([c[0], a, e, m], w, depth + 1) &&
    curveFree([m, f, d, c[3]], w, depth + 1)
  );
}
export const planFree = (p: Plan, w: World) =>
  p.curves.every((c) => curveFree(c, w));
export function planPoint(p: Plan, t: number): Point {
  const v = clamp(t, 0, 1) * p.curves.length,
    i = Math.min(p.curves.length - 1, Math.floor(v));
  return curvePoint(p.curves[i], v - i);
}
const straight = (a: Point, b: Point): Curve => [
  a,
  mix(a, b, 1 / 3),
  mix(a, b, 2 / 3),
  b,
];
export function arcPlan(
  kind: Move,
  a: Point,
  b: Point,
  height: number,
  speed = PARKOUR.speed,
): Plan {
  const c1 = mix(a, b, 0.28),
    c2 = mix(a, b, 0.72);
  c1.y -= (height * 4) / 3;
  c2.y -= (height * 4) / 3;
  return {
    kind,
    curves: [[{ ...a }, c1, c2, { ...b }]],
    duration: clamp((distance(a, b) + height * 0.8) / speed, 0.7, 1.35),
    direction: b.x >= a.x ? 1 : -1,
  };
}
export function cursorLeap(
  a: Point,
  pointer: Point,
  w: World,
  tuning = PARKOUR,
): Plan | null {
  if (
    Math.abs(a.y - pointer.y) > 82 ||
    distance(a, pointer) > 205 ||
    distance(a, pointer) < 32
  )
    return null;
  const dir = pointer.x >= a.x ? 1 : -1;
  const end = { x: pointer.x + dir * 108, y: a.y };
  const p = arcPlan(
    "leap",
    a,
    end,
    Math.max(tuning.jump, a.y - pointer.y + 72),
    tuning.speed,
  );
  return planFree(p, w) ? p : null;
}
export function obstacleVault(
  a: Point,
  w: World,
  facing: number,
  tuning = PARKOUR,
): Plan | null {
  for (const r of w.obstacles) {
    const nearX = facing > 0 ? r.left : r.right,
      width = r.right - r.left;
    if (
      (nearX - a.x) * facing < 25 ||
      (nearX - a.x) * facing > 128 ||
      r.top > a.y + 55 ||
      r.bottom < a.y - 20
    )
      continue;
    if (width > 300) {
      // A large image is a ledge, not something to jump through or clear in one go.
      const end = {
        x: nearX + facing * 85,
        y: r.top - BODY_RADIUS - CLEARANCE - 14,
      };
      const lift = Math.min(a.y - tuning.jump, end.y - 55);
      const p: Plan = {
        kind: "vault",
        direction: facing,
        duration: clamp((distance(a, end) + 60) / tuning.speed, 0.8, 1.5),
        curves: [[{ ...a }, { x: a.x, y: lift }, { x: a.x, y: lift }, end]],
      };
      if (planFree(p, w)) return p;
      continue;
    }
    const end = {
      x:
        (facing > 0 ? r.right : r.left) +
        facing * (BODY_RADIUS + CLEARANCE + 14),
      y: a.y,
    };
    // The lift happens outside the leading face. The two curves meet horizontally
    // above the obstacle, so the runner never cuts diagonally through its corner.
    const roofY = Math.min(
      a.y - tuning.jump,
      r.top - BODY_RADIUS - CLEARANCE - 22,
    );
    const apex = { x: (r.left + r.right) / 2, y: roofY };
    const p: Plan = {
      kind: "vault",
      direction: facing,
      duration: clamp(
        (distance(a, end) + Math.abs(a.y - roofY)) / tuning.speed,
        0.85,
        1.7,
      ),
      curves: [
        [{ ...a }, { x: a.x, y: roofY }, { x: a.x, y: roofY }, apex],
        [apex, { x: end.x, y: roofY }, { x: end.x, y: roofY }, end],
      ],
    };
    if (planFree(p, w)) return p;
  }
  return null;
}
export function wallKick(a: Point, w: World, tuning = PARKOUR): Plan | null {
  const pad = BODY_RADIUS + CLEARANCE + 10;
  const walls = [
    { x: pad, direction: 1 },
    { x: w.width - pad, direction: -1 },
  ];
  for (const r of w.obstacles) {
    if (a.y < r.top - 10 || a.y > r.bottom + 40) continue;
    walls.push(
      { x: r.left - BODY_RADIUS - CLEARANCE - 3, direction: -1 },
      { x: r.right + BODY_RADIUS + CLEARANCE + 3, direction: 1 },
    );
  }
  for (const wall of walls) {
    if (
      (a.x - wall.x) * wall.direction < 0 ||
      (a.x - wall.x) * wall.direction > 90
    )
      continue;
    const contact = { x: wall.x, y: a.y - 32 },
      end = { x: a.x + wall.direction * 145, y: a.y - 12 };
    const p: Plan = {
      kind: "wall-kick",
      direction: wall.direction,
      duration: (1.0 * PARKOUR.speed) / tuning.speed,
      curves: [
        straight({ ...a }, contact),
        [
          contact,
          { x: contact.x + wall.direction * 45, y: contact.y - 90 },
          { x: end.x - wall.direction * 35, y: end.y - 65 },
          end,
        ],
      ],
    };
    if (planFree(p, w)) return p;
  }
  return null;
}
export function createAcrobat(
  x: number,
  y: number,
  temperament: Acrobat["temperament"] = "rival",
): Acrobat {
  return {
    x,
    y,
    attachment: "page",
    temperament,
    intent: "watch",
    lastEvasion: null,
    plan: null,
    time: 0,
    phase: 0,
    facing: 1,
    state: "idle",
    wait: 1.8,
    cooldown: 0,
    opacity: 0,
    stride: 0,
    history: [],
    trailClock: 0,
    moves: 0,
    blocked: 0,
    performed: { run: 0, flip: 0, vault: 0, leap: 0, "wall-kick": 0 },
  };
}
export function launch(a: Acrobat, plan: Plan) {
  a.plan = plan;
  a.state = plan.kind === "run" ? "travel" : "anticipate";
  a.time = 0;
  a.phase = 0;
  a.facing = plan.direction;
  a.history = [];
  a.moves++;
  a.performed[plan.kind]++;
  if (plan.kind !== "run") a.cooldown = 4.5;
}

/** Resting places are derived from the page, not random points in mid-air. */
export function landingPlaces(w: World): Point[] {
  const candidates: Point[] = [];
  const floor = w.height - 48;
  for (let x = 46; x < w.width - 40; x += 100) candidates.push({ x, y: floor });
  for (const r of w.obstacles) {
    if (r.right - r.left < 85) continue;
    const y = r.top - BODY_RADIUS - CLEARANCE - 4;
    for (const x of [r.left + 42, (r.left + r.right) / 2, r.right - 42])
      candidates.push({ x, y });
  }
  return candidates.filter(
    (p, i) =>
      pointFree(p, w) &&
      !candidates.slice(0, i).some((q) => distance(p, q) < 40),
  );
}

export function findSpawn(
  w: World,
  random: () => number = Math.random,
  home = 0,
  neighbours: Point[] = [],
): Point | null {
  const free = landingPlaces(w).filter((p) =>
    neighbours.every((n) => distance(p, n) > 90),
  );
  const preferred = free.filter(
    (p) => !home || (home < 0 ? p.x < w.width / 2 : p.x > w.width / 2),
  );
  const choices = preferred.length ? preferred : free;
  return choices.length ? choices[Math.floor(random() * choices.length)] : null;
}
function reactiveLeap(
  a: Acrobat,
  pointer: Point,
  w: World,
  tuning: typeof PARKOUR,
): Plan | null {
  // One response per approach. A parked pointer must not cause endless flips.
  if (a.lastEvasion && distance(pointer, a.lastEvasion) < 55) return null;
  const plan = cursorLeap(a, pointer, w, tuning);
  if (plan) a.lastEvasion = { ...pointer };
  return plan;
}
function choosePlan(
  a: Acrobat,
  w: World,
  pointer: Point | null,
  tuning: typeof PARKOUR,
): Plan | null {
  const rival = a.temperament === "rival";
  const threatened = !!pointer && distance(a, pointer) < (rival ? 210 : 185);
  if (rival && pointer && a.cooldown <= 0) {
    const leap = reactiveLeap(a, pointer, w, tuning);
    if (leap) {
      a.intent = "engage";
      return leap;
    }
  }
  const direction =
    threatened && pointer
      ? a.x >= pointer.x
        ? 1
        : -1
      : pointer && rival && distance(a, pointer) < 480
        ? pointer.x >= a.x
          ? 1
          : -1
        : a.facing;
  a.intent = threatened ? "retreat" : "patrol";
  const places = landingPlaces(w).filter(
    (p) => distance(a, p) > 65 && distance(a, p) < 360,
  );
  // Same-level runs first. Vertical changes must read as jumps, never moonwalking.
  places.sort((p, q) => {
    const cost = (p: Point) =>
      Math.abs(p.y - a.y) * 2 +
      distance(a, p) * 0.3 +
      ((p.x - a.x) * direction < 0 ? 500 : 0);
    return cost(p) - cost(q);
  });
  for (const end of places) {
    if (
      threatened &&
      pointer &&
      distance(end, pointer) < distance(a, pointer) + 45
    )
      continue;
    if (Math.abs(end.y - a.y) < 2 && sweepFree(a, end, w)) {
      return {
        kind: "run",
        curves: [straight({ ...a }, end)],
        direction: Math.sign(end.x - a.x) || direction,
        duration: clamp(
          distance(a, end) /
            (rival ? tuning.speed * 0.85 : threatened ? 135 : 62),
          0.35,
          2.5,
        ),
      };
    }
  }
  if (rival && a.cooldown <= 0) {
    // A wall kick is a response to being cornered, not a looping party trick.
    if (threatened) {
      const kick = wallKick(a, w, tuning);
      if (kick) return kick;
    }
    const vault = obstacleVault(a, w, direction, tuning);
    if (vault) return vault;
    for (const end of places) {
      if (Math.abs(end.y - a.y) > 160) continue;
      const plan = arcPlan(
        a.moves % 3 === 2 ? "flip" : "vault",
        a,
        end,
        tuning.jump * 0.75,
        tuning.speed,
      );
      if (planFree(plan, w)) return plan;
    }
  }
  return null;
}
export function airborne(a: Acrobat): boolean {
  return (
    !!a.plan &&
    a.plan.kind !== "run" &&
    a.state === "travel" &&
    a.phase > 0.12 &&
    a.phase < 0.86
  );
}
/** Advances only a bounded slice of time. Resume never fast-forwards a leap. */
export function stepAcrobat(
  a: Acrobat,
  dt: number,
  w: World,
  pointer: Point | null,
  tuning = PARKOUR,
  random: () => number = Math.random,
): void {
  dt = clamp(dt, 0, 0.05);
  a.cooldown -= dt;
  if (!pointFree(a, w)) {
    a.opacity = 0;
    a.plan = null;
    a.history = [];
    a.state = "idle";
    a.wait = 0.18;
    return;
  }
  if (a.state === "brake") {
    a.opacity = Math.max(0, a.opacity - dt * 8);
    a.wait -= dt;
    if (a.wait <= 0) {
      a.plan = null;
      a.state = "idle";
      a.wait = 0.1;
    }
    return;
  }
  a.opacity = Math.min(1, a.opacity + dt * 4);
  // A running enemy can interrupt its route to react before the sword is in range.
  if (
    a.temperament === "rival" &&
    pointer &&
    a.cooldown <= 0 &&
    (!a.plan || a.plan.kind === "run")
  ) {
    const leap = reactiveLeap(a, pointer, w, tuning);
    if (leap) {
      a.intent = "engage";
      launch(a, leap);
    }
  }
  if (
    a.temperament === "scout" &&
    pointer &&
    distance(a, pointer) < 185 &&
    a.intent !== "retreat" &&
    a.cooldown <= 0
  ) {
    // Abort a casual patrol and look for a safe retreat before panic movement.
    a.plan = null;
    a.state = "idle";
    a.wait = 0;
    a.intent = "retreat";
    a.cooldown = 1.2;
  }
  if (!a.plan) {
    a.wait -= dt;
    if (a.wait > 0) {
      if (pointer && Math.abs(pointer.x - a.x) > 45)
        a.facing = pointer.x > a.x ? 1 : -1;
      return;
    }
    const p = choosePlan(a, w, pointer, tuning);
    if (p) launch(a, p);
    else {
      a.wait = tuning.rest * (0.8 + random() * 0.7);
      a.intent = "watch";
      a.facing *= -1;
    }
    return;
  }
  a.time += dt;
  if (a.state === "anticipate") {
    a.phase = clamp(a.time / tuning.anticipation, 0, 1);
    if (a.time >= tuning.anticipation) {
      a.state = "travel";
      a.time = 0;
      a.phase = 0;
    }
    return;
  }
  if (a.state === "land") {
    a.phase = clamp(a.time / tuning.landing, 0, 1);
    if (a.time >= tuning.landing) {
      a.plan = null;
      a.state = "idle";
      a.wait = tuning.rest * (0.7 + random() * 0.7);
      a.intent = "watch";
      a.history = [];
    }
    return;
  }
  const phase = clamp(a.time / a.plan.duration, 0, 1);
  const progress =
    a.plan.kind === "run" ? phase * phase * (3 - 2 * phase) : phase;
  const target = planPoint(a.plan, progress);
  if (!sweepFree(a, target, w)) {
    // Geometry changed mid-air. Brake in the last safe position and replan.
    a.blocked++;
    a.state = "brake";
    a.wait = 0.14;
    a.history = [];
    return;
  }
  a.stride += distance(a, target) * 0.12;
  a.x = target.x;
  a.y = target.y;
  a.phase = phase;
  a.trailClock += dt;
  if (a.plan.kind !== "run" && a.trailClock >= 0.055) {
    a.trailClock = 0;
    a.history.push({
      x: a.x,
      y: a.y,
      phase,
      kind: a.plan.kind,
      facing: a.facing,
    });
    if (a.history.length > tuning.trails + 1) a.history.shift();
  }
  if (phase >= 1) {
    a.attachment = Math.abs(a.y - (w.height - 48)) < 2 ? "viewport" : "page";
    a.state = "land";
    a.intent = "recover";
    a.time = 0;
    a.phase = 0;
  }
}

/** Keep a ledge-bound actor attached while the document scrolls beneath canvas. */
export function scrollAcrobat(a: Acrobat, delta: number): void {
  if (a.attachment === "viewport" || !delta) return;
  a.y -= delta;
  a.history = a.history.map((p) => ({ ...p, y: p.y - delta }));
  if (a.plan)
    a.plan = {
      ...a.plan,
      curves: a.plan.curves.map(
        (c) => c.map((p) => ({ ...p, y: p.y - delta })) as Curve,
      ),
    };
}
