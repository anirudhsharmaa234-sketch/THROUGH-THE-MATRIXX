/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, ChevronsDown } from 'lucide-react';

interface AutoScrollButtonProps {
  /** Optional container ref to calculate max scroll boundary */
  containerRef?: React.RefObject<HTMLElement | null>;
}

export default function AutoScrollButton({ containerRef }: AutoScrollButtonProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.4); // Pixels per 16.67ms (60fps normalized)
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isAtEnd, setIsAtEnd] = useState<boolean>(false);

  const isPlayingRef = useRef<boolean>(false);
  const speedRef = useRef<number>(1.4);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isUserScrollingRef = useRef<boolean>(false);
  const userScrollTimeoutRef = useRef<number | null>(null);

  // Sync state to refs for high-frequency rAF loop
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Stop auto-scroll handler
  const stopAutoScroll = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Main animation frame scroll loop (smooth, frame-rate independent)
  const scrollStep = useCallback(
    (currentTime: number) => {
      if (!isPlayingRef.current) return;

      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }
      const deltaTime = Math.min(100, currentTime - lastTimeRef.current);
      lastTimeRef.current = currentTime;

      const container = containerRef?.current;
      const maxScroll = container
        ? container.offsetHeight - window.innerHeight
        : document.documentElement.scrollHeight - window.innerHeight;

      const currentScroll = window.scrollY;

      // Check if we've reached or passed the bottom
      if (currentScroll >= maxScroll - 3) {
        setIsAtEnd(true);
        stopAutoScroll();
        return;
      }

      // Delta-time scaled movement (normalized to 60 FPS / 16.67ms)
      const moveDistance = speedRef.current * (deltaTime / 16.67) * 1.5;
      const nextScroll = Math.min(maxScroll, currentScroll + moveDistance);

      window.scrollTo(0, nextScroll);

      if (isPlayingRef.current) {
        animationFrameRef.current = requestAnimationFrame(scrollStep);
      }
    },
    [containerRef, stopAutoScroll]
  );

  // Start auto-scroll handler
  const startAutoScroll = useCallback(() => {
    const container = containerRef?.current;
    const maxScroll = container
      ? container.offsetHeight - window.innerHeight
      : document.documentElement.scrollHeight - window.innerHeight;

    // If already at end, restart from beginning
    if (window.scrollY >= maxScroll - 10) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsAtEnd(false);
      setTimeout(() => {
        setIsPlaying(true);
        isPlayingRef.current = true;
        lastTimeRef.current = 0;
        animationFrameRef.current = requestAnimationFrame(scrollStep);
      }, 400);
      return;
    }

    setIsAtEnd(false);
    setIsPlaying(true);
    isPlayingRef.current = true;
    lastTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(scrollStep);
  }, [containerRef, scrollStep]);

  // Toggle play/pause
  const toggleAutoScroll = () => {
    if (isPlaying) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
  };

  // Pause if user deliberately initiates manual wheel or touch interaction
  useEffect(() => {
    const handleUserManualInput = (e: Event) => {
      // If auto-scrolling is active and user rolls wheel or touches, pause gracefully
      if (isPlayingRef.current) {
        // Debounce to prevent stopping from programmatic scrollTo
        if (e.type === 'wheel' || e.type === 'touchmove') {
          stopAutoScroll();
        }
      }
    };

    window.addEventListener('wheel', handleUserManualInput, { passive: true });
    window.addEventListener('touchmove', handleUserManualInput, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleUserManualInput);
      window.removeEventListener('touchmove', handleUserManualInput);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [stopAutoScroll]);

  return (
    <div
      id="side-auto-scroll-dock"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed left-2 sm:left-3 top-1/2 -translate-y-1/2 z-40 flex items-center select-none font-matrix-mono group pointer-events-auto"
      aria-label="Auto Scroll Controls"
    >
      {/* 
        Micro Cybernetic Side Button:
        - "Very small button very rarely visible":
        - Default opacity-20 (ultra-faint ghost footprint against the black matrix void)
        - Hover or active transitions smoothly to full clarity
      */}
      <button
        type="button"
        id="side-auto-scroll-button"
        onClick={toggleAutoScroll}
        aria-label={isPlaying ? 'Pause Auto Scroll' : 'Start Auto Scroll'}
        className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xs transition-all duration-300 backdrop-blur-xs cursor-pointer border ${
          isPlaying
            ? 'opacity-85 bg-black/85 border-[#22c55e] text-[#4ade80] shadow-[0_0_12px_rgba(34,197,94,0.4)] animate-pulse'
            : isHovered
            ? 'opacity-100 bg-black/80 border-[#22c55e]/60 text-[#86efac] shadow-[0_0_10px_rgba(34,197,94,0.25)]'
            : 'opacity-20 hover:opacity-100 bg-black/40 border-neutral-800 text-neutral-500 hover:text-[#86efac] hover:border-[#22c55e]/40'
        }`}
        title={isPlaying ? 'Pause cinematic auto-scroll' : 'Start cinematic auto-scroll'}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
        ) : isAtEnd ? (
          <ChevronsDown className="w-3.5 h-3.5 transition-transform group-hover:scale-110 rotate-180" />
        ) : (
          <Play className="w-3.5 h-3.5 ml-0.5 transition-transform group-hover:scale-110 fill-current" />
        )}
      </button>

      {/* 
        Ultra-sleek Expandable HUD Pill:
        Revealed when hovered or when active, showing status and speed adjustment
      */}
      <div
        className={`ml-2 flex items-center gap-1.5 p-1 bg-black/90 border border-[#22c55e]/30 rounded-xs backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-all duration-200 pointer-events-auto ${
          isHovered
            ? 'opacity-100 translate-x-0 scale-100'
            : 'opacity-0 -translate-x-2 scale-95 pointer-events-none absolute left-8'
        }`}
      >
        <span className="px-1.5 text-[8px] sm:text-[9px] tracking-[0.2em] font-bold text-[#86efac] border-r border-[#22c55e]/25">
          {isPlaying ? 'AUTO: RUN' : isAtEnd ? 'END' : 'AUTO'}
        </span>

        {/* Speed Adjustment Buttons */}
        <div className="flex items-center gap-0.5">
          {[
            { label: '1x', val: 1.2 },
            { label: '1.8x', val: 2.2 },
            { label: '2.5x', val: 3.2 },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              id={`auto-scroll-speed-${item.label}`}
              onClick={(e) => {
                e.stopPropagation();
                setSpeed(item.val);
              }}
              className={`px-1.5 py-0.5 text-[8px] sm:text-[9px] tracking-[0.1em] rounded-2xs transition-colors cursor-pointer ${
                speed === item.val
                  ? 'bg-[#22c55e]/30 text-[#86efac] font-bold border border-[#4ade80]/50'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
