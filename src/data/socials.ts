// Comms — socials + selected collaborations.

export interface Social {
  name: string;
  href: string | null;
  handle?: string;
  note: string;
}

export const socials: Social[] = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/aayush-vayn-91533921a/", note: "Professional" },
  { name: "Instagram", href: "https://www.instagram.com/builtbyvayn/", note: "Behind the scenes" },
  { name: "YouTube", href: "https://www.youtube.com/@vaynverse", note: "Dev logs & trailers" },
  { name: "Discord", href: null, handle: "loocvayn", note: "Discord handle" },
];

export interface Collab {
  title: string;
  href: string;
}

export const collaborations: Collab[] = [
  { title: "Glazer Games — Reel 1", href: "https://www.instagram.com/glazer.games/reel/Cw4-K2LtG-O/" },
  { title: "Glazer Games — Reel 2", href: "https://www.instagram.com/glazer.games/reel/CxLFe4QSr7g/" },
  { title: "Funpunch India — Reel", href: "https://www.instagram.com/funpunch_india/reel/DBKPov_hWC3/" },
  { title: "TeamXO — Post", href: "https://www.instagram.com/p/Cm16kKABqVD/" },
  { title: "AceHack — Judge Reel", href: "https://www.instagram.com/reel/DHmFXt8gQ55/" },
];
