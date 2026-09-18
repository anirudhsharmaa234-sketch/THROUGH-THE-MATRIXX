/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

export interface HolographicScannerOverlayProps {
  scrollProgress: number;
  activeVideoRef?: React.RefObject<HTMLVideoElement | null>;
}

// 16 motion keyframes measured from the video loop to dynamically track the agent
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

/**
 * Maps normalized video/frame coordinates [0..1] to exact screen coordinates
 * matching `object-cover object-center` and canvas `drawImageCover` reframing.
 */
function getCoverCoordinates(
  vx: number,
  vy: number,
  width: number,
  height: number,
  videoAspect = 16 / 9,
  focalX = 0.5,
  focalY = 0.48
): { x: number; y: number } {
  const containerAspect = width / height;
  let renderWidth: number;
  let renderHeight: number;
  let offsetX: number;
  let offsetY: number;

  if (Math.abs(containerAspect - videoAspect) < 0.008) {
    renderWidth = width;
    renderHeight = height;
    offsetX = 0;
    offsetY = 0;
  } else if (containerAspect > videoAspect) {
    renderWidth = width;
    renderHeight = width / videoAspect;
    offsetX = 0;
    offsetY = Math.max(0, Math.min(height - renderHeight, (height - renderHeight) * focalY));
  } else {
    renderHeight = height;
    renderWidth = height * videoAspect;
    offsetX = Math.max(0, Math.min(width - renderWidth, (width - renderWidth) * focalX));
    offsetY = 0;
  }

  return {
    x: offsetX + vx * renderWidth,
    y: offsetY + vy * renderHeight,
  };
}

export interface AgentInfoAnchorDef {
  id: string;
  code: string;
  pinpointLocation: string; // HEAD, EYES, CHEST, HAND, SHOULDER, BODY, LOWER AREA, FLANK
  category: string;
  decodedTitle: string; // The visible decoded text requested by user
  secondaryReadout: string;
  statusBadge: string;
  baseVx: number;
  baseVy: number;
  side: 'left' | 'right';
  unlockOrder: number; // Staggered sequence
  unlockDelayMs: number;
  binaryPattern: string; // e.g. "010101 00101"
  telemetryMetrics: { label: string; value: string }[];
}

