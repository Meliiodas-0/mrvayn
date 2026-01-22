import { motion } from 'framer-motion';
import { Calendar, Trophy, Briefcase, Rocket, Flag, Star } from 'lucide-react';
import { FloatingPixels } from '@/components/ui/GameElements';
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

const journeySafeZones = [
  { top: 3, left: 25, width: 50, height: 10 },
  { top: 15, left: 10, width: 80, height: 80 },
];

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
    <section id="journey" className="py-20 sm:py-32 px-4 relative overflow-hidden">
      <FloatingPixels count={6} color="secondary" />
      <ShootableSpaceships sectionId="journey" count={5} safeZones={journeySafeZones} />
      
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Chapter Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20 section-chapter"
        >
          <span className="inline-block text-xs font-mono tracking-[0.4em] uppercase text-primary/60 mb-6">
            Chapter 02
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight">
            MY <span className="text-gradient">JOURNEY</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 sm:left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent md:-translate-x-1/2" />

          {groupedEntries.map(([groupKey, items], groupIndex) => {
            const isParallel = items.length > 1;
            
            return (
              <div key={groupKey} className="mb-10 sm:mb-14">
                {isParallel ? (
                  <div className="relative">
                    {/* Timeline dot */}
                    <div className="absolute left-4 sm:left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                      <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.6)]" />
                    </div>

                    {/* Parallel cards */}
                    <div className="ml-10 sm:ml-20 md:ml-0 grid md:grid-cols-2 gap-4 md:gap-8">
                      {items.map((item, itemIndex) => (
                        <motion.div
                          key={item.originalIndex}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: itemIndex * 0.1 }}
                          className={itemIndex === 0 ? 'md:pr-8' : 'md:pl-8'}
                        >
                          <div className="card-cinematic p-5 sm:p-6 relative group hover:border-primary/40 transition-all duration-300">
                            {/* Tags */}
                            <div className="flex items-center gap-2 mb-4">
                              <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-secondary bg-secondary/10 border border-secondary/30">
                                {item.tag}
                              </span>
                              <span className="px-2 py-0.5 text-[10px] font-mono text-primary bg-primary/10 border border-primary/30">
                                {item.xp}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{item.year}</span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-display font-bold mb-1">{item.title}</h3>
                            <p className="text-primary text-xs sm:text-sm mb-3">{item.company}</p>
                            <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
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
                          <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.6)]" />
                        </div>

                        {/* Content */}
                        <div className={`ml-10 sm:ml-20 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                          <div className="card-cinematic p-5 sm:p-6 relative group hover:border-primary/40 transition-all duration-300">
                            {/* XP Badge */}
                            <div className="absolute top-3 right-3">
                              <span className="px-2 py-0.5 text-[10px] font-mono text-primary bg-primary/10 border border-primary/30">
                                {item.xp}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{item.year}</span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-display font-bold mb-1">{item.title}</h3>
                            <p className="text-primary text-xs sm:text-sm mb-3">{item.company}</p>
                            <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                          </div>
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
            <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_hsl(var(--accent)/0.6)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
