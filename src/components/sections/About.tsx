import { profile } from "@/data/profile";
import { SectionShell } from "@/components/ui/SectionShell";
import { Panel } from "@/components/ui/Panel";
import { Reveal } from "@/components/motion/Reveal";

export function About() {
  return (
    <SectionShell id="operator" eyebrow="Operator file" title="About">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <Panel edge className="h-full p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-steel/70 pb-4">
              <div>
                <p className="font-display text-xl font-black uppercase text-bone">{profile.name}</p>
                <p className="font-hud text-xs uppercase tracking-[0.2em] text-surge/80">{profile.role}</p>
              </div>
              <span className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-mist">
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-surge" />
                Status: Active
              </span>
            </div>
            <p className="mt-5 font-sans leading-relaxed text-mist">{profile.about}</p>
          </Panel>
        </Reveal>

        <Reveal delay={0.1}>
          <Panel className="h-full p-6 sm:p-8">
            <p className="font-hud text-xs uppercase tracking-[0.25em] text-mist">Core disciplines</p>
            <ul className="mt-6 space-y-px">
              {profile.capabilities.map((cap, i) => (
                <li
                  key={cap}
                  className="flex items-center gap-4 border-b border-steel/50 py-3 font-sans text-sm text-bone/90 last:border-b-0"
                >
                  <span className="font-mono text-[0.7rem] text-surge">{String(i + 1).padStart(2, "0")}</span>
                  {cap}
                </li>
              ))}
            </ul>
          </Panel>
        </Reveal>
      </div>
    </SectionShell>
  );
}
