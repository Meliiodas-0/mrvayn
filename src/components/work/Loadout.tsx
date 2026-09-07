"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";
import { ProjectTile } from "@/components/ui/ProjectTile";
import { ProjectDetail } from "@/components/work/ProjectDetail";
import { Reveal } from "@/components/motion/Reveal";

/** All project tiles open the shared detail panel; that is where media and the
 *  case study live. Featured builds get the asymmetric 7/5 grid; the compact grid
 *  shows the current builds and folds the earlier prototypes away. */
export function Loadout({ featured, others }: { featured: Project[]; others: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const spotlight = others.filter((p) => !p.archive);
  const archive = others.filter((p) => p.archive);

  return (
    <>
      {/* asymmetry: featured items span 7 and 5 columns, alternating; a lone trailing
          tile (odd count) becomes a full-row media-left / copy-right card */}
      <div className="grid gap-6 lg:grid-cols-12">
        {featured.map((p, i) => {
          const lastOdd = i === featured.length - 1 && featured.length % 2 === 1;
          const span = lastOdd ? "lg:col-span-12" : i % 2 === 0 ? "lg:col-span-7" : "lg:col-span-5";
          return (
            <Reveal key={p.id} fx="up" className={span}>
              <div className="h-full">
                <ProjectTile project={p} featured wide={lastOdd} onSelect={() => setSelected(p)} />
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="my-12 flex items-center gap-5 border-t border-steel pt-0">
        {/* solid section ground so the rule is masked behind the label, not drawn through it */}
        <span className="-translate-y-1/2 pr-2 font-mono text-meta uppercase text-volt" style={{ backgroundColor: "rgb(var(--void))" }}>
          More builds
        </span>
      </div>

      <div className="dim-grid grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
        {spotlight.map((p) => (
          <Reveal fx="up" key={p.id}>
            <ProjectTile project={p} onSelect={() => setSelected(p)} />
          </Reveal>
        ))}
      </div>

      {archive.length > 0 && (
        // <details>, not state: the tiles exist in the DOM from the start, so ScrollFx
        // reveals them when opened and they stay reachable without JS.
        <details className="group mt-8">
          <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded border border-steel bg-white/40 px-3 py-2 font-mono text-meta uppercase text-mist transition-colors hover:border-surge/50 hover:text-bone">
            <span aria-hidden className="text-surge transition-transform group-open:rotate-90">›</span>
            Earlier builds ({archive.length})
          </summary>
          <div className="dim-grid mt-4 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
            {archive.map((p) => (
              <Reveal fx="up" key={p.id}>
                <ProjectTile project={p} onSelect={() => setSelected(p)} />
              </Reveal>
            ))}
          </div>
        </details>
      )}

      <ProjectDetail project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
