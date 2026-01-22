import { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Crosshair, X } from 'lucide-react';
import GamingSetup3D from './GamingSetup3D';
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
      {/* Letterbox bars for cinematic effect */}
      <div className="fixed top-0 left-0 right-0 h-[5vh] bg-black z-50 pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-[5vh] bg-black z-50 pointer-events-none" />
      
      {/* 3D Background */}
      <Suspense fallback={
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      }>
        <GamingSetup3D />
      </Suspense>
      
      {/* Film grain overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.015]" 
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
      
      {/* Content - CINEMATIC STYLE */}
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pointer-events-none">
        {/* Small role tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <span className="inline-block px-4 py-2 text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-primary/80 border border-primary/30 bg-primary/5">
            Founder & Game Developer
          </span>
        </motion.div>
        
        {/* MASSIVE NAME - The hero moment */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative mb-6"
        >
          <span className="block text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] font-display font-black tracking-tight leading-none">
            <span className="text-foreground">MR</span>
            <span className="text-gradient text-glow-strong">VAYN</span>
          </span>
        </motion.h1>
        
        {/* Tagline - Clean and bold */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light tracking-wide"
        >
          Building next-gen game experiences with{' '}
          <span className="text-foreground font-medium">strong tech foundations</span>
        </motion.p>
        
        {/* CTA Buttons - Minimal */}
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
      
      {/* Scroll indicator - Minimal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-[8vh] left-1/2 -translate-x-1/2 z-20"
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
