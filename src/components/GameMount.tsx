"use client";

import dynamic from "next/dynamic";

function Placeholder() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center">
      <span className="font-hud text-sm uppercase tracking-[0.3em] text-surge">Stick Arena</span>
      <span className="font-mono text-[0.7rem] tracking-widest text-mist/70">loading…</span>
    </div>
  );
}

// Lazy, client-only — the game chunk loads on demand and never blocks LCP.
const GameCanvas = dynamic(() => import("@/components/GameCanvas"), {
  ssr: false,
  loading: () => <Placeholder />,
});

export function GameMount() {
  return <GameCanvas />;
}
