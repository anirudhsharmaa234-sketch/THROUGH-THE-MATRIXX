/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { CinematicInteractionConfig } from '../../types/cinematicTransition.ts';
import { calculateScreenAnchor } from '../../utils/cinematicCoordinates.ts';

export interface TouchToEnterInteractionProps {
  config: CinematicInteractionConfig;
  state: 'holding' | 'activating' | 'flashing';
  onActivate: () => void;
  activationProgress?: number; // 0 to 1 during activation sequence
  frameNumber?: number;
}

export default function TouchToEnterInteraction({
  config,
  state,
  onActivate,
  activationProgress = 0,
  frameNumber = 43,
}: TouchToEnterInteractionProps) {
  const [viewport, setViewport] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 720,
  });

  const [binaryGlow, setBinaryGlow] = useState<string>('01010101');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Update viewport measurements
  useEffect(() => {
    const handleResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate screen pixel anchor coordinates dynamically
  const screenAnchor = useMemo(() => {
    return calculateScreenAnchor(config.anchor, viewport.w, viewport.h);
  }, [config.anchor, viewport.w, viewport.h]);

  // Subtle live binary stream flicker around contact point
  useEffect(() => {
    if (state === 'flashing') return;
    const interval = setInterval(() => {
      const chars = ['0', '1'];
      let str = '';
      for (let i = 0; i < 8; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
      }
      setBinaryGlow(str);
    }, 110);
    return () => clearInterval(interval);
  }, [state]);

  const isActivating = state === 'activating';
  const isFlashing = state === 'flashing';

  // Compute card placement relative to contact point:
  // On desktop/widescreen: place to the right & slightly down where matrix background is open.
  // On mobile portrait: place slightly below or compact.
  const isMobile = viewport.w < 640;
  const offsetX = isMobile ? 0 : Math.min(140, Math.max(80, viewport.w * 0.08));
  const offsetY = isMobile ? 85 : 30;

  const cardLeft = isMobile
    ? Math.max(16, Math.min(viewport.w - 300, screenAnchor.x - 140))
    : Math.min(viewport.w - 340, screenAnchor.x + offsetX);

  const cardTop = isMobile
    ? Math.min(viewport.h - 180, screenAnchor.y + offsetY)
    : Math.max(70, Math.min(viewport.h - 220, screenAnchor.y - 40));

  // Connector line coordinates
  const p1X = screenAnchor.x;
  const p1Y = screenAnchor.y;
  const p2X = isMobile ? cardLeft + 140 : cardLeft;
  const p2Y = isMobile ? cardTop : cardTop + 45;
  const midX = isMobile ? p1X : p1X + (p2X - p1X) * 0.45;
  const midY = isMobile ? p1Y + (p2Y - p1Y) * 0.5 : p2Y;

  const handleTriggerClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (state === 'holding') {
      onActivate();
    }
  }, [state, onActivate]);

  if (isFlashing) return null;

  return (
    <div
      id="cinematic-touch-interaction-container"
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-40 transition-opacity duration-300"
      style={{
        opacity: isActivating ? Math.max(0, 1 - activationProgress * 2) : 1,
      }}
    >
      {/* 1. SVG Cybernetic Circuit Connector Line */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="connectorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#22c55e" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#15803d" stopOpacity="0.3" />
          </linearGradient>
          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer subtle glow path */}
        <path
          d={`M ${p1X} ${p1Y} L ${midX} ${midY} L ${p2X} ${p2Y}`}
          fill="none"
          stroke="#4ade80"
          strokeWidth={isHovered ? 2.5 : 1.5}
          strokeOpacity={0.4}
          filter="url(#glowEffect)"
          className="transition-all duration-200"
        />

        {/* Sharp core signal path */}
        <path
          d={`M ${p1X} ${p1Y} L ${midX} ${midY} L ${p2X} ${p2Y}`}
          fill="none"
          stroke="url(#connectorGrad)"
          strokeWidth={1}
          strokeDasharray="4 3"
        />

        {/* Angular circuit joint node */}
        <circle
          cx={midX}
          cy={midY}
          r={2.5}
          fill="#4ade80"
          className="animate-pulse"
        />
      </svg>

      {/* 2. Pinpoint Contact Reticle Anchored to Fingertip Contact Point */}
      <div
        id="contact-point-reticle"
        className="absolute pointer-events-auto cursor-pointer"
        style={{
          left: `${screenAnchor.x}px`,
          top: `${screenAnchor.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
        onClick={handleTriggerClick}
        onTouchStart={handleTriggerClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Touch here or click button to enter"
      >
        {/* Outer expanding radar ring */}
        <div
          className={`absolute inset-0 -m-6 rounded-full border border-[#4ade80]/40 transition-all duration-300 ${
            isHovered ? 'scale-125 border-[#86efac]' : 'animate-ping opacity-60'
          }`}
          style={{ animationDuration: '2.4s' }}
        />

        {/* Mid reticle with corner ticks */}
        <div
          className={`w-10 h-10 -m-5 relative rounded-full border border-[#22c55e]/70 flex items-center justify-center backdrop-blur-[1px] transition-transform duration-300 ${
            isHovered ? 'scale-110 border-[#86efac]' : ''
          }`}
        >
          {/* Top/Bottom crosshair ticks */}
          <div className="absolute top-0 w-0.5 h-1.5 bg-[#4ade80]" />
          <div className="absolute bottom-0 w-0.5 h-1.5 bg-[#4ade80]" />
          <div className="absolute left-0 h-0.5 w-1.5 bg-[#4ade80]" />
          <div className="absolute right-0 h-0.5 w-1.5 bg-[#4ade80]" />

          {/* Glowing central touch point */}
          <div
            className={`w-3 h-3 rounded-full bg-[#4ade80] shadow-[0_0_12px_#4ade80] transition-transform duration-200 ${
              isHovered ? 'scale-125 bg-white' : 'animate-pulse'
            }`}
          />
        </div>

        {/* 0101 Digital Code Reacting Directly at Fingertip */}
        <div
          className="absolute left-6 top-1 text-[10px] font-mono tracking-widest text-[#86efac] whitespace-nowrap bg-black/70 px-1.5 py-0.5 rounded border border-[#22c55e]/30 select-none shadow-[0_0_8px_rgba(34,197,94,0.3)]"
          style={{ transform: 'translateY(-50%)' }}
        >
          <span className="text-[#4ade80] font-bold">CODE//</span> {binaryGlow}
        </div>
      </div>

      {/* 3. Contextual "TOUCH TO ENTER" Interface Card */}
      <div
        id="touch-to-enter-card"
        className="absolute pointer-events-auto select-none"
        style={{
          left: `${cardLeft}px`,
          top: `${cardTop}px`,
          width: isMobile ? '280px' : '320px',
        }}
      >
        <div
          className={`relative p-3.5 bg-black/85 backdrop-blur-md rounded border transition-all duration-300 ${
            isHovered
              ? 'border-[#4ade80] shadow-[0_0_24px_rgba(74,222,128,0.35)] scale-[1.02]'
              : 'border-[#22c55e]/50 shadow-[0_0_16px_rgba(0,0,0,0.8)]'
          }`}
        >
          {/* Cybernetic HUD Corner Accents */}
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#4ade80]" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#4ade80]" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#4ade80]" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#4ade80]" />

          {/* Status Header Badge */}
          <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#22c55e]/25">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-ping" />
              <span className="text-[10px] font-mono tracking-widest text-[#86efac] uppercase font-bold">
                {config.statusBadge}
              </span>
            </div>
            <span className="text-[9px] font-mono text-[#4ade80]/70 tracking-tight">
              FRAME // {frameNumber}
            </span>
          </div>

          {/* Subtitle / Context Note */}
          <p className="text-[11px] font-mono text-neutral-300 tracking-wide mb-3 leading-tight">
            {config.subLabel || 'INITIALIZE SUBSTRATE INGRESS'}
          </p>

          {/* The Primary "TOUCH TO ENTER" Button */}
          <button
            id="touch-to-enter-button"
            type="button"
            onClick={handleTriggerClick}
            onTouchStart={handleTriggerClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={isActivating}
            className={`w-full group relative overflow-hidden py-2.5 px-4 rounded bg-[#0a1f0d] border font-mono text-xs tracking-widest uppercase font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              isActivating
                ? 'border-white bg-[#22c55e] text-black shadow-[0_0_20px_#ffffff]'
                : isHovered
                ? 'border-[#86efac] bg-[#14532d] text-white shadow-[0_0_16px_rgba(74,222,128,0.5)]'
                : 'border-[#22c55e] text-[#4ade80] hover:border-[#86efac]'
            }`}
          >
            {/* Animated Light Sweep Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

            <span className="text-[#86efac] font-mono text-[10px] opacity-80">▶</span>
            <span className="tracking-[0.2em]">
              {isActivating ? 'INGRESS INITIALIZED...' : config.actionLabel}
            </span>
            <span className="text-[#86efac] font-mono text-[10px] opacity-80">◀</span>
          </button>

          {/* Bottom Telemetry Stream */}
          <div className="mt-2.5 flex items-center justify-between text-[9px] font-mono text-neutral-400 tracking-widest border-t border-[#22c55e]/20 pt-1.5">
            <span className="text-neutral-500">ASCII//STREAM</span>
            <span className="text-[#4ade80]/90 font-mono tracking-tighter">
              {config.telemetryCode}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
