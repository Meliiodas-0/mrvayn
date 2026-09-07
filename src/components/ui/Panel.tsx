import { cn } from "@/lib/cn";

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show the signature 2px red edge on the left. */
  edge?: boolean;
  /** Card hover treatment: raised ground, line-2 border, 2px lift, 200ms. */
  interactive?: boolean;
}

/** Glass card, 8px radius (rounded-lg); ROG ghosts through the glass. spot-card =
 *  cursor spotlight (FxLayer). data-solid keeps the stickman enemies off it. */
export function Panel({ className, edge = false, interactive = false, children, ...props }: PanelProps) {
  return (
    <div
      data-solid
      className={cn(
        "spot-card glass relative overflow-hidden rounded-lg",
        interactive &&
          "transition-[background-color,border-color,transform,box-shadow] duration-200 ease-snap hover:-translate-y-[2px] hover:border-line2 hover:bg-bg3/80",
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