export const AGENT_INFO_ANCHORS: AgentInfoAnchorDef[] = [
  {
    id: 'head-neural',
    code: 'HD-01',
    pinpointLocation: 'HEAD',
    category: 'NEURAL LINK',
    decodedTitle: 'NEURAL LINK // STABLE',
    secondaryReadout: 'SYNAPSE: 44.1 HZ GAMMA • COHERENCE: 99.98%',
    statusBadge: 'LOCK: CORTEX-SYNC',
    baseVx: 0.495,
    baseVy: 0.210,
    side: 'left',
    unlockOrder: 1,
    unlockDelayMs: 250,
    binaryPattern: '101010 11001',
    telemetryMetrics: [
      { label: 'BANDWIDTH', value: '10.42 GHz' },
      { label: 'PHASE JITTER', value: '±0.002 ps' },
    ],
  },
  {
    id: 'eyes-visual',
    code: 'OPT-02',
    pinpointLocation: 'EYES',
    category: 'VISUAL SIGNAL',
    decodedTitle: 'SIGNAL // SYNCHRONIZED',
    secondaryReadout: 'SPECTRAL: 520nm EMERALD • 240 FPS REALTIME',
    statusBadge: 'FEED: UNFILTERED',
    baseVx: 0.505,
    baseVy: 0.198,
    side: 'right',
    unlockOrder: 2,
    unlockDelayMs: 550,
    binaryPattern: '010011 00101',
    telemetryMetrics: [
      { label: 'OPTIC LATENCY', value: '0.02 ms' },
      { label: 'DECODE DEPTH', value: '100% NOMINAL' },
    ],
  },
  {
    id: 'chest-status',
    code: 'SYS-03',
    pinpointLocation: 'CHEST',
    category: 'SYSTEM STATUS',
    decodedTitle: 'STATUS // ACTIVE',
    secondaryReadout: 'SYSTEM STATUS: UNCONTAINED • ZERO DAMPING',
    statusBadge: 'ACCESS: ROOT-0',
    baseVx: 0.508,
    baseVy: 0.365,
    side: 'right',
    unlockOrder: 3,
    unlockDelayMs: 900,
    binaryPattern: '011001 01010',
    telemetryMetrics: [
      { label: 'KERNEL BYPASS', value: 'GRANTED' },
      { label: 'CARRIER PWR', value: '99.984%' },
    ],
  },
  {
    id: 'shoulder-biometric',
    code: 'BIO-04',
    pinpointLocation: 'SHOULDER',
    category: 'BIOMETRIC TRACE',
    decodedTitle: 'BIOMETRIC // ANALYZING',
    secondaryReadout: 'PULSE: 64 BPM • BIOMASS TETHER: STABLE',
    statusBadge: 'TETHER: GROUNDED',
    baseVx: 0.415,
    baseVy: 0.315,
    side: 'left',
    unlockOrder: 4,
    unlockDelayMs: 1250,
    binaryPattern: '110100 10011',
    telemetryMetrics: [
      { label: 'GRAVITY DRIFT', value: '9.806 m/s²' },
      { label: 'KINETIC BALANCE', value: '1.000 G' },
    ],
  },
  {
    id: 'body-agent-id',
    code: 'AGT-05',
    pinpointLocation: 'BODY',
    category: 'ENTITY CLASSIFICATION',
    decodedTitle: 'AGENT ID // 07X-041',
    secondaryReadout: 'ANOMALY-001 • PRIMARY ITERATION CONSTRUCT',
    statusBadge: 'OPERATOR: THE ONE',
    baseVx: 0.425,
    baseVy: 0.440,
    side: 'left',
    unlockOrder: 5,
    unlockDelayMs: 1600,
    binaryPattern: '010101 00101',
    telemetryMetrics: [
      { label: 'CLEARANCE', value: 'TIER-0 KERNEL' },
      { label: 'SOURCE UPLINK', value: 'STANDALONE' },
    ],
  },
  {
    id: 'flank-trace',
    code: 'TRC-06',
    pinpointLocation: 'SYSTEM TRACE',
    category: 'SYSTEM TRACE',
    decodedTitle: 'SYSTEM TRACE // DETECTED',
    secondaryReadout: 'THREAT INDEX // UNKNOWN • EXCEEDS PARAMETERS',
    statusBadge: 'ANOMALY: POSITIVE',
    baseVx: 0.550,
    baseVy: 0.420,
    side: 'right',
    unlockOrder: 6,
    unlockDelayMs: 1950,
    binaryPattern: '001101 11010',
    telemetryMetrics: [
      { label: 'CIPHER PROTOCOL', value: 'PRIME-0x8F' },
      { label: 'ISOLATION LEVEL', value: 'UNRESTRICTED' },
    ],
  },
  {
    id: 'hand-interface',
    code: 'IFC-07',
    pinpointLocation: 'HAND',
    category: 'INTERFACE CONTACT',
    decodedTitle: 'ACCESS LEVEL // RESTRICTED',
    secondaryReadout: 'SYNAPTIC I/O: 8.44 GB/s • CONTACT IMMINENT',
    statusBadge: 'WRITE: AUTHORIZED',
    baseVx: 0.608,
    baseVy: 0.530,
    side: 'right',
    unlockOrder: 7,
    unlockDelayMs: 2300,
    binaryPattern: '100101 01100',
    telemetryMetrics: [
      { label: 'SURFACE WAVE', value: '128.4 Hz' },
      { label: 'ION DENSITY', value: '3.20 kV' },
    ],
  },
  {
    id: 'lower-network',
    code: 'NET-08',
    pinpointLocation: 'LOWER AREA',
    category: 'NETWORK SIGNAL',
    decodedTitle: 'NETWORK LINK // CONNECTED',
    secondaryReadout: 'SOURCE UPLINK // SYNCHRONIZED ARCHITECTURE',
    statusBadge: 'BUS: 100% ONLINE',
    baseVx: 0.470,
    baseVy: 0.660,
    side: 'left',
    unlockOrder: 8,
    unlockDelayMs: 2650,
    binaryPattern: '111000 00111',
    telemetryMetrics: [
      { label: 'PACKET INTEGRITY', value: '100.00%' },
      { label: 'FRAME RATE', value: '240.0 FPS' },
    ],
  },
];

