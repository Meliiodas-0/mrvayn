import { type Acrobat, type Move } from "./parkour";

type V = [number, number];
interface Pose {
  head: V;
  shoulder: V;
  hip: V;
  hands: [V, V];
  feet: [V, V];
  rotation: number;
}
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const blend = (a: V, b: V, t: number): V => [
  mix(a[0], b[0], t),
  mix(a[1], b[1], t),
];
const smooth = (t: number) => {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
};
function lerp(a: Pose, b: Pose, t: number): Pose {
  return {
    head: blend(a.head, b.head, t),
    shoulder: blend(a.shoulder, b.shoulder, t),
    hip: blend(a.hip, b.hip, t),
    hands: [blend(a.hands[0], b.hands[0], t), blend(a.hands[1], b.hands[1], t)],
    feet: [blend(a.feet[0], b.feet[0], t), blend(a.feet[1], b.feet[1], t)],
    rotation: mix(a.rotation, b.rotation, t),
  };
}

const watch: Pose = {
  head: [4, -13],
  shoulder: [1, -5],
  hip: [-3, 5],
  hands: [
    [8, 7],
    [-7, 8],
  ],
  feet: [
    [8, 20],
    [-8, 20],
  ],
  rotation: 0,
};
const crouch: Pose = {
  head: [8, -1],
  shoulder: [3, 5],
  hip: [-7, 10],
  hands: [
    [14, 18],
    [-9, 3],
  ],
  feet: [
    [5, 19],
    [-12, 18],
  ],
  rotation: 0,
};
const stretch: Pose = {
  head: [3, -14],
  shoulder: [0, -6],
  hip: [-2, 4],
  hands: [
    [11, -8],
    [-12, 0],
  ],
  feet: [
    [7, 20],
    [-10, 14],
  ],
  rotation: 0,
};
const tuck: Pose = {
  head: [5, -8],
  shoulder: [0, -2],
  hip: [-7, 3],
  hands: [
    [7, 3],
    [4, 7],
  ],
  feet: [
    [3, 8],
    [-1, 10],
  ],
  rotation: 0,
};
const brace: Pose = {
  head: [4, -10],
  shoulder: [0, -3],
  hip: [-4, 6],
  hands: [
    [-13, -5],
    [7, 4],
  ],
  feet: [
    [-19, 1],
    [7, 14],
  ],
  rotation: -0.2,
};

/** Silhouette first: separate the limbs, tuck tightly, hold the landing. */
export function acrobatPose(
  kind: Move,
  phase: number,
  state: Acrobat["state"],
  stride: number,
): Pose {
  if (state === "idle") return watch;
  if (state === "anticipate") return lerp(watch, crouch, smooth(phase));
  if (state === "land") {
    if (kind === "run") return lerp(crouch, watch, smooth(phase));
    return phase < 0.2
      ? lerp(stretch, crouch, smooth(phase / 0.2))
      : phase < 0.62
        ? crouch
        : lerp(crouch, watch, smooth((phase - 0.62) / 0.38));
  }
  if (kind === "run") {
    const cycle = Math.sin(stride),
      lift = Math.cos(stride);
    const sprint: Pose = {
      head: [10, -9],
      shoulder: [5, -2],
      hip: [-4, 6],
      hands: [
        [-12, 2],
        [-14, -4],
      ],
      feet: [
        [cycle * 13, 18 - Math.max(0, lift) * 8],
        [-cycle * 13, 18 - Math.max(0, -lift) * 8],
      ],
      rotation: 0,
    };
    const drive = smooth(phase / 0.13) * (1 - smooth((phase - 0.86) / 0.14));
    return lerp(watch, sprint, drive);
  }
  if (kind === "wall-kick" && phase < 0.5)
    return lerp(crouch, brace, smooth(phase / 0.4));
  const t = kind === "wall-kick" ? (phase - 0.5) * 2 : phase;
  let pose =
    t < 0.2
      ? lerp(crouch, stretch, smooth(t / 0.2))
      : t < 0.4
        ? lerp(stretch, tuck, smooth((t - 0.2) / 0.2))
        : t < 0.66
          ? tuck
          : lerp(tuck, stretch, smooth((t - 0.66) / 0.3));
  // A vault is a compact side pass; only evasive leaps and flips somersault.
  pose = {
    ...pose,
    rotation:
      kind === "vault"
        ? Math.sin(t * Math.PI) * 0.85
        : (kind === "wall-kick" ? -1 : 1) *
          Math.PI *
          2 *
          smooth((t - 0.17) / 0.69),
  };
  return pose;
}

