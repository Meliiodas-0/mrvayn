// Project loadout. Add/edit projects here.
// TODO(MrVayn): add media (trailer/gif/thumbnail) per project, fill the
// problem/approach/result case-study fields, and confirm years/tech tags.

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  title: string;
  role: string;
  year: string;
  summary: string;
  tech: string[];
  links: ProjectLink[];
  badge?: string;
  featured?: boolean;
  locked?: boolean;
  shipped?: boolean;
  /** Path under /public, TODO(MrVayn): replace placeholder media. */
  media?: string;
  /** Case study (shown in the detail panel). TODO(MrVayn): real copy. */
  problem?: string;
  approach?: string;
  result?: string;
}

export const projects: Project[] = [
  {
    id: "antarya",
    title: "Antarya",
    role: "CTO, Magadha Studios",
    year: "2024-Present",
    summary:
      "A studio title built on a reusable, data-driven gameplay framework for rapid iteration and scale. Showcased at IGDC 2025; demo in progress.",
    tech: ["Unreal Engine 5", "Gameplay Framework", "Multiplayer", "Niagara VFX"],
    links: [{ label: "Studio", href: "https://magadhastudios.com/category" }],
    badge: "IGDC 2025",
    featured: true,
    shipped: false,
    media: "/projects/antarya.webp", // owner's in-engine screenshot (shadow-lifted + sharpened)
    problem:
      "Small teams iterate slowly when gameplay is hard-coded, every new mechanic risks rewriting core systems.",
    approach:
      "As CTO I built a reusable, data-driven gameplay framework in Unreal Engine 5: modular systems, designer-tunable data assets, and a multiplayer-ready architecture, so features slot in without touching the core.",
    result:
      "The framework powered Antarya's showcase at IGDC 2025; a playable demo is in progress.",
  },
  {
    id: "ue-mcp",
    title: "Unreal Engine MCP",
    role: "Creator, dev tooling",
    year: "2026",
    summary:
      "A custom MCP server that lets AI agents drive the Unreal Editor: scene control, asset pipelines, and editor automation with a deeper toolset than the stock integrations.",
    tech: ["MCP", "TypeScript", "Unreal Engine", "AI Agents", "Editor Automation"],
    links: [],
    badge: "IN DEV",
    problem:
      "AI assistants can write code, but driving a live Unreal Editor session (scenes, assets, sequences, builds) needs a real protocol bridge, and the stock options cover too little.",
    approach:
      "A custom Model Context Protocol server for Unreal: a typed TypeScript toolset over the editor's automation surface, designed for agent workflows end to end.",
    result:
      "In active development and already driving real editor work day to day, with a broader toolset than the native integrations.",
  },
  {
    id: "couragely",
    title: "Couragely",
    role: "Solo build, Roblox horror",
    year: "2025",
    summary:
      "A Roblox horror game built in 7 days. Within 2 weeks: 12.2K visits, 601 favorites, 638,391 impressions, 9,432 plays.",
    tech: ["Roblox", "Luau", "Horror", "Live Ops"],
    links: [{ label: "Play on Roblox", href: "https://www.roblox.com/games/137847988705947/Couragely" }],
    badge: "LIVE",
    shipped: true,
    media: "https://tr.rbxcdn.com/180DAY-8c1ca43249f81b505fa0eb47531f04ee/500/280/Image/Jpeg/noFilter",
    problem:
      "Could a sticky, shareable horror loop be built and shipped in a week, and actually find an audience?",
    approach:
      "A solo Roblox/Luau build: a tight scare loop, fast onboarding, and live-ops tuning for retention, shipped in 7 days.",
    result:
      "12.2K visits · 601 favorites · 638,391 impressions · 9,432 plays in the first two weeks.",
  },
  { id: "ai-therapist", title: "Virtual AI Therapist", role: "Developer", year: "2023", summary: "An AI-driven conversational prototype that handles real-time dialogue and reads sentiment.", tech: ["AI", "LangChain", "RAG", "Prototype"], links: [{ label: "View", href: "https://drive.google.com/file/d/1WV2xYvS9aCd0mrpUbshdrsm8rcOFGNf8/view?usp=drive_link" }] },
  { id: "unreal-horror", title: "Unreal Horror Game", role: "Developer", year: "2023", summary: "An atmospheric horror prototype in Unreal Engine 5.", tech: ["Unreal Engine 5", "Horror"], links: [{ label: "Watch", href: "https://drive.google.com/file/d/1X1QuGVAsIcP6mcX-Q5LFw_Sr0XxBt8Xb/view?usp=sharing" }] },
  {
    id: "multiplayer-tba",
    title: "Fantasy MMORPG",
    role: "Solo build, latest work",
    year: "2026",
    summary:
      "A fantasy MMORPG with a playable prototype: dedicated-server architecture, custom combat framework, PvP, PvE, ability system, and inventory all working, now being expanded.",
    tech: ["Unreal Engine 5", "Dedicated Servers", "Combat Framework", "PvP & PvE", "Ability System", "Inventory"],
    links: [],
    badge: "PLAYABLE",
    featured: true,
    shipped: false,
    media: "/projects/mmorpg.webp", // owner's top-down shot of the floating-island hub town
    problem:
      "Multiplayer at MMO scale is unforgiving: persistence, replication, and combat all have to hold up with many players in one world.",
    approach:
      "Server architecture first, then custom frameworks on top: combat, abilities, inventory, and the PvP and PvE loops, all data-driven and built to scale before content fills them.",
    result:
      "A playable prototype is ready: core systems working end to end and now expanding toward a bigger world. Reveal to come.",
  },
  { id: "sasta-minecraft", title: "Sasta Minecraft", role: "Developer", year: "2023", summary: "A voxel sandbox experiment.", tech: ["Unreal Engine 5", "Systems"], links: [{ label: "Watch", href: "https://drive.google.com/file/d/1BkugwIClcTx4aLtK-34aaelw40YbYxDk/view?usp=drive_link" }] },
  { id: "env-design-2", title: "Environment Design 2.0", role: "Environment Artist", year: "2023", summary: "Real-time environment art in UE5.", tech: ["Unreal Engine 5", "Environment"], links: [{ label: "View", href: "https://drive.google.com/file/d/1hwlbVTwMOzlgakO_T6ooHetDxh7mE4JC/view?usp=drive_link" }] },
  { id: "env-design", title: "Environment Design", role: "Environment Artist", year: "2023", summary: "Immersive environment design under tight deadlines.", tech: ["Unreal Engine 5", "Environment"], links: [{ label: "View", href: "https://drive.google.com/file/d/1Io3zeGNmbGLYUTxSnldVEFKCwFcjmO5p/view?usp=drive_link" }] },
  { id: "techademy", title: "Techademy", role: "Hackathon", year: "2023", summary: "A hackathon build.", tech: ["Game Jam", "Rapid Prototype"], links: [{ label: "View", href: "https://drive.google.com/file/d/1acw_QwxZmLBwmQIKrSJf6_nW2ozH77vk/view?usp=sharing" }] },
  { id: "first-target-shooting", title: "First Target Shooting Game", role: "Developer", year: "2022", summary: "An early target/aim shooting prototype.", tech: ["Unreal Engine 5", "Gameplay"], links: [{ label: "Watch", href: "https://drive.google.com/file/d/1de3noEKBFLNmfWG58Uw-CHItLTLSuL4S/view?usp=drive_link" }] },
  { id: "cgi-teaser", title: "CGI Animated Teaser", role: "VFX / CGI", year: "2023", summary: "A cinematic CGI teaser produced in UE5.", tech: ["UE5 Cinematics", "Sequencer", "VFX"], links: [{ label: "View", href: "https://drive.google.com/drive/folders/1D7sYdJ2a0RIfLjLvWnXD1F4m0ldMqFJW?usp=drive_link" }] },
  { id: "rpg-prototype", title: "RPG Game Prototype", role: "Developer", year: "2023", summary: "An RPG systems prototype.", tech: ["Unreal Engine 5", "RPG Systems"], links: [{ label: "View", href: "https://drive.google.com/drive/folders/1WuzkMKut5wKKHKTDJ9IC5vR8q_y1sL5z" }] },
  { id: "glazer-site", title: "Glazer Games Website", role: "Web Developer", year: "2023", summary: "Production website for Glazer Games.", tech: ["Web", "Frontend"], links: [{ label: "Visit", href: "https://www.glazer.games" }] },
  { id: "bharatverse", title: "Bharatverse", role: "Developer", year: "2023", summary: "A concept/world-building project.", tech: ["Unreal Engine 5", "World Design"], links: [{ label: "View", href: "https://drive.google.com/file/d/11bqGKg3IUZTWWNw6ofC_pv7yLPN8nxPu/view" }] },
  {
    id: "grannyspot",
    title: "Grannyspot",
    role: "Full-stack, Solo build",
    year: "2025",
    summary:
      "Live e-commerce store for a handmade-pickle brand, product catalog, cart, user auth, Razorpay checkout, and an admin panel secured by server-side RBAC.",
    tech: ["Next.js 14", "TypeScript", "Tailwind CSS", "Prisma", "Supabase", "PostgreSQL", "Razorpay"],
    links: [{ label: "Visit", href: "https://grannyspot.com" }],
    badge: "LIVE",
    shipped: true,
    // TODO(MrVayn): confirm grannyspot.com is publicly live before sharing widely.
    problem:
      "A handmade-pickle brand needed a real storefront, catalog, secure checkout, and an admin panel, not a template.",
    approach:
      "A solo full-stack build: Next.js 14 + TypeScript + Tailwind, Prisma over Supabase (Postgres + Auth), Razorpay checkout, and server-side role-based access control for the admin panel; a responsive, WCAG-AA-conscious design system deployed on Vercel.",
    result:
      "A live store with catalog, cart, user auth, payments, and a secured admin panel.",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
