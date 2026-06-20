# MrVayn — Design System

> Design source of truth for the portfolio. Written in the spirit of
> [impeccable](https://github.com/pbakaus/impeccable) `init`: an explicit
> design context so any contributor (or AI agent) keeps the work on-brand and
> avoids generic "AI slop." If you later run `npx impeccable install`, point its
> skill at this file.

## North star

A **cinematic game-developer portfolio** — it should feel like the title screen
/ HUD of a premium game, not a SaaS landing page. Concept: **"Lacquer & Gold"**
— a warm near-black lacquer interface lit by kinpaku gold and a verdigris-teal
counter-accent, with a live 3D starfield, hand-drawn sketch rockets you can
shoot, and orchestrated motion. Refined, technical, physical — and playful.

## Color (HSL tokens — see `src/index.css`)

Dominant warm gold, sharp teal accent, copper for variety. Never pure black or
pure white.

| Token | HSL | Use |
|-------|-----|-----|
| `--background` | `40 14% 5%` | warm lacquer-black page ground |
| `--foreground` | `42 28% 92%` | champagne body/headline text |
| `--primary` | `43 90% 58%` | **kinpaku gold** — CTAs, links, key accents, glows |
| `--secondary` | `178 48% 46%` | **verdigris teal** — gradients, contrast/live signals |
| `--accent` | `28 82% 60%` | copper — small markers, variety in 3D/rockets |
| `--muted-foreground` | `42 12% 64%` | metadata, captions |
| `--border` | `40 12% 16%` | hairlines |

Rules:
- Gold is the single primary brand signal. Teal means "contrast / alive / link
  to something cool." Copper is seasoning — never dominant.
- Name/headline gradient sweeps gold → pale-gold → teal (`--gradient-primary`).
- Glows are part of the cinematic identity, but earn them — a few strong glows
  beat many weak ones. Prefer a 1px hairline before reaching for a glow.

## Typography (`tailwind.config.ts`)

Deliberately **not** Inter/Roboto/Orbitron.

- **Display** (`font-display`): **Chakra Petch** — HUD/mechanical headlines.
- **Body/UI** (`font-sans`/`font-body`): **Sora** — geometric, readable.
- **Mono** (`font-mono`): **Space Mono** — system/eyebrow labels only.

Rules:
- Fluid display sizing via `.text-fluid-hero` / `.text-fluid-section` (clamp).
- Tracked uppercase is for **short** system labels (eyebrows, chapter marks),
  never full sentences.
- Body on dark needs air: `leading-relaxed`, ~65–75ch max line length.

## Layout & spacing

- Centered containers: `max-w-6xl` (sections), `max-w-3xl` (hero copy).
- Section rhythm: `py-20 sm:py-32`; chapter header via `ui/SectionHeading.tsx`.
- Cards: `card-cinematic*` — flat, hairline-bounded, subtle border-glow on
  hover. Avoid nested cards and wide pill-radius blobs.

## Motion

- One orchestrated page load (staggered hero reveal) beats scattered micro-fx.
- Section content reveals on scroll via Framer `whileInView` (`once: true`).
- 3D background is scroll-reactive (color-shift light, parallax, pointer depth).
- Respect `prefers-reduced-motion` (intro skips, rockets stop drifting).

## The rockets (`ui/ShootableSpaceships.tsx`)

- **Hand-drawn sketch** line-art, roughened by a per-ship turbulence
  displacement filter; kept subtle (low opacity, small, few per section).
- **Slot-stable** spawn model so respawns never drift; score in `lib/gameStore.ts`.
- **Never overlap text**: confined to margins via per-section safe zones; on
  mobile the hero reserves the full centre and rockets live in top/bottom bands.

## Do

- Keep it cinematic on phone **and** desktop (3D + glow + motion scale down, not off).
- Depth from material contrast + hairlines first, then a considered glow.
- Distinctive fonts; intentional, restrained palette.
- Keep the mini-game subtle and always clear of copy.

## Don't

- No Inter/Roboto/Arial, no generic purple-on-white gradients.
- No pure black/white, no glassmorphism as decoration, no nested cards.
- No tracked uppercase sentences, no gray text on colored fills.
- Don't let decoration (rockets, 3D) obscure the actual content/proof.
