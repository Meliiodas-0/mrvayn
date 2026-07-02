import { reelFrames } from "@/data/showreel";
import { Eyebrow } from "@/components/ui/Eyebrow";

// Two passes of the frames so the CSS marquee (translateX -50%) loops seamlessly.
const loop = [...reelFrames, ...reelFrames];

// Giant ghosted strings that drift behind the frames ("frames over text of each other").
const GHOST = [
  { text: "SHOWREEL · FIELD LOG · ", cls: "mv-ghost-a" },
  { text: "UNREAL ENGINE · NIAGARA · GAMEPLAY · ", cls: "mv-ghost-b" },
  { text: "ANTARYA · COURAGELY · ENVIRONMENTS · ", cls: "mv-ghost-c" },
];

/**
 * Field Recordings — an auto-scrolling band of real project preview frames layered
 * over huge drifting project-name text, all in one component. Server-rendered; the
 * scroll is a transform-only CSS marquee (GPU, no JS), paused on hover and fully
 * stilled under prefers-reduced-motion (where it becomes a manual scroll strip).
 */
export function Showreel() {
  return (
    <section
      id="showreel"
      aria-label="Project showreel"
      className="relative isolate overflow-hidden border-y border-steel/50 bg-carbon/40 py-16 sm:py-24"
    >
      {/* background: oversized ghost text drifting behind everything */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex select-none flex-col justify-center gap-2 sm:gap-6">
        {GHOST.map((g) => (
          <div
            key={g.cls}
            className={`${g.cls} w-max whitespace-nowrap font-display font-black uppercase leading-none text-bone/[0.045]`}
            style={{ fontSize: "clamp(2.75rem, 9vw, 8rem)", fontStretch: "expanded" }}
          >
            {g.text.repeat(8)}
          </div>
        ))}
      </div>

      {/* header */}
      <div className="relative mx-auto mb-9 flex max-w-7xl items-end justify-between gap-4 px-5">
        <div>
          <Eyebrow>Field Recordings</Eyebrow>
          <h2
            data-solid
            className="mt-4 font-display font-black uppercase leading-[0.95] text-bone"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontStretch: "expanded" }}
          >
            Showreel
          </h2>
        </div>
        <p className="hidden shrink-0 items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-mist sm:flex">
          <span aria-hidden className="inline-block h-2 w-2 animate-pulse rounded-full bg-surge" />
          REC · {reelFrames.length} builds
        </p>
      </div>

      {/* marquee of preview frames, edge-masked so it fades into the band */}
      <div className="mv-marquee-mask relative">
        <ul className="mv-marquee flex w-max gap-4 sm:gap-5">
          {loop.map((f, i) => {
            const clone = i >= reelFrames.length;
            return (
              <li key={`${f.id}-${i}`} className="shrink-0">
                <a
                  href={f.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-hidden={clone}
                  tabIndex={clone ? -1 : undefined}
                  className="mv-frame group relative block w-[clamp(15rem,42vw,21rem)] overflow-hidden border border-steel/70 bg-void transition-colors duration-300 bevel hover:border-surge/60"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.img}
                    alt={`${f.title} preview`}
                    loading="lazy"
                    width={640}
                    height={360}
                    className="aspect-video w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
                  />
                  <span aria-hidden className="scanlines pointer-events-none absolute inset-0" />
                  <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-void/10" />

                  <span className="absolute left-3 top-3 bg-void/70 px-2 py-1 font-hud text-[0.6rem] uppercase tracking-[0.16em] text-surge backdrop-blur-sm bevel-sm">
                    {f.tag}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 px-3.5 pb-3 pt-8">
                    <span className="font-display text-sm font-bold uppercase tracking-wide text-bone transition-colors group-hover:text-surge">
                      {f.title}
                    </span>
                    <span className="shrink-0 font-mono text-[0.6rem] text-mist">{f.year}</span>
                  </div>

                  <span aria-hidden className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 border-r-2 border-t-2 border-surge opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="relative mx-auto mt-8 max-w-7xl px-5 font-mono text-[0.7rem] tracking-wide text-mist/60">
        Hover to pause · tap any frame to watch the build.
      </p>
    </section>
  );
}
