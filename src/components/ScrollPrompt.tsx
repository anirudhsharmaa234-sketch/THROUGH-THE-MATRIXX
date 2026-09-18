/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChevronDown } from 'lucide-react';

interface ScrollPromptProps {
  progress: number;
  onPromptClick: () => void;
}

export default function ScrollPrompt({ progress, onPromptClick }: ScrollPromptProps) {
  // Fades out immediately upon scrolling (progress 0.00 -> 0.03)
  const opacity = Math.max(0, 1 - progress / 0.035);
  const translateY = (1 - opacity) * 16;

  if (opacity <= 0.005) return null;

  return (
    <div
      id="hero-scroll-prompt"
      onClick={onPromptClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPromptClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Scroll to enter experience"
      style={{
        opacity,
        transform: `translate3d(-50%, ${translateY}px, 0)`,
        pointerEvents: opacity > 0.4 ? 'auto' : 'none',
      }}
      className="fixed bottom-7 sm:bottom-9 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 font-matrix-mono text-[9px] sm:text-[10px] tracking-[0.32em] uppercase text-[#86efac]/80 hover:text-[#86efac] transition-colors cursor-pointer select-none group focus:outline-none"
    >
      <span className="group-hover:tracking-[0.36em] transition-all duration-300">
        SCROLL TO ENTER
      </span>
      <ChevronDown className="w-3.5 h-3.5 text-[#4ade80]/70 group-hover:text-[#4ade80] animate-bounce" />
    </div>
  );
}
