/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';

interface DeepEndFlashTransitionProps {
  /**
   * Scroll progress through Section 2 (DEEP // LAYER 02), from 0.0 to 1.0.
   */
  progress: number;
}

/**
 * DeepEndFlashTransition
 *
 * Implements the cinematic finale of Layer 2 (Section 2 // DEEP):
 * - Phase 1: Singularity Convergence & Ionization Surge (progress ~0.910 - 0.942)
 * - Phase 2: Blinding White Flash Eruption (progress ~0.942 - 0.975, peaking at ~0.960)
 * - Phase 3: Immediate Collapse into Complete Black Void (progress ~0.958 - 1.000)
 *
 * At progress >= 0.988 (and at 1.000), the viewport is 100% complete, impenetrable black void.
 * Reversible upon scrolling up: seamlessly unwinds from black back through the white flash.
 */

// Timing milestones in Layer 2 scroll progress
const TRANSITION_START = 0.910;  // Pre-flash quantum surge begins
const FLASH_BUILD = 0.942;       // White flash ignites rapidly
const FLASH_PEAK = 0.960;        // 100% Pure intense white flash
const FLASH_DECAY = 0.978;       // Flash decays back into the darkness
const BLACK_START = 0.958;       // Complete black curtain begins taking over
const BLACK_FULL = 0.986;        // Complete 100% solid pitch black void

