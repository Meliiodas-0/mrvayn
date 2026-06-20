// Phase 0 placeholder — a server-rendered hero so the build/deploy gate is green
// and crawlers get real HTML. Real sections land in Phase 1–2.
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="font-hud uppercase tracking-[0.35em] text-surge text-xs sm:text-sm">
        Build v2.0 // booting
      </p>
      <h1
        className="font-display font-black uppercase text-bone leading-[0.92]"
        style={{ fontSize: "clamp(3rem, 8vw, 7rem)", fontStretch: "expanded" }}
      >
        MrVayn
      </h1>
      <p className="font-sans text-mist max-w-md text-base sm:text-lg leading-relaxed">
        Founder &amp; Game Developer. Unreal Engine 5, Niagara VFX, multiplayer &amp; gameplay
        systems. The new build is being assembled.
      </p>
      <span className="font-mono text-mist/60 text-xs tracking-widest">
        OVERDRIVE // rebuild in progress
      </span>
    </main>
  );
}
