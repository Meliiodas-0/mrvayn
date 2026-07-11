import { Reveal } from "@/components/motion/Reveal";

/**
 * Directive: one huge typographic statement (the award-site "manifesto" beat).
 * The inspiration layer for visitors who are not hiring or investing: the loop
 * that took a 7-day Roblox build to a funded 20-person studio. Server-rendered.
 */
export function Manifesto() {
  return (
    <section aria-label="Directive" className="relative overflow-hidden border-y border-steel/50 bg-carbon/40 px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal skew>
          <p className="font-hud text-xs uppercase tracking-[0.3em] text-surge">Directive</p>
          <h2
            data-solid
            className="mx-auto mt-6 font-display font-black uppercase leading-[0.95] text-bone"
            style={{ fontSize: "clamp(2.6rem, 7vw, 5.5rem)", fontStretch: "expanded" }}
          >
            Build. Ship. <span className="text-glow-surge text-surge">Repeat.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-2xl font-sans leading-relaxed text-mist">
            My first horror game went from an empty project to live on Roblox in 7 days.
            Two years later I lead engineering at a 20-person studio building Antarya.
            Same loop, bigger stakes: build it, ship it, learn from the players, go again.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
