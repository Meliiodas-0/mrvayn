import { impactStats } from "@/data/impact";
import { SectionShell } from "@/components/ui/SectionShell";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Field Record: the proof-of-work stat wall. Spec-sheet grid of real numbers
 * (studio, funding, showcase, launch metrics) with the story behind each, so
 * recruiters and investors get the signal without digging. Server-rendered.
 */
export function Impact() {
  return (
    <SectionShell id="record" eyebrow="Impact" title="Proof of work" index="03" alt>
      <div className="grid border-l border-t border-steel/70 sm:grid-cols-2 lg:grid-cols-3">
        {impactStats.map((s, i) => (
          <Reveal fx="pop" key={s.label} delay={(i % 3) * 0.07} className="border-b border-r border-steel/70">
            <div className="spot-card group relative h-full overflow-hidden bg-carbon/80 p-6 transition-colors duration-200 ease-snap hover:bg-bg3/80 sm:p-7">
              <CountUp
                value={s.value}
                className="font-display font-semibold leading-none text-bone transition-colors duration-200 group-hover:text-surge"
                style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)" }}
              />
              <p className="mt-3 font-mono text-[0.8125rem] uppercase text-volt">{s.label}</p>
              <p className="mt-2 max-w-[26ch] font-sans text-sm leading-relaxed text-mist">{s.context}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 font-mono text-[0.7rem] tracking-wide text-mist/60">
        Numbers from shipped products and Magadha Studios, current as of 2026.
      </p>
    </SectionShell>
  );
}
