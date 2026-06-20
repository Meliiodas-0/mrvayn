import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Full-screen cinematic treatment that sits above the 3D background but below
 * the content: a soft vignette, fine film grain, scanlines, and a top scroll
 * progress bar. Purely decorative and pointer-transparent.
 */
export default function CinematicOverlay() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <>
      {/* Top scroll-progress beam */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left pointer-events-none"
        style={{
          scaleX: progress,
          background:
            'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)))',
          boxShadow: '0 0 12px hsl(var(--primary) / 0.7)',
        }}
      />

      {/* Vignette */}
      <div
        className="fixed inset-0 z-[55] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, hsl(var(--background) / 0.45) 100%)',
        }}
      />

      {/* Scanlines */}
      <div
        className="fixed inset-0 z-[55] pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--primary) / 0.6) 2px, hsl(var(--primary) / 0.6) 3px)',
        }}
      />

      {/* Film grain */}
      <div
        className="fixed inset-0 z-[55] pointer-events-none opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '180px 180px',
        }}
      />
    </>
  );
}
