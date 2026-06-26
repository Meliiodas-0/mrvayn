import { BootSequence } from "@/components/BootSequence";
import { StickCursor } from "@/components/StickCursor";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ScrollSamurai } from "@/components/ScrollSamurai";
import { About } from "@/components/sections/About";
import { Work } from "@/components/sections/Work";
import { Skills } from "@/components/sections/Skills";
import { Timeline } from "@/components/sections/Timeline";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-surge focus:px-4 focus:py-2 focus:font-hud focus:text-xs focus:uppercase focus:tracking-widest focus:text-void"
      >
        Skip to content
      </a>

      <BootSequence />
      <StickCursor />
      <ScrollSamurai />
      <Nav />

      <main id="content" className="grain relative z-10">
        <Hero />
        <About />
        <Work />
        <Skills />
        <Timeline />
        <Contact />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
