"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";
import { ProjectTile } from "@/components/ui/ProjectTile";
import { ProjectDetail } from "@/components/work/ProjectDetail";
import { Reveal } from "@/components/motion/Reveal";

/** Featured tiles that open the agent-detail panel on select. */
export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08} skew>
            <ProjectTile project={p} featured onSelect={() => setSelected(p)} />
          </Reveal>
        ))}
      </div>
      <ProjectDetail project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
