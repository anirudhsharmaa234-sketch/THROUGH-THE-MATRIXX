/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Section1Sequence from './components/Section1Sequence.tsx';
import Section2DeepSequence from './components/Section2DeepSequence.tsx';
import SurfaceToDeepTransition from './components/SurfaceToDeepTransition.tsx';
import Navigation from './components/Navigation.tsx';
import VerticalProgress from './components/VerticalProgress.tsx';
import ContextualText from './components/ContextualText.tsx';
import DeepContextualText from './components/DeepContextualText.tsx';
import CustomCursor from './components/CustomCursor.tsx';
import SectionInfoOverlay from './components/information/SectionInfoOverlay.tsx';
import { SECTION_INFO_REGISTRY } from './data/informationRegistry.ts';

/**
 * Main Cinematic Application Experience
 *
 * Unifies SECTION 1 (SURFACE) and SECTION 2 (DEEP) into a single continuous,
 * seamless scroll-driven journey:
 *
 * 1. SURFACE (0.00 -> 0.44):
 *    - Matrix Agent, biometric scanner, Triverse 3D artifact, Flow video background.
 *    - Climax at 0.42 -> 0.44: Fingertip makes contact with digital glass,
 *      producing an intense electric arc, shockwave ripple, and brief white flash.
 *
 * 2. TRANSITION BRIDGE (0.42 -> 0.58):
 *    - Digital impact state flows directly into deeper descent / dimensional warp tunnel.
 *    - 100% Scroll-Controlled: zero autoplay, zero loops, perfectly reversible.
 *    - Full-viewport responsive cover framing (zero letterboxing, zero black bars).
 *    - Intelligent overlap: SURFACE stays active as transition takes visual control,
 *      while DEEP begins materializing underneath/through the dimensional shift.
 *    - Zero layout unpinning, zero section boundary jump, zero empty black gaps.
 *
 * 3. DEEP (0.56 -> 1.00):
 *    - Once transition resolves, DEEP is already visually established.
 *    - Progressive descent through 3D mathematical space (4D tesseract manifold,
 *      formulation cards, neural filaments, binary cascades, Flow background).
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
  const SURFACE_END = 0.46;
  const BRIDGE_START = 0.42;
  const BRIDGE_END = 0.58;
  const DEEP_START = 0.48;

  // 1. Surface Internal Progress (0.00 -> 1.00)
  // Maps 0.00 -> 0.46 of global progress to 0.00 -> 1.00 of Surface's timeline
  const surfaceProgress = Math.min(1, globalProgress / SURFACE_END);

  // Surface Opacity: 1.0 during surface play, smoothly crossfades down between 0.44 and 0.52
  let surfaceOpacity = 1;
  if (globalProgress > 0.44) {
    surfaceOpacity = Math.max(0, 1 - (globalProgress - 0.44) / 0.08);
  }

  // 2. Transition Bridge Progress & Opacity
  // Bridge runs from 0.42 to 0.58
  const bridgeProgress = Math.max(
    0,
    Math.min(1, (globalProgress - BRIDGE_START) / (BRIDGE_END - BRIDGE_START))
  );

  let bridgeOpacity = 0;
  if (globalProgress >= BRIDGE_START && globalProgress <= BRIDGE_END) {
    if (globalProgress < 0.48) {
      // Fade in from 0.42 to 0.48
      bridgeOpacity = (globalProgress - BRIDGE_START) / (0.48 - BRIDGE_START);
    } else if (globalProgress > 0.52) {
      // Fade out from 0.52 to 0.58
      bridgeOpacity = Math.max(0, 1 - (globalProgress - 0.52) / (BRIDGE_END - 0.52));
    } else {
      bridgeOpacity = 1;
    }
  }

  // 3. Deep Internal Progress & Opacity
  // Deep starts emerging at 0.48 and continues to 1.00
  const deepProgress = Math.max(
    0,
    Math.min(1, (globalProgress - DEEP_START) / (1.0 - DEEP_START))
  );

  let deepOpacity = 0;
  if (globalProgress >= DEEP_START) {
    deepOpacity = Math.min(1, (globalProgress - DEEP_START) / (0.56 - DEEP_START));
  }

  // Active section for navigation and indicators
  const isDeepActive = globalProgress >= 0.50;
  const activeSection: 'surface' | 'deep' = isDeepActive ? 'deep' : 'surface';

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
    // Scroll directly to where DEEP is established
    window.scrollTo({ top: totalScrollable * 0.56, behavior: 'smooth' });
  };

  return (
    <main
      ref={containerRef}
      id="matrix-cinematic-master-timeline"
      className="relative w-full h-[850vh] bg-[#000000] text-neutral-100 font-matrix-mono selection:bg-[#22c55e]/20 selection:text-[#86efac] select-none"
      aria-label="Through The Matrix Cinematic Experience"
    >
      {/* Precision Desktop Custom Cursor across entire journey */}
      <CustomCursor />

      {/* Futuristic Minimal Navigation synchronized with active section & info trigger */}
      <Navigation
        activeSection={activeSection}
        onSurfaceClick={handleScrollToTop}
        onDeepClick={handleScrollToDeep}
        onOpenSectionInfo={() => setIsSectionInfoOpen(true)}
      />

      {/* Dynamic Vertical Scroll Progress Indicator */}
      {!isDeepActive ? (
        <VerticalProgress
          progress={surfaceProgress}
          sectionCode="01"
          sectionLabel="SURFACE"
        />
      ) : (
        <VerticalProgress
          progress={deepProgress}
          sectionCode="02"
          sectionLabel="DEEP"
        />
      )}

      {/* Cinematic Contextual Narrative Text Overlays */}
      {!isDeepActive ? (
        <ContextualText progress={surfaceProgress} />
      ) : (
        <DeepContextualText progress={deepProgress} />
      )}

      {/* 
        Single Unified Pinned Sticky Viewport:
        Permanently pinned at top: 0 throughout the entire 850vh scroll track.
        NEVER unpins, NEVER slides off-screen, eliminating 100% of section boundaries,
        jumps, white/black flashes, and seams.
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
          Fills 100% full viewport edge-to-edge with responsive cover reframing.
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
