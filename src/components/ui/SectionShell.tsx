import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";

interface SectionShellProps {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionShell({ id, eyebrow, title, children, className }: SectionShellProps) {
  return (
    <section id={id} className={cn("relative scroll-mt-20 px-5 py-24 sm:py-32", className)}>
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2
            data-solid
            className="mt-4 block w-fit font-display font-black uppercase leading-[0.95] text-bone"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontStretch: "expanded" }}
          >
            {title}
          </h2>
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
