// Single source of truth for the page sections: ids (anchors), plain labels and the
// instrument-frame index in DOM order. Nav, SectionShell, Showreel and the phone menu
// all read from here so names and numbers cannot drift.

export interface SectionDef {
  id: string;
  label: string;
  index: string;
  /** Shown in the primary nav (Showreel and Impact are reached by scrolling). */
  nav: boolean;
}

export const SECTIONS: SectionDef[] = [
  { id: "work", label: "Work", index: "01", nav: true },
  { id: "about", label: "About", index: "02", nav: true },
  { id: "impact", label: "Impact", index: "03", nav: false },
  { id: "showreel", label: "Showreel", index: "04", nav: false },
  { id: "skills", label: "Skills", index: "05", nav: true },
  { id: "journey", label: "Journey", index: "06", nav: true },
  { id: "contact", label: "Contact", index: "07", nav: true },
];

export const section = (id: string): SectionDef => {
  const s = SECTIONS.find((x) => x.id === id);
  if (!s) throw new Error(`sections: unknown id "${id}"`);
  return s;
};
