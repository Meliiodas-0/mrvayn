import type { HeroMotion } from "@/lib/heroMotion";

export type SculptureScroll = { distance: number; chapter: number; outro: number };
export type LetterPose = { x: number; y: number; scale: number; rx: number; ry: number; rz: number };
export type SculptureLayout = {
  width: number;
  height: number;
  phone: boolean;
  letters: ReadonlyArray<readonly [number, number, number]>;
};

export const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// The sculpture yields to reading before the first project reaches the viewport.
export const readingOpacity = (distance: number, floor: number) => mix(1, clamp(floor), ease((distance - .18) / .67));

// Normalize to the reachable page end, not a point beyond the last scroll position.
export function pageOutro(position: number, contactTop: number, maxScroll: number, height: number) {
  const finish = Math.max(1, maxScroll - height * .08);
  const start = Math.max(0, Math.min(contactTop - height * .55, finish - 1));
  return clamp((position - start) / Math.max(1, finish - start));
}

export function scrollChapter(position: number, anchors: number[]) {
  for (let i = 0; i < anchors.length - 1; i++) {
    if (position < anchors[i + 1]) return i + clamp((position - anchors[i]) / Math.max(1, anchors[i + 1] - anchors[i]));
  }
  return Math.max(0, anchors.length - 1);
}

const edgePose = (index: number, active: number, width: number, height: number, turn: number): LetterPose => {
  const side = index % 2 ? 1 : -1;
  const selected = index === active;
  const parked = [[-.98, .45], [.08, 1.05], [.98, .5], [-1, -.65], [.08, -1.05], [1, -.65]][index];
  return {
    x: selected ? side * width * .4 : parked[0] * width,
    y: selected ? height * -.025 : parked[1] * height,
    scale: height * (selected ? .26 : .3),
    rx: (selected ? .12 : .45) * side,
    ry: (selected ? .22 : .75) * -side,
    rz: (selected ? .14 : turn) * side,
  };
};

// Portrait compositions use viewport width, so the held letter stays recognisable.
// Only the selected letter rolls within a chapter; parked letters remain offscreen.
const phoneEdgePose = (index: number, active: number, phase: number, layout: SculptureLayout, tuning: HeroMotion): LetterPose => {
  const side = index % 2 ? 1 : -1;
  const selected = index === active;
  return {
    x: side * layout.width * (selected ? .38 : 1.7),
    y: layout.height * (selected ? mix(.08, -.1, ease(phase)) : (index - 2.5) * .14),
    scale: layout.width * (selected ? tuning.phoneScale : .23),
    rx: side * (selected ? mix(-.12, .18, ease(phase)) : .35),
    ry: side * (selected ? -.2 : -.6),
    rz: side * (selected ? mix(tuning.phoneTurn, -tuning.phoneTurn, ease(phase)) : .5),
  };
};

// Scroll is the timeline: the same position always produces the same six poses.
export function letterPose(index: number, layout: SculptureLayout, scroll: SculptureScroll, tuning: HeroMotion): LetterPose {
  const [x, y, angle] = layout.letters[index];
  const spread = ease(scroll.distance / tuning.scrollSpan);
  if (layout.phone) {
    const chapter = Math.max(0, Math.min(5, scroll.chapter));
    const active = Math.floor(chapter);
    const phase = chapter - active;
    const handoff = ease((phase - .45) / .55);
    const from = phoneEdgePose(index, active, phase, layout, tuning);
    const to = phoneEdgePose(index, Math.min(5, active + 1), 0, layout, tuning);
    const exit = ease(scroll.outro);
    const grow = ease((scroll.distance / tuning.scrollSpan - .2) / .8);
    return {
      x: mix(x, mix(from.x, to.x, handoff), spread) + (index % 2 ? 1 : -1) * layout.width * exit * 1.2,
      y: mix(y, mix(from.y, to.y, handoff), spread) + exit * layout.height * .22,
      scale: mix(1, mix(from.scale, to.scale, handoff), grow),
      rx: mix(from.rx, to.rx, handoff) * spread,
      ry: mix(from.ry, to.ry, handoff) * spread,
      rz: mix(angle, mix(from.rz, to.rz, handoff), spread) + exit * tuning.phoneTurn,
    };
  }

  const chapter = Math.max(0, Math.min(5, scroll.chapter));
  const active = Math.floor(chapter);
  const handoff = ease((chapter - active - .55) / .45);
  const from = edgePose(index, active, layout.width, layout.height, tuning.scrollTurn);
  const to = edgePose(index, Math.min(5, active + 1), layout.width, layout.height, tuning.scrollTurn);
  const exit = ease(scroll.outro);
  const grow = ease((scroll.distance / tuning.scrollSpan - .15) / .85);
  return {
    x: mix(x, mix(from.x, to.x, handoff), spread) + (index % 2 ? 1 : -1) * layout.width * exit,
    y: mix(y, mix(from.y, to.y, handoff), spread) + exit * layout.height * .3,
    scale: mix(1, mix(from.scale, to.scale, handoff), grow),
    rx: mix(from.rx, to.rx, handoff) * spread,
    ry: mix(from.ry, to.ry, handoff) * spread,
    rz: mix(angle, mix(from.rz, to.rz, handoff), spread) + exit * tuning.scrollTurn,
  };
}
