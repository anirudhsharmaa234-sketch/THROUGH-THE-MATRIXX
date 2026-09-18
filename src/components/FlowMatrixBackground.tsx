import { useEffect, useRef, useState, useCallback } from 'react';

interface FlowMatrixBackgroundProps {
  scrollProgress: number;
}

const VIDEO_SRC = '/videos/matrix_flow_loop.mp4';

/**
 * FlowMatrixBackground
 *
 * Full-viewport, edge-to-edge cinematic background video layer sourced directly from Google Flow.
 * Positioned behind the "THROUGH THE MATRIX" display typography and atmospheric overlays.
 *
 * Features:
 * 1. True Full-Viewport Responsive Framing:
 *    - Uses object-fit: cover with object-position: center center to completely fill any viewport
 *      (ultrawide 21:9, standard 16:9, laptop 16:10, tablet 4:3, or mobile portrait 9:16)
 *      with ZERO black bars, ZERO letterboxing, and ZERO distortion.
 * 2. Uncompressed Original Flow Quality:
 *    - Plays the full original 720p H.264 stream with faststart moov headers.
 *    - Sharp, crisp rendering with hardware-accelerated transforms.
 * 3. Seamless Zero-Flash Looping:
 *    - Dual-buffer video cycling to eliminate any single-frame black flash or pause on loop boundaries.
 * 4. Legibility Atmospheric Treatment:
 *    - Layer 3 integrated dark vignette / radial gradient ensures the decoded green typography
 *      remains 100% crisp and readable.
 * 5. Smooth Scroll Transition:
 *    - Fully prominent during the "THROUGH THE MATRIX" section, smoothly crossfading as the user
 *      scrolls into the interactive frame sequence, and immediately restored upon returning to the surface.
 */
export default function FlowMatrixBackground({ scrollProgress }: FlowMatrixBackgroundProps) {
  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);
  const [activeBuffer, setActiveBuffer] = useState<'A' | 'B'>('A');
  const [isLoaded, setIsLoaded] = useState(false);

  // Switch buffer smoothly before loop end to eliminate any hardware black frame or pause
  const handleTimeUpdate = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (!video.duration || Number.isNaN(video.duration)) return;

    // When current video is within 0.25s of ending, start the standby video
    if (video.currentTime >= video.duration - 0.25) {
      if (video === videoRefA.current && activeBuffer === 'A') {
        const nextVideo = videoRefB.current;
        if (nextVideo) {
          nextVideo.currentTime = 0;
          nextVideo.play().catch(() => {});
          setActiveBuffer('B');
        }
      } else if (video === videoRefB.current && activeBuffer === 'B') {
        const nextVideo = videoRefA.current;
        if (nextVideo) {
          nextVideo.currentTime = 0;
          nextVideo.play().catch(() => {});
          setActiveBuffer('A');
        }
      }
    }
  }, [activeBuffer]);

  // Initial video boot: play muted, loop enabled as native fallback
  useEffect(() => {
    const videoA = videoRefA.current;
    const videoB = videoRefB.current;

    if (videoA) {
      videoA.muted = true;
      videoA.defaultMuted = true;
      videoA.setAttribute('playsinline', 'true');
      videoA.setAttribute('webkit-playsinline', 'true');
      videoA.play().then(() => setIsLoaded(true)).catch(() => {
        // Retry on interaction if browser blocks autoplay
        const unlock = () => {
          videoA.play().catch(() => {});
          window.removeEventListener('click', unlock);
          window.removeEventListener('touchstart', unlock);
        };
        window.addEventListener('click', unlock, { once: true });
        window.addEventListener('touchstart', unlock, { once: true });
      });
    }

    if (videoB) {
      videoB.muted = true;
      videoB.defaultMuted = true;
      videoB.setAttribute('playsinline', 'true');
      videoB.setAttribute('webkit-playsinline', 'true');
    }
  }, []);

  // Compute opacity based on scroll position in the Through The Matrix section:
  // Visible at full opacity [0.0 - 0.12], then smoothly blends out into the frame sequence [0.12 - 0.24]
  const TITLE_EXIT_END = 0.12;
  const FADE_WINDOW = 0.10;
  
  let sectionOpacity = 1;
  if (scrollProgress > TITLE_EXIT_END) {
    sectionOpacity = Math.max(0, 1 - (scrollProgress - TITLE_EXIT_END) / FADE_WINDOW);
  }

  // If scrolled far down into the deep sequence, hide from rendering tree to save GPU resources
  if (sectionOpacity <= 0.001) {
    return null;
  }

  return (
    <div
      id="flow-matrix-background-layer"
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-10 select-none transition-opacity duration-300"
      style={{
        opacity: sectionOpacity,
        transform: 'translateZ(0)',
      }}
    >
      {/* 
        Video Buffer A
        Preserves 100% native aspect ratio with object-cover, filling all viewport dimensions
      */}
      <video
        ref={videoRefA}
        id="flow-video-buffer-a"
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-200 ${
          activeBuffer === 'A' ? 'opacity-100 z-1' : 'opacity-0 z-0'
        }`}
        style={{
          filter: 'contrast(1.04) brightness(0.96)',
          imageRendering: 'auto',
          transform: 'translateZ(0)',
        }}
      />

      {/* 
        Video Buffer B (Standby Seamless Seamless Cycling)
      */}
      <video
        ref={videoRefB}
        id="flow-video-buffer-b"
        src={VIDEO_SRC}
        muted
        loop
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-200 ${
          activeBuffer === 'B' ? 'opacity-100 z-1' : 'opacity-0 z-0'
        }`}
        style={{
          filter: 'contrast(1.04) brightness(0.96)',
          imageRendering: 'auto',
          transform: 'translateZ(0)',
        }}
      />

      {/* 
        Layer 3: Atmospheric Vignette & Contrast Overlay
        Placed strictly on top of the Flow video and beneath the "THROUGH THE MATRIX" text
        Provides readability for binary decoding typography without washing out video details
      */}
      <div
        id="flow-video-atmospheric-treatment"
        className="absolute inset-0 w-full h-full pointer-events-none z-2"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.58) 55%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* Subtle Matrix scanline texture to unify video with the Matrix design language */}
      <div
        id="flow-video-matrix-scanlines"
        className="absolute inset-0 w-full h-full pointer-events-none z-3 bg-cinematic-scanline opacity-25"
      />
    </div>
  );
}
