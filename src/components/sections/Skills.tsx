import { skillGroups } from "@/data/skills";
import { editorial } from "@/data/editorial";
import { SectionShell } from "@/components/ui/SectionShell";

export function Skills() {
  return (
    <SectionShell id="skills" title={editorial.skillsTitle}>
      <div className="skill-list">
        {skillGroups.map(group => (
          <div data-solid className="skill-row" key={group.label}>
            <h3>{group.label}</h3>
            <p>{group.items.join(" / ")}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
