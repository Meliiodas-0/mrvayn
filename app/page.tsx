import { BootSequence } from "@/components/BootSequence";
import { StickCursor } from "@/components/StickCursor";
import { FxLayer } from "@/components/fx/FxLayer";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { ScrollDepth } from "@/components/fx/ScrollDepth";
import { ScrollFx } from "@/components/fx/ScrollFx";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ProofTicker } from "@/components/sections/ProofTicker";
import { ScrollSamurai } from "@/components/ScrollSamurai";
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
      <FxLayer />
      <SmoothScroll />
      <ScrollDepth />
      <ScrollFx />
      <ScrollSamurai />
      <Nav />
      <ScrollProgress />
      {/* colour fields behind the glass so the blur has something to refract */}
      <div aria-hidden className="blob blob-red left-[-12vw] top-[8vh] h-[46vh] w-[46vh]" />
      <div aria-hidden className="blob blob-ink right-[18vw] top-[46vh] h-[52vh] w-[52vh]" />
      <div aria-hidden className="blob blob-red bottom-[-10vh] left-[32vw] h-[40vh] w-[40vh] opacity-40" />

      <main id="content" className="relative z-content">
        <Hero />
        <ProofTicker />
        <About />
        <Showreel />
        <Work />
        <Impact />
        <Skills />
        <Timeline />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
