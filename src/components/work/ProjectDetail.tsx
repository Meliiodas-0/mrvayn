"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ArrowUpRight, Lock, Play } from "lucide-react";
import type { Project } from "@/data/projects";
import { reelFrames } from "@/data/showreel";
import { driveEmbed, driveThumb } from "@/lib/drive";
import { lenisRef } from "@/components/fx/SmoothScroll";
import { Tag } from "@/components/ui/Tag";
import { Thumb } from "@/components/ui/Thumb";
import { BevelButton } from "@/components/ui/BevelButton";

/** Project detail dialog: Problem -> Approach -> Result + media + links.
 *  Renders only while a project is selected (unmounts on close). Accessible:
 *  Esc/backdrop close, focus trap, page inert behind it, scroll lock, restored focus. */
export function ProjectDetail({ project, onClose }: { project: Project | null; onClose: () => void }) {
  if (!project) return null;
  return <DetailPanel project={project} onClose={onClose} />;
}

const FOCUSABLE = 'a[href],button:not([disabled]),video,iframe,[tabindex]:not([tabindex="-1"])';

function DetailPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const primaryHref = project.links[0]?.href;
  // A self-hosted clip (under /public) wins over any Drive embed; it plays inline
  // with no third-party iframe. Used by the flagship builds without a public link.
  const clip = project.clip ?? null;
  const embed = primaryHref ? driveEmbed(primaryHref) : null;
  // Preview chain: the project's own media, else its showreel still (real gameplay,
  // beats Drive's junk first-frame poster), else a Drive thumbnail as a last resort.
  const image =
    project.media ||
    reelFrames.find((f) => f.id === project.id)?.img ||
    (primaryHref ? driveThumb(primaryHref, 1280) : null);
  // A LOCAL clip is light, so it autoplays (muted) the moment the panel opens.
  // Reduced-motion users keep the poster. The Drive iframe stays deferred.
  const [playing, setPlaying] = useState(
    () => !!project.clip && !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  // Freeze Lenis while the dialog is open (mount-only, so re-renders never churn it);
  // the overlay carries data-lenis-prevent so wheel scrolls the dialog natively.
  useEffect(() => {
    lenisRef.current?.stop();
    return () => { lenisRef.current?.start(); };
  }, []);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Let CSS pause the marquees hidden behind the panel (globals.css).
    document.documentElement.setAttribute("data-modal", "1");
    // The page behind the dialog is inert (the portal lives on body, so it stays live).
    const shielded = Array.from(document.querySelectorAll<HTMLElement>("#content, header, footer"));
    shielded.forEach((el) => el.setAttribute("inert", ""));
    // Only the controls that are actually displayed at this breakpoint (the pinned
    // phone X vs the in-panel desktop X); getClientRects, not offsetParent, because
    // the pinned X is position:fixed.
    const focusables = () =>
      Array.from(overlayRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter((el) => el.getClientRects().length > 0);
    (focusables()[0] ?? panelRef.current)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      const a = document.activeElement as HTMLElement | null;
      if (!a || !overlayRef.current?.contains(a)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); return; }
      if (e.shiftKey && a === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
      document.documentElement.removeAttribute("data-modal");
      shielded.forEach((el) => el.removeAttribute("inert"));
      prevFocus?.focus?.();
    };
  }, [onClose]);

  // Pure-CSS entrance (mv-fade / mv-reveal): only ever animates TOWARD visible.
  // PORTALED to <body>: inside <main> (a z-10 stacking context) the whole dialog
  // stacked BELOW the nav, which swallowed the pinned phone X.
  return createPortal(
    <div
      ref={overlayRef}
      data-lenis-prevent
      // Plain ink scrim, NOT backdrop-blur: blurring the whole viewport re-renders every
      // frame while the canvases animate behind it, which is what made the panel lag.
      // Auto margins on the panel: centred when it fits, top-aligned and fully
      // scrollable when it is taller than the viewport.
      className="mv-fade fixed inset-0 z-overlay flex overflow-y-auto bg-bone/50 sm:p-6"
      onClick={onClose}
    >
      {/* Phone close, pinned to the VIEWPORT. It must be a child of the overlay, not
          the panel: the panel's entrance transform is a containing block for
          position:fixed, so an in-panel X would jump during the reveal. */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close"
        className="fixed right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded border border-steel bg-carbon text-mist sm:hidden"
      >
        <X className="h-5 w-5" />
      </button>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-detail-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="mv-reveal glass-solid relative mt-auto w-full max-w-2xl rounded-lg p-6 outline-none max-sm:rounded-b-none max-sm:rounded-t-xl sm:m-auto sm:p-8"
      >
        <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-full w-[2px] bg-surge" />
        {/* Desktop close (in-panel); hidden on phone, where the pinned X on the overlay is the close. */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 hidden h-8 w-8 place-items-center rounded border border-steel text-mist transition-colors hover:border-surge/60 hover:text-bone sm:grid"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-wrap items-center gap-2 pr-10">
          {project.badge && (
            <Tag accent={!!project.shipped} className={project.shipped ? undefined : "text-mist"}>
              {project.badge}
            </Tag>
          )}
          <span className="font-mono text-xs uppercase text-mist">{project.year}</span>
        </div>
        <h3 id="project-detail-title" className="mt-3 font-display text-2xl font-semibold uppercase text-bone sm:text-3xl">
          {project.title}
        </h3>
        <p className="mt-1 font-mono text-xs uppercase text-surge">{project.role}</p>

        {/* media: a self-hosted clip, else a Drive preview, else a still; framed like the tile */}
        <div className="relative mt-5 aspect-video w-full overflow-hidden rounded border border-steel">
          {clip && playing ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              src={clip}
              poster={image ?? undefined}
              aria-label={`${project.title} gameplay clip`}
              className="h-full w-full bg-void object-cover"
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          ) : clip ? (
            <PosterButton image={image} title={project.title} onPlay={() => setPlaying(true)} />
          ) : embed && playing ? (
            <iframe
              src={embed}
              title={`${project.title} preview`}
              allow="autoplay"
              className="h-full w-full border-0"
            />
          ) : embed ? (
            <PosterButton image={image} title={project.title} onPlay={() => setPlaying(true)} />
          ) : image ? (
            <Thumb src={image} alt={`${project.title} preview`} />
          ) : (
            <div className="media-fallback grid h-full w-full place-items-center">
              <span className="font-mono text-xs uppercase text-bone/70">Open the link below</span>
            </div>
          )}
        </div>

        <p className="mt-5 font-sans leading-relaxed text-mist">{project.summary}</p>

        {(project.problem || project.approach || project.result) && (
          <dl className="mt-6 space-y-4">
            {project.problem && <CaseRow label="Problem" value={project.problem} />}
            {project.approach && <CaseRow label="Approach" value={project.approach} />}
            {project.result && <CaseRow label="Result" value={project.result} />}
          </dl>
        )}

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.locked ? (
            <span className="inline-flex items-center gap-2 rounded border border-steel px-4 py-2.5 font-mono text-xs uppercase text-mist">
              <Lock className="h-3.5 w-3.5" /> Private, to be announced
            </span>
          ) : (
            project.links.map((l) => (
              <BevelButton key={l.href} href={l.href} variant="primary" target="_blank" rel="noopener noreferrer">
                {l.label}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </BevelButton>
            ))
          )}
        </div>

        {/* Phone-only way back at the natural end of reading (the pinned X covers the top). */}
        <button
          onClick={onClose}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded border-2 border-line2 bg-white/50 px-4 py-3 font-mono text-xs uppercase text-bone transition-colors hover:border-surge/60 sm:hidden"
        >
          <X className="h-4 w-4" />
          Close
        </button>
      </div>
    </div>,
    document.body,
  );
}

/** Poster still with a centered play affordance; shared by the clip and Drive-embed paths. */
function PosterButton({ image, title, onPlay }: { image: string | null; title: string; onPlay: () => void }) {
  return (
    <button onClick={onPlay} aria-label={`Play ${title} preview`} className="group relative block h-full w-full">
      <Thumb src={image} alt={`${title} preview`} />
      <span className="absolute inset-0 grid place-items-center bg-bone/20 transition-colors group-hover:bg-bone/10">
        <span className="grid h-14 w-14 place-items-center rounded border border-white/60 bg-bone/70 text-white transition-colors group-hover:border-surge group-hover:text-surge">
          <Play className="ml-0.5 h-6 w-6" />
        </span>
      </span>
    </button>
  );
}

function CaseRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-steel pl-4">
      <dt className="font-mono text-xs uppercase text-surge">{label}</dt>
      <dd className="mt-1 font-sans text-sm leading-relaxed text-mist">{value}</dd>
    </div>
  );
}
