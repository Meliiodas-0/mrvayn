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
  // Slightly translucent so ROG's fixed canvas ghosts through every section.
  const bg = alt ? "rgb(var(--bg-1) / 0.9)" : "rgb(var(--void) / 0.9)";
  // A label straddling the rule needs a SOLID ground so whatever sits behind the
  // boundary never shows through the text.
  const labelBg = alt ? "rgb(var(--bg-1))" : "rgb(var(--void))";
  return (
    <section
      id={def.id}
      className={cn("relative scroll-mt-20 border-b border-t border-steel/70 py-[68px] sm:py-[clamp(88px,10vh,140px)]", className)}
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
          <div data-solid data-depth="title" className="flex items-end gap-4 sm:gap-6">
            <span aria-hidden className="mb-1.5 h-9 w-1 bg-ion shadow-[0_0_18px_rgb(var(--ion)/0.35)] sm:h-12" />
            <h2
              className="block w-fit font-display font-semibold uppercase leading-[0.85] text-bone"
              style={{ fontSize: "clamp(2.75rem, 5vw, 4.75rem)" }}
            >
              {title}
            </h2>
          </div>
        </Reveal>
        <div className="mt-10 sm:mt-14">{children}</div>
      </div>
    </section>
  );
}
