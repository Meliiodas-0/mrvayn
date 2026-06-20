import { Mail, ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import { socials, collaborations } from "@/data/socials";
import { SectionShell } from "@/components/ui/SectionShell";
import { Panel } from "@/components/ui/Panel";
import { BevelButton } from "@/components/ui/BevelButton";
import { Reveal } from "@/components/motion/Reveal";

export function Contact() {
  return (
    <SectionShell id="comms" eyebrow="Comms" title="Get in touch">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Primary CTA */}
        <Reveal>
          <Panel edge className="flex h-full flex-col justify-between gap-8 p-7 sm:p-9">
            <div>
              <p className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-mist">
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-surge" />
                {profile.availability}
              </p>
              <h3 className="mt-5 max-w-md font-display text-2xl font-black uppercase leading-tight text-bone sm:text-3xl">
                Building something ambitious?
              </h3>
              <p className="mt-3 max-w-md font-sans leading-relaxed text-mist">
                Open to studio collaborations, contract work, and investor conversations. Let&apos;s talk.
              </p>
            </div>
            <div>
              <BevelButton href={profile.emailHref} variant="primary">
                <Mail className="h-4 w-4" />
                Email me
              </BevelButton>
            </div>
          </Panel>
        </Reveal>

        {/* Socials + collaborations */}
        <div className="grid gap-6">
          <Reveal delay={0.08}>
            <Panel className="p-6">
              <h4 className="font-hud text-xs uppercase tracking-[0.22em] text-surge">Channels</h4>
              <ul className="mt-4 grid grid-cols-2 gap-3">
                {socials.map((s) => (
                  <li key={s.name}>
                    {s.href ? (
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between border border-steel px-3 py-2.5 transition-colors hover:border-surge/50 bevel-sm"
                      >
                        <span className="font-hud text-xs uppercase tracking-wide text-bone">{s.name}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-mist transition-colors group-hover:text-surge" />
                      </a>
                    ) : (
                      <div className="flex items-center justify-between border border-steel px-3 py-2.5 bevel-sm">
                        <span className="font-hud text-xs uppercase tracking-wide text-bone">{s.name}</span>
                        <span className="font-mono text-[0.7rem] text-surge">{s.handle}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </Panel>
          </Reveal>

          <Reveal delay={0.14}>
            <Panel className="p-6">
              <h4 className="font-hud text-xs uppercase tracking-[0.22em] text-surge">Selected collaborations</h4>
              <ul className="mt-3 space-y-1.5">
                {collaborations.map((c) => (
                  <li key={c.href}>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 font-sans text-sm text-mist transition-colors hover:text-bone"
                    >
                      <span aria-hidden className="text-surge/70">/</span>
                      {c.title}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
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
