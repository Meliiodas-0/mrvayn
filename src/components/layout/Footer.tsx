import { Gamepad2, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-primary" />
          <span className="font-bold">YourName</span>
        </a>

        {/* Copyright */}
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          © {currentYear} Made with <Heart className="w-4 h-4 text-accent" /> by YourName
        </p>

        {/* Quick Links */}
        <div className="flex items-center gap-6">
          <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
          <a href="#projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Projects
          </a>
          <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
