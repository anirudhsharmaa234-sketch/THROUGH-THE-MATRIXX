/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import Navigation from './Navigation.tsx';
import VerticalProgress from './VerticalProgress.tsx';
import CustomCursor from './CustomCursor.tsx';
import DeepMathematicalEnvironment from './DeepMathematicalEnvironment.tsx';
import DeepAtmosphereCanvas from './DeepAtmosphereCanvas.tsx';
import DeepFlowBackground from './DeepFlowBackground.tsx';
import DeepTitle from './DeepTitle.tsx';
import DeepContextualText from './DeepContextualText.tsx';
import DeepEndFlashTransition from './DeepEndFlashTransition.tsx';
import ElementInfoPanel from './information/ElementInfoPanel.tsx';
import { ELEMENT_INFO_REGISTRY } from '../data/informationRegistry.ts';

/**
 * SECTION 2 — DEEP
 *
 * Built using the SAME CINEMATIC SECTION STRUCTURE established in SECTION 1:
 * - 100% Scroll-Controlled Frame & 3D Progression (NO autoplay, NO looping, NO unexpected restarts).
 * - Edge-to-edge full-viewport canvas with zero letterboxing and zero black bars.
 * - Intentional cinematic black opening:
 *     0%   -> Pure black void (continues seamlessly from Section 1's impact flash collapse)
 *     10%  -> First tiny particles / subtle green digital traces begin appearing
 *     20%  -> Fragmented mathematical symbols slowly emerge
 *     35%  -> Binary & data streams emerge
 *     50%  -> Larger mathematical structures reveal (4D hypercube tesseract wireframe, coordinate lattices)
 *     65%  -> Neural / data filaments become visible linking nodes across space
 *     80%  -> Complete DEEP mathematical environment established
 *     100% -> Transition prepares for the next layer (Network/Simulation/Core)
 */
export interface Section2DeepSequenceProps {
  controlledProgress?: number;
  opacity?: number;
  isEmbedded?: boolean;
  onOpenSectionInfo?: () => void;
}

