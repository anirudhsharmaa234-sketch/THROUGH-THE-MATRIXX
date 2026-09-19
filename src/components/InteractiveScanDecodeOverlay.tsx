/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SCAN_TARGETS, type ScanTargetDef, getSceneElement } from '../sceneElements';

export { SCAN_TARGETS, type ScanTargetDef, getSceneElement };

interface InteractiveScanDecodeOverlayProps {
  scrollProgress: number;
  activeVideoRef?: React.RefObject<HTMLVideoElement | null>;
}

// 16 motion keyframes precisely measured from the 8-second video loop
interface Keyframe {
  t: number;
  cx: number;
  cy: number;
}

const MOTION_KEYFRAMES: Keyframe[] = [
  { t: 0.0, cx: 0.4845, cy: 0.3302 },
  { t: 0.5, cx: 0.4855, cy: 0.3366 },
  { t: 1.0, cx: 0.4828, cy: 0.3388 },
  { t: 1.5, cx: 0.4736, cy: 0.3388 },
  { t: 2.0, cx: 0.5118, cy: 0.3262 },
  { t: 2.5, cx: 0.4990, cy: 0.3579 },
  { t: 3.0, cx: 0.5174, cy: 0.3296 },
  { t: 3.5, cx: 0.5498, cy: 0.2908 },
  { t: 4.0, cx: 0.4766, cy: 0.3403 },
  { t: 4.5, cx: 0.4828, cy: 0.3560 },
  { t: 5.0, cx: 0.4809, cy: 0.3312 },
  { t: 5.5, cx: 0.4825, cy: 0.3379 },
  { t: 6.0, cx: 0.4855, cy: 0.3399 },
  { t: 6.5, cx: 0.4848, cy: 0.3408 },
  { t: 7.0, cx: 0.4856, cy: 0.3372 },
  { t: 7.5, cx: 0.4845, cy: 0.3335 },
  { t: 8.0, cx: 0.4845, cy: 0.3302 },
];

function getMotionOffset(timeSeconds: number): { dx: number; dy: number } {
  const duration = 8.0;
  const tMod = ((timeSeconds % duration) + duration) % duration;

  for (let i = 0; i < MOTION_KEYFRAMES.length - 1; i++) {
    const k1 = MOTION_KEYFRAMES[i];
    const k2 = MOTION_KEYFRAMES[i + 1];
    if (tMod >= k1.t && tMod <= k2.t) {
      const dt = (tMod - k1.t) / (k2.t - k1.t);
      const smooth = (1 - Math.cos(dt * Math.PI)) / 2;
      const curCx = k1.cx + (k2.cx - k1.cx) * smooth;
      const curCy = k1.cy + (k2.cy - k1.cy) * smooth;
      return {
        dx: curCx - MOTION_KEYFRAMES[0].cx,
        dy: curCy - MOTION_KEYFRAMES[0].cy,
      };
    }
  }
  return { dx: 0, dy: 0 };
}

function getCoverCoordinates(
  vx: number,
  vy: number,
  width: number,
  height: number,
  videoAspect = 16 / 9
): { x: number; y: number } {
  const containerAspect = width / height;
  let renderWidth: number;
  let renderHeight: number;
  let offsetX: number;
  let offsetY: number;

  if (containerAspect > videoAspect) {
    renderWidth = width;
    renderHeight = width / videoAspect;
    offsetX = 0;
    offsetY = (height - renderHeight) / 2;
  } else {
    renderHeight = height;
    renderWidth = height * videoAspect;
    offsetX = (width - renderWidth) / 2;
    offsetY = 0;
  }

  return {
    x: offsetX + vx * renderWidth,
    y: offsetY + vy * renderHeight,
  };
}

const BINARY_POOL = ['0', '1', '1', '0', '0', '1', '0', '1'];
const GLITCH_CHARS = ['0', '1', '/', '|', '{', '}', '[', ']', '<', '>', '+', '#', '0', '1'];

interface ParticleCloudItem {
  id: number;
  initialDx: number;
  initialDy: number;
  char: string;
}

