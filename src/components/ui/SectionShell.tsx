import { cn } from "@/lib/cn";
import { section } from "@/data/sections";
import { Reveal } from "@/components/motion/Reveal";

interface SectionShellProps {
  /** Section id from src/data/sections.ts (drives the anchor, label and index). */
  id: string;
  title: string;
  /** Alternate elevation: bg-1 instead of bg-0 (page alternates for depth). */
  alt?: boolean;
  /** Hang the label 12px under the top rule instead of straddling it; use when the
   *  section above is not off-white (the red Showreel band). */
  labelsBelow?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Section chrome: full-bleed section with 1px rules top and bottom and the mono
 * "NN / LABEL" sitting on the top rule. Content column = .mv-col.
 */
export function SectionShell({ id, title, alt = false, labelsBelow = false, children, className }: SectionShellProps) {
  const def = section(id);
  // Slightly translucent so ROG's fixed canvas ghosts through every section
  // (owner: he should stay visible beyond the hero), still ~86% solid for text.
  const bg = alt ? "rgb(var(--bg-1) / 0.86)" : "rgb(var(--void) / 0.86)";
  // A label straddling the rule needs a SOLID ground so whatever sits behind the
  // boundary never shows through the text.
  const labelBg = alt ? "rgb(var(--bg-1))" : "rgb(var(--void))";
  return (
    <section
      id={def.id}
      className={cn("relative scroll-mt-20 border-b border-t border-steel py-[60px] sm:py-[clamp(96px,12vh,180px)]", className)}
      style={{ backgroundColor: bg }}
    >
      {/* mono label on (or just under) the top rule; the h2 carries the real name */}
      <div
        aria-hidden
        className={cn(
          "mv-col pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between",
          labelsBelow ? "translate-y-3" : "-translate-y-1/2",
        )}
      >
        <span
          className={cn("font-mono text-meta uppercase text-volt", !labelsBelow && "px-2")}
          style={labelsBelow ? undefined : { backgroundColor: labelBg }}
        >
          {def.index} / {def.label}
        </span>
      </div>

      <div className="mv-col">
        <Reveal>
          <h2
            data-solid
            data-depth="title"
            className="block w-fit font-display font-semibold uppercase leading-[0.95] text-bone"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            {title}
          </h2>
        </Reveal>
        <div className="mt-8 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}
