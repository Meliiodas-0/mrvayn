export const NAV_MOTION = { stiffness: 320, damping: 32, inset: 14 } as const;
export type NavMotion = { [Key in keyof typeof NAV_MOTION]: number };
export const NAV_TUNING_EVENT = "portfolio:nav-motion";
