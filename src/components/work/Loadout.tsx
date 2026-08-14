"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";
import { reelFrames } from "@/data/showreel";
import { ProjectTile } from "@/components/ui/ProjectTile";
import { ProjectDetail } from "@/components/work/ProjectDetail";
import { Reveal } from "@/components/motion/Reveal";

/** All project tiles open the shared detail panel (BRIEF §3), that's where
 *  media (Drive preview / thumbnail) and the case study live. */
export function Loadout({ featured, others }: { featured: Project[]; others: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      {/* v3 asymmetry: featured items span 7 and 5 columns, alternating; a lone
          trailing tile (odd count) spans the full row so nothing is left dangling. */}
      <div className="grid gap-6 lg:grid-cols-12">
        {featured.map((p, i) => {
          const lastOdd = i === featured.length - 1 && featured.length % 2 === 1;
          const span = lastOdd ? "lg:col-span-12" : i % 2 === 0 ? "lg:col-span-7" : "lg:col-span-5";
          return (
            <Reveal key={p.id} delay={i * 0.06} fx="up" className={span}>
              <div className="h-full">
                <ProjectTile project={p} featured onSelect={() => setSelected(p)} />
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="my-12 flex items-center gap-5 border-t border-steel pt-0">
        {/* concrete section ground (matches SectionShell) so the border rule is masked behind the label, not drawn through it */}
        <span className="-translate-y-1/2 pr-2 font-mono text-[0.8125rem] uppercase text-volt" style={{ backgroundColor: "rgb(var(--void) / 0.86)" }}>More builds</span>
      </div>

      <div className="dim-grid grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
        {others.map((p, i) => (
          <Reveal fx="up" key={p.id} delay={(i % 4) * 0.07}>
            {/* Faded showreel still behind each tile (projects without a frame just stay flat). */}
            <ProjectTile project={p} bg={reelFrames.find((f) => f.id === p.id)?.img ?? null} onSelect={() => setSelected(p)} />
          </Reveal>
        ))}
      </div>

      <ProjectDetail project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
