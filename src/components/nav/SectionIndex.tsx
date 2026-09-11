"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SECTIONS } from "@/data/sections";
import { NAV_MOTION, NAV_TUNING_EVENT, type NavMotion } from "@/lib/navMotion";

const sections = SECTIONS.filter(item => item.nav && item.id !== "contact");

export function SectionIndex({ active }: { active: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState("");
  const [focused, setFocused] = useState("");
  const [marker, setMarker] = useState({ x: 0, width: 0 });
  const [tuning, setTuning] = useState<NavMotion>(NAV_MOTION);
  const reduce = useReducedMotion();
  const preview = hovered || focused || active;

  useEffect(() => { setFocused(""); }, [active]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const measure = () => {
      const link = Array.from(element.querySelectorAll<HTMLAnchorElement>("a[data-section]"))
        .find(anchor => anchor.dataset.section === preview);
      if (!link || !link.offsetWidth) { setMarker(previous => ({ ...previous, width: 0 })); return; }
      setMarker({ x: link.offsetLeft + tuning.inset, width: Math.max(0, link.offsetWidth - tuning.inset * 2) });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.querySelectorAll("a").forEach(link => observer.observe(link));
    measure();
    return () => observer.disconnect();
  }, [preview, tuning.inset]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const update = (event: Event) => setTuning((event as CustomEvent<NavMotion>).detail);
    window.addEventListener(NAV_TUNING_EVENT, update);
    return () => window.removeEventListener(NAV_TUNING_EVENT, update);
  }, []);

  return <div className="nav-index" ref={root} onPointerLeave={() => setHovered("")} data-preview={!!(hovered || focused)}>
    {sections.map(item => <a
      key={item.id}
      href={`#${item.id}`}
      data-section={item.id}
      className="nav-index-link"
      aria-current={active === item.id ? "location" : undefined}
      onPointerEnter={event => { if (event.pointerType !== "touch") setHovered(item.id); }}
      onFocus={event => { if (event.currentTarget.matches(":focus-visible")) setFocused(item.id); }}
      onBlur={() => setFocused("")}
    >{item.label}</a>)}
    <motion.span
      aria-hidden
      className="nav-index-marker"
      initial={false}
      animate={{ x: marker.x, scaleX: marker.width, opacity: marker.width ? 1 : 0 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: tuning.stiffness, damping: tuning.damping, mass: .4, opacity: { duration: .12 } }}
    />
  </div>;
}
