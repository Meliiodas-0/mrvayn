import { ArrowRight, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { BevelButton } from "@/components/ui/BevelButton";
import { Reveal } from "@/components/motion/Reveal";
import { HeroMachinery } from "@/components/HeroMachinery";

// No framer-motion: its animations don't apply on iOS WebKit and were blanking the
// hero. Content is plain + always visible (server-rendered into the HTML); the
// entrance is the pure-CSS Reveal. No scroll-driven fade (it relied on framer).
export function Hero() {
  return (
    <section
      id="hero"
      className="scanlines relative flex min-h-screen flex-col overflow-hidden px-5 pb-10 pt-24 sm:pt-28"
    >
      {/* Glow under the wordmark (top-center). */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[26%] -z-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[150px]"
        style={{ background: "radial-gradient(circle, rgb(var(--surge)/0.8), rgb(var(--ion)/0.4) 46%, transparent 74%)" }}
      />

      {/* Refined machinery, solid monochrome gears framing both sides + embers. */}
      <HeroMachinery />

      {/* Low spectral horizon glow grounds ROG at center-bottom (cool, ethereal). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0"
        style={{ background: "radial-gradient(85% 52% at 50% 112%, rgb(var(--ion)/0.12), rgb(var(--volt)/0.06) 42%, transparent 66%)" }}
      />
      {/* Vignette pulls focus inward + tones the gears down at the edges. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0"
        style={{ background: "radial-gradient(120% 100% at 50% 32%, transparent 48%, rgb(var(--void)/0.62) 100%)" }}
      />

      {/* Corner brackets framing the viewport. */}
      <span aria-hidden className="pointer-events-none absolute left-4 top-[4.5rem] h-7 w-7 border-l-2 border-t-2 border-surge/40" />
      <span aria-hidden className="pointer-events-none absolute right-4 top-[4.5rem] h-7 w-7 border-r-2 border-t-2 border-surge/40" />
      <span aria-hidden className="pointer-events-none absolute bottom-9 left-4 h-7 w-7 border-b-2 border-l-2 border-surge/40" />
      <span aria-hidden className="pointer-events-none absolute bottom-9 right-4 h-7 w-7 border-b-2 border-r-2 border-surge/40" />

      {/* Left rail, operator spec, flanking the center (wide screens only). */}
      <div
        data-solid
        className="absolute left-7 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-7 border-l border-steel/60 pl-5 xl:flex"
      >
        {profile.specialties.slice(0, 3).map((s) => (
          <div key={s.label}>
            <div className="font-display text-2xl font-black uppercase leading-none text-bone">{s.value}</div>
            <div className="mt-1.5 font-hud text-[0.58rem] uppercase tracking-[0.24em] text-mist">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Right rail, status / signal, flanking the center (wide screens only). */}
      <div
        data-solid
        className="absolute right-7 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-end gap-6 border-r border-steel/60 pr-5 text-right xl:flex"
      >
        <div className="flex items-center gap-2 font-hud text-[0.62rem] uppercase tracking-[0.22em] text-volt">
          Open to work
          <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-volt shadow-[0_0_8px_0] shadow-volt motion-reduce:animate-none" />
        </div>
        <div className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-mist/80">Est. 2019</div>
        <div className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-mist/80">Delhi · IN</div>
        <div className="font-mono text-[0.58rem] uppercase tracking-[0.28em] text-surge/80">IGDC &apos;25</div>
      </div>

      {/* ===== Compact centered content, the ronin owns center-bottom ===== */}
      {/* lg+: nudged down so the copy sits closer to ROG (less empty gap above him). */}
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center lg:mt-[4vh]">
        <Reveal>
          <span className="inline-flex items-center gap-2.5 font-hud text-[0.7rem] uppercase tracking-[0.34em] text-surge">
            <span aria-hidden className="inline-block h-1.5 w-1.5 bg-surge" />
            {profile.role}
          </span>
        </Reveal>

        <Reveal delay={0.08}>
          <h1
            data-solid
            className="mt-4 font-anton uppercase leading-[0.8] text-bone text-glow-surge"
            style={{ fontSize: "clamp(3.5rem, 10vw, 8.5rem)" }}
          >
            MrVayn
          </h1>
          <span aria-hidden className="mx-auto mt-4 block h-[2px] w-2/3 max-w-sm bg-gradient-to-r from-transparent via-surge to-transparent" />
        </Reveal>

        <Reveal delay={0.16}>
          <p data-solid className="mx-auto mt-5 max-w-xl font-sans text-sm leading-relaxed text-mist sm:text-base">{profile.thesis}</p>
        </Reveal>

        <Reveal delay={0.24}>
          <div data-solid className="mt-6 flex flex-wrap items-center justify-center gap-3">
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

      {/* Scroll hint pinned bottom-center, above the ronin's grounding glow. */}
      <a
        href="#operator"
        className="pointer-events-auto absolute bottom-5 left-1/2 z-10 -translate-x-1/2 font-mono text-[0.62rem] uppercase tracking-[0.35em] text-mist/45 transition-colors hover:text-surge"
      >
        Scroll ↓
      </a>
    </section>
  );
}
