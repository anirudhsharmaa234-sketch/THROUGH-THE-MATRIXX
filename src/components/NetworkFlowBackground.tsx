/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface NetworkFlowBackgroundProps {
  /**
   * Scroll progress within Section 3 (THE NETWORK // LAYER 03), from 0.0 to 1.0.
   */
  scrollProgress: number;
}

const NETWORK_VIDEO_SRC = '/videos/network_flow_loop.mp4';
const FALLBACK_VIDEO_SRC = '/videos/matrix_flow_loop.mp4';

/**
 * NetworkFlowBackground
 *
 * Sourced directly from Google Flow:
 * https://flow.google.com/shared/video/2ab600ec-85f8-430f-88ae-fa5d99e8947b
 *
 * Core Behavioral Directives:
 * 1. Independent Looping: Runs continuously, never tied to scroll ticks,
 *    never restarts on scroll, never loops the intro sequence.
 * 2. Background Hierarchy: Sits behind the 3D Network spatial environment,
 *    subtly calibrated with an atmospheric vignette so nodes, filaments,
 *    and telemetry have optimal visual contrast and razor-sharp clarity.
 * 3. Full-Viewport Edge-to-Edge Framing: Uses object-fit: cover with center alignment,
 *    ensuring zero letterboxing, zero distortion, and zero artificial borders.
 * 4. Dual-Buffer Seamless Looping: Seamless alternating video elements eliminate
 *    any hardware decoding pause or black flash frame.
 * 5. Emergence Timeline: Pure black at scrollProgress < 0.20, then smoothly fades in
 *    between 0.20 and 0.45 as the network awakens.
 */
export default function NetworkFlowBackground({ scrollProgress }: NetworkFlowBackgroundProps) {
  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);
  const [activeBuffer, setActiveBuffer] = useState<'A' | 'B'>('A');
  const [, setIsLoaded] = useState(false);

  // Buffer cycling to guarantee zero glitch/black frame on loop wrap
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

  // Ambient emergence calculation
  // 0.00 -> 0.20: Pure black void (matching DEEP transition ending)
  // 0.20 -> 0.48: Smoothly fades in as signals begin connecting
  // 0.48 -> 1.00: Reaches calibrated ambient intensity (0.42 max opacity to protect foreground clarity)
  let videoOpacity = 0;
  if (scrollProgress >= 0.20) {
    const emergence = Math.min(1, (scrollProgress - 0.20) / 0.28);
    videoOpacity = emergence * 0.42;
  }

  if (videoOpacity <= 0.005) {
    return null;
  }

  return (
    <div
      id="network-ambient-flow-background"
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0 bg-[#000000]"
      style={{
        opacity: videoOpacity,
        transition: 'opacity 120ms ease-out',
        willChange: 'opacity',
      }}
    >
      {/* Primary Video Buffer A */}
      <video
        ref={videoRefA}
        src={NETWORK_VIDEO_SRC}
        onError={(e) => {
          // Fallback if needed
          const target = e.currentTarget;
          if (target.src !== FALLBACK_VIDEO_SRC) {
            target.src = FALLBACK_VIDEO_SRC;
            target.play().catch(() => {});
          }
        }}
        onTimeUpdate={handleTimeUpdate}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ease-in-out ${
          activeBuffer === 'A' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          filter: 'brightness(0.85) contrast(1.18) saturate(1.15)',
        }}
      />

      {/* Standby Video Buffer B for Seamless Zero-Jump Loop */}
      <video
        ref={videoRefB}
        src={NETWORK_VIDEO_SRC}
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== FALLBACK_VIDEO_SRC) {
            target.src = FALLBACK_VIDEO_SRC;
            target.play().catch(() => {});
          }
        }}
        onTimeUpdate={handleTimeUpdate}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ease-in-out ${
          activeBuffer === 'B' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          filter: 'brightness(0.85) contrast(1.18) saturate(1.15)',
        }}
      />

      {/* Atmospheric Dark Vignette & Edge Falloff to Preserve Visual Hierarchy */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(0, 5, 2, 0.25) 0%, rgba(0, 0, 0, 0.75) 75%, #000000 100%)',
        }}
      />

      {/* Subtle Spatial Coordinate Grid Overlay */}
      <div
        className="absolute inset-0 w-full h-full opacity-15 pointer-events-none bg-matrix-texture"
        style={{
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
        }}
      />
    </div>
  );
}
