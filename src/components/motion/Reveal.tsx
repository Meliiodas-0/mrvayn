"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Slight skew-in for kinetic feel (NFS). */
  skew?: boolean;
}

/**
 * Scroll-reveal wrapper (DESIGN_SYSTEM §5): fade + rise (+ optional skew), once.
 * Honors prefers-reduced-motion (renders instantly). Uses a MANUAL
 * IntersectionObserver with a hard timeout fallback so content is NEVER left
 * hidden — framer's whileInView callback can silently drop on iOS Safari, which
 * was rendering the whole page blank. Content is always in the DOM (SEO-safe).
 */
export function Reveal({ children, className, delay = 0, skew = false }: RevealProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    // Safety net: if the observer never fires (iOS quirk), reveal anyway so the
    // page can never stay blank.
    const t = window.setTimeout(() => {
      setShown(true);
      io.disconnect();
    }, 900);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 26, skewX: skew ? -3 : 0 }}
      animate={shown ? { opacity: 1, y: 0, skewX: 0 } : { opacity: 0, y: 26, skewX: skew ? -3 : 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
