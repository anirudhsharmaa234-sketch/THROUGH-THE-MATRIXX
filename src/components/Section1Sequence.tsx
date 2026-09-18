/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import HeroTitle from './HeroTitle.tsx';
import Navigation from './Navigation.tsx';
import VerticalProgress from './VerticalProgress.tsx';
import ScrollPrompt from './ScrollPrompt.tsx';
import ContextualText from './ContextualText.tsx';
import CustomCursor from './CustomCursor.tsx';
import TriverseArtifact from './TriverseArtifact.tsx';
import FlowMatrixBackground from './FlowMatrixBackground.tsx';
import DigitalImpactFlash from './DigitalImpactFlash.tsx';
import HolographicScannerOverlay from './HolographicScannerOverlay.tsx';
import InteractiveScanDecodeOverlay from './InteractiveScanDecodeOverlay.tsx';
import CinematicTransitionBridge from './transitions/CinematicTransitionBridge.tsx';
import { SURFACE_TO_DEEP_TRANSITION } from '../transitions/transitionConfigs.ts';

const SEQ1_FRAME_COUNT = 80;
const SEQ2_FRAME_COUNT = 80;

// Native frame master dimensions
const SOURCE_WIDTH = 1280;
const SOURCE_HEIGHT = 720;
const SOURCE_RATIO = SOURCE_WIDTH / SOURCE_HEIGHT; // 16:9 (1.7777...)

// Scroll progress timeline phase boundaries [0.0 - 1.0]
const TITLE_EXIT_END = 0.12;      // Hero title exits downward from 0.00 to 0.12
const SEQ1_SOLO_END = 0.40;       // Animation 1 runs solo until 0.40
const BLEND_END = 0.62;           // Transition blend runs from 0.40 to 0.62 (Seq 1 continues while Seq 2 emerges)
const SEQ2_SOLO_END = 0.94;       // Animation 2 impact and shockwave runs to 0.94
                                  // 0.94 to 1.00: Resting gateway state for Section 1

function smoothStep(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * (3 - 2 * clamped);
}

function getSeq1Path(index: number): string {
  const pad = String(index + 1).padStart(3, '0');
  return `/sequences/seq1/frame_${pad}.webp`;
}

function getSeq2Path(index: number): string {
  const pad = String(index + 1).padStart(3, '0');
  return `/sequences/seq2/frame_${pad}.webp`;
}

/**
 * Responsive full-viewport reframing & cropping.
 * 
 * Preserves 100% of the native source resolution (1280x720) and original pixel sharpness:
 * - Does NOT downscale or compress source frame pixels.
 * - Computes the exact source-window crop [sx, sy, sw, sh] in native source coordinates.
 * - Maps the source window directly to destination canvas buffer [0, 0, cw, ch].
 * - Enforces ctx.imageSmoothingQuality = 'high' (bicubic) to prevent blurry interpolation.
 * - Anchors to the subject's focal point (agent at focalX = 0.50, focalY = 0.48).
 */
function isValidImage(img: HTMLImageElement | null | undefined): img is HTMLImageElement {
  return !!img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number,
  focalX = 0.5,
  focalY = 0.48
) {
  if (!isValidImage(img)) return;

  const iw = img.naturalWidth || SOURCE_WIDTH;
  const ih = img.naturalHeight || SOURCE_HEIGHT;
  const imgRatio = iw / ih || SOURCE_RATIO;
  const canvasRatio = cw / ch;

  let sw: number;
  let sh: number;
  let sx: number;
  let sy: number;

  // Near 16:9 fullscreen detection (tolerance ~0.008 accommodates minor 1-2px scrollbar or UI bounds)
  if (Math.abs(canvasRatio - imgRatio) < 0.008) {
    // Exact 16:9 fullscreen match: ZERO crop, ZERO subpixel offset, 100% native frame pixels
    sx = 0;
    sy = 0;
    sw = iw;
    sh = ih;
  } else if (canvasRatio > imgRatio) {
    // Viewport is wider than 16:9 (e.g. 21:9 ultrawide): crop top/bottom around agent focal point
    sw = iw;
    sh = Math.round(iw / canvasRatio);
    sx = 0;
    sy = Math.round(Math.max(0, Math.min(ih - sh, (ih - sh) * focalY)));
  } else {
    // Viewport is taller/narrower than 16:9 (e.g. desktop, laptop 16:10, tablet, mobile portrait):
    // Preserve full vertical source height, crop left/right around agent focal point
    sh = ih;
    sw = Math.round(ih * canvasRatio);
    sy = 0;
    sx = Math.round(Math.max(0, Math.min(iw - sw, (iw - sw) * focalX)));
  }

  // Preserve edge sharpness with high-quality bicubic interpolation on high-DPI canvas
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Direct source-rect to destination mapping with strict integer pixel coordinates
  try {
    ctx.drawImage(
      img,
      Math.round(sx),
      Math.round(sy),
      Math.round(sw),
      Math.round(sh),
      0,
      0,
      cw,
      ch
    );
  } catch (err) {
    // Guard against any transient image state change
    console.warn('Canvas drawImage skipped for unready image:', err);
  }
}

