import { motion } from 'framer-motion';
import { Calendar, Trophy, Briefcase, Rocket, Flag, Star } from 'lucide-react';
import { FloatingPixels, CornerBrackets } from '@/components/ui/GameElements';
import ShootableSpaceships from '@/components/ui/ShootableSpaceships';

interface JourneyItem {
  year: string;
  title: string;
  company: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  type: string;
  xp: string;
  groupId?: string;
  tag?: string;
}

const journeyItems: JourneyItem[] = [
  {
    year: '2019-2020',
    title: 'Esports Leadership',
    company: 'TeamIND, Godlike, 7seas, TeamXO, Entity',
    description: 'Leadership and management experience plus deep understanding of audience, community, and player retention.',
    icon: Trophy,
    type: 'milestone',
    xp: '+2000 XP',
  },
  {
    year: '2023',
    title: 'Environmental Designer',
    company: 'Hidden Beyond (Yellow Whale Labs Pvt Ltd) (Jan 2023 - Feb 2023)',
    description: 'Designed immersive environments in UE5 under tight deadlines during college, focused on quality and clean delivery.',
    icon: Briefcase,
    type: 'work',
    xp: '+2000 XP',
  },
  {
    year: '2023',
    title: 'Unreal Engine Developer',
    company: 'Norian Games (May 2023 - Jun 2023)',
    description: 'Optimized environments and developed water systems in UE5. Collaborated remotely to deliver production-ready visuals.',
    icon: Briefcase,
    type: 'work',
    xp: '+2000 XP',
  },
  {
    year: '2023-2024',
    title: 'Software Developer',
    company: 'Glazer Games India Pvt. Ltd. (Jun 2023 - Nov 2024)',
    description: 'Web development plus UE5 CGI/VFX for teasers and trailers. Managed content, GFX, and VFX delivery.',
    icon: Briefcase,
    type: 'work',
    xp: '+3000 XP',
  },
  {
    year: '2024',
    title: 'Co-Founder | CTO',
    company: 'Magadha Studios (Dec 2024 - Present)',
    description: 'Leading core tech and production pipeline - reusable, data-driven gameplay framework for rapid iteration and scalability. Showcased Antarya at IGDC, demo coming soon.',
    icon: Briefcase,
    type: 'work',
    xp: '+5000 XP',
    groupId: 'parallel_build',
    tag: 'Parallel',
  },
  {
    year: '2025',
    title: 'Roblox Launch - Couragely',
    company: 'Parallel Build',
    description: 'Built in 7 days. Within 2 weeks: 12.2K visits, 601 favorites, 638,391 impressions, 9,432 plays.',
    icon: Rocket,
    type: 'work',
    xp: '+3500 XP',
    groupId: 'parallel_build',
    tag: 'Parallel',
  },
];

// Safe zones for journey section - timeline in center, cards on sides
const journeySafeZones = [
  { top: 3, left: 25, width: 50, height: 10 }, // Header
  { top: 15, left: 10, width: 80, height: 80 }, // Timeline and cards
];

// Group items by groupId for parallel display
const groupedItems = journeyItems.reduce((acc, item, index) => {
  if (item.groupId) {
    if (!acc[item.groupId]) {
      acc[item.groupId] = [];
    }
    acc[item.groupId].push({ ...item, originalIndex: index });
  } else {
    acc[`single_${index}`] = [{ ...item, originalIndex: index }];
  }
  return acc;
}, {} as Record<string, (JourneyItem & { originalIndex: number })[]>);

const groupedEntries = Object.entries(groupedItems);

