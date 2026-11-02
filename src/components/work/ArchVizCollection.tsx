import { ArrowUpRight } from "lucide-react";
import { archvizProjects, projectPath } from "@/data/projects";
import { archvizCopy } from "@/data/archvizProjects";
import { ClipPreview } from "@/components/ui/ClipPreview";
import styles from "./ArchVizCollection.module.css";

export function ArchVizCollection() {
  return (
    <section id="archviz" className={styles.collection} aria-labelledby="archviz-heading">
      <header className={styles.heading} data-solid>
        <h3 id="archviz-heading">{archvizCopy.title}</h3>
        <p>{archvizCopy.description}</p>
      </header>
      <div className={styles.projects}>
        {archvizProjects.map(project => {
          const isProduct = project.id === "magviz";
          const entry = archvizCopy.entries[project.id];
          const panoramic = (project.mediaWidth ?? 16) / (project.mediaHeight ?? 9) > 2;
          return <article key={project.id} id={project.id} className={`${styles.project} ${panoramic ? styles.panorama : ""}`} aria-labelledby={`${project.id}-title`}>
            <header className={styles.title} data-solid>
              <h4 id={`${project.id}-title`}>{entry.title}</h4>
            </header>
            <figure className={styles.media} data-solid>
              {project.clip ? <ClipPreview src={project.clip} poster={project.media} title={project.title} label={project.selection?.previewLabel} posterAlt={project.selection?.posterAlt} /> :
                <a href={projectPath(project)} aria-label={`${archvizCopy.openStudy}: ${project.title}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.media} srcSet={project.mediaSrcSet} sizes={panoramic ? "(min-width: 1600px) 88vw, 94vw" : "(min-width: 760px) 43vw, 94vw"} alt={project.mediaAlt} width={project.mediaWidth} height={project.mediaHeight} loading="lazy" decoding="async" />
                </a>}
            </figure>
            <div className={styles.notes} data-solid>
              <p>{project.summary}</p>
              <div className={styles.details}>
                <p>{entry.format}</p>
                <a className="folio-link" href={projectPath(project)}>{entry.action}<ArrowUpRight aria-hidden size={18} /></a>
                {isProduct && <a className="quiet-link" href="/work/magviz#full-tour">{project.links[0].label}</a>}
              </div>
            </div>
          </article>;
        })}
      </div>
    </section>
  );
}
