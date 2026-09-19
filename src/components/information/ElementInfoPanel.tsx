/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { ElementInfo } from '../../types/informationSystem.ts';

interface ElementInfoPanelProps {
  element: ElementInfo;
  anchorPosition: { x: number; y: number };
  onClose: () => void;
  onSelectAdjacent?: (direction: 'prev' | 'next') => void;
}

export default function ElementInfoPanel({
  element,
  anchorPosition,
  onClose,
  onSelectAdjacent,
}: ElementInfoPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelDims, setPanelDims] = useState<{ width: number; height: number }>({
    width: 440,
    height: 480,
  });

  // Calculate smart non-covering placement (left or right of anchor, clamped to viewport)
  const isRightHalf = anchorPosition.x > window.innerWidth * 0.55;
  const isBottomHalf = anchorPosition.y > window.innerHeight * 0.65;

  // Measure actual panel size once mounted
  useEffect(() => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setPanelDims({ width: rect.width, height: rect.height });
    }
  }, [element]);

  // Automatically dismiss panel when user scrolls the page, with a smooth fade-down transition
  const [scrollFadeOpacity, setScrollFadeOpacity] = useState<number>(1);
  const [scrollFadeOffsetY, setScrollFadeOffsetY] = useState<number>(0);

  useEffect(() => {
    let initialY = window.scrollY;
    setScrollFadeOpacity(1);
    setScrollFadeOffsetY(0);

    const handleWindowScroll = () => {
      const delta = Math.abs(window.scrollY - initialY);
      const fadeDistance = 45;

      if (delta <= 0) {
        setScrollFadeOpacity(1);
        setScrollFadeOffsetY(0);
      } else if (delta < fadeDistance) {
        const ratio = 1 - delta / fadeDistance;
        setScrollFadeOpacity(ratio);
        setScrollFadeOffsetY((1 - ratio) * 20);
      } else {
        setScrollFadeOpacity(0);
        setScrollFadeOffsetY(20);
        onClose();
      }
    };
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [onClose]);

  // Keyboard navigation & escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight' && onSelectAdjacent) {
        onSelectAdjacent('next');
      } else if (e.key === 'ArrowLeft' && onSelectAdjacent) {
        onSelectAdjacent('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onSelectAdjacent]);

  // Viewport bounds
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 720;
  const isMobile = vw < 640;

  // Target panel coordinates
  let targetPanelX: number;
  let targetPanelY: number;

  if (isMobile) {
    // On small mobile screens, place at bottom or center without obscuring pinpoint
    targetPanelX = 16;
    targetPanelY = vh - panelDims.height - 24;
    if (targetPanelY < 60) targetPanelY = 60;
  } else {
    // On desktop, position beside the element (offset by ~60px)
    if (isRightHalf) {
      targetPanelX = Math.max(28, anchorPosition.x - panelDims.width - 64);
    } else {
      targetPanelX = Math.min(vw - panelDims.width - 28, anchorPosition.x + 64);
    }

    // Vertical alignment centered on anchor, clamped to screen bounds
    targetPanelY = anchorPosition.y - panelDims.height * 0.4;
    targetPanelY = Math.max(68, Math.min(vh - panelDims.height - 32, targetPanelY));
  }

  // Pinpoint connector coordinates
  const pinX = anchorPosition.x;
  const pinY = anchorPosition.y;

  // Connection point on the edge of the panel closest to anchor
  const connX = isRightHalf
    ? targetPanelX + panelDims.width
    : targetPanelX;
  const connY = Math.min(
    targetPanelY + panelDims.height - 30,
    Math.max(targetPanelY + 30, pinY)
  );

  // SVG intermediate bend coordinate for clean cybernetic circuit trace
  const midX = isRightHalf ? (pinX + connX) / 2 : (pinX + connX) / 2;
  const midY = pinY;

  return (
    <div
      id="element-info-overlay-root"
      className="fixed inset-0 z-50 pointer-events-none select-none overflow-hidden"
      aria-label={`Information for ${element.name}`}
    >
      {/* 
        Full-Screen Backdrop:
        Dismisses the info panel on click or wheel scroll, preventing any scroll-blocking or trapping
      */}
      <div
        id="element-info-backdrop"
        onClick={onClose}
        onTouchStart={onClose}
        onWheel={() => onClose()}
        className="absolute inset-0 w-full h-full pointer-events-auto bg-black/25 backdrop-blur-[1px] cursor-pointer"
        aria-hidden="true"
      />

      {/* 
        Interactive SVG Connecting Circuit Trace:
        PINPOINT RETICLE -> THIN CONNECTING LINE -> INFORMATION PANEL
      */}
      <svg
        id="element-connector-svg"
        className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-75"
        style={{
          opacity: scrollFadeOpacity,
          filter: 'drop-shadow(0 0 5px rgba(74, 222, 128, 0.45))',
        }}
      >
        <defs>
          <linearGradient id="connectorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#86efac" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#4ade80" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.4" />
          </linearGradient>
          <pattern id="matrixHatch" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="6" y2="6" stroke="#22c55e" strokeWidth="0.5" strokeOpacity="0.2" />
          </pattern>
        </defs>

        {/* Outer subtle halo ring around pinpoint */}
        <circle
          cx={pinX}
          cy={pinY}
          r={20}
          fill="none"
          stroke="#4ade80"
          strokeWidth="0.8"
          strokeDasharray="4 4"
          className="animate-spin-slow opacity-80"
        />

        {/* Inner solid pinpoint reticle with center glowing core */}
        <circle
          cx={pinX}
          cy={pinY}
          r={6}
          fill="#030d06"
          stroke="#86efac"
          strokeWidth="2"
        />
        <circle cx={pinX} cy={pinY} r={2.5} fill="#ffffff" />

        {/* Corner alignment crosshairs on pinpoint */}
        <line x1={pinX - 12} y1={pinY} x2={pinX - 7} y2={pinY} stroke="#86efac" strokeWidth="1.2" />
        <line x1={pinX + 7} y1={pinY} x2={pinX + 12} y2={pinY} stroke="#86efac" strokeWidth="1.2" />
        <line x1={pinX} y1={pinY - 12} x2={pinX} y2={pinY - 7} stroke="#86efac" strokeWidth="1.2" />
        <line x1={pinX} y1={pinY + 7} x2={pinX} y2={pinY + 12} stroke="#86efac" strokeWidth="1.2" />

        {/* 
          Stepped orthogonal circuit connector line:
          Draws from PINPOINT -> Intermediate Corner Node -> Edge of Info Panel
        */}
        <path
          d={`M ${pinX} ${pinY} L ${midX} ${midY} L ${connX} ${connY}`}
          fill="none"
          stroke="url(#connectorGradient)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          className="animate-pulse"
        />

        {/* Circuit joint node at line bend */}
        <rect
          x={midX - 2.5}
          y={midY - 2.5}
          width={5}
          height={5}
          fill="#4ade80"
          className="opacity-90"
        />

        {/* Panel docking node */}
        <circle
          cx={connX}
          cy={connY}
          r={3.5}
          fill="#86efac"
        />
      </svg>

      {/* 
        Technical Information Panel:
        Structured strictly according to requirement:
        ELEMENT ID, ELEMENT NAME, TYPE, MEANING, DESCRIPTION, ROLE IN DEEP
      */}
      <div
        ref={panelRef}
        id={`element-panel-${element.id}`}
        onClick={(e) => e.stopPropagation()}
        className="absolute pointer-events-auto w-[calc(100vw-32px)] sm:w-[440px] max-h-[85vh] overflow-y-auto bg-[#020b05]/95 border border-[#22c55e]/50 backdrop-blur-xl p-5 sm:p-6 shadow-[0_0_35px_rgba(34,197,94,0.22)] font-matrix-mono text-neutral-200 transition-transform duration-75 animate-matrix-pop-in will-change-transform"
        style={{
          left: `${targetPanelX}px`,
          top: `${targetPanelY + scrollFadeOffsetY}px`,
          opacity: scrollFadeOpacity,
        }}
      >
        {/* Cybernetic Corner Brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#86efac]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#86efac]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#86efac]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#86efac]" />

        {/* Header telemetry and close button */}
        <div className="flex items-start justify-between gap-3 border-b border-[#22c55e]/30 pb-3 mb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shadow-[0_0_6px_#4ade80]" />
              <span className="text-[10px] tracking-[0.25em] text-[#86efac] uppercase font-semibold">
                ELEMENT ID // {element.id}
              </span>
            </div>
            <span className="text-[9px] tracking-[0.18em] text-[#4ade80]/70 uppercase">
              {element.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[9px] tracking-[0.2em] font-semibold bg-[#22c55e]/15 border border-[#22c55e]/40 text-[#86efac] uppercase">
              TYPE: {element.type}
            </span>
            <button
              type="button"
              id="element-panel-close-btn"
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-[#4ade80]"
              aria-label="Close Element Information"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Element Name */}
        <h3 className="font-matrix-display text-lg sm:text-xl font-bold tracking-[0.15em] text-white uppercase mb-2">
          {element.name}
        </h3>

        {/* Formula / Symbol Display Box if available */}
        {element.formulaOrSymbol && (
          <div className="mb-4 p-3 bg-black/60 border border-[#22c55e]/35 rounded-none flex items-center justify-between">
            <span className="text-sm sm:text-base font-bold text-[#86efac] tracking-wide font-matrix-mono">
              {element.formulaOrSymbol}
            </span>
            <span className="text-[9px] tracking-widest text-[#4ade80]/60 uppercase">
              EXPRESSION
            </span>
          </div>
        )}

        {/* Section 1: MEANING */}
        <div className="mb-4">
          <div className="text-[10px] tracking-[0.22em] text-[#4ade80] uppercase mb-1 font-semibold flex items-center gap-1.5">
            <span className="text-neutral-500">▶</span>
            <span>THEORETICAL MEANING</span>
          </div>
          <p className="text-xs sm:text-[13px] leading-relaxed text-neutral-300">
            {element.meaning}
          </p>
        </div>

        {/* Section 2: DESCRIPTION (WHAT THE ELEMENT IS) */}
        <div className="mb-4">
          <div className="text-[10px] tracking-[0.22em] text-[#4ade80] uppercase mb-1 font-semibold flex items-center gap-1.5">
            <span className="text-neutral-500">▶</span>
            <span>DESCRIPTION</span>
          </div>
          <p className="text-xs sm:text-[13px] leading-relaxed text-neutral-300">
            {element.description}
          </p>
        </div>

        {/* Section 3: ROLE IN DEEP (WHY IT EXISTS / WHAT IT REPRESENTS IN DEEP) */}
        <div className="mb-4 p-3 bg-[#14532d]/20 border-l-2 border-[#4ade80]">
          <div className="text-[10px] tracking-[0.22em] text-[#86efac] uppercase mb-1 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-sm bg-[#4ade80]" />
            <span>ROLE IN DEEP SUBSTRATE</span>
          </div>
          <p className="text-xs sm:text-[13px] leading-relaxed text-neutral-200">
            {element.roleInDeep}
          </p>
        </div>

        {/* Footer controls & telemetry */}
        <div className="pt-3 border-t border-[#22c55e]/20 flex items-center justify-between text-[9px] tracking-[0.2em] text-neutral-400">
          <div className="flex items-center gap-2">
            <span>PRESS [ESC] TO DISMISS</span>
          </div>
          <div className="text-[#4ade80]/80">
            SUBSTRATE // LIVE_TELEMETRY
          </div>
        </div>
      </div>
    </div>
  );
}
