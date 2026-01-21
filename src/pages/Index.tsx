import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/hero/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import JourneySection from '@/components/sections/JourneySection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';
import CinematicIntro from '@/components/intro/CinematicIntro';

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Only show intro on first visit in this session
    const hasSeenIntro = sessionStorage.getItem('introSeen');
    if (!hasSeenIntro) {
      setShowIntro(true);
    } else {
      setIntroComplete(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('introSeen', 'true');
    setIntroComplete(true);
    setShowIntro(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}
      <Navbar />
      <main>
        <HeroSection introComplete={introComplete} />
        <AboutSection />
        <JourneySection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
