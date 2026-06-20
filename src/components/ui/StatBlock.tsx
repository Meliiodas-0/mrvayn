import { cn } from "@/lib/cn";

interface StatBlockProps {
  /** Big number or short word (e.g. "5+", "UE5"). */
  value: React.ReactNode;
  label: React.ReactNode;
  className?: string;
}

/** Big value + small HUD label, for specialties/metrics (DESIGN_SYSTEM §4). */
export function StatBlock({ value, label, className }: StatBlockProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <span
        className="break-words font-display font-black uppercase leading-none text-bone"
        style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
      >
        {value}
      </span>
      <span className="font-hud text-xs uppercase tracking-[0.2em] text-mist">{label}</span>
    </div>
  );
}
