"use client";

import { useEffect, useState } from "react";
import { FlipText } from "@/components/vendor/flip-text";

/** VengenceUI FlipText driving the cycling hero role: every word swap plays the
 *  library's per-character 3D flip. First word is server-rendered (safe). */
export function RoleFlip({ words, interval = 3000 }: { words: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);
  return (
    <span className="inline-block">
      <FlipText key={i} loop={false} duration={0.9}>
        {words[i]}
      </FlipText>
    </span>
  );
}
