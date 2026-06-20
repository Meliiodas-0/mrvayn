# KICKOFF — paste this as your first message in Claude Code

Read `CLAUDE.md`, everything in `/docs` (`BRIEF.md`, `DESIGN_SYSTEM.md`, `GAME_SPEC.md`), and the
`.claude/skills/frontend-design` skill. Then:

1. Inspect the existing repo (package.json, framework, build, deploy config) and the live site
   `https://mrvayn.live`. Summarize the current stack, structure, and what content I can reuse.
2. Ask me to confirm the two open decisions:
   - **Game:** OVERDRIVE (one-input neon runner) vs REFLEX RANGE (Valorant target/aim mini).
   - **Framework:** stay on the current stack vs move to Next.js (App Router) for SEO — note that the
     current site serves near-empty HTML to crawlers.
3. Give me a phased plan (use plan mode). After I approve it, build phase-by-phase per `BRIEF.md`,
   commit after each phase, take screenshots, and self-critique against `DESIGN_SYSTEM.md`.

Hard constraints (from `CLAUDE.md`): content-first and the game never blocks reading; lazy-load +
pause the game; reduced-motion + keyboard + mobile all polished; SEO with real HTML; an original
identity (no NFS/Riot logos, marks, exact colors, or proprietary fonts); no secrets in code. Use
placeholder content where mine is missing and flag every spot that needs my real content/media.
