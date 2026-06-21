import { ArrowRight, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { BevelButton } from "@/components/ui/BevelButton";
import { Panel } from "@/components/ui/Panel";
import { StatBlock } from "@/components/ui/StatBlock";
import { Reveal } from "@/components/motion/Reveal";

export function Hero() {
  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden px-5 pb-16 pt-28">
      {/* VFX: signature neon glow, biased toward the wordmark (asymmetric). */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[22%] top-[46%] -z-0 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[130px]"
        style={{ background: "radial-gradient(circle, rgb(var(--surge)/0.9), rgb(var(--ion)/0.5) 45%, rgb(var(--volt)/0.25) 70%, transparent 75%)" }}
      />

      {/* Faint HUD grid — gives the void structure, fades toward the edges. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgb(var(--bone)/0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--bone)/0.05) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 85% 70% at 42% 52%, #000 15%, transparent 82%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 70% at 42% 52%, #000 15%, transparent 82%)",
        }}
      />

      {/* HUD corner brackets framing the viewport. */}
      <span aria-hidden className="pointer-events-none absolute left-4 top-[4.5rem] h-6 w-6 border-l border-t border-surge/30" />
      <span aria-hidden className="pointer-events-none absolute right-4 top-[4.5rem] h-6 w-6 border-r border-t border-surge/30" />
      <span aria-hidden className="pointer-events-none absolute bottom-12 left-4 h-6 w-6 border-b border-l border-surge/30" />
      <span aria-hidden className="pointer-events-none absolute bottom-12 right-4 h-6 w-6 border-b border-r border-surge/30" />

      {/* Top meta line. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[5rem] z-10 mx-auto flex max-w-7xl items-center justify-between px-6 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-mist/35"
      >
        <span>// Operator_portfolio</span>
        <span className="hidden sm:inline">Est. 2019</span>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Left — the thesis + wordmark */}
        <div className="lg:col-span-8">
          <div data-solid className="w-fit max-w-full">
            <Reveal>
              <span className="inline-flex items-center gap-2.5 font-hud text-xs uppercase tracking-[0.3em] text-surge">
                <span aria-hidden className="inline-block h-1.5 w-1.5 bg-surge" />
                {profile.role}
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1
                className="mt-6 font-anton uppercase leading-[0.8] text-bone text-glow-surge"
                style={{ fontSize: "clamp(4rem, 14vw, 12rem)" }}
              >
                MrVayn
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-mist">{profile.thesis}</p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <BevelButton href="#loadout" variant="primary">
                  View work
                  <ArrowRight className="h-4 w-4" />
                </BevelButton>
                <BevelButton href={profile.emailHref} variant="ghost">
                  <Mail className="h-4 w-4" />
                  Get in touch
                </BevelButton>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.4}>
            <p className="mt-12 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-mist/50">
              Tip: hunt the stickmen roaming the page
            </p>
          </Reveal>
        </div>

        {/* Right — operator spec HUD panel (fills the layout, reinforces the game-client read) */}
        <Reveal delay={0.3} className="lg:col-span-4">
          <Panel edge className="p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <span className="font-hud text-[0.7rem] uppercase tracking-[0.3em] text-mist">Operator spec</span>
              <span className="inline-flex items-center gap-2 font-hud text-[0.7rem] uppercase tracking-[0.2em] text-volt">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-volt shadow-[0_0_8px_0] shadow-volt" />
                Online
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7">
              {profile.specialties.map((s) => (
                <StatBlock key={s.label} value={s.value} label={s.label} />
              ))}
            </div>

            <p className="mt-6 flex items-start gap-2.5 border-t border-steel pt-5 font-sans text-sm leading-relaxed text-mist">
              <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-surge" />
              {profile.availability}
            </p>
          </Panel>
        </Reveal>
      </div>

      {/* Bottom HUD status bar. */}
      <div className="absolute inset-x-0 bottom-5 z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-mist/50">
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-1.5 w-1.5 bg-volt shadow-[0_0_8px_0] shadow-volt" />
          Open to work
        </span>
        <span aria-hidden className="hidden text-mist/35 md:inline">UE5 · Niagara · Multiplayer · Netcode</span>
        <a href="#operator" className="transition-colors hover:text-surge">Scroll ↓</a>
      </div>
    </section>
  );
}
