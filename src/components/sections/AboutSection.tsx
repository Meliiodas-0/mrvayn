import { motion } from 'framer-motion';
import { Code2, Gamepad2, Palette, Boxes, Trophy, Target, Zap, Shield } from 'lucide-react';
import { FloatingPixels, CornerBrackets, LevelIndicator, AchievementBadge } from '@/components/ui/GameElements';
import ShootableSpaceships from '@/components/ui/ShootableSpaceships';

const skills = [
  { name: 'Unity', level: 90, max: 100 },
  { name: 'Unreal Engine', level: 85, max: 100 },
  { name: 'C#', level: 88, max: 100 },
  { name: 'C++', level: 75, max: 100 },
  { name: 'Blender', level: 80, max: 100 },
  { name: 'React / Web', level: 85, max: 100 },
];

const expertise = [
  {
    icon: Gamepad2,
    title: 'Game Development',
    description: 'Creating immersive gameplay experiences with Unity and Unreal Engine',
  },
  {
    icon: Boxes,
    title: '3D Environments',
    description: 'Designing and building detailed 3D worlds and assets',
  },
  {
    icon: Code2,
    title: 'Technical Systems',
    description: 'Implementing complex game mechanics and AI systems',
  },
  {
    icon: Palette,
    title: 'Creative Coding',
    description: 'Blending art and technology for unique interactive experiences',
  },
];

const achievements = [
  { icon: Trophy, title: '100K Downloads', unlocked: true },
  { icon: Target, title: '5 Games Shipped', unlocked: true },
  { icon: Zap, title: 'Speed Coder', unlocked: true },
  { icon: Shield, title: 'Bug Slayer', unlocked: false },
];

// Safe zones: center content area (avoid text/cards)
const aboutSafeZones = [
  { top: 5, left: 15, width: 70, height: 10 }, // Header area
  { top: 18, left: 8, width: 84, height: 75 }, // Main content area
];

export default function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 px-4 relative overflow-hidden">
      <FloatingPixels count={8} color="primary" />
      <ShootableSpaceships sectionId="about" count={5} safeZones={aboutSafeZones} />
      
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm mb-4">
            <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4" />
            Player Profile
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Passionate game developer with a love for creating memorable digital experiences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass rounded-2xl p-6 sm:p-8 neon-border relative">
              <CornerBrackets />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl sm:text-3xl font-bold border-2 border-primary/50">
                  MV
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold">MrVayn</h3>
                  <p className="text-primary text-sm">Game Developer</p>
                  <LevelIndicator level={42} xp={7500} maxXp={10000} />
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">
                I'm a game developer with over X years of experience creating games across multiple platforms. 
                My journey started with modding games as a teenager, which sparked my passion for interactive entertainment.
              </p>
              
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Today, I specialize in creating immersive gameplay experiences, from indie projects to larger productions. 
                I believe in the power of games to tell stories, evoke emotions, and bring people together.
              </p>

              {/* Achievements */}
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-primary" />
                  Achievements Unlocked
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {achievements.map((achievement) => (
                    <AchievementBadge key={achievement.title} {...achievement} />
                  ))}
                </div>
              </div>
            </div>

            {/* Expertise Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6">
              {expertise.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="glass rounded-xl p-3 sm:p-4 hover-glow cursor-default group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2 group-hover:scale-110 transition-transform relative z-10" />
                  <h4 className="font-semibold text-sm sm:text-base mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skills Section - Gaming Style */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass rounded-2xl p-6 sm:p-8 neon-border relative"
          >
            <CornerBrackets />
            
            <div className="flex items-center gap-2 mb-6 sm:mb-8">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="text-xl sm:text-2xl font-bold">Skill Tree</h3>
            </div>
            
            <div className="space-y-5 sm:space-y-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-sm sm:text-base">{skill.name}</span>
                    <span className="text-primary font-mono text-xs sm:text-sm">LVL {Math.floor(skill.level / 10)}</span>
                  </div>
                  <div className="h-3 sm:h-4 bg-muted/50 rounded overflow-hidden border border-primary/20 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary via-primary to-secondary rounded relative overflow-hidden"
                    >
                      {/* Animated shine */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" 
                        style={{ animation: 'shimmer 2s infinite' }}
                      />
                    </motion.div>
                    {/* Notches */}
                    <div className="absolute inset-0 flex">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex-1 border-r border-background/30 last:border-r-0" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Inventory (Tools)</h4>
              <div className="flex flex-wrap gap-2">
                {['Git', 'Photoshop', 'After Effects', 'Substance Painter', 'FMOD', 'Wwise', 'Python', 'JavaScript'].map((tool) => (
                  <span
                    key={tool}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-muted/50 rounded border border-primary/20 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/10 transition-all cursor-default"
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