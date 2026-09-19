/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Section1Sequence from './components/Section1Sequence.tsx';
import Section2DeepSequence from './components/Section2DeepSequence.tsx';
import Section3NetworkSequence from './components/Section3NetworkSequence.tsx';
import SurfaceToDeepTransition from './components/SurfaceToDeepTransition.tsx';
import Navigation from './components/Navigation.tsx';
import VerticalProgress from './components/VerticalProgress.tsx';
import ContextualText from './components/ContextualText.tsx';
import DeepContextualText from './components/DeepContextualText.tsx';
import CustomCursor from './components/CustomCursor.tsx';
import AutoScrollButton from './components/AutoScrollButton.tsx';
import SectionInfoOverlay from './components/information/SectionInfoOverlay.tsx';
import { SECTION_INFO_REGISTRY } from './data/informationRegistry.ts';

/**
 * Main Cinematic Application Experience
 *
 * Unifies:
 * - SECTION 1 (SURFACE): The Boundary Veil // The World
 * - BRIDGE: Dimensional shift & warp tunnel
 * - SECTION 2 (DEEP): The Mathematical Substrate // The Intelligence
 * - SECTION 3 (THE NETWORK): The Spatial Interconnect // The Connections
 */
export default function App() {
  const containerRef = useRef<HTMLElement | null>(null);
  const [globalProgress, setGlobalProgress] = useState<number>(0);

  // Measure scroll progress through the unified timeline
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const totalScrollable = container.offsetHeight - window.innerHeight;
    if (totalScrollable <= 0) return;

    const currentY = -rect.top;
    const progress = Math.max(0, Math.min(1, currentY / totalScrollable));
    setGlobalProgress(progress);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  // Timeline Boundaries
  const SURFACE_END = 0.31;
  const BRIDGE_START = 0.28;
  const BRIDGE_END = 0.38;
  const DEEP_START = 0.32;
  const DEEP_END = 0.65;
  const NETWORK_START = 0.64;

  // 1. Surface Internal Progress (0.00 -> 1.00)
  const surfaceProgress = Math.min(1, globalProgress / SURFACE_END);

  // Surface Opacity: 1.0 during surface play, smoothly crossfades down 0.30 -> 0.35
  let surfaceOpacity = 1;
  if (globalProgress > 0.30) {
    surfaceOpacity = Math.max(0, 1 - (globalProgress - 0.30) / 0.05);
  }

  // 2. Transition Bridge Progress & Opacity (0.28 -> 0.38)
  const bridgeProgress = Math.max(
    0,
    Math.min(1, (globalProgress - BRIDGE_START) / (BRIDGE_END - BRIDGE_START))
  );

  let bridgeOpacity = 0;
  if (globalProgress >= BRIDGE_START && globalProgress <= BRIDGE_END) {
    if (globalProgress < 0.32) {
      bridgeOpacity = (globalProgress - BRIDGE_START) / (0.32 - BRIDGE_START);
    } else if (globalProgress > 0.34) {
      bridgeOpacity = Math.max(0, 1 - (globalProgress - 0.34) / (BRIDGE_END - 0.34));
    } else {
      bridgeOpacity = 1;
    }
  }

  // 3. Deep Internal Progress & Opacity (0.32 -> 0.65)
  const deepProgress = Math.max(
    0,
    Math.min(1, (globalProgress - DEEP_START) / (DEEP_END - DEEP_START))
  );

  let deepOpacity = 0;
  if (globalProgress >= DEEP_START && globalProgress <= DEEP_END + 0.02) {
    if (globalProgress < 0.37) {
      deepOpacity = Math.min(1, (globalProgress - DEEP_START) / (0.37 - DEEP_START));
    } else if (globalProgress > DEEP_END - 0.01) {
      deepOpacity = Math.max(0, 1 - (globalProgress - (DEEP_END - 0.01)) / 0.03);
    } else {
      deepOpacity = 1;
    }
  }

  // 4. Network Internal Progress & Opacity (0.64 -> 1.00)
  const networkProgress = Math.max(
    0,
    Math.min(1, (globalProgress - NETWORK_START) / (1.0 - NETWORK_START))
  );

  let networkOpacity = 0;
  if (globalProgress >= NETWORK_START) {
    networkOpacity = Math.min(1, (globalProgress - NETWORK_START) / 0.02);
  }

  // Active section for navigation and indicators
  let activeSection: 'surface' | 'deep' | 'network' = 'surface';
  if (globalProgress >= 0.65) {
    activeSection = 'network';
  } else if (globalProgress >= 0.32) {
    activeSection = 'deep';
  }

  // Section Information Layer state
  const [isSectionInfoOpen, setIsSectionInfoOpen] = useState<boolean>(false);

  // Navigation Click Handlers
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToDeep = () => {
    const container = containerRef.current;
    if (!container) return;
    const totalScrollable = container.offsetHeight - window.innerHeight;
    window.scrollTo({ top: totalScrollable * 0.38, behavior: 'smooth' });
  };

  const handleScrollToNetwork = () => {
    const container = containerRef.current;
    if (!container) return;
    const totalScrollable = container.offsetHeight - window.innerHeight;
    window.scrollTo({ top: totalScrollable * 0.74, behavior: 'smooth' });
  };

  return (
    <main
      ref={containerRef}
      id="matrix-cinematic-master-timeline"
      className="relative w-full h-[1350vh] bg-[#000000] text-neutral-100 font-matrix-mono selection:bg-[#22c55e]/20 selection:text-[#86efac] select-none"
      aria-label="Through The Matrix Cinematic Experience"
    >
      {/* Precision Desktop Custom Cursor across entire journey */}
      <CustomCursor />

      {/* Futuristic Minimal Navigation synchronized with active section & info trigger */}
      <div className="transition-opacity duration-150">
        <Navigation
          activeSection={activeSection}
          onSurfaceClick={handleScrollToTop}
          onDeepClick={handleScrollToDeep}
          onNetworkClick={handleScrollToNetwork}
          onOpenSectionInfo={() => setIsSectionInfoOpen(true)}
        />
      </div>

      {/* Dynamic Vertical Scroll Progress Indicator */}
      {activeSection === 'surface' && (
        <VerticalProgress
          progress={surfaceProgress}
          sectionCode="01"
          sectionLabel="SURFACE"
        />
      )}
      {activeSection === 'deep' && (
        <VerticalProgress
          progress={deepProgress}
          sectionCode="02"
          sectionLabel="DEEP"
        />
      )}
      {activeSection === 'network' && (
        <VerticalProgress
          progress={networkProgress}
          sectionCode="03"
          sectionLabel="NETWORK"
        />
      )}

      {/* Discrete Side Auto-Scroll Control */}
      <AutoScrollButton containerRef={containerRef} />

      {/* Cinematic Contextual Narrative Text Overlays */}
      {activeSection === 'surface' && (
        <ContextualText progress={surfaceProgress} />
      )}
      {activeSection === 'deep' && (
        <DeepContextualText progress={deepProgress} />
      )}

      {/* 
        Single Unified Pinned Sticky Viewport:
        Permanently pinned at top: 0 throughout the entire scroll track.
        NEVER unpins, NEVER slides off-screen, eliminating 100% of section boundaries.
      */}
      <div
        id="unified-cinematic-viewport"
        className="sticky top-0 w-full h-screen min-h-[100dvh] overflow-hidden bg-[#000000] flex items-center justify-center"
      >
        {/* SECTION 1 (SURFACE): Embedded Layer Group */}
        <Section1Sequence
          isEmbedded
          controlledProgress={surfaceProgress}
          opacity={surfaceOpacity}
          onTransitionToDeep={handleScrollToDeep}
        />

        {/* 
          SURFACE -> DEEP TRANSITION BRIDGE:
          Scroll-controlled dimensional shift, warp tunnel, and concentric data rings.
        */}
        <SurfaceToDeepTransition
          bridgeProgress={bridgeProgress}
          opacity={bridgeOpacity}
        />

        {/* SECTION 2 (DEEP): Embedded Layer Group */}
        <Section2DeepSequence
          isEmbedded
          controlledProgress={deepProgress}
          opacity={deepOpacity}
          onOpenSectionInfo={() => setIsSectionInfoOpen(true)}
        />

        {/* SECTION 3 (THE NETWORK): Embedded Layer Group */}
        <Section3NetworkSequence
          isEmbedded
          controlledProgress={networkProgress}
          opacity={networkOpacity}
        />
      </div>

      {/* High-Level Section Cybernetic Information Overlay */}
      <SectionInfoOverlay
        isOpen={isSectionInfoOpen}
        section={SECTION_INFO_REGISTRY[activeSection]}
        onClose={() => setIsSectionInfoOpen(false)}
      />
    </main>
  );
}
