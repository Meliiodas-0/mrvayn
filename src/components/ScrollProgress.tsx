"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

const DevMotionTuner =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("./fx/DevMotionTuner").then((mod) => mod.DevMotionTuner), { ssr: false })
    : null;

/**
 * The top signal line is tied to real scroll progress with a damped Motion spring.
 * Local development swaps in the DialKit-backed version so tuning code is not part
 * of the production route.
 */
export function ScrollProgress() {
  if (DevMotionTuner) return <DevMotionTuner />;
  return <ProductionProgress />;
}

function ProductionProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 170,
    damping: 30,
    mass: 0.32,
  });

  return (
    <motion.div
      aria-hidden
      className="portfolio-theme pointer-events-none fixed inset-x-0 top-0 z-chrome h-[2px] origin-left bg-ion"
      style={{ scaleX: reduce ? scrollYProgress : scaleX }}
    />
  );
}
