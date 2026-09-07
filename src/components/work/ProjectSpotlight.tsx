"use client";

import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { ClipPreview } from "@/components/ui/ClipPreview";

export function ProjectSpotlight({ project, onSelect }: { project: Project; onSelect: () => void }) {
  const detail = project.spotlight;
  if (!detail) return null;
  const primary = project.links[0];
  return (
    <article className="screening-project" id={project.id} aria-labelledby={`${project.id}-title`}>
      <header className="screening-heading" data-solid>
        <div><p className="project-category">{detail.label}</p><h3 id={`${project.id}-title`}>{project.title}</h3></div>
        <p className="screening-edition"><span>{project.badge}</span><span>{project.year}</span></p>
      </header>
      <div className="screening-media" data-solid>
        {project.clip && <ClipPreview src={project.clip} poster={project.media} title={project.title} label={detail.previewLabel} posterAlt={detail.posterAlt} describedBy={`${project.id}-caption`} />}
      </div>
      <div className="screening-notes" data-solid>
        <div>
          <p className="project-role">{project.role}</p>
          <p className="project-summary">{project.summary}</p>
          <div className="project-actions">
            {primary && <a className="folio-link" href={primary.href} target="_blank" rel="noopener noreferrer">{primary.label}<ArrowUpRight aria-hidden size={18} /></a>}
            <button className="quiet-link" onClick={onSelect}>{detail.detailLabel}</button>
          </div>
        </div>
        <div className="screening-aside">
          <dl className="film-facts">{detail.facts.map(fact => <div key={fact.label}><dd>{fact.value}</dd><dt>{fact.label}</dt></div>)}</dl>
          <p id={`${project.id}-caption`} className="media-caption">{detail.previewCaption}</p>
        </div>
      </div>
    </article>
  );
}
