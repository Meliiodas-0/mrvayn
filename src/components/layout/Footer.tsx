import { ArrowUp } from "lucide-react";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="portfolio-theme folio-footer relative z-content">
      <div className="mv-col">
        <div className="footer-wordmark" aria-hidden translate="no">{profile.name}</div>
        <div className="footer-bottom" data-solid><p>© 2026 {profile.name}</p><a href="#hero">Back to top<ArrowUp aria-hidden size={17} /></a></div>
      </div>
    </footer>
  );
}
