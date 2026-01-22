import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Crosshair, X } from 'lucide-react';
import ShootableSpaceships from '@/components/ui/ShootableSpaceships';

// Safe zones for hero - central text only
const heroSafeZones = [
  { top: 25, left: 10, width: 80, height: 55 },
];

interface HeroSectionProps {
  introComplete?: boolean;
}

export default function HeroSection({ introComplete = true }: HeroSectionProps) {
  const [showHint, setShowHint] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleSectionClick = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowHint(false);
    }
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onClick={handleSectionClick}
    >
      {/* Shootable Spaceships */}
      <ShootableSpaceships sectionId="hero" count={6} safeZones={heroSafeZones} />

      {/* Shooting hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-30"
          >
            <div className="card-cinematic px-4 py-2.5 flex items-center gap-3 group">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Crosshair className="w-4 h-4 text-primary" />
              </motion.div>
              <div className="text-xs sm:text-sm">
                <span className="text-foreground font-medium">Click the enemy ships</span>
                <span className="text-muted-foreground"> to destroy them!</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowHint(false); }}
                className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content - GOLDEN RATIO BALANCED */}
      <div className="relative z-20 text-center px-6 max-w-3xl mx-auto pointer-events-none">
        
        {/* Role tag */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-2 text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-primary/70 border border-primary/25 bg-primary/5 rounded-sm">
            Founder & Game Developer
          </span>
        </motion.div>
        
        {/* NAME */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mb-5"
        >
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-tight">
            <span className="text-foreground">Hi, I'm </span>
            <span className="text-gradient text-glow-strong">MrVayn</span>
          </span>
        </motion.h1>
        
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 max-w-lg mx-auto font-light leading-relaxed"
        >
          Building next-gen game experiences with{' '}
          <span className="text-foreground font-normal">strong tech foundations</span>
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center pointer-events-auto"
        >
          <a
            href="#projects"
            className="px-7 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)]"
          >
            View Projects
          </a>
          <a
            href="#about"
            className="px-7 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider border border-foreground/20 text-foreground/70 hover:border-primary/40 hover:text-primary transition-all duration-300"
          >
            About Me
          </a>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.a
          href="#about"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted-foreground/60 hover:text-primary transition-colors"
        >
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.a>
      </motion.div>
    </section>
  );
}
