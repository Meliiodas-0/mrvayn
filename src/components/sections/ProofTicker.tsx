import { proofChips } from "@/data/impact";

// Two passes so the CSS marquee (translateX -50%) loops seamlessly, same trick as the Showreel.
const loop = [...proofChips, ...proofChips];

/**
 * Slim credibility ticker between the hero and About: real proof points scrolling
 * as a strip, IN FLOW (it used to sit absolutely on the hero's bottom edge and
 * collided with the About label). Server-rendered, zero JS; pauses on hover; the
 * phone hero already ends on the readout card, so it is desktop only.
 * data-solid keeps the stickman enemies off the strip.
 */
export function ProofTicker() {
  return (
    <aside data-solid aria-label="Credentials" className="relative overflow-hidden border-t border-steel/50 bg-bg1/[0.86] py-4 max-sm:hidden">
      <div className="mv-marquee-mask">
        <ul className="mv-marquee flex w-max items-center gap-8 pr-8">
          {loop.map((chip, i) => (
            <li
              key={`${chip}-${i}`}
              aria-hidden={i >= proofChips.length}
              data-clone={i >= proofChips.length ? "" : undefined}
              className="flex shrink-0 items-center gap-8 font-mono text-xs uppercase text-mist"
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
