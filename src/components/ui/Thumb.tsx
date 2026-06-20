"use client";

import { useState } from "react";

/** External media thumbnail with graceful fallback (Drive/Roblox may not load).
 *  On error it shows the branded gradient — never a broken-image icon. */
export function Thumb({ src, alt, className = "" }: { src: string | null; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className={"h-full w-full " + className}
        style={{ background: "linear-gradient(120deg, rgb(var(--surge)/0.18), rgb(var(--ion)/0.14) 50%, rgb(var(--volt)/0.12))" }}
        aria-hidden
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={"h-full w-full object-cover " + className}
    />
  );
}
