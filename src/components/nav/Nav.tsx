"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";
import { SECTIONS } from "@/data/sections";
import { editorial } from "@/data/editorial";
import { SectionIndex } from "./SectionIndex";
import { lenisRef } from "@/components/fx/SmoothScroll";
import { activeSection, type SectionAnchor } from "@/lib/sectionNavigation";

const items = SECTIONS.filter((s) => s.nav);
const contact = items.find(item => item.id === "contact")!;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let anchors: SectionAnchor[] = [];
    let height = 1;
    let maxScroll = 1;
    let frame = 0;
    const sync = () => {
      frame = 0;
      setScrolled(window.scrollY > 40);
      setActive(activeSection(window.scrollY, height, maxScroll, anchors));
    };
    const measure = () => {
      height = window.innerHeight;
      maxScroll = document.documentElement.scrollHeight - height;
      anchors = items.flatMap(item => {
        const element = document.getElementById(item.id);
        return element ? [{ id: item.id, top: element.getBoundingClientRect().top + window.scrollY }] : [];
      });
      sync();
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(sync); };
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Phone menu: scroll lock, Escape, focus in and back out, and auto-close past md
  // (a resize past the breakpoint hides the overlay but would leave the body locked).
  useEffect(() => {
    if (!open) return;
    const btn = btnRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.setAttribute("data-modal", "1");
    lenisRef.current?.stop();
    document.dispatchEvent(new Event("portfolio:pause-previews"));
    const shielded = Array.from(document.querySelectorAll<HTMLElement>("#content, footer"));
    const priorInert = shielded.map(el => el.hasAttribute("inert"));
    shielded.forEach(el => el.setAttribute("inert", ""));
    menuRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key !== "Tab") return;
      const links = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
      const controls = [btn, ...links].filter((el): el is HTMLElement => !!el && el.getClientRects().length > 0);
      const index = controls.indexOf(document.activeElement as HTMLElement);
      if (index < 0 || (e.shiftKey && index === 0) || (!e.shiftKey && index === controls.length - 1)) {
        e.preventDefault();
        (e.shiftKey ? controls[controls.length - 1] : controls[0])?.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => { if (mq.matches) setOpen(false); };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      document.body.style.overflow = prevOverflow;
      document.documentElement.removeAttribute("data-modal");
      lenisRef.current?.start();
      shielded.forEach((el, i) => { if (!priorInert[i]) el.removeAttribute("inert"); });
      btn?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <header
        data-solid
        data-scrolled={scrolled}
        data-menu-open={open}
        className="portfolio-theme folio-nav fixed inset-x-0 top-0 z-nav"
      >
        <nav className="mv-col nav-masthead" aria-label="Primary">
          <div className="nav-identity"><a href="#hero" className="nav-home" aria-label="MrVayn, home" onClick={() => setOpen(false)}>
            <span className="nav-wordmark" aria-hidden>mv.</span>
          </a><span id="cursor-control-slot" /></div>

          <div className="nav-desktop">
            <SectionIndex active={active} />
            <a
              href="#contact"
              aria-current={active === "contact" ? "location" : undefined}
              className="nav-contact"
            >
              {contact.label}
              <span className="nav-contact-icon" aria-hidden><ArrowDownRight size={19} /></span>
            </a>
          </div>

          <button
            ref={btnRef}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="nav-menu-toggle"
          >
            <span>{open ? editorial.navClose : editorial.navMenu}</span>
            <span className="nav-menu-glyph" aria-hidden><span /><span /></span>
          </button>
        </nav>
      </header>

      {open && (
        <nav
          id="mobile-menu"
          data-lenis-prevent
          ref={menuRef}
          aria-label="Menu"
          className="portfolio-theme folio-menu fixed inset-0 z-hud overflow-y-auto overscroll-contain bg-void"
        >
          <div className="menu-content">
            <div className="menu-index">
              {items.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === item.id ? "location" : undefined}
                >
                  {item.label}
                  <ArrowDownRight aria-hidden size={25} />
                </a>
              ))}
            </div>
            <div className="menu-socials">
              {socials.map((s) =>
                s.href ? (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.name}
                  </a>
                ) : (
                  <span key={s.name} className="menu-handle">
                    {s.name}: <span>{s.handle}</span>
                  </span>
                ),
              )}
            </div>
            <a href={profile.emailHref} className="menu-email" onClick={() => setOpen(false)}>
              <span><span>{editorial.contactEmail}</span><small>{profile.email}</small></span>
              <span className="nav-contact-icon" aria-hidden><ArrowUpRight size={21} /></span>
            </a>
          </div>
        </nav>
      )}
    </>
  );
}
