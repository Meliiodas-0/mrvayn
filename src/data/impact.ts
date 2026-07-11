// Proof-of-work content: the credibility ticker and the Field Record stat wall.
// Identity-first (UE5 + software engineering), numbers stated as facts, never as asks.
// Everything here is real (resume + live product data). Site copy never uses em dashes.

/** Slim credibility marquee under the hero. Short, factual, identity-first. */
export const proofChips: string[] = [
  "Unreal Engine 5 · gameplay, netcode, VFX",
  "CTO at Magadha Studios · building Antarya",
  "Antarya showcased at IGDC 2025",
  "Fantasy MMORPG in development",
  "Full-stack & AI product engineering",
  "3 products live in production",
];

export interface ImpactStat {
  value: string;
  label: string;
  context: string;
}

/** Field Record: the work, stated plainly. */
export const impactStats: ImpactStat[] = [
  { value: "15+", label: "Person engineering team", context: "Led as CTO at Magadha Studios, heads-down on Antarya." },
  { value: "IGDC", label: "2025 showcase", context: "Antarya demoed on India's biggest game-dev stage." },
  { value: "MMO", label: "In development", context: "Fantasy multiplayer: server architecture ready, combat, abilities, and inventory in progress." },
  { value: "1st", label: "Round closed", context: "Magadha Studios is funded and focused on shipping." },
  { value: "3", label: "Products live", context: "A game, a storefront, and a studio site running in production." },
  { value: "7", label: "Days to ship", context: "Couragely, a solo Roblox horror experiment: 12K visits in two weeks." },
];
