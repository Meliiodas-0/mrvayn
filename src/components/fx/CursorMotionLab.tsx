"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimationFrame } from "motion/react";
import {
  createAcrobat,
  cursorLeap,
  obstacleVault,
  wallKick,
  launch,
  stepAcrobat,
  planPoint,
  pointFree,
  PARKOUR,
  type Acrobat,
  type World,
  type Plan,
} from "@/lib/cursor/parkour";
import { drawAcrobat } from "@/lib/cursor/acrobatDrawing";

type Demo = "Cursor leap" | "Obstacle vault" | "Wall kick";
const scenarios: Record<
  Demo,
  {
    world: World;
    start: { x: number; y: number };
    pointer?: { x: number; y: number };
  }
> = {
  "Cursor leap": {
    world: { width: 1440, height: 900, obstacles: [] },
    start: { x: 450, y: 500 },
    pointer: { x: 550, y: 520 },
  },
  "Obstacle vault": {
    world: {
      width: 1440,
      height: 900,
      obstacles: [{ left: 620, top: 420, right: 740, bottom: 650 }],
    },
    start: { x: 550, y: 480 },
  },
  "Wall kick": {
    world: { width: 1440, height: 900, obstacles: [] },
    start: { x: 64, y: 440 },
  },
};
function setup(name: Demo) {
  const s = scenarios[name];
  const plan = (
    name === "Cursor leap"
      ? cursorLeap(s.start, s.pointer!, s.world)
      : name === "Obstacle vault"
        ? obstacleVault(s.start, s.world, 1)
        : wallKick(s.start, s.world)
  )!;
  const actor = createAcrobat(s.start.x, s.start.y);
  actor.opacity = 1;
  launch(actor, plan);
  return { actor, plan, world: s.world, pointer: s.pointer };
}
/** Local-only replay/pose inspection. Production route returns notFound. */
export function CursorMotionLab() {
  const ref = useRef<HTMLCanvasElement>(null);
  const active = useRef(setup("Cursor leap"));
  const [name, setName] = useState<Demo>("Cursor leap");
  const [paused, setPaused] = useState(false);
  const [phase, setPhase] = useState(0);
  const [reads, setReads] = useState("Ready");
  const throttle = useRef(0);
  const paint = () => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const { actor: a, plan, world, pointer } = active.current;
    ctx.clearRect(0, 0, 1200, 620);
    ctx.fillStyle = "#07080B";
    ctx.fillRect(0, 0, 1200, 620);
    // Follow the subject at 2x for close inspection, preserving the real geometry.
    ctx.save();
    ctx.translate(370 - a.x * 2, 270 - a.y * 2);
    ctx.scale(2, 2);
    ctx.fillStyle = "#101318";
    ctx.strokeStyle = "#546BF3";
    ctx.lineWidth = 0.8;
    world.obstacles.forEach((r) => {
      ctx.fillRect(r.left, r.top, r.right - r.left, r.bottom - r.top);
      ctx.strokeRect(r.left, r.top, r.right - r.left, r.bottom - r.top);
    });
    ctx.beginPath();
    ctx.moveTo(8, 96);
    ctx.lineTo(8, 888);
    ctx.stroke();
    if (pointer) {
      ctx.strokeStyle = "#EFF2F6";
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 5, 0, Math.PI * 2);
      ctx.moveTo(pointer.x, pointer.y + 5);
      ctx.lineTo(pointer.x, pointer.y + 20);
      ctx.lineTo(pointer.x - 7, pointer.y + 30);
      ctx.moveTo(pointer.x, pointer.y + 20);
      ctx.lineTo(pointer.x + 7, pointer.y + 30);
      ctx.stroke();
    }
    ctx.setLineDash([2, 6]);
    ctx.strokeStyle = "#2D333D";
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const v = planPoint(plan, i / 80);
      if (i === 0) ctx.moveTo(v.x, v.y);
      else ctx.lineTo(v.x, v.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    drawAcrobat(ctx, a, { body: "#E4E6E9", accent: "#CD8B93" });
    ctx.restore();
    ctx.fillStyle = "#ADB6C2";
    ctx.font = "14px sans-serif";
    ctx.fillText("Pose study", 815, 40);
    [0, 0.22, 0.48, 0.7, 0.94].forEach((t, i) => {
      ctx.save();
      ctx.translate(900, 95 + i * 102);
      ctx.scale(2, 2);
      const specimen: Acrobat = {
        ...createAcrobat(0, 0),
        opacity: 1,
        plan,
        state: "travel",
        phase: t,
        facing: 1,
      };
      drawAcrobat(ctx, specimen, { body: "#E4E6E9", accent: "#CD8B93" });
      ctx.restore();
      ctx.fillStyle = "#828D9C";
      ctx.fillText(`${Math.round(t * 100)}%`, 990, 100 + i * 102);
    });
  };
  useAnimationFrame((time, delta) => {
    if (!paused) {
      const a = active.current;
      stepAcrobat(a.actor, delta / 1000, a.world, null);
      if (!a.actor.plan && a.actor.wait < 0.05) active.current = setup(name);
      else if (!a.actor.plan) a.actor.wait -= delta / 1000;
    }
    paint();
    if (time - throttle.current > 100) {
      throttle.current = time;
      const a = active.current.actor;
      setPhase(Math.round(a.phase * 100));
      setReads(
        `${a.state} / ${active.current.plan.kind} / ${pointFree(a, active.current.world) ? "clear" : "blocked"}`,
      );
    }
  });
  useEffect(() => {
    active.current = setup(name);
    setPaused(false);
  }, [name]);
  const seek = (value: number) => {
    setPaused(true);
    const a = active.current,
      point = planPoint(a.plan, value / 100);
    Object.assign(a.actor, point, {
      state: "travel",
      plan: a.plan,
      time: (value / 100) * a.plan.duration,
      phase: value / 100,
      opacity: 1,
      history: [],
    });
    setPhase(value);
    paint();
  };
  return (
    <main
      className="portfolio-theme"
      style={{
        maxWidth: 1240,
        margin: "0 auto",
        padding: "32px 24px",
        color: "#EFF2F6",
      }}
    >
      <a href="/#work" className="folio-link">
        Back to the portfolio
      </a>
      <h1 style={{ fontSize: 44, marginTop: 24 }}>Cursor motion study</h1>
      <p style={{ color: "#ADB6C2", margin: "12px 0 24px" }}>
        Local development only. Replay the same planner and rig used on the
        portfolio, enlarged 2×.
      </p>
      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {(Object.keys(scenarios) as Demo[]).map((item) => (
          <button
            className="folio-link"
            key={item}
            aria-pressed={name === item}
            onClick={() => {
              active.current = setup(item);
              setName(item);
              setPaused(false);
            }}
          >
            {item}
          </button>
        ))}
        <button className="folio-link" onClick={() => setPaused((v) => !v)}>
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
      <canvas
        ref={ref}
        width={1200}
        height={620}
        style={{ width: "100%", marginTop: 24, border: "1px solid #2D333D" }}
        aria-label="Enlarged acrobat animation with trajectory and five key poses"
        role="img"
      />
      <label
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        Flight progress
        <input
          type="range"
          min={0}
          max={100}
          value={phase}
          onChange={(e) => seek(+e.target.value)}
          style={{ width: 300 }}
        />
        {phase}%
      </label>
      <output style={{ display: "block", marginTop: 12, color: "#A9B7FF" }}>
        {reads}
      </output>
    </main>
  );
}
