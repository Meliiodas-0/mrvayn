"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { profile } from "@/data/profile";

const items = [
  { id: "operator", label: "About" },
  { id: "loadout", label: "Work" },
  { id: "arsenal", label: "Skills" },
  { id: "timeline", label: "Journey" },
  { id: "comms", label: "Contact" },
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
          "fixed inset-x-0 top-0 z-50 border-b border-steel backdrop-blur-md transition-shadow duration-300",
          scrolled && "shadow-[0_8px_30px_var(--ink-dim)]",
        )}
        style={{ backgroundColor: "rgba(238, 241, 246, 0.78)" }}
      >
        <nav className="flex w-full items-center justify-between py-4 pl-5 pr-5 sm:pl-7 sm:pr-7" aria-label="Primary">
          <a href="#hero" className="group flex items-center gap-2.5">
            <span aria-hidden className="bevel-sm inline-block h-6 w-6 bg-ion transition-transform duration-200 ease-snap group-hover:scale-110" />
            <span className="font-display text-lg font-semibold uppercase text-bone">MrVayn</span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "relative inline-flex items-center gap-2 font-mono text-xs uppercase transition-colors duration-200 ease-snap",
                  active === item.id ? "text-bone" : "text-volt hover:text-bone",
                )}
              >
                {/* active section = red dot + mono label */}
                <span
                  aria-hidden
                  className={cn("h-1.5 w-1.5 rounded-full bg-ion transition-opacity duration-200", active === item.id ? "opacity-100" : "opacity-0")}
                />
                {item.label}
              </a>
            ))}
            <a
              href={profile.emailHref}
              target="_blank"
              rel="noopener noreferrer"
              className="bevel-sm border border-line2 px-4 py-2 font-mono text-xs uppercase text-bone transition-colors duration-200 ease-snap hover:border-surge"
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
