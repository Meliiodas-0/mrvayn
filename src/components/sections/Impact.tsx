import { impactStats } from "@/data/impact";
import { editorial } from "@/data/editorial";
import { SectionShell } from "@/components/ui/SectionShell";

export function Impact() {
  return (
    <SectionShell id="impact" title={editorial.impactTitle}>
      <dl className="impact-list">
        {impactStats.map(stat => <div data-solid key={stat.label}><dd>{stat.value}</dd><dt>{stat.label}</dt><p>{stat.context}</p></div>)}
      </dl>
    </SectionShell>
  );
}
