// Career timeline (real sequence — numbered markers are legitimate here).

export interface TimelineEntry {
  year: string;
  title: string;
  org: string;
  summary: string;
  kind: "work" | "milestone";
}

export const experience: TimelineEntry[] = [
  {
    year: "2024 — Present",
    title: "Co-Founder & CTO",
    org: "Magadha Studios",
    summary:
      "Leading core tech and the production pipeline — a reusable, data-driven gameplay framework for rapid iteration and scale. Showcased Antarya at IGDC 2025.",
    kind: "work",
  },
  {
    year: "2025",
    title: "Roblox Launch — Couragely",
    org: "Independent",
    summary:
      "Built and shipped a Roblox horror game in 7 days; 12.2K visits and 638K+ impressions within two weeks.",
    kind: "milestone",
  },
  {
    year: "2023 — 2024",
    title: "Software Developer",
    org: "Glazer Games India Pvt. Ltd.",
    summary:
      "Web development plus UE5 CGI/VFX for teasers and trailers; managed content, GFX, and VFX delivery.",
    kind: "work",
  },
  {
    year: "2023",
    title: "Unreal Engine Developer",
    org: "Norian Games",
    summary:
      "Optimized environments and developed water systems in UE5; collaborated remotely to deliver production-ready visuals.",
    kind: "work",
  },
  {
    year: "2023",
    title: "Environmental Designer",
    org: "Hidden Beyond — Yellow Whale Labs",
    summary:
      "Designed immersive UE5 environments under tight deadlines during college, focused on quality and clean delivery.",
    kind: "work",
  },
  {
    year: "2019 — 2020",
    title: "Esports Leadership",
    org: "TeamIND · Godlike · 7Seas · TeamXO · Entity",
    summary:
      "Leadership and management across top orgs — a deep, practical understanding of audience, community, and retention.",
    kind: "milestone",
  },
];
