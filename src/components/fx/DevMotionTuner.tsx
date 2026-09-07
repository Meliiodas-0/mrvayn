"use client";

import { useEffect } from "react";
import { DialRoot, useDialKit, type DialConfig } from "dialkit";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import "dialkit/styles.css";
import { HERO_MOTION, HERO_TUNING_EVENT } from "@/lib/heroMotion";

const MOTION_CONTROLS = {
  Hero: {
    stiffness: [HERO_MOTION.stiffness, 20, 120, 1] as [number, number, number, number],
    damping: [HERO_MOTION.damping, 12, 40, 1] as [number, number, number, number],
    rotation: [HERO_MOTION.rotation, 0, 0.2, 0.01] as [number, number, number, number],
    lightTravel: [HERO_MOTION.lightTravel, 0, 0.6, 0.01] as [number, number, number, number],
    scrollSpan: [HERO_MOTION.scrollSpan, .65, 1.6, .05] as [number, number, number, number],
    scrollTurn: [HERO_MOTION.scrollTurn, .2, 1.3, .05] as [number, number, number, number],
    scrollStiffness: [HERO_MOTION.scrollStiffness, 80, 300, 5] as [number, number, number, number],
    scrollDamping: [HERO_MOTION.scrollDamping, 20, 50, 1] as [number, number, number, number],
    readingOpacity: [HERO_MOTION.readingOpacity, .1, .4, .01] as [number, number, number, number],
  },
  Mobile: {
    scale: [HERO_MOTION.phoneScale, .22, .36, .01] as [number, number, number, number],
    turn: [HERO_MOTION.phoneTurn, .1, .55, .01] as [number, number, number, number],
    touch: [HERO_MOTION.phoneTouch, 0, 3, .1] as [number, number, number, number],
  },
  Progress: {
    stiffness: [170, 60, 360, 5] as [number, number, number, number],
    damping: [30, 12, 60, 1] as [number, number, number, number],
    mass: [0.32, 0.1, 1.2, 0.02] as [number, number, number, number],
  },
  Reveals: {
    rise: [12, 0, 42, 1] as [number, number, number, number],
    spread: [12, 0, 36, 1] as [number, number, number, number],
    duration: [0.55, 0.2, 1, 0.01] as [number, number, number, number],
  },
} satisfies DialConfig;

export function DevMotionTuner() {
  const reduce = useReducedMotion();
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
    window.dispatchEvent(new CustomEvent(HERO_TUNING_EVENT, {
      detail: {
        ...HERO_MOTION,
        stiffness: tuning.Hero.stiffness,
        damping: tuning.Hero.damping,
        rotation: tuning.Hero.rotation,
        lightTravel: tuning.Hero.lightTravel,
        scrollSpan: tuning.Hero.scrollSpan,
        scrollTurn: tuning.Hero.scrollTurn,
        scrollStiffness: tuning.Hero.scrollStiffness,
        scrollDamping: tuning.Hero.scrollDamping,
        readingOpacity: tuning.Hero.readingOpacity,
        phoneScale: tuning.Mobile.scale,
        phoneTurn: tuning.Mobile.turn,
        phoneTouch: tuning.Mobile.touch,
      },
    }));
  }, [tuning.Hero.stiffness, tuning.Hero.damping, tuning.Hero.rotation, tuning.Hero.lightTravel, tuning.Hero.scrollSpan, tuning.Hero.scrollTurn, tuning.Hero.scrollStiffness, tuning.Hero.scrollDamping, tuning.Hero.readingOpacity, tuning.Mobile.scale, tuning.Mobile.turn, tuning.Mobile.touch]);

  useEffect(() => {
    const root = document.getElementById("content");
    if (!root) return;
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
        className="portfolio-theme pointer-events-none fixed inset-x-0 top-0 z-chrome h-[2px] origin-left bg-ion"
        style={{ scaleX: reduce ? scrollYProgress : scaleX }}
      />
      <DialRoot position="bottom-right" defaultOpen={false} theme="dark" />
    </>
  );
}
