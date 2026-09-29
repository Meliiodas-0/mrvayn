// Project loadout. Add/edit projects here.
// TODO(MrVayn): add media (trailer/gif/thumbnail) per project, fill the
// problem/approach/result case-study fields, and confirm years/tech tags.

import { systemsProjects } from "./systemsProjects";

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
  mediaWidth?: number;
  mediaHeight?: number;
  gallery?: { src: string; alt: string; caption: string; width: number; height: number }[];
  mediaAlt?: string;
  mediaCaption?: string;
  /** Concise, factual description for this project's search result. */
  seoDescription?: string;
  /** Optional local video clip (under /public), plays in the detail panel. */
  clip?: string;
  /** Optional full film, loaded only after an explicit play action. */
  fullFilm?: {
    src: string;
    label: string;
    caption: string;
    captions?: { src: string; label: string; language: string };
  };
  features?: { title: string; description: string }[];
  note?: string;
  callToAction?: ProjectLink;
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
  ...systemsProjects,
  {
    id: "cricket-broadcast",
    title: "Broadcast & Camera Systems",
    role: "Creator, camera & broadcast systems",
    year: "2026",
    summary:
      "A real-time broadcast and camera system in Unreal Engine 5.8, demonstrated through cricket coverage. State-driven cameras track play, hand off to slow-motion replays, and give an operator control over camera preview, take and replay inspection.",
    seoDescription: "Unreal Engine broadcast and camera systems by Aayush (MrVayn): ball tracking, camera switching, slow-motion replays and an operator desk.",
    tech: ["Unreal Engine 5.8", "C++", "Blueprints", "Camera Systems", "Replay Tools", "Cinematic Presentation"],
    links: [{ label: "Watch full film", href: "https://drive.google.com/file/d/1G-xUExs9pRnRpInMRkHpyMEIHtdcoBwh/view?usp=sharing" }],
    featured: true,
    media: "/projects/cricket-broadcast.jpg",
    clip: "/projects/cricket-broadcast-preview.mp4",
    selection: {
      category: "Real-time broadcast tools",
      previewLabel: "Play 21s preview",
      caption: "Cricket coverage from the working camera system: a live six followed by a slow replay with ball trails. Silent 21s preview; the full 3:02 film includes sound and an operator-tools walkthrough.",
      posterAlt: "Cricket camera system tracking a batsman and ball during a six replay",
      facts: [
        { value: "Live", label: "Camera tracking" },
        { value: "Replay", label: "Inspection tools" },
        { value: "Preview / take", label: "Operator control" },
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
    seoDescription: "Aayush (MrVayn)'s Unreal Engine gameplay architecture for Antarya at Magadha Studios: modular systems, multiplayer foundations and Niagara VFX.",
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
    seoDescription: "UE MCP Conductor by Aayush (MrVayn): version-aware AI tool routing for Unreal Engine 5.8 and 5.6, with connected MCP servers and Blender workflows.",
    title: "UE MCP Conductor",
    role: "Creator, autonomous AI tooling",
    year: "2026",
    summary:
      "One command surface for Unreal Engine automation. Detects connected MCP servers and routes tasks across gameplay, art, animation and production tools.",
    tech: ["AI Agents", "MCP", "TypeScript", "Python", "Unreal Engine 5.8 / 5.6", "Blender"],
    links: [],
    badge: "IN DEV",
    media: "/projects/ue-mcp-routing.svg",
    mediaAlt: "UE MCP Conductor routing a request through connected tools to Unreal Engine 5.8, Unreal Engine 5.6 and Blender",
    mediaCaption: "Routing overview: Conductor selects a connected tool for the target engine or DCC workflow. This is a system diagram, not an application screenshot.",
    problem:
      "No single MCP server covers all of Unreal, and picking the right one per task (and per engine version) by hand is slow and error-prone. One wrong tool call can corrupt a live editor session.",
    approach:
      "A Claude Code skill that auto-detects the connected MCP servers and routes each request to the best tool, version-aware across UE 5.8 and 5.6, with fallback ladders when a server is down and anti-hallucination, production-safety rules on top.",
    result:
      "One command surface over the whole engine: 70+ tools and 23 workflow recipes, turning hours of editor busywork into minutes and driving real day-to-day work.",
  },
  {
    id: "frame-lab",
    title: "Frame Lab",
    role: "Creator, camera direction systems",
    year: "2026",
    summary: "An automatic camera director for Unreal Engine 5.6. Eight fixed cameras follow three walking subjects, checking visibility and facing direction before composing the shot and blending to the next view.",
    seoDescription: "Frame Lab by Aayush (MrVayn): an Unreal Engine 5.6 camera director with visibility scoring, directional look room, blended handoffs and top-view inspection.",
    tech: ["Unreal Engine 5.6", "C++", "Blueprints", "Camera Direction", "Data Assets"],
    links: [
      { label: "Watch showcase", href: "/work/frame-lab#full-tour" },
    ],
    clip: "/projects/frame-lab/v1/preview-12s.mp4",
    fullFilm: {
      src: "/projects/frame-lab/v1/showcase-1080p.mp4",
      label: "Play showcase / 1:20",
      caption: "Recorded from the packaged Unreal Engine 5.6 application. Four continuous takes show Arun, Mira, Dev and the optional T inspection view, with short on-screen explanations. Silent video. Character bases and walking animation are adapted from Quaternius CC0 assets.",
      captions: { src: "/projects/frame-lab/v1/showcase-captions.vtt", label: "English explanations", language: "en" },
    },
    media: "/projects/frame-lab/v1/poster.webp",
    mediaAlt: "Frame Lab top-view inspection showing eight camera positions, three walking paths and the active camera feed",
    mediaCaption: "A 12-second preview of the camera director and optional T inspection view. Open the 1:20 showcase for all three subjects, runtime handoffs and lens details. Character bases and walking animation are adapted from Quaternius CC0 assets.",
    problem: "Choose a clear, front-facing view of a moving subject without moving the camera anchors. Obstacles, changing face angles and other walkers can make a previously good view unsuitable.",
    approach: "Built visibility and facing checks in C++, with a Blueprint scoring policy for eligible cameras and a Data Asset for 27 global tuning parameters. Directional look room adjusts composition, while fixed-view image dissolves preserve continuity between camera selections. A top-down inspection mode exposes the active feed, lens details and candidate scores.",
    result: "A prepared Unreal Engine 5.6 project and packaged Windows application with three animated subjects, eight fixed cameras, subject switching and a live inspection view. The same director and settings work in editor preview and at runtime.",
  },
  { id: "ai-therapist", title: "Virtual AI Therapist", role: "Developer", year: "2023", summary: "A conversational AI prototype combining real-time dialogue, sentiment analysis and retrieval-augmented responses.", media: "/showreel/ai-therapist.webp", tech: ["AI", "LangChain", "RAG", "Prototype"], links: [{ label: "View", href: "https://drive.google.com/file/d/1WV2xYvS9aCd0mrpUbshdrsm8rcOFGNf8/view?usp=drive_link" }] },
  { id: "unreal-horror", title: "Unreal Horror Game", role: "Developer", year: "2023", summary: "An atmospheric horror prototype in Unreal Engine 5.", tech: ["Unreal Engine 5", "Horror"], archive: true, links: [{ label: "Watch", href: "https://drive.google.com/file/d/1X1QuGVAsIcP6mcX-Q5LFw_Sr0XxBt8Xb/view?usp=sharing" }] },
  {
    id: "multiplayer-tba",
    seoDescription: "SAO-X, Aayush (MrVayn)'s multiplayer action RPG in Unreal Engine: GAS combat, dedicated servers, inventory, trading and persistent player data.",
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
    seoDescription: "MagViz by Aayush (MrVayn): interactive Unreal Engine architecture with location hotspots, unit filters, 3D floor plans and furnished walkthroughs.",
    title: "MagViz",
    role: "Creator, Vayn Studios (commercial)",
    year: "2026",
    summary:
      "Turn an architectural model into a project clients and investors can explore. MagViz connects location hotspots, unit availability, size and budget filters, 3D floor plans and furnished walkthroughs for builders, developers and architects.",
    tech: ["Unreal Engine 5.8", "C++", "Interactive ArchViz", "Inventory Integration", "Blueprints", "UMG"],
    links: [{ label: "Watch full tour / 1:59", href: "/work/magviz#full-tour" }],
    badge: "SHIPPED",
    featured: true,
    shipped: true,
    media: "/projects/magviz/v14/poster.jpg",
    clip: "/projects/magviz/v14/preview-40s.mp4",
    fullFilm: {
      src: "/projects/magviz/v14/showcase-1080p.mp4",
      label: "Play full tour / 1:59",
      caption: "FiveStar, the example project inside MagViz. The complete 1:59 tour follows hotspots, normal-speed status and filter steps, 3D plans and a continuous B-400 walkthrough, plus Junior and Presidential suites, daylight, weather and presentation tools. Includes music, UI sound effects and updated scene-description captions.",
      captions: { src: "/projects/magviz/v14/showcase-captions.vtt", label: "Scene descriptions (English)", language: "en" },
    },
    selection: {
      category: "Interactive architecture / Unreal Engine",
      previewLabel: "Play 40s preview",
      caption: "Reserved, Sold, Available. Filter by size and budget, select a unit, explore its 3D plan, then follow a continuous B-400 interior walkthrough. Complete silent 40s preview; the full 1:59 tour includes sound.",
      posterAlt: "MagViz's FiveStar example project, showing a furnished waterfront building, pool and landscaped site",
      facts: [
        { value: "140", label: "Demo units" },
        { value: "5", label: "Location hotspots" },
        { value: "3", label: "Authored suite types" },
      ],
    },
    problem:
      "Static renders and separate unit lists leave clients to connect the architecture with what is available. Builders, developers and architects need a presentation that moves naturally from the whole development to a particular unit and its interior.",
    approach:
      "Built a connected Unreal Engine 5.8 and C++ experience with location hotspots, combined category, area and budget filters, selected-unit information, 3D floor plans and furnished walkthroughs. Daylight, weather and saved views support presentations. An authenticated HTTPS inventory connector reads project information, with a cached offline fallback and a separate management dashboard.",
    result:
      "MagViz brings the building, its spaces and unit information into one interactive presentation. FiveStar demonstrates 140 demo units, five location hotspots and three authored suite types, taking a client from exploring the site to inspecting a unit and walking through its furnished interior.",
    features: [
      { title: "Explore the site", description: "Use five location hotspots or free-camera exploration to guide a presentation around the example development." },
      { title: "Find the right unit", description: "Compare Available, Reserved and Sold states, then combine category, area and budget filters." },
      { title: "From plan to room", description: "Keep the selected unit in context as you open its 3D floor plan and enter a furnished walkthrough. Interiors are authored, with three suite types." },
      { title: "Change the atmosphere", description: "Explore the project with adjustable daylight and weather presets." },
      { title: "Prepare a presentation", description: "Save viewpoints, use location shortcuts and capture high-resolution photos." },
      { title: "Connect project information", description: "Read inventory through an authenticated HTTPS connector, with cached data available as an offline fallback." },
    ],
    note: "FiveStar is an example architectural project with demonstration inventory, not a verified live sales inventory. The film is an edited presentation of the application, not an uncut screen recording.",
    callToAction: { label: "Have a building to present? Let's talk.", href: "/#contact" },
  },
  { id: "sasta-minecraft", title: "Sasta Minecraft", role: "Developer", year: "2023", summary: "A voxel sandbox experiment.", tech: ["Unreal Engine 5", "Systems"], archive: true, links: [{ label: "Watch", href: "https://drive.google.com/file/d/1BkugwIClcTx4aLtK-34aaelw40YbYxDk/view?usp=drive_link" }] },
  { id: "env-design-2", title: "Environment Design", role: "Environment Artist", year: "2023", summary: "Real-time UE5 environment art: two pieces built under tight deadlines.", tech: ["Unreal Engine 5", "Environment"], archive: true, links: [{ label: "View 2.0", href: "https://drive.google.com/file/d/1hwlbVTwMOzlgakO_T6ooHetDxh7mE4JC/view?usp=drive_link" }, { label: "View 1.0", href: "https://drive.google.com/file/d/1Io3zeGNmbGLYUTxSnldVEFKCwFcjmO5p/view?usp=drive_link" }] },
  { id: "techademy", title: "Techademy", role: "Hackathon", year: "2023", summary: "A hackathon build.", tech: ["Game Jam", "Rapid Prototype"], archive: true, links: [{ label: "View", href: "https://drive.google.com/file/d/1acw_QwxZmLBwmQIKrSJf6_nW2ozH77vk/view?usp=sharing" }] },
  { id: "first-target-shooting", title: "First Target Shooting Game", role: "Developer", year: "2022", summary: "An early target/aim shooting prototype.", tech: ["Unreal Engine 5", "Gameplay"], archive: true, links: [{ label: "Watch", href: "https://drive.google.com/file/d/1de3noEKBFLNmfWG58Uw-CHItLTLSuL4S/view?usp=drive_link" }] },
  { id: "cgi-teaser", title: "CGI Animated Teaser", role: "VFX / CGI", year: "2023", summary: "A cinematic CGI teaser produced in UE5.", tech: ["UE5 Cinematics", "Sequencer", "VFX"], archive: true, links: [{ label: "View", href: "https://drive.google.com/drive/folders/1D7sYdJ2a0RIfLjLvWnXD1F4m0ldMqFJW?usp=drive_link" }] },
  { id: "glazer-site", title: "Glazer Games Website", role: "Web Developer", year: "2023", summary: "Production website for Glazer Games.", tech: ["Web", "Frontend"], archive: true, links: [{ label: "Visit", href: "https://www.glazer.games" }], media: "/projects/glazer-site.webp" },
  {
    id: "grannyspot",
    seoDescription: "Grannyspot, a full-stack e-commerce build by Aayush (MrVayn), with Next.js, product catalog, Razorpay checkout and a role-secured admin panel.",
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
    seoDescription: "Couragely, a solo Roblox horror game by Aayush (MrVayn), built in seven days with Luau and refined through live-ops tuning.",
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

const selectedOrder = ["antarya", "multiplayer-tba", "magviz", "cricket-broadcast", "weave-runtime", "studio-relay"];
export const featuredProjects = projects.filter((p) => p.featured).sort((a, b) => {
  const rank = (id: string) => selectedOrder.includes(id) ? selectedOrder.indexOf(id) : selectedOrder.length;
  return rank(a.id) - rank(b.id);
});
export const otherProjects = projects.filter((p) => !p.featured);
export const hasCaseStudy = (project: Project) => Boolean(project.problem && project.approach && project.result);
export const caseStudyProjects = projects.filter(hasCaseStudy);
export const projectPath = (project: Project) => `/work/${project.id}`;

export const projectUi = {
  viewProject: "View project",
  readCaseStudy: "Read case study",
  backToWork: "Back to selected work",
  portfolio: "Portfolio",
  problem: "The problem",
  approach: "The approach",
  result: "The result",
  techStack: "Built with",
  features: "Inside the project",
  playPreview: "Play preview",
  previewUnavailable: "Preview unavailable. Open the full project using the link below.",
} as const;
