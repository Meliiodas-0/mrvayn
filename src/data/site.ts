import { socials } from "./socials";

// The deployment redirects the apex domain to www. Keep all discovery signals
// on that final origin, including when rendering a local or preview build.
export const site = {
  url: "https://www.mrvayn.live",
  name: "MrVayn",
  personName: "Aayush",
  title: "Aayush (MrVayn) | Unreal Engine & Full-Stack Developer",
  description: "Aayush (MrVayn), Unreal Engine and full-stack developer. Explore multiplayer games, camera systems, architectural visualization, AI tools and web products.",
} as const;

export const identityStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.personName,
      alternateName: site.name,
      url: `${site.url}/`,
      jobTitle: "Unreal Engine & Full-Stack Developer",
      description: site.description,
      knowsAbout: ["Unreal Engine", "C++", "Gameplay Systems", "Multiplayer", "Camera Systems", "Architectural Visualization", "Niagara VFX", "Next.js", "TypeScript", "AI Tooling"],
      sameAs: socials.flatMap((social) => social.href ? [social.href] : []),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.name,
      alternateName: "Aayush (MrVayn) Portfolio",
      url: `${site.url}/`,
      publisher: { "@id": `${site.url}/#person` },
      inLanguage: "en",
    },
  ],
};

export const serializeStructuredData = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
