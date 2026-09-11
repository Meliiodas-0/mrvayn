import { ArrowDownRight } from "lucide-react";
import { editorial } from "@/data/editorial";

export function Hero() {
  return (
    <section id="hero" className="sculpture-hero" aria-labelledby="hero-heading">
      <h1 id="hero-heading" className="sr-only">{editorial.heroHeading}</h1>
      <div className="sculpture-caption" data-solid>
        <div className="sculpture-identity">
          <p>{editorial.heroSignature}</p>
          <p>{editorial.heroDiscipline}</p>
        </div>
        <a href="#work" className="sculpture-work-link">
          {editorial.heroSculptureLink}<ArrowDownRight size={20} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
