import { skillGroups } from "@/data/skills";
import { SectionShell } from "@/components/ui/SectionShell";
import { Panel } from "@/components/ui/Panel";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/motion/Reveal";

export function Skills() {
  return (
    <SectionShell id="arsenal" eyebrow="Arsenal" title="Tech stack">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <Reveal key={group.label} delay={(i % 3) * 0.06}>
            <Panel className="h-full p-5">
              <h3 className="font-hud text-xs uppercase tracking-[0.22em] text-surge">{group.label}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </Panel>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
