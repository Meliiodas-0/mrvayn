"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";
import { ProjectTile } from "@/components/ui/ProjectTile";
import { ProjectDetail } from "@/components/work/ProjectDetail";
import { Reveal } from "@/components/motion/Reveal";

/** All project tiles open the shared detail panel (BRIEF §3), that's where
 *  media (Drive preview / thumbnail) and the case study live. */
export function Loadout({ featured, others }: { featured: Project[]; others: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        {featured.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08} skew>
            <ProjectTile project={p} featured onSelect={() => setSelected(p)} />
          </Reveal>
        ))}
      </div>

      <div className="my-12 flex items-center gap-5">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-steel to-transparent" />
        <span className="font-hud text-xs uppercase tracking-[0.3em] text-mist">More builds</span>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-steel to-transparent" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 0.06}>
            <ProjectTile project={p} onSelect={() => setSelected(p)} />
          </Reveal>
        ))}
      </div>

      <ProjectDetail project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
