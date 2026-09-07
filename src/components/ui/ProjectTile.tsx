import { ArrowUpRight, Lock } from "lucide-react";
import { projectUi, type Project } from "@/data/projects";
import { cn } from "@/lib/cn";
import { projectThumb } from "@/lib/drive";
import { Panel } from "@/components/ui/Panel";
import { Tag } from "@/components/ui/Tag";
import { Thumb } from "@/components/ui/Thumb";

/** Project tile: featured (media + summary) or compact (text only). Every tile opens
 *  the shared detail panel. */
export function ProjectTile({
  project,
  featured = false,
  wide = false,
  onSelect,
}: {
  project: Project;
  featured?: boolean;
  /** Full-row featured tile: media 7/12 left, copy 5/12 right at lg; stacked below lg. */
  wide?: boolean;
  /** When set, the tile opens the detail panel instead of linking out. */
  onSelect?: () => void;
}) {
  const primaryLink = project.links[0];
  const hasMedia = featured || (!project.archive && !!project.media);

  const inner = (
    <Panel
      edge={featured}
      interactive={!project.locked}
      className={cn(
        "group flex h-full flex-col overflow-hidden",
        hasMedia ? "p-0" : "p-5 sm:p-6",
        project.locked && "opacity-60",
        wide && "lg:grid lg:grid-cols-12 lg:items-stretch",
      )}
    >
      {hasMedia && (
        <div
          className={cn(
            "relative aspect-video w-full overflow-hidden border-b border-steel/80 bg-void",
            wide && "lg:col-span-7 lg:h-full lg:min-h-[430px] lg:aspect-auto lg:border-b-0 lg:border-r",
          )}
        >
          <div className="absolute inset-0">
            <Thumb src={projectThumb(project.media, project.links)} alt={`${project.title} preview`} className="contrast-[1.04] saturate-[1.08] transition-transform duration-700 ease-out3 group-hover:scale-[1.035]" />
          </div>
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/55 via-transparent to-transparent" />
        </div>
      )}
      <div className={cn("flex flex-1 flex-col", hasMedia && "p-5 sm:p-6", wide && "lg:col-span-5 lg:justify-center lg:p-10")}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {project.badge && (
              <Tag accent={!!project.shipped} className={project.shipped ? undefined : "text-mist"}>
                {project.badge}
              </Tag>
            )}
            <span className="font-mono text-xs uppercase text-mist">{project.year}</span>
          </div>
          {project.locked ? (
            <Lock className="h-4 w-4 text-mist" />
          ) : (
            <ArrowUpRight className="h-5 w-5 text-mist transition-colors group-hover:text-surge" />
          )}
        </div>

        <h3
          className={cn(
            "mt-4 font-display font-semibold uppercase leading-none text-bone transition-colors group-hover:text-surge",
            featured ? "text-2xl sm:text-[2rem]" : "text-xl",
          )}
        >
          {project.title}
        </h3>
        <p className="mt-1.5 font-mono text-xs uppercase leading-relaxed text-surge">{project.role}</p>

        {!project.archive && <p className="mt-4 max-w-prose font-sans text-sm leading-relaxed text-mist">{project.summary}</p>}

        <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {project.tech.slice(0, featured ? 6 : 3).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        {!project.archive && (
          <span className="mt-5 flex min-h-11 items-center justify-between gap-3 border-t border-steel/80 pt-4 font-mono text-xs uppercase text-bone">
            {projectUi.viewProject}<ArrowUpRight aria-hidden className="h-4 w-4 text-surge" />
          </span>
        )}
      </div>
    </Panel>
  );

  if (onSelect) {
    return (
      <button onClick={onSelect} className="block h-full w-full rounded-lg text-left" aria-label={`${project.title}, view details`}>
        {inner}
      </button>
    );
  }

  if (project.locked || !primaryLink) {
    return <div aria-disabled className="h-full">{inner}</div>;
  }

  return (
    <a href={primaryLink.href} target="_blank" rel="noopener noreferrer" className="block h-full" aria-label={`${project.title}, ${primaryLink.label}`}>
      {inner}
    </a>
  );
}
