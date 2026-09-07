import { reelFrames } from "@/data/showreel";
import { section } from "@/data/sections";
import { ReelPause } from "@/components/sections/ReelPause";

// Two passes of the frames so the CSS marquee (translateX -50%) loops seamlessly.
const loop = [...reelFrames, ...reelFrames];

/**
 * Showreel: a cinematic dark band cut by the site signal red. Frames link to each
 * build's showcase. Server-rendered; the strip is a
 * transform-only CSS marquee that pauses on hover, focus or the Pause control, and
 * becomes a hand-scrolled, snapping row on touch and reduced-motion devices.
 */
export function Showreel() {
  const def = section("showreel");
  return (
    <section
      id="showreel"
      aria-label="Project showreel"
      className="relative isolate overflow-hidden border-y border-steel/70 bg-bg1 py-[68px] sm:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(55% 120% at 0% 50%, rgb(var(--ion) / 0.2), transparent 72%)" }}
      />
      <div aria-hidden className="signal-line absolute inset-x-0 top-0 h-[3px]" />
      {/* header */}
      <div data-solid className="mv-col mb-10 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div>
          <p className="font-mono text-meta uppercase text-surge">
            {def.index} / {def.label}
          </p>
          <h2
            data-depth="title"
            className="mt-4 font-display font-semibold uppercase leading-[0.85] text-bone"
            style={{ fontSize: "clamp(2.75rem, 5vw, 4.75rem)" }}
          >
            Showreel
          </h2>
        </div>
        <p className="flex shrink-0 items-center font-mono text-xs uppercase text-volt sm:text-meta">
          {reelFrames.length} builds
          <ReelPause />
        </p>
      </div>

      {/* the one marquee */}
      <div data-solid className="mv-marquee-mask relative">
        <ul className="mv-marquee flex w-max gap-4 sm:gap-5">
          {loop.map((f, i) => {
            const clone = i >= reelFrames.length;
            return (
              <li key={`${f.id}-${i}`} data-clone={clone ? "" : undefined} className="shrink-0">
                <a
                  href={f.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-hidden={clone}
                  tabIndex={clone ? -1 : undefined}
                  className="group relative block w-[clamp(17rem,42vw,24rem)] overflow-hidden rounded-lg border border-line2/75 bg-carbon shadow-[0_18px_50px_rgb(0_0_0/0.35)] transition-[transform,border-color,box-shadow] duration-300 ease-out3 hover:-translate-y-1 hover:border-surge/70 hover:shadow-[0_24px_70px_rgb(0_0_0/0.55)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.img}
                    alt={`${f.title} preview`}
                    loading="lazy"
                    width={640}
                    height={360}
                    className="aspect-video w-full object-cover contrast-[1.04] saturate-[1.08] transition-transform duration-700 ease-out3 group-hover:scale-[1.035]"
                  />
                  <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 px-3.5 pb-3 pt-8">
                    <span className="font-display text-sm font-semibold uppercase text-white">{f.title}</span>
                    <span className="shrink-0 font-mono text-meta-xs uppercase text-white/70">{f.year}</span>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <p data-solid className="mv-col mt-8 font-mono text-meta-xs uppercase text-volt">
        <span className="reel-hint-hover">Hover or press pause to hold the strip · click a frame to watch the build</span>
        <span className="reel-hint-touch">Swipe to browse · tap a frame to watch the build</span>
      </p>
    </section>
  );
}
