import { reelFrames } from "@/data/showreel";
import { section } from "@/data/sections";
import { ReelPause } from "@/components/sections/ReelPause";

// Two passes of the frames so the CSS marquee (translateX -50%) loops seamlessly.
const loop = [...reelFrames, ...reelFrames];

/**
 * Showreel: THE single loudest red on the site. Solid --ion band, white text, one
 * marquee. Frames link to each build's showcase. Server-rendered; the strip is a
 * transform-only CSS marquee that pauses on hover, focus or the Pause control, and
 * becomes a hand-scrolled, snapping row on touch and reduced-motion devices.
 */
export function Showreel() {
  const def = section("showreel");
  return (
    <section
      id="showreel"
      aria-label="Project showreel"
      className="relative isolate overflow-hidden py-16 sm:py-20"
      style={{ backgroundColor: "rgb(var(--ion))" }}
    >
      {/* header */}
      <div data-solid className="mv-col mb-9 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div>
          <p className="font-mono text-meta uppercase text-white/85">
            {def.index} / {def.label}
          </p>
          <h2
            data-depth="title"
            className="mt-3 font-display font-semibold uppercase leading-[0.95] text-white"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            Showreel
          </h2>
        </div>
        <p className="flex shrink-0 items-center font-mono text-xs uppercase text-white/85 sm:text-meta">
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
                  className="group relative block w-[clamp(15rem,42vw,21rem)] overflow-hidden rounded border border-white/40 bg-bone transition-transform duration-200 ease-snap hover:-translate-y-[2px]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.img}
                    alt={`${f.title} preview`}
                    loading="lazy"
                    width={640}
                    height={360}
                    className="aspect-video w-full object-cover opacity-95 transition-opacity duration-200 group-hover:opacity-100"
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

      <p data-solid className="mv-col mt-8 font-mono text-meta-xs uppercase text-white/80">
        <span className="reel-hint-hover">Hover or press pause to hold the strip · click a frame to watch the build</span>
        <span className="reel-hint-touch">Swipe to browse · tap a frame to watch the build</span>
      </p>
    </section>
  );
}
