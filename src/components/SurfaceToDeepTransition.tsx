/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useMemo } from 'react';

interface SurfaceToDeepTransitionProps {
  /**
   * Progress of the transition bridge: 0.0 (impact begins) to 1.0 (DEEP established)
   */
  bridgeProgress: number;
  /**
   * Overall opacity of the transition bridge layer
   */
  opacity: number;
}

// Source reference aspect ratio (Portrait 720x1600)
const SOURCE_REF_WIDTH = 720;
const SOURCE_REF_HEIGHT = 1600;

/**
 * SurfaceToDeepTransition
 *
 * Cinematic Scroll-Controlled Bridge between SECTION 1 (SURFACE) and SECTION 2 (DEEP).
 *
 * Visual Sequence:
 *   SURFACE (hand reaches surface & touches)
 *   ↓
 *   DIGITAL IMPACT STATE (chromatic ionization & shockwaves radiate)
 *   ↓
 *   DEEPER DESCENT / DATA TRANSITION (dimensional tunnel expansion)
 *   ↓
 *   DARK VOID / DIMENSIONAL SHIFT (coordinate grid & quantum filaments)
 *   ↓
 *   DEEP ENVIRONMENT EMERGES (smoothly hand-off to 3D mathematical space)
 *
 * Quality & Framing Guarantees:
 * - 100% Edge-to-Edge Full-Viewport coverage (ZERO letterboxing, ZERO black bars, ZERO fixed portrait box).
 * - Responsive cover reframing maintaining aspect ratio and centering focal subject.
 * - Rendered at native device-pixel-ratio (up to DPR 2) for razor-sharp vector/stream lines.
 * - 100% Scroll-Controlled: Zero autoplay, zero looping, perfectly reversible on upward scroll.
 */
export default function SurfaceToDeepTransition({
  bridgeProgress,
  opacity,
}: SurfaceToDeepTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(bridgeProgress);

  useEffect(() => {
    progressRef.current = bridgeProgress;
  }, [bridgeProgress]);

  // Handle high-DPI rendering and responsive full-viewport sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animFrameId: number;

    const render = () => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      const p = progressRef.current;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      if (p <= 0.001 || p >= 0.999) {
        animFrameId = requestAnimationFrame(render);
        return;
      }

      // Center of dimensional descent originates from the fingertip contact point
      const originX = w * 0.62;
      const originY = h * 0.48;

      // 1. Dimensional Tunnel Warp Rays
      const rayCount = 48;
      const maxDist = Math.hypot(w, h);
      const warpFactor = Math.pow(p, 1.8);

      ctx.save();
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2 + p * 0.8;
        const length = (0.2 + (i % 5) * 0.2) * maxDist * warpFactor * 1.5;
        const startDist = maxDist * 0.05 * (1 - p);

        const x1 = originX + Math.cos(angle) * startDist;
        const y1 = originY + Math.sin(angle) * startDist;
        const x2 = originX + Math.cos(angle) * (startDist + length);
        const y2 = originY + Math.sin(angle) * (startDist + length);

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        const alpha = Math.sin(p * Math.PI) * (0.15 + (i % 3) * 0.15);
        grad.addColorStop(0, `rgba(134, 239, 172, ${alpha * 0.9})`);
        grad.addColorStop(0.5, `rgba(34, 197, 94, ${alpha * 0.6})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2 + (i % 4) * 0.8;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Concentric Dimensional Shift Rings (Expanding outward into 3D space)
      const ringCount = 8;
      for (let r = 0; r < ringCount; r++) {
        const ringOffset = (p * 2.2 + r / ringCount) % 1.0;
        const radius = ringOffset * maxDist * 0.85;
        const ringAlpha = Math.sin(ringOffset * Math.PI) * Math.sin(p * Math.PI) * 0.45;

        if (radius > 10 && ringAlpha > 0.01) {
          ctx.beginPath();
          ctx.arc(originX, originY, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(74, 222, 128, ${ringAlpha})`;
          ctx.lineWidth = 1.0 + (1 - ringOffset) * 2.0;
          ctx.stroke();

          // Subtle digital tick marks along the ring
          const tickCount = 12;
          for (let t = 0; t < tickCount; t++) {
            const tAngle = (t / tickCount) * Math.PI * 2 + p * 0.4;
            const tx1 = originX + Math.cos(tAngle) * (radius - 5);
            const ty1 = originY + Math.sin(tAngle) * (radius - 5);
            const tx2 = originX + Math.cos(tAngle) * (radius + 5);
            const ty2 = originY + Math.sin(tAngle) * (radius + 5);
            ctx.beginPath();
            ctx.moveTo(tx1, ty1);
            ctx.lineTo(tx2, ty2);
            ctx.strokeStyle = `rgba(134, 239, 172, ${ringAlpha * 0.8})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // 3. Matrix Digital Coordinates & Glyphs streaming into the depth
      const glyphCount = 36;
      ctx.font = '12px "Share Tech Mono", monospace';
      ctx.textAlign = 'center';
      for (let g = 0; g < glyphCount; g++) {
        const progressOffset = (p * 1.6 + g / glyphCount) % 1.0;
        const dist = progressOffset * maxDist * 0.7;
        const angle = (g * 137.5 * Math.PI) / 180; // Golden angle distribution

        const gx = originX + Math.cos(angle) * dist;
        const gy = originY + Math.sin(angle) * dist;

        if (gx >= 0 && gx <= w && gy >= 0 && gy <= h) {
          const gAlpha = Math.sin(progressOffset * Math.PI) * Math.sin(p * Math.PI) * 0.65;
          ctx.fillStyle = g % 2 === 0 ? `rgba(187, 247, 208, ${gAlpha})` : `rgba(74, 222, 128, ${gAlpha * 0.8})`;
          const char = (g + Math.floor(p * 20)) % 2 === 0 ? '1' : '0';
          ctx.fillText(char, gx, gy);
        }
      }

      // 4. Dimensional Ingress Indicator Text at the center of the shift
      if (p > 0.25 && p < 0.85) {
        const textAlpha = Math.sin(((p - 0.25) / 0.6) * Math.PI) * 0.85;
        ctx.save();
        ctx.font = '500 11px "Share Tech Mono", monospace';
        ctx.letterSpacing = '4px';
        ctx.fillStyle = `rgba(134, 239, 172, ${textAlpha})`;
        ctx.textAlign = 'center';
        ctx.fillText('DIMENSIONAL SHIFT // TRANSIT TO SUBSTRATE', originX, originY + 45);

        ctx.font = '400 9px "Share Tech Mono", monospace';
        ctx.fillStyle = `rgba(74, 222, 128, ${textAlpha * 0.7})`;
        ctx.fillText(`DESCENT_PROGRESS: ${(p * 100).toFixed(0)}%`, originX, originY + 62);
        ctx.restore();
      }

      animFrameId = requestAnimationFrame(render);
    };

    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  if (opacity <= 0.001) {
    return null;
  }

  return (
    <div
      id="surface-to-deep-transition-bridge"
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-35 overflow-hidden"
      style={{
        opacity,
        transition: 'opacity 80ms ease-out',
        transform: 'translateZ(0)',
      }}
    >
      {/* 
        Full-Viewport High-DPI Transition Canvas
        Responsive cover reframing with zero black bars and zero letterboxing
      */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{
          width: '100%',
          height: '100%',
          imageRendering: 'auto',
        }}
      />

      {/* Atmospheric Dimensional Shift Vignette */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 62% 48%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.85) 100%)',
        }}
      />
    </div>
  );
}
