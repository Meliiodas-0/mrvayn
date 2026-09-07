import { ArrowRight, ArrowDown } from "lucide-react";
import { profile } from "@/data/profile";
import { BevelButton } from "@/components/ui/BevelButton";
import { Reveal } from "@/components/motion/Reveal";

// The hero is a thesis: identity pill, the wordmark with its red slab, one paragraph,
// two actions, three facts. Copy spans cols 1-8; ROG's fixed canvas owns the right.
// Server component; content is always in the SSR HTML (iOS-safe reveals).
export function Hero() {
  return (
    <section id="hero" className="relative flex min-h-svh flex-col justify-center overflow-hidden border-b border-steel/70 pb-14 pt-24 sm:pb-20 sm:pt-28">
      <div aria-hidden className="hero-grid pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(52% 58% at 82% 38%, var(--red-dim), transparent 72%)" }}
      />

      <div className="mv-col relative">
        <div className="grid grid-cols-12">
          <div className="col-span-12 lg:col-span-9 xl:col-span-8" data-depth="hero-copy">
            {/* identity pill: static role (phones get the one-line form) */}
            <Reveal>
              <span data-solid className="glass inline-flex max-w-full items-center gap-2.5 rounded-full px-4 py-2 font-mono text-meta uppercase text-surge shadow-[0_0_40px_rgb(var(--ion)/0.08)]">
                <span aria-hidden className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-ion motion-safe:animate-pulse" />
                <span className="sm:hidden">{profile.roleShort}</span>
                <span className="max-sm:hidden">{profile.role}</span>
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-6">
                <h1
                  data-solid
                  aria-label="MrVayn"
                  className="font-display text-[clamp(4rem,10.5vw,10rem)] font-semibold uppercase leading-[0.82] text-bone drop-shadow-[0_12px_40px_rgb(0_0_0/0.5)] min-[2200px]:text-[11.5rem]"
                >
                  {"MrVayn".split("").map((c, i) => (
                    <span key={i} aria-hidden className="ltr" style={{ animationDelay: `${0.12 + i * 0.05}s` }}>
                      {c}
                    </span>
                  ))}
                </h1>
                {/* the red slab: the signature mark under the name */}
                <span aria-hidden className="signal-line mt-5 block h-1.5 w-[46%] max-w-[360px]" />
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <p data-solid className="mt-8 max-w-[62ch] font-sans text-base leading-[1.75] text-mist sm:text-lg lg:max-w-2xl">
                {profile.thesis}
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div data-solid className="mt-8 flex flex-wrap items-center gap-3">
                <BevelButton href="#work" variant="primary" className="max-sm:w-full">
                  View work
                  <ArrowRight className="h-4 w-4" />
                </BevelButton>
                <BevelButton href="#contact" variant="ghost" className="max-sm:w-full">
                  <ArrowDown className="h-4 w-4" />
                  Contact
                </BevelButton>
              </div>
            </Reveal>

            {/* glass readout: three facts in the data voice */}
            <Reveal delay={0.3}>
              <div data-solid className="glass mt-9 inline-grid max-w-full grid-cols-1 overflow-hidden rounded-lg font-mono text-meta uppercase text-volt sm:mt-14 sm:grid-cols-3">
                {profile.specialties.map((s) => (
                  <span key={s.label} className="whitespace-nowrap border-b border-steel/70 px-5 py-3.5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                    <span className="mr-1 text-bone">{s.value}</span> {s.label}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
          {/* cols 9-12: ROG's canvas (fixed right by ScrollSamurai) owns this space */}
        </div>
      </div>
    </section>
  );
}
