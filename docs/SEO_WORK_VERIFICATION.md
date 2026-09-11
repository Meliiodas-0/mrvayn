# Local verification, 11 September 2026

## Completed

- Production build passes. Homepage and eight substantive case studies are
  prerendered, with unique titles/descriptions and www canonical URLs.
- `node scripts/check-seo.mjs` passes for all nine indexable URLs, 19 local
  images, crawlable homepage links, JSON-LD, sitemap, robots and unknown-page 404.
- Sitemap lists actual page URLs, not hash anchors. No fabricated last-modified
  dates. Earlier experiments without substantive write-ups do not get thin pages.
- Source HTML includes the full case studies, not just JavaScript data.
- Existing OG image remains unchanged; page title/description match each case.
- Live apex redirects to www, while the current live canonical/robots still use
  apex. The local pass fixes that mismatch.
- Work order verified in the rendered page: Antarya, SAO-X, MagViz, Broadcast &
  Camera Systems. Broadcast also follows MagViz in the capture strip.
- Five workshop entries, including Frame Lab. Both new thumbnails load.
- Frame Lab's supplied Drive folder is readable signed out and contains
  FrameLab_Submission.zip. No login, upload or sharing change was performed.

## Visual and interaction checks

- Home/work reviewed at 1440x900, 768x1024, 390x844 and 320x568.
- No horizontal overflow at these widths. New thumbnail crops checked on phone
  and desktop; diagram labels remain available in the larger project view.
- Frame Lab case page reviewed at 390x844, Broadcast at 320x568.
- Frame Lab card opens the existing quick-view panel; Read case study navigates
  to its static page. Native hrefs remain available for new-tab and no-JS use.
- Broadcast preview plays with native controls, muted and inline, then pauses
  when scrolled offscreen. Full-film link preserved.
- Phone menu opens, traps focus and closes with Escape, restoring trigger focus.
- No browser warnings/errors in the final home-page check.
- Browser viewport testing is responsive emulation, not a physical-phone test.

## Preserved

The pending navigation redesign remains in the working tree. No commits or pushes
were made in this pass. Existing hero sculpture and scroll logic remain unchanged.
Only the accessible hero heading was clarified; its visible design is unchanged.

Protected SHA-256:

- BootSequence.tsx: 2F77266738613702E3B1A71157D6E29CF74F4B918DCCB7C142F596A311E745DE
- StickCursor.tsx: 24A56EC1EA227225C6FA8CC4FA8F5E911DFFF7E54CFD9AEE5CF187D1033D3F45

## After publication

Re-run the SEO check against https://www.mrvayn.live. In the verified Google
Search Console property, submit https://www.mrvayn.live/sitemap.xml, inspect the
homepage and new project URLs, and monitor indexing and search queries. No
Search Console verification or submission has been performed. No ranking,
indexing date or rich-result appearance is promised. This pass does not include
a measured Core Web Vitals or Lighthouse performance audit.
