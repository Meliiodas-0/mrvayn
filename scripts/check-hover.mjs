import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
const load = (path, deps = {}) => {
  const output = {};
  const js = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  new Function("exports", "require", js)(output, (key) => deps[key]);
  return output;
};
const p = load("src/lib/cursor/parkour.ts"),
  h = load("src/lib/cursor/hover.ts", { "./parkour": p });
let seed = 71;
const random = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};
let samples = 0;
for (const fps of [20, 30, 60, 144]) {
  const world = {
    width: 1440,
    height: 900,
    obstacles: [
      { left: 400, top: 200, right: 900, bottom: 600 },
      { left: 100, top: 650, right: 1100, bottom: 652 },
    ],
  };
  const start = h.hoverSpawn(world, [], -1, random);
  assert(start);
  const actor = p.createAcrobat(start.x, start.y),
    motion = { vx: 40, vy: 20, clock: 0 };
  const neighbour = { x: 1100, y: 500 };
  let minY = actor.y,
    maxY = actor.y;
  for (let i = 0; i < fps * 40; i++) {
    h.stepHover(actor, motion, 1 / fps, world, { x: 200, y: 400 }, [neighbour]);
    assert(p.pointFree(actor, world));
    assert(p.distance(actor, neighbour) >= 55);
    minY = Math.min(minY, actor.y);
    maxY = Math.max(maxY, actor.y);
    samples++;
  }
  assert(
    maxY - minY > 25,
    "hoverers must roam vertically, not become grounded patrols",
  );
}
const empty = { width: 1440, height: 900, obstacles: [] },
  actor = p.createAcrobat(600, 450),
  motion = { vx: 0, vy: 0, clock: 0 };
const hero = {
  width: 2540,
  height: 1300,
  obstacles: [{ left: 254, top: 96, right: 2286, bottom: 1205 }],
};
const occupied = [];
for (const [side, lane] of [
  [-1, 0.2],
  [1, 0.35],
  [1, 0.72],
  [-1, 0.67],
  [1, 0.08],
]) {
  const spawn = h.hoverSpawn(hero, occupied, side, random, lane);
  assert(spawn, "hero margin must support distributed hoverers");
  assert(p.pointFree(spawn, hero));
  assert(
    Math.abs(spawn.y - (140 + 1110 * lane)) < 150,
    "spawn should prefer its vertical territory, not the floor",
  );
  occupied.push(spawn);
}
const upper = p.createAcrobat(130, 300),
  upperMotion = { vx: 20, vy: 30, clock: 0, lane: 0.2 };
for (let i = 0; i < 3600; i++)
  h.stepHover(upper, upperMotion, 1 / 60, hero, null, []);
assert(
  upper.y < hero.height * 0.65,
  "upper territory should not eventually drift to the floor",
);
h.stepHover(actor, motion, 1 / 60, empty, { x: 550, y: 450 }, []);
assert.equal(actor.intent, "retreat");
assert(actor.x > 600);
assert.equal(
  h.hoverSpawn(
    { ...empty, obstacles: [{ left: 0, top: 0, right: 1440, bottom: 900 }] },
    [],
    1,
    random,
  ),
  null,
);
console.log(
  `PASS hover: ${samples} swept collision/separation samples, vertical roaming, fleeing, blocked spawning`,
);
