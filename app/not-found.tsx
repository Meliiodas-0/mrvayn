import Link from "next/link";

export const metadata = { title: "Signal lost (404)" };

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-xs uppercase text-surge sm:text-meta">Error // 404</p>
      <h1
        className="font-display font-semibold uppercase leading-[0.92] text-bone"
        style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
      >
        Signal lost
      </h1>
      <p className="max-w-sm font-sans text-mist">That route isn&apos;t on the map.</p>
      <Link
        href="/"
        className="rounded border border-steel px-5 py-2.5 font-mono text-meta uppercase text-bone transition-colors hover:border-surge hover:text-surge"
      >
        Return to base
      </Link>
    </main>
  );
}
