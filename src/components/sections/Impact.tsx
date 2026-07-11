import { impactStats } from "@/data/impact";
import { SectionShell } from "@/components/ui/SectionShell";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Field Record: the proof-of-work stat wall. Spec-sheet grid of real numbers
 * (studio, funding, showcase, launch metrics) with the story behind each, so
 * recruiters and investors get the signal without digging. Server-rendered.
 */
export function Impact() {
  return (
    <SectionShell id="record" eyebrow="Field Record" title="Proof of work">
      <div className="grid border-l border-t border-steel/70 sm:grid-cols-2 lg:grid-cols-3">
        {impactStats.map((s, i) => (
          <Reveal key={s.label} delay={(i % 3) * 0.06} className="border-b border-r border-steel/70">
            <div className="group h-full bg-carbon/40 p-6 transition-colors hover:bg-carbon/70 sm:p-7">
              <p
                data-solid
                className="font-display font-black leading-none text-bone transition-colors group-hover:text-surge"
                style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)", fontStretch: "expanded" }}
              >
                {s.value}
              </p>
              <p className="mt-3 font-hud text-xs uppercase tracking-[0.2em] text-surge">{s.label}</p>
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
