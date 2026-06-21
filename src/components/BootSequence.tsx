"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * Cinematic intro (DESIGN_SYSTEM §5). A sword-slash light beam wipes across the
 * void, the MRVAYN wordmark assembles letter-by-letter with neon bloom, then it
 * dissolves into the site. Auto-plays once per session, auto-dismisses (~3.4s),
 * and is skippable (click / any key). Honors prefers-reduced-motion (skips).
 * Built in CSS/Framer (no canvas) so it renders reliably everywhere.
 */
const WORD = "MRVAYN".split("");
const TOTAL_MS = 3400;

export function BootSequence() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("booted") === "1";
      sessionStorage.setItem("booted", "1");
    } catch {
      /* privacy mode */
    }
    if (reduce || seen) return;
    setShow(true);
    const t = setTimeout(() => setLeaving(true), TOTAL_MS);
    const t2 = setTimeout(() => setShow(false), TOTAL_MS + 600);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [reduce]);

  const skip = useCallback(() => { setLeaving(true); setTimeout(() => setShow(false), 450); }, []);

  useEffect(() => {
    if (!show) return;
    const onKey = () => skip();
    window.addEventListener("keydown", onKey, { once: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [show, skip]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          onClick={skip}
          initial={{ opacity: 1 }}
          animate={{ opacity: leaving ? 0 : 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] grid cursor-pointer place-items-center overflow-hidden bg-void"
        >
          <style>{`
            @keyframes introSpeed { from { transform: translateX(60%); opacity: 0 } 20%,80% { opacity: .5 } to { transform: translateX(-160%); opacity: 0 } }
            @keyframes introScan { from { background-position: 0 0 } to { background-position: 0 6px } }
            .intro-scan { background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(25,224,255,.05) 2px, rgba(25,224,255,.05) 3px); animation: introScan 1s linear infinite; }
            .intro-speed { animation: introSpeed 0.9s linear infinite; }
          `}</style>

          {/* scanlines + grain */}
          <div aria-hidden className="intro-scan pointer-events-none absolute inset-0 opacity-60" />
          <div aria-hidden className="grain pointer-events-none absolute inset-0" />

          {/* speed lines */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {[18, 32, 47, 58, 71, 84].map((top, i) => (
              <span
                key={top}
                className="intro-speed absolute h-px bg-volt/40"
                style={{ top: `${top}%`, left: 0, right: 0, animationDelay: `${i * 0.13}s` }}
              />
            ))}
          </div>

          {/* center stage */}
          <div className="relative flex flex-col items-center">
            {/* slash beam wipe */}
            <motion.span
              aria-hidden
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.7, times: [0, 0.35, 0.7, 1], delay: 0.5, ease: "easeOut" }}
              className="absolute top-1/2 h-[3px] w-[120vw] origin-left"
              style={{ background: "linear-gradient(90deg, transparent, #FF2D6B, #B26BFF, #19E0FF, transparent)", boxShadow: "0 0 24px rgba(255,45,107,.7)" }}
            />
            {/* flash */}
            <motion.span
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.3, delay: 0.95 }}
              className="pointer-events-none fixed inset-0 bg-bone"
            />

            {/* wordmark */}
            <h1 className="flex font-anton text-bone" style={{ fontSize: "clamp(3rem, 12vw, 8rem)", lineHeight: 1 }}>
              {WORD.map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.4, delay: 1.05 + i * 0.06, ease: "easeOut" }}
                  className="text-glow-surge"
                >
                  {ch}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.6em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="mt-3 font-hud text-xs uppercase text-surge sm:text-sm"
            >
              Founder &amp; Game Developer
            </motion.p>
          </div>

          {/* bottom load bar */}
          <div className="absolute bottom-12 left-1/2 h-px w-44 -translate-x-1/2 overflow-hidden bg-steel">
            <motion.span
              className="block h-full bg-surge"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: TOTAL_MS / 1000, ease: "easeInOut" }}
            />
          </div>
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[0.65rem] uppercase tracking-widest text-mist/50">
            click / key to skip
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