export interface Section1SequenceProps {
  controlledProgress?: number;
  opacity?: number;
  isEmbedded?: boolean;
  onTransitionToDeep?: () => void;
}

export default function Section1Sequence({
  controlledProgress,
  opacity = 1.0,
  isEmbedded = false,
  onTransitionToDeep,
}: Section1SequenceProps = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollProgressRef = useRef<number>(0);
  const overrideFrameIndexRef = useRef<number | null>(null);

  const seq1ImagesRef = useRef<(HTMLImageElement | null)[]>(
    Array(SEQ1_FRAME_COUNT).fill(null)
  );
  const seq2ImagesRef = useRef<(HTMLImageElement | null)[]>(
    Array(SEQ2_FRAME_COUNT).fill(null)
  );

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [flashOverrideIntensity, setFlashOverrideIntensity] = useState<number | undefined>(undefined);

  // Helper to find nearest loaded image if targeted frame is still downloading or failed
  const getNearestImage = useCallback((
    images: (HTMLImageElement | null)[],
    targetIndex: number
  ): HTMLImageElement | null => {
    const direct = images[targetIndex];
    if (isValidImage(direct)) return direct;

    for (let offset = 1; offset < images.length; offset++) {
      const prev = targetIndex - offset;
      if (prev >= 0 && isValidImage(images[prev])) {
        return images[prev];
      }
      const next = targetIndex + offset;
      if (next < images.length && isValidImage(images[next])) {
        return images[next];
      }
    }
    return null;
  }, []);

  // Frame rendering logic - 100% scroll controlled with uncompromised visual clarity
  const drawCurrentFrame = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    });
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;

    if (cw === 0 || ch === 0) return;

    // Background matrix black fallback
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, cw, ch);

    // Calculate frame indices and blend alpha based on scroll position
    let frame1Index = 0;
    let frame2Index = 0;
    let blendAlpha = 0;

    if (overrideFrameIndexRef.current !== null) {
      // Reusable Cinematic Transition Override:
      // Holds or animates the sequence at the exact frame specified by the transition controller
      frame2Index = Math.min(SEQ2_FRAME_COUNT - 1, Math.max(0, overrideFrameIndexRef.current));
      blendAlpha = 1;
    } else if (progress < SEQ1_SOLO_END) {
      // Phase 1: Animation 1 progression (including during Hero exit)
      // Frame progresses from 0 up to 48
      const normalized = Math.max(0, progress / SEQ1_SOLO_END);
      frame1Index = Math.min(SEQ1_FRAME_COUNT - 1, Math.floor(normalized * 48));
      blendAlpha = 0;
    } else if (progress <= BLEND_END) {
      // Phase 2: Continuous Cinematic Transition
      // Animation 1 continues playing (frames 48 -> 68) while Animation 2 emerges (frames 0 -> 22)
      const blendProgress = (progress - SEQ1_SOLO_END) / (BLEND_END - SEQ1_SOLO_END);
      blendAlpha = smoothStep(blendProgress);

      frame1Index = Math.min(
        SEQ1_FRAME_COUNT - 1,
        48 + Math.floor(blendProgress * 20)
      );

      frame2Index = Math.min(
        SEQ2_FRAME_COUNT - 1,
        Math.floor(blendProgress * 22)
      );
    } else if (progress <= SEQ2_SOLO_END) {
      // Phase 3: Pure Animation 2 (Finger touches screen, pulse bursts, shockwaves spread)
      // Frames 22 to 79
      const seq2Progress = (progress - BLEND_END) / (SEQ2_SOLO_END - BLEND_END);
      frame2Index = Math.min(
        SEQ2_FRAME_COUNT - 1,
        22 + Math.floor(seq2Progress * (SEQ2_FRAME_COUNT - 23))
      );
      blendAlpha = 1;
    } else {
      // Phase 4: Gateway resting state for Section 1
      frame2Index = SEQ2_FRAME_COUNT - 1;
      blendAlpha = 1;
    }

    // Render Animation 1 frame with edge-to-edge responsive cover reframing
    if (blendAlpha < 1) {
      const img1 = getNearestImage(seq1ImagesRef.current, frame1Index);
      if (img1) {
        ctx.globalAlpha = 1.0;
        drawImageCover(ctx, img1, cw, ch, 0.5, 0.48);
      }
    }

    // Render Animation 2 frame with smooth blend over Animation 1 across the full viewport
    if (blendAlpha > 0) {
      const img2 = getNearestImage(seq2ImagesRef.current, frame2Index);
      if (img2) {
        ctx.globalAlpha = blendAlpha;
        drawImageCover(ctx, img2, cw, ch, 0.5, 0.48);
      }
    }

    ctx.globalAlpha = 1.0;
  }, [getNearestImage]);

  // Handle responsive canvas sizing:
  // Maps canvas internal resolution directly to physical device pixels (DPR capped at 2),
  // ensuring Retina, 4K, and high-DPI displays render the 1280x720 source frames with maximum native sharpness
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.round(window.innerWidth * dpr);
    const targetH = Math.round(window.innerHeight * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    drawCurrentFrame(scrollProgressRef.current);
  }, [drawCurrentFrame]);

  // Preload frame sequences asynchronously without compression or downscaling
  useEffect(() => {
    let isCancelled = false;

    const preloadImage = async (src: string): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = src;
        img.onload = () => {
          if (img.decode) {
            img.decode()
              .then(() => {
                if (isValidImage(img)) resolve(img);
                else resolve(null);
              })
              .catch(() => {
                if (isValidImage(img)) resolve(img);
                else resolve(null);
              });
          } else {
            if (isValidImage(img)) resolve(img);
            else resolve(null);
          }
        };
        img.onerror = () => resolve(null);
      });
    };

    // Priority 1: Load initial frame of Seq 1 immediately so hero canvas is populated at scroll = 0
    preloadImage(getSeq1Path(0)).then((img) => {
      if (!isCancelled) {
        seq1ImagesRef.current[0] = img;
        updateCanvasDimensions();
      }
    });

    // Priority 2: Load initial frame of Seq 2
    preloadImage(getSeq2Path(0)).then((img) => {
      if (!isCancelled) {
        seq2ImagesRef.current[0] = img;
      }
    });

    // Priority 3: Progressively preload remaining frames
    const loadRemainingFrames = async () => {
      // Preload Seq 1 first 48 frames
      for (let i = 1; i <= 48; i++) {
        if (isCancelled) return;
        const img = await preloadImage(getSeq1Path(i));
        seq1ImagesRef.current[i] = img;
        if (i === 1 && scrollProgressRef.current === 0) {
          drawCurrentFrame(0);
        }
      }

      // Preload Seq 2 start frames (for transition)
      for (let i = 1; i <= 24; i++) {
        if (isCancelled) return;
        const img = await preloadImage(getSeq2Path(i));
        seq2ImagesRef.current[i] = img;
      }

      // Preload remaining Seq 1 frames (49 to 79)
      for (let i = 49; i < SEQ1_FRAME_COUNT; i++) {
        if (isCancelled) return;
        const img = await preloadImage(getSeq1Path(i));
        seq1ImagesRef.current[i] = img;
      }

      // Preload remaining Seq 2 frames (25 to 79)
      for (let i = 25; i < SEQ2_FRAME_COUNT; i++) {
        if (isCancelled) return;
        const img = await preloadImage(getSeq2Path(i));
        seq2ImagesRef.current[i] = img;
      }
    };

    loadRemainingFrames();

    return () => {
      isCancelled = true;
    };
  }, [drawCurrentFrame, updateCanvasDimensions]);

  // Window resize observer
  useEffect(() => {
    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions, { passive: true });
    return () => {
      window.removeEventListener('resize', updateCanvasDimensions);
    };
  }, [updateCanvasDimensions]);

  // Scroll listener - 100% scroll-driven (only if not embedded)
  useEffect(() => {
    if (isEmbedded) return;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const container = containerRef.current;
          if (container) {
            const rect = container.getBoundingClientRect();
            const totalScrollable = container.offsetHeight - window.innerHeight;

            if (totalScrollable > 0) {
              const currentY = -rect.top;
              const progress = Math.max(0, Math.min(1, currentY / totalScrollable));

              scrollProgressRef.current = progress;
              setScrollProgress(progress);
              drawCurrentFrame(progress);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isEmbedded, drawCurrentFrame]);

  // Synchronize with external scroll progress when embedded
  useEffect(() => {
    if (isEmbedded && controlledProgress !== undefined) {
      scrollProgressRef.current = controlledProgress;
      setScrollProgress(controlledProgress);
      drawCurrentFrame(controlledProgress);
    }
  }, [isEmbedded, controlledProgress, drawCurrentFrame]);

  // Handle smooth scroll from top
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Handle smooth scroll from opening prompt
  const handleScrollDown = () => {
    const container = containerRef.current;
    if (!container) return;
    const targetY = window.innerHeight * 0.85;
    window.scrollTo({
      top: window.scrollY + targetY,
      behavior: 'smooth',
    });
  };

  // Calculate Hero Title downward transition properties
  // Title translates downward from 0px to 140px and fades out as scroll starts
  const effectiveProgress = isEmbedded ? (controlledProgress ?? scrollProgress) : scrollProgress;
  const titleExitFactor = Math.min(1, effectiveProgress / TITLE_EXIT_END);
  const titleTranslateY = titleExitFactor * 140; // Moves downward
  const titleOpacity = Math.max(0, 1 - Math.pow(titleExitFactor, 1.25));
  const isTitleVisible = titleOpacity > 0.001;

  // Embedded rendering inside unified cinematic stage:
  if (isEmbedded) {
    if (opacity <= 0.001) return null;
    return (
      <div
        id="section1-surface-embedded-stage"
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
        style={{
          opacity,
          transition: 'opacity 80ms ease-out',
          willChange: 'opacity',
        }}
      >
        {/* Full-Viewport Canvas - Clean, unadulterated rendering with 100% original sharpness */}
        <canvas
          ref={canvasRef}
          id="cinematic-frame-canvas"
          className="absolute inset-0 w-full h-full block pointer-events-none"
          style={{
            imageRendering: 'auto',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Flow Video Background Layer (Direct from Google Flow) with Layer 3 Atmospheric Vignette */}
        <FlowMatrixBackground scrollProgress={effectiveProgress} />

        {/* Real WebGL Three.js Triverse 3D Matrix Artifact */}
        <TriverseArtifact scrollProgress={effectiveProgress} />

        {/* 
          Holographic Agent Information Overlay:
          Visibly presents the decoded agent-analysis information surrounding the agent,
          anchored to exact pinpoint locations with thin connecting lines and progressive binary decoding.
        */}
        <HolographicScannerOverlay scrollProgress={effectiveProgress} />

        {/* 
          Interactive Scan & Decode Reticles:
          Direct HUD interaction targeting scene elements with status codes and decoders.
        */}
        <InteractiveScanDecodeOverlay scrollProgress={effectiveProgress} />

        {/* Hero Title Overlay - Smooth Downward Exit with Zero Gap into Animation */}
        {isTitleVisible && (
          <div
            id="hero-title-exit-wrapper"
            style={{
              transform: `translate3d(0, ${titleTranslateY}px, 0)`,
              opacity: titleOpacity,
            }}
            className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none transition-transform ease-out will-change-transform"
          >
            <HeroTitle />
          </div>
        )}

        {/* Opening Minimal Scroll Prompt - Disappears naturally upon initial scroll */}
        <ScrollPrompt
          progress={effectiveProgress}
          onPromptClick={handleScrollDown}
        />

        {/* Reusable Cinematic Transition Bridge: SURFACE -> DEEP */}
        <CinematicTransitionBridge
          config={SURFACE_TO_DEEP_TRANSITION}
          sectionProgress={effectiveProgress}
          isActive={opacity > 0.05}
          onFrameOverride={(frame) => {
            overrideFrameIndexRef.current = frame;
            drawCurrentFrame(scrollProgressRef.current);
          }}
          onFlashTrigger={(intensity) => {
            setFlashOverrideIntensity(intensity);
          }}
          onTransitionComplete={() => {
            onTransitionToDeep?.();
          }}
        />

        {/* 
          Final Person-to-Screen Transition:
          Person approaches -> Hand reaches digital surface -> Fingertip makes contact
          -> Digital impact / system activation -> Very brief intense white flash (fills viewport)
          -> Immediately collapses back to black -> Black digital void.
          When embedded, suppressVoid is true so the dimensional shift bridge flows smoothly without black block.
        */}
        <DigitalImpactFlash
          scrollProgress={effectiveProgress}
          suppressVoid={true}
          flashOverrideIntensity={flashOverrideIntensity}
        />
      </div>
    );
  }

  return (
    <section
      ref={containerRef}
      id="hero-section1-timeline"
      className="relative w-full h-[450vh] bg-[#000000] select-none"
      aria-label="Through The Matrix Experience"
    >
      {/* Precision Desktop Custom Cursor */}
      <CustomCursor />

      {/* Minimal Fixed Futuristic Navigation Layer */}
      <Navigation onSurfaceClick={handleScrollToTop} />

      {/* Vertical Scroll Progress Indicator */}
      <VerticalProgress progress={scrollProgress} />

      {/* Cinematic Contextual Narrative Text Overlay */}
      <ContextualText progress={scrollProgress} />

      {/* Pinned Sticky Full-Viewport Stage */}
      <div
        id="cinematic-sticky-viewport"
        className="sticky top-0 w-full h-screen min-h-[100dvh] overflow-hidden bg-[#000000] flex items-center justify-center"
      >
        {/* Full-Viewport Canvas - Clean, unadulterated rendering with 100% original sharpness */}
        <canvas
          ref={canvasRef}
          id="cinematic-frame-canvas"
          className="absolute inset-0 w-full h-full block pointer-events-none"
          style={{
            imageRendering: 'auto',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Flow Video Background Layer (Direct from Google Flow) with Layer 3 Atmospheric Vignette */}
        <FlowMatrixBackground scrollProgress={scrollProgress} />

        {/* Real WebGL Three.js Triverse 3D Matrix Artifact */}
        <TriverseArtifact scrollProgress={scrollProgress} />

        {/* 
          Holographic Agent Information Overlay:
          Visibly presents the decoded agent-analysis information surrounding the agent,
          anchored to exact pinpoint locations with thin connecting lines and progressive binary decoding.
        */}
        <HolographicScannerOverlay scrollProgress={scrollProgress} />

        {/* 
          Interactive Scan & Decode Reticles:
          Direct HUD interaction targeting scene elements with status codes and decoders.
        */}
        <InteractiveScanDecodeOverlay scrollProgress={scrollProgress} />

        {/* Hero Title Overlay - Smooth Downward Exit with Zero Gap into Animation */}
        {isTitleVisible && (
          <div
            id="hero-title-exit-wrapper"
            style={{
              transform: `translate3d(0, ${titleTranslateY}px, 0)`,
              opacity: titleOpacity,
            }}
            className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none transition-transform ease-out will-change-transform"
          >
            <HeroTitle />
          </div>
        )}

        {/* Opening Minimal Scroll Prompt - Disappears naturally upon initial scroll */}
        <ScrollPrompt
          progress={scrollProgress}
          onPromptClick={handleScrollDown}
        />

        {/* Reusable Cinematic Transition Bridge: SURFACE -> DEEP */}
        <CinematicTransitionBridge
          config={SURFACE_TO_DEEP_TRANSITION}
          sectionProgress={scrollProgress}
          isActive={true}
          onFrameOverride={(frame) => {
            overrideFrameIndexRef.current = frame;
            drawCurrentFrame(scrollProgressRef.current);
          }}
          onFlashTrigger={(intensity) => {
            setFlashOverrideIntensity(intensity);
          }}
          onTransitionComplete={() => {
            if (onTransitionToDeep) {
              onTransitionToDeep();
            } else {
              const deepSection = document.getElementById('section2-deep-root');
              if (deepSection) {
                deepSection.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }}
        />

        {/* 
          Final Person-to-Screen Transition:
          Person approaches -> Hand reaches digital surface -> Fingertip makes contact
          -> Digital impact / system activation -> Very brief intense white flash (fills viewport)
          -> Immediately collapses back to black -> Black digital void.
          Zero black gaps before flash, zero lingering white screen.
        */}
        <DigitalImpactFlash
          scrollProgress={scrollProgress}
          flashOverrideIntensity={flashOverrideIntensity}
        />
      </div>
    </section>
  );
}
