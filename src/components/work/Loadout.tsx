"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";
import { editorial } from "@/data/editorial";
import { ProjectTile } from "@/components/ui/ProjectTile";
import { ProjectDetail } from "@/components/work/ProjectDetail";
import { ProjectSpotlight } from "@/components/work/ProjectSpotlight";
import { SelectedProject } from "@/components/work/SelectedProject";

export function Loadout({ featured, others }: { featured: Project[]; others: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const leadProjects = featured.filter(p => p.spotlight);
  const selectedProjects = featured.filter(p => !p.spotlight);
  const more = others.filter(p => !p.archive);
  const archive = others.filter(p => p.archive);
  const selectProject = (project: Project) => {
    document.dispatchEvent(new Event("portfolio:pause-previews"));
    setSelected(project);
  };
  return (
    <>
      {leadProjects.map(p => <ProjectSpotlight key={p.id} project={p} onSelect={() => selectProject(p)} />)}
      <div className="selected-spreads">
        {selectedProjects.map(p => <SelectedProject key={p.id} project={p} onSelect={() => selectProject(p)} />)}
      </div>
      <div className="workshop-heading"><h3>{editorial.moreTitle}</h3><span>{more.length} projects</span></div>
      <div className="workshop-grid">
        {more.map(p => <ProjectTile key={p.id} project={p} onSelect={() => selectProject(p)} />)}
      </div>
      {archive.length > 0 && (
        <details className="work-archive">
          <summary>{editorial.archiveTitle}<span>{archive.length}<span className="archive-plus" aria-hidden>+</span></span></summary>
          <div className="archive-list">{archive.map(p => <ProjectTile key={p.id} project={p} onSelect={() => selectProject(p)} />)}</div>
        </details>
      )}
      <ProjectDetail project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
