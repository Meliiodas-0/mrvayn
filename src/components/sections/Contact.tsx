import { ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import { editorial } from "@/data/editorial";
import { socials, collaborations } from "@/data/socials";
import { CopyHandle } from "@/components/ui/CopyHandle";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="folio-contact">
      <div className="mv-col">
        <div className="contact-intro" data-solid><p>{profile.availability}</p><h2 id="contact-heading">{editorial.contactTitle}</h2></div>
        <div className="contact-spread">
          <div data-solid>
            <p className="contact-body">{editorial.contactBody}</p>
            <a href={profile.emailHref} className="contact-email">{profile.email}<ArrowUpRight aria-hidden size={26} /></a>
            {profile.resumeHref && <a href={profile.resumeHref} className="quiet-link" target="_blank" rel="noopener noreferrer">Download CV</a>}
          </div>
          <div className="contact-channels" data-solid>
            <h3>{editorial.channels}</h3>
            <ul>{socials.map(s => <li key={s.name}>{s.href ? <a href={s.href} target="_blank" rel="noopener noreferrer">{s.name}<ArrowUpRight aria-hidden size={17} /></a> : s.handle ? <CopyHandle label={s.name} handle={s.handle} /> : null}</li>)}</ul>
          </div>
        </div>
        <details className="contact-collabs" data-solid>
          <summary>{editorial.collaborations}<span aria-hidden>+</span></summary>
          <ul>{collaborations.map(c => <li key={c.href}><a href={c.href} target="_blank" rel="noopener noreferrer">{c.title}<ArrowUpRight aria-hidden size={16} /></a></li>)}</ul>
        </details>
      </div>
    </section>
  );
}
