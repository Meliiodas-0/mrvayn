import { Fragment } from "react";
import { skillGroups } from "@/data/skills";
import { SectionShell } from "@/components/ui/SectionShell";
import { Reveal } from "@/components/motion/Reveal";

/** Skills as a two-column spec sheet: one mono line per group instead of 70 pills. */
export function Skills() {
  return (
    <SectionShell id="skills" title="Skills">
      <div className="grid gap-x-12 gap-y-8 border-t border-steel/50 pt-8 md:grid-cols-2">
        {skillGroups.map((group) => (
          <Reveal key={group.label}>
            <div data-solid>
              <h3 className="font-display text-base font-semibold uppercase tracking-wide text-bone sm:text-lg">{group.label}</h3>
              <p className="mt-2 font-mono text-[0.72rem] uppercase leading-relaxed text-mist">
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
