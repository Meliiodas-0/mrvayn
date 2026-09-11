# mrvayn.live design system (v6.9, navigation refinement)

## Direction

A developer's portfolio with an original black-lacquer MRVAYN sculpture as its opening.
The owner selected Maxime Veilleux's hero concept on 7 September 2026 and asked for
MRVAYN followed by the existing content. This explicitly supersedes the text-only
v6.4 hero. There are no slogans, superiority claims, game backgrounds or video loops.
Open, unboxed project layouts follow, where the actual footage belongs.

The owner rejected v5's repeated glass panels, v6's giant wordmark / blue arch /
Sevarog opening, v6.1's game-scene background, v6.2's static silver V, and v6.3's
Code / Play typography and cobalt field. The latest request explicitly says dark and
subtle. The new sculpture is an explicit owner choice, not a return to the earlier
wordmark/arch layout. Sevarog's source and media are retained locally, but it is not
mounted. The hero plan is in `HERO_SCROLL_DIRECTION.md`; the whole-site polish is
in `SITE_POLISH_DIRECTION.md`. The mobile refinement is in `MOBILE_DIRECTION.md`.
The owner explicitly
corrected v6.5's pointer-only behaviour: the reference must be studied by scrolling.

The user's September 2026 boundary is explicit: do not change the stickman cinematic
or the cursor/enemy game. Sevarog can move. This implementation leaves both protected
files byte-for-byte unchanged, and preserves their root colour and font tokens.

## Palette and typography

- Canvas ground: #07080B.
- Primary type: #EFF2F6.
- Body: #ADB6C2.
- Quiet page metadata: #96A0AF (root cinematic metadata remains #828D9C).
- Cobalt page actions: #546BF3.
- Accessible blue text: #A9B7FF.

The hero uses the dark page palette. Its #23252A lacquer material catches neutral
studio reflections. No neon, coloured glow, solid colour field or fake interface.

The page palette is scoped to `.portfolio-theme`. The original red cinematic palette
remains on `:root`, because `src/lib/themeColors.ts` reads those properties directly.
Do not replace the root tokens to recolour the page.

The hero letterforms are original paths cast into continuous rounded geometry.
Inter remains the reading voice and small-control type, in sentence case. Barlow
Condensed 500/600 carries project titles, section headings, footer and the new
desktop section index. No font or media assets were added for this hero.
Three.js is lazy-loaded for its geometry and renderer; Motion drives the response.
The original Space Grotesk and JetBrains Mono variables remain unchanged for the
protected canvases.

## Whole-page continuity

The sculpture fades to 18% as work arrives, then continues its chapter choreography
on one transparent dark ground. Sections use inset rules, not opaque background slabs.
The exit normalizes to the reachable document end so the footer finishes clear.
Phone workshop items use a readable single-column editorial list. Body copy is 15px,
secondary descriptions 13-14px and media captions 12px. Narrow screens use native
scrolling, including when resizing from desktop. Navigation uses cached section
positions and exposes its active state to assistive technology.

The v6.9 navigation is a compact masthead: 24px display-type section links, a
single spring-driven underline, and a separate Contact link with a light circular
arrow. Hover/focus preview does not change aria-current. A labeled Menu/Close
toggle opens the phone menu. See `NAV_DIRECTION.md`. The 80px desktop and 64px
phone navigation rows remain, with a 1px header boundary. Existing section links
and scroll offsets are preserved.

## Composition

The content column remains max 1440px, with fluid outer gutters. The full-viewport
hero has an asymmetric two-row wordmark on desktop, and three two-letter rows on
phone. A compact identity and normal Work link anchor its lower edge. The sculpture
is viewport-pinned during normal scrolling. Individual letters separate, enlarge,
rotate and move to the edges as existing content passes in front. Phone letters
now hold at the edges too, with width-based scale and a slow scroll-driven roll.
The sculpture is decorative to assistive
technology; a native h1 exposes MRVAYN once.

Desktop opening:
```text
existing navigation

           M     R     V
              A     Y     N

Aayush / MrVayn                            View work
Unreal Engine & full-stack development
```

Work appears immediately after the opening:
```text
Cricket Broadcast Lab
[               full-width film               ]
contribution + links             format / runtime

Antarya
[ large gameplay still ]
                              SAO-X
                              [ gameplay preview ]
contribution                  contribution

[ MagViz product preview ]    MagViz / contribution

[ smaller project ] [ smaller project ] [ ... ]
Earlier experiments (expandable)
```

