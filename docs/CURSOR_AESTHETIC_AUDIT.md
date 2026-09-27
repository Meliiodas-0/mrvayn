# Cursor update: aesthetic and interface audit, revision 2

## Additive restoration follow-up

Subsequent distribution pass: budget is 4 / 6 / 8 at 1024 / 1280 / 1600px.
Extra hoverers populate upper/middle/lower free regions, selected by spacing and
vertical territory rather than first-valid random spawn. Soft steering prevents
all floaters settling along the bottom. Existing scouts and rival are retained.
Wide hero verified at 2540x1300 against the user's screenshot: five floaters occupy
both side margins at different heights; text and lettering remain excluded.
The central hero envelope remains conservative, so gaps between individual 3D
letters are not traversable. Build, hover territory regression, parkour and mask
checks pass. No browser warnings/errors; viewport override reset after inspection.

Original hovering wanderers now coexist with the current grounded scouts and
parkour rival. The previous removal of their floating behaviour is reversed,
without replacing the newer cast. Flowing two-axis wandering, fleeing, swords
and red eyes are retained, with swept geometry checks and shared separation.
Budgets are now 3 / 5 / 6 at 1024 / 1280 / 1600px, including one rival and one or
two hoverers. Score, opt-out and mobile exclusion are unchanged.

Verified the rendered production preview: hovering red-eye enemy changes both
horizontal and vertical position while a grounded scout and the ivory rival
remain present. No browser warnings/errors. Production build and existing
parkour tests pass, plus 10,160 hover collision/separation samples at 20-144fps.
Homepage first-load JS is now 227kB. Nothing committed or deployed.

## Changes made

- Kept the black-lacquer hero, typography, project ordering and existing media.
  BootSequence, HeroSculpture and themeColors remain byte-identical.
- Replaced the permanent pale-blue scarf with an ivory rival, shaded far limbs,
  a tapered torso and a small muted-rose eye detail. The run is low and forward;
  vaults are side passes; evasive leaps use a compact somersault. Landing includes
  a held three-point pose. Only two faint echoes appear around fast aerial motion.
- Changed the whole cast's behaviour. Scouts pause, patrol horizontal lanes and
  retreat from the pointer instead of flocking and bouncing. One rival shares
  those lanes, vaults to new ledges and reacts to fresh pointer approaches.
  A stationary pointer does not trigger endless evasive flips.
- Resting places come from page geometry. Page-bound actors move with scrolling
  ledges; viewport-floor actors remain attached to the viewport. Spawn spacing
  prevents stacking and avoids spawning under the pointer. Other actors reserve
  space during planning. The cast is two at 1024px, three at 1280px and four at
  1600px, with exactly one rival when space permits.
- Added a quiet Score / Best readout beside the desktop wordmark, replacing the
  old visible "Cursor on" label with a 44px icon button. One actual defeat adds
  one point. Score lasts for the tab session; best is browser-local. No network
  leaderboard, personal data or score tracking. Opt-out and score persist without
  forcing storage permission. The button has an accessible label and focus ring.
  Best hides on narrow desktop layouts; all cursor UI is absent on phones.
- Full-body route validation protects text, media, focus outlines and section
  rules. An overlapping-safe clipping mask protects content from enemy effects.
  The hero sculpture uses a conservative central envelope, not per-letter mesh
  collision. The original cursor hotspot deliberately remains on the pointer.
- Touch, reduced motion and widths below 1024px do not run the cursor system.
  Preference changes dispose the loop; hidden tabs pause it; dialogs hide enemies.
  Impossible routes are rejected, not forced through content. Layout changes can
  cause a hidden respawn when there is no valid continuous escape route. Hovering
  links, video controls or buttons suppresses enemy engagement and scoring.

## Remaining optional polish

### app/globals.css

- app/globals.css:446 - P3: 11px desktop project-tool metadata is visually small
  compared with the main reading text. A 12-13px pass would improve scanning.
- app/globals.css:468 - P3: workshop metadata uses the same small desktop scale.
  This is an aesthetic/readability suggestion, not a claimed WCAG failure.

### src/components/sections/Skills.tsx

- src/components/sections/Skills.tsx:12 - P3: long slash-separated skill lists
  become dense paragraphs on phones. Grouping them into shorter capability rows
  could improve scanning without removing any skills.

No broad restyling or content edits were made as part of this audit.

## Verification

- TypeScript, lint and deterministic tests passed. No runtime dependencies added.
- Optimized production build passed. Homepage first-load JS is 226kB. The clean
  local production preview has no tuning panel or diagnostic attributes;
  /dev/cursor returns 404. Score / Best survived the production-preview reload.
- All nine SEO-page checks and the MagViz media, byte-range and caption checks
  passed unchanged. No commit, push or deployment performed.
- 56,004 collision samples, with complete leap/vault/large-ledge/wall-kick routes
  checked at 20, 30, 60, 120 and 144 fps. All rendered poses stay inside the 25px
  planning envelope, including stroke allowance.
- 10,000 additional mask samples verified overlapping, nested and offscreen
  content rectangles cannot cancel each other's protection.
- Behaviour regressions cover scout retreat, immediate rival reaction, no
  stationary-pointer flip loops, horizontal patrol paths, separated spawning and
  document-scroll attachment. The deterministic one-minute scout patrol spends
  58% of its time resting. This is a fixture measurement, not a live FPS claim.
- Actual desktop pointer interaction produced a retreat, a defeat, Score 001 /
  Best 001 and a rival cursor leap in the work section. Visible active actors
  remained in safe space. The enlarged motion study was inspected at the tuck.
- Dialog suppression, native-cursor opt-out and keyboard re-enabling checked in
  the browser. The score remained intact when effects were toggled.
- Responsive checks: 320x568, 390x844, 1024x768, 1440x900 and 1920x1080. No horizontal
  overflow; no cursor activity/control/score on phone widths. The compact desktop
  score and navigation do not overlap. Four actors, one rival at 1920px.
  Phone menu checked. Native OS reduced-motion switching and physical touch
  devices were not emulated; those branches and hidden-tab lifecycle were reviewed
  in code. No browser warnings/errors during the desktop check.

The interface checklist was informed by the
[Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).
This is a targeted visual/interface review, not a formal accessibility certification.
