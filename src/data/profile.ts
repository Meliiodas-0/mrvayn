// Central profile content. Edit here, the UI reads from this file.
// TODO(MrVayn): review the thesis + about copy; both are drafted from your bio.

export const profile = {
  name: "MrVayn",
  role: "Unreal Engine & Full-Stack Developer",

  // One-line thesis (hero). Keep it sharp.
  thesis:
    "I build AAA-caliber game feel in Unreal Engine 5: gameplay systems, Niagara VFX, and multiplayer that ships, plus full-stack web apps with Next.js, TypeScript, React, Tailwind, and Postgres.",

  // ~70-word operator file, drawn from both résumés (game dev + SDE + AI).
  about:
    "I'm MrVayn, a game and software developer with 4+ years across Unreal Engine 5, real-time CGI/VFX, and full-stack web. As CTO of a 20-person studio I build data-driven gameplay frameworks, multiplayer systems, and production pipelines in UE5 with C++ and Blueprints, and ship full-stack apps with Next.js, TypeScript, and Postgres, plus LangChain/RAG AI features. Showed a demo at IGDC 2025 and closed the studio's first round of funding. My competitive-esports roots sharpened how I think about audience, retention, and feel.",

  // Operator-file stat blocks, punchy quantitative stats (the Arsenal section
  // covers the full tech list, so these stay short and don't duplicate it).
  // TODO(MrVayn): confirm these numbers.
  specialties: [
    { value: "6+", label: "Years building" },
    { value: "UE5", label: "Primary engine" },
    { value: "14+", label: "Builds & prototypes" },
    { value: "IGDC", label: "Showcased 2025" },
  ],

  // Core disciplines, used by the About section's second container.
  // Intentionally NOT the hero stats (6+/UE5/14+/IGDC) so nothing repeats.
  // Spans both résumés: UE5 game dev + full-stack web + AI.
  capabilities: [
    "UE5 gameplay systems & frameworks",
    "Multiplayer & server architecture",
    "Niagara VFX, Sequencer & cinematics",
    "Rigging, Control Rig & IK pipelines",
    "Full-stack web: Next.js · TypeScript",
    "Backend & cloud: Node · Postgres · Supabase",
    "LangChain · RAG · AI agents",
    "C++ · Python · system design",
  ],

  // Contact
  email: "aayush007work@gmail.com",
  emailHref: "https://mail.google.com/mail/?view=cm&fs=1&to=aayush007work@gmail.com",
  availability: "Open to studio collaborations & contract work.",

  // TODO(MrVayn): add a CV/resume link if you want a "Download CV" action.
  resumeHref: null as string | null,
} as const;
