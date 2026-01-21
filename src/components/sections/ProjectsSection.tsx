import { motion } from 'framer-motion';
import { ExternalLink, Gamepad2, Lock } from 'lucide-react';
import { FloatingPixels, CornerBrackets } from '@/components/ui/GameElements';
import ShootableSpaceships from '@/components/ui/ShootableSpaceships';

interface ExpandedProject {
  id: number;
  title: string;
  subtext: string;
  highlights: string[];
  link: string;
  expanded: true;
}

interface MinimalProject {
  id: number;
  title: string;
  link: string | null;
  locked?: boolean;
  expanded?: false;
}

type Project = ExpandedProject | MinimalProject;

const projects: Project[] = [
  // EXPANDED CARDS (with highlights)
  {
    id: 1,
    title: 'Antarya',
    subtext: 'Magadha Studios - Demo in progress',
    highlights: ['Showcased at IGDC', 'Built on scalable gameplay frameworks'],
    link: '#', // Placeholder - ADD_ANTARYA_LINK
    expanded: true,
  },
  {
    id: 2,
    title: 'Couragely',
    subtext: 'Roblox Horror - Built in 7 days',
    highlights: ['12.2K visits, 601 favorites (first 2 weeks)', '638,391 impressions, 9,432 plays'],
    link: 'https://www.roblox.com/games/137847988705947/Couragely',
    expanded: true,
  },
  // MINIMAL CARDS (title-only, clickable)
  { id: 3, title: 'Unreal Horror Game', link: 'https://drive.google.com/file/d/1X1QuGVAsIcP6mcX-Q5LFw_Sr0XxBt8Xb/view?usp=sharing' },
  { id: 4, title: 'Multiplayer Project (Private - To Be Announced)', link: null, locked: true },
  { id: 5, title: 'Sasta Minecraft', link: 'https://drive.google.com/file/d/1BkugwIClcTx4aLtK-34aaelw40YbYxDk/view?usp=drive_link' },
  { id: 6, title: 'Environment Design 2.0', link: 'https://drive.google.com/file/d/1hwlbVTwMOzlgakO_T6ooHetDxh7mE4JC/view?usp=drive_link' },
  { id: 7, title: 'Environment Design', link: 'https://drive.google.com/file/d/1Io3zeGNmbGLYUTxSnldVEFKCwFcjmO5p/view?usp=drive_link' },
  { id: 8, title: 'Techademy (Hackathon)', link: 'https://drive.google.com/file/d/1acw_QwxZmLBwmQIKrSJf6_nW2ozH77vk/view?usp=sharing' },
  { id: 9, title: 'First Target Shooting Game', link: 'https://drive.google.com/file/d/1de3noEKBFLNmfWG58Uw-CHItLTLSuL4S/view?usp=drive_link' },
  { id: 10, title: 'CGI Based Animated Teaser', link: 'https://drive.google.com/drive/folders/1D7sYdJ2a0RIfLjLvWnXD1F4m0ldMqFJW?usp=drive_link' },
  { id: 11, title: 'RPG Game Prototype', link: 'https://drive.google.com/drive/folders/1WuzkMKut5wKKHKTDJ9IC5vR8q_y1sL5z' },
  { id: 12, title: 'Glazer Games Website', link: 'https://www.glazer.games' },
  { id: 13, title: 'Bharatverse', link: 'https://drive.google.com/file/d/11bqGKg3IUZTWWNw6ofC_pv7yLPN8nxPu/view' },
  { id: 14, title: 'Virtual AI Therapist', link: 'https://drive.google.com/file/d/1WV2xYvS9aCd0mrpUbshdrsm8rcOFGNf8/view?usp=drive_link' },
];

const expandedProjects = projects.filter((p): p is ExpandedProject => p.expanded === true);
const minimalProjects = projects.filter((p): p is MinimalProject => !p.expanded);

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
            A showcase of games and interactive experiences I've built and shipped
          </p>
        </motion.div>

        {/* Expanded Projects Grid */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8">
          {expandedProjects.map((project, index) => (
            <motion.a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="glass rounded-2xl p-6 sm:p-8 neon-border hover-glow transition-all duration-300 relative h-full">
                <CornerBrackets />
                
                {/* Featured badge */}
                <div className="absolute top-3 left-3 z-20 px-2 py-1 rounded bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  Featured
                </div>

                <div className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    <h3 className="text-xl sm:text-2xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                  </div>
                  
                  <p className="text-primary text-sm mb-4">{project.subtext}</p>
                  
                  {/* Highlights */}
                  <ul className="space-y-2 mb-4">
                    {project.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-2 text-sm text-primary group-hover:gap-3 transition-all">
                    <ExternalLink className="w-4 h-4" />
                    <span>View Project</span>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Minimal Projects Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {minimalProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
            >
              {project.locked ? (
                <div className="glass rounded-xl p-4 sm:p-5 border border-border/50 opacity-60 cursor-not-allowed h-full flex items-center justify-center text-center">
                  <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 flex-wrap justify-center">
                    {project.title}
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  </span>
                </div>
              ) : (
                <a
                  href={project.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-xl p-4 sm:p-5 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group h-full flex items-center justify-center text-center"
                >
                  <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {project.title}
                  </span>
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
