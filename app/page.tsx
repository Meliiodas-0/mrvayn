import { BootSequence } from "@/components/BootSequence";
import { StickCursor } from "@/components/StickCursor";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { ScrollFx } from "@/components/fx/ScrollFx";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { HeroSculpture } from "@/components/hero/HeroSculpture";
import { About } from "@/components/sections/About";
import { Showreel } from "@/components/sections/Showreel";
import { Work } from "@/components/sections/Work";
import { Impact } from "@/components/sections/Impact";
import { Skills } from "@/components/sections/Skills";
import { Timeline } from "@/components/sections/Timeline";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-chrome focus:bg-ion focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:text-white"
      >
        Skip to content
      </a>

      <BootSequence />
      <StickCursor />
      <SmoothScroll />
      <ScrollFx />
      <Nav />
      <ScrollProgress />

      <main id="content" className="portfolio-theme relative z-content">
        <HeroSculpture />
        <Hero />
        <Work />
        <About />
        <Impact />
        <Showreel />
        <Skills />
        <Timeline />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