export default function DeepEndFlashTransition({ progress }: DeepEndFlashTransitionProps) {
  // Pre-flash convergence glow
  const preFlashIntensity = useMemo(() => {
    if (progress < TRANSITION_START || progress > FLASH_BUILD) return 0;
    const t = (progress - TRANSITION_START) / (FLASH_BUILD - TRANSITION_START);
    return Math.pow(t, 2.0);
  }, [progress]);

  // Intense White Flash Calculation
  const flashIntensity = useMemo(() => {
    if (progress < FLASH_BUILD || progress > FLASH_DECAY) return 0;
    if (progress <= FLASH_PEAK) {
      // Searing ramp up to 100% pure white at FLASH_PEAK
      const t = (progress - FLASH_BUILD) / (FLASH_PEAK - FLASH_BUILD);
      return Math.pow(t, 2.4);
    } else {
      // Rapid collapse from white flash
      const t = (progress - FLASH_PEAK) / (FLASH_DECAY - FLASH_PEAK);
      return Math.pow(1 - t, 2.0);
    }
  }, [progress]);

  // Complete Black Void Transition Calculation
  const blackVoidOpacity = useMemo(() => {
    if (progress < BLACK_START) return 0;
    if (progress >= BLACK_FULL) return 1.0;
    const t = (progress - BLACK_START) / (BLACK_FULL - BLACK_START);
    return Math.pow(t, 1.25);
  }, [progress]);

  // If outside transition range, render nothing
  if (progress < TRANSITION_START) {
    return null;
  }

  const isPreFlashActive = preFlashIntensity > 0.005;
  const isFlashActive = flashIntensity > 0.005;
  const isBlackActive = blackVoidOpacity > 0.005;

  return (
    <div
      id="deep-end-flash-transition-system"
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-40 overflow-hidden"
    >
      {/* 
        1. Pre-Flash Singularity Convergence:
        Radial emerald-white ionization glow centering on the quantum singularity
      */}
      {isPreFlashActive && (
        <div
          id="deep-singularity-convergence-glow"
          className="absolute inset-0 w-full h-full transition-opacity duration-75"
          style={{
            opacity: preFlashIntensity,
            background:
              'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.95) 0%, rgba(134, 239, 172, 0.75) 22%, rgba(34, 197, 94, 0.45) 45%, rgba(0, 0, 0, 0) 75%)',
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* 
        2. Singularity Telemetry Pulse before Flash Eruption
      */}
      {isPreFlashActive && progress < FLASH_BUILD && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 font-matrix-mono text-center transition-opacity duration-75"
          style={{ opacity: preFlashIntensity * 0.9 }}
        >
          <span className="text-[10px] sm:text-xs tracking-[0.35em] text-[#86efac] uppercase font-bold drop-shadow-[0_0_10px_rgba(74,222,128,0.9)]">
            [ SINGULARITY COLLAPSE ]
          </span>
          <span className="text-[8px] sm:text-[9px] tracking-[0.25em] text-white/80 uppercase">
            MASS METRIC DEVIATION &gt; MAXIMUM
          </span>
        </div>
      )}

      {/* 
        3. Concentric High-Energy Shockwave Ring Expanding at Flash Ignition
      */}
      {isFlashActive && (
        <div
          id="deep-flash-shockwave-ring"
          className="absolute rounded-full border border-white/90 pointer-events-none transition-transform"
          style={{
            left: '50%',
            top: '50%',
            width: `${Math.round(flashIntensity * 1600)}px`,
            height: `${Math.round(flashIntensity * 1600)}px`,
            transform: 'translate(-50%, -50%)',
            opacity: flashIntensity,
            boxShadow: '0 0 50px #ffffff, inset 0 0 40px #86efac',
          }}
        />
      )}

      {/* 
        4. Central Photonic Flare Burst
      */}
      {isFlashActive && (
        <div
          id="deep-photonic-flare-burst"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            opacity: Math.min(1, flashIntensity * 1.2),
            background:
              'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 1) 0%, rgba(220, 252, 231, 0.9) 35%, rgba(134, 239, 172, 0.6) 65%, rgba(0, 0, 0, 0) 90%)',
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* 
        5. BLINDING WHITE FLASH (100% Full-Viewport Coverage):
        Fires intensely at FLASH_PEAK, completely washing over the screen
      */}
      {isFlashActive && (
        <div
          id="deep-white-flash-fullscreen"
          className="absolute inset-0 w-full h-full bg-white will-change-opacity pointer-events-none"
          style={{
            opacity: Math.min(1, flashIntensity * 1.15),
          }}
        />
      )}

      {/* 
        6. COMPLETE BLACK VOID TRANSITION:
        Engulfs the viewport from within and immediately following the white flash.
        At progress >= 0.986 (and through 1.000), reaches solid 100% opacity,
        ensuring Layer 2 ends in complete, impenetrable black void.
      */}
      {isBlackActive && (
        <div
          id="deep-complete-black-void-overlay"
          className="absolute inset-0 w-full h-full bg-[#000000] will-change-opacity pointer-events-none"
          style={{
            opacity: blackVoidOpacity,
          }}
        />
      )}

      {/* 
        7. Reverse Back Navigation Cue in Complete Black Void:
        Allows effortless reverse scrolling back up through the timeline
      */}
      {blackVoidOpacity >= 0.85 && (
        <div
          id="deep-black-void-reverse-cue"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex flex-col items-center gap-2 font-matrix-mono select-none transition-opacity duration-300"
          style={{ opacity: (blackVoidOpacity - 0.85) / 0.15 }}
        >
          <button
            type="button"
            id="deep-reverse-scroll-btn"
            onClick={() => {
              window.scrollBy({ top: -window.innerHeight * 1.5, behavior: 'smooth' });
            }}
            className="group px-4 py-2 bg-black/80 hover:bg-[#22c55e]/15 border border-[#22c55e]/40 hover:border-[#4ade80] rounded-sm text-[#86efac] text-[10px] tracking-[0.25em] uppercase transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] cursor-pointer flex items-center gap-2"
          >
            <span className="text-[#4ade80] group-hover:-translate-y-0.5 transition-transform">▲</span>
            <span>REVERSE BACK / SCROLL UP</span>
          </button>
          <span className="text-[9px] tracking-[0.2em] text-neutral-500 uppercase">
            END OF LAYER 02 // SUBSTRATE COMPLETE
          </span>
        </div>
      )}
    </div>
  );
}
