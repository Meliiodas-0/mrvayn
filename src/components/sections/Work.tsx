import { featuredProjects, otherProjects } from "@/data/projects";
import { editorial } from "@/data/editorial";
import { SectionShell } from "@/components/ui/SectionShell";
import { Loadout } from "@/components/work/Loadout";

export function Work() {
  return (
    <SectionShell id="work" title={editorial.workTitle}>
      <p className="work-intro">{editorial.workIntro}</p>
      <Loadout featured={featuredProjects} others={otherProjects} />
    </SectionShell>
  );
}
