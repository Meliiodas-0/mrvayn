import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { SectionShell } from "@/components/ui/SectionShell";
import { Panel } from "@/components/ui/Panel";
import { Reveal } from "@/components/motion/Reveal";

export function About() {
  const now = experience[0];
  return (
    <SectionShell id="about" title="About" alt>
      {/* asymmetry: bio cols 1-7, disciplines cols 8-12 */}
      <div className="grid gap-6 lg:grid-cols-12">
        <Reveal fx="left" className="lg:col-span-7">
          <Panel edge className="relative flex h-full flex-col overflow-hidden p-6 sm:p-8">
            {/* ROG's scan beam sweeps the operator file once as it reveals */}
            <span aria-hidden className="scan-beam pointer-events-none absolute inset-y-0 left-0 w-[2px] bg-surge/70" />
            <div className="border-b border-steel/50 pb-4">
              <p className="font-display text-xl font-semibold uppercase text-bone">{profile.name}</p>
              <p className="font-mono text-xs uppercase text-surge">{profile.role}</p>
            </div>
            <p className="mt-5 font-sans leading-relaxed text-mist">{profile.about}</p>
            {/* closing readout so the panel ends on a real line instead of empty glass */}
            <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-steel/50 pt-5 font-mono text-xs uppercase text-mist lg:mt-auto">
              <span>
                <span className="text-surge">Now</span> {now.title}, {now.org}
              </span>
              <span>{now.year}</span>
            </div>
          </Panel>
        </Reveal>

        <Reveal fx="right" className="lg:col-span-5 lg:col-start-8">
          <Panel className="h-full p-6 sm:p-8">
            <p className="font-mono text-xs uppercase text-volt">Core disciplines</p>
            <ul className="mt-6 grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {profile.capabilities.map((cap) => (
                <li key={cap} className="font-sans text-sm text-bone/90">
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
