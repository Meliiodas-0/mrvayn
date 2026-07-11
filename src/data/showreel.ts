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
// /public/showreel/*.webp (viewport-cropped past the OBS/editor chrome + shadow-lifted;
// see scratchpad extractors). Every project EXCEPT Grannyspot, the locked Multiplayer,
// and Glazer Games. Ordered to alternate dark/bright builds so the marquee has rhythm.
const REEL: { id: string; tag: string }[] = [
  { id: "antarya", tag: "Unreal Engine 5" },
  { id: "cgi-teaser", tag: "UE5 Cinematics" },
  { id: "env-design-2", tag: "Environment Art" },
  { id: "unreal-horror", tag: "UE5 · Horror" },
  { id: "ai-therapist", tag: "AI Prototype" },
  { id: "couragely", tag: "Roblox · Horror" },
  { id: "first-target-shooting", tag: "UE5 · Gameplay" },
  { id: "env-design", tag: "Environment Art" },
  { id: "rpg-prototype", tag: "RPG Systems" },
  { id: "bharatverse", tag: "World Design" },
  { id: "techademy", tag: "Game Jam" },
  { id: "sasta-minecraft", tag: "Voxel Sandbox" },
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
