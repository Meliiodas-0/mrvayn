import { ArrowRight, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { proofChips } from "@/data/impact";
import { BevelButton } from "@/components/ui/BevelButton";
import { RoleFlip } from "@/components/fx/RoleFlip";
import { AnimatedRays } from "@/components/vendor/animated-rays";
import { Reveal } from "@/components/motion/Reveal";

// Continuous flip roles (first one is the SSR text, so no-JS still reads correctly).
const ROLES = [profile.role, "SAO-X · MMORPG Architect", "CTO at Magadha Studios", "Niagara VFX & Netcode"];

// v3 hero: wide, asymmetric, engineered. Copy spans the left (cols 1-8) and ROG's
// canvas occupies the right, overlapping the text's z-space. No decorative glows,
// brackets, or machinery; the red-dim bleed behind ROG is the ONE glow allowed.
// Server component; content is always in the SSR HTML (iOS-safe reveals).
export function Hero() {
  return (
    <section id="hero" className="relative flex min-h-screen flex-col justify-center overflow-hidden pb-32 pt-28">
      {/* VengenceUI AnimatedRays: soft aurora stripes behind the composition */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.32]">
        <AnimatedRays className="h-full w-full" />
      </div>

      <div className="relative mx-auto w-[min(1440px,100%-clamp(32px,6vw,128px))]">
        <div className="grid grid-cols-12">
          <div className="col-span-12 lg:col-span-8">
            {/* glass identity pill with the cycling role */}
            <Reveal>
              <span className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 font-hud text-[0.8125rem] uppercase text-surge">
                <span aria-hidden className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-ion" />
                <RoleFlip words={ROLES} />
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="relative mt-6">
                {/* ghost echo behind the wordmark for depth (outline, no new colors) */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-[0.52em] left-[0.02em] select-none font-display font-semibold uppercase leading-none text-transparent"
                  style={{ fontSize: "clamp(4.5rem, 11vw, 10.5rem)", WebkitTextStroke: "1px rgb(var(--steel))", opacity: 0.7 }}
                >
                  MRVAYN
                </span>
                <h1
                  data-solid
                  aria-label="MrVayn"
                  className="relative font-display font-semibold uppercase leading-[0.9] text-bone"
                  style={{ fontSize: "clamp(3.5rem, 8.5vw, 8rem)" }}
                >
                  {"MrVayn".split("").map((c, i) => (
                    <span key={i} aria-hidden className="ltr" style={{ animationDelay: `${0.12 + i * 0.05}s` }}>
                      {c}
                    </span>
                  ))}
                </h1>
                {/* the red slab: the signature mark under the name */}
                <span aria-hidden className="mt-4 block h-2.5 w-[34%] max-w-[240px] bg-ion" />
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <p data-solid className="mt-7 max-w-[65ch] font-sans text-base leading-[1.7] text-mist lg:max-w-xl">
                {profile.thesis}
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div data-solid className="mt-8 flex flex-wrap items-center gap-3">
                <BevelButton href="#loadout" variant="primary" className="max-sm:w-full">
                  View work
                  <ArrowRight className="h-4 w-4" />
                </BevelButton>
                <BevelButton href={profile.emailHref} variant="ghost" className="max-sm:w-full">
                  <Mail className="h-4 w-4" />
                  Get in touch
                </BevelButton>
              </div>
            </Reveal>

            {/* glass meta strip: the operator readout in the data voice */}
            <Reveal delay={0.3}>
              <div data-solid className="glass mt-12 inline-flex max-w-full flex-wrap items-center gap-x-8 gap-y-3 rounded-lg px-5 py-3.5 font-mono text-[0.8125rem] uppercase text-volt">
                {profile.specialties.slice(0, 3).map((s) => (
                  <span key={s.label} className="whitespace-nowrap">
                    <span className="text-bone">{s.value}</span> {s.label}
                  </span>
                ))}
                <span className="inline-flex items-center gap-2 whitespace-nowrap">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ion" />
                  Open to work
                </span>
              </div>
            </Reveal>
          </div>
          {/* cols 9-12: ROG's canvas (fixed right by ScrollSamurai) owns this space */}
        </div>
      </div>

      {/* scroll hint: sits in its own clear band ABOVE the proof ticker (the strip
          is ~42px tall, so bottom-16 keeps the two from ever stacking) */}
      <a
        href="#operator"
        className="absolute bottom-16 left-1/2 z-10 -translate-x-1/2 font-mono text-[0.8125rem] uppercase text-volt transition-colors duration-200 ease-snap hover:text-surge"
      >
        Scroll ↓
      </a>

      {/* ambient proof strip: slow continuous marquee in the data voice */}
      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-steel bg-bg1/60 max-sm:hidden">
        <ul className="mv-marquee mv-marquee--slow flex w-max items-center gap-10 py-3 font-mono text-[11px] uppercase text-volt">
          {[...proofChips, ...proofChips].map((chip, i) => (
            <li key={`${chip}-${i}`} aria-hidden={i >= proofChips.length} className="flex shrink-0 items-center gap-10 whitespace-nowrap">
              <span aria-hidden className="text-surge">◆</span>
              {chip}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
