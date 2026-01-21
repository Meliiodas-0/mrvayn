import { motion } from 'framer-motion';
import { ExternalLink, Github, Play, Gamepad2 } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Epic Adventure RPG',
    description: 'A story-driven RPG with real-time combat, crafting systems, and a vast open world to explore.',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=60',
    tags: ['Unity', 'C#', 'RPG', 'Open World'],
    links: {
      play: '#',
      github: '#',
      details: '#',
    },
    featured: true,
  },
  {
    id: 2,
    title: 'Neon Racer',
    description: 'High-speed futuristic racing game with customizable vehicles and competitive multiplayer.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60',
    tags: ['Unreal Engine', 'C++', 'Racing', 'Multiplayer'],
    links: {
      play: '#',
      github: '#',
    },
    featured: false,
  },
  {
    id: 3,
    title: 'Puzzle Dimensions',
    description: 'Mind-bending puzzle game that plays with perspective and physics in impossible spaces.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60',
    tags: ['Unity', 'C#', 'Puzzle', '3D'],
    links: {
      play: '#',
      details: '#',
    },
    featured: false,
  },
  {
    id: 4,
    title: 'Survival Island',
    description: 'Survival crafting game set on a mysterious island filled with secrets and dangers.',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&auto=format&fit=crop&q=60',
    tags: ['Unreal Engine', 'Survival', 'Crafting'],
    links: {
      play: '#',
      github: '#',
    },
    featured: true,
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A showcase of games and interactive experiences I've created
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative ${project.featured ? 'md:col-span-2 md:grid md:grid-cols-2 md:gap-6' : ''}`}
            >
              <div className="glass rounded-2xl overflow-hidden neon-border hover-glow transition-all duration-300">
                {/* Image */}
                <div className={`relative overflow-hidden ${project.featured ? 'md:h-full' : 'h-48'}`}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60" />
                  
                  {/* Play button overlay */}
                  {project.links.play && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={project.links.play}
                        className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center hover:scale-110 transition-transform glow-primary"
                      >
                        <Play className="w-8 h-8 text-primary-foreground ml-1" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Gamepad2 className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold">{project.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs bg-muted rounded-full text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-4">
                    {project.links.play && (
                      <a
                        href={project.links.play}
                        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        Play Now
                      </a>
                    )}
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        Source
                      </a>
                    )}
                    {project.links.details && (
                      <a
                        href={project.links.details}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Details
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View More */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg glass neon-border font-semibold hover-glow transition-all duration-300 hover:scale-105"
          >
            View All Projects
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
