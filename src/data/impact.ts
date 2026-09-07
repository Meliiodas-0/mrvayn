// Proof-of-work content: the credibility ticker and the Impact stat wall.
// Identity-first (UE5 + software engineering), numbers stated as facts, never as asks.
// Everything here is real (resume + live product data). Site copy never uses em dashes.

/** Slim credibility ticker between the hero and About. Short, factual, identity-first. */
export const proofChips: string[] = [
  "Unreal Engine 5 · gameplay, netcode, VFX",
  "CTO at Magadha Studios · building Antarya",
  "Antarya showcased at IGDC 2025",
  "SAO-X · playable multiplayer RPG",
  "MagViz · real-time archviz, sold commercially",
  "UE MCP Conductor · autonomous AI tooling",
  "Full-stack & AI product engineering",
  "3 products shipped",
];

export interface ImpactStat {
  value: string;
  label: string;
  context: string;
}

/** Impact: the work, stated plainly. */
export const impactStats: ImpactStat[] = [
  { value: "20", label: "Person studio", context: "Magadha Studios, led as CTO, heads-down on Antarya." },
  { value: "IGDC", label: "2025 showcase", context: "Antarya demoed on India's biggest game-dev stage." },
  { value: "MMO", label: "Playable prototype", context: "SAO-X, a multiplayer action RPG: GAS combat, trading, PvP, and inventory working at 100 players per instance." },
  { value: "1st", label: "Round closed", context: "Magadha Studios is funded and focused on shipping." },
  { value: "3", label: "Products shipped", context: "MagViz sold commercially, a live storefront, and a live Roblox game." },
  { value: "40x", label: "Faster editor iteration", context: "Estimated on repetitive editor tasks: my Unreal MCP's 70+ tools and 23 workflow recipes turn hours of busywork into minutes." },
];
