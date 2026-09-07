# Hero v6.5: MRVAYN in black lacquer

Geometry/material foundation retained. Its pointer-only interaction is superseded
by `HERO_SCROLL_DIRECTION.md`, following the owner's 8 September correction.

The owner chose Maxime Veilleux's portfolio concept on 7 September 2026 and asked
for MRVAYN followed by the existing website content. This supersedes the v6.4
text-only hero restriction. It does not authorize copying Maxime's assets or code.

## Plan

- Ground: #07080B, continuous with the existing page.
- Material: #23252A black lacquer, satin metal underneath a restrained clear coat.
- Reflection: #B8BCC3, large neutral studio lights, not neon or rainbow reflections.
- Text: #EFF2F6. Supporting text: #ADB6C2. Focus: #A9B7FF.
- Type: original rounded, tubular MRVAYN letterforms are the visual identity.
  Existing Inter handles the small identity and navigation. Keep protected fonts.
- Full-height typographic sculpture, asymmetrical two-row composition on desktop,
  reflowed into three two-letter rows on phone. No card panels or title above it.
- Identity and a normal Work link anchor the lower edge. Existing Work, About,
  Impact, Showreel, Skills, Journey and Contact follow without content changes.

```text
desktop                         phone
existing navigation             existing navigation

   M     R     V                  M    R
      A     Y     N                V    A
                                  Y    N

role                 View work   role       View work
existing Work                   existing Work
```

## Review against the brief

A conventional typeface with a CSS bevel would flatten the chosen reference into
another generic headline. Instead use real rounded geometry, individually composed
letterforms and studio reflections that react to movement. Do not add a secondary
headline, badges, specs, instructions or fake terminal chrome. Keep the word legible.

The same six custom glyph paths drive a visible SVG fallback and the WebGL scene.
Signed-distance volumes unite each letter into one rounded surface, including its
branching joins. Temporary voxel data is discarded after geometry extraction.
The 3D renderer is lazy-loaded; no external model, texture or image download. Motion
springs drive limited scene response. Render only on changes, pause offscreen and
when the document is hidden, reduce phone resolution, and dispose GPU resources.
Reduced motion keeps the sculpture still. Phones scroll natively; no drag lock or
device-orientation permission. No functionality depends on the visual interaction.

The stickman cinematic and cursor/enemy game, plus root colour/font tokens, remain
unchanged. There is no new cursor. The composition is a local preview, not a deploy.
