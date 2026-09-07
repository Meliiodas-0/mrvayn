import { cn } from "@/lib/cn";

interface TagProps {
  children: React.ReactNode;
  /** Red text for released builds (LIVE / SHIPPED). */
  accent?: boolean;
  size?: "sm" | "md";
  /** glass = white/40 pane (default), flat = card grey. */
  tone?: "glass" | "flat";
  as?: "span" | "li";
  className?: string;
}

/** The one chip: mono, uppercase, 4px radius, steel hairline. */
export function Tag({ children, accent = false, size = "md", tone = "glass", as: Comp = "span", className }: TagProps) {
  return (
    <Comp
      className={cn(
        "inline-block rounded border border-steel font-mono uppercase",
        size === "sm" ? "px-1.5 py-[3px] text-meta-xs sm:px-2" : "px-1.5 py-[3px] text-meta-xs sm:px-2 sm:py-1",
        tone === "glass" ? "bg-white/40" : "bg-carbon",
        accent ? "text-surge" : "text-volt",
        className,
      )}
    >
      {children}
    </Comp>
  );
}
