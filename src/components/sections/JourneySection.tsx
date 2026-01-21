import { motion } from 'framer-motion';
import { Calendar, Trophy, Briefcase, GraduationCap, Rocket } from 'lucide-react';

const journeyItems = [
  {
    year: '2024',
    title: 'Esports',
    company: 'Your Current Studio',
    description: 'Leading development of multiple AAA-quality indie titles. Managing a team of developers and artists.',
    icon: Rocket,
    type: 'work',
  },
  {
    year: '2022',
    title: 'Shipped First Commercial Game',
    company: 'Major Achievement',
    description: 'Successfully launched my first commercial title with over 100K downloads.',
    icon: Trophy,
    type: 'achievement',
  },
  {
    year: '2021',
    title: 'Game Developer',
    company: 'Previous Studio',
    description: 'Worked on multiple game projects, specializing in gameplay systems and UI/UX.',
    icon: Briefcase,
    type: 'work',
  },
  {
    year: '2020',
    title: 'Started Indie Development',
    company: 'Personal Projects',
    description: 'Began creating my own indie games, learning the full game development pipeline.',
    icon: Rocket,
    type: 'milestone',
  },
  {
    year: '2019',
    title: 'Computer Science Degree',
    company: 'Your University',
    description: 'Graduated with a focus on computer graphics and game development.',
    icon: GraduationCap,
    type: 'education',
  },
];

export default function JourneySection() {
  return (
    <section id="journey" className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="text-gradient">Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The path that led me to where I am today
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent" />

          {journeyItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                <div className="w-4 h-4 rounded-full bg-primary glow-primary" />
              </div>

              {/* Content */}
              <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="glass rounded-2xl p-6 neon-border hover-glow cursor-default"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {item.year}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-primary text-sm mb-3">{item.company}</p>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
