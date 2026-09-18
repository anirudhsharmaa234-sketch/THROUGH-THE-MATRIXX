/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChevronDown } from 'lucide-react';
import HeroTitle from './HeroTitle.tsx';
import FlowMatrixBackground from './FlowMatrixBackground.tsx';

interface HeroSectionProps {
  onScrollToSection1?: () => void;
}

export default function HeroSection({ onScrollToSection1 }: HeroSectionProps) {
  return (
    <section
      id="hero-section-root"
      className="relative w-full h-screen min-h-[100dvh] bg-[#000000] overflow-hidden flex items-center justify-center select-none"
      aria-label="Hero Section"
    >
      {/* Ambient Foundation */}
      <div
        id="hero-ambient-foundation"
        className="absolute inset-0 w-full h-full bg-[#000000] pointer-events-none"
      >
        <div className="absolute inset-0 bg-matrix-glow-foundation pointer-events-none" />
      </div>

      {/* Full-Viewport Composition Stage */}
      <div
        id="hero-cinematic-stage"
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
      >
        {/* Foundational Matrix Micro-Texture Layer */}
        <div
          id="hero-matrix-texture"
          className="absolute inset-0 w-full h-full bg-matrix-texture opacity-40 pointer-events-none mix-blend-screen"
        />

        {/* Foundational Cinematic Scanline Raster Layer */}
        <div
          id="hero-cinematic-scanline"
          className="absolute inset-0 w-full h-full bg-cinematic-scanline opacity-30 pointer-events-none"
        />

        {/* Cinematic Vignette */}
        <div
          id="hero-cinematic-vignette"
          className="absolute inset-0 w-full h-full pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.8)_85%,#000000_100%)]"
        />

        {/* Flow Video Background Layer (Direct from Google Flow) */}
        <FlowMatrixBackground scrollProgress={0} />

        {/* Hero Title */}
        <HeroTitle />
      </div>

      {/* Scroll Cue Indicator */}
      <div
        id="hero-scroll-cue"
        onClick={onScrollToSection1}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 font-matrix-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#4ade80]/50 hover:text-[#4ade80] transition-colors cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label="Scroll to Section 1"
      >
        <span>SCROLL TO ENTER // SECTION 01</span>
        <ChevronDown className="w-3.5 h-3.5 text-[#4ade80]/60 animate-bounce" />
      </div>
    </section>
  );
}
