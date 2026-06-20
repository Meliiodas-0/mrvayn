"use client";

import { Play } from "lucide-react";
import { BevelButton } from "@/components/ui/BevelButton";

/** Scrolls to the hero and signals the game to start (game added in Phase 3). */
export function PlayButton({ variant = "ghost" }: { variant?: "primary" | "ghost" }) {
  const play = () => {
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
    window.dispatchEvent(new CustomEvent("overdrive:play"));
  };
  return (
    <BevelButton variant={variant} onClick={play}>
      <Play className="h-4 w-4" />
      Play
    </BevelButton>
  );
}
