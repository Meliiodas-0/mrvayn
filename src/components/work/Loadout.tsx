"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";
import { ProjectTile } from "@/components/ui/ProjectTile";
import { ProjectDetail } from "@/components/work/ProjectDetail";
import { ProjectSpotlight } from "@/components/work/ProjectSpotlight";
import { SelectedProject } from "@/components/work/SelectedProject";
import { Reveal } from "@/components/motion/Reveal";

/** Selected builds have full-frame previews and a shared case-study dialog.
 * Current experiments form a compact media grid, with older prototypes folded away. */
export function Loadout({ featured, others }: { featured: Project[]; others: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const leadProjects = featured.filter((p) => p.spotlight);
  const featuredGrid = featured.filter((p) => !p.spotlight);
  const spotlight = others.filter((p) => !p.archive);
  const archive = others.filter((p) => p.archive);
  const selectProject = (project: Project) => {
    document.dispatchEvent(new Event("portfolio:pause-previews"));
    setSelected(project);
  };

  return (
    <>
      {leadProjects.map((p) => (
        <Reveal key={p.id} fx="up" className="mb-8">
          <ProjectSpotlight project={p} onSelect={() => selectProject(p)} />
        </Reveal>
      ))}
      <div className="grid gap-8">
        {featuredGrid.map((p, i) => (
          <Reveal key={p.id} fx="up">
            <SelectedProject project={p} reverse={i % 2 === 0} onSelect={() => selectProject(p)} />
          </Reveal>
        ))}
      </div>

      <div className="my-14 flex items-center gap-5 border-t border-steel/80 pt-0">
        {/* solid section ground so the rule is masked behind the label, not drawn through it */}
        <span className="-translate-y-1/2 pr-2 font-mono text-meta uppercase text-volt" style={{ backgroundColor: "rgb(var(--void))" }}>
          More builds
        </span>
      </div>

      <div className="dim-grid grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {spotlight.map((p) => (
          <Reveal fx="up" key={p.id}>
            <ProjectTile project={p} onSelect={() => selectProject(p)} />
          </Reveal>
        ))}
      </div>

      {archive.length > 0 && (
        // <details>, not state: the tiles exist in the DOM from the start, so ScrollFx
        // reveals them when opened and they stay reachable without JS.
        <details className="group mt-8">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded border border-steel bg-carbon/80 px-4 py-2 font-mono text-meta uppercase text-mist transition-colors hover:border-surge/50 hover:bg-bg3 hover:text-bone">
            <span aria-hidden className="text-surge transition-transform group-open:rotate-90">›</span>
            Earlier builds ({archive.length})
          </summary>
          <div className="dim-grid mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archive.map((p) => (
              <Reveal fx="up" key={p.id}>
                <ProjectTile project={p} onSelect={() => selectProject(p)} />
              </Reveal>
            ))}
          </div>
        </details>
      )}

      <ProjectDetail project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
