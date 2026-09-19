/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from 'react';

interface NetworkConvergenceFlashProps {
  /** Convergence pre-flash tension intensity (0.0 to 1.0) */
  convergenceIntensity: number;
  /** Signal timestamp or trigger counter to execute the cinematic flash */
  flashTriggerTimestamp: number;
}

/**
 * NetworkConvergenceFlash
 *
 * STEP 4 — FINAL NETWORK CONVERGENCE + CINEMATIC FLASH
 *
 * Visual Sequence:
 * 1. Pre-flash convergence: Green ambient atmospheric charge building as CENTRAL_ENTITY arrives.
 * 2. Flash execution:
 *    - GREEN ENERGY SURGE (0ms - 80ms): High-intensity emerald overload radiating outward.
 *    - WHITE CORE ERUPTION (80ms - 180ms): Intense pure white core bursts through.
 *    - WHITE + GREEN OVERLOAD (180ms - 260ms): Full-frame digital overload.
 *    - IMMEDIATE RETURN (260ms - 420ms): Swift cinematic decay back to 0.
 *
 * Constraints:
 * - NO black gap
 * - NO empty frame
 * - NO long white screen
 * - Viewport-filling on all aspect ratios (desktop and mobile)
 * - Immediate return to existing Network state
 */
export default function NetworkConvergenceFlash({
  convergenceIntensity,
  flashTriggerTimestamp,
}: NetworkConvergenceFlashProps) {
  // Flash animation progress (0.0 = idle, 0.01 -> 1.0 = playing)
  const [flashProgress, setFlashProgress] = useState<number>(0);
  const flashAnimRef = useRef<number | null>(null);
  const lastTriggerRef = useRef<number>(0);

  useEffect(() => {
    if (flashTriggerTimestamp <= 0 || flashTriggerTimestamp === lastTriggerRef.current) {
      return;
    }
    lastTriggerRef.current = flashTriggerTimestamp;

    if (flashAnimRef.current) {
      cancelAnimationFrame(flashAnimRef.current);
    }

    const duration = 440; // Total flash duration in milliseconds
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      setFlashProgress(progress);

      if (progress < 1) {
        flashAnimRef.current = requestAnimationFrame(step);
      } else {
        setFlashProgress(0);
      }
    };

    flashAnimRef.current = requestAnimationFrame(step);

    return () => {
      if (flashAnimRef.current) {
        cancelAnimationFrame(flashAnimRef.current);
      }
    };
  }, [flashTriggerTimestamp]);

  // Compute layered opacity values during the flash
  // Phase 1 (0 to 0.22): Rise of emerald energy
  // Phase 2 (0.22 to 0.50): White core apex
  // Phase 3 (0.50 to 1.0): Rapid exponential decay back to baseline
  let greenEnergyOpacity = 0;
  let whiteCoreOpacity = 0;
  let scanlineOpacity = 0;

  if (flashProgress > 0) {
    if (flashProgress < 0.22) {
      // Rapid ascent of emerald & white
      const t = flashProgress / 0.22;
      greenEnergyOpacity = Math.sin(t * (Math.PI / 2)) * 0.95;
      whiteCoreOpacity = Math.pow(t, 2) * 0.9;
      scanlineOpacity = t * 0.4;
    } else if (flashProgress < 0.5) {
      // Full blinding peak
      const t = (flashProgress - 0.22) / 0.28;
      greenEnergyOpacity = 0.95 - t * 0.15;
      whiteCoreOpacity = 1.0 - t * 0.2;
      scanlineOpacity = 0.4;
    } else {
      // Rapid decay to existing network
      const t = (flashProgress - 0.5) / 0.5;
      const decay = Math.pow(1 - t, 2.2);
      greenEnergyOpacity = 0.8 * decay;
      whiteCoreOpacity = 0.8 * decay;
      scanlineOpacity = 0.3 * decay;
    }
  }

  // Pre-flash atmospheric green tension
  const preFlashGreenOpacity = convergenceIntensity > 0 && flashProgress === 0
    ? Math.pow(convergenceIntensity, 1.8) * 0.32
    : 0;

  const totalGreenOpacity = Math.min(1, preFlashGreenOpacity + greenEnergyOpacity);

  if (totalGreenOpacity <= 0.001 && whiteCoreOpacity <= 0.001) {
    return null;
  }

  return (
    <div
      id="network-convergence-flash-viewport"
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-50 overflow-hidden"
    >
      {/* -------------------------------------------------------------------- */}
      {/* LAYER 1: AMBIENT EMERALD ENERGY FIELD (VIGNETTE & PERIMETER SURGE)   */}
      {/* -------------------------------------------------------------------- */}
      <div
        className="absolute inset-0 w-full h-full will-change-opacity"
        style={{
          opacity: totalGreenOpacity,
          background:
            'radial-gradient(ellipse at center, rgba(134, 239, 172, 0.4) 0%, rgba(34, 197, 94, 0.75) 45%, rgba(21, 128, 61, 0.85) 80%, rgba(5, 46, 22, 0.95) 100%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* -------------------------------------------------------------------- */}
      {/* LAYER 2: BLINDING WHITE CORE FLASH                                   */}
      {/* -------------------------------------------------------------------- */}
      {whiteCoreOpacity > 0.001 && (
        <div
          className="absolute inset-0 w-full h-full will-change-opacity bg-white"
          style={{
            opacity: whiteCoreOpacity,
            mixBlendMode: 'plus-lighter',
          }}
        />
      )}

      {/* -------------------------------------------------------------------- */}
      {/* LAYER 3: DIGITAL MATRIX RETICULAR INTERFERENCE (SUBTLE MICRO-GRID)   */}
      {/* -------------------------------------------------------------------- */}
      {scanlineOpacity > 0.001 && (
        <div
          className="absolute inset-0 w-full h-full will-change-opacity opacity-25"
          style={{
            opacity: scanlineOpacity,
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 222, 128, 0.15) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </div>
  );
}
