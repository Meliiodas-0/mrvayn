import { Gamepad2, Linkedin, Instagram, Youtube, Mail, ArrowUp } from 'lucide-react';

const socials = [
  { icon: Linkedin, url: 'https://www.linkedin.com/in/aayush-vayn-91533921a/', label: 'LinkedIn' },
  { icon: Instagram, url: 'https://www.instagram.com/builtbyvayn/', label: 'Instagram' },
  { icon: Youtube, url: 'https://www.youtube.com/@vaynverse', label: 'YouTube' },
  { icon: Mail, url: 'https://mail.google.com/mail/?view=cm&fs=1&to=aayush007work@gmail.com', label: 'Email' },
];

const quickLinks = [
  { name: 'About', href: '#about' },
  { name: 'Journey', href: '#journey' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/60 mt-10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3 items-start">
          {/* Brand */}
          <div>
            <a href="#" className="flex items-center gap-2 group mb-3">
              <Gamepad2 className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-display font-bold text-lg tracking-wide">MrVayn</span>
            </a>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Founder &amp; game developer building premium, scalable game experiences.
            </p>
          </div>

          {/* Quick links */}
          <div className="sm:justify-self-center">
            <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground mb-4">Navigate</h4>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.name}>
                  <a href={l.href} className="text-sm text-foreground/70 hover:text-primary transition-colors">
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="sm:justify-self-end">
            <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground mb-4">Connect</h4>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-border/60 bg-card/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2026 Made by MrVayn</p>
          <a
            href="#"
            className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
          >
            Back to top
            <span className="w-7 h-7 flex items-center justify-center rounded-full border border-border/60 group-hover:border-primary/40 transition-colors">
              <ArrowUp className="w-3.5 h-3.5" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
