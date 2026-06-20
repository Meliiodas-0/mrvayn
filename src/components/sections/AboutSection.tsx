import { motion } from 'framer-motion';
import { Code2, Gamepad2, Palette, Boxes, Zap } from 'lucide-react';
import { FloatingPixels } from '@/components/ui/GameElements';
import ShootableSpaceships from '@/components/ui/ShootableSpaceships';
import SectionHeading from '@/components/ui/SectionHeading';

const skills = [
  { name: 'Unreal Engine 5', level: 9, max: 10 },
  { name: 'Gameplay Frameworks', level: 9, max: 10 },
  { name: 'Niagara VFX + CGI', level: 8, max: 10 },
  { name: 'Sequencer + Cutscenes', level: 9, max: 10 },
  { name: 'Multiplayer + Server Architecture', level: 8, max: 10 },
  { name: 'C++', level: 8, max: 10 },
];

const expertise = [
  {
    icon: Gamepad2,
    title: 'Gameplay Frameworks',
    description: 'Reusable, data-driven systems built for rapid iteration and scalability.',
  },
  {
    icon: Boxes,
    title: 'VFX + CGI (Niagara)',
    description: 'Real-time VFX and cinematic visuals for premium game presentation.',
  },
  {
    icon: Code2,
    title: 'Multiplayer + Server Architecture',
    description: 'Cost-optimized PvP and PvE server design built to scale.',
  },
  {
    icon: Palette,
    title: 'Cutscenes + Sequencer',
    description: 'Cinematic storytelling and polished in-game cutscene pipelines.',
  },
];

const aboutSafeZones = [
  { top: 5, left: 15, width: 70, height: 10 },
  { top: 18, left: 8, width: 84, height: 75 },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-32 px-4 relative overflow-hidden">
      <FloatingPixels count={6} color="primary" />
      <ShootableSpaceships sectionId="about" count={5} safeZones={aboutSafeZones} />
      
      <div className="max-w-6xl mx-auto relative">
        <SectionHeading chapter="01" title="About Me" />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="card-cinematic-featured p-6 sm:p-8 relative">
              {/* Profile Header */}
              <div className="flex items-center gap-5 mb-8 pb-6 border-b border-border/50">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-sm bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl sm:text-4xl font-display font-black border-2 border-primary/30">
                  MV
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">MrVayn</h3>
                  <p className="text-primary text-sm font-mono tracking-wide">GAME DEVELOPER</p>
                </div>
              </div>
              
              <div className="space-y-4 leading-relaxed text-sm sm:text-base">
                <p className="text-foreground/80">
                  I'm MrVayn - a founder and creative technologist building next-gen game experiences since 2019. I blend scalable game tech with player psychology and market-focused design, aiming to create products that feel premium, retain players, and grow into breakout communities.
                </p>
                <p className="text-muted-foreground">
                  My work spans Unreal Engine gameplay frameworks, VFX, cutscenes, and multiplayer-ready systems - with a strong focus on performance, clarity, and shipping.
                </p>
                <p className="text-muted-foreground">
                  My foundation comes from competitive esports and leadership in top orgs (2019-2020), which sharpened my understanding of audience, community, and what makes players stay. This experience sparked my transition into game development, where I could build the experiences I once competed in.
                </p>
              </div>
            </div>

            {/* Expertise Cards - Cleaner Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6">
              {expertise.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="card-cinematic p-4 sm:p-5 group hover:border-primary/40 transition-all duration-300"
                >
                  <item.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-sm sm:text-base mb-1 text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card-cinematic p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/50">
              <Zap className="w-6 h-6 text-primary" />
              <h3 className="text-xl sm:text-2xl font-display font-bold tracking-tight">SKILL TREE</h3>
            </div>
            
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-sm sm:text-base text-foreground">{skill.name}</span>
                    <span className="text-primary font-mono text-sm font-semibold">LVL {skill.level}</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(skill.level / skill.max) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-border/50">
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Tools</h4>
              <div className="flex flex-wrap gap-2">
                {['Premiere Pro', 'FL Studio', 'Blender', 'JavaScript', 'Photoshop', 'Git'].map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1.5 text-xs font-medium bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all cursor-default border border-transparent hover:border-primary/30"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
