import { motion } from 'framer-motion';
import { Linkedin, Mail, MessageCircle, Send, Instagram, Youtube, ArrowUpRight } from 'lucide-react';
import { FloatingPixels } from '@/components/ui/GameElements';
import ShootableSpaceships from '@/components/ui/ShootableSpaceships';

interface SocialLink {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string | null;
  displayText?: string;
  description: string;
}

const socialLinks: SocialLink[] = [
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://www.linkedin.com/in/aayush-vayn-91533921a/',
    description: 'Professional connections',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://www.instagram.com/builtbyvayn/',
    description: 'Behind the scenes',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    url: 'https://www.youtube.com/@vaynverse',
    description: 'Dev logs & trailers',
  },
  {
    name: 'Discord',
    icon: MessageCircle,
    url: null,
    displayText: 'loocvayn',
    description: 'Discord handle',
  },
  {
    name: 'Email',
    icon: Mail,
    url: 'mailto:aayush007work@gmail.com',
    description: 'Direct contact',
  },
];

const contactSafeZones = [
  { top: 3, left: 25, width: 50, height: 12 },
  { top: 18, left: 10, width: 80, height: 75 },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 sm:py-32 px-4 relative overflow-hidden">
      <FloatingPixels count={6} color="primary" />
      <ShootableSpaceships sectionId="contact" count={4} safeZones={contactSafeZones} />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Chapter Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20 section-chapter"
        >
          <span className="inline-block text-xs font-mono tracking-[0.4em] uppercase text-primary/60 mb-6">
            Chapter 04
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight">
            LET'S <span className="text-gradient">CONNECT</span>
          </h2>
        </motion.div>

        {/* Social Links - Clean Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-16">
          {socialLinks.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              {link.url ? (
                <a
                  href={link.url}
                  target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="card-cinematic p-5 sm:p-6 text-center block group hover:border-primary/40 transition-all duration-300 h-full"
                >
                  <link.icon className="w-7 h-7 mx-auto mb-3 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all" />
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{link.name}</h3>
                  <p className="text-xs text-muted-foreground hidden sm:block">{link.description}</p>
                </a>
              ) : (
                <div className="card-cinematic p-5 sm:p-6 text-center cursor-default h-full">
                  <link.icon className="w-7 h-7 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="font-semibold text-sm mb-1">{link.name}</h3>
                  <p className="text-xs text-primary font-mono">{link.displayText}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="card-cinematic-featured p-8 sm:p-10 text-center max-w-2xl mx-auto"
        >
          <div className="w-14 h-14 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            <Send className="w-7 h-7 text-primary" />
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-display font-bold mb-4 tracking-tight">
            Interested in working together?
          </h3>
          <p className="text-muted-foreground mb-8 text-sm sm:text-base max-w-lg mx-auto">
            I'm open to partnerships, investor conversations, and selective development work. If you're building something ambitious, let's connect.
          </p>
          
          <motion.a
            href="mailto:aayush007work@gmail.com"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-semibold uppercase tracking-wider text-sm transition-all duration-300 hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)]"
          >
            <Mail className="w-5 h-5" />
            Send Message
            <ArrowUpRight className="w-4 h-4" />
          </motion.a>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Available for investor meetings and selective projects</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