export default function JourneySection() {
  return (
    <section id="journey" className="py-16 sm:py-24 px-4 relative overflow-hidden">
      <FloatingPixels count={6} color="secondary" />
      <ShootableSpaceships sectionId="journey" count={5} safeZones={journeySafeZones} />
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs sm:text-sm mb-4">
            <Flag className="w-3 h-3 sm:w-4 sm:h-4" />
            Quest Log
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            My <span className="text-gradient">Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            The path that led me to where I am today — each milestone a completed quest
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line - styled like a progress path */}
          <div className="absolute left-4 sm:left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent rounded-full md:-translate-x-1/2">
            {/* Animated pulse */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-primary to-transparent rounded-full"
              animate={{ y: [0, 400, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {groupedEntries.map(([groupKey, items], groupIndex) => {
            const isParallel = items.length > 1;
            
            return (
              <div key={groupKey} className="mb-8 sm:mb-12">
                {isParallel ? (
                  // Parallel items - side by side on desktop
                  <div className="relative">
                    {/* Timeline dot for parallel group */}
                    <div className="absolute left-4 sm:left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                      <motion.div 
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center"
                        whileHover={{ scale: 1.3 }}
                      >
                        <Star className="w-2 h-2 sm:w-3 sm:h-3 text-primary" />
                      </motion.div>
                    </div>

                    {/* Parallel cards grid */}
                    <div className="ml-10 sm:ml-20 md:ml-0 grid md:grid-cols-2 gap-4 md:gap-8">
                      {items.map((item, itemIndex) => (
                        <motion.div
                          key={item.originalIndex}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: itemIndex * 0.1 }}
                          className={itemIndex === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 neon-border hover-glow cursor-default relative overflow-hidden group"
                          >
                            <CornerBrackets />
                            
                            {/* Parallel Tag */}
                            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 rounded bg-secondary/20 text-secondary text-[10px] sm:text-xs font-mono">
                              {item.tag}
                            </div>
                            
                            {/* XP Badge */}
                            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] sm:text-xs font-mono">
                              {item.xp}
                            </div>

                            <div className={`flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 mt-6 ${itemIndex === 0 ? 'md:justify-end' : ''}`}>
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:border-primary/50 transition-colors">
                                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                {item.year}
                              </div>
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold mb-1">{item.title}</h3>
                            <p className="text-primary text-xs sm:text-sm mb-2 sm:mb-3">{item.company}</p>
                            <p className="text-muted-foreground text-xs sm:text-sm">{item.description}</p>

                            {/* Quest complete indicator */}
                            <div className={`mt-3 pt-3 border-t border-border/50 flex items-center gap-2 ${itemIndex === 0 ? 'md:justify-end' : ''}`}>
                              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                              <span className="text-[10px] sm:text-xs text-accent font-medium">QUEST COMPLETE</span>
                            </div>
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Single item - alternating layout
                  items.map((item) => {
                    const isEven = groupIndex % 2 === 0;
                    return (
                      <motion.div
                        key={item.originalIndex}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
                        className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                      >
                        {/* Timeline dot */}
                        <div className="absolute left-4 sm:left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                          <motion.div 
                            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center"
                            whileHover={{ scale: 1.3 }}
                          >
                            <Star className="w-2 h-2 sm:w-3 sm:h-3 text-primary" />
                          </motion.div>
                        </div>

                        {/* Content */}
                        <div className={`ml-10 sm:ml-20 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 neon-border hover-glow cursor-default relative overflow-hidden group"
                          >
                            <CornerBrackets />
                            
                            {/* XP Badge */}
                            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] sm:text-xs font-mono">
                              {item.xp}
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:border-primary/50 transition-colors">
                                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                {item.year}
                              </div>
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold mb-1">{item.title}</h3>
                            <p className="text-primary text-xs sm:text-sm mb-2 sm:mb-3">{item.company}</p>
                            <p className="text-muted-foreground text-xs sm:text-sm">{item.description}</p>

                            {/* Quest complete indicator */}
                            <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                              <span className="text-[10px] sm:text-xs text-accent font-medium">QUEST COMPLETE</span>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            );
          })}

          {/* End marker */}
          <div className="absolute left-4 sm:left-8 md:left-1/2 -bottom-2 transform -translate-x-1/2">
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
