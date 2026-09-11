"use client";

import type { ReactNode } from "react";
import { hasCaseStudy, projectPath, type Project } from "@/data/projects";

/** Crawlable and usable without JavaScript. Normal clicks keep the quick view;
 * modified clicks and new-tab actions retain the browser's native navigation. */
export function ProjectEntryLink({ project, onSelect, children, className, label }: {
  project: Project;
  onSelect: () => void;
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  if (!hasCaseStudy(project)) {
    return <button data-solid className={className} aria-label={label} onClick={onSelect}>{children}</button>;
  }
  return (
    <a data-solid href={projectPath(project)} className={className} aria-label={label} onClick={(event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
      event.preventDefault();
      onSelect();
    }}>{children}</a>
  );
}
