import type { ReactNode } from "react";

type Fx = "up" | "left" | "right" | "pop" | "tilt" | "glass";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Authored delay in seconds (the hero cascade); otherwise ScrollFx staggers
   *  whatever enters the viewport together. */
  delay?: number;
  /** Scroll-animation variant: up | left | right | pop | tilt | glass. */
  fx?: Fx;
}

/**
 * Scroll reveal: server-renderable div tagged [data-sfx]; ScrollFx adds .sfx-in
 * when it enters the viewport and the CSS variant plays once.
 * The base state is VISIBLE (never opacity:0 in markup), so content can never be
 * left hidden if JS fails, the hard iOS lesson. Reduced-motion gated in CSS.
 */
export function Reveal({ children, className, delay = 0, fx = "up" }: RevealProps) {
  return (
    <div
      data-sfx={fx}
      className={className}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
