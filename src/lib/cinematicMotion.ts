// Opening cinematic only. The cursor game has its own independent animation rig.
export type Point = { x: number; y: number };
export const RIG = { thigh: 11, shin: 11, upper: 9, fore: 9, spine: 17 };
export type CinematicPose = {
  hip: Point; footL: Point; footR: Point; hand: Point; offHand: Point;
  lean: number; sword: number; rotation: number;
};
export const clamp = (v: number) => Math.max(0, Math.min(1, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const point = (a: Point, b: Point, t: number): Point => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t) });
const smooth = (v: number) => { const t = clamp(v); return t * t * (3 - 2 * t); };

// Clamp the actual endpoint, not just the distance used to find the joint.
// Both bones keep their lengths even for unreachable or coincident targets.
export function solveLimb(root: Point, target: Point, a: number, b: number, bend: number) {
  const dx = target.x - root.x, dy = target.y - root.y;
  const distance = Math.hypot(dx, dy);
  const d = Math.max(Math.abs(a - b) + .001, Math.min(a + b - .001, distance));
  const ux = distance > 1e-8 ? dx / distance : 0;
  const uy = distance > 1e-8 ? dy / distance : 1;
  const end = { x: root.x + ux * d, y: root.y + uy * d };
  const along = (a * a - b * b + d * d) / (2 * d);
  const height = Math.sqrt(Math.max(0, a * a - along * along));
  const joint = { x: root.x + ux * along - uy * height * bend, y: root.y + uy * along + ux * height * bend };
  return { joint, end };
}

export function chestOf(p: CinematicPose): Point {
  return { x: p.hip.x + Math.sin(p.lean) * RIG.spine, y: p.hip.y - Math.cos(p.lean) * RIG.spine };
}

function pose(x: number, height: number, lean: number, hand: [number, number], off: [number, number], sword: number): CinematicPose {
  const hip = { x, y: -height };
  const chest = { x: x + Math.sin(lean) * RIG.spine, y: -height - Math.cos(lean) * RIG.spine };
  return {
    hip, lean, sword, rotation: 0,
    footL: { x: -12, y: 0 }, footR: { x: 12, y: 0 },
    hand: { x: chest.x + hand[0], y: chest.y + hand[1] },
    offHand: { x: chest.x + off[0], y: chest.y + off[1] },
  };
}
function landing(height: number, lean: number) {
  const p = pose(0, height, lean, [-9, -11], [0, 0], -2.05);
  p.offHand = { x: 22, y: 0 };
  return p;
}
const ready = () => pose(0, 17.8, .04, [11, -5], [-7, 10], -.7);
export const HERO_KEYS: ReadonlyArray<readonly [number, CinematicPose]> = [
  [0, landing(13, 1.4)],
  [.55, landing(13, 1.4)],
  [.66, landing(11.4, 1.28)],
  [1.04, landing(12, 1.35)],
  [1.15, landing(12, 1.35)],
  [1.55, ready()],
  [1.74, pose(-2, 16.5, -.18, [-8, -12], [-8, 8], -2.3)],
  [1.95, pose(3, 15.4, .25, [14, -3], [-9, 7], .25)],
  [2.08, pose(2, 16, .18, [11, 9], [-8, 9], .95)],
  // The sword travels over the shoulder as the torso turns, never a face mirror.
  [2.23, pose(0, 17.2, .02, [4, -14], [-8, 9], -1.1)],
  [2.41, pose(2, 16.5, .18, [8, -12], [-7, 10], -.8)],
  [2.6, pose(-3, 15.4, -.25, [-14, -3], [8, 8], -3.4)],
  [2.75, pose(-2, 16, -.18, [-11, 9], [7, 10], -4.05)],
  [3.08, pose(0, 17.4, -.06, [-9, -9], [7, 10], -2.1)],
  [3.4, pose(0, 17.4, .04, [7, -11], [-7, 10], -1)],
  [3.65, ready()],
  [3.86, pose(-1, 16.3, -.15, [6, -12], [-8, 8], -1.4)],
  [4.1, ready()],
  [4.32, pose(1, 16.3, .12, [-9, -9], [8, 8], -2.1)],
  [4.55, ready()],
  [4.72, pose(0, 12.8, .3, [10, 4], [-9, 6], -.2)],
  [4.85, pose(0, 17.8, -.08, [10, -7], [-8, 6], -.6)],
  [5.5, pose(0, 17.8, -.08, [10, -7], [-8, 6], -.6)],
  // Touchdown, compression, recovery, then the victory gesture.
  [5.62, pose(0, 12.8, .42, [11, -3], [-9, 7], -.45)],
  [5.9, pose(0, 17.8, .03, [8, -11], [-7, 10], -1.15)],
  [6.1, pose(0, 17.8, .02, [3, -15], [-7, 10], -1.5)],
  [6.6, pose(0, 17.8, .02, [3, -15], [-7, 10], -1.5)],
];

export function blendPose(a: CinematicPose, b: CinematicPose, t: number): CinematicPose {
  return {
    hip: point(a.hip, b.hip, t), footL: point(a.footL, b.footL, t), footR: point(a.footR, b.footR, t),
    hand: point(a.hand, b.hand, t), offHand: point(a.offHand, b.offHand, t),
    lean: mix(a.lean, b.lean, t), sword: mix(a.sword, b.sword, t), rotation: mix(a.rotation, b.rotation, t),
  };
}
function shift(p: CinematicPose, y: number): CinematicPose {
  return { ...p, hip: { ...p.hip, y: p.hip.y + y }, footL: { ...p.footL, y: p.footL.y + y }, footR: { ...p.footR, y: p.footR.y + y }, hand: { ...p.hand, y: p.hand.y + y }, offHand: { ...p.offHand, y: p.offHand.y + y } };
}

export function sampleHero(t: number, dropHeight = 200): CinematicPose {
  let index = HERO_KEYS.findIndex(([time]) => time > t);
  if (index < 0) index = HERO_KEYS.length - 1;
  index = Math.max(1, index);
  const [aTime, a] = HERO_KEYS[index - 1], [bTime, b] = HERO_KEYS[index];
  let p = blendPose(a, b, smooth((t - aTime) / (bTime - aTime)));
  if (t < .55) p = shift(p, -(1 - clamp(t / .55) ** 2) * dropHeight);
  if (t >= 4.85 && t <= 5.5) {
    const k = (t - 4.85) / .65;
    const tuck = smooth(k / .25) * (1 - smooth((k - .64) / .3));
    const chest = chestOf(p);
    p.footL = point(p.footL, { x: -6, y: p.hip.y + 8 }, tuck);
    p.footR = point(p.footR, { x: 8, y: p.hip.y + 7 }, tuck);
    p.hand = point(p.hand, { x: chest.x + 9, y: chest.y + 1 }, tuck);
    p.offHand = point(p.offHand, { x: chest.x - 7, y: chest.y + 6 }, tuck);
    p.rotation = -Math.PI * 2 * smooth((k - .08) / .84);
    p = shift(p, -Math.sin(k * Math.PI) * 56);
  }
  if (t > 6.1) p = shift(p, -(clamp((t - 6.1) / .5) ** 3) * 90);
  return p;
}

export function heroJoints(p: CinematicPose) {
  const chest = chestOf(p);
  return { chest, left: solveLimb(p.hip, p.footL, RIG.thigh, RIG.shin, -1), right: solveLimb(p.hip, p.footR, RIG.thigh, RIG.shin, -1), main: solveLimb(chest, p.hand, RIG.upper, RIG.fore, 1), off: solveLimb(chest, p.offHand, RIG.upper, RIG.fore, 1) };
}
