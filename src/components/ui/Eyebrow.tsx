import { cn } from "@/lib/cn";

interface EyebrowProps {
  children: React.ReactNode;
  /** Only pass when the order is real (e.g. a timeline), never as decoration. */
  index?: string;
  className?: string;
}

/** Section label / eyebrow, Chakra Petch, uppercase, tracked (DESIGN_SYSTEM §4). */
export function Eyebrow({ children, index, className }: EyebrowProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-hud text-xs uppercase tracking-[0.28em] text-surge", className)}>
      {index && <span className="text-mist tabular-nums">{index}</span>}
      <span aria-hidden className="h-px w-6 bg-surge/50" />
      <span className="text-bone/90">{children}</span>
    </span>
  );
}
