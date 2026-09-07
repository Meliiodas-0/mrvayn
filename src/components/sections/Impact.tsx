import { impactStats } from "@/data/impact";
import { SectionShell } from "@/components/ui/SectionShell";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Impact: the proof-of-work stat wall. Spec-sheet grid of real numbers (studio,
 * funding, showcase, products) with the story behind each. Server-rendered.
 */
export function Impact() {
  return (
    <SectionShell id="impact" title="Proof of work" alt>
      <div className="grid border-l border-t border-steel/70 sm:grid-cols-2 lg:grid-cols-3">
        {impactStats.map((s) => (
          <Reveal fx="pop" key={s.label} className="border-b border-r border-steel/50">
            <div data-solid className="spot-card group relative h-full min-h-[220px] overflow-hidden bg-carbon/70 p-7 transition-colors duration-300 ease-out3 hover:bg-bg3/90 sm:p-8">
              <CountUp
                value={s.value}
                className="font-display font-semibold leading-none text-surge drop-shadow-[0_0_24px_rgb(var(--ion)/0.18)]"
                style={{ fontSize: "clamp(3rem, 5vw, 5.5rem)" }}
              />
              <p className="mt-3 font-mono text-meta uppercase text-volt">{s.label}</p>
              <p className="mt-3 max-w-[30ch] font-sans text-sm leading-relaxed text-mist">{s.context}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 font-mono text-xs text-volt">
        Numbers from shipped products and Magadha Studios, current as of 2026.
      </p>
    </SectionShell>
  );
}
