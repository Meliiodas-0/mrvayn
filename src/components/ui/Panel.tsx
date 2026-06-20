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
      className={cn(
        "relative bevel border border-steel bg-carbon",
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
