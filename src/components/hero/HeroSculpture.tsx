"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useReducedMotion, useScroll, useSpring } from "motion/react";
import { HERO_MOTION, HERO_TUNING_EVENT, type HeroMotion } from "@/lib/heroMotion";
import { SculptureFallback } from "./SculptureFallback";
import type { SculptureRenderer } from "./sculptureRenderer";
import { pageOutro, readingOpacity, scrollChapter } from "./sculptureTimeline";

export function HeroSculpture() {
  const host = useRef<HTMLDivElement>(null);
  const renderer = useRef<SculptureRenderer>();
  const [ready, setReady] = useState(false);
  const [tuning, setTuning] = useState<HeroMotion>(HERO_MOTION);
  const reduce = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: tuning.stiffness, damping: tuning.damping, mass: .7 });
  const smoothY = useSpring(pointerY, { stiffness: tuning.stiffness, damping: tuning.damping, mass: .7 });
  const { scrollY } = useScroll();
  const smoothScroll = useSpring(scrollY, { stiffness: tuning.scrollStiffness, damping: tuning.scrollDamping, mass: .5 });

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let cancelled = false;
    let loading = false;
    const load = async () => {
      if (loading || cancelled) return;
      loading = true;
      try {
        const { createSculpture } = await import("./sculptureRenderer");
        if (cancelled) return;
        const scene = createSculpture(element, () => setReady(false));
        renderer.current = scene;
        scene.setVisible(!document.hidden);
        setReady(true);
      } catch {
        // The server-rendered wordmark remains if WebGL or its chunk is unavailable.
        if (!cancelled) setReady(false);
      }
    };
    const observe = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { observe.disconnect(); void load(); }
    });
    observe.observe(element);
    return () => {
      cancelled = true;
      observe.disconnect();
      renderer.current?.dispose();
      renderer.current = undefined;
    };
  }, []);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const reset = () => { pointerX.set(0); pointerY.set(0); };
    const move = (event: PointerEvent) => {
      if (reduce || event.pointerType === "touch" || document.documentElement.hasAttribute("data-modal")) return;
      pointerX.set(Math.max(-1, Math.min(1, (event.clientX / window.innerWidth) * 2 - 1)));
      pointerY.set(Math.max(-1, Math.min(1, (event.clientY / window.innerHeight) * 2 - 1)));
    };
    const tap = (event: PointerEvent) => {
      if (reduce || event.pointerType !== "touch" || document.documentElement.hasAttribute("data-modal")) return;
      pointerX.set((event.clientX / window.innerWidth - .5) * .65);
      pointerY.set((event.clientY / window.innerHeight - .5) * .4);
    };
    const release = (event: PointerEvent) => { if (event.pointerType === "touch") reset(); };
    if (reduce) { reset(); smoothX.jump(0); smoothY.jump(0); }
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", tap, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", reset);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", tap);
      document.documentElement.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", reset);
    };
  }, [reduce, pointerX, pointerY, smoothX, smoothY]);

  useEffect(() => {
    const element = host.current;
    const content = document.getElementById("content");
    const hero = document.getElementById("hero");
    if (!element || !content || !hero) return;
    let anchors: number[] = [];
    let end = 0;
    let maxScroll = 1;
    let heroHeight = 1;
    let viewportHeight = 1;
    let phone = false;
    const canvas = element.querySelector<HTMLCanvasElement>("canvas");
    const render = () => {
      const position = reduce ? scrollY.get() : smoothScroll.get();
      const distance = Math.max(0, position / heroHeight);
      const outro = pageOutro(position, end, maxScroll, viewportHeight);
      const active = reduce ? distance < 1.1 : phone ? distance < tuning.scrollSpan + .15 : outro < 1;
      if (canvas) canvas.style.opacity = active ? String(phone || reduce ? 1 : readingOpacity(distance, tuning.readingOpacity) * (1 - outro)) : "0";
      renderer.current?.setVisible(active && !document.hidden && !document.documentElement.hasAttribute("data-modal"));
      renderer.current?.update(reduce ? 0 : smoothX.get(), reduce ? 0 : smoothY.get(), tuning, {
        distance: reduce ? 0 : distance,
        chapter: reduce ? 0 : scrollChapter(position + viewportHeight * .4, anchors),
        outro: reduce ? 0 : outro,
      });
    };
    const measure = () => {
      viewportHeight = Math.max(1, window.innerHeight);
      maxScroll = Math.max(1, document.documentElement.scrollHeight - viewportHeight);
      heroHeight = Math.max(1, hero.offsetHeight);
      phone = element.clientWidth < 640;
      anchors = ["work", "about", "impact", "showreel", "skills", "journey"].map(id => {
        const section = document.getElementById(id);
        return section ? section.getBoundingClientRect().top + window.scrollY : 0;
      });
      const contact = document.getElementById("contact");
      end = contact ? contact.getBoundingClientRect().top + window.scrollY : content.scrollHeight;
      render();
    };
    smoothScroll.jump(window.scrollY);
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    const footer = document.querySelector("footer");
    if (footer) observer.observe(footer);
    const modalObserver = new MutationObserver(render);
    modalObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-modal"] });
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", render);
    const stopX = smoothX.on("change", render);
    const stopY = smoothY.on("change", render);
    const stopScroll = (reduce ? scrollY : smoothScroll).on("change", render);
    measure();
    return () => {
      stopX(); stopY(); stopScroll(); observer.disconnect(); modalObserver.disconnect();
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", render);
    };
  }, [ready, reduce, smoothX, smoothY, scrollY, smoothScroll, tuning]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const update = (event: Event) => setTuning((event as CustomEvent<HeroMotion>).detail);
    window.addEventListener(HERO_TUNING_EVENT, update);
    return () => window.removeEventListener(HERO_TUNING_EVENT, update);
  }, []);

  return <div ref={host} className="sculpture-stage" data-renderer={ready ? "webgl" : "fallback"} data-scroll-motion={ready && !reduce ? "on" : "off"} aria-hidden="true">
    <SculptureFallback />
  </div>;
}
