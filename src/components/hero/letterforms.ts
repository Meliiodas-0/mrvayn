// Original rounded centerlines. The same geometry supplies SVG and WebGL.
export type Point = readonly [number, number];
export type Segment =
  | { kind: "line"; to: Point }
  | { kind: "curve"; control: Point; to: Point };
export type Stroke = { start: Point; segments: Segment[] };
export type Letterform = { letter: string; strokes: Stroke[] };

const line = (x: number, y: number): Segment => ({ kind: "line", to: [x, y] });
const curve = (cx: number, cy: number, x: number, y: number): Segment => ({ kind: "curve", control: [cx, cy], to: [x, y] });

export const LETTERFORMS: Letterform[] = [
  { letter: "M", strokes: [{ start: [-1.35, -1.5], segments: [line(-1.35, 1.2), curve(-1.35, 1.8, -1.06, 1.3), line(-.2, -.22), curve(0, -.57, .2, -.22), line(1.06, 1.3), curve(1.35, 1.8, 1.35, 1.2), line(1.35, -1.5)] }] },
  { letter: "R", strokes: [
    { start: [-1.15, -1.5], segments: [line(-1.15, 1.25), curve(-1.15, 1.5, -.9, 1.5), line(.25, 1.5), curve(1.35, 1.5, 1.35, .7), curve(1.35, -.08, .25, -.08), line(-1.15, -.08)] },
    { start: [.06, -.08], segments: [line(1.4, -1.5)] },
  ] },
  { letter: "V", strokes: [{ start: [-1.35, 1.5], segments: [line(-.25, -1.27), curve(0, -1.9, .25, -1.27), line(1.35, 1.5)] }] },
  { letter: "A", strokes: [
    { start: [-1.35, -1.5], segments: [line(-.25, 1.27), curve(0, 1.9, .25, 1.27), line(1.35, -1.5)] },
    { start: [-.88, -.38], segments: [line(.88, -.38)] },
  ] },
  { letter: "Y", strokes: [
    { start: [-1.35, 1.5], segments: [line(-.25, .13), curve(0, -.18, .25, .13), line(1.35, 1.5)] },
    { start: [0, -.03], segments: [line(0, -1.55)] },
  ] },
  { letter: "N", strokes: [{ start: [-1.3, -1.5], segments: [line(-1.3, 1.25), curve(-1.3, 1.8, -1.02, 1.36), line(1.02, -1.36), curve(1.3, -1.8, 1.3, -1.25), line(1.3, 1.5)] }] },
];

export function strokePath(stroke: Stroke) {
  return `M ${stroke.start.join(" ")} ` + stroke.segments.map(segment =>
    segment.kind === "line" ? `L ${segment.to.join(" ")}` : `Q ${segment.control.join(" ")} ${segment.to.join(" ")}`,
  ).join(" ");
}

export const DESKTOP_LETTERS = [
  [-4.22, 1.8, -.19], [-.14, 1.95, .11], [3.95, 2.06, -.16],
  [-3.62, -1.96, .15], [.4, -1.84, -.12], [4.43, -1.78, .18],
] as const;

export const PHONE_LETTERS = [
  [-1.98, 3.85, -.15], [1.91, 3.9, .1],
  [-1.91, -.05, -.09], [1.89, .02, .12],
  [-1.96, -3.88, .09], [1.94, -3.88, -.1],
] as const;
