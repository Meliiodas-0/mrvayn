import { ArrowUpRight, Lock } from "lucide-react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/cn";
import { projectThumb } from "@/lib/drive";
import { Panel } from "@/components/ui/Panel";
import { Tag } from "@/components/ui/Tag";
import { Thumb } from "@/components/ui/Thumb";

/** Agent-select style project tile (DESIGN_SYSTEM §4 / BRIEF §3). */
export function ProjectTile({
  project,
  featured = false,
  onSelect,
}: {
  project: Project;
  featured?: boolean;
  /** When set, the tile opens the detail panel instead of linking out. */
  onSelect?: () => void;
}) {
  const primaryLink = project.links[0];

  const inner = (
    <Panel
      edge={featured}
      className={cn(
        "group flex h-full flex-col transition-colors duration-300",
        featured ? "p-6 sm:p-8" : "p-5",
        project.locked ? "opacity-60" : "hover:border-surge/40",
      )}
    >
      {featured && (
        <div className="relative mb-5 aspect-video w-full overflow-hidden border border-steel bevel-sm">
          <Thumb src={projectThumb(project.media, project.links)} alt={`${project.title} preview`} />
          <span aria-hidden className="scanlines pointer-events-none absolute inset-0" />
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {project.badge && <Tag accent>{project.badge}</Tag>}
          <span className="font-mono text-[0.7rem] uppercase tracking-widest text-mist">{project.year}</span>
        </div>
        {project.locked ? (
          <Lock className="h-4 w-4 text-mist" />
        ) : (
          <ArrowUpRight className="h-5 w-5 text-mist transition-colors group-hover:text-surge" />
        )}
      </div>

      <h3
        className={cn(
          "mt-4 font-display font-black uppercase leading-none text-bone transition-colors group-hover:text-surge",
          featured ? "text-2xl sm:text-3xl" : "text-lg",
        )}
      >
        {project.title}
      </h3>
      <p className="mt-1.5 font-hud text-xs uppercase tracking-wide text-surge/80">{project.role}</p>

      {featured && <p className="mt-4 max-w-prose font-sans text-sm leading-relaxed text-mist">{project.summary}</p>}

      <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
        {project.tech.slice(0, featured ? 6 : 3).map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
    </Panel>
  );

  if (onSelect) {
    return (
      <button onClick={onSelect} className="block h-full w-full text-left" aria-label={`${project.title} — view details`}>
        {inner}
      </button>
    );
  }

  if (project.locked || !primaryLink) {
    return <div aria-disabled className="h-full">{inner}</div>;
  }

  return (
    <a href={primaryLink.href} target="_blank" rel="noopener noreferrer" className="block h-full" aria-label={`${project.title} — ${primaryLink.label}`}>
      {inner}
    </a>
  );
}
