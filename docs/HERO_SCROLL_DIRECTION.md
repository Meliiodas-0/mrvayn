# Hero v6.6: scroll-driven letter choreography

Historical implementation plan. The mobile upward-exit decision below is superseded
by `MOBILE_DIRECTION.md` (v6.8), following the owner's request for a more engaging
phone experience. The desktop choreography remains unchanged.

The owner explicitly corrected the v6.5 implementation on 8 September 2026:
study Maxime Veilleux by scrolling and reproduce the scroll concept, not only its
lettering or mouse response.

## Reference observations

Manually scrolled https://maxveilleux.com/en/ in successive increments on desktop
and at 375x812. The sculpture is viewport-pinned, not a normal scrolling banner.
The assembled letters separate and rotate as the next content enters. A giant M
holds to the left of the bio, then A occupies the right beside projects. The
transition reverses with scroll. On phone, the sculpture moves upward and clears
the full-width text instead of staying behind the reading area.

## Plan and brief review

Retain the existing tokens: ground #07080B, lacquer #23252A, reflections #B8BCC3,
type #EFF2F6, secondary type #ADB6C2, focus #A9B7FF. Retain the original six custom
MRVAYN glyphs, Inter caption and all existing content. No new font or media asset.

Use the same pinned, scroll-scrubbed disassembly. Normal document scrolling drives
the letters' position, scale and rotation, not time or a wheel-triggered autoplay.
The six letters fan toward the edges as Work rises through the central opening.
Large individual letters then hand off between the existing sections. Keep content
above the decorative canvas and ease the reflections down behind reading content.
On phone the opening separates upward and leaves the reading area clear.

```text
scroll 0             opening transition          existing content
M  R  V              M <     R ^    V >          giant M | Work
 A  Y  N                 Work enters             content | giant R
                     A v     Y v    N >          next section ...
```

The rejected implementation animated only pointer reflections and let the whole
hero scroll away. A fade/shrink of that banner would still miss the brief. This
revision changes the scene's relationship to the page: persistent viewport-space
geometry with independent, reversible letter paths. Existing page content does not
get pinned, hidden, rearranged, or replaced.

Reduced motion uses the still wordmark and ordinary page scrolling. Server SVG
remains visible without JavaScript or WebGL. No scroll interception, added blank
scroll runway, device-orientation permission or changes to the protected stickmen.
Use Motion spring values and expose scroll response, spread and turn in dev DialKit.
