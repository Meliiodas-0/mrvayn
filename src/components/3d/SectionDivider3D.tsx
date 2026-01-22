import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface SectionDivider3DProps {
  variant?: 'wave' | 'portal' | 'data' | 'energy';
  fromColor?: string;
  toColor?: string;
}

export default function SectionDivider3D({ 
  variant = 'energy',
  fromColor = 'primary',
  toColor = 'secondary'
}: SectionDivider3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  if (variant === 'wave') {
    return (
      <div ref={ref} className="relative h-32 overflow-hidden">
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity, scale }}
        >
          {/* Animated wave lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-full h-px"
              style={{
                background: `linear-gradient(90deg, transparent, hsl(var(--${fromColor})), hsl(var(--${toColor})), transparent)`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                scaleX: [0.5, 1, 0.5],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  if (variant === 'portal') {
    return (
      <div ref={ref} className="relative h-40 overflow-hidden flex items-center justify-center">
        <motion.div 
          className="relative"
          style={{ opacity, scale }}
        >
          {/* Concentric rings */}
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
              animate={{
                rotate: i % 2 === 0 ? 360 : -360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 10 + i * 5, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          ))}
          {/* Center glow */}
          <motion.div
            className="w-8 h-8 rounded-full"
            style={{
              background: `radial-gradient(circle, hsl(var(--${fromColor})), transparent)`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    );
  }

  if (variant === 'data') {
    return (
      <div ref={ref} className="relative h-24 overflow-hidden">
        <motion.div 
          className="absolute inset-0 flex justify-center gap-2"
          style={{ opacity, y }}
        >
          {/* Data stream lines */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-px h-full"
              style={{
                background: `linear-gradient(180deg, transparent, hsl(var(--${i % 2 === 0 ? fromColor : toColor}) / 0.5), transparent)`,
              }}
              animate={{
                scaleY: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  // Default: energy variant
  return (
    <div ref={ref} className="relative h-20 overflow-hidden">
      <motion.div 
        className="absolute inset-0 flex items-center"
        style={{ opacity }}
      >
        {/* Central energy beam */}
        <motion.div
          className="w-full h-px relative"
          style={{
            background: `linear-gradient(90deg, transparent 0%, hsl(var(--${fromColor})) 20%, hsl(var(--${toColor})) 80%, transparent 100%)`,
            boxShadow: `0 0 30px hsl(var(--${fromColor}) / 0.5), 0 0 60px hsl(var(--${toColor}) / 0.3)`,
          }}
        >
          {/* Traveling pulse */}
          <motion.div
            className="absolute top-0 w-20 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, #ffffff, transparent)`,
            }}
            animate={{
              left: ['-10%', '110%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        {/* Side particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: `hsl(var(--${i % 2 === 0 ? fromColor : toColor}))`,
              left: `${15 + i * 15}%`,
              boxShadow: `0 0 10px hsl(var(--${i % 2 === 0 ? fromColor : toColor}))`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
