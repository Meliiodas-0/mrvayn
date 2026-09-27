import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
const load = (path) => {
  const result = {};
  const { outputText } = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  new Function("exports", outputText)(result);
  return result;
};
const p = load("src/lib/cursor/parkour.ts");
const draw = load("src/lib/cursor/acrobatDrawing.ts");
let seed = 4817;
const random = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};
const empty = { width: 1440, height: 900, obstacles: [] };
const content = {
  ...empty,
  obstacles: [{ left: 620, top: 420, right: 740, bottom: 650 }],
};
const leap = p.cursorLeap({ x: 450, y: 500 }, { x: 550, y: 520 }, empty);
const vault = p.obstacleVault({ x: 550, y: 480 }, content, 1);
const kick = p.wallKick({ x: 64, y: 440 }, empty);
assert(leap, "cursor leap should be available in open space");
assert(vault, "vault should lift outside a thumbnail's face");
assert(kick, "boundary should support a wall kick");
const ledgeWorld = {
  ...empty,
  obstacles: [{ left: 620, top: 420, right: 1150, bottom: 780 }],
};
const ledge = p.obstacleVault({ x: 550, y: 480 }, ledgeWorld, 1);
assert(ledge, "large media should allow a safe corner vault onto its ledge");
assert(
  p.planPoint(leap, 0.5).y < 520 - 60,
  "leap must clear the cursor, not just rotate beside it",
);
assert.equal(
  p.cursorLeap(
    { x: 450, y: 500 },
    { x: 550, y: 520 },
    { ...empty, obstacles: [{ left: 400, top: 270, right: 720, bottom: 460 }] },
  ),
  null,
  "blocked overhead routes must be rejected",
);
assert(
  p.segmentHits(
    { x: 0, y: 20 },
    { x: 100, y: 20 },
    { left: 49, top: 10, right: 50, bottom: 30 },
  ),
  "thin outlines must block fast steps",
);
assert(
  !p.pointFree({ x: 30, y: 400 }, empty),
  "whole body stays inside left edge",
);
assert(
  !p.pointFree({ x: 700, y: 110 }, empty),
  "whole body stays below navigation boundary",
);
assert.equal(
  p.findSpawn(
    { ...empty, obstacles: [{ left: 0, top: 0, right: 1440, bottom: 900 }] },
    random,
  ),
  null,
  "no free area means no spawn",
);

let checked = 0;
for (const [plan, world] of [
  [leap, empty],
  [vault, content],
  [kick, empty],
  [ledge, ledgeWorld],
]) {
  for (let i = 0; i <= 2000; i++) {
    assert(
      p.pointFree(p.planPoint(plan, i / 2000), world),
      `${plan.kind}: unsafe curve at ${i}`,
    );
    checked++;
  }
  for (const fps of [20, 30, 60, 120, 144]) {
    const start = p.planPoint(plan, 0),
      a = p.createAcrobat(start.x, start.y);
    p.launch(a, plan);
    const seconds = plan.duration + p.PARKOUR.anticipation;
    for (let i = 0; i < Math.ceil(seconds * fps); i++) {
      p.stepAcrobat(a, 1 / fps, world, null, p.PARKOUR, random);
      assert(p.pointFree(a, world), `${plan.kind}: collision at ${fps}fps`);
    }
    assert(
      p.distance(a, p.planPoint(plan, 1)) < 4,
      `${plan.kind}: frame-rate dependent end at ${fps}fps`,
    );
  }
}

