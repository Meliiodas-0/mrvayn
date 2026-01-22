import { motion } from 'framer-motion';
import { ExternalLink, Lock, Gamepad2, Video, Globe, Mountain, Bot, Code, Film, Wrench } from 'lucide-react';
import { CornerBrackets } from '@/components/ui/GameElements';

interface ProjectCardProps {
  title: string;
  link: string | null;
  locked?: boolean;
  index: number;
}

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
  if (lowerTitle.includes('website') || lowerTitle.includes('web')) {
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

// Get accent color based on project type
function getProjectColor(title: string): string {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('horror') || lowerTitle.includes('unreal')) {
    return 'secondary'; // Purple
  }
  if (lowerTitle.includes('environment') || lowerTitle.includes('cgi') || lowerTitle.includes('animated')) {
    return 'accent'; // Pink
  }
  if (lowerTitle.includes('website') || lowerTitle.includes('web')) {
    return 'primary'; // Cyan
  }
  return 'primary'; // Default cyan
}

export default function ProjectCard({ title, link, locked, index }: ProjectCardProps) {
  const Icon = getProjectIcon(title);
  const colorClass = getProjectColor(title);
  
  if (locked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
        className="group"
      >
        <div className="glass rounded-xl p-5 sm:p-6 border border-primary/20 opacity-50 cursor-not-allowed h-full relative overflow-hidden">
          {/* Scanline effect for locked */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)',
              }}
            />
          </div>
          
          <div className="flex items-start gap-3 relative z-10">
            <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0 border border-border">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-muted-foreground line-clamp-2 leading-tight">
                {title}
              </h4>
              <p className="text-xs text-muted-foreground/60 mt-1 font-mono">CLASSIFIED</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
      className="group"
    >
      <a
        href={link || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className={`glass rounded-xl p-5 sm:p-6 neon-border hover-glow transition-all duration-300 h-full flex flex-col relative overflow-hidden block`}
      >
        <CornerBrackets className="opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Gradient hover overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br from-${colorClass}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        
        {/* Content */}
        <div className="flex items-start gap-3 relative z-10">
          <div className={`w-10 h-10 rounded-lg bg-${colorClass}/10 flex items-center justify-center flex-shrink-0 border border-${colorClass}/30 group-hover:border-${colorClass}/60 group-hover:bg-${colorClass}/20 transition-all duration-300`}>
            <Icon className={`w-5 h-5 text-${colorClass} group-hover:scale-110 transition-transform`} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
              {title}
            </h4>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground group-hover:text-primary/80 transition-colors">
              <ExternalLink className="w-3 h-3" />
              <span>View</span>
            </div>
          </div>
        </div>
        
        {/* Animated corner accent */}
        <div className={`absolute bottom-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity`}>
          <div className={`absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-${colorClass} to-transparent`} />
          <div className={`absolute bottom-0 right-0 h-full w-px bg-gradient-to-t from-${colorClass} to-transparent`} />
        </div>
      </a>
    </motion.div>
  );
}
