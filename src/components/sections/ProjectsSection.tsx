import { motion } from 'framer-motion';
import { ExternalLink, Gamepad2, Trophy, Lock, ArrowUpRight, Mountain, Film, Globe, Bot, Code, Wrench } from 'lucide-react';
import { FloatingPixels } from '@/components/ui/GameElements';
import ShootableSpaceships from '@/components/ui/ShootableSpaceships';
import SectionHeading from '@/components/ui/SectionHeading';

interface ExpandedProject {
  id: number;
  title: string;
  subtext: string;
  highlights: string[];
  link: string;
  expanded: true;
  badge?: string;
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
  {
    id: 1,
    title: 'Antarya',
    subtext: 'Co-Founder & CTO at Magadha Studios',
    highlights: ['Showcased at IGDC 2025', 'Built on scalable gameplay frameworks', 'Demo in progress'],
    link: 'https://magadhastudios.com/category',
    expanded: true,
    badge: 'IGDC 2025',
  },
  {
    id: 2,
    title: 'Couragely',
    subtext: 'Roblox Horror - Built in 7 days',
    highlights: ['12.2K visits, 601 favorites (first 2 weeks)', '638,391 impressions, 9,432 plays'],
    link: 'https://www.roblox.com/games/137847988705947/Couragely',
    expanded: true,
    badge: 'LIVE',
  },
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

// Determine icon based on project title keywords
function getProjectIcon(title: string) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('game') || lowerTitle.includes('horror') || lowerTitle.includes('minecraft') || lowerTitle.includes('rpg') || lowerTitle.includes('shooting')) {
    return Gamepad2;
  }
  if (lowerTitle.includes('environment') || lowerTitle.includes('design')) {
    return Mountain;
  }
  if (lowerTitle.includes('cgi') || lowerTitle.includes('animated') || lowerTitle.includes('teaser')) {
    return Film;
  }
  if (lowerTitle.includes('website') || lowerTitle.includes('web') || lowerTitle.includes('bharatverse')) {
    return Globe;
  }
  if (lowerTitle.includes('ai') || lowerTitle.includes('therapist')) {
    return Bot;
  }
  if (lowerTitle.includes('hackathon') || lowerTitle.includes('techademy')) {
    return Code;
  }
  if (lowerTitle.includes('multiplayer')) {
    return Wrench;
  }
  return Gamepad2;
}

const projectsSafeZones = [
  { top: 3, left: 20, width: 60, height: 10 },
  { top: 15, left: 5, width: 90, height: 78 },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-20 sm:py-32 px-4 relative overflow-hidden">
      <FloatingPixels count={8} color="accent" />
      <ShootableSpaceships sectionId="projects" count={5} safeZones={projectsSafeZones} />
      
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeading chapter="03" title="Featured Projects" />

        {/* Featured Projects - Poster Style */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {expandedProjects.map((project, index) => (
            <motion.a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group block"
            >
              <div className="card-cinematic-featured p-6 sm:p-8 h-full relative overflow-hidden transition-all duration-500">
                {/* Badge row */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-primary text-primary-foreground">
                    Featured
                  </div>
                  {project.badge && (
                    <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-accent border border-accent/40">
                      {project.badge}
                    </div>
                  )}
                </div>

                {/* Title - Large */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-2xl sm:text-3xl font-display font-bold tracking-tight group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <motion.div
                    animate={{ x: [0, 3, 0], y: [0, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowUpRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </motion.div>
                </div>
                
                <p className="text-primary/80 text-sm font-medium mb-6">{project.subtext}</p>
                
                {/* Highlights */}
                <ul className="space-y-3">
                  {project.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                      <Trophy className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                {/* Hover line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Divider - More visible */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-10 flex items-center gap-6"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <span className="text-sm text-foreground/70 font-mono uppercase tracking-[0.3em]">More Projects</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </motion.div>

        {/* Minimal Projects Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {minimalProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              {project.locked ? (
                <div className="card-cinematic p-4 sm:p-5 opacity-50 cursor-not-allowed relative overflow-hidden border-muted/30">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-medium text-muted-foreground truncate">{project.title}</span>
                  </div>
                  <div className="scanlines absolute inset-0 pointer-events-none" />
                </div>
              ) : (
                <a
                  href={project.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-cinematic-glow p-4 sm:p-5 block group"
                >
                  {(() => {
                    const Icon = getProjectIcon(project.title);
                    return (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors flex-shrink-0" />
                          <span className="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors truncate">
                            {project.title}
                          </span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    );
                  })()}
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
