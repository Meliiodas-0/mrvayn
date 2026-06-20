"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX, Menu, X, Play } from "lucide-react";
import { cn } from "@/lib/cn";

const items = [
  { id: "operator", label: "Operator" },
  { id: "loadout", label: "Loadout" },
  { id: "arsenal", label: "Arsenal" },
  { id: "timeline", label: "Timeline" },
  { id: "comms", label: "Comms" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [muted, setMuted] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (window.scrollY < window.innerHeight * 0.6) setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const play = () => {
    setOpen(false);
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
    window.dispatchEvent(new CustomEvent("overdrive:play"));
  };

  const toggleSound = () => {
    setMuted((m) => {
      const next = !m;
      window.dispatchEvent(new CustomEvent("overdrive:sound", { detail: { muted: next } }));
      return next;
    });
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          scrolled ? "border-b border-steel/70 bg-void/85 backdrop-blur-md" : "border-b border-transparent",
        )}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4" aria-label="Primary">
          <a href="#hero" className="group flex items-center gap-2.5">
            <span aria-hidden className="bevel-sm inline-block h-6 w-6 bg-surge transition-transform group-hover:scale-110" />
            <span className="font-display text-lg font-black uppercase tracking-wide text-bone">MrVayn</span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "relative font-hud text-xs uppercase tracking-[0.18em] transition-colors",
                  active === item.id ? "text-bone" : "text-mist hover:text-bone",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px bg-surge transition-all duration-300",
                    active === item.id ? "w-full" : "w-0",
                  )}
                />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              aria-label={muted ? "Enable sound" : "Mute sound"}
              aria-pressed={!muted}
              className="grid h-9 w-9 place-items-center border border-steel text-mist transition-colors hover:border-surge/60 hover:text-bone bevel-sm"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button
              onClick={play}
              className="hidden items-center gap-2 border border-bone/25 px-4 py-2 font-hud text-xs uppercase tracking-[0.16em] text-bone transition-colors hover:border-surge/60 hover:text-surge bevel-sm sm:inline-flex"
            >
              <Play className="h-3.5 w-3.5" />
              Play
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="grid h-9 w-9 place-items-center text-bone md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 bg-void/95 backdrop-blur-md md:hidden">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className="font-hud text-2xl uppercase tracking-[0.16em] text-mist hover:text-surge"
            >
              {item.label}
            </a>
          ))}
          <button onClick={play} className="mt-2 inline-flex items-center gap-2 bg-surge px-6 py-3 font-hud text-sm uppercase tracking-[0.16em] text-void bevel-sm">
            <Play className="h-4 w-4" /> Play
          </button>
        </div>
      )}
    </>
  );
}
