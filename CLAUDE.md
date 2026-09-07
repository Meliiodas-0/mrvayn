# CLAUDE.md, mrvayn.live

Auto-loaded every session. Kept lean on purpose; the shipped design system lives in
`docs/DESIGN_SYSTEM.md`, superseded specs in `docs/archive/`.

## What this is
The production portfolio of **MrVayn** (Aayush): Unreal Engine 5 + full-stack developer,
CTO at Magadha Studios. Single page, Next.js 14 App Router, TypeScript, Tailwind, deployed
on Vercel from `main` (live at mrvayn.live, apex redirects to www).

Identity order everywhere: UE5 + software developer first, Roblox last. Never ask visitors
to hire or fund; credentials are stated as facts. No invented numbers.

## The two signatures
- **ROG / Sevarog** (`src/components/ScrollSamurai.tsx`): the owner allowed removing
  it when the opening still did not feel aesthetic. It is no longer mounted, but its
  200-frame sequence and component remain available. Frames were exported by
  `scripts/rog_pipeline.py` from the owner's Unreal render (gitignored `SevRender3/`).
- **The stickman cursor game** (`src/components/StickCursor.tsx`, desktop only) plus the
  boot cinematic (`src/components/BootSequence.tsx`). The owner explicitly said not to
  touch either. Preserve their source, root colour tokens and font variables.

## Hard rules
- **Visibility contract.** Every reveal is IntersectionObserver + CSS that only animates
  TOWARD visible; markup ships visible. Never framer-motion, never `gsap.from` on opacity.
  GSAP is allowed only for non-gating transforms (see `fx/ScrollDepth.tsx`).
- **Copy.** No em dashes anywhere (site copy, comments, commits, docs). Plain section
  names: About / Showreel / Work / Impact / Skills / Journey / Contact (`src/data/sections.ts`).
- **Content lives in data files** (`src/data/*.ts`), never inline in components.
- **Performance.** Transform/opacity animations only; ROG frames load lazily; phones get
  lighter blur and no Lenis; reduced motion honoured everywhere.
  The v6.6 hero explicitly permits lazy-loaded procedural WebGL lettering. Render on
  changes only, cap pixel work, pause offscreen, and retain its visible SVG fallback.
- **Accessibility.** Visible focus, dialog focus trap + inert page, 44px tap targets,
  AA contrast for the meta layer (`--volt`, `--surge` are tuned for it).
- **Security.** No secrets in code; contact is a mailto, no form backend.
- **Deploy.** Commit author must be `Meliiodas-0 <aayush.singh007study@gmail.com>` (Vercel
  Hobby). Never run `npm run build` while `next dev` runs (shared `.next`).

## Verify before shipping
`npx tsc --noEmit`, then capture phone / 1080p / 2K with the headless script (see
`docs/DESIGN_SYSTEM.md`, "Verification") and check: no console errors, no horizontal
overflow, no label collisions, hero pointer response and phone layout, keyboard navigation
and deep links. Also scrub down and up, test mobile chapter holds and the footer exit.
The hero direction is recorded in `docs/HERO_SCROLL_DIRECTION.md`, with the mobile
refinement in `docs/MOBILE_DIRECTION.md`.
