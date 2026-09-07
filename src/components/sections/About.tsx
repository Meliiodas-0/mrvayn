import { profile } from "@/data/profile";
import { editorial } from "@/data/editorial";
import { SectionShell } from "@/components/ui/SectionShell";

export function About() {
  return (
    <SectionShell id="about" title={editorial.aboutTitle} alt>
      <div className="about-spread">
        <p className="about-thesis" data-solid>{editorial.aboutLead}</p>
        <div className="about-copy" data-solid>
          <p>{editorial.aboutBody}</p>
          <p>{editorial.aboutEnd}</p>
          <ul>{profile.capabilities.slice(0, 4).map(cap => <li key={cap}>{cap}</li>)}</ul>
        </div>
      </div>
    </SectionShell>
  );
}