function limb(
  ctx: CanvasRenderingContext2D,
  a: V,
  b: V,
  bend: number,
  length: number,
) {
  const dx = b[0] - a[0],
    dy = b[1] - a[1],
    d = Math.hypot(dx, dy) || 1;
  const h =
    Math.min(5.5, Math.sqrt(Math.max(0, length * length - (d * d) / 4))) * bend;
  const joint: V = [
    (a[0] + b[0]) / 2 - (dy / d) * h,
    (a[1] + b[1]) / 2 + (dx / d) * h,
  ];
  ctx.beginPath();
  ctx.moveTo(...a);
  ctx.lineTo(...joint);
  ctx.lineTo(...b);
  ctx.stroke();
}
function figure(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  facing: number,
  pose: Pose,
  color: string,
  accent: string,
  ghost = false,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.rotate(pose.rotation);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  // The far limbs are quieter, so the crossed pose still reads at actual size.
  ctx.strokeStyle = ghost ? color : "#626976";
  ctx.lineWidth = 2;
  limb(ctx, pose.hip, pose.feet[1], -1, 9);
  limb(ctx, pose.shoulder, pose.hands[1], 1, 7);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.4;
  limb(ctx, pose.hip, pose.feet[0], -1, 9);
  // A tapered tunic gives the rival a clear torso, without losing stickman DNA.
  ctx.fillStyle = ghost ? color : "#343B46";
  ctx.beginPath();
  ctx.moveTo(pose.shoulder[0] - 3, pose.shoulder[1]);
  ctx.lineTo(pose.shoulder[0] + 3, pose.shoulder[1]);
  ctx.lineTo(pose.hip[0] + 2, pose.hip[1] + 2);
  ctx.lineTo(pose.hip[0] - 3, pose.hip[1] + 2);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 2.1;
  ctx.beginPath();
  ctx.moveTo(...pose.hip);
  ctx.lineTo(...pose.shoulder);
  ctx.lineTo(pose.head[0], pose.head[1] + 3);
  ctx.stroke();
  limb(ctx, pose.shoulder, pose.hands[0], 1, 7);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(...pose.head, 3.8, 0, Math.PI * 2);
  ctx.fill();
  if (!ghost) {
    ctx.strokeStyle = "#232830";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pose.head[0] - 1, pose.head[1]);
    ctx.lineTo(pose.head[0] + 3, pose.head[1]);
    ctx.stroke();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(pose.head[0] + 1, pose.head[1] - 0.4);
    ctx.lineTo(pose.head[0] + 3.7, pose.head[1] - 0.4);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawAcrobat(
  ctx: CanvasRenderingContext2D,
  a: Acrobat,
  colors: { body: string; accent: string },
  trails = 2,
) {
  ctx.save();
  const action = a.plan?.kind ?? "run";
  // Echoes exist only around the fastest part of a jump, not as a permanent tail.
  if (
    a.state === "travel" &&
    action !== "run" &&
    a.phase > 0.24 &&
    a.phase < 0.8
  ) {
    const history = a.history.slice(-trails - 1, -1);
    history.forEach((h, i) => {
      ctx.globalAlpha = a.opacity * (0.035 + i * 0.04);
      figure(
        ctx,
        h.x,
        h.y,
        h.facing,
        acrobatPose(h.kind, h.phase, "travel", a.stride),
        colors.body,
        colors.accent,
        true,
      );
    });
  }
  ctx.globalAlpha = a.opacity * (a.state === "idle" ? 0.68 : 0.86);
  figure(
    ctx,
    a.x,
    a.y,
    a.facing,
    acrobatPose(action, a.phase, a.state, a.stride),
    colors.body,
    colors.accent,
  );
  if (a.state === "land" && action !== "run" && a.phase < 0.6) {
    ctx.globalAlpha = a.opacity * (1 - a.phase / 0.6) * 0.2;
    ctx.strokeStyle = colors.body;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(a.x - 10, a.y + 21);
    ctx.lineTo(a.x - 3, a.y + 21);
    ctx.moveTo(a.x + 3, a.y + 21);
    ctx.lineTo(a.x + 10, a.y + 21);
    ctx.stroke();
  }
  ctx.restore();
}
