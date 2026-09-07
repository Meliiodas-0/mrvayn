export type SectionAnchor = { id: string; top: number };

/** Select from cached document positions; large sections cannot miss an IO band. */
export function activeSection(position: number, height: number, maxScroll: number, anchors: SectionAnchor[]) {
  if (!anchors.length) return "";
  if (maxScroll > 0 && position >= maxScroll - 2) return anchors[anchors.length - 1].id;
  const readingLine = position + Math.max(104, height * .24);
  let active = "";
  for (const anchor of anchors) {
    if (anchor.top > readingLine) break;
    active = anchor.id;
  }
  return active;
}
