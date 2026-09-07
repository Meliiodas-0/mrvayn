"use client";

import { useState } from "react";

/** External media thumbnail with graceful fallback (Drive/Roblox may not load).
 *  On error it shows the branded gradient, never a broken-image icon. */
export function Thumb({ src, alt, className = "" }: { src: string | null; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <div className={"media-fallback h-full w-full " + className} aria-hidden />;
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
