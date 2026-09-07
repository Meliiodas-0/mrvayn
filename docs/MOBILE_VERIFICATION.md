# Mobile v6.8 verification

This records the local verification of the mobile refinement after v6.7 (`9e31a28`).
The owner approved publishing the tested source on 8 September 2026 to review it
on a physical phone. Release via the existing GitHub/Vercel connection and verify
the resulting deployment and public domain. No further design changes in that release.

## What changed

- Mobile letters persist through selected work and subsequent sections, with
  portrait-specific scale, scroll-driven roll and six chapter handoffs. Their
  reading opacity settles at 0.18 and the reachable footer clears them completely.
- Passive finger interaction is limited to the hero's non-interactive surface.
  Release, blur and native-scroll pointer cancellation reset the response. There
  is no pointer capture, prevented scrolling, orientation sensor or idle animation.
- Selected-project images and previews reach both phone edges. Captions retain
  the reading gutter, including at 600px. Hero identity text increases to 12px.
- Mobile scale, turn and touch strength are available in dev-only DialKit. Removed
  an explicit false flag that had also disabled the panel in development. Compared
  scale 0.28 and 0.29 through its actual slider; retained 0.29 as the stable default.

## Visual and interaction checks

Reviewed the local page in responsive desktop-browser viewports, not on physical
mobile hardware. At 390x844, scrolled through the opening, Cricket, Antarya, SAO-X,
MagViz, the workshop, About, Impact, captures, Skills, Journey and Contact.

- Opening disassembly and upward reversal both show the mobile M hold. Subsequent
  R, V, A, Y and N transitions remain behind the reading layer. No extra scroll
  runway, blank content states, clipped prose or new autoplay was introduced.
- At the reachable page end, canvas opacity is exactly 0.
- At 320x740 the identity and Work link do not overlap, the page has no horizontal
  overflow, and the Work menu link lands at the intended 68px offset.
- All four featured/selected media spreads run edge to edge at 600x900; the page
  has no horizontal overflow there, at 390px or at 320px.
- Cricket's native 20.95-second preview loads and reaches its end with native
  controls and no media error. The full-film Drive URL is unchanged.
- On the production preview, the phone case study opens above the canvas, marks
  main inert, keeps its close button at y=12px during independent scrolling, and
  closes with Escape. Focus returns to View project and inert is removed.
- The production 1920x950 hero retains the approved two-row geometry. Its Work
  transition and the 2560x1300 composition remain intact with no overflow.
- The development panel is absent from production. No new warning/error entries
  appeared during production reload and interaction checks. One historical dev
  React warning was recorded when HMR changed DialRoot from disabled to enabled;
  it did not recur after the clean production reload.

## Automated checks

- `node scripts/test-hero-scroll.mjs`: 4,458 finite, deterministic poses; exact
  opening reversal; continuous chapter boundaries; visible mobile holds and
  offscreen parking/footer clearance across nine portrait geometry combinations.
- Compared 1,818 desktop poses against `HEAD` (the live revision). Every position,
  scale and rotation matched exactly.
- Reading-opacity and reachable-outro tests pass. Worst-case settled metadata
  contrast remains 4.68:1. This is not a claim of full WCAG certification.
- TypeScript and lint pass. The production build passes: route / is 129kB,
  first-load JS 216kB. The existing edge-runtime notice is for Open Graph generation.
- No dependency, root-palette, original-font, project-copy or media changes.
- Protected SHA256 hashes remain unchanged:
  - BootSequence: `2F77266738613702E3B1A71157D6E29CF74F4B918DCCB7C142F596A311E745DE`
  - StickCursor: `24A56EC1EA227225C6FA8CC4FA8F5E911DFFF7E54CFD9AEE5CF187D1033D3F45`

## Limits

Native touch gestures, physical iPhone/Android rendering, mobile Safari, forced
WebGL context loss and OS reduced-motion changes were not exercised. Their code
paths were reviewed; reduced motion retains the existing still, non-pinned SVG/WebGL
hero and native scrolling. Existing dependency audit findings remain outside this
visual-only change and are documented in HERO_VERIFICATION.md.

The design skill kept the work focused on one expressive sculpture, with quiet
supporting layouts. The motion skill guided reversible scroll poses, direct finger
response and development-only tuning rather than an idle animation loop.
