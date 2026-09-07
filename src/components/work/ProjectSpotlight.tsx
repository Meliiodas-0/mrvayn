"use client";

import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { Panel } from "@/components/ui/Panel";
import { Tag } from "@/components/ui/Tag";
import { BevelButton } from "@/components/ui/BevelButton";
import { ClipPreview } from "@/components/ui/ClipPreview";

/** The lead film loads only after an explicit play, including on touch devices.
 * Keep the original 16:9 frame intact so the broadcast HUD never gets cropped. */
export function ProjectSpotlight({ project, onSelect }: { project: Project; onSelect: () => void }) {
  const detail = project.spotlight;

  if (!detail) return null;
  const primary = project.links[0];

  return (
    <Panel edge className="scroll-mt-24 p-0" id={project.id} aria-labelledby={`${project.id}-title`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-steel/80 px-5 py-4 sm:px-8">
        <p className="flex items-center gap-2.5 font-mono text-xs uppercase text-surge">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-surge" />
          {detail.label}
        </p>
        <span className="font-mono text-meta-xs uppercase text-mist">{project.badge} / {project.year}</span>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
        <div className="p-6 sm:p-8 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:p-10 lg:pb-0">
          <h3 id={`${project.id}-title`} className="font-display text-3xl font-semibold uppercase leading-[1.05] text-bone sm:text-4xl">{project.title}</h3>
          <p className="mt-3 font-mono text-xs uppercase leading-relaxed text-surge">{project.role}</p>
        </div>

        <div className="min-w-0 border-y border-steel/80 lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:border-y-0 lg:border-r">
          {project.clip && <ClipPreview src={project.clip} poster={project.media} title={project.title} label={detail.previewLabel} posterAlt={detail.posterAlt} describedBy={`${project.id}-caption`} />}
          <div className="border-t border-steel/80 px-5 py-5 sm:px-8">
            <p className="font-mono text-xs uppercase text-bone">{detail.previewTitle}</p>
            <p id={`${project.id}-caption`} className="mt-2 max-w-prose text-sm leading-relaxed text-mist">{detail.previewCaption}</p>
          </div>
          <dl className="grid grid-cols-3 border-t border-steel/80">
            {detail.facts.map((fact) => (
              <div key={fact.label} className="min-w-0 border-r border-steel/80 px-4 py-5 last:border-r-0 sm:px-8">
                <dt className="font-mono text-[10px] uppercase leading-relaxed text-volt sm:text-meta-xs">{fact.label}</dt>
                <dd className="mt-2 whitespace-nowrap font-display text-lg font-semibold text-bone sm:text-2xl">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex min-w-0 flex-col p-6 sm:p-8 lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:p-10 lg:pt-5">
          <p className="text-base leading-relaxed text-mist">{project.summary}</p>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.tech.map((tech) => <Tag key={tech}>{tech}</Tag>)}
          </div>
          <div className="mt-8 flex flex-wrap gap-3 max-sm:flex-col">
            {primary && (
              <BevelButton href={primary.href} target="_blank" rel="noopener noreferrer">
                {primary.label}<ArrowUpRight aria-hidden className="h-4 w-4" />
              </BevelButton>
            )}
            <BevelButton variant="ghost" onClick={onSelect}>
              {detail.detailLabel}
            </BevelButton>
          </div>
        </div>
      </div>
    </Panel>
  );
}
