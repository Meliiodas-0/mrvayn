import { motion } from 'framer-motion';
import { Linkedin, Mail, MessageCircle, Send, Wifi, Instagram, Youtube } from 'lucide-react';
import { FloatingPixels, CornerBrackets } from '@/components/ui/GameElements';
import ShootableSpaceships from '@/components/ui/ShootableSpaceships';

interface SocialLink {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string | null;
  displayText?: string;
  color: string;
  description: string;
}

const socialLinks: SocialLink[] = [
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://www.linkedin.com/in/aayush-vayn-91533921a/',
    color: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/50',
    description: 'Professional connections',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://www.instagram.com/builtbyvayn/',
    color: 'hover:text-[#E4405F] hover:border-[#E4405F]/50',
    description: 'Behind the scenes',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    url: 'https://www.youtube.com/@vaynverse',
    color: 'hover:text-[#FF0000] hover:border-[#FF0000]/50',
    description: 'Dev logs & trailers',
  },
  {
    name: 'Discord',
    icon: MessageCircle,
    url: null,
    displayText: 'loocvayn',
    color: 'hover:text-[#5865F2] hover:border-[#5865F2]/50',
    description: 'Discord handle',
  },
  {
    name: 'Email',
    icon: Mail,
    url: 'mailto:aayush007work@gmail.com',
    color: 'hover:text-primary hover:border-primary/50',
    description: 'Direct contact',
  },
];

// Safe zones for contact - social grid and CTA in center
const contactSafeZones = [
  { top: 3, left: 25, width: 50, height: 12 }, // Header
  { top: 18, left: 10, width: 80, height: 75 }, // Social cards and CTA
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 sm:py-24 px-4 relative overflow-hidden">
      <FloatingPixels count={8} color="primary" />
      <ShootableSpaceships sectionId="contact" count={4} safeZones={contactSafeZones} />
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm mb-4">
            <Wifi className="w-3 h-3 sm:w-4 sm:h-4" />
            Multiplayer Mode
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Let's <span className="text-gradient">Connect</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Ready to collaborate? Let's build something ambitious and scalable.
          </p>
        </motion.div>

        {/* Social Links Grid - Game menu style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {socialLinks.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {link.url ? (
                <a
                  href={link.url}
                  target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className={`glass rounded-xl p-4 sm:p-6 text-center border border-border transition-all duration-300 group relative overflow-hidden block h-full ${link.color}`}
                >
                  <CornerBrackets />
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <link.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-muted-foreground group-hover:scale-110 transition-all relative z-10" />
                  <h3 className="font-semibold text-sm sm:text-base mb-1 relative z-10">{link.name}</h3>
                  <p className="text-xs text-muted-foreground hidden sm:block relative z-10">{link.description}</p>
                  
                  {/* Connection status indicator */}
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                </a>
              ) : (
                <div
                  className={`glass rounded-xl p-4 sm:p-6 text-center border border-border transition-all duration-300 group relative overflow-hidden cursor-default h-full ${link.color}`}
                >
                  <CornerBrackets />
                  
                  <link.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-muted-foreground relative z-10" />
                  <h3 className="font-semibold text-sm sm:text-base mb-1 relative z-10">{link.name}</h3>
                  <p className="text-xs text-primary font-mono relative z-10">{link.displayText}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block relative z-10 mt-1">{link.description}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Call to action - Styled like a game invite */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <div className="glass rounded-2xl p-6 sm:p-8 neon-border max-w-2xl mx-auto relative overflow-hidden">
            <CornerBrackets />
            
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)',
              }} />
            </div>

            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                <Send className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                Interested in working together?
              </h3>
              <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
                I'm open to partnerships, investor conversations, and selective development work. If you're building something ambitious, let's connect and explore how we can collaborate.
              </p>
              
              <motion.a
                href="mailto:aayush007work@gmail.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover-glow glow-primary transition-all duration-300 text-sm sm:text-base"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                Send Message
              </motion.a>

              {/* Status indicator */}
              <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>Available for investor meetings and selective projects</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
