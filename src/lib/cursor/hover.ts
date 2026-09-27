import {
  pointFree,
  sweepFree,
  type Acrobat,
  type Point,
  type World,
} from "./parkour";

export interface HoverMotion {
  vx: number;
  vy: number;
  clock: number;
  lane?: number;
}

export function hoverSpawn(
  w: World,
  neighbours: Point[],
  home: number,
  random = Math.random,
  lane?: number,
): Point | null {
  let best: Point | null = null,
    bestValue = -Infinity;
  for (let i = 0; i < 160; i++) {
    const x =
      i < 100
        ? (home < 0 ? 0.04 + random() * 0.4 : 0.56 + random() * 0.4) * w.width
        : 42 + random() * (w.width - 84);
    const p = { x, y: 140 + random() * Math.max(1, w.height - 190) };
    if (
      pointFree(p, w) &&
      neighbours.every((n) => Math.hypot(n.x - p.x, n.y - p.y) > 95)
    ) {
      const separation = Math.min(
        320,
        ...neighbours.map((n) => Math.hypot(n.x - p.x, n.y - p.y)),
      );
      const preferredY = 140 + (w.height - 190) * (lane ?? 0.45);
      const sidePenalty = (home < 0 ? p.x > w.width / 2 : p.x < w.width / 2)
        ? 250
        : 0;
      const value = separation * 0.4 - Math.abs(p.y - preferredY) - sidePenalty;
      if (value > bestValue) {
        best = p;
        bestValue = value;
      }
    }
  }
  return best;
}

/** Original flowing wander/flee personality, with swept whole-body clearance. */
export function stepHover(
  a: Acrobat,
  motion: HoverMotion,
  dt: number,
  w: World,
  pointer: Point | null,
  neighbours: Point[],
) {
  dt = Math.max(0, Math.min(0.05, dt));
  motion.clock += dt;
  if (!pointFree(a, w)) {
    a.opacity = 0;
    return;
  }
  a.opacity = Math.min(1, a.opacity + dt * 2);
  const angle =
    Math.sin(a.x * 0.006 + motion.clock * 0.5) +
    Math.cos(a.y * 0.006 - motion.clock * 0.4) +
    motion.clock * 0.22;
  let ax = Math.cos(angle) * 240,
    ay = Math.sin(angle) * 240;
  // A loose vertical territory spreads floaters through the margins instead of
  // letting every flow field eventually collect them along the bottom edge.
  if (motion.lane !== undefined) {
    const centre = 140 + (w.height - 190) * motion.lane;
    const range = Math.max(65, (w.height - 190) * 0.16);
    const offset = centre - a.y;
    if (Math.abs(offset) > range)
      ay += Math.sign(offset) * Math.min(500, (Math.abs(offset) - range) * 4);
  }
  a.intent = "patrol";
  if (pointer) {
    const dx = a.x - pointer.x,
      dy = a.y - pointer.y,
      d = Math.hypot(dx, dy) || 1;
    if (d < 130) {
      ax += (dx / d) * 520;
      ay += (dy / d) * 520;
      a.intent = "retreat";
    }
  }
  for (const n of neighbours) {
    const dx = a.x - n.x,
      dy = a.y - n.y,
      d = Math.hypot(dx, dy) || 1;
    if (d < 95) {
      ax += (dx / d) * 680 * (1 - d / 95);
      ay += (dy / d) * 680 * (1 - d / 95);
    }
  }
  motion.vx += ax * dt;
  motion.vy += ay * dt;
  const speed = Math.hypot(motion.vx, motion.vy) || 1;
  const bounded = Math.max(26, Math.min(78, speed));
  motion.vx = (motion.vx / speed) * bounded;
  motion.vy = (motion.vy / speed) * bounded;
  const start = { x: a.x, y: a.y };
  const clear = (p: Point) =>
    sweepFree(a, p, w) &&
    neighbours.every(
      (n) =>
        Math.hypot(p.x - n.x, p.y - n.y) >=
        Math.min(55, Math.hypot(a.x - n.x, a.y - n.y)),
    );
  const next = { x: a.x + motion.vx * dt, y: a.y + motion.vy * dt };
  if (clear(next)) {
    a.x = next.x;
    a.y = next.y;
  } else if (clear({ x: next.x, y: a.y })) {
    a.x = next.x;
    motion.vy *= -0.7;
  } else if (clear({ x: a.x, y: next.y })) {
    a.y = next.y;
    motion.vx *= -0.7;
  } else {
    motion.vx *= -0.7;
    motion.vy *= -0.7;
  }
  const travelled = Math.hypot(a.x - start.x, a.y - start.y);
  a.state = travelled > 0.02 ? "travel" : "idle";
  a.stride += travelled * 0.12;
  if (Math.abs(motion.vx) > 12) a.facing = motion.vx > 0 ? 1 : -1;
}
