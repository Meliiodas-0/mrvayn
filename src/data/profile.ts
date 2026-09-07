// Central profile content. Edit here, the UI reads from this file.

export const profile = {
  name: "MrVayn",
  role: "Unreal Engine & Full-Stack Developer",
  // One-line role for the phone hero pill (the full title wraps at 375px).
  roleShort: "UE5 & Full-Stack Developer",

  // One-line thesis (hero). Identity first, credentials as facts.
  thesis:
    "I build gameplay systems, Niagara VFX and multiplayer in Unreal Engine 5, and ship full-stack products. CTO at Magadha Studios, a funded 20-person team building Antarya, shown at IGDC 2025.",

  // The operator file, drawn from both resumes (game dev + SDE + AI).
  about:
    "I'm MrVayn, a game and software developer with 4+ years across Unreal Engine 5, real-time CGI/VFX, and full-stack web. As CTO of a 20-person studio I build data-driven gameplay frameworks, multiplayer systems, and production pipelines in UE5 with C++ and Blueprints, and ship full-stack apps with Next.js, TypeScript, and Postgres, plus LangChain/RAG AI features. On the side I am expanding a fantasy MMORPG that is already playable, built on server architecture and a combat framework I wrote from scratch. Showed a demo at IGDC 2025 and closed the studio's first round of funding. My competitive-esports roots sharpened how I think about audience, retention, and feel.",

  // Hero readout: three facts that do not repeat the About copy or the Impact wall.
  specialties: [
    { value: "CTO", label: "Magadha Studios" },
    { value: "IGDC", label: "2025 showcase" },
    { value: "4+", label: "Years in UE5" },
  ],

  // Core disciplines, used by the About section's second container.
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
  emailHref: "mailto:aayush007work@gmail.com?subject=Project%20inquiry",
  availability: "Open for studio & contract work",

  // Set to "/MrVayn-CV.pdf" once the PDF is in public/; the Contact panel shows a
  // Download CV button only when this is non-null.
  resumeHref: null as string | null,
} as const;
