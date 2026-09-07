import { ArrowUpRight, Lock } from "lucide-react";
import type { Project } from "@/data/projects";
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

  const inner = (
    <Panel
      edge={featured}
      interactive={!project.locked}
      className={cn(
        "group flex h-full flex-col overflow-hidden",
        featured ? "p-6 sm:p-8" : "p-5",
        project.locked && "opacity-60",
        wide && "lg:grid lg:grid-cols-12 lg:items-center lg:gap-8",
      )}
    >
      {featured && (
        <div className={cn("wipe-in relative mb-5 aspect-video w-full overflow-hidden rounded border border-steel", wide && "lg:col-span-7 lg:mb-0")}>
          {/* overscan wrapper so the scroll-depth parallax never shows the box edge */}
          <div data-depth="media" className="absolute inset-x-0 -top-[7%] h-[114%] will-change-transform">
            <Thumb src={projectThumb(project.media, project.links)} alt={`${project.title} preview`} className="transition-transform duration-500 ease-out3 group-hover:scale-[1.03]" />
          </div>
        </div>
      )}
      <div className={cn("flex flex-1 flex-col", wide && "lg:col-span-5")}>
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
            featured ? "text-2xl sm:text-3xl" : "text-lg",
          )}
        >
          {project.title}
        </h3>
        <p className="mt-1.5 font-mono text-xs uppercase text-surge">{project.role}</p>

        {featured && <p className="mt-4 max-w-prose font-sans text-sm leading-relaxed text-mist">{project.summary}</p>}

        <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {project.tech.slice(0, featured ? 6 : 3).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
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
