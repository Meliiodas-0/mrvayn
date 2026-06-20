"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { X, ArrowUpRight, Lock } from "lucide-react";
import type { Project } from "@/data/projects";
import { Tag } from "@/components/ui/Tag";
import { HudFrame } from "@/components/ui/HudFrame";

/** Agent-detail panel (BRIEF §3): Problem -> Approach -> Result + media + links.
 *  Renders only while a project is selected (unmounts on close — robust, no
 *  exit-presence edge cases). Accessible: Esc/backdrop close, focus trap,
 *  scroll lock, restored focus. */
export function ProjectDetail({ project, onClose }: { project: Project | null; onClose: () => void }) {
  if (!project) return null;
  return <DetailPanel project={project} onClose={onClose} />;
}

function DetailPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])',
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
      prevFocus?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-end justify-center overflow-y-auto bg-void/80 backdrop-blur-sm sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.2 }}
      onClick={onClose}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-detail-title"
        onClick={(e) => e.stopPropagation()}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bevel relative my-6 w-full max-w-2xl border border-steel bg-carbon p-6 sm:p-8"
      >
        <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-full w-[2px] bg-surge" />
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center border border-steel text-mist transition-colors hover:border-surge/60 hover:text-bone bevel-sm"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-wrap items-center gap-2 pr-10">
          {project.badge && <Tag accent>{project.badge}</Tag>}
          <span className="font-mono text-[0.7rem] uppercase tracking-widest text-mist">{project.year}</span>
        </div>
        <h3 id="project-detail-title" className="mt-3 font-display text-2xl font-black uppercase text-bone sm:text-3xl">
          {project.title}
        </h3>
        <p className="mt-1 font-hud text-xs uppercase tracking-wide text-surge/80">{project.role}</p>

        {/* media — TODO(MrVayn): replace with real trailer/gif/thumbnail. */}
        <HudFrame scanlines className="mt-5 aspect-video w-full overflow-hidden bevel-sm">
          <div
            className="grid h-full w-full place-items-center"
            style={{ background: "linear-gradient(120deg, rgb(var(--surge)/0.18), rgb(var(--ion)/0.14) 50%, rgb(var(--volt)/0.12))" }}
          >
            <span className="font-mono text-[0.7rem] uppercase tracking-widest text-bone/70">Media coming soon</span>
          </div>
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
              <Lock className="h-3.5 w-3.5" /> Private — to be announced
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
      </motion.div>
    </motion.div>
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
