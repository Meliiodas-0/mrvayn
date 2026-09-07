import { Mail, ArrowUpRight, FileText } from "lucide-react";
import { profile } from "@/data/profile";
import { socials, collaborations } from "@/data/socials";
import { SectionShell } from "@/components/ui/SectionShell";
import { Panel } from "@/components/ui/Panel";
import { BevelButton } from "@/components/ui/BevelButton";
import { CopyHandle } from "@/components/ui/CopyHandle";
import { Reveal } from "@/components/motion/Reveal";

export function Contact() {
  return (
    <SectionShell id="contact" title="Contact">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* One confident door. The work above makes the case; this just opens it. */}
        <Reveal fx="left" className="lg:col-span-7">
          <Panel edge className="flex h-full flex-col p-7 sm:p-10">
            <p className="flex items-start gap-2 font-mono text-xs uppercase text-mist">
              <span aria-hidden className="mt-[0.35rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-surge" />
              {profile.availability}
            </p>
            <h3 className="mt-5 max-w-lg font-display text-3xl font-semibold uppercase leading-[1.05] text-bone sm:text-5xl">
              Building something worth shipping?
            </h3>
            <p className="mt-5 max-w-lg font-sans text-base leading-relaxed text-mist sm:text-lg">
              Email is the fastest channel. UE5 work, product builds, or just talking shop
              about Antarya and the MMORPG: my inbox is open.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <BevelButton href={profile.emailHref} variant="primary">
                <Mail className="h-4 w-4" />
                Email me
              </BevelButton>
              {profile.resumeHref && (
                <BevelButton href={profile.resumeHref} variant="ghost" target="_blank" rel="noopener">
                  <FileText className="h-4 w-4" />
                  Download CV
                </BevelButton>
              )}
            </div>
            {/* the address itself, readable and copyable without a mail client */}
            <a
              href={`mailto:${profile.email}`}
              className="mt-10 block border-t border-steel/50 pt-5 font-mono text-meta text-volt transition-colors hover:text-surge lg:mt-auto"
            >
              {profile.email}
            </a>
          </Panel>
        </Reveal>

        {/* Channels + collaborations */}
        <div className="grid content-start gap-6 lg:col-span-5">
          <Reveal fx="right">
            <Panel className="p-6">
              <h4 className="font-mono text-xs uppercase text-surge">Channels</h4>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {socials.map((s) => (
                  <li key={s.name}>
                    {s.href ? (
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex min-h-11 min-w-0 items-center justify-between gap-3 rounded border border-steel bg-bg3/55 px-3 py-2.5 transition-colors hover:border-surge/50 hover:bg-bg3"
                      >
                        <span className="font-mono text-xs uppercase text-bone">{s.name}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-mist transition-colors group-hover:text-surge" />
                      </a>
                    ) : s.handle ? (
                      <CopyHandle label={s.name} handle={s.handle} />
                    ) : null}
                  </li>
                ))}
              </ul>
            </Panel>
          </Reveal>

          <Reveal fx="right">
            <Panel className="p-6">
              <h4 className="font-mono text-xs uppercase text-surge">Selected collaborations</h4>
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
