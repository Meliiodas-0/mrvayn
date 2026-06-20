import Link from "next/link";

export const metadata = { title: "Signal lost (404)" };

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-hud uppercase tracking-[0.35em] text-surge text-xs sm:text-sm">Error // 404</p>
      <h1
        className="font-display font-black uppercase text-bone leading-[0.92]"
        style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
      >
        Signal lost
      </h1>
      <p className="font-sans text-mist max-w-sm">That route isn&apos;t on the map.</p>
      <Link
        href="/"
        className="font-hud uppercase tracking-widest text-sm text-bone border border-steel px-5 py-2.5 bevel bevel-sm hover:border-surge hover:text-surge transition-colors"
      >
        Return to base
      </Link>
    </main>
  );
}
