import { Fragment } from "react";
import { skillGroups } from "@/data/skills";
import { SectionShell } from "@/components/ui/SectionShell";
import { Reveal } from "@/components/motion/Reveal";

/** Skills as a two-column spec sheet: one mono line per group instead of 70 pills. */
export function Skills() {
  return (
    <SectionShell id="skills" title="Skills">
      <div className="grid border-l border-t border-steel/70 md:grid-cols-2">
        {skillGroups.map((group, index) => (
          <Reveal key={group.label}>
            <div data-solid className="h-full border-b border-r border-steel/70 bg-carbon/55 p-6 transition-colors duration-300 hover:bg-bg3/80 sm:p-8">
              <p className="font-mono text-meta-xs text-surge">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 font-display text-lg font-semibold uppercase text-bone sm:text-xl">{group.label}</h3>
              <p className="mt-4 font-mono text-[0.72rem] uppercase leading-[1.9] text-mist">
                {group.items.map((item, k) => (
                  <Fragment key={item}>
                    {k > 0 && <span className="text-steel"> / </span>}
                    <span className="whitespace-nowrap">{item}</span>
                  </Fragment>
                ))}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
