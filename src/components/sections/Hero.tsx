import { ArrowRight, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { BevelButton } from "@/components/ui/BevelButton";
import { Reveal } from "@/components/motion/Reveal";

export function Hero() {
  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden px-5 pb-16 pt-28">
      {/* VFX: signature neon glow, biased toward the wordmark (asymmetric). */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[18%] top-[42%] -z-0 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[130px]"
        style={{ background: "radial-gradient(circle, rgb(var(--surge)/0.9), rgb(var(--ion)/0.5) 45%, rgb(var(--volt)/0.25) 70%, transparent 75%)" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div data-solid className="max-w-3xl">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 font-hud text-xs uppercase tracking-[0.3em] text-surge">
              <span aria-hidden className="inline-block h-1.5 w-1.5 bg-surge" />
              {profile.role}
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1
              className="mt-6 font-anton uppercase leading-[0.82] text-bone text-glow-surge"
              style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)" }}
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
          <p className="mt-14 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-mist/50">
            Tip: hunt the stickmen roaming the page
          </p>
        </Reveal>
      </div>

      <a
        href="#operator"
        className="absolute bottom-6 right-6 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-mist/60 transition-colors hover:text-surge"
      >
        Scroll ↓
      </a>
    </section>
  );
}
