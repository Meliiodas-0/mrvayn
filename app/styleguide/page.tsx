import { Panel } from "@/components/ui/Panel";
import { BevelButton } from "@/components/ui/BevelButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Tag } from "@/components/ui/Tag";
import { HudFrame } from "@/components/ui/HudFrame";
import { StatBlock } from "@/components/ui/StatBlock";

// Dev reference for Phase 1 primitives. Removed before launch (Phase 5).
export const metadata = { title: "Styleguide", robots: { index: false } };

export default function Styleguide() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 space-y-12">
      <header className="space-y-3">
        <Eyebrow index="00">Design system</Eyebrow>
        <h1 className="font-display font-black uppercase text-bone" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontStretch: "expanded" }}>
          OVERDRIVE primitives
        </h1>
      </header>

      <section className="space-y-4">
        <Eyebrow>Buttons</Eyebrow>
        <div className="flex flex-wrap items-center gap-4">
          <BevelButton variant="primary">View work</BevelButton>
          <BevelButton variant="ghost">Play</BevelButton>
        </div>
      </section>

      <section className="space-y-4">
        <Eyebrow>Panels</Eyebrow>
        <div className="grid gap-5 sm:grid-cols-2">
          <Panel edge className="p-6">
            <h3 className="font-hud uppercase tracking-wide text-bone">Panel · surge edge</h3>
            <p className="mt-2 font-sans text-mist">Carbon base, steel border, beveled corners, 2px surge edge.</p>
          </Panel>
          <Panel className="p-6">
            <h3 className="font-hud uppercase tracking-wide text-bone">Panel · plain</h3>
            <p className="mt-2 font-sans text-mist">The bevel does the shaping — radii stay sharp.</p>
          </Panel>
        </div>
      </section>

      <section className="space-y-4">
        <Eyebrow>Tags</Eyebrow>
        <div className="flex flex-wrap gap-2">
          <Tag accent>Unreal Engine 5</Tag>
          <Tag>C++</Tag>
          <Tag>Niagara VFX</Tag>
          <Tag>Multiplayer</Tag>
          <Tag>Netcode</Tag>
        </div>
      </section>

      <section className="space-y-4">
        <Eyebrow>HUD frame + scanlines</Eyebrow>
        <HudFrame scanlines className="bg-carbon p-10">
          <p className="text-center font-display text-2xl font-black uppercase text-bone">Featured media</p>
        </HudFrame>
      </section>

      <section className="space-y-4">
        <Eyebrow>Stat blocks</Eyebrow>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <StatBlock value="UE5" label="Engine" />
          <StatBlock value="6+" label="Years shipping" />
          <StatBlock value="Niagara" label="VFX" />
          <StatBlock value="PvP" label="Netcode" />
        </div>
      </section>
    </main>
  );
}
