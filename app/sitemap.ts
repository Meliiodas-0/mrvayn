import type { MetadataRoute } from "next";
import { caseStudyProjects, projectPath } from "@/data/projects";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/` },
    ...caseStudyProjects.map(project => ({ url: `${site.url}${projectPath(project)}` })),
  ];
}
