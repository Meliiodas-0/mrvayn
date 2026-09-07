"use client";

import { ArrowUpRight } from "lucide-react";
import { projectUi, type Project } from "@/data/projects";
import { cn } from "@/lib/cn";
import { Panel } from "@/components/ui/Panel";
import { Tag } from "@/components/ui/Tag";
import { BevelButton } from "@/components/ui/BevelButton";
import { ClipPreview } from "@/components/ui/ClipPreview";

/** Full-frame selected work with alternating desktop layouts. On phones the title
 * always leads, followed by media, contribution, evidence and actions. */
export function SelectedProject({ project, reverse, onSelect }: { project: Project; reverse?: boolean; onSelect: () => void }) {
  const details = project.selection;
  if (!details) return null;
  const primary = project.links[0];
  const copySide = reverse ? "lg:col-start-1" : "lg:col-start-8";
  const mediaSide = reverse ? "lg:col-start-6 lg:border-l" : "lg:col-start-1 lg:border-r";

  return (
    <Panel edge className="scroll-mt-24 p-0" id={project.id} aria-labelledby={`${project.id}-title`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-steel/80 px-5 py-4 sm:px-8">
        <p className="font-mono text-xs uppercase text-surge">{details.category}</p>
        <div className="flex items-center gap-3">
          <Tag accent={project.shipped}>{project.badge}</Tag>
          <span className="font-mono text-meta-xs uppercase text-mist">{project.year}</span>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
        <div className={cn("p-6 sm:p-8 lg:col-span-5 lg:row-start-1 lg:p-10 lg:pb-0", copySide)}>
          <h3 id={`${project.id}-title`} className="font-display text-3xl font-semibold uppercase leading-[1.05] text-bone sm:text-4xl">{project.title}</h3>
          <p className="mt-3 font-mono text-xs uppercase leading-relaxed text-surge">{project.role}</p>
        </div>

        <div className={cn("min-w-0 border-y border-steel/80 lg:col-span-7 lg:row-span-2 lg:row-start-1 lg:border-y-0", mediaSide)}>
          {project.clip ? (
            <ClipPreview src={project.clip} poster={project.media} title={project.title} label={details.previewLabel} posterAlt={details.posterAlt} describedBy={`${project.id}-caption`} />
          ) : (
            <button onClick={onSelect} aria-label={`${details.previewLabel}: ${project.title}`} className="group relative block aspect-video w-full overflow-hidden bg-void">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.media} alt={details.posterAlt} width={1280} height={720} loading="lazy" className="h-full w-full object-contain" />
              <span className="absolute bottom-3 right-3 flex items-center gap-2 rounded border border-white/20 bg-black/85 px-3 py-2 font-mono text-[10px] uppercase text-white sm:bottom-4 sm:right-4 sm:text-xs">{details.previewLabel}<ArrowUpRight aria-hidden className="h-4 w-4" /></span>
            </button>
          )}
          <p id={`${project.id}-caption`} className="border-t border-steel/80 px-5 py-5 text-sm leading-relaxed text-mist sm:px-8">{details.caption}</p>
        </div>

        <div className={cn("flex min-w-0 flex-col p-6 sm:p-8 lg:col-span-5 lg:row-start-2 lg:p-10 lg:pt-5", copySide)}>
          <p className="text-base leading-relaxed text-mist">{project.summary}</p>
          <dl className="mt-6 grid grid-cols-3 gap-3 border-y border-steel/80 py-5">
            {details.facts.map((fact) => (
              <div key={fact.label} className="min-w-0">
                <dt className="font-mono text-[10px] uppercase leading-relaxed text-volt">{fact.label}</dt>
                <dd className="mt-2 font-display text-lg font-semibold leading-tight text-bone sm:text-xl">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 4).map((tech) => <Tag key={tech}>{tech}</Tag>)}
          </div>
          <div className="mt-7 flex flex-wrap gap-3 max-sm:flex-col">
            <BevelButton onClick={onSelect}>{projectUi.viewProject}<ArrowUpRight aria-hidden className="h-4 w-4" /></BevelButton>
            {primary && <BevelButton variant="ghost" href={primary.href} target="_blank" rel="noopener noreferrer">{primary.label}<ArrowUpRight aria-hidden className="h-4 w-4" /></BevelButton>}
          </div>
        </div>
      </div>
    </Panel>
  );
}
