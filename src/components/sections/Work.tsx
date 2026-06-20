import { featuredProjects, otherProjects } from "@/data/projects";
import { SectionShell } from "@/components/ui/SectionShell";
import { Loadout } from "@/components/work/Loadout";

export function Work() {
  return (
    <SectionShell id="loadout" eyebrow="Loadout" title="Selected work">
      <Loadout featured={featuredProjects} others={otherProjects} />
      <p className="mt-8 font-mono text-[0.7rem] tracking-wide text-mist/60">
        Select any build to view details &amp; media. {/* TODO(MrVayn): add case studies for more projects. */}
      </p>
    </SectionShell>
  );
}
