"use client";

import { ArrowUpRight } from "lucide-react";
import { projectUi, type Project } from "@/data/projects";
import { ClipPreview } from "@/components/ui/ClipPreview";
import { ProjectEntryLink } from "@/components/work/ProjectEntryLink";

export function SelectedProject({ project, onSelect }: { project: Project; onSelect: () => void }) {
  const details = project.selection;
  if (!details) return null;
  const primary = project.links[0];
  return (
    <article className={`selected-print selected-print-${project.id}`} id={project.id} aria-labelledby={`${project.id}-title`}>
      <header className="print-heading" data-solid>
        <p className="project-category">{details.category}</p>
        <h3 id={`${project.id}-title`}>{project.displayTitle ?? project.title}</h3>
        <p className="project-role">{project.role}</p>
      </header>
      <figure className="print-media" data-solid>
        {project.clip ? (
          <ClipPreview src={project.clip} poster={project.media} title={project.title} label={details.previewLabel} posterAlt={details.posterAlt} describedBy={`${project.id}-caption`} />
        ) : (
          <ProjectEntryLink project={project} onSelect={onSelect} label={`${details.previewLabel}: ${project.title}`} className="print-image-button">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.media} alt={details.posterAlt} width={1280} height={720} loading="lazy" />
            <span className="image-open" aria-hidden><ArrowUpRight size={25} /></span>
          </ProjectEntryLink>
        )}
        <figcaption id={`${project.id}-caption`} className="media-caption">{details.caption}</figcaption>
      </figure>
      <div className="print-notes" data-solid>
        <p className="project-summary">{project.summary}</p>
        <p className="project-tools">{project.tech.slice(0, 4).join(" / ")}</p>
        <div className="project-actions">
          <ProjectEntryLink project={project} className="folio-link" onSelect={onSelect} label={`${projectUi.viewProject}: ${project.title}`}>{projectUi.viewProject}<ArrowUpRight aria-hidden size={18} /></ProjectEntryLink>
          {primary && <a className="quiet-link" href={primary.href} target="_blank" rel="noopener noreferrer">{primary.label}</a>}
        </div>
      </div>
    </article>
  );
}
