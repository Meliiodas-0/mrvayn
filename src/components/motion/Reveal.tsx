import type { ReactNode } from "react";

type Fx = "up" | "left" | "right" | "pop" | "tilt" | "glass" | "deal-l" | "deal-r" | "flip";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Kept for API compat: skew maps to the "tilt" variant. */
  skew?: boolean;
  /** Scroll-animation variant (v4): up | left | right | pop | tilt | glass. */
  fx?: Fx;
}

/**
 * v4 scroll reveal: server-renderable div tagged [data-sfx]; ScrollFx adds .sfx-in
 * when it enters the viewport and the CSS variant plays once (stagger via delay).
 * The base state is VISIBLE (never opacity:0 in markup), so content can never be
 * left hidden if JS fails, the hard iOS lesson. Reduced-motion gated in CSS.
 */
export function Reveal({ children, className, delay = 0, skew = false, fx }: RevealProps) {
  const variant: Fx = fx ?? (skew ? "tilt" : "up");
  return (
    <div
      data-sfx={variant}
      className={className}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
