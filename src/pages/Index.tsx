import { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/hero/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import JourneySection from '@/components/sections/JourneySection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';
import CinematicIntro from '@/components/intro/CinematicIntro';
import SectionDivider3D from '@/components/3d/SectionDivider3D';

// Lazy load the heavy 3D background
const ScrollReactive3DScene = lazy(() => import('@/components/3d/ScrollReactive3DScene'));

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
    <div className="min-h-screen bg-background relative">
      {/* Global scroll-reactive 3D background */}
      <Suspense fallback={null}>
        <ScrollReactive3DScene />
      </Suspense>
      
      {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}
      <Navbar />
      <main className="relative z-10">
        <HeroSection introComplete={introComplete} />
        
        <SectionDivider3D variant="energy" fromColor="primary" toColor="secondary" />
        
        <AboutSection />
        
        <SectionDivider3D variant="data" fromColor="secondary" toColor="primary" />
        
        <JourneySection />
        
        <SectionDivider3D variant="data" fromColor="primary" toColor="accent" />
        
        <ProjectsSection />
        
        <SectionDivider3D variant="wave" fromColor="accent" toColor="primary" />
        
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
