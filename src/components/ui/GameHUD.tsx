import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Trophy } from 'lucide-react';
import { useKills, useBestKills } from '@/lib/gameStore';

/**
 * Fixed corner HUD that tallies how many enemy ships the visitor has shot down
 * across the whole page. Stays hidden until the first kill so it never clutters
 * the initial view.
 */
export default function GameHUD() {
  const kills = useKills();
  const best = useBestKills();
  const [pulse, setPulse] = useState(false);
  const prev = useRef(0);

  useEffect(() => {
    if (kills > prev.current) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 250);
      prev.current = kills;
      return () => clearTimeout(t);
    }
    prev.current = kills;
  }, [kills]);

  return (
    <AnimatePresence>
      {kills > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-4 left-4 z-40 hidden sm:flex items-center gap-3 select-none"
        >
          <div className="glass-strong px-4 py-2.5 flex items-center gap-3 border border-primary/30 rounded-lg">
            <motion.div animate={pulse ? { scale: [1, 1.35, 1] } : {}} transition={{ duration: 0.25 }}>
              <Crosshair className="w-4 h-4 text-primary" />
            </motion.div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Score</span>
              <motion.span
                key={kills}
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-display font-bold text-lg text-foreground tabular-nums"
              >
                {(kills * 100).toLocaleString()}
              </motion.span>
            </div>
            <div className="w-px h-5 bg-border" />
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Trophy className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-mono tabular-nums">{(best * 100).toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
