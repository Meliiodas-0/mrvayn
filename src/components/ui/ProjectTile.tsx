import { ArrowUpRight, Lock } from "lucide-react";
import type { Project } from "@/data/projects";
import { ProjectEntryLink } from "@/components/work/ProjectEntryLink";

export function ProjectTile({ project, onSelect }: { project: Project; onSelect?: () => void }) {
  const inner = (
    <>
      {!project.archive && project.media && (
        <div className={`workshop-image workshop-image-${project.id}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.media} alt={project.mediaAlt ?? `${project.title} preview`} width={640} height={360} loading="lazy" />
        </div>
      )}
      <div className="workshop-title"><h3>{project.title}</h3>{project.locked ? <Lock aria-hidden size={18} /> : <ArrowUpRight aria-hidden size={22} />}</div>
      <p className="workshop-meta">{project.role} / {project.year}</p>
      {!project.archive && <p className="workshop-summary">{project.summary}</p>}
    </>
  );
  if (onSelect) return <ProjectEntryLink project={project} onSelect={onSelect} className={`workshop-project ${project.archive ? "archive-project" : ""}`} label={`${project.title}, view details`}>{inner}</ProjectEntryLink>;
  const primary = project.links[0];
  return primary && !project.locked
    ? <a data-solid className="workshop-project" href={primary.href} target="_blank" rel="noopener noreferrer">{inner}</a>
    : <div data-solid className="workshop-project" aria-disabled>{inner}</div>;
}
