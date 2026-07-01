"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { profile } from "@/data/profile";

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

  return (
    <>
      <header
        data-solid
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          scrolled ? "border-b border-steel/70 bg-void/85 backdrop-blur-md" : "border-b border-transparent",
        )}
      >
        {/* Full-bleed HUD bar: logo anchored to the left edge, links to the right.
            Right padding reserves room for the fixed theme-palette button (right-4, w-10). */}
        <nav className="flex w-full items-center justify-between py-4 pl-5 pr-16 sm:pl-7 sm:pr-[4.5rem]" aria-label="Primary">
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
                <span className={cn("absolute -bottom-1.5 left-0 h-px bg-surge transition-all duration-300", active === item.id ? "w-full" : "w-0")} />
              </a>
            ))}
            <a
              href={profile.emailHref}
              target="_blank"
              rel="noopener noreferrer"
              className="bevel-sm border border-bone/25 px-4 py-2 font-hud text-xs uppercase tracking-[0.16em] text-bone transition-colors hover:border-surge/60 hover:text-surge"
            >
              Let&apos;s talk
            </a>
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center text-bone md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 bg-void/95 backdrop-blur-md md:hidden">
          {items.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)} className="font-hud text-2xl uppercase tracking-[0.16em] text-mist hover:text-surge">
              {item.label}
            </a>
          ))}
          <a href={profile.emailHref} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="mt-2 bevel-sm bg-surge px-6 py-3 font-hud text-sm uppercase tracking-[0.16em] text-void">
            Let&apos;s talk
          </a>
        </div>
      )}
    </>
  );
}
