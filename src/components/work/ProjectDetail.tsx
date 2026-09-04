"use client";

import { useEffect, useRef, useState } from "react";
import { X, ArrowUpRight, Lock, Play } from "lucide-react";
import type { Project } from "@/data/projects";
import { reelFrames } from "@/data/showreel";
import { driveEmbed, driveThumb } from "@/lib/drive";
import { Tag } from "@/components/ui/Tag";
import { HudFrame } from "@/components/ui/HudFrame";
import { Thumb } from "@/components/ui/Thumb";

/** Agent-detail panel (BRIEF §3): Problem -> Approach -> Result + media + links.
 *  Renders only while a project is selected (unmounts on close, robust, no
 *  exit-presence edge cases). Accessible: Esc/backdrop close, focus trap,
 *  scroll lock, restored focus. */
export function ProjectDetail({ project, onClose }: { project: Project | null; onClose: () => void }) {
  if (!project) return null;
  return <DetailPanel project={project} onClose={onClose} />;
}

function DetailPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

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
  // A LOCAL clip is light, so it autoplays (muted) the moment the panel opens: the
  // in-site demo must be unmissable, not hidden behind a poster tap. Reduced-motion
  // users keep the poster. The Drive iframe stays deferred (it janks the entrance).
  const [playing, setPlaying] = useState(
    () => !!project.clip && !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Let CSS pause the marquees/ghost drifts hidden behind the panel (globals.css).
    document.documentElement.setAttribute("data-modal", "1");
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>(
          // include video/iframe: a playing clip (no trailing link for SAO-X/MagViz)
          // is otherwise a focusable tab-stop outside the trap, letting Tab escape.
          'a[href],button:not([disabled]),video,iframe,[tabindex]:not([tabindex="-1"])',
        );
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
      document.documentElement.removeAttribute("data-modal");
      prevFocus?.focus?.();
    };
  }, [onClose]);

  // Pure-CSS entrance (mv-fade / mv-reveal), framer-motion doesn't apply on iOS
  // WebKit and could leave the dialog invisible; these only animate TOWARD visible.
  return (
    <div
      // Plain dark overlay, NOT backdrop-blur: blurring the whole viewport re-renders every
      // frame while the canvases animate behind it, which is what made the panel lag.
      className="mv-fade fixed inset-0 z-[90] flex items-end justify-center overflow-y-auto bg-[rgba(15,23,42,0.38)] sm:items-center"
      onClick={onClose}
    >
      {/* Phone close, pinned to the VIEWPORT. It must be a child of the overlay, not
          the panel: the panel's backdrop-filter creates a containing block that turns
          position:fixed into panel-relative, which scrolls away = trapped. */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close"
        className="fixed right-3 top-3 z-10 grid h-10 w-10 place-items-center border border-steel bg-carbon text-mist bevel-sm sm:hidden"
      >
        <X className="h-5 w-5" />
      </button>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-detail-title"
        onClick={(e) => e.stopPropagation()}
        className="mv-reveal glass glass-strong relative my-6 w-full max-w-2xl rounded-lg p-6 sm:p-8"
      >
        <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-full w-[2px] bg-surge" />
        {/* Desktop close (in-panel). On phone this is hidden: the panel's glass
            backdrop-filter makes it the containing block, so a fixed button INSIDE
            the panel would still scroll away; the phone X lives on the overlay. */}
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 hidden h-8 w-8 place-items-center border border-steel text-mist transition-colors hover:border-surge/60 hover:text-bone bevel-sm sm:grid"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-wrap items-center gap-2 pr-10">
          {project.badge && <Tag accent>{project.badge}</Tag>}
          <span className="font-mono text-[0.7rem] uppercase tracking-widest text-mist">{project.year}</span>
        </div>
        <h3 id="project-detail-title" className="mt-3 font-display text-2xl font-semibold uppercase text-bone sm:text-3xl">
          {project.title}
        </h3>
        <p className="mt-1 font-hud text-xs uppercase tracking-wide text-surge/80">{project.role}</p>

        {/* media: a self-hosted clip, else a Drive preview, else a still. */}
        <HudFrame scanlines className="mt-5 aspect-video w-full overflow-hidden bevel-sm">
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
            <div
              className="grid h-full w-full place-items-center"
              style={{ background: "linear-gradient(120deg, rgb(var(--surge)/0.18), rgb(var(--ion)/0.14) 50%, rgb(var(--volt)/0.12))" }}
            >
              <span className="font-mono text-[0.7rem] uppercase tracking-widest text-bone/70">Open the link below</span>
            </div>
          )}
        </HudFrame>

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
            <span className="inline-flex items-center gap-2 border border-steel px-4 py-2.5 font-hud text-xs uppercase tracking-wide text-mist bevel-sm">
              <Lock className="h-3.5 w-3.5" /> Private, to be announced
            </span>
          ) : (
            project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 bg-surge px-4 py-2.5 font-hud text-xs uppercase tracking-wide text-void bevel-sm"
              >
                {l.label}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ))
          )}
        </div>

        {/* Phone-only way back at the natural end of reading (the pinned X covers the top). */}
        <button
          onClick={onClose}
          className="mt-4 w-full border border-steel px-4 py-3 font-hud text-xs uppercase tracking-wide text-mist transition-colors hover:border-surge/60 hover:text-bone bevel-sm sm:hidden"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/** Poster still with a centered play affordance; shared by the clip and Drive-embed paths. */
function PosterButton({ image, title, onPlay }: { image: string | null; title: string; onPlay: () => void }) {
  return (
    <button onClick={onPlay} aria-label={`Play ${title} preview`} className="group relative block h-full w-full">
      <Thumb src={image} alt={`${title} preview`} />
      <span className="absolute inset-0 grid place-items-center bg-void/30 transition-colors group-hover:bg-void/10">
        <span className="grid h-14 w-14 place-items-center border border-bone/40 bg-void/70 text-bone transition-colors group-hover:border-surge group-hover:text-surge bevel-sm">
          <Play className="ml-0.5 h-6 w-6" />
        </span>
      </span>
    </button>
  );
}

function CaseRow({ label, value }: { label: string; value: string }) {
  const placeholder = value.startsWith("PLACEHOLDER");
  return (
    <div className="border-l border-steel pl-4">
      <dt className="font-hud text-[0.7rem] uppercase tracking-[0.22em] text-surge">{label}</dt>
      <dd className={"mt-1 font-sans text-sm leading-relaxed " + (placeholder ? "text-mist/50 italic" : "text-mist")}>
        {value}
      </dd>
    </div>
  );
}
