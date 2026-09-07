"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";
import { SECTIONS } from "@/data/sections";
import { BevelButton } from "@/components/ui/BevelButton";

const items = SECTIONS.filter((s) => s.nav);

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

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

  // Phone menu: scroll lock, Escape, focus in and back out, and auto-close past md
  // (a resize past the breakpoint hides the overlay but would leave the body locked).
  useEffect(() => {
    if (!open) return;
    const btn = btnRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.setAttribute("data-modal", "1");
    menuRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => { if (mq.matches) setOpen(false); };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      document.body.style.overflow = prevOverflow;
      document.documentElement.removeAttribute("data-modal");
      btn?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <header
        data-solid
        className={cn(
          "fixed inset-x-0 top-0 z-nav border-b border-steel transition-[background-color,box-shadow] duration-300",
          !scrolled && "backdrop-blur-md",
          scrolled && "shadow-[0_8px_30px_var(--ink-dim)]",
        )}
        // Solid once scrolled: the translucent header turned pink over the red Showreel band.
        style={{ backgroundColor: scrolled ? "rgb(var(--void))" : "rgb(var(--void) / 0.78)" }}
      >
        <nav className="mv-col flex items-center justify-between py-4" aria-label="Primary">
          <a href="#hero" className="group flex items-center gap-2.5">
            <span aria-hidden className="inline-block h-6 w-6 rounded bg-ion transition-transform duration-200 ease-snap group-hover:scale-110" />
            <span className="font-display text-lg font-semibold uppercase text-bone">MrVayn</span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {items.filter((i) => i.id !== "contact").map((item) => (
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
              href="#contact"
              className={cn(
                "rounded border px-4 py-2 font-mono text-xs uppercase text-bone transition-colors duration-200 ease-snap hover:border-surge",
                active === "contact" ? "border-surge" : "border-line2",
              )}
            >
              Contact
            </a>
          </div>

          <button
            ref={btnRef}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-mr-1 grid h-11 w-11 place-items-center text-bone md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      {open && (
        <nav
          id="mobile-menu"
          ref={menuRef}
          aria-label="Menu"
          className="fixed inset-0 z-hud flex flex-col overflow-y-auto overscroll-contain bg-void/95 px-6 pb-10 pt-24 backdrop-blur-md md:hidden"
        >
          <div className="mt-auto">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                aria-current={active === item.id ? "true" : undefined}
                className="flex items-baseline gap-4 border-b border-steel/60 py-4 font-display text-[2.25rem] font-semibold uppercase text-bone"
              >
                <span className="font-mono text-xs text-volt">{item.index}</span>
                {item.label}
                <span aria-hidden className={cn("ml-auto h-1.5 w-1.5 rounded-full bg-ion", active === item.id ? "opacity-100" : "opacity-0")} />
              </a>
            ))}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs uppercase text-mist">
              {socials.map((s) =>
                s.href ? (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center hover:text-surge">
                    {s.name}
                  </a>
                ) : (
                  <span key={s.name} className="inline-flex min-h-10 items-center">
                    {s.name}: <span className="ml-1 normal-case text-bone">{s.handle}</span>
                  </span>
                ),
              )}
            </div>
            <BevelButton href={profile.emailHref} variant="ghost" className="mt-6 w-full" onClick={() => setOpen(false)}>
              Email me
            </BevelButton>
          </div>
        </nav>
      )}
    </>
  );
}
