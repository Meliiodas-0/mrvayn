import { cn } from "@/lib/cn";

interface TagProps {
  children: React.ReactNode;
  /** Red text for emphasis (signal tags like LIVE / PLAYABLE). */
  accent?: boolean;
  className?: string;
}

/** v3 tag: mono 11px, fg-3, 1px line-1 hairline, no background. */
export function Tag({ children, accent = false, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-block rounded border border-steel bg-white/40 px-2 py-1 font-mono text-[11px] uppercase",
        accent ? "text-surge" : "text-volt",
        className,
      )}
    >
      {children}
    </span>
  );
}
