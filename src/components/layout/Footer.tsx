import { socials } from "@/data/socials";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    // Same 0.86 ground as the sections so ROG stays the same faint ink here; Contact's
    // bottom rule is the footer's top rule (no doubled hairline).
    <footer data-solid className="relative z-content bg-void/[0.94]">
      <div className="mv-col flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="inline-block h-5 w-5 rounded bg-ion" />
          <span className="font-display text-base font-semibold uppercase tracking-wide text-bone">MrVayn</span>
        </div>

        <nav aria-label="Social" className="flex flex-wrap items-center gap-x-5 gap-y-0">
          {socials.map((s) =>
            s.href ? (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center font-mono text-xs uppercase text-mist transition-colors hover:text-surge"
              >
                {s.name}
              </a>
            ) : (
              <span key={s.name} className="inline-flex min-h-10 items-center font-mono text-xs uppercase text-mist">
                {s.name}: <span className="ml-1 normal-case text-bone">{s.handle}</span>
              </span>
            ),
          )}
          <a href={profile.emailHref} className="inline-flex min-h-10 items-center font-mono text-xs uppercase text-mist transition-colors hover:text-surge">
            Email
          </a>
        </nav>
      </div>

      <div className="border-t border-steel/50">
        <p className="mv-col py-4 font-mono text-xs text-volt">© 2026 MrVayn</p>
      </div>
    </footer>
  );
}