export default function InteractiveScanDecodeOverlay({
  scrollProgress,
  activeVideoRef,
}: InteractiveScanDecodeOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 1920, height: 1080 });

  // Currently active interactive element
  const [activeTargetId, setActiveTargetId] = useState<string | null>(null);
  const [hoveredTargetId, setHoveredTargetId] = useState<string | null>(null);

  // Interaction State Machine: 'idle' | 'scanning' | 'decoding' | 'revealed'
  const [interactionState, setInteractionState] = useState<'idle' | 'scanning' | 'decoding' | 'revealed'>('idle');

  // Binary convergence and decode progress [0..1]
  const [decodeProgress, setDecodeProgress] = useState<number>(0);
  const [convergeProgress, setConvergeProgress] = useState<number>(0);

  // Real-time video motion tracking offset
  const [motionOffset, setMotionOffset] = useState({ dx: 0, dy: 0 });

  // Ambient telemetry flicker tick
  const [telemetryTick, setTelemetryTick] = useState<number>(0);

  // Decode animation refs
  const decodeAnimRef = useRef<number | null>(null);
  const decodeStartTimeRef = useRef<number | null>(null);
  const activeTargetRef = useRef<string | null>(null);

  // Keep ref in sync
  useEffect(() => {
    activeTargetRef.current = activeTargetId;
  }, [activeTargetId]);

  // Particle cloud generation for binary convergence
  const particleCloud = useMemo<ParticleCloudItem[]>(() => {
    const items: ParticleCloudItem[] = [];
    const count = 32;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.4;
      const dist = 45 + (i % 5) * 18;
      items.push({
        id: i,
        initialDx: Math.cos(angle) * dist,
        initialDy: Math.sin(angle) * dist,
        char: BINARY_POOL[i % BINARY_POOL.length],
      });
    }
    return items;
  }, []);

  // Update container size on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: Math.max(320, rect.width || window.innerWidth),
          height: Math.max(320, rect.height || window.innerHeight),
        });
      } else {
        setContainerSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Live video motion tracking loop
  useEffect(() => {
    let animId: number;
    let lastTime = 0;

    const loop = (now: number) => {
      if (now - lastTime >= 16) {
        let vTime = 0;
        const video = activeVideoRef?.current;
        if (video && !video.paused && !isNaN(video.currentTime)) {
          vTime = video.currentTime;
        } else {
          vTime = (now / 1000) % 8.0;
        }

        const offset = getMotionOffset(vTime);
        setMotionOffset((prev) => {
          if (Math.abs(prev.dx - offset.dx) > 0.0001 || Math.abs(prev.dy - offset.dy) > 0.0001) {
            return offset;
          }
          return prev;
        });

        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [activeVideoRef]);

  // Telemetry tick jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryTick((prev) => (prev + 1) % 1000);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Trigger element scan & decode sequence
  const startDecodeSequence = useCallback((targetId: string) => {
    if (decodeAnimRef.current) {
      cancelAnimationFrame(decodeAnimRef.current);
      decodeAnimRef.current = null;
    }

    setActiveTargetId(targetId);
    setInteractionState('scanning');
    setConvergeProgress(0);
    setDecodeProgress(0);
    decodeStartTimeRef.current = performance.now();

    const SCAN_DURATION = 350;    // 0101 gathers around element
    const CONVERGE_DURATION = 400;// Converges along digital line towards panel
    const DECODE_DURATION = 850;  // 0101 decodes into readable characters

    const animateLoop = (now: number) => {
      if (!decodeStartTimeRef.current) {
        decodeStartTimeRef.current = now;
      }
      const elapsed = now - decodeStartTimeRef.current;

      // Stage 1: Scanning / Binary Gathering (0 - 350ms)
      if (elapsed < SCAN_DURATION) {
        setInteractionState('scanning');
        setConvergeProgress(elapsed / SCAN_DURATION * 0.3);
        setDecodeProgress(0);
      }
      // Stage 2: Binary Convergence towards panel (350 - 750ms)
      else if (elapsed < SCAN_DURATION + CONVERGE_DURATION) {
        setInteractionState('decoding');
        const cP = (elapsed - SCAN_DURATION) / CONVERGE_DURATION;
        setConvergeProgress(0.3 + cP * 0.7);
        setDecodeProgress(cP * 0.25);
      }
      // Stage 3: Progressive Glitch Decoding (750 - 1600ms)
      else if (elapsed < SCAN_DURATION + CONVERGE_DURATION + DECODE_DURATION) {
        setInteractionState('decoding');
        setConvergeProgress(1.0);
        const dP = (elapsed - (SCAN_DURATION + CONVERGE_DURATION)) / DECODE_DURATION;
        setDecodeProgress(Math.min(1.0, 0.25 + dP * 0.75));
      }
      // Stage 4: Fully Resolved Information Panel
      else {
        setInteractionState('revealed');
        setConvergeProgress(1.0);
        setDecodeProgress(1.0);
        return;
      }

      decodeAnimRef.current = requestAnimationFrame(animateLoop);
    };

    decodeAnimRef.current = requestAnimationFrame(animateLoop);
  }, []);

  // Handle interaction release
  const handleElementLeave = useCallback((targetId: string) => {
    setHoveredTargetId((prev) => (prev === targetId ? null : prev));
    // If not mobile touch held, gracefully release to idle
    if (activeTargetRef.current === targetId) {
      if (decodeAnimRef.current) {
        cancelAnimationFrame(decodeAnimRef.current);
        decodeAnimRef.current = null;
      }
      setInteractionState('idle');
      setActiveTargetId(null);
      setDecodeProgress(0);
      setConvergeProgress(0);
    }
  }, []);

  // Automatically fade down and dismiss telemetry panel on scroll so it never traps or follows the user
  const [scrollFadeOpacity, setScrollFadeOpacity] = useState<number>(1);
  const [scrollFadeOffsetY, setScrollFadeOffsetY] = useState<number>(0);
  const initialScrollYRef = useRef<number | null>(null);

  useEffect(() => {
    if (!activeTargetId) {
      initialScrollYRef.current = null;
      setScrollFadeOpacity(1);
      setScrollFadeOffsetY(0);
      return;
    }

    initialScrollYRef.current = window.scrollY;
    setScrollFadeOpacity(1);
    setScrollFadeOffsetY(0);

    const handleWindowScroll = () => {
      if (initialScrollYRef.current === null) return;
      const currentY = window.scrollY;
      const delta = Math.abs(currentY - initialScrollYRef.current);
      const fadeDistance = 45;

      if (delta <= 0) {
        setScrollFadeOpacity(1);
        setScrollFadeOffsetY(0);
      } else if (delta < fadeDistance) {
        const ratio = 1 - delta / fadeDistance;
        setScrollFadeOpacity(ratio);
        setScrollFadeOffsetY((1 - ratio) * 20);
      } else {
        setScrollFadeOpacity(0);
        setScrollFadeOffsetY(20);
        handleElementLeave(activeTargetId);
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [activeTargetId, handleElementLeave]);

  // Handle element hover or touch
  const handleElementHoverOrTouch = useCallback((targetId: string) => {
    setHoveredTargetId(targetId);
    if (activeTargetId !== targetId) {
      startDecodeSequence(targetId);
    }
  }, [activeTargetId, startDecodeSequence]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (decodeAnimRef.current) {
        cancelAnimationFrame(decodeAnimRef.current);
      }
    };
  }, []);

  const { width, height } = containerSize;
  const isCompact = width < 768;
  const isSmallMobile = width < 480;

  // Compute live coordinates for all targets (MUST execute before any early return)
  const targetPoints = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    SCAN_TARGETS.forEach((target) => {
      const dx = target.tracksSubjectMotion ? motionOffset.dx : Math.sin(telemetryTick * 0.05) * 0.003;
      const dy = target.tracksSubjectMotion ? motionOffset.dy : Math.cos(telemetryTick * 0.05) * 0.003;
      const pt = getCoverCoordinates(
        target.baseVx + dx,
        target.baseVy + dy,
        width,
        height
      );
      map.set(target.id, pt);
    });
    return map;
  }, [width, height, motionOffset, telemetryTick]);

  // Opacity lifecycle: active whenever the agent is visible, smoothly fades out before contact
  let overlayOpacity = 1;
  if (scrollProgress >= 0.62) {
    overlayOpacity = Math.max(0, 1 - (scrollProgress - 0.62) / 0.04);
  }
  if (overlayOpacity <= 0.005) {
    return null;
  }

  // Active target definition
  const activeDef = SCAN_TARGETS.find((t) => t.id === activeTargetId);

  // Compute panel coordinate for active target
  let activePanelPos = { x: 0, y: 0, width: 280, height: 180 };
  if (activeDef) {
    const pt = targetPoints.get(activeDef.id) || { x: width * 0.5, y: height * 0.5 };
    const pWidth = isSmallMobile ? Math.min(width - 32, 240) : isCompact ? 260 : 310;
    const pHeight = 210;

    let spanX = isCompact ? width * 0.28 : width * 0.24;
    spanX = Math.max(140, Math.min(340, spanX));

    const pX =
      activeDef.panelSide === 'left'
        ? Math.max(16, pt.x - spanX - pWidth)
        : Math.min(width - pWidth - 16, pt.x + spanX);

    let pY = pt.y - 45;
    pY = Math.max(50, Math.min(height - pHeight - 40, pY));

    activePanelPos = { x: pX, y: pY, width: pWidth, height: pHeight };
  }

  // Active target anchor point
  const activeAnchorPt = activeDef ? targetPoints.get(activeDef.id) || { x: 0, y: 0 } : null;

  // SVG connector line geometry for active target
  let connectorPathD = '';
  let lineJointX = 0;
  let lineJointY = 0;
  let panelConnectX = 0;
  let panelConnectY = 0;

  if (activeDef && activeAnchorPt) {
    const startX = activeAnchorPt.x;
    const startY = activeAnchorPt.y;

    panelConnectX = activeDef.panelSide === 'left' ? activePanelPos.x + activePanelPos.width : activePanelPos.x;
    panelConnectY = activePanelPos.y + 24;

    const midX =
      activeDef.panelSide === 'left'
        ? Math.min(startX - 28, panelConnectX + 36)
        : Math.max(startX + 28, panelConnectX - 36);

    lineJointX = midX;
    lineJointY = startY;

    // Dogleg precision path
    connectorPathD = `M ${startX} ${startY} L ${midX} ${startY} L ${midX + (activeDef.panelSide === 'left' ? -18 : 18)} ${panelConnectY} L ${panelConnectX} ${panelConnectY}`;
  }

  // Helper to decode a string based on current decodeProgress
  const getDecodedString = (plainText: string, progress: number, seed: number) => {
    if (progress >= 1) return plainText;
    const resolvedChars = Math.floor(progress * plainText.length);
    let out = '';
    for (let i = 0; i < plainText.length; i++) {
      if (i < resolvedChars) {
        out += plainText[i];
      } else if (plainText[i] === ' ') {
        out += ' ';
      } else {
        const randIdx = (telemetryTick + i * 3 + seed) % GLITCH_CHARS.length;
        out += GLITCH_CHARS[randIdx];
      }
    }
    return out;
  };

  return (
    <div
      ref={containerRef}
      id="matrix-interactive-scan-system"
      style={{
        opacity: overlayOpacity,
        pointerEvents: overlayOpacity > 0.4 ? 'auto' : 'none',
      }}
      className="absolute inset-0 w-full h-full z-25 overflow-hidden font-matrix-mono select-none"
      aria-label="Matrix Interactive Scan and Decode System"
    >
      {/* 
        LAYER 1: SVG DIGITAL CONNECTOR LINES, PINPOINTS & SCANNER BEAMS
      */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
        width={width}
        height={height}
      >
        <defs>
          <filter id="matrixScanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Passive idle target reticles */}
        {SCAN_TARGETS.map((target) => {
          const pt = targetPoints.get(target.id);
          if (!pt) return null;
          const isActive = activeTargetId === target.id;
          const isHovered = hoveredTargetId === target.id;

          return (
            <g
              key={`reticle-${target.id}`}
              transform={`translate(${pt.x}, ${pt.y})`}
              className="transition-all duration-300"
            >
              {/* Outer pulsing ping when idle */}
              {!isActive && (
                <circle
                  r={target.hitRadius * 0.45}
                  fill="none"
                  stroke={isHovered ? 'rgba(74, 222, 128, 0.7)' : 'rgba(74, 222, 128, 0.25)'}
                  strokeWidth="0.75"
                  strokeDasharray="2 3"
                  className={isHovered ? 'animate-reticle-slow' : ''}
                />
              )}

              {/* Crosshair ticks */}
              <line x1="-7" y1="0" x2="-3" y2="0" stroke="rgba(74, 222, 128, 0.5)" strokeWidth="0.75" />
              <line x1="3" y1="0" x2="7" y2="0" stroke="rgba(74, 222, 128, 0.5)" strokeWidth="0.75" />
              <line x1="0" y1="-7" x2="0" y2="-3" stroke="rgba(74, 222, 128, 0.5)" strokeWidth="0.75" />
              <line x1="0" y1="3" x2="0" y2="7" stroke="rgba(74, 222, 128, 0.5)" strokeWidth="0.75" />

              {/* Center pinpoint marker */}
              <circle
                r={isActive ? '3' : isHovered ? '2.5' : '1.8'}
                fill={isActive ? '#ffffff' : '#4ade80'}
                stroke={isActive ? '#22c55e' : 'rgba(34, 197, 94, 0.6)'}
                strokeWidth="1"
                className={isActive ? 'shadow-[0_0_10px_#22c55e]' : ''}
              />

              {/* Micro technical tag when hovered/idle */}
              {!isCompact && !isActive && (
                <text
                  x={target.panelSide === 'left' ? -10 : 10}
                  y="-10"
                  textAnchor={target.panelSide === 'left' ? 'end' : 'start'}
                  fill={isHovered ? 'rgba(187, 247, 208, 0.95)' : 'rgba(74, 222, 128, 0.5)'}
                  fontSize="7.5"
                  fontFamily="Share Tech Mono"
                  letterSpacing="0.08em"
                  className="transition-colors duration-200"
                >
                  [{target.code}] {target.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Active element connection line and progressive signal pulses */}
        {activeDef && activeAnchorPt && (
          <g>
            {/* Base connector vector */}
            <path
              d={connectorPathD}
              fill="none"
              stroke="rgba(74, 222, 128, 0.4)"
              strokeWidth="0.85"
            />

            {/* High-intensity animated energy beam traveling towards decoded panel */}
            <path
              d={connectorPathD}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeDasharray="8 20"
              className="animate-holo-dash"
              filter="url(#matrixScanGlow)"
            />

            {/* Secondary emerald pulse */}
            <path
              d={connectorPathD}
              fill="none"
              stroke="#4ade80"
              strokeWidth="1.0"
              strokeDasharray="14 14"
              className="animate-holo-dash"
            />

            {/* Terminal node joining to information panel */}
            <circle
              cx={panelConnectX}
              cy={panelConnectY}
              r="2.5"
              fill="#ffffff"
              stroke="#22c55e"
              strokeWidth="1"
            />

            {/* Active reticle rotating ring on target element */}
            <circle
              cx={activeAnchorPt.x}
              cy={activeAnchorPt.y}
              r={isCompact ? 14 : 18}
              fill="none"
              stroke="#86efac"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              className="animate-reticle-slow"
              filter="url(#matrixScanGlow)"
            />
          </g>
        )}
      </svg>

      {/* 
        LAYER 2: INTERACTIVE TARGET HIT-AREAS
        Placed directly over each element so touch/hover accurately triggers scan
      */}
      {SCAN_TARGETS.map((target) => {
        const pt = targetPoints.get(target.id);
        if (!pt) return null;
        const isActive = activeTargetId === target.id;
        const size = target.hitRadius * 2;

        return (
          <div
            key={`hit-${target.id}`}
            id={`matrix-scan-trigger-${target.id}`}
            role="button"
            tabIndex={0}
            data-interactive="true"
            aria-label={`Inspect ${target.label}`}
            onClick={(e) => {
              e.stopPropagation();
              if (activeTargetId === target.id) {
                handleElementLeave(target.id);
              } else {
                startDecodeSequence(target.id);
              }
            }}
            onMouseEnter={() => handleElementHoverOrTouch(target.id)}
            onMouseLeave={() => {
              // On desktop mouseleave, allow smooth return to idle unless locked
              handleElementLeave(target.id);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              handleElementHoverOrTouch(target.id);
            }}
            style={{
              transform: `translate3d(${pt.x - target.hitRadius}px, ${pt.y - target.hitRadius}px, 0)`,
              width: `${size}px`,
              height: `${size}px`,
            }}
            className="absolute top-0 left-0 rounded-full cursor-pointer pointer-events-auto flex items-center justify-center group focus:outline-none focus:ring-1 focus:ring-emerald-400"
          >
            {/* Subtle radar ping ring on hover */}
            <div
              className={`absolute inset-0 rounded-full border transition-all duration-300 ${
                isActive
                  ? 'border-[#4ade80] bg-[#4ade80]/15 shadow-[0_0_18px_rgba(74,222,128,0.4)] scale-110'
                  : 'border-[#22c55e]/30 group-hover:border-[#86efac] group-hover:bg-[#22c55e]/10 scale-90 group-hover:scale-105'
              }`}
            />
          </div>
        );
      })}

      {/* 
        LAYER 3: 0101 BINARY CONVERGENCE PARTICLES
        Reacting around the active element and converging along the line
      */}
      {activeDef && activeAnchorPt && interactionState !== 'idle' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {particleCloud.map((p) => {
            // Particle travels from initial circular cloud around element towards the panel
            const t = convergeProgress;
            const curX = activeAnchorPt.x + p.initialDx * (1 - t * 0.85) + (panelConnectX - activeAnchorPt.x) * (t * t);
            const curY = activeAnchorPt.y + p.initialDy * (1 - t * 0.85) + (panelConnectY - activeAnchorPt.y) * (t * t);
            const charDisplay = (telemetryTick + p.id) % 2 === 0 ? '1' : '0';

            return (
              <span
                key={`p-${p.id}`}
                style={{
                  transform: `translate3d(${curX}px, ${curY}px, 0)`,
                  opacity: Math.max(0, 0.95 - t * 0.4),
                }}
                className="absolute top-0 left-0 text-[10px] text-[#86efac] font-matrix-mono will-change-transform drop-shadow-[0_0_6px_#22c55e]"
              >
                {charDisplay}
              </span>
            );
          })}
        </div>
      )}

      {/* 
        LAYER 4: DECODING HUD / TECHNICAL INFORMATION PANEL
        Progressively reveals and renders authentic Matrix system analysis
      */}
      {activeDef && activeAnchorPt && interactionState !== 'idle' && (
        <>
          {/* Backdrop: Touching outside immediately dismisses */}
          <div
            id="scan-telemetry-backdrop"
            onClick={() => handleElementLeave(activeDef.id)}
            onTouchStart={() => handleElementLeave(activeDef.id)}
            className="fixed inset-0 z-20 pointer-events-auto bg-black/20 backdrop-blur-[1px] cursor-pointer"
            aria-hidden="true"
          />

          <div
            id="matrix-decoded-telemetry-panel"
            style={{
              transform: `translate3d(${activePanelPos.x}px, ${activePanelPos.y + scrollFadeOffsetY}px, 0)`,
              width: `${activePanelPos.width}px`,
              opacity: scrollFadeOpacity,
            }}
            className="absolute top-0 left-0 pointer-events-auto z-30 transition-transform duration-75 will-change-transform font-matrix-mono select-none animate-matrix-pop-in"
          >
          {/* Holographic Window Box */}
          <div className="relative p-3 rounded-[3px] bg-[#020d06]/92 backdrop-blur-[4px] border border-[#4ade80]/60 shadow-[0_0_24px_rgba(74,222,128,0.22)]">
            {/* Technical 4-Corner Accent Brackets */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#86efac]" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#86efac]" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#86efac]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#86efac]" />

            {/* Panel Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-[#22c55e]/30 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_8px_#22c55e] animate-pulse shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-bold text-[#bbf7d0] tracking-wider truncate uppercase">
                  {getDecodedString(activeDef.decodedTitle, decodeProgress, 1)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-1">
                {activeDef.statusCodeHex && (
                  <span className="text-[7.5px] bg-emerald-950/80 px-1 py-0.5 rounded border border-emerald-500/40 text-[#86efac] tracking-wider uppercase font-mono">
                    {activeDef.statusCodeHex}
                  </span>
                )}
                <span className="text-[8px] text-[#4ade80]/80 tracking-widest uppercase font-mono">
                  {activeDef.code}
                </span>
                <button
                  type="button"
                  aria-label="Close telemetry"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleElementLeave(activeDef.id);
                  }}
                  className="w-4 h-4 flex items-center justify-center rounded border border-emerald-500/40 text-emerald-400 hover:text-white hover:border-emerald-300 text-[10px] cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Subtitle / Classification */}
            <div className="text-[8px] sm:text-[9px] text-[#86efac]/80 tracking-wider mb-2 font-mono flex items-center justify-between">
              <span>{getDecodedString(activeDef.decodedSubtitle, decodeProgress, 5)}</span>
              <span className="text-[7.5px] text-emerald-400 bg-emerald-950/60 px-1 py-0.5 rounded border border-emerald-500/30">
                {interactionState === 'decoding' ? '0101 DECODING...' : 'LOCKED'}
              </span>
            </div>

            {/* Real-time Telemetry Key-Value Rows */}
            <div className="space-y-1 my-2 text-[8px] sm:text-[9px] font-mono leading-tight">
              {activeDef.telemetryRows.map((row, idx) => {
                const isResolved = decodeProgress > (idx + 1) / (activeDef.telemetryRows.length + 1);
                const displayVal = isResolved
                  ? row.value
                  : getDecodedString(row.value, decodeProgress * 1.5, idx * 7);

                return (
                  <div
                    key={`row-${activeDef.id}-${idx}`}
                    className="flex items-center justify-between gap-1 py-0.5 border-b border-[#22c55e]/10 text-neutral-300"
                  >
                    <span className="text-emerald-400/80 uppercase tracking-tight text-[7.5px] sm:text-[8.5px] truncate">
                      {row.label}:
                    </span>
                    <span className="text-neutral-100 text-right truncate font-medium ml-1">
                      {displayVal}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Technical Narrative Analysis */}
            <div className="mt-2 pt-1.5 border-t border-[#22c55e]/20 text-[7.5px] sm:text-[8px] text-neutral-400 leading-snug">
              <span className="text-[#86efac]/90 font-semibold mr-1">ANALYSIS:</span>
              <span>{getDecodedString(activeDef.technicalSummary, decodeProgress, 9)}</span>
            </div>

            {/* Progress Bar & Status Footer */}
            <div className="mt-2 pt-1.5 flex items-center justify-between text-[7px] text-[#4ade80]/80 tracking-widest uppercase">
              <div className="flex items-center gap-1.5 w-2/3">
                <span className="text-[6.5px]">DECODE:</span>
                <div className="flex-1 h-1 bg-black/60 rounded-full overflow-hidden border border-emerald-500/20">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-[#4ade80] transition-all duration-75"
                    style={{ width: `${Math.round(decodeProgress * 100)}%` }}
                  />
                </div>
                <span className="font-mono text-[7px]">{Math.round(decodeProgress * 100)}%</span>
              </div>
              <span className="text-[#86efac]">{activeDef.statusBadge}</span>
            </div>
          </div>
        </div>
        </>
      )}

      {/* 
        LAYER 5: MINIMAL PROMPT HELPER ON DESKTOP & MOBILE
        Instructs user to interact with the scene elements
      */}
      <div
        className={`absolute bottom-6 left-6 pointer-events-none transition-opacity duration-500 font-matrix-mono text-[9px] text-[#86efac]/60 tracking-widest uppercase hidden sm:flex items-center gap-2 ${
          activeTargetId ? 'opacity-0' : 'opacity-80'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-ping" />
        <span>HOVER / TOUCH ANY SCENE ELEMENT TO SCAN + DECODE</span>
      </div>
    </div>
  );
}
