/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';

interface DigitalImpactFlashProps {
  scrollProgress: number;
  suppressVoid?: boolean;
  flashOverrideIntensity?: number;
}

/**
 * DigitalImpactFlash
 *
 * Handles the climax sequence when the person's fingertip reaches the digital surface:
 * PERSON APPROACHES
 * → HAND REACHES THE DIGITAL SURFACE
 * → FINGERTIP MAKES CONTACT (around scrollProgress ~0.73-0.75, Seq2 frame 43-44)
 * → DIGITAL IMPACT / SYSTEM ACTIVATION
 * → VERY BRIEF INTENSE WHITE FLASH (100% fills viewport)
 * → IMMEDIATELY COLLAPSE / FADE BACK TO BLACK (zero black gap, zero lingering white)
 * → BLACK DIGITAL VOID / NEXT TRANSITION STATE (around scrollProgress ~0.94-1.00)
 */

// Timing boundaries in scrollProgress
const TOUCH_START = 0.725;     // Fingertip nears surface
const TOUCH_PEAK = 0.742;      // Exact fingertip contact moment
const TOUCH_DECAY = 0.768;     // Flash immediately collapses back into the matrix/canvas

// End-of-sequence void transition (frames 74-80)
const VOID_START = 0.935;
const VOID_END = 0.975;

export default function DigitalImpactFlash({
  scrollProgress,
  suppressVoid = false,
  flashOverrideIntensity,
}: DigitalImpactFlashProps) {
  // 1. Calculate White Flash Intensity
  const flashIntensity = useMemo(() => {
    let base = 0;
    if (scrollProgress >= TOUCH_START && scrollProgress <= TOUCH_DECAY) {
      if (scrollProgress <= TOUCH_PEAK) {
        // Razor-sharp build up to 100% pure white at the exact moment of fingertip contact
        const t = (scrollProgress - TOUCH_START) / (TOUCH_PEAK - TOUCH_START);
        base = Math.pow(t, 2.5);
      } else {
        // Immediate collapse - falls from 100% to 0% back to black/matrix
        const t = (scrollProgress - TOUCH_PEAK) / (TOUCH_DECAY - TOUCH_PEAK);
        base = Math.pow(1 - t, 2.0);
      }
    }
    if (flashOverrideIntensity !== undefined) {
      return Math.max(base, Math.min(1, flashOverrideIntensity));
    }
    return base;
  }, [scrollProgress, flashOverrideIntensity]);

  // 2. Shockwave Ripple Intensity at the contact point (normalized center-right in viewport)
  const isFlashActive = flashIntensity > 0.001;

  // 3. Final Void Transition (collapses to pitch black without gaps)
  const voidAlpha = useMemo(() => {
    if (suppressVoid || scrollProgress < VOID_START) return 0;
    const t = Math.min(1, (scrollProgress - VOID_START) / (VOID_END - VOID_START));
    return t;
  }, [scrollProgress, suppressVoid]);

  if (!isFlashActive && voidAlpha <= 0.001) {
    return null;
  }

  return (
    <div
      id="digital-surface-impact-system"
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-40 overflow-hidden"
      aria-hidden="true"
    >
      {/* 
        1. Radial Chromatic Ionization Glow centered on the fingertip impact coordinates
      */}
      {isFlashActive && (
        <div
          className="absolute inset-0 w-full h-full transition-opacity duration-75"
          style={{
            opacity: flashIntensity,
            background:
              'radial-gradient(circle at 62% 48%, rgba(255,255,255,1) 0%, rgba(134,239,172,0.95) 25%, rgba(34,197,94,0.6) 55%, rgba(0,0,0,0) 85%)',
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* 
        2. Concentric Shockwave Ring on Impact
      */}
      {isFlashActive && (
        <div
          className="absolute rounded-full border-2 border-white pointer-events-none transition-transform"
          style={{
            left: '62%',
            top: '48%',
            width: `${Math.round(flashIntensity * 1200)}px`,
            height: `${Math.round(flashIntensity * 1200)}px`,
            transform: 'translate(-50%, -50%)',
            opacity: flashIntensity * 0.9,
            boxShadow: '0 0 40px #ffffff, inset 0 0 30px #4ade80',
          }}
        />
      )}

      {/* 
        3. VERY BRIEF INTENSE WHITE FLASH:
        Completely fills the viewport edge-to-edge at TOUCH_PEAK,
        then immediately collapses back to black.
      */}
      {isFlashActive && (
        <div
          id="digital-white-flash-fullscreen"
          className="absolute inset-0 w-full h-full bg-white will-change-opacity"
          style={{
            opacity: Math.min(1, flashIntensity * 1.15),
          }}
        />
      )}

      {/* 
        4. Digital Void Phase at the conclusion of Section 1:
        Ensures a seamless transition directly into black digital void without any flash or gaps
      */}
      {voidAlpha > 0.001 && (
        <div
          id="digital-void-transition-overlay"
          className="absolute inset-0 w-full h-full bg-[#000000]"
          style={{
            opacity: voidAlpha,
          }}
        />
      )}
    </div>
  );
}
