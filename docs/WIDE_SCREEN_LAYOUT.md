# Wide-screen art direction

Palette remains ink #07080B, ivory #EFF2F6, mist #ADB6C2, steel #2D333D,
and the existing blue #546BF3. Barlow Condensed carries display headings;
Inter remains the reading face. No new decorative UI or motion.

Layout: treat the portfolio as a gallery of real-time work, not a narrow article.
Keep the existing staggered projects and alternating image/copy spreads, but
let their shared outer frame grow to 90vw (maximum 3200px). Reading measures
remain independently capped. Preserve all layouts below 1600px.

```text
logo + score                                      section navigation

large project image                     offset project image
short description                       short description

architectural showcase                  title
                                        readable description
```

Review: simply increasing the container would leave undersized labels and
excessively long paragraphs. Scale typography and spacing at different rates:
images lead, headings follow, body text grows gently and stays under 66ch.
Keep workshop at three columns so its thumbnails remain substantial. Align
hero captions and section dividers to the same frame. No changes to cinematic,
renderer, cursor logic, mobile breakpoints or project content.

## Verification

Production build, lint and TypeScript passed. Measured homepage widths:
1920 -> 1728px frame / 16px body; 2560 -> 2304px / 18px;
3072 -> 2764.8px / 19.6px; 3840 -> 3200px / 22px.
No document horizontal overflow or masthead collisions at these sizes.
Phone 390px retains 15px body and no horizontal overflow.
Visually reviewed wide project spreads, About and phone content. Corrected
auto grid rows that had separated the MagViz heading and notes excessively.
Saved wide-layout-preview.png in the task workspace; reset viewport override.
Changes remain local and uncommitted.
