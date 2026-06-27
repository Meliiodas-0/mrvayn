import { cn } from "@/lib/cn";

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show the signature 2px surge edge on the left. */
  edge?: boolean;
  /** Smaller bevel for compact panels. */
  compact?: boolean;
}

/** Carbon panel with the signature bevel + steel border (DESIGN_SYSTEM §4). */
export function Panel({ className, edge = false, compact = false, children, ...props }: PanelProps) {
  return (
    <div
      data-solid
      className={cn(
        // ~10% translucent so the ROG figure behind the page faintly ghosts through; still 90% solid.
        "relative bevel border border-steel bg-carbon/90",
        compact && "bevel-sm",
        className,
      )}
      {...props}
    >
      {edge && (
        <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-full w-[2px] bg-surge" />
      )}
      {children}
    </div>
  );
}
