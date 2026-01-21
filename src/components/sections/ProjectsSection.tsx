import { motion } from 'framer-motion';
import { ExternalLink, Github, Play, Gamepad2, Star, Users, Download } from 'lucide-react';
import { FloatingPixels, CornerBrackets } from '@/components/ui/GameElements';
import ShootableSpaceships from '@/components/ui/ShootableSpaceships';

const projects = [
  {
    id: 1,
    title: 'Epic Adventure RPG',
    description: 'A story-driven RPG with real-time combat, crafting systems, and a vast open world to explore.',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=60',
    tags: ['Unity', 'C#', 'RPG', 'Open World'],
    stats: { rating: 4.8, players: '50K+', downloads: '100K+' },
    links: { play: '#', github: '#', details: '#' },
    featured: true,
  },
  {
    id: 2,
    title: 'Neon Racer',
    description: 'High-speed futuristic racing game with customizable vehicles and competitive multiplayer.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60',
    tags: ['Unreal Engine', 'C++', 'Racing', 'Multiplayer'],
    stats: { rating: 4.5, players: '25K+', downloads: '75K+' },
    links: { play: '#', github: '#' },
    featured: false,
  },
  {
    id: 3,
    title: 'Puzzle Dimensions',
    description: 'Mind-bending puzzle game that plays with perspective and physics in impossible spaces.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60',
    tags: ['Unity', 'C#', 'Puzzle', '3D'],
    stats: { rating: 4.7, players: '30K+', downloads: '80K+' },
    links: { play: '#', details: '#' },
    featured: false,
  },
  {
    id: 4,
    title: 'Survival Island',
    description: 'Survival crafting game set on a mysterious island filled with secrets and dangers.',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&auto=format&fit=crop&q=60',
    tags: ['Unreal Engine', 'Survival', 'Crafting'],
    stats: { rating: 4.6, players: '40K+', downloads: '90K+' },
    links: { play: '#', github: '#' },
    featured: true,
  },
];

// Safe zones for projects - cards take most of center
const projectsSafeZones = [
  { top: 3, left: 20, width: 60, height: 10 }, // Header
  { top: 15, left: 5, width: 90, height: 78 }, // Project cards grid
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-16 sm:py-24 px-4 relative overflow-hidden">
      <FloatingPixels count={10} color="accent" />
      <ShootableSpaceships sectionId="projects" count={5} safeZones={projectsSafeZones} />
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs sm:text-sm mb-4">
            <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4" />
            Game Library
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            A showcase of games and interactive experiences I've created
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative ${project.featured ? 'sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-0' : ''}`}
            >
              <div className="glass rounded-2xl overflow-hidden neon-border hover-glow transition-all duration-300 relative">
                <CornerBrackets />
                
                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-3 left-3 z-20 px-2 py-1 rounded bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    Featured
                  </div>
                )}

                {/* Image */}
                <div className={`relative overflow-hidden ${project.featured ? 'sm:h-full' : 'h-40 sm:h-48'}`}>
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
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/90 flex items-center justify-center hover:scale-110 transition-transform glow-primary"
                      >
                        <Play className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground ml-1" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <h3 className="text-lg sm:text-xl font-bold">{project.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-3 sm:mb-4 line-clamp-2 text-xs sm:text-sm">{project.description}</p>

                  {/* Stats - Gaming style */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-[10px] sm:text-xs">
                    <div className="flex items-center gap-1 text-secondary">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{project.stats.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{project.stats.players}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Download className="w-3 h-3" />
                      <span>{project.stats.downloads}</span>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] sm:text-xs bg-muted/50 rounded border border-primary/20 text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    {project.links.play && (
                      <a
                        href={project.links.play}
                        className="flex items-center gap-1.5 text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                      >
                        <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                        Play Now
                      </a>
                    )}
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="w-3 h-3 sm:w-4 sm:h-4" />
                        Source
                      </a>
                    )}
                    {project.links.details && (
                      <a
                        href={project.links.details}
                        className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
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
          className="text-center mt-8 sm:mt-12"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg glass neon-border font-semibold hover-glow transition-all duration-300 hover:scale-105 text-sm sm:text-base"
          >
            View All Projects
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}