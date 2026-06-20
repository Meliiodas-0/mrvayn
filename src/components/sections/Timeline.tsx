import { experience } from "@/data/experience";
import { SectionShell } from "@/components/ui/SectionShell";
import { Panel } from "@/components/ui/Panel";
import { Reveal } from "@/components/motion/Reveal";

export function Timeline() {
  return (
    <SectionShell id="timeline" eyebrow="Timeline" title="Trajectory">
      <ol className="relative space-y-5 before:absolute before:bottom-2 before:left-[0.6rem] before:top-2 before:w-px before:bg-steel sm:before:left-[0.7rem]">
        {experience.map((e, i) => (
          <Reveal key={`${e.year}-${e.title}`} delay={(i % 4) * 0.05}>
            <li className="relative pl-10 sm:pl-12">
              {/* numbered marker — real sequence, so numbering is legitimate */}
              <span
                aria-hidden
                className="absolute left-0 top-1 grid h-[1.4rem] w-[1.4rem] place-items-center bg-surge font-mono text-[0.65rem] font-bold text-void bevel-sm"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <Panel className="p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-lg font-black uppercase text-bone">{e.title}</h3>
                  <span className="font-mono text-[0.7rem] uppercase tracking-widest text-mist">{e.year}</span>
                </div>
                <p className="mt-0.5 font-hud text-xs uppercase tracking-wide text-surge/80">{e.org}</p>
                <p className="mt-3 font-sans text-sm leading-relaxed text-mist">{e.summary}</p>
              </Panel>
            </li>
          </Reveal>
        ))}
      </ol>
    </SectionShell>
  );
}
