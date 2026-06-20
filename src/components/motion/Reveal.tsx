"use client";

import { motion, useReducedMotion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Slight skew-in for kinetic feel (NFS). */
  skew?: boolean;
}

/**
 * Scroll-reveal wrapper (DESIGN_SYSTEM §5): fade + rise (+ optional skew),
 * once. Honors prefers-reduced-motion — renders instantly, no transform.
 * Content is always in the DOM, so SEO/crawling is unaffected.
 */
export function Reveal({ children, className, delay = 0, skew = false }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26, skewX: skew ? -3 : 0 }}
      whileInView={{ opacity: 1, y: 0, skewX: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
