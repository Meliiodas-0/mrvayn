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
- **ROG**, the resident ink wraith (`src/components/ScrollSamurai.tsx`): a 200-frame
  transparent WebP sequence on a fixed canvas, scrubbed by scroll, far right on desktop,
  uniform faint opacity, calm (no shake). Frames are exported by
  `scripts/rog_pipeline.py` from the owner's Unreal render (gitignored `SevRender3/`).
- **The stickman cursor game** (`src/components/StickCursor.tsx`, desktop only) plus the
  boot cinematic (`src/components/BootSequence.tsx`). Tune, never delete.

## Hard rules
- **Visibility contract.** Every reveal is IntersectionObserver + CSS that only animates
  TOWARD visible; markup ships visible. Never framer-motion, never `gsap.from` on opacity.
  GSAP is allowed only for non-gating transforms (see `fx/ScrollDepth.tsx`).
- **Copy.** No em dashes anywhere (site copy, comments, commits, docs). Plain section
  names: About / Showreel / Work / Impact / Skills / Journey / Contact (`src/data/sections.ts`).
- **Content lives in data files** (`src/data/*.ts`), never inline in components.
- **Performance.** Transform/opacity animations only; ROG frames load lazily; phones get
  lighter blur and no Lenis; reduced motion honoured everywhere.
- **Accessibility.** Visible focus, dialog focus trap + inert page, 44px tap targets,
  AA contrast for the meta layer (`--volt`, `--surge` are tuned for it).
- **Security.** No secrets in code; contact is a mailto, no form backend.
- **Deploy.** Commit author must be `Meliiodas-0 <aayush.singh007study@gmail.com>` (Vercel
  Hobby). Never run `npm run build` while `next dev` runs (shared `.next`).

## Verify before shipping
`npx tsc --noEmit`, then capture phone / 1080p / 2K with the headless script (see
`docs/DESIGN_SYSTEM.md`, "Verification") and check: no console errors, no horizontal
overflow, no label collisions, ROG complete and far right.
