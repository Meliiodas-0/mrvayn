import { motion } from 'framer-motion';
import { Code2, Gamepad2, Palette, Boxes } from 'lucide-react';

const skills = [
  { name: 'Unity', level: 90, color: 'bg-primary' },
  { name: 'Unreal Engine', level: 85, color: 'bg-secondary' },
  { name: 'C#', level: 88, color: 'bg-primary' },
  { name: 'C++', level: 75, color: 'bg-accent' },
  { name: 'Blender', level: 80, color: 'bg-secondary' },
  { name: 'React / Web', level: 85, color: 'bg-primary' },
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

export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Passionate game developer with a love for creating memorable digital experiences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass rounded-2xl p-8 neon-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold">
                  YN
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Your Name</h3>
                  <p className="text-primary">Game Developer</p>
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed mb-6">
                I'm a game developer with over X years of experience creating games across multiple platforms. 
                My journey started with modding games as a teenager, which sparked my passion for interactive entertainment.
              </p>
              
              <p className="text-muted-foreground leading-relaxed">
                Today, I specialize in creating immersive gameplay experiences, from indie projects to larger productions. 
                I believe in the power of games to tell stories, evoke emotions, and bring people together.
              </p>
            </div>

            {/* Expertise Cards */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {expertise.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="glass rounded-xl p-4 hover-glow cursor-default group"
                >
                  <item.icon className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
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
            className="glass rounded-2xl p-8 neon-border"
          >
            <h3 className="text-2xl font-bold mb-8">Skills & Technologies</h3>
            
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
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className={`h-full ${skill.color} rounded-full`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="font-semibold mb-4">Also experienced with:</h4>
              <div className="flex flex-wrap gap-2">
                {['Git', 'Photoshop', 'After Effects', 'Substance Painter', 'FMOD', 'Wwise', 'Python', 'JavaScript'].map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 text-sm bg-muted rounded-full text-muted-foreground hover:text-foreground hover:bg-primary/20 transition-colors cursor-default"
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
