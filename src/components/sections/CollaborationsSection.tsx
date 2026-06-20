import { motion } from 'framer-motion';
import { Instagram, ExternalLink } from 'lucide-react';
import { FloatingPixels } from '@/components/ui/GameElements';
import ShootableSpaceships from '@/components/ui/ShootableSpaceships';
import SectionHeading from '@/components/ui/SectionHeading';

interface CollaborationItem {
  id: number;
  title: string;
  link: string;
}

interface CollaborationGroup {
  id: number;
  name: string;
  items: CollaborationItem[];
}

const collaborations: CollaborationGroup[] = [
  {
    id: 1,
    name: 'Instagram - Glazer / Funpunch Outreach / AceHack Hackathon Judge',
    items: [
      { id: 1, title: 'Glazer Games Reel 1', link: 'https://www.instagram.com/glazer.games/reel/Cw4-K2LtG-O/' },
      { id: 2, title: 'Glazer Games Reel 2', link: 'https://www.instagram.com/glazer.games/reel/CxLFe4QSr7g/' },
      { id: 3, title: 'Funpunch India Reel', link: 'https://www.instagram.com/funpunch_india/reel/DBKPov_hWC3/' },
      { id: 4, title: 'TeamXo Post', link: 'https://www.instagram.com/p/Cm16kKABqVD/' },
      { id: 5, title: 'AceHack Judge Reel', link: 'https://www.instagram.com/reel/DHmFXt8gQ55/' },
    ],
  },
];

const collaborationsSafeZones = [
  { top: 3, left: 20, width: 60, height: 12 },
  { top: 18, left: 5, width: 90, height: 75 },
];

export default function CollaborationsSection() {
  let itemIndex = 0;

  return (
    <section id="collaborations" className="py-20 sm:py-32 px-4 relative overflow-hidden">
      <FloatingPixels count={6} color="primary" />
      <ShootableSpaceships sectionId="collaborations" count={3} safeZones={collaborationsSafeZones} />
      
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeading
          chapter="04"
          title="Collaborations"
          badge="Collaboration Hub"
          subtitle="Social media & brand collaborations — selected outreach, partnerships, and community work."
        />

        {/* Collaboration Groups */}
        {collaborations.map((group, groupIndex) => (
          <div key={group.id} className="mb-12 last:mb-0">
            {/* Group Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: groupIndex * 0.1 }}
              className="mb-6 flex items-center gap-6"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <span className="text-sm text-foreground/70 font-mono uppercase tracking-[0.2em]">{group.name}</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </motion.div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {group.items.map((item) => {
                const currentIndex = itemIndex++;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: currentIndex * 0.05 }}
                  >
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-cinematic-glow p-4 sm:p-5 block group"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <Instagram className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors flex-shrink-0" />
                          <span className="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors truncate">
                            {item.title}
                          </span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
