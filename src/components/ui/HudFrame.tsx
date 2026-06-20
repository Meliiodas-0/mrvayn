import { cn } from "@/lib/cn";

interface HudFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Add a faint scanline overlay (for hero/game/featured media). */
  scanlines?: boolean;
}

/** Corner-bracket HUD frame (DESIGN_SYSTEM §4). Decorative; pointer-transparent. */
export function HudFrame({ className, scanlines = false, children, ...props }: HudFrameProps) {
  return (
    <div className={cn("relative", className)} {...props}>
      {children}
      {scanlines && <span aria-hidden className="scanlines pointer-events-none absolute inset-0" />}
      {/* corner brackets */}
      <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-surge/60" />
      <span aria-hidden className="pointer-events-none absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-surge/60" />
      <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-surge/60" />
      <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-surge/60" />
    </div>
  );
}
