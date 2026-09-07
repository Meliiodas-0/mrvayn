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
  displayTitle?: string;
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
  /** Optional local video clip (under /public), plays in the detail panel. */
  clip?: string;
  /** Editorial details for the selected-work presentations. */
  selection?: {
    category: string;
    previewLabel: string;
    caption: string;
    posterAlt: string;
    facts: { value: string; label: string }[];
  };
  /** A full-width lead project with an on-demand inline video preview. */
  spotlight?: {
    label: string;
    previewLabel: string;
    previewTitle: string;
    previewCaption: string;
    posterAlt: string;
    videoLabel: string;
    detailLabel: string;
    facts: { value: string; label: string }[];
  };
  /** Older prototypes collapse under "Earlier builds" in the Work grid. */
  archive?: boolean;
  /** Case study (shown in the detail panel). */
  problem?: string;
  approach?: string;
  result?: string;
}

export const projects: Project[] = [
  {
    id: "cricket-broadcast",
    title: "Cricket Broadcast Lab",
    role: "Creator, camera & broadcast systems",
    year: "2026",
    summary:
      "A cricket camera and broadcast framework in Unreal Engine 5.8. Live ball tracking flows into slow-motion replays with trails, backed by an operator desk for replay inspection, camera preview and take, and lighting looks.",
    tech: ["Unreal Engine 5.8", "C++", "Blueprints", "Camera Systems", "Replay Tools", "Cinematic Presentation"],
    links: [{ label: "Watch full film", href: "https://drive.google.com/file/d/1G-xUExs9pRnRpInMRkHpyMEIHtdcoBwh/view?usp=sharing" }],
    badge: "PRODUCTION TEST 03",
    featured: true,
    media: "/projects/cricket-broadcast.jpg",
    clip: "/projects/cricket-broadcast-preview.mp4",
    spotlight: {
      label: "Latest showcase",
      previewLabel: "Play 21s preview",
      previewTitle: "21s preview / Live + replay",
      previewCaption:
        "A live six followed by its complete slow replay with ball trails. Silent preview; the full film includes sound.",
      posterAlt: "Cricket Broadcast Lab, the batsman and ball during a six replay",
      videoLabel: "Cricket Broadcast Lab: live six and trail replay",
      detailLabel: "View project",
      facts: [
        { value: "06", label: "Shot + replay pairs" },
        { value: "4K / 60", label: "Full film quality" },
        { value: "3:02", label: "Full film runtime" },
      ],
    },
    problem:
      "Cricket coverage has to keep a small, fast-moving ball readable while switching between live action, close contact, field tracking and replay. The operator also needs clear control over the next camera and the replay timeline.",
    approach:
      "Built camera profiles and state-driven coverage in UE 5.8 with C++ and Blueprint controls. Six authored outcomes pair live coverage with immediate slow replays and native ball trails. A broadcast desk exposes frame inspection, trail control, camera preview/take and lighting presets.",
    result:
      "A playable portfolio framework with mannequin athletes and six authored outcomes: dot ball, single, four, six, caught and bowled. The native 4K/60 presentation shows every live shot and replay, then a concise operator-tools tour and a ground cinematic.",
  },
  {
    id: "antarya",
    title: "Antarya",
    role: "CTO, Magadha Studios",
    year: "2024-Present",
    summary:
      "Gameplay architecture and real-time production for Magadha Studios' flagship title. I lead core technology and a modular UE5 framework that lets the team build and iterate together.",
    tech: ["Unreal Engine 5", "Gameplay Framework", "Multiplayer", "Niagara VFX"],
    links: [{ label: "Studio", href: "https://magadhastudios.com/category" }],
    badge: "IN DEV",
    featured: true,
    shipped: false,
    media: "/projects/antarya.webp", // owner's in-engine screenshot (shadow-lifted + sharpened)
    selection: {
      category: "Studio game development",
      previewLabel: "Explore the project",
      caption: "In-engine capture from Antarya. Gameplay systems, multiplayer foundations and Niagara VFX, built at Magadha Studios.",
      posterAlt: "Antarya gameplay, a trident-wielding character inside a stone temple",
      facts: [
        { value: "CTO", label: "My role" },
        { value: "20-person", label: "Studio team" },
        { value: "IGDC 2025", label: "Public showcase" },
      ],
    },
    problem:
      "Small teams iterate slowly when gameplay is hard-coded: every new mechanic risks rewriting core systems.",
    approach:
      "As CTO I built a reusable, data-driven gameplay framework in Unreal Engine 5: modular systems, designer-tunable data assets, and a multiplayer-ready architecture, so features slot in without touching the core.",
    result:
      "The framework powered Antarya's showcase at IGDC 2025; a playable demo is in progress.",
  },
  {
    id: "ue-mcp",
    title: "UE MCP Conductor",
    role: "Creator, autonomous AI tooling",
    year: "2026",
    summary:
      "One command surface for Unreal Engine automation. Detects connected MCP servers and routes tasks across gameplay, art, animation and production tools.",
    tech: ["AI Agents", "MCP", "TypeScript", "Python", "Unreal Engine 5.8 / 5.6", "Blender"],
    links: [],
    badge: "IN DEV",
    media: "/projects/ue-mcp.webp", // owner's screenshot of the branded app
    problem:
      "No single MCP server covers all of Unreal, and picking the right one per task (and per engine version) by hand is slow and error-prone. One wrong tool call can corrupt a live editor session.",
    approach:
      "A Claude Code skill that auto-detects the connected MCP servers and routes each request to the best tool, version-aware across UE 5.8 and 5.6, with fallback ladders when a server is down and anti-hallucination, production-safety rules on top.",
    result:
      "One command surface over the whole engine: 70+ tools and 23 workflow recipes, turning hours of editor busywork into minutes and driving real day-to-day work.",
  },
  { id: "ai-therapist", title: "Virtual AI Therapist", role: "Developer", year: "2023", summary: "A conversational AI prototype combining real-time dialogue, sentiment analysis and retrieval-augmented responses.", media: "/showreel/ai-therapist.webp", tech: ["AI", "LangChain", "RAG", "Prototype"], links: [{ label: "View", href: "https://drive.google.com/file/d/1WV2xYvS9aCd0mrpUbshdrsm8rcOFGNf8/view?usp=drive_link" }] },
  { id: "unreal-horror", title: "Unreal Horror Game", role: "Developer", year: "2023", summary: "An atmospheric horror prototype in Unreal Engine 5.", tech: ["Unreal Engine 5", "Horror"], archive: true, links: [{ label: "Watch", href: "https://drive.google.com/file/d/1X1QuGVAsIcP6mcX-Q5LFw_Sr0XxBt8Xb/view?usp=sharing" }] },
  {
    id: "multiplayer-tba",
    title: "SAO-X · Skill Art Online",
    displayTitle: "SAO-X",
    role: "Solo build, personal",
    year: "2026",
    summary:
      "A playable multiplayer action RPG, built from combat to persistence. GAS abilities, player trading, inventory and PvP share a dedicated backend, while an Awakening Diagnosis assigns a race based on how you play.",
    tech: ["Unreal Engine 5.8", "C++", "GAS", "Dedicated Server", "Docker", "PostgreSQL", "Redis", "NATS", "JWT Auth"],
    links: [{ label: "Watch full video", href: "https://drive.google.com/file/d/1JZbLI4k2nWNDb9mieb6ihhG_NjEabZCy/view?usp=drive_link" }],
    badge: "PLAYABLE",
    featured: true,
    shipped: false,
    media: "/projects/saox-hero.webp", // hero still: staff stance in the town hub, arches + floating rocks (owner-picked shot)
    clip: "/projects/saox-town.mp4", // ~10s continuous townhall walk: village road, plaza, arch colonnade (no dungeon)
    selection: {
      category: "Multiplayer action RPG",
      previewLabel: "Play 10s preview",
      caption: "A continuous walk through the town hub, from village road to plaza and arch colonnade. Open the full video for the wider gameplay showcase.",
      posterAlt: "SAO-X gameplay, a staff-wielding character beneath floating rocks and stone arches",
      facts: [
        { value: "GAS", label: "Combat foundation" },
        { value: "06", label: "Player races" },
        { value: "Playable", label: "Current build" },
      ],
    },
    problem:
      "Action-RPG combat at MMO scale is unforgiving: abilities, trading, PvP, and persistence all have to stay authoritative and in sync with many players sharing one world.",
    approach:
      "Built on Unreal's Gameplay Ability System with a C++ core, then a dedicated backend on Docker (Postgres, Redis, NATS) and JWT auth with handoff tokens for clean server transfers. Player behavior is tracked into an “Awakening Diagnosis” that assigns one of 6 races.",
    result:
      "A playable build: inventory, trading, PvP zones, and the ability system working end to end at 100 concurrent players per instance, now expanding toward a bigger world.",
  },
  {
    id: "magviz",
    title: "MagViz",
    role: "Creator, Vayn Studios (commercial)",
    year: "2026",
    summary:
      "An architect's CAD model becomes an interactive sales experience. Explore the building, check apartment pricing and availability, isolate floors, and change finishes or daylight in a standalone offline app.",
    tech: ["Unreal Engine 5.8", "C++", "Datasmith / FBX", "Lumen GI", "UMG", "Windows Build"],
    links: [{ label: "Watch full video", href: "https://drive.google.com/file/d/1bimzCoh5DpLQ7v1hIzspsM90RO6XA6IX/view?usp=drive_link" }],
    badge: "SHIPPED",
    featured: true,
    shipped: true,
    media: "/projects/magviz.webp", // hero still: dusk aerial with the live tool UI (own capture)
    clip: "/projects/magviz-sections.mp4", // ~11s: green unit/section blocks, floor-isolation cut, night-to-dawn weather sweep
    selection: {
      category: "Commercial real-time architecture",
      previewLabel: "Play 11s preview",
      caption: "The working sales tool: unit and section views, floor isolation, and a night-to-dawn lighting sweep. Captured directly from the app.",
      posterAlt: "MagViz, a coastal apartment development with interactive pricing, section and lighting controls",
      facts: [
        { value: "Shipped", label: "Commercial release" },
        { value: "Offline", label: "Standalone app" },
        { value: "Lumen", label: "Real-time lighting" },
      ],
    },
    problem:
      "Selling an unbuilt development off static renders and a PDF price list is flat: buyers can't explore the building, see what's still available, or picture it at a different time of day.",
    approach:
      "A real-time UE 5.8 + C++ app: Datasmith/FBX ingest of the architect's model, dynamic Lumen GI, and a UMG layer for fly-through/walk, clickable per-unit pricing and availability, section cuts, finish swaps, and time-of-day, packaged as a standalone Windows build that runs offline.",
    result:
      "An interactive sales tool a developer can hand a buyer on a laptop with no internet, sold commercially through Vayn Studios.",
  },
  { id: "sasta-minecraft", title: "Sasta Minecraft", role: "Developer", year: "2023", summary: "A voxel sandbox experiment.", tech: ["Unreal Engine 5", "Systems"], archive: true, links: [{ label: "Watch", href: "https://drive.google.com/file/d/1BkugwIClcTx4aLtK-34aaelw40YbYxDk/view?usp=drive_link" }] },
  { id: "env-design-2", title: "Environment Design", role: "Environment Artist", year: "2023", summary: "Real-time UE5 environment art: two pieces built under tight deadlines.", tech: ["Unreal Engine 5", "Environment"], archive: true, links: [{ label: "View 2.0", href: "https://drive.google.com/file/d/1hwlbVTwMOzlgakO_T6ooHetDxh7mE4JC/view?usp=drive_link" }, { label: "View 1.0", href: "https://drive.google.com/file/d/1Io3zeGNmbGLYUTxSnldVEFKCwFcjmO5p/view?usp=drive_link" }] },
  { id: "techademy", title: "Techademy", role: "Hackathon", year: "2023", summary: "A hackathon build.", tech: ["Game Jam", "Rapid Prototype"], archive: true, links: [{ label: "View", href: "https://drive.google.com/file/d/1acw_QwxZmLBwmQIKrSJf6_nW2ozH77vk/view?usp=sharing" }] },
  { id: "first-target-shooting", title: "First Target Shooting Game", role: "Developer", year: "2022", summary: "An early target/aim shooting prototype.", tech: ["Unreal Engine 5", "Gameplay"], archive: true, links: [{ label: "Watch", href: "https://drive.google.com/file/d/1de3noEKBFLNmfWG58Uw-CHItLTLSuL4S/view?usp=drive_link" }] },
  { id: "cgi-teaser", title: "CGI Animated Teaser", role: "VFX / CGI", year: "2023", summary: "A cinematic CGI teaser produced in UE5.", tech: ["UE5 Cinematics", "Sequencer", "VFX"], archive: true, links: [{ label: "View", href: "https://drive.google.com/drive/folders/1D7sYdJ2a0RIfLjLvWnXD1F4m0ldMqFJW?usp=drive_link" }] },
  { id: "glazer-site", title: "Glazer Games Website", role: "Web Developer", year: "2023", summary: "Production website for Glazer Games.", tech: ["Web", "Frontend"], archive: true, links: [{ label: "Visit", href: "https://www.glazer.games" }], media: "/projects/glazer-site.webp" },
  {
    id: "grannyspot",
    title: "Grannyspot",
    role: "Full-stack, Solo build",
    year: "2025",
    summary:
      "Live e-commerce store for a handmade-pickle brand: product catalog, cart, user auth, Razorpay checkout, and an admin panel secured by server-side RBAC.",
    tech: ["Next.js 14", "TypeScript", "Tailwind CSS", "Prisma", "Supabase", "PostgreSQL", "Razorpay"],
    links: [{ label: "Visit", href: "https://grannyspot.com" }],
    badge: "LIVE",
    shipped: true,
    media: "/projects/grannyspot.webp", // product card built from the store's own thecha shot
    // TODO(MrVayn): confirm grannyspot.com is publicly live before sharing widely.
    problem:
      "A handmade-pickle brand needed a real storefront (catalog, secure checkout, and an admin panel), not a template.",
    approach:
      "A solo full-stack build: Next.js 14 + TypeScript + Tailwind, Prisma over Supabase (Postgres + Auth), Razorpay checkout, and server-side role-based access control for the admin panel; a responsive, WCAG-AA-conscious design system deployed on Vercel.",
    result:
      "A live store with catalog, cart, user auth, payments, and a secured admin panel.",
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
    media: "/showreel/couragely.webp",
    problem:
      "Could a sticky, shareable horror loop be built and shipped in a week, and actually find an audience?",
    approach:
      "A solo Roblox/Luau build: a tight scare loop, fast onboarding, and live-ops tuning for retention, shipped in 7 days.",
    result:
      "12.2K visits · 601 favorites · 638,391 impressions · 9,432 plays in the first two weeks.",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);

export const projectUi = {
  viewProject: "View project",
  playPreview: "Play preview",
  previewUnavailable: "Preview unavailable. Open the full project using the link below.",
} as const;
