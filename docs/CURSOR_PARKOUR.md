# Cursor parkour direction

## Additive hovering restoration

The original floating wander/flee enemies now coexist with the grounded scouts
and the single parkour rival. They retain their sword and red eye, flowing
two-dimensional roaming and pointer evasion. They use swept body collision and
separation rather than crossing content or stacking on the newer actors.
Desktop budgets: 1024px has two hoverers, a scout and a rival; 1280px has three
hoverers, two scouts and a rival; 1600px has five hoverers, two scouts and a rival.
Space constraints can reduce visible counts. Hover spawns score candidate gaps
by separation, side and vertical territory. A soft vertical steering force keeps
upper and middle lanes occupied without freezing enemies at assigned coordinates.
All types share scoring, opt-out, modal pause, respawn and phone exclusion.
Run `node scripts/check-hover.mjs` for hover-specific regressions.

## Brief and visual decisions

Revision 2: a small duel in the margins. Keep both enemy identities, the player
cursor, sword combos, boot film, hero sculpture and portfolio layout intact.
Replace aimless flocking with observable intentions for the whole cast.

- Ground #07080B, rival ivory #E4E6E9, scout slate #828D9C, shadow #454C58,
  restrained contact rose #CD8B93. No new global palette tokens or blue scarf.
- Existing Barlow Condensed display and Inter body stay unchanged. Inter with
  tabular numerals for the desktop score. No arcade display font.
- The page is the environment: content rectangles and visible rules are solid.
  Movement belongs in the negative space, never over the work itself.

```text
mv.  [pointer]  Score 003  Best 012                       Work About ...

     scout: watch -> short patrol -> retreat from approaching cursor
     rival: perch -> assess -> dash / vault / evade -> absorb -> hold
     routes: horizontal lanes and ledges, not arbitrary floating diagonals
```

Review against the brief: the first version had technically safe curves but too
little stillness, repeated wall kicks and a permanently extended scarf. Those
are spectacle without intention. The revised memorable gesture is one compact,
ivory rival with a low sprint, readable tuck, distinct vault and three-point
landing. Scouts keep the old sword-stick identity but stop, watch and retreat.
One rival only. Short aerial echoes, no costume ribbons, glows or constant spins.
Keep the score left-aligned beside the wordmark, not floating over project media.
Best is local to this browser; score counts defeated enemies, not fake points.

## Safety contract

Validate a conservative whole-body envelope along the entire curved route before
launch. Recheck swept movement against the current layout. Replan on scroll and
resize; if content completely covers an actor, hide and respawn in verified free
space, never visibly teleport through text. Clip enemy effects out of content as
a final rendering guard. The player's pointer hotspot is deliberately exempt.

Motion stays off on touch and reduced-motion devices, responds to preference
changes, pauses in hidden tabs and hides in dialogs. A small persistent cursor
effects switch provides an ordinary pointer when desired. Tuning is local-only.

## Verification

Completed: geometry tests, frame-rate checks, desktop interaction, content
collision inspection, mobile-width fallback and production build. See
CURSOR_AESTHETIC_AUDIT.md for findings and verification boundaries.

Run `node scripts/check-parkour.mjs` for deterministic route, pose and mask tests.
Run `npm run dev` and open `/dev/cursor` for the local enlarged motion study.
The lab returns 404 in production. The normal portfolio uses the same engine.

No commit, push or deployment was performed for this update.
