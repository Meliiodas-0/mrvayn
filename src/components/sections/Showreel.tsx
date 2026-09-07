"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { reelFrames } from "@/data/showreel";
import { editorial } from "@/data/editorial";
import { SectionShell } from "@/components/ui/SectionShell";

export function Showreel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const sync = () => setEdges({ start: track.scrollLeft < 4, end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4 });
    track.addEventListener("scroll", sync, { passive: true });
    const resize = new ResizeObserver(sync);
    resize.observe(track);
    sync();
    return () => { track.removeEventListener("scroll", sync); resize.disconnect(); };
  }, []);
  const move = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const distance = card ? card.offsetWidth + 24 : track.clientWidth * .8;
    track.scrollBy({ left: direction * distance, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return (
    <SectionShell id="showreel" title={editorial.reelTitle} alt>
      <div className="reel-toolbar" data-solid>
        <p>{editorial.reelHint}</p>
        <div>
          <button aria-label="Previous captures" aria-controls="project-captures" disabled={edges.start} onClick={() => move(-1)}><ArrowLeft aria-hidden size={20} /></button>
          <button aria-label="Next captures" aria-controls="project-captures" disabled={edges.end} onClick={() => move(1)}><ArrowRight aria-hidden size={20} /></button>
        </div>
      </div>
      <ul id="project-captures" className="capture-strip" ref={trackRef} aria-label="Project captures">
        {reelFrames.map(frame => (
          <li key={frame.id} data-solid>
            <a href={frame.href} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={frame.img} alt={`${frame.title} preview`} width={640} height={360} loading="lazy" />
              <div><h3>{frame.title}</h3><span>{frame.year}</span></div>
            </a>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
