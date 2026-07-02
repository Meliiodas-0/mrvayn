import { projects } from "./projects";

export interface ReelFrame {
  id: string;
  title: string;
  /** Short discipline tag shown on the frame (kept punchy for the HUD chip). */
  tag: string;
  year: string;
  href: string;
  img: string;
}

// Preview stills pulled from each project's showcase video / media and baked into
// /public/showreel/*.webp (viewport-cropped + shadow-lifted; see scratchpad extractors).
// Ordered to alternate dark/bright builds so the marquee has a scroll rhythm.
const REEL: { id: string; tag: string }[] = [
  { id: "antarya", tag: "Unreal Engine 5" },
  { id: "couragely", tag: "Roblox · Horror" },
  { id: "env-design-2", tag: "Environment Art" },
  { id: "unreal-horror", tag: "UE5 · Horror" },
  { id: "env-design", tag: "Environment Art" },
  { id: "first-target-shooting", tag: "UE5 · Gameplay" },
  { id: "ai-therapist", tag: "AI Prototype" },
];

export const reelFrames: ReelFrame[] = REEL.map(({ id, tag }) => {
  const p = projects.find((x) => x.id === id);
  if (!p) throw new Error(`showreel: unknown project id "${id}"`);
  return {
    id,
    title: p.title,
    tag,
    year: p.year,
    href: p.links[0]?.href ?? "#loadout",
    img: `/showreel/${id}.webp`,
  };
});
