import { featuredProjects, otherProjects } from "@/data/projects";
import { SectionShell } from "@/components/ui/SectionShell";
import { ProjectTile } from "@/components/ui/ProjectTile";
import { FeaturedProjects } from "@/components/work/FeaturedProjects";
import { Reveal } from "@/components/motion/Reveal";

export function Work() {
  return (
    <SectionShell id="loadout" eyebrow="Loadout" title="Selected work">
      <FeaturedProjects projects={featuredProjects} />

      <div className="my-12 flex items-center gap-5">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-steel to-transparent" />
        <span className="font-hud text-xs uppercase tracking-[0.3em] text-mist">More builds</span>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-steel to-transparent" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {otherProjects.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 0.06}>
            <ProjectTile project={p} />
          </Reveal>
        ))}
      </div>

      <p className="mt-8 font-mono text-[0.7rem] tracking-wide text-mist/60">
        {/* TODO(MrVayn): add trailer/gif/thumbnail media + case studies per project (Phase 4). */}
        Media &amp; case studies coming online.
      </p>
    </SectionShell>
  );
}
