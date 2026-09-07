import { featuredProjects, otherProjects } from "@/data/projects";
import { SectionShell } from "@/components/ui/SectionShell";
import { Loadout } from "@/components/work/Loadout";

export function Work() {
  return (
    // labelsBelow: the section above is the red Showreel band, so the label hangs
    // under the rule instead of notching the red.
    <SectionShell id="work" title="Selected work" labelsBelow>
      <Loadout featured={featuredProjects} others={otherProjects} />
      <p className="mt-8 font-mono text-xs text-volt">Select any build to view details and media.</p>
    </SectionShell>
  );
}
