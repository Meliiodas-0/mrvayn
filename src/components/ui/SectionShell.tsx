import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollPercent } from "@/components/ui/ScrollPercent";
import { ScrambleTitle } from "@/components/fx/ScrambleTitle";

interface SectionShellProps {
  id: string;
  eyebrow: string;
  title: string;
  /** Instrument-frame index, e.g. "02" -> the on-line label reads "02 / LOADOUT". */
  index?: string;
  /** Alternate elevation: bg-1 instead of bg-0 (page alternates for depth). */
  alt?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * v3 section chrome: full-bleed section with 1px rules top and bottom and mono
 * labels sitting ON the top rule ("02 / LOADOUT" left, live "SCROLL n%" right).
 * This frame replaces all decorative dividers. Content column:
 * min(1440px, 100% - clamp(32px, 6vw, 128px)).
 */
export function SectionShell({ id, eyebrow, title, index, alt = false, children, className }: SectionShellProps) {
  // Slightly translucent so ROG's fixed canvas ghosts through every section
  // (owner: he should stay visible beyond the hero), still ~86% solid for text.
  const bg = alt ? "rgb(var(--bg-1) / 0.86)" : "rgb(var(--void) / 0.86)";
  // Labels straddling the top rule need a SOLID ground: at 0.86 whatever sits
  // behind the boundary (e.g. the hero proof ticker) shows through the text.
  const labelBg = alt ? "rgb(var(--bg-1))" : "rgb(var(--void))";
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-20 border-t border-b border-steel", className)}
      style={{ backgroundColor: bg, paddingBlock: "clamp(96px, 12vh, 180px)" }}
    >
      {/* mono labels sitting ON the top rule */}
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto flex w-[min(1440px,100%-clamp(32px,6vw,128px))] -translate-y-1/2 items-center justify-between">
        <span className="px-2 font-mono text-[0.8125rem] uppercase text-volt" style={{ backgroundColor: labelBg }}>
          {index ? `${index} / ${eyebrow}` : eyebrow}
        </span>
        <span className="hidden px-2 font-mono text-[0.8125rem] uppercase text-volt sm:block" style={{ backgroundColor: labelBg }}>
          <ScrollPercent />
        </span>
      </div>

      <div className="mx-auto w-[min(1440px,100%-clamp(32px,6vw,128px))]">
        <Reveal>
          <h2
            data-solid
            className="block w-fit font-display font-semibold uppercase leading-[0.95] text-bone"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            <ScrambleTitle text={title} />
          </h2>
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
