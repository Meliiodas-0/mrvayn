import { proofChips } from "@/data/impact";

// Two passes so the CSS marquee (translateX -50%) loops seamlessly, same trick as the Showreel.
const loop = [...proofChips, ...proofChips];

/**
 * Slim credibility ticker under the hero: real proof points (studio, funding, IGDC,
 * launch metrics) scrolling as a HUD strip. Server-rendered, zero JS; pauses on hover
 * and becomes a manual scroll strip under prefers-reduced-motion (mv-marquee CSS).
 */
export function ProofTicker() {
  return (
    <aside aria-label="Credentials" className="relative overflow-hidden border-y border-steel/60 bg-carbon/50 py-3">
      <div className="mv-marquee-mask">
        <ul className="mv-marquee flex w-max items-center gap-8 pr-8">
          {loop.map((chip, i) => (
            <li
              key={`${chip}-${i}`}
              aria-hidden={i >= proofChips.length}
              className="flex shrink-0 items-center gap-8 font-hud text-[0.7rem] uppercase tracking-[0.22em] text-mist"
            >
              <span aria-hidden className="text-surge">◆</span>
              <span className="whitespace-nowrap">{chip}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
