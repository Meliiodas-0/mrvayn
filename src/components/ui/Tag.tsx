import { cn } from "@/lib/cn";

interface TagProps {
  children: React.ReactNode;
  /** Use surge text for emphasis (e.g. signature tech). */
  accent?: boolean;
  className?: string;
}

/** Mono chip for tech tags / metadata (DESIGN_SYSTEM §4). */
export function Tag({ children, accent = false, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-block border border-steel bg-steel/40 px-2 py-1 font-mono text-[0.7rem] uppercase tracking-wider",
        accent ? "text-surge" : "text-mist",
        className,
      )}
    >
      {children}
    </span>
  );
}
