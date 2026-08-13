import { reelFrames } from "@/data/showreel";

// Two passes of the frames so the CSS marquee (translateX -50%) loops seamlessly.
const loop = [...reelFrames, ...reelFrames];

/**
 * Field Recordings, v3: THE single loudest red on the site. Solid --red band,
 * #08090D text, one marquee (the only one allowed), no ghost layers. Frames link
 * to each build's showcase. Server-rendered; scroll is a transform-only CSS
 * marquee that pauses on hover/focus and stills under prefers-reduced-motion.
 */
export function Showreel() {
  return (
    <section
      id="showreel"
      aria-label="Project showreel"
      className="relative isolate overflow-hidden py-16 sm:py-20"
      style={{ backgroundColor: "rgb(var(--ion))" }}
    >
      {/* header */}
      <div className="mx-auto mb-9 flex w-[min(1440px,100%-clamp(32px,6vw,128px))] items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.8125rem] uppercase text-white/85">00 / Showreel</p>
          <h2
            data-solid
            className="mt-3 font-display font-semibold uppercase leading-[0.95] text-white"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            Showreel
          </h2>
        </div>
        <p className="hidden shrink-0 items-end gap-2 font-mono text-[0.8125rem] uppercase text-white/85 sm:flex">
          <span aria-hidden className="flex items-end gap-[3px] text-white">
            <span className="eq" /><span className="eq" /><span className="eq" />
          </span>
          REC · {reelFrames.length} builds
        </p>
      </div>

      {/* the one marquee */}
      <div className="mv-marquee-mask kinetic-skew relative">
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
                  className="mv-frame group relative block w-[clamp(15rem,42vw,21rem)] overflow-hidden rounded border border-white/40 bg-[#0B0E14] transition-transform duration-200 ease-snap hover:-translate-y-[2px]"
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
                    <span className="shrink-0 font-mono text-[11px] uppercase text-white/70">{f.year}</span>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mx-auto mt-8 w-[min(1440px,100%-clamp(32px,6vw,128px))] font-mono text-[11px] uppercase text-white/80">
        Hover to pause · tap any frame to watch the build
      </p>
    </section>
  );
}
