import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { caseStudyProjects, projectPath, projectUi } from "@/data/projects";
import { site, serializeStructuredData } from "@/data/site";
import { ClipPreview } from "@/components/ui/ClipPreview";
import { StickCursor } from "@/components/StickCursor";
import "./project.css";

type Props = { params: { slug: string } };
export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudyProjects.map(project => ({ slug: project.id }));
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const project = caseStudyProjects.find(item => item.id === params.slug);
  if (!project) notFound();
  const inherited = await parent;
  const title = `${project.title} | ${site.name}`;
  const description = project.seoDescription ?? project.summary;
  return {
    title: project.title,
    description,
    alternates: { canonical: projectPath(project) },
    openGraph: { ...inherited.openGraph, type: "website", title, description, url: `${site.url}${projectPath(project)}` },
    twitter: { card: "summary_large_image", title, description, images: inherited.twitter?.images ?? undefined },
  };
}

export default function ProjectPage({ params }: Props) {
  const project = caseStudyProjects.find(item => item.id === params.slug);
  if (!project) notFound();
  const caption = project.mediaCaption ?? project.selection?.caption;
  const alt = project.mediaAlt ?? project.selection?.posterAlt ?? `${project.title} preview`;
  const url = `${site.url}${projectPath(project)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage", "@id": `${url}#page`, url, name: project.title,
        description: project.seoDescription ?? project.summary,
        isPartOf: { "@id": `${site.url}/#website` },
        mainEntity: { "@id": `${url}#project` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "CreativeWork", "@id": `${url}#project`, name: project.title,
        description: project.summary, url, inLanguage: "en",
        ...(project.media ? { image: `${site.url}${project.media}` } : {}),
        contributor: { "@id": `${site.url}/#person` },
        keywords: project.tech,
      },
      {
        "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: projectUi.portfolio, item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: project.title, item: url },
        ],
      },
    ],
  };
  return (
    <div className="portfolio-theme case-page">
      <StickCursor />
      <a href="#case-content" className="case-skip">Skip to content</a>
      <header className="case-masthead" data-solid>
        <a className="case-brand" href="/#hero" aria-label={`${site.name}, home`}>{site.name}</a>
        <a className="quiet-link" href="/#work"><ArrowLeft aria-hidden size={18} />{projectUi.backToWork}</a>
      </header>
      <main id="case-content">
        <article>
          <header className="case-heading" data-solid>
            <p className="case-role">{project.role} / {project.year}</p>
            <h1>{project.title}</h1>
            <p className="case-intro">{project.summary}</p>
          </header>
          {project.media && (
            <figure className="case-media" data-solid>
              {project.clip ? (
                <ClipPreview src={project.clip} poster={project.media} title={project.title} label={project.selection?.previewLabel} posterAlt={alt} describedBy={caption ? "case-caption" : undefined} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.media} alt={alt} width={1440} height={810} fetchPriority="high" />
              )}
              {caption && <figcaption id="case-caption">{caption}</figcaption>}
            </figure>
          )}
          {project.links.length > 0 && <div className="case-links" data-solid>{project.links.map(link => (
            <a className="folio-link" key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<ArrowUpRight aria-hidden size={18} /></a>
          ))}</div>}
          <div className="case-body" data-solid>
            {[[projectUi.problem, project.problem], [projectUi.approach, project.approach], [projectUi.result, project.result]].map(([label, value]) => (
              <section key={label}><h2>{label}</h2><p>{value}</p></section>
            ))}
            <section className="case-tech"><h2>{projectUi.techStack}</h2><ul>{project.tech.map(tech => <li key={tech}>{tech}</li>)}</ul></section>
          </div>
        </article>
      </main>
      <footer className="case-footer" data-solid><a className="folio-link" href="/#work"><ArrowLeft aria-hidden size={18} />{projectUi.backToWork}</a><span>{site.name}</span></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(structuredData) }} />
    </div>
  );
}
