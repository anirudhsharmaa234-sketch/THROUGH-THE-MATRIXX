/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { UniversalAboutData } from '../../data/universalAboutRegistry.ts';

interface UniversalAboutCardProps {
  data: UniversalAboutData;
  anchorPos?: { x: number; y: number } | null;
  onClose: () => void;
}

export default function UniversalAboutCard({
  data,
  anchorPos,
  onClose,
}: UniversalAboutCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // 0101 Decode scramble state
  const [scrambleProgress, setScrambleProgress] = useState<number>(0);
  const [scrambledTitle, setScrambledTitle] = useState<string>('');

  // Scroll-driven fade down state: as the user scrolls, smoothly fades out and moves downward
  const [scrollOpacity, setScrollOpacity] = useState<number>(1);
  const [scrollOffsetY, setScrollOffsetY] = useState<number>(0);
  const initialScrollYRef = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // 1. Live 0101 Bitstream Decode Scramble Effect on First Touch / Reveal
  useEffect(() => {
    setScrambleProgress(0);
    const chars = '0101011001010101110010101010010101101010101010110101';
    let frame = 0;
    const targetTitle = data.title;

    const interval = setInterval(() => {
      frame++;
      const progress = Math.min(1, frame / 7);
      setScrambleProgress(progress);

      const resolvedLen = Math.floor(progress * targetTitle.length);
      let text = targetTitle.slice(0, resolvedLen);
      for (let i = resolvedLen; i < targetTitle.length; i++) {
        text += chars[Math.floor(Math.random() * chars.length)];
      }
      setScrambledTitle(text);

      if (frame >= 7) {
        clearInterval(interval);
        setScrambledTitle(targetTitle);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [data.id, data.title]);

  // 2. Continuous Scroll Detection: Fades down smoothly and automatically dismisses on scroll
  useEffect(() => {
    initialScrollYRef.current = window.scrollY;
    setScrollOpacity(1);
    setScrollOffsetY(0);

    const handleWindowScroll = () => {
      const currentScroll = window.scrollY;
      const delta = Math.abs(currentScroll - initialScrollYRef.current);
      const fadeDistance = 45; // Fades out completely over 45px of scroll

      if (delta <= 0) {
        setScrollOpacity(1);
        setScrollOffsetY(0);
      } else if (delta < fadeDistance) {
        const ratio = 1 - delta / fadeDistance;
        setScrollOpacity(ratio);
        setScrollOffsetY((1 - ratio) * 22); // Slides gently down 22px as it dissolves
      } else {
        setScrollOpacity(0);
        setScrollOffsetY(22);
        onCloseRef.current();
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [data.id]);

  // 3. Dismiss on Escape Key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Compute smart viewport positioning (near anchor or comfortable center/top offset)
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 720;
  const isMobile = vw < 640;

  let posX = 20;
  let posY = 80;

  if (anchorPos) {
    if (isMobile) {
      posX = Math.max(12, (vw - 340) / 2);
      posY = Math.max(70, Math.min(vh - 360, anchorPos.y > vh * 0.5 ? anchorPos.y - 320 : anchorPos.y + 40));
    } else {
      if (anchorPos.x > vw * 0.5) {
        posX = Math.max(30, anchorPos.x - 380);
      } else {
        posX = Math.min(vw - 380, anchorPos.x + 40);
      }
      posY = Math.max(80, Math.min(vh - 360, anchorPos.y - 80));
    }
  } else {
    // Default comfortable placement
    posX = isMobile ? Math.max(12, (vw - 340) / 2) : Math.max(32, vw * 0.5 - 180);
    posY = isMobile ? 84 : 110;
  }

  return (
    <div
      id={`universal-about-overlay-${data.id}`}
      className="fixed inset-0 z-50 pointer-events-none select-none overflow-hidden"
      aria-label={`About ${data.title}`}
    >
      {/* 
        Full-Screen Outside Touch / Click Backdrop:
        Touching anywhere outside immediately dismisses the card
      */}
      <div
        id="universal-about-backdrop"
        onClick={onClose}
        onTouchStart={onClose}
        className="absolute inset-0 w-full h-full pointer-events-auto bg-black/35 backdrop-blur-[1.5px] cursor-pointer"
        aria-hidden="true"
      />

      {/* 
        Cybernetic Information Card with Entrance Animation & Scroll Fade-Down
      */}
      <div
        ref={cardRef}
        id={`universal-about-card-${data.id}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: `translate3d(${posX}px, ${posY + scrollOffsetY}px, 0)`,
          opacity: scrollOpacity,
        }}
        className="absolute pointer-events-auto w-[calc(100vw-32px)] sm:w-[360px] md:w-[380px] bg-[#020b05]/95 border border-[#22c55e]/50 backdrop-blur-xl p-4 sm:p-5 shadow-[0_0_35px_rgba(34,197,94,0.25),0_10px_30px_rgba(0,0,0,0.8)] font-matrix-mono text-neutral-200 transition-transform duration-75 animate-matrix-pop-in will-change-transform"
      >
        {/* Cybernetic Corner Brackets */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#86efac]" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#86efac]" />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#86efac]" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#86efac]" />

        {/* Header Telemetry Strip & Quick Close */}
        <div className="flex items-start justify-between gap-3 border-b border-[#22c55e]/30 pb-2.5 mb-3">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80] animate-pulse shrink-0" />
              <span className="text-[10px] tracking-[0.22em] text-[#86efac] uppercase font-bold truncate">
                {data.code}
              </span>
              <span className="text-white/30 text-[9px]">•</span>
              <span className="text-[8.5px] tracking-[0.15em] text-[#4ade80]/90 uppercase font-mono truncate">
                {data.status}
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] tracking-[0.16em] text-neutral-400 uppercase truncate">
              {data.category}
            </span>
          </div>

          <button
            type="button"
            id="universal-about-close-btn"
            onClick={onClose}
            className="px-2 py-0.5 text-[10px] tracking-[0.18em] uppercase font-semibold text-neutral-400 hover:text-white bg-white/5 hover:bg-[#22c55e]/20 border border-[#22c55e]/40 rounded-sm transition-colors cursor-pointer shrink-0"
            aria-label="Close Information"
            title="Close (or simply scroll down to dismiss)"
          >
            [×]
          </button>
        </div>

        {/* Decoded Title with Dynamic Scramble */}
        <div className="mb-2.5">
          <h3 className="font-matrix-display text-sm sm:text-[15px] font-bold tracking-[0.15em] text-white uppercase leading-snug">
            {scrambleProgress < 1 ? scrambledTitle : data.title}
          </h3>
        </div>

        {/* High-Level Summary Statement */}
        <div className="mb-3 p-2.5 bg-black/60 border-l-2 border-[#4ade80] text-[11px] sm:text-xs leading-relaxed text-neutral-200">
          {data.summary}
        </div>

        {/* Comprehensive Description */}
        <div className="mb-3 text-[10.5px] sm:text-[11.5px] leading-relaxed text-neutral-300 font-sans font-normal border-t border-[#22c55e]/15 pt-2">
          {data.description}
        </div>

        {/* Telemetry Metrics Grid */}
        {data.metrics && data.metrics.length > 0 && (
          <div className="border-t border-[#22c55e]/25 pt-2.5">
            <div className="text-[8px] uppercase tracking-[0.22em] text-neutral-400 mb-1.5 font-bold">
              // TELEMETRY & SPECIFICATIONS
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[9px] sm:text-[9.5px]">
              {data.metrics.map((m, idx) => (
                <div
                  key={`metric-${idx}`}
                  className="bg-black/50 border border-[#22c55e]/20 px-2 py-1 flex flex-col justify-center"
                >
                  <span className="text-[7.5px] tracking-[0.14em] text-neutral-400 uppercase">
                    {m.label}
                  </span>
                  <span className="text-[#86efac] font-medium tracking-[0.06em] truncate mt-0.5">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-bar scroll dismiss hint */}
        <div className="mt-3 pt-1.5 border-t border-white/5 flex items-center justify-between text-[8px] tracking-[0.16em] text-neutral-500 uppercase">
          <span>TOUCH OUTSIDE OR SCROLL DOWN TO DISMISS</span>
          <span className="text-[#4ade80]/60">ESC</span>
        </div>
      </div>
    </div>
  );
}
