import type { Rect } from "./parkour";

const CONTENT =
  '[data-solid],h1,h2,h3,h4,p,a,button,summary,input,textarea,select,img,video,iframe,.footer-wordmark,[role="dialog"],[data-cursor-obstacle]';
const FRAMES = "section,article,header,footer,details,[data-cursor-frame]";

/** Batch reads, no per-enemy layout queries. Descendants of a solid are redundant. */
export function createObstacleReader() {
  let content: Element[] = [],
    frames: Element[] = [];
  function scan() {
    content = Array.from(document.querySelectorAll(CONTENT)).filter(
      (el) =>
        !el.parentElement?.closest("[data-solid],[data-cursor-obstacle]") &&
        !el.closest("[data-cursor-ui],.dialkit-root"),
    );
    frames = Array.from(document.querySelectorAll(FRAMES)).filter(
      (el) => !el.closest("[data-cursor-ui]"),
    );
  }
  scan();
  function read(width: number, height: number): Rect[] {
    const out: Rect[] = [];
    // Reserve the hero's central sculpture, which is rendered text rather than DOM
    // text. The generous envelope leaves the side lanes free without touching the
    // existing WebGL renderer or changing its scroll choreography.
    const hero = document
      .querySelector(".sculpture-hero")
      ?.getBoundingClientRect();
    if (hero && hero.bottom > 160 && hero.top < height)
      out.push({
        left: width * 0.1,
        right: width * 0.9,
        top: Math.max(96, hero.top + 65),
        bottom: Math.min(height - 95, hero.bottom - 95),
      });
    const visible = (r: DOMRect) =>
      r.width > 0 &&
      r.height > 0 &&
      r.bottom > 0 &&
      r.top < height &&
      r.right > 0 &&
      r.left < width;
    for (const el of content) {
      const r = el.getBoundingClientRect();
      if (!visible(r)) continue;
      const css = getComputedStyle(el);
      if (css.visibility === "hidden" || css.display === "none") continue;
      // Protect focus rings as well as the element itself.
      const ring =
        css.outlineStyle !== "none"
          ? Math.max(
              0,
              parseFloat(css.outlineWidth) + parseFloat(css.outlineOffset),
            )
          : 0;
      out.push({
        left: r.left - ring,
        top: r.top - ring,
        right: r.right + ring,
        bottom: r.bottom + ring,
      });
    }
    for (const el of frames) {
      const r = el.getBoundingClientRect();
      if (!visible(r)) continue;
      const c = getComputedStyle(el);
      const top = parseFloat(c.borderTopWidth),
        bottom = parseFloat(c.borderBottomWidth),
        left = parseFloat(c.borderLeftWidth),
        right = parseFloat(c.borderRightWidth);
      if (top > 0)
        out.push({
          left: r.left,
          top: r.top,
          right: r.right,
          bottom: r.top + top,
        });
      if (bottom > 0)
        out.push({
          left: r.left,
          top: r.bottom - bottom,
          right: r.right,
          bottom: r.bottom,
        });
      if (left > 0)
        out.push({
          left: r.left,
          top: r.top,
          right: r.left + left,
          bottom: r.bottom,
        });
      if (right > 0)
        out.push({
          left: r.right - right,
          top: r.top,
          right: r.right,
          bottom: r.bottom,
        });
    }
    return out;
  }
  return { scan, read };
}

/** Reverse-wound holes use the nonzero rule: overlaps stay holes, unlike evenodd. */
export function contentClip(
  width: number,
  height: number,
  obstacles: Rect[],
): Path2D {
  const path = new Path2D();
  path.rect(8, 96, Math.max(0, width - 16), Math.max(0, height - 108));
  // Clipping intersections one by one would be expensive. Build the UNION of
  // axis-aligned holes with x-slabs, so overlapping text/media cannot cancel out.
  const rects = obstacles
    .map((r) => ({
      left: Math.max(8, r.left - 5),
      right: Math.min(width - 8, r.right + 5),
      top: Math.max(96, r.top - 5),
      bottom: Math.min(height - 12, r.bottom + 5),
    }))
    .filter((r) => r.left < r.right && r.top < r.bottom);
  const xs = Array.from(new Set(rects.flatMap((r) => [r.left, r.right]))).sort(
    (a, b) => a - b,
  );
  for (let i = 0; i < xs.length - 1; i++) {
    const l = xs[i],
      r = xs[i + 1],
      intervals = rects
        .filter((v) => v.left < r && v.right > l)
        .map((v) => [v.top, v.bottom])
        .sort((a, b) => a[0] - b[0]);
    let top = 0,
      bottom = 0;
    const add = () => {
      path.moveTo(l, top);
      path.lineTo(l, bottom);
      path.lineTo(r, bottom);
      path.lineTo(r, top);
      path.closePath();
    };
    for (const v of intervals) {
      if (v[0] > bottom) {
        if (bottom > top) add();
        [top, bottom] = v;
      } else bottom = Math.max(bottom, v[1]);
    }
    if (bottom > top) add();
  }
  return path;
}
