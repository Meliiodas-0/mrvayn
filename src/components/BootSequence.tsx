"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * One-time boot-in overlay (DESIGN_SYSTEM §5): scanline sweep + progress snap,
 * ~1.3s, skippable (click / any key). Shows once per session. Honors
 * prefers-reduced-motion (skips entirely) and is SSR-safe (renders nothing
 * until mounted, so no hydration flash and no empty-HTML impact).
 */
export function BootSequence() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("booted") === "1";
      sessionStorage.setItem("booted", "1");
    } catch {
      /* privacy mode — treat as unseen, harmless */
    }
    if (reduced || seen) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 1300);
    return () => clearTimeout(t);
  }, []);

  const skip = useCallback(() => setShow(false), []);

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
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onClick={skip}
          role="presentation"
          className="fixed inset-0 z-[100] grid cursor-pointer place-items-center overflow-hidden bg-void"
        >
          <motion.span
            aria-hidden
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{ duration: 1, ease: "linear" }}
            className="absolute inset-x-0 h-px bg-surge/70"
          />
          <div className="flex flex-col items-center gap-4">
            <span className="font-hud text-sm uppercase tracking-[0.3em] text-bone">Initializing</span>
            <div className="h-px w-40 overflow-hidden bg-steel">
              <motion.span
                className="block h-full bg-surge"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </div>
            <span className="font-mono text-[0.7rem] tracking-widest text-mist">{"// OVERDRIVE"}</span>
          </div>
          <span className="absolute bottom-6 font-mono text-[0.7rem] text-mist/50">click / key to skip</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
