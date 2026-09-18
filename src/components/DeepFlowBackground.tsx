/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

interface DeepFlowBackgroundProps {
  scrollProgress: number; // 0.0 to 1.0 within Section 2 DEEP
}

const DEEP_VIDEO_SRC = '/videos/deep_flow_bg.mp4';

/**
 * DeepFlowBackground
 *
 * Cinematic environmental background video layer for SECTION 2 — DEEP,
 * sourced directly from the provided Google Flow generation.
 *
 * Strict Architectural Guarantees:
 * 1. Intentional Black Opening:
 *    - At scrollProgress < 0.05, opacity is 0.0 (pure black).
 *    - As user scrolls (0.05 -> 0.25), video subtly emerges from the black void.
 *    - Participates directly in the scroll sequence rather than an unlinked autoplaying movie.
 * 2. Background Layer Integration:
 *    - Sits behind the 3D mathematical space (Tesseract, equations, neural filaments) and typography.
 *    - Incorporates a balanced dark atmospheric vignette so data elements and formulas pop with high contrast.
 * 3. Full-Viewport Edge-to-Edge Framing:
 *    - Uses object-fit: cover with object-position: center center across mobile, tablet, laptop, and ultrawide.
 *    - Zero letterboxing, zero black bars from sizing, zero distortion, zero artificial margins.
 * 4. Dual-Buffer Zero-Flash Looping:
 *    - Dual video element cycling eliminates any hardware loop-reset pause or black glitch frame.
 * 5. High-Resolution Sharpness:
 *    - Native 720p H.264 stream with faststart streaming headers, rendered at native DPR with hardware acceleration.
 */
export default function DeepFlowBackground({ scrollProgress }: DeepFlowBackgroundProps) {
  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);
  const [activeBuffer, setActiveBuffer] = useState<'A' | 'B'>('A');
  const [isLoaded, setIsLoaded] = useState(false);

  // Switch buffer seamlessly right before loop end to eliminate any hardware flash or pause
  const handleTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      if (!video.duration || Number.isNaN(video.duration)) return;

      // When active video reaches within 0.28s of 8.0s end, ignite standby video
      if (video.currentTime >= video.duration - 0.28) {
        if (video === videoRefA.current && activeBuffer === 'A') {
          const next = videoRefB.current;
          if (next) {
            next.currentTime = 0;
            next.play().catch(() => {});
            setActiveBuffer('B');
          }
        } else if (video === videoRefB.current && activeBuffer === 'B') {
          const next = videoRefA.current;
          if (next) {
            next.currentTime = 0;
            next.play().catch(() => {});
            setActiveBuffer('A');
          }
        }
      }
    },
    [activeBuffer]
  );

  // Initial setup: muted, inline playback
  useEffect(() => {
    const videoA = videoRefA.current;
    const videoB = videoRefB.current;

    const setupVideo = (video: HTMLVideoElement) => {
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
    };

    if (videoA) {
      setupVideo(videoA);
      videoA
        .play()
        .then(() => setIsLoaded(true))
        .catch(() => {
          // Unlock on first user gesture if restricted by browser policy
          const unlock = () => {
            videoA.play().catch(() => {});
            window.removeEventListener('click', unlock);
            window.removeEventListener('scroll', unlock);
            window.removeEventListener('touchstart', unlock);
          };
          window.addEventListener('click', unlock, { once: true });
          window.addEventListener('scroll', unlock, { once: true });
          window.addEventListener('touchstart', unlock, { once: true });
        });
    }

    if (videoB) {
      setupVideo(videoB);
    }
  }, []);

  // Compute scroll-controlled reveal opacity:
  // - 0.00 to 0.05: Pure Black (opacity: 0)
  // - 0.05 to 0.25: Gradual reveal as data traces ignite (0.0 -> 0.60)
  // - 0.25 to 0.88: Stable environmental peak (opacity: 0.60 - 0.65)
  // - 0.88 to 1.00: Smooth fade towards transition (0.60 -> 0.0)
  const opacity = useMemo(() => {
    if (scrollProgress < 0.05) return 0;

    if (scrollProgress < 0.25) {
      const t = (scrollProgress - 0.05) / 0.20;
      return t * 0.62;
    }

    if (scrollProgress <= 0.88) {
      return 0.62;
    }

    // Exit transition
    const t = (scrollProgress - 0.88) / 0.12;
    return Math.max(0, 0.62 * (1 - t));
  }, [scrollProgress]);

  return (
    <div
      id="deep-flow-background-container"
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0"
      style={{
        opacity,
        transition: 'opacity 100ms ease-out',
        willChange: 'opacity',
      }}
    >
      {/* Dual Video Buffer A */}
      <video
        ref={videoRefA}
        src={DEEP_VIDEO_SRC}
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${
          activeBuffer === 'A' ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
        style={{
          transform: 'translateZ(0)',
          filter: 'contrast(1.05) brightness(0.95)',
        }}
      />

      {/* Dual Video Buffer B */}
      <video
        ref={videoRefB}
        src={DEEP_VIDEO_SRC}
        muted
        playsInline
        loop
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${
          activeBuffer === 'B' ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
        style={{
          transform: 'translateZ(0)',
          filter: 'contrast(1.05) brightness(0.95)',
        }}
      />

      {/* Atmospheric Vignette & Contrast Calibration Layer */}
      {/* Ensures the 3D mathematical cards, formulas, and binary telemetry remain 100% legible */}
      <div
        id="deep-flow-vignette-overlay"
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.65) 65%, rgba(0, 0, 0, 0.90) 100%), linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* Subtle Matrix Phosphor Tint merging the video with DEEP's green color grading */}
      <div
        id="deep-flow-matrix-tint"
        className="absolute inset-0 w-full h-full pointer-events-none z-20 mix-blend-color"
        style={{
          backgroundColor: 'rgba(34, 197, 94, 0.08)',
        }}
      />
    </div>
  );
}