export default function Section2DeepSequence({
  controlledProgress,
  opacity = 1.0,
  isEmbedded = false,
  onOpenSectionInfo,
}: Section2DeepSequenceProps = {}) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Exploration System State
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [anchorPos, setAnchorPos] = useState<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth * 0.45 : 550,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.45 : 350,
  });

  const handleSelectElement = useCallback((elementId: string, screenPos: { x: number; y: number }) => {
    setSelectedElementId(elementId);
    setAnchorPos(screenPos);
  }, []);

  const handleUpdateScreenPos = useCallback((screenPos: { x: number; y: number }) => {
    setAnchorPos(screenPos);
  }, []);

  const handleCloseElementInfo = useCallback(() => {
    setSelectedElementId(null);
  }, []);

  const handleSelectAdjacent = useCallback((direction: 'prev' | 'next') => {
    const allIds = Object.keys(ELEMENT_INFO_REGISTRY);
    const currentIdx = selectedElementId ? allIds.indexOf(selectedElementId) : 0;
    const nextIdx = direction === 'next'
      ? (currentIdx + 1) % allIds.length
      : (currentIdx - 1 + allIds.length) % allIds.length;
    setSelectedElementId(allIds[nextIdx]);
  }, [selectedElementId]);

  const selectedElement = selectedElementId ? ELEMENT_INFO_REGISTRY[selectedElementId] : null;

  // Measure scroll position strictly through Section 2's scroll track (only if not embedded)
  const handleScroll = useCallback(() => {
    if (isEmbedded) return;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const totalScrollable = container.offsetHeight - window.innerHeight;
    if (totalScrollable <= 0) return;

    // When rect.top is 0, user is exactly at start of Section 2
    // When rect.top is -totalScrollable, user has reached bottom of Section 2
    const currentScroll = -rect.top;
    const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
    setScrollProgress(progress);
  }, [isEmbedded]);

  useEffect(() => {
    if (isEmbedded) return;
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isEmbedded, handleScroll]);

  // Synchronize controlledProgress when embedded
  useEffect(() => {
    if (isEmbedded && controlledProgress !== undefined) {
      setScrollProgress(controlledProgress);
    }
  }, [isEmbedded, controlledProgress]);

  const effectiveProgress = isEmbedded ? (controlledProgress ?? scrollProgress) : scrollProgress;

  // Automatically dismiss active element inspection when user scrolls or reaches end transition
  const prevProgressRef = useRef(effectiveProgress);
  useEffect(() => {
    if (selectedElementId) {
      if (effectiveProgress >= 0.88 || Math.abs(effectiveProgress - prevProgressRef.current) > 0.015) {
        setSelectedElementId(null);
      }
    }
    prevProgressRef.current = effectiveProgress;
  }, [effectiveProgress, selectedElementId]);

  // Smooth scroll handler for nav
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToDeep = () => {
    const container = containerRef.current;
    if (!container) return;
    const top = container.offsetTop;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  // Visibility of DEEP's vertical progress indicator
  // Fades in when DEEP environment starts emerging (~0.05) and remains active
  const showProgress = effectiveProgress >= 0.04;

  if (isEmbedded) {
    if (opacity <= 0.001) return null;
    return (
      <div
        id="section2-deep-embedded-stage"
        className={`absolute inset-0 w-full h-full select-none z-20 ${
          opacity > 0.35 && effectiveProgress < 0.94 ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{
          opacity,
          transition: 'opacity 80ms ease-out',
          willChange: 'opacity',
        }}
      >
        {/* Layer 0: Cinematic Environmental Flow Video Background */}
        <DeepFlowBackground scrollProgress={effectiveProgress} />

        {/* Layer 1: Real Three.js 3D WebGL Mathematical Space */}
        <DeepMathematicalEnvironment
          scrollProgress={effectiveProgress}
          selectedElementId={selectedElementId}
          onSelectElement={handleSelectElement}
          onUpdateScreenPos={handleUpdateScreenPos}
        />

        {/* Layer 2: 2D Crisp Binary Cascades, Coordinates & Atmosphere */}
        <DeepAtmosphereCanvas scrollProgress={effectiveProgress} />

        {/* Layer 3: Section 2 Identity Title Overlay (DEEP // LAYER 02) */}
        <DeepTitle scrollProgress={effectiveProgress} />

        {/* Layer 4: Cinematic White Flash & Complete Black Transition at Layer 2 Finale */}
        <DeepEndFlashTransition progress={effectiveProgress} />

        {/* Layer 5: Subtle Substrate Exploration Action Trigger */}
        {effectiveProgress >= 0.12 && effectiveProgress < 0.91 && !selectedElement && opacity > 0.6 && (
          <div
            id="deep-exploration-hint-embedded"
            className="absolute bottom-6 left-6 sm:left-10 z-30 pointer-events-auto"
          >
            <button
              type="button"
              onClick={() => setSelectedElementId('schrodinger-dynamics')}
              className="group flex items-center gap-2 px-3 py-1.5 bg-black/80 border border-[#22c55e]/40 hover:border-[#4ade80] text-[10px] tracking-[0.22em] text-neutral-300 hover:text-[#86efac] font-matrix-mono backdrop-blur-md transition-all focus:outline-none"
              aria-label="Inspect Mathematical Substrate"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shadow-[0_0_6px_#4ade80] group-hover:scale-125 transition-transform" />
              <span className="text-[#86efac]">[ SUBSTRATE ]</span>
              <span className="hidden sm:inline text-neutral-400">SELECT 3D FORMULATION</span>
            </button>
          </div>
        )}

        {/* Layer 6: Connected Element Information Panel */}
        {selectedElement && (
          <ElementInfoPanel
            element={selectedElement}
            anchorPosition={anchorPos}
            onClose={handleCloseElementInfo}
            onSelectAdjacent={handleSelectAdjacent}
          />
        )}
      </div>
    );
  }

  return (
    <section
      ref={containerRef}
      id="deep-section2-timeline"
      className="relative w-full h-[450vh] bg-[#000000] select-none"
      aria-label="Section 2 Deep Experience"
    >
      {/* Precision Desktop Custom Cursor */}
      <CustomCursor />

      {/* Futuristic Navigation Layer synced with active section */}
      <Navigation
        activeSection="deep"
        onSurfaceClick={handleScrollToTop}
        onDeepClick={handleScrollToDeep}
        onOpenSectionInfo={onOpenSectionInfo}
      />

      {/* Vertical Scroll Progress Indicator specifically for Section 2 (02 // DEEP) */}
      {showProgress && (
        <VerticalProgress
          progress={scrollProgress}
          sectionCode="02"
          sectionLabel="DEEP"
        />
      )}

      {/* Cinematic Contextual Narrative Text Overlay */}
      <DeepContextualText progress={scrollProgress} />

      {/* Pinned Sticky Full-Viewport Stage */}
      <div
        id="deep-cinematic-sticky-viewport"
        className="sticky top-0 w-full h-screen min-h-[100dvh] overflow-hidden bg-[#000000] flex items-center justify-center"
      >
        {/* Layer 0: Cinematic Environmental Flow Video Background */}
        <DeepFlowBackground scrollProgress={scrollProgress} />

        {/* Layer 1: Real Three.js 3D WebGL Mathematical Space */}
        <DeepMathematicalEnvironment
          scrollProgress={scrollProgress}
          selectedElementId={selectedElementId}
          onSelectElement={handleSelectElement}
          onUpdateScreenPos={handleUpdateScreenPos}
        />

        {/* Layer 2: 2D Crisp Binary Cascades, Coordinates & Atmosphere */}
        <DeepAtmosphereCanvas scrollProgress={scrollProgress} />

        {/* Layer 3: Section 2 Identity Title Overlay (DEEP // LAYER 02) */}
        <DeepTitle scrollProgress={scrollProgress} />

        {/* 
          Layer 4: Initial Intentional Pure Black Opening Veil
          Guarantees that at 0% scrollProgress, the section is 100% pure black void,
          seamlessly continuing the black screen after Section 1's impact flash collapse.
          Gradually dissolves as the first data traces appear between 0.02 and 0.12.
        */}
        {scrollProgress < 0.12 && (
          <div
            id="deep-pure-black-opening-veil"
            className="absolute inset-0 w-full h-full bg-[#000000] pointer-events-none z-25 transition-opacity duration-75"
            style={{
              opacity: Math.max(0, 1 - scrollProgress / 0.10),
            }}
          />
        )}

        {/* Layer 5: Cinematic White Flash & Complete Black Transition at Layer 2 Finale */}
        <DeepEndFlashTransition progress={scrollProgress} />

        {/* Layer 6: Subtle Substrate Exploration Action Trigger */}
        {scrollProgress >= 0.12 && scrollProgress < 0.91 && !selectedElement && (
          <div
            id="deep-exploration-hint-standalone"
            className="absolute bottom-6 left-6 sm:left-10 z-30 pointer-events-auto"
          >
            <button
              type="button"
              onClick={() => setSelectedElementId('schrodinger-dynamics')}
              className="group flex items-center gap-2 px-3 py-1.5 bg-black/80 border border-[#22c55e]/40 hover:border-[#4ade80] text-[10px] tracking-[0.22em] text-neutral-300 hover:text-[#86efac] font-matrix-mono backdrop-blur-md transition-all focus:outline-none"
              aria-label="Inspect Mathematical Substrate"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shadow-[0_0_6px_#4ade80] group-hover:scale-125 transition-transform" />
              <span className="text-[#86efac]">[ SUBSTRATE ]</span>
              <span className="hidden sm:inline text-neutral-400">SELECT 3D FORMULATION</span>
            </button>
          </div>
        )}

        {/* Layer 7: Connected Element Information Panel */}
        {selectedElement && (
          <ElementInfoPanel
            element={selectedElement}
            anchorPosition={anchorPos}
            onClose={handleCloseElementInfo}
            onSelectAdjacent={handleSelectAdjacent}
          />
        )}
      </div>
    </section>
  );
}
