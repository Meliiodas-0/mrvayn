export const HERO_MOTION = {
  stiffness: 55,
  damping: 22,
  rotation: 0.1,
  lightTravel: 0.32,
  scrollSpan: 1.05,
  scrollTurn: 0.7,
  scrollStiffness: 180,
  scrollDamping: 30,
  readingOpacity: 0.18,
  phoneScale: 0.29,
  phoneTurn: 0.32,
  phoneTouch: 1.8,
} as const;

export type HeroMotion = { [Key in keyof typeof HERO_MOTION]: number };
export const HERO_TUNING_EVENT = "portfolio:hero-motion";
