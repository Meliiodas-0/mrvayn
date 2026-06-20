import { ArrowRight } from "lucide-react";
import { profile } from "@/data/profile";
import { BevelButton } from "@/components/ui/BevelButton";
import { PlayButton } from "@/components/PlayButton";
import { HudFrame } from "@/components/ui/HudFrame";
import { GameMount } from "@/components/GameMount";
import { Reveal } from "@/components/motion/Reveal";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden px-5 pb-16 pt-28"
    >
      {/* VFX: signature neon glow (surge -> ion -> volt), blurred, low opacity. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-0 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgb(var(--surge)/0.9), rgb(var(--ion)/0.5) 45%, rgb(var(--volt)/0.25) 70%, transparent 75%)",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: identity + CTAs (always readable; never depends on the game) */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2.5 font-hud text-xs uppercase tracking-[0.28em] text-surge">
              <span aria-hidden className="inline-block h-1.5 w-1.5 bg-surge" />
              {profile.role}
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1
              className="mt-5 font-anton uppercase leading-[0.86] text-bone text-glow-surge"
              style={{ fontSize: "clamp(3.25rem, 9vw, 7rem)" }}
            >
              MrVayn
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-mist">{profile.thesis}</p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <BevelButton href="#loadout" variant="primary">
                View work
                <ArrowRight className="h-4 w-4" />
              </BevelButton>
              <PlayButton variant="ghost" />
            </div>
          </Reveal>
        </div>

        {/* Right: the optional game canvas mounts here (Phase 3). */}
        <Reveal delay={0.2} skew>
          <HudFrame scanlines className="bevel aspect-[4/3] w-full overflow-hidden bg-carbon">
            <GameMount />
          </HudFrame>
        </Reveal>
      </div>

      {/* scroll cue */}
      <a
        href="#operator"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-mist/60 transition-colors hover:text-surge"
      >
        Scroll
      </a>
    </section>
  );
}