const GLITCH_CHARS = ['0', '1', '1', '0', '0', '1', '/', '|', 'X', '#', '+', ':', '{', '}'];

/**
 * Individual Decoded Information Card with Progressive Binary Decoding
 */
interface DecodedBlockCardProps {
  anchor: AgentInfoAnchorDef;
  isUnlocked: boolean;
  isHovered: boolean;
  labelX: number;
  labelY: number;
  labelWidth: number;
  telemetryTick: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function DecodedBlockCard({
  anchor,
  isUnlocked,
  isHovered,
  labelX,
  labelY,
  labelWidth,
  telemetryTick,
  onMouseEnter,
  onMouseLeave,
}: DecodedBlockCardProps) {
  const targetText = anchor.decodedTitle;
  const [displayText, setDisplayText] = useState<string>(anchor.binaryPattern);
  const [isFullyResolved, setIsFullyResolved] = useState(false);
  const [lockFlashes, setLockFlashes] = useState<boolean[]>(() =>
    Array(targetText.length).fill(false)
  );
  const decodeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Progressive Glitch Decoding:
  // 010101 binary pattern -> rapid character glitching -> resolved text
  useEffect(() => {
    if (!isUnlocked) {
      setDisplayText(anchor.binaryPattern);
      setIsFullyResolved(false);
      return;
    }

    let frame = 0;
    const totalFrames = 26; // ~650ms total decoding duration
    const intervalTime = 25;

    const interval = setInterval(() => {
      frame++;
      const progress = Math.min(1, frame / totalFrames);
      const resolvedCount = Math.floor(progress * targetText.length);

      const nextChars = targetText.split('').map((targetChar, idx) => {
        if (targetChar === ' ' || targetChar === '/') {
          return targetChar;
        }
        if (idx < resolvedCount) {
          return targetChar;
        }
        if (idx === resolvedCount) {
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }
        // Trailing binary digits
        return Math.random() > 0.5 ? '1' : '0';
      });

      setDisplayText(nextChars.join(''));

      // Trigger flash for newly resolved letter
      if (resolvedCount > 0 && resolvedCount <= targetText.length) {
        setLockFlashes((prev) => {
          const next = [...prev];
          next[resolvedCount - 1] = true;
          return next;
        });
        setTimeout(() => {
          setLockFlashes((prev) => {
            const next = [...prev];
            next[resolvedCount - 1] = false;
            return next;
          });
        }, 120);
      }

      if (progress >= 1) {
        clearInterval(interval);
        setDisplayText(targetText);
        setIsFullyResolved(true);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isUnlocked, targetText, anchor.binaryPattern]);

  return (
    <div
      id={`agent-info-block-${anchor.id}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `translate3d(${labelX}px, ${labelY}px, 0)`,
        width: `${labelWidth}px`,
      }}
      className={`absolute top-0 left-0 pointer-events-auto transition-all duration-500 ease-out will-change-transform z-15 ${
        isUnlocked
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
      }`}
    >
      {/* High-Contrast Technical Holographic Card */}
      <div
        className={`relative p-2.5 sm:p-3 rounded-[2px] bg-[#020f06]/92 backdrop-blur-[3px] border transition-all duration-300 ${
          isHovered
            ? 'border-[#4ade80] shadow-[0_0_22px_rgba(74,222,128,0.4),inset_0_0_12px_rgba(74,222,128,0.12)]'
            : 'border-[#22c55e]/45 shadow-[0_0_14px_rgba(34,197,94,0.14),inset_0_0_8px_rgba(34,197,94,0.05)]'
        }`}
      >
        {/* Subtle holographic scanline overlay on card */}
        <div className="absolute inset-0 bg-cinematic-scanline opacity-15 pointer-events-none rounded-[2px]" />

        {/* 4-Corner Accent Brackets */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#86efac]" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#86efac]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#86efac]" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#86efac]" />

        {/* Block Header: Location, Code, Category */}
        <div className="flex items-center justify-between gap-1 pb-1 border-b border-[#22c55e]/30 mb-1.5 relative z-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`w-1.5 h-1.5 rounded-full inline-block shrink-0 ${
                isFullyResolved
                  ? 'bg-[#4ade80] shadow-[0_0_6px_#22c55e] animate-pulse'
                  : 'bg-emerald-500/70'
              }`}
            />
            <span className="text-[8px] sm:text-[9.5px] font-mono font-semibold tracking-wider text-[#86efac] truncate uppercase">
              {anchor.pinpointLocation} • {anchor.code}
            </span>
          </div>
          <span className="text-[7.5px] sm:text-[8px] font-mono px-1 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-[#4ade80]/90 tracking-widest uppercase shrink-0">
            {anchor.statusBadge}
          </span>
        </div>

        {/* VISIBLE INFORMATION TEXT - The core decoded title */}
        <div className="relative z-1 my-1">
          <div className="text-[12px] sm:text-[14px] font-bold font-mono tracking-wider leading-tight text-[#f0fdf4] drop-shadow-[0_0_10px_rgba(74,222,128,0.8)] select-text">
            {displayText.split('').map((char, cIdx) => (
              <span
                key={`char-${anchor.id}-${cIdx}`}
                className={
                  lockFlashes[cIdx]
                    ? 'text-white bg-emerald-500/30 font-extrabold shadow-[0_0_8px_#ffffff]'
                    : isFullyResolved
                    ? 'text-[#f0fdf4]'
                    : 'text-[#86efac]'
                }
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Secondary Telemetry Readout */}
        <div className="mt-1.5 pt-1 border-t border-[#22c55e]/20 flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-[#86efac]/90 relative z-1">
          <span className="truncate">{anchor.secondaryReadout}</span>
          <span className="text-[#4ade80] font-semibold shrink-0 ml-1.5">
            {telemetryTick % 2 === 0 ? 'SYNC:OK' : 'LIVE'}
          </span>
        </div>

        {/* Micro Telemetry Metric Rows (Shown on tablet and desktop) */}
        <div className="mt-1 pt-0.5 space-y-0.5 text-[7.5px] sm:text-[8px] font-mono text-neutral-400 hidden sm:block relative z-1">
          {anchor.telemetryMetrics.map((metric, mIdx) => (
            <div key={`m-${anchor.id}-${mIdx}`} className="flex items-center justify-between">
              <span className="text-emerald-400/60 uppercase">{metric.label}</span>
              <span className="text-neutral-300 font-medium">{metric.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HolographicScannerOverlay({
  scrollProgress,
  activeVideoRef,
}: HolographicScannerOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 1920, height: 1080 });
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [telemetryTick, setTelemetryTick] = useState(0);
  const [motionOffset, setMotionOffset] = useState({ dx: 0, dy: 0 });

  // Progressive Activation Sequence:
  // Starts automatically when established, activating each pinpoint and information block progressively
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    AGENT_INFO_ANCHORS.forEach((anchor) => {
      const t = setTimeout(() => {
        setUnlockedIds((prev) => new Set([...prev, anchor.id]));
      }, anchor.unlockDelayMs);
      timeouts.push(t);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  // Subtle live telemetry heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryTick((prev) => (prev + 1) % 1000);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Container resize observer for exact pixel positioning
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

  // 60fps motion loop tracking agent coordinates
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

  // Overall Opacity & Lifecycle:
  // - Fully active and visible whenever the agent is visible (0.00 - 0.70)
  // - Smoothly dissolves before contact when fingertip reaches toward the screen (0.62 - 0.66)
  let overlayOpacity = 1;
  if (scrollProgress >= 0.62) {
    overlayOpacity = Math.max(0, 1 - (scrollProgress - 0.62) / 0.04);
  }

  if (overlayOpacity <= 0.005) {
    return null;
  }

  const { width, height } = containerSize;
  const isCompactScreen = width < 768;
  const isVerySmallScreen = width < 500;

  // On very small screens, prioritize the 4 most prominent anatomical pinpoints to avoid crowding
  const activeAnchors = AGENT_INFO_ANCHORS.filter((anchor) => {
    if (isVerySmallScreen) {
      return (
        anchor.id === 'head-neural' ||
        anchor.id === 'chest-status' ||
        anchor.id === 'body-agent-id' ||
        anchor.id === 'hand-interface'
      );
    }
    return true;
  });

  return (
    <div
      ref={containerRef}
      id="matrix-agent-information-overlay"
      style={{
        opacity: overlayOpacity,
        pointerEvents: overlayOpacity > 0.3 ? 'auto' : 'none',
      }}
      className="absolute inset-0 w-full h-full pointer-events-none z-15 overflow-hidden font-matrix-mono select-none"
      aria-label="Agent Analysis Information Overlay"
    >
      {/* 
        Layer 1: Scanning Laser Line
        Sweeps down across the scene periodically
      */}
      <div className="absolute inset-x-0 h-[1.5px] pointer-events-none animate-scan-sweep z-20 opacity-70">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-[#4ade80]/70 to-transparent shadow-[0_0_12px_#22c55e]" />
        <div className="absolute right-8 -top-3 text-[9px] text-[#86efac]/80 tracking-widest font-mono hidden sm:block">
          SYS.SCAN // 520nm AGENT_ANALYSIS [REALTIME]
        </div>
      </div>

      {/* 
        Layer 2: SVG Digital Connecting Lines & Pinpoint Markers
        PINPOINT → THIN CONNECTING LINE → INFORMATION TEXT
        Directly links every pinpoint on the agent to its corresponding information block.
      */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
        width={width}
        height={height}
      >
        <defs>
          <filter id="holoLineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {activeAnchors.map((anchor) => {
          const isUnlocked = unlockedIds.has(anchor.id);
          const isHovered = hoveredId === anchor.id;

          // Compute exact pinpoint on the agent
          const anchorPoint = getCoverCoordinates(
            anchor.baseVx + motionOffset.dx,
            anchor.baseVy + motionOffset.dy,
            width,
            height
          );

          // Card dimensions & flanking position
          const labelWidth = isCompactScreen ? 170 : 235;
          const labelHeight = isCompactScreen ? 68 : 88;

          let horizontalSpan = isCompactScreen ? width * 0.28 : width * 0.26;
          horizontalSpan = Math.max(140, Math.min(360, horizontalSpan));

          const labelX =
            anchor.side === 'left'
              ? Math.max(12, anchorPoint.x - horizontalSpan - labelWidth)
              : Math.min(width - labelWidth - 12, anchorPoint.x + horizontalSpan);

          let targetY = anchorPoint.y - 20;
          if (anchor.id === 'head-neural') targetY = anchorPoint.y - 55;
          if (anchor.id === 'eyes-visual') targetY = anchorPoint.y - 48;
          if (anchor.id === 'chest-status') targetY = anchorPoint.y - 12;
          if (anchor.id === 'shoulder-biometric') targetY = anchorPoint.y - 24;
          if (anchor.id === 'body-agent-id') targetY = anchorPoint.y + 10;
          if (anchor.id === 'flank-trace') targetY = anchorPoint.y + 8;
          if (anchor.id === 'hand-interface') targetY = anchorPoint.y + 36;
          if (anchor.id === 'lower-network') targetY = anchorPoint.y + 40;

          const labelY = Math.max(48, Math.min(height - labelHeight - 48, targetY));

          const startX = anchorPoint.x;
          const startY = anchorPoint.y;

          // Terminal endpoint directly touches the edge of the text card
          const endX = anchor.side === 'left' ? labelX + labelWidth : labelX;
          const endY = labelY + 22;

          // Dogleg orthogonal path (•───────)
          const midX =
            anchor.side === 'left'
              ? Math.min(startX - 26, endX + 32)
              : Math.max(startX + 26, endX - 32);

          const pathD = `M ${startX} ${startY} L ${midX} ${startY} L ${midX + (anchor.side === 'left' ? -16 : 16)} ${endY} L ${endX} ${endY}`;

          return (
            <g
              key={`svg-group-${anchor.id}`}
              className={`transition-opacity duration-500 ${
                isUnlocked ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* PINPOINT TARGET ON THE AGENT */}
              <g transform={`translate(${startX}, ${startY})`}>
                {/* Rotating Dashed Crosshair Ring */}
                <circle
                  r={isHovered ? '9.5' : '7'}
                  fill="none"
                  stroke={isHovered ? '#ffffff' : '#86efac'}
                  strokeWidth="0.85"
                  strokeDasharray="2.5 2.5"
                  className="animate-reticle-slow"
                />

                {/* 4-way micro crosshair ticks */}
                <line x1="-10" y1="0" x2="-4.5" y2="0" stroke="rgba(74, 222, 128, 0.7)" strokeWidth="0.85" />
                <line x1="4.5" y1="0" x2="10" y2="0" stroke="rgba(74, 222, 128, 0.7)" strokeWidth="0.85" />
                <line x1="0" y1="-10" x2="0" y2="-4.5" stroke="rgba(74, 222, 128, 0.7)" strokeWidth="0.85" />
                <line x1="0" y1="4.5" x2="0" y2="10" stroke="rgba(74, 222, 128, 0.7)" strokeWidth="0.85" />

                {/* Center Pinpoint Solid Micro-Dot */}
                <circle
                  r="2"
                  fill="#ffffff"
                  stroke="#22c55e"
                  strokeWidth="1.0"
                />

                {/* Pinpoint Micro Tag */}
                <text
                  x={anchor.side === 'left' ? -14 : 14}
                  y="-4"
                  textAnchor={anchor.side === 'left' ? 'end' : 'start'}
                  fill="#86efac"
                  fontSize="7.5"
                  fontFamily="monospace"
                  className="opacity-75 tracking-wider"
                >
                  [{anchor.code}]
                </text>
              </g>

              {/* THIN CONNECTING LINE: PINPOINT → TEXT */}
              <path
                d={pathD}
                fill="none"
                stroke={isHovered ? '#ffffff' : '#86efac'}
                strokeWidth={isHovered ? '1.5' : '1.0'}
                strokeDasharray="4 14"
                className="animate-holo-dash"
                filter="url(#holoLineGlow)"
              />

              {/* Joint Node •─────── */}
              <circle
                cx={midX}
                cy={startY}
                r="1.75"
                fill="#4ade80"
                stroke="#15803d"
                strokeWidth="0.75"
              />

              {/* Terminal Joint Node on edge of readout box */}
              <circle
                cx={endX}
                cy={endY}
                r="2.25"
                fill="#86efac"
                stroke="#166534"
                strokeWidth="1.0"
              />
            </g>
          );
        })}
      </svg>

      {/* 
        Layer 3: VISIBLE INFORMATION TEXT BLOCKS
        Surrounding the agent at the exact pinpoint locations
      */}
      {activeAnchors.map((anchor) => {
        const isUnlocked = unlockedIds.has(anchor.id);
        const isHovered = hoveredId === anchor.id;

        const anchorPoint = getCoverCoordinates(
          anchor.baseVx + motionOffset.dx,
          anchor.baseVy + motionOffset.dy,
          width,
          height
        );

        const labelWidth = isCompactScreen ? 170 : 235;
        const labelHeight = isCompactScreen ? 68 : 88;

        let horizontalSpan = isCompactScreen ? width * 0.28 : width * 0.26;
        horizontalSpan = Math.max(140, Math.min(360, horizontalSpan));

        const labelX =
          anchor.side === 'left'
            ? Math.max(12, anchorPoint.x - horizontalSpan - labelWidth)
            : Math.min(width - labelWidth - 12, anchorPoint.x + horizontalSpan);

        let targetY = anchorPoint.y - 20;
        if (anchor.id === 'head-neural') targetY = anchorPoint.y - 55;
        if (anchor.id === 'eyes-visual') targetY = anchorPoint.y - 48;
        if (anchor.id === 'chest-status') targetY = anchorPoint.y - 12;
        if (anchor.id === 'shoulder-biometric') targetY = anchorPoint.y - 24;
        if (anchor.id === 'body-agent-id') targetY = anchorPoint.y + 10;
        if (anchor.id === 'flank-trace') targetY = anchorPoint.y + 8;
        if (anchor.id === 'hand-interface') targetY = anchorPoint.y + 36;
        if (anchor.id === 'lower-network') targetY = anchorPoint.y + 40;

        const labelY = Math.max(48, Math.min(height - labelHeight - 48, targetY));

        return (
          <DecodedBlockCard
            key={`block-${anchor.id}`}
            anchor={anchor}
            isUnlocked={isUnlocked}
            isHovered={isHovered}
            labelX={labelX}
            labelY={labelY}
            labelWidth={labelWidth}
            telemetryTick={telemetryTick}
            onMouseEnter={() => setHoveredId(anchor.id)}
            onMouseLeave={() => setHoveredId(null)}
          />
        );
      })}
    </div>
  );
}
