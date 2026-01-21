import { motion } from 'framer-motion';
import { Twitter, Linkedin, Github, Mail, MessageCircle, ExternalLink } from 'lucide-react';

const socialLinks = [
  {
    name: 'Twitter / X',
    icon: Twitter,
    url: 'https://twitter.com/yourusername',
    color: 'hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50',
    description: 'Follow for game dev updates',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://linkedin.com/in/yourusername',
    color: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/50',
    description: 'Professional connections',
  },
  {
    name: 'GitHub',
    icon: Github,
    url: 'https://github.com/yourusername',
    color: 'hover:text-[#f0f0f0] hover:border-[#f0f0f0]/50',
    description: 'Open source projects',
  },
  {
    name: 'Discord',
    icon: MessageCircle,
    url: 'https://discord.gg/yourcommunity',
    color: 'hover:text-[#5865F2] hover:border-[#5865F2]/50',
    description: 'Join my community',
  },
  {
    name: 'itch.io',
    icon: ExternalLink,
    url: 'https://yourusername.itch.io',
    color: 'hover:text-[#FA5C5C] hover:border-[#FA5C5C]/50',
    description: 'Play my games',
  },
  {
    name: 'Email',
    icon: Mail,
    url: 'mailto:your@email.com',
    color: 'hover:text-primary hover:border-primary/50',
    description: 'Direct contact',
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 sm:py-24 px-4 relative">
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Let's <span className="text-gradient">Connect</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Find me on your favorite platform or reach out directly
          </p>
        </motion.div>

        {/* Social Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`glass rounded-xl p-4 sm:p-6 text-center border border-border transition-all duration-300 group ${link.color}`}
            >
              <link.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-muted-foreground group-hover:scale-110 transition-all" />
              <h3 className="font-semibold text-sm sm:text-base mb-1">{link.name}</h3>
              <p className="text-xs text-muted-foreground hidden sm:block">{link.description}</p>
            </motion.a>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="glass rounded-2xl p-8 neon-border max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Interested in working together?
            </h3>
            <p className="text-muted-foreground mb-6">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
            </p>
            <a
              href="mailto:your@email.com"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover-glow glow-primary transition-all duration-300 hover:scale-105"
            >
              <Mail className="w-5 h-5" />
              Get In Touch
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
