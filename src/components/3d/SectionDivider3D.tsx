import { motion } from 'framer-motion';

interface SectionDivider3DProps {
  variant?: 'wave' | 'portal' | 'data' | 'energy';
  fromColor?: string;
  toColor?: string;
}

// Reveal wrapper — fades/scales in when scrolled into view. Uses viewport
// detection (IntersectionObserver under the hood) rather than scroll-offset
// measurement, which keeps the console clean and the reveal reliable.
const reveal = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: false, amount: 0.4 },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export default function SectionDivider3D({
  variant = 'energy',
  fromColor = 'primary',
  toColor = 'secondary',
}: SectionDivider3DProps) {
  if (variant === 'wave') {
    return (
      <div className="relative h-28 sm:h-32 overflow-hidden">
        <motion.div {...reveal} className="absolute inset-0 flex items-center justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-full h-px"
              style={{
                background: `linear-gradient(90deg, transparent, hsl(var(--${fromColor})), hsl(var(--${toColor})), transparent)`,
                top: `${30 + i * 10}%`,
              }}
              animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  if (variant === 'portal') {
    return (
      <div className="relative h-36 sm:h-40 overflow-hidden flex items-center justify-center">
        <motion.div {...reveal} className="relative">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: 100 + i * 60,
                height: 100 + i * 60,
                left: -(50 + i * 30),
                top: -(50 + i * 30),
                borderColor: `hsl(var(--${i % 2 === 0 ? fromColor : toColor}) / ${0.6 - i * 0.1})`,
                boxShadow: `0 0 20px hsl(var(--${i % 2 === 0 ? fromColor : toColor}) / 0.3)`,
              }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.1, 1] }}
              transition={{
                rotate: { duration: 10 + i * 5, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
          ))}
          <motion.div
            className="w-8 h-8 rounded-full"
            style={{ background: `radial-gradient(circle, hsl(var(--${fromColor})), transparent)` }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    );
  }

  if (variant === 'data') {
    return (
      <div className="relative h-24 overflow-hidden">
        <motion.div {...reveal} className="absolute inset-0 flex justify-center gap-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-px h-full"
              style={{
                background: `linear-gradient(180deg, transparent, hsl(var(--${i % 2 === 0 ? fromColor : toColor}) / 0.5), transparent)`,
              }}
              animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  // Default: energy variant
  return (
    <div className="relative h-20 overflow-hidden">
      <motion.div {...reveal} className="absolute inset-0 flex items-center">
        <motion.div
          className="w-full h-px relative"
          style={{
            background: `linear-gradient(90deg, transparent 0%, hsl(var(--${fromColor})) 20%, hsl(var(--${toColor})) 80%, transparent 100%)`,
            boxShadow: `0 0 30px hsl(var(--${fromColor}) / 0.5), 0 0 60px hsl(var(--${toColor}) / 0.3)`,
          }}
        >
          <motion.div
            className="absolute top-0 w-20 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #ffffff, transparent)' }}
            animate={{ left: ['-10%', '110%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: `hsl(var(--${i % 2 === 0 ? fromColor : toColor}))`,
              left: `${15 + i * 15}%`,
              boxShadow: `0 0 10px hsl(var(--${i % 2 === 0 ? fromColor : toColor}))`,
            }}
            animate={{ y: [-10, 10, -10], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>
    </div>
  );
}
