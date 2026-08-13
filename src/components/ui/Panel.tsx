import { cn } from "@/lib/cn";

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show the signature 2px red edge on the left. */
  edge?: boolean;
  /** Card hover treatment (v3): bg-3, line-2 border, red left edge, -2px lift, 200ms. */
  interactive?: boolean;
  /** Kept for API compat; v3 cards share one radius. */
  compact?: boolean;
}

/** v3 card: bg-2, 1px line-1 hairline, 4px radius, sharp and instrument-like. */
export function Panel({ className, edge = false, interactive = false, compact: _c, children, ...props }: PanelProps) {
  return (
    <div
      data-solid
      className={cn(
        // v4 glass card (blur + inner light edge); ROG ghosts through the glass.
        // spot-card = cursor spotlight (FxLayer).
        "spot-card glass relative overflow-hidden rounded-lg",
        interactive &&
          "transition-[background-color,border-color,transform,box-shadow] duration-200 ease-snap hover:-translate-y-[2px] hover:border-line2 hover:bg-[rgba(236,240,247,0.8)]",
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
