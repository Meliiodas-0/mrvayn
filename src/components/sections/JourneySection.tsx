import { motion } from 'framer-motion';
import { Calendar, Trophy, Briefcase, GraduationCap, Rocket, Flag, Star } from 'lucide-react';
import { FloatingPixels, CornerBrackets, SectionSpaceships } from '@/components/ui/GameElements';

const journeyItems = [
  {
    year: '2024',
    title: 'Esports',
    company: 'Your Current Studio',
    description: 'Leading development of multiple AAA-quality indie titles. Managing a team of developers and artists.',
    icon: Rocket,
    type: 'work',
    xp: '+5000 XP',
  },
  {
    year: '2022',
    title: 'Shipped First Commercial Game',
    company: 'Major Achievement',
    description: 'Successfully launched my first commercial title with over 100K downloads.',
    icon: Trophy,
    type: 'achievement',
    xp: '+3000 XP',
  },
  {
    year: '2021',
    title: 'Game Developer',
    company: 'Previous Studio',
    description: 'Worked on multiple game projects, specializing in gameplay systems and UI/UX.',
    icon: Briefcase,
    type: 'work',
    xp: '+2500 XP',
  },
  {
    year: '2020',
    title: 'Started Indie Development',
    company: 'Personal Projects',
    description: 'Began creating my own indie games, learning the full game development pipeline.',
    icon: Rocket,
    type: 'milestone',
    xp: '+1500 XP',
  },
  {
    year: '2019',
    title: 'Computer Science Degree',
    company: 'Your University',
    description: 'Graduated with a focus on computer graphics and game development.',
    icon: GraduationCap,
    type: 'education',
    xp: '+2000 XP',
  },
];

export default function JourneySection() {
  return (
    <section id="journey" className="py-16 sm:py-24 px-4 relative overflow-hidden">
      <FloatingPixels count={6} color="secondary" />
      <SectionSpaceships count={3} />
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
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
          <div className="absolute left-4 sm:left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent rounded-full">
            {/* Animated pulse */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-primary to-transparent rounded-full"
              animate={{ y: [0, 400, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {journeyItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex items-center mb-8 sm:mb-12 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot - checkpoint style */}
              <div className="absolute left-4 sm:left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                <motion.div 
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center"
                  whileHover={{ scale: 1.3 }}
                >
                  <Star className="w-2 h-2 sm:w-3 sm:h-3 text-primary" />
                </motion.div>
              </div>

              {/* Content */}
              <div className={`ml-10 sm:ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
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
          ))}

          {/* End marker */}
          <div className="absolute left-4 sm:left-8 md:left-1/2 -bottom-2 transform -translate-x-1/2">
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}