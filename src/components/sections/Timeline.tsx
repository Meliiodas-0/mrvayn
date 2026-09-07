import { experience, education, certifications } from "@/data/experience";
import { SectionShell } from "@/components/ui/SectionShell";

export function Timeline() {
  return (
    <SectionShell id="journey" title="Journey" alt>
      <div className="journey-spread">
        <ol className="career-list">
          {experience.map(entry => <li key={`${entry.year}-${entry.title}`} data-solid>
            <p className="career-year">{entry.year}</p>
            <div><h3>{entry.title}</h3><p className="career-org">{entry.org}</p><p className="career-summary">{entry.summary}</p></div>
          </li>)}
        </ol>
        <aside className="education-notes" data-solid>
          <h3>Education</h3><p>{education.degree}</p><p>{education.org}</p><p className="career-year">{education.year}</p>
          <h3>Certifications</h3>
          <ul>{certifications.map(c => <li key={c.name}><p>{c.name}</p><p className="career-year">{c.issuer}<br />{c.date}</p></li>)}</ul>
        </aside>
      </div>
    </SectionShell>
  );
}
