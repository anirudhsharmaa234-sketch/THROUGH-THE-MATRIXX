/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { SectionInfo } from '../../types/informationSystem.ts';

interface SectionInfoOverlayProps {
  section: SectionInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SectionInfoOverlay({
  section,
  isOpen,
  onClose,
}: SectionInfoOverlayProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Smooth scroll fade down: automatically fades down and dismisses when user scrolls
  const [scrollFadeOpacity, setScrollFadeOpacity] = useState<number>(1);
  const [scrollFadeOffsetY, setScrollFadeOffsetY] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setScrollFadeOpacity(1);
      setScrollFadeOffsetY(0);
      return;
    }

    const initialY = window.scrollY;
    setScrollFadeOpacity(1);
    setScrollFadeOffsetY(0);

    const handleScroll = () => {
      const delta = Math.abs(window.scrollY - initialY);
      const fadeDist = 60;
      if (delta <= 0) {
        setScrollFadeOpacity(1);
        setScrollFadeOffsetY(0);
      } else if (delta < fadeDist) {
        const ratio = 1 - delta / fadeDist;
        setScrollFadeOpacity(ratio);
        setScrollFadeOffsetY((1 - ratio) * 24);
      } else {
        setScrollFadeOpacity(0);
        setScrollFadeOffsetY(24);
        onClose();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen, onClose]);

  if (!isOpen || !section) return null;

  return (
    <div
      id="section-info-modal-backdrop"
      style={{ opacity: scrollFadeOpacity }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md transition-opacity duration-75 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={`Layer Information: ${section.name}`}
    >
      <div
        id="section-info-hud-card"
        style={{
          transform: `translate3d(0, ${scrollFadeOffsetY}px, 0)`,
        }}
        className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-[#020a04]/95 border border-[#22c55e]/50 p-6 sm:p-8 font-matrix-mono text-neutral-200 shadow-[0_0_40px_rgba(34,197,94,0.25)] animate-matrix-pop-in will-change-transform"
      >
        {/* Cybernetic Corner Brackets */}
        <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#86efac]" />
        <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[#86efac]" />
        <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[#86efac]" />
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#86efac]" />

        {/* Section Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#22c55e]/30 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" />
              <span className="text-[11px] tracking-[0.28em] text-[#86efac] uppercase font-semibold">
                LAYER {section.sectionCode} // SYSTEM OVERVIEW
              </span>
            </div>
            <h2 className="font-matrix-display text-2xl sm:text-3xl font-bold tracking-[0.2em] text-white uppercase">
              {section.name}
            </h2>
            <p className="text-[11px] sm:text-xs tracking-[0.16em] text-[#4ade80]/80 uppercase mt-0.5">
              {section.subtitle}
            </p>
          </div>

          <button
            type="button"
            id="section-info-close-btn"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase font-semibold text-neutral-300 hover:text-white bg-white/5 hover:bg-[#22c55e]/20 border border-[#22c55e]/40 transition-colors focus:outline-none"
            aria-label="Close Layer Information"
          >
            <span>[ CLOSE // ESC ]</span>
          </button>
        </div>

        {/* High-Level Summary Statement */}
        <div className="mb-6 p-3.5 bg-black/60 border-l-2 border-[#4ade80] text-xs sm:text-[13px] leading-relaxed text-neutral-200">
          {section.summary}
        </div>

        {/* Section Body Blocks */}
        <div className="space-y-5 text-xs sm:text-[13px] leading-relaxed text-neutral-300">
          {/* 1. What it represents */}
          <div>
            <div className="text-[11px] tracking-[0.22em] text-[#4ade80] uppercase mb-1 font-semibold flex items-center gap-2">
              <span className="text-[#86efac]">01 //</span>
              <span>WHAT THIS LAYER REPRESENTS</span>
            </div>
            <p className="pl-6 border-l border-[#22c55e]/25 text-neutral-300">
              {section.whatItRepresents}
            </p>
          </div>

          {/* 2. What you are seeing */}
          <div>
            <div className="text-[11px] tracking-[0.22em] text-[#4ade80] uppercase mb-1 font-semibold flex items-center gap-2">
              <span className="text-[#86efac]">02 //</span>
              <span>OBSERVATIONAL ENVIRONMENT</span>
            </div>
            <p className="pl-6 border-l border-[#22c55e]/25 text-neutral-300">
              {section.whatYouAreSeeing}
            </p>
          </div>

          {/* 3. What the interaction represents */}
          <div>
            <div className="text-[11px] tracking-[0.22em] text-[#4ade80] uppercase mb-1 font-semibold flex items-center gap-2">
              <span className="text-[#86efac]">03 //</span>
              <span>INTERACTION SIGNIFICANCE</span>
            </div>
            <p className="pl-6 border-l border-[#22c55e]/25 text-neutral-300">
              {section.interactionMeaning}
            </p>
          </div>

          {/* 4. Relation to entering the Matrix */}
          <div>
            <div className="text-[11px] tracking-[0.22em] text-[#4ade80] uppercase mb-1 font-semibold flex items-center gap-2">
              <span className="text-[#86efac]">04 //</span>
              <span>RELATION TO ENTERING THE MATRIX</span>
            </div>
            <p className="pl-6 border-l border-[#22c55e]/25 text-neutral-300">
              {section.relationToMatrix}
            </p>
          </div>

          {/* 5. Distinction from previous layer if present */}
          {section.distinctionFromPrevious && (
            <div>
              <div className="text-[11px] tracking-[0.22em] text-[#4ade80] uppercase mb-1 font-semibold flex items-center gap-2">
                <span className="text-[#86efac]">05 //</span>
                <span>LAYER CONTRAST & DISTINCTION</span>
              </div>
              <p className="pl-6 border-l border-[#22c55e]/25 text-neutral-300">
                {section.distinctionFromPrevious}
              </p>
            </div>
          )}
        </div>

        {/* Telemetry Footer */}
        <div className="mt-6 pt-4 border-t border-[#22c55e]/30 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {section.telemetryBadges.map((badge, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[9px] tracking-wider uppercase bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#86efac]"
              >
                {badge}
              </span>
            ))}
          </div>
          <span className="text-[9px] tracking-widest text-[#4ade80]/70 uppercase">
            SEC_{section.sectionCode} // ARCHITECTURE VERIFIED
          </span>
        </div>
      </div>
    </div>
  );
}
