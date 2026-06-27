import { socials } from "@/data/socials";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer data-solid className="relative z-10 border-t border-steel/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="bevel-sm inline-block h-5 w-5 bg-surge" />
          <span className="font-display text-base font-black uppercase tracking-wide text-bone">MrVayn</span>
        </div>

        <nav aria-label="Social" className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {socials.map((s) =>
            s.href ? (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-hud text-xs uppercase tracking-[0.16em] text-mist transition-colors hover:text-surge"
              >
                {s.name}
              </a>
            ) : (
              <span key={s.name} className="font-hud text-xs uppercase tracking-[0.16em] text-mist">
                {s.name}: <span className="text-bone">{s.handle}</span>
              </span>
            ),
          )}
          <a href={profile.emailHref} target="_blank" rel="noopener noreferrer" className="font-hud text-xs uppercase tracking-[0.16em] text-mist transition-colors hover:text-surge">
            Email
          </a>
        </nav>
      </div>

      <div className="border-t border-steel/40">
        <p className="mx-auto max-w-6xl px-5 py-4 font-mono text-[0.7rem] tracking-widest text-mist/60">
          BUILD v2.0 // © 2026 MrVayn, all systems nominal
        </p>
      </div>
    </footer>
  );
}
