import { skillGroups } from "@/data/skills";
import { SectionShell } from "@/components/ui/SectionShell";
import { Reveal } from "@/components/motion/Reveal";

export function Skills() {
  return (
    <SectionShell id="arsenal" eyebrow="Arsenal" title="Tech stack">
      <div className="border-t border-steel/60">
        {skillGroups.map((group, i) => (
          <Reveal key={group.label} delay={(i % 4) * 0.05}>
            <div className="grid items-start gap-x-10 gap-y-3 border-b border-steel/60 py-6 transition-colors hover:bg-steel/[0.06] sm:grid-cols-[minmax(0,15rem)_1fr] sm:py-7">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs tabular-nums text-surge/80">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-base font-black uppercase tracking-wide text-bone sm:text-lg">{group.label}</h3>
              </div>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="bevel-sm border border-steel/70 bg-carbon/60 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-wide text-mist transition-colors hover:border-surge/50 hover:text-bone"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