// Stress route selection, very small gaps, resize and scrolling geometry.
for (let scene = 0; scene < 24; scene++) {
  const world = {
    width: 1024 + random() * 1000,
    height: 650 + random() * 350,
    obstacles: [],
  };
  for (let i = 0; i < 9; i++) {
    const x = 70 + random() * (world.width - 200),
      y = 130 + random() * (world.height - 220);
    world.obstacles.push({
      left: x,
      top: y,
      right: x + 15 + random() * 220,
      bottom: y + 1 + random() * 120,
    });
  }
  const start = p.findSpawn(world, random);
  if (!start) continue;
  const a = p.createAcrobat(start.x, start.y);
  for (let frame = 0; frame < 2000; frame++) {
    p.stepAcrobat(
      a,
      1 / 60,
      world,
      { x: world.width * 0.5, y: world.height * 0.5 },
      p.PARKOUR,
      random,
    );
    assert(p.pointFree(a, world), `scene ${scene} entered content`);
    checked++;
  }
}
const a = p.createAcrobat(450, 500);
p.launch(a, leap);
p.stepAcrobat(a, 0.2, empty, null);
assert(a.time <= 0.05, "a dropped frame must not fast-forward animation");
const occluded = {
  ...empty,
  obstacles: [{ left: 400, top: 450, right: 510, bottom: 560 }],
};
p.stepAcrobat(a, 0.016, occluded, null);
assert.equal(
  a.opacity,
  0,
  "scroll-over must hide an occluded actor before rendering",
);
assert.equal(a.plan, null, "scroll-over must discard old trajectory");

// Audit every rendered joint, line, head and scarf against the planner's envelope.
let maxRadius = 0;
const ctx = {
  save() {},
  restore() {},
  translate() {},
  scale() {},
  rotate() {},
  beginPath() {},
  closePath() {},
  fill() {},
  stroke() {},
  moveTo(x, y) {
    maxRadius = Math.max(maxRadius, Math.hypot(x, y));
  },
  lineTo(x, y) {
    maxRadius = Math.max(maxRadius, Math.hypot(x, y));
  },
  quadraticCurveTo(x, y, u, v) {
    this.lineTo(x, y);
    this.lineTo(u, v);
  },
  arc(x, y, r) {
    maxRadius = Math.max(maxRadius, Math.hypot(x, y) + r);
  },
};
for (const kind of ["run", "flip", "leap", "vault", "wall-kick"])
  for (const state of ["idle", "anticipate", "travel", "land"])
    for (let i = 0; i <= 100; i++) {
      const actor = {
        ...p.createAcrobat(0, 0),
        plan: { kind },
        opacity: 1,
        state,
        phase: i / 100,
        stride: (i / 100) * Math.PI * 2,
      };
      draw.drawAcrobat(ctx, actor, { body: "#fff", accent: "#acf" });
    }
assert(
  maxRadius + 1.2 <= p.BODY_RADIUS,
  `rendered pose exceeds envelope: ${maxRadius}`,
);
console.log(
  `PASS parkour: ${checked} collision samples; 20-144fps; leap/vault/wall-kick; thin rules; blocked paths; scroll-over; pose envelope ${maxRadius.toFixed(1)}px`,
);

// Regression: evenodd masks can accidentally reveal overlapped text rectangles.
// Test the nonzero union mask independently of a browser's canvas implementation.
class TestPath {
  polygons = [];
  current = [];
  rect(x, y, w, h) {
    this.polygons.push([
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
    ]);
  }
  moveTo(x, y) {
    this.current = [[x, y]];
  }
  lineTo(x, y) {
    this.current.push([x, y]);
  }
  closePath() {
    this.polygons.push(this.current);
  }
}
const maskModule = {};
const compiled = ts.transpileModule(
  readFileSync("src/lib/cursor/obstacles.ts", "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  },
);
new Function("exports", "Path2D", compiled.outputText)(maskModule, TestPath);
const blocks = [
  { left: 100, top: 200, right: 320, bottom: 400 },
  { left: 240, top: 270, right: 510, bottom: 430 },
  { left: 130, top: 210, right: 170, bottom: 230 },
  { left: -20, top: 700, right: 180, bottom: 1100 },
];
const mask = maskModule.contentClip(1440, 900, blocks);
function winding(poly, x, y) {
  let n = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i],
      b = poly[(i + 1) % poly.length];
    const side = (b[0] - a[0]) * (y - a[1]) - (x - a[0]) * (b[1] - a[1]);
    if (a[1] <= y && b[1] > y && side > 0) n++;
    if (a[1] > y && b[1] <= y && side < 0) n--;
  }
  return n;
}
for (let i = 0; i < 10000; i++) {
  const x = random() * 1440,
    y = random() * 900;
  const expected =
    x > 8 &&
    x < 1432 &&
    y > 96 &&
    y < 888 &&
    !blocks.some(
      (r) =>
        x > r.left - 5 && x < r.right + 5 && y > r.top - 5 && y < r.bottom + 5,
    );
  assert.equal(
    mask.polygons.reduce((sum, poly) => sum + winding(poly, x, y), 0) !== 0,
    expected,
    "overlapping mask holes must remain excluded",
  );
}
console.log(
  "PASS mask: 10,000 samples across overlapping, nested and offscreen content rectangles",
);

