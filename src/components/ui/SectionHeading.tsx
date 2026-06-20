import { motion } from 'framer-motion';

interface SectionHeadingProps {
  chapter: string;
  title: string;
  subtitle?: string;
  badge?: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Cinematic, HUD-styled section header used across every section for a
 * consistent rhythm. Fluid type keeps it precise from phones to ultrawide.
 */
export default function SectionHeading({ chapter, title, subtitle, badge }: SectionHeadingProps) {
  return (
    <div className="text-center mb-14 sm:mb-20">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease }}
        className="flex items-center justify-center gap-3 mb-5"
      >
        <span className="h-px w-8 sm:w-14 bg-gradient-to-r from-transparent to-primary/60" />
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.4em] uppercase text-primary/80">
          CH.{chapter}
        </span>
        <span className="h-px w-8 sm:w-14 bg-gradient-to-l from-transparent to-primary/60" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease, delay: 0.08 }}
        className="font-display font-bold tracking-tight text-foreground text-fluid-section uppercase"
        style={{ textShadow: '0 0 40px hsl(var(--primary) / 0.18)' }}
      >
        {title}
      </motion.h2>

      {badge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-5 flex justify-center"
        >
          <span className="px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] bg-primary text-primary-foreground rounded-sm">
            {badge}
          </span>
        </motion.div>
      )}

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-5 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