Antarya and SAO-X are offset game spreads, with different visual weight. MagViz is a
wide product spread. Cricket leads as a screening room. Phones read title, media,
caption, contribution, actions, without visual reordering of meaningful content.

About pairs a large personal thesis with a compact bio. Skills and Journey are
reading lists, not cards. The Contact section closes with a direct email link and
a large cobalt wordmark. Additional collaborations and older prototypes remain
available through native details controls.

## Interaction and motion

- The protected cinematic and cursor/enemy game retain their original logic, timing,
  colours, fonts, controls, and source files.
- Sevarog is not rendered, and its preload links have been removed. The hero uses
  no external model, texture, image or video assets. A server-rendered SVG remains
  visible until the lazy WebGL renderer draws, and returns on context loss.
- Scroll position drives a reversible six-letter choreography, not a triggered
  autoplay. Work, About, Impact, Showreel, Skills and Journey define the successive
  large-letter holds on desktop. Phone anchors are Work, Antarya, SAO-X, About,
  Skills and Journey, giving the longer selected-work layout its own transitions.
  Both use the 18% reading opacity. Contact clears the geometry. Sections remain
  transparent above the decorative layer. No added scroll runway or content pinning.
- The sculpture also retains a restrained pointer response. Touch responds directly
  inside the hero, with passive listeners and native vertical scrolling. Touching
  controls does not tilt the sculpture; release or native-scroll cancellation resets
  the response. No pointer
  capture, drag lock or orientation permission. Canvas never intercepts links.
- The renderer draws on changes only, pauses offscreen and in hidden tabs, and caps
  the pixel budget. Reduced motion keeps it still. The development-only DialKit Hero
  group tunes pointer response plus scroll span, turn, stiffness and damping. Its
  Mobile group exposes scale, turn and touch strength, with stable production defaults.
  Reduced motion restores an ordinary, non-pinned still hero. Production does not
  subscribe to the development tuning event.
- The cinematic is unchanged; the new hero is immediately visible after it ends.
  No staggered card entrances or drifting section titles.
- The capture strip is manual, with swipe, native scrollbar, keyboard-accessible
  links, and 44px previous/next buttons. There is no autoplay marquee.
- Motion also drives the thin additive scroll-progress line. Reduced motion bypasses
  its spring. DialKit stays development-only, with stable 12px / .55s reveal defaults.
- Desktop Lenis remains; phones and reduced-motion visitors scroll natively.

## Media and accessibility

`ClipPreview` still loads only on explicit Play. Native controls preserve the entire
16:9 gameplay frame. Local video pauses offscreen, on hidden tabs, when another
preview plays, or when a project detail opens. The full Drive links are unchanged.
All project claims, case-study evidence and media remain sourced from the existing
data. Editorial copy lives in `src/data/editorial.ts`.

The project dialog traps focus and makes the page inert. The mobile menu also
contains keyboard focus, marks the reading surface inert, closes with Escape, and
restores focus to the opener. Focus rings and 44px targets remain mandatory.
Reduced-motion CSS never affects the protected signature canvases.

## Verification

Run `node scripts/test-hero-scroll.mjs`, `npx tsc --noEmit`, `npm run lint`, and a production build. Stop `next dev`
before building because they share `.next`. Use the available browser tooling for
375x812, 1920x950, and 2560x1300 checks, plus a narrow 320px overflow audit.

Review the opening, all selected projects, native previews, capture controls,
mobile menu, project dialog, footer, console errors, and horizontal overflow.
Check the protected file hashes before handing off:

- BootSequence.tsx: 2F77266738613702E3B1A71157D6E29CF74F4B918DCCB7C142F596A311E745DE
- StickCursor.tsx: 24A56EC1EA227225C6FA8CC4FA8F5E911DFFF7E54CFD9AEE5CF187D1033D3F45

## Delivery state

The v6.7 design was published as `9e31a28`. The owner approved publishing this
tested v6.8 mobile refinement on 8 September 2026 for physical-phone review.
Keep the existing GitHub/Vercel hosting workflow. Confirm the release status and
public domain after publishing; the preview checks are in `MOBILE_VERIFICATION.md`.
Web3 Development was subsequently published in `924a09f`. The v6.9 navigation is
a local preview only, not committed or published.
