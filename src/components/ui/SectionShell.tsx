import { cn } from "@/lib/cn";
import { section } from "@/data/sections";

interface SectionShellProps {
  id: string;
  title: string;
  alt?: boolean;
  labelsBelow?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function SectionShell({ id, title, alt = false, children, className }: SectionShellProps) {
  const def = section(id);
  return (
    <section id={def.id} aria-labelledby={`${id}-heading`} className={cn("folio-section", alt && "folio-section-alt", className)}>
      <div className="mv-col">
        <div className="section-heading" data-solid><h2 id={`${id}-heading`}>{title}</h2></div>
        {children}
      </div>
    </section>
  );
}
