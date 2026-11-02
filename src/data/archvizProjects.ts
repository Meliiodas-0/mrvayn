import type { Project } from "./projects";

export const archvizCopy = {
  title: "ArchViz in Unreal Engine",
  description: "Interactive architecture and coastal renders, built in Unreal Engine.",
  openStudy: "View the renders",
  fullImage: "Open full-resolution image",
  renderDetails: "Render details",
  gallery: "Palm Jumeirah / Aerial render",
  back: "Back to Unreal ArchViz",
  entries: {
    magviz: { title: "FiveStar / MagViz", format: "Interactive walkthrough / Unreal Engine 5.8", action: "Explore FiveStar" },
    "marina-terrace": { title: "Marina Terrace & Palm Jumeirah / Renders", format: "Unreal Engine 5.8 / Path Tracer / Movie Render Queue", action: "View the renders" },
  } as Record<string, { title: string; format: string; action: string }>,
};

export const archvizStudies: Project[] = [
  {
    id: "marina-terrace",
    title: "Marina Terrace & Palm Jumeirah - Renders",
    displayTitle: "Marina Terrace & Palm Jumeirah",
    collection: "archviz",
    role: "Architectural visualization renders",
    year: "2026",
    summary: "Two waterfront environments rendered in Unreal Engine 5.8: a sunset terrace with a curved pool and layered skyline, and a panoramic aerial of Palm Jumeirah's islands, residences and resorts.",
    seoDescription: "Marina Terrace and Palm Jumeirah by Aayush (MrVayn): native 3D Unreal Engine 5.8 architectural renders using Path Tracer and Movie Render Queue.",
    tech: ["Unreal Engine 5.8", "Native 3D", "Path Tracer", "Movie Render Queue"],
    media: "/projects/archviz/marina-terrace/cover.webp",
    mediaSrcSet: "/projects/archviz/marina-terrace/cover-800.webp 800w, /projects/archviz/marina-terrace/cover-1600.webp 1600w, /projects/archviz/marina-terrace/cover.webp 3840w",
    mediaWidth: 3840,
    mediaHeight: 2160,
    mediaAlt: "A curved pool on a stone waterfront terrace overlooking boats and a layered skyline at sunset",
    mediaCaption: "Sunset render. Native full 3D, rendered in Unreal Engine 5.8 with Path Tracer at 1,024 samples.",
    links: [{ label: "Open original 4K render", href: "/projects/archviz/marina-terrace/original.png" }],
    studyDetails: [
      { label: "Scene", value: "Marina Terrace, sunset" },
      { label: "Rendering", value: "Unreal Engine 5.8 / native full 3D / Path Tracer / 1,024 samples" },
      { label: "Resolution", value: "3840 × 2160 / 4K / 16:9" },
      { label: "Captured", value: "29 October 2026, 22:17:44 to 22:21:00 IST" },
    ],
    gallery: [{
      src: "/projects/archviz/palm-jumeirah/cover.webp",
      original: "/projects/archviz/palm-jumeirah/original.png",
      srcSet: "/projects/archviz/palm-jumeirah/cover-800.webp 800w, /projects/archviz/palm-jumeirah/cover-1600.webp 1600w, /projects/archviz/palm-jumeirah/cover.webp 2560w",
      alt: "A panoramic aerial view of palm-shaped islands, waterfront residences and resorts against a Dubai-inspired skyline",
      caption: "Palm Jumeirah aerial render. Native full 3D, Unreal Engine 5.8 Movie Render Queue. 2560 × 1046 panoramic, captured 22 October 2026, 02:21:35 to 02:21:52 IST.",
      width: 2560,
      height: 1046,
    }],
  },
];
