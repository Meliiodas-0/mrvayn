import { experience, education, certifications } from "@/data/experience";
import { SectionShell } from "@/components/ui/SectionShell";
import { Panel } from "@/components/ui/Panel";
import { Reveal } from "@/components/motion/Reveal";

export function Timeline() {
  return (
    <SectionShell id="journey" title="Journey" alt>
      <div className="grid gap-6 lg:grid-cols-12">
        {/* the spine (#journey ol::before/::after in globals.css) fills as you read */}
        <ol className="relative space-y-4 lg:col-span-7">
          {experience.map((e, i) => (
            <li key={`${e.year}-${e.title}`} className="relative pl-10 sm:pl-12">
              {/* numbered marker, real sequence, so numbering is legitimate; follows the fill */}
              <span
                aria-hidden
                className="tl-badge absolute left-0 top-1 grid h-[1.4rem] w-[1.4rem] place-items-center rounded font-mono text-meta-xs font-bold transition-colors duration-300"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <Reveal fx="left">
                <Panel className="p-6 sm:p-7">
                  <p className="font-mono text-xs uppercase text-mist">{e.year}</p>
                  <h3 className="mt-1 font-display text-xl font-semibold uppercase text-bone">{e.title}</h3>
                  <p className="mt-0.5 font-mono text-xs uppercase text-surge">{e.org}</p>
                  <p className="mt-3 max-w-[68ch] font-sans text-sm leading-relaxed text-mist">{e.summary}</p>
                </Panel>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* Education + Certifications ride alongside on desktop */}
        <div className="grid content-start gap-6 lg:sticky lg:top-24 lg:col-span-5 lg:col-start-8 lg:self-start">
          <Reveal fx="right">
            <Panel edge className="p-5 sm:p-6">
              <h3 className="font-mono text-xs uppercase text-surge">Education</h3>
              <p className="mt-4 font-display text-lg font-semibold uppercase leading-tight text-bone">{education.degree}</p>
              <p className="mt-1 font-mono text-xs uppercase text-mist">{education.org}</p>
              <p className="mt-1 font-mono text-xs uppercase text-volt">{education.year}</p>
            </Panel>
          </Reveal>

          <Reveal fx="right">
            <Panel className="p-5 sm:p-6">
              <h3 className="font-mono text-xs uppercase text-surge">Certifications</h3>
              <ul className="mt-4 space-y-3">
                {certifications.map((c) => (
                  <li
                    key={c.name}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-0.5 border-b border-steel/50 pb-3 last:border-b-0 last:pb-0"
                  >
                    <span className="font-sans text-sm text-bone/90">{c.name}</span>
                    <span className="font-mono text-xs uppercase text-volt">{c.date}</span>
                    <span className="col-span-2 font-mono text-meta-xs uppercase text-volt">{c.issuer}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
