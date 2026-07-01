import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Slight skew-in for kinetic feel (NFS). */
  skew?: boolean;
}

/**
 * Fade + rise reveal via a PURE-CSS animation (`.mv-reveal` in globals.css), no
 * framer-motion. framer's animations don't apply on iOS WebKit and were leaving the
 * page blank; this only animates toward opacity 1 and the base state is visible, so
 * content can never stay hidden. Server-renderable, so the copy is in the SSR HTML.
 * Honors prefers-reduced-motion (keyframes only run under no-preference).
 */
export function Reveal({ children, className, delay = 0, skew = false }: RevealProps) {
  return (
    <div
      className={[skew ? "mv-reveal-skew" : "mv-reveal", className].filter(Boolean).join(" ")}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
