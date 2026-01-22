import { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Crosshair, X } from 'lucide-react';
import GamingSetup3D from './GamingSetup3D';
import ShootableSpaceships from '@/components/ui/ShootableSpaceships';

// Golden Ratio: 1.618
const PHI = 1.618;

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
      onClick={handleSectionClick}
    >
      {/* Cinematic letterbox - only visible within hero, not fixed */}
      <div className="absolute top-0 left-0 right-0 h-[3vh] bg-black/80 z-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[3vh] bg-black/80 z-30 pointer-events-none" />
      
      {/* 3D Background */}
      <Suspense fallback={
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      }>
        <GamingSetup3D />
      </Suspense>
      
      {/* Film grain overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.02]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Shootable Spaceships */}
      <ShootableSpaceships sectionId="hero" count={6} safeZones={heroSafeZones} />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background pointer-events-none z-10" />

      {/* Shooting hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[8vh] sm:top-[10vh] left-1/2 -translate-x-1/2 z-30"
          >
            <div className="card-cinematic px-4 py-3 flex items-center gap-3 group">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Crosshair className="w-5 h-5 text-primary" />
              </motion.div>
              <div className="text-sm">
                <span className="text-foreground font-medium">Click the enemy ships</span>
                <span className="text-muted-foreground"> to destroy them!</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowHint(false); }}
                className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content - GOLDEN RATIO PROPORTIONS */}
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pointer-events-none">
        {/* Role tag - Size based on golden ratio (name size / PHI^3) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-[2.5vh]" // Golden spacing
        >
          <span className="inline-block px-5 py-2.5 text-[0.7rem] sm:text-xs font-mono tracking-[0.35em] uppercase text-primary/80 border border-primary/30 bg-primary/5">
            Founder & Game Developer
          </span>
        </motion.div>
        
        {/* MASSIVE NAME - Primary focal point */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative mb-[3vh]" // Golden spacing to tagline
        >
          {/* Golden ratio typography: base size with PHI scaling */}
          <span 
            className="block font-display font-black tracking-tighter leading-[0.85]"
            style={{
              fontSize: 'clamp(4rem, 15vw, 14rem)', // Responsive massive text
            }}
          >
            <span className="text-foreground">MR</span>
            <span className="text-gradient text-glow-strong">VAYN</span>
          </span>
        </motion.h1>
        
        {/* Tagline - Size = Name / PHI^2 ≈ 2.618 times smaller */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-[5vh] max-w-xl mx-auto font-light tracking-wide leading-relaxed"
        >
          Building next-gen game experiences with{' '}
          <span className="text-foreground font-medium">strong tech foundations</span>
        </motion.p>
        
        {/* CTA Buttons - Spacing follows golden ratio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto"
        >
          <a
            href="#projects"
            className="group px-8 py-4 text-sm font-semibold uppercase tracking-wider bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)]"
          >
            View Projects
          </a>
          <a
            href="#about"
            className="px-8 py-4 text-sm font-semibold uppercase tracking-wider border-2 border-foreground/20 text-foreground/80 hover:border-primary/50 hover:text-primary transition-all duration-300"
          >
            About Me
          </a>
        </motion.div>
      </div>
      
      {/* Scroll indicator - Positioned at golden ratio from bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-[6vh] left-1/2 -translate-x-1/2 z-20"
      >
        <motion.a
          href="#about"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.a>
      </motion.div>
    </section>
  );
}
