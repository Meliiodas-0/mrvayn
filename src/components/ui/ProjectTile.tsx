import { ArrowUpRight, Lock } from "lucide-react";
import type { Project } from "@/data/projects";

export function ProjectTile({ project, onSelect }: { project: Project; onSelect?: () => void }) {
  const inner = (
    <>
      {!project.archive && project.media && (
        <div className="workshop-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.media} alt={`${project.title} preview`} width={640} height={360} loading="lazy" />
        </div>
      )}
      <div className="workshop-title"><h3>{project.title}</h3>{project.locked ? <Lock aria-hidden size={18} /> : <ArrowUpRight aria-hidden size={22} />}</div>
      <p className="workshop-meta">{project.role} / {project.year}</p>
      {!project.archive && <p className="workshop-summary">{project.summary}</p>}
    </>
  );
  if (onSelect) return <button data-solid onClick={onSelect} className={`workshop-project ${project.archive ? "archive-project" : ""}`} aria-label={`${project.title}, view details`}>{inner}</button>;
  const primary = project.links[0];
  return primary && !project.locked
    ? <a data-solid className="workshop-project" href={primary.href} target="_blank" rel="noopener noreferrer">{inner}</a>
    : <div data-solid className="workshop-project" aria-disabled>{inner}</div>;
}
