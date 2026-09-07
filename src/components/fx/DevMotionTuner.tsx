"use client";

import { useEffect } from "react";
import { DialRoot, useDialKit, type DialConfig } from "dialkit";
import { motion, useScroll, useSpring } from "motion/react";
import "dialkit/styles.css";

const MOTION_CONTROLS = {
  Progress: {
    stiffness: [170, 60, 360, 5] as [number, number, number, number],
    damping: [30, 12, 60, 1] as [number, number, number, number],
    mass: [0.32, 0.1, 1.2, 0.02] as [number, number, number, number],
  },
  Reveals: {
    rise: [22, 8, 42, 1] as [number, number, number, number],
    spread: [18, 6, 36, 1] as [number, number, number, number],
    duration: [0.72, 0.4, 1, 0.01] as [number, number, number, number],
  },
} satisfies DialConfig;

export function DevMotionTuner() {
  const tuning = useDialKit("Portfolio motion", MOTION_CONTROLS, {
    id: "portfolio-motion",
    defaultCollapsed: false,
    persist: { storage: "sessionStorage", presets: false },
  });
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: tuning.Progress.stiffness,
    damping: tuning.Progress.damping,
    mass: tuning.Progress.mass,
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--reveal-y", `${tuning.Reveals.rise}px`);
    root.style.setProperty("--reveal-x", `${tuning.Reveals.spread}px`);
    root.style.setProperty("--reveal-duration", `${tuning.Reveals.duration}s`);
    return () => {
      root.style.removeProperty("--reveal-y");
      root.style.removeProperty("--reveal-x");
      root.style.removeProperty("--reveal-duration");
    };
  }, [tuning.Reveals.duration, tuning.Reveals.rise, tuning.Reveals.spread]);

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-chrome h-[3px] origin-left bg-ion shadow-[0_0_18px_rgb(var(--ion)/0.45)]"
        style={{ scaleX }}
      />
      <DialRoot position="bottom-right" defaultOpen={false} theme="dark" productionEnabled={false} />
    </>
  );
}
