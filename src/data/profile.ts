// Central profile content. Edit here — the UI reads from this file.
// TODO(MrVayn): review the thesis + about copy; both are drafted from your bio.

export const profile = {
  name: "MrVayn",
  role: "Founder & Game Developer",

  // One-line thesis (hero). Keep it sharp.
  thesis:
    "I build AAA-caliber game feel — Unreal Engine systems, Niagara VFX, and multiplayer that ships.",

  // ~70-word operator file. Drafted from the current site's bio.
  about:
    "I'm MrVayn — a founder and game developer building next-gen experiences since 2019. I work across Unreal Engine 5 gameplay frameworks, Niagara VFX, cutscenes, and multiplayer-ready systems, with a focus on performance, clarity, and shipping. My foundation in competitive esports sharpened how I think about audience, retention, and feel — and now I build the experiences I once competed in.",

  // Operator-file stat blocks — punchy quantitative stats (the Arsenal section
  // covers the full tech list, so these stay short and don't duplicate it).
  // TODO(MrVayn): confirm these numbers.
  specialties: [
    { value: "6+", label: "Years building" },
    { value: "UE5", label: "Primary engine" },
    { value: "14+", label: "Builds & prototypes" },
    { value: "IGDC", label: "Showcased 2025" },
  ],

  // Contact
  email: "aayush007work@gmail.com",
  emailHref: "https://mail.google.com/mail/?view=cm&fs=1&to=aayush007work@gmail.com",
  availability: "Open to studio collaborations & contract work.",

  // TODO(MrVayn): add a CV/resume link if you want a "Download CV" action.
  resumeHref: null as string | null,
} as const;