// Behaviour has an observable purpose, not just valid geometry.
const scout = p.createAcrobat(446, 852, "scout");
for (let i = 0; i < 60; i++)
  p.stepAcrobat(scout, 1 / 60, empty, null, p.PARKOUR, random);
assert.equal(
  scout.moves,
  0,
  "a newly arrived scout should watch before patrolling",
);
p.stepAcrobat(scout, 1 / 60, empty, { x: 400, y: 852 }, p.PARKOUR, random);
assert.equal(
  scout.intent,
  "retreat",
  "a nearby pointer should interrupt a scout's idle",
);
assert.equal(scout.plan.kind, "run");
assert(
  p.planPoint(scout.plan, 1).x > scout.x,
  "retreat must move away from the threat",
);
const rival = p.createAcrobat(450, 500);
p.stepAcrobat(rival, 1 / 60, empty, { x: 550, y: 520 }, p.PARKOUR, random);
assert.equal(
  rival.plan.kind,
  "leap",
  "rival should react even during a long idle",
);
assert.equal(rival.intent, "engage");
// Even after its cooldown, the same parked pointer cannot trigger a second flip.
const stillPointer = p.createAcrobat(450, 500);
stillPointer.lastEvasion = { x: 550, y: 520 };
p.stepAcrobat(
  stillPointer,
  1 / 60,
  empty,
  { x: 550, y: 520 },
  p.PARKOUR,
  random,
);
assert.equal(
  stillPointer.plan,
  null,
  "stationary pointer should not loop evasions",
);
p.stepAcrobat(
  stillPointer,
  1 / 60,
  empty,
  { x: 610, y: 520 },
  p.PARKOUR,
  random,
);
assert.equal(
  stillPointer.plan.kind,
  "leap",
  "a fresh approach can trigger another evasion",
);

const patrol = p.createAcrobat(446, 852, "scout");
let resting = 0;
for (let frame = 0; frame < 3600; frame++) {
  p.stepAcrobat(patrol, 1 / 60, empty, null, p.PARKOUR, random);
  if (patrol.state === "idle") resting++;
  if (patrol.plan?.kind === "run")
    assert.equal(
      patrol.plan.curves[0][0].y,
      p.planPoint(patrol.plan, 1).y,
      "run routes must stay horizontal",
    );
}
assert(resting > 1500, "the cast needs breathing room, not perpetual movement");
assert(patrol.moves <= 20, "patrol cadence should remain quiet");
assert.equal(
  patrol.performed.flip +
    patrol.performed.leap +
    patrol.performed.vault +
    patrol.performed["wall-kick"],
  0,
  "scouts and rivals retain distinct abilities",
);
const separated = p.findSpawn(empty, random, 0, [
  { x: 46, y: 852 },
  { x: 146, y: 852 },
]);
assert(
  separated && p.distance(separated, { x: 146, y: 852 }) > 90,
  "new arrivals do not stack",
);

const attached = p.createAcrobat(550, 480);
p.launch(attached, vault);
const oldApex = p.planPoint(attached.plan, 0.5).y;
p.scrollAcrobat(attached, 80);
assert.equal(attached.y, 400, "ledge-bound actors follow document scrolling");
assert.equal(
  p.planPoint(attached.plan, 0.5).y,
  oldApex - 80,
  "shared curve joints shift once, not twice",
);
attached.attachment = "viewport";
p.scrollAcrobat(attached, 200);
assert.equal(
  attached.y,
  400,
  "viewport-floor actors do not drift with document scroll",
);
console.log(
  `PASS behaviour: scout retreat, rival evasion, horizontal patrols, ${Math.round(resting / 36)}% idle time, spaced spawning, scroll attachment`,
);
