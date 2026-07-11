// Proof-of-work content: the credibility ticker, the Field Record stat wall, and the
// audience-segmented comms CTAs. Every number here is real (resume + live product data);
// update them here and the UI follows. NOTE: site copy never uses em dashes.

import { profile } from "./profile";

/** Slim credibility marquee under the hero. Short, loud, factual. */
export const proofChips: string[] = [
  "CTO, Magadha Studios (20-person team)",
  "Antarya showcased at IGDC 2025",
  "First funding round closed",
  "Couragely: 638K impressions in 14 days",
  "3 products live right now",
  "UE5 + full-stack + AI",
];

export interface ImpactStat {
  value: string;
  label: string;
  context: string;
}

/** Field Record: investor-grade numbers with the story behind each. */
export const impactStats: ImpactStat[] = [
  { value: "20", label: "Person studio", context: "Lead engineering as CTO at Magadha Studios." },
  { value: "1st", label: "Funding round closed", context: "Raised for Antarya, our flagship title." },
  { value: "IGDC", label: "2025 showcase", context: "Antarya demoed on India's biggest game-dev stage." },
  { value: "7", label: "Days to ship", context: "Couragely went from empty project to live on Roblox." },
  { value: "638K", label: "Impressions in 14 days", context: "Couragely's launch fortnight, 12.2K visits, 9.4K plays." },
  { value: "3", label: "Products live", context: "A Roblox title, an e-commerce store, a studio site, all in production." },
];

export interface AudienceCta {
  audience: string;
  pitch: string;
  action: string;
  href: string;
  primary?: boolean;
}

/** Segmented CTAs: recruiters, investors, and builders each get a direct next step. */
export const audienceCtas: AudienceCta[] = [
  {
    audience: "Studios & teams",
    pitch: "UE5 gameplay, netcode, cinematics, or full-stack product work. Roles and contracts.",
    action: "Hire me",
    href: profile.emailHref + "&su=" + encodeURIComponent("Hiring: MrVayn"),
    primary: true,
  },
  {
    audience: "Investors & publishers",
    pitch: "Magadha Studios: 20 people, first round closed, Antarya shown at IGDC 2025.",
    action: "Talk Antarya",
    href: profile.emailHref + "&su=" + encodeURIComponent("Antarya / Magadha Studios inquiry"),
  },
  {
    audience: "Builders & players",
    pitch: "Dev logs, trailers, and behind the scenes from every build.",
    action: "Follow the build",
    href: "https://www.youtube.com/@vaynverse",
  },
];
