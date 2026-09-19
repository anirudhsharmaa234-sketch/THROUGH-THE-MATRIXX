/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { NetworkInspectableInfo } from '../data/networkInformationData.ts';

export interface ScreenAnchor {
  x: number;
  y: number;
  visible: boolean;
}

export interface NetworkInformationDisplayHandle {
  updateAnchors: (selected: ScreenAnchor | null, hovered: ScreenAnchor | null) => void;
}

interface NetworkInformationDisplayProps {
  /** Currently hovered inspectable object (if any) */
  hoveredInfo: NetworkInspectableInfo | null;
  /** Currently selected/committed inspectable object */
  selectedInfo: NetworkInspectableInfo | null;
  /** Callback to close or deselect */
  onClose: () => void;
  /** Callback fired once an object has completed its full decode reveal sequence */
  onDiscoveryCommitted?: (id: string) => void;
}

/**
 * NetworkInformationDisplay
 *
 * Implements STEP 3: DISCOVER → TARGET → DECODE → UNDERSTAND
 *
 * Visual Language:
 * - Desktop Hover: Subtle preview pinpoint + tiny identifier (no large cards).
 * - Click / Tap: 3D-projected Pinpoint → Minimal technical connector → 0101 Data Gather / Decode → Readable Information Card.
 * - Mobile: Comfortable tap targets, bottom-anchored or offset responsive card with dynamic connector.
 * - Matrix Aesthetic: Thin technical mono typography, restrained emerald lines, dark translucent backdrops.
 */
const NetworkInformationDisplay = forwardRef<
  NetworkInformationDisplayHandle,
  NetworkInformationDisplayProps
>(function NetworkInformationDisplay({ hoveredInfo, selectedInfo, onClose, onDiscoveryCommitted }, ref) {
  // Decode state machine: 'gathering' -> 'resolving' -> 'revealed'
  const [decodePhase, setDecodePhase] = useState<'gathering' | 'resolving' | 'revealed'>('gathering');
  const [scrambleText, setScrambleText] = useState('');

  // Scroll fade down tracking: when scrolling down, card fades out and closes automatically
  const [scrollFadeOpacity, setScrollFadeOpacity] = useState<number>(1);
  const scrollFadeOpacityRef = useRef<number>(1);
  const scrollFadeOffsetYRef = useRef<number>(0);
  const initialScrollYRef = useRef<number | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Direct DOM refs for 60fps/120fps sync with Three.js camera/scrolling
  const hoverPinpointRef = useRef<HTMLDivElement | null>(null);
  const selectedPinpointRef = useRef<HTMLDivElement | null>(null);
  const connectorPathRef = useRef<SVGPathElement | null>(null);
  const connectorStartDotRef = useRef<SVGCircleElement | null>(null);
  const connectorEndDotRef = useRef<SVGCircleElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Auto-dismiss on scroll: card smoothly fades down over 45px and unmounts, never getting stuck
  useEffect(() => {
    if (!selectedInfo) {
      initialScrollYRef.current = null;
      scrollFadeOpacityRef.current = 1;
      scrollFadeOffsetYRef.current = 0;
      setScrollFadeOpacity(1);
      return;
    }

    initialScrollYRef.current = window.scrollY;
    scrollFadeOpacityRef.current = 1;
    scrollFadeOffsetYRef.current = 0;
    setScrollFadeOpacity(1);

    const handleWindowScroll = () => {
      if (initialScrollYRef.current === null) return;
      const currentY = window.scrollY;
      const delta = Math.abs(currentY - initialScrollYRef.current);
      const fadeDistance = 45;

      if (delta <= 0) {
        scrollFadeOpacityRef.current = 1;
        scrollFadeOffsetYRef.current = 0;
        setScrollFadeOpacity(1);
      } else if (delta < fadeDistance) {
        const ratio = 1 - delta / fadeDistance;
        scrollFadeOpacityRef.current = ratio;
        scrollFadeOffsetYRef.current = (1 - ratio) * 20;
        setScrollFadeOpacity(ratio);
      } else {
        scrollFadeOpacityRef.current = 0;
        scrollFadeOffsetYRef.current = 20;
        setScrollFadeOpacity(0);
        onCloseRef.current();
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [selectedInfo?.id]);

  // Imperative handle called every frame by Three.js render loop
  useImperativeHandle(ref, () => ({
    updateAnchors: (selected: ScreenAnchor | null, hovered: ScreenAnchor | null) => {
      const currentOpacity = scrollFadeOpacityRef.current;
      const currentOffsetY = scrollFadeOffsetYRef.current;

      // 1. Update Hover Preview Pinpoint
      if (hoverPinpointRef.current) {
        if (hovered && hovered.visible && !selected) {
          hoverPinpointRef.current.style.display = 'block';
          hoverPinpointRef.current.style.transform = `translate3d(${hovered.x}px, ${hovered.y}px, 0)`;
        } else {
          hoverPinpointRef.current.style.display = 'none';
        }
      }

      // 2. Update Selected Pinpoint, Connector & Card
      if (selectedPinpointRef.current) {
        if (selected && selected.visible && currentOpacity > 0) {
          selectedPinpointRef.current.style.display = 'block';
          selectedPinpointRef.current.style.opacity = String(currentOpacity);
          selectedPinpointRef.current.style.transform = `translate3d(${selected.x}px, ${selected.y}px, 0)`;

          // Compute Card & Connector coordinates
          const winW = window.innerWidth;
          const winH = window.innerHeight;
          const isMobile = winW < 768;

          let cardX = 0;
          let cardY = 0;
          const cardW = isMobile ? Math.min(330, winW - 32) : 340;
          const cardH = 210;

          if (isMobile) {
            cardX = Math.max(16, (winW - cardW) / 2);
            cardY = Math.max(80, winH - 260);
          } else {
            cardX = selected.x + 45;
            cardY = selected.y - 60;

            if (cardX + cardW > winW - 30) {
              cardX = selected.x - cardW - 45;
            }
            if (cardX < 30) {
              cardX = 30;
            }
            if (cardY + cardH > winH - 60) {
              cardY = winH - cardH - 60;
            }
            if (cardY < 90) {
              cardY = 90;
            }
          }

          if (cardRef.current) {
            cardRef.current.style.display = 'block';
            cardRef.current.style.opacity = String(currentOpacity);
            cardRef.current.style.transform = `translate3d(${cardX}px, ${cardY + currentOffsetY}px, 0)`;
          }

          // Connector Line start & end
          const startX = selected.x;
          const startY = selected.y;
          let endX = cardX;
          let endY = cardY + 24;
          if (cardX < selected.x) {
            endX = cardX + cardW;
          }

          if (connectorPathRef.current) {
            connectorPathRef.current.style.display = 'block';
            connectorPathRef.current.style.opacity = String(currentOpacity);
            const midX = startX + (endX - startX) * 0.45;
            connectorPathRef.current.setAttribute(
              'd',
              `M ${startX} ${startY} L ${midX} ${startY} L ${endX} ${endY}`
            );
          }
          if (connectorStartDotRef.current) {
            connectorStartDotRef.current.style.display = 'block';
            connectorStartDotRef.current.style.opacity = String(currentOpacity);
            connectorStartDotRef.current.setAttribute('cx', `${startX}`);
            connectorStartDotRef.current.setAttribute('cy', `${startY}`);
          }
          if (connectorEndDotRef.current) {
            connectorEndDotRef.current.style.display = 'block';
            connectorEndDotRef.current.style.opacity = String(currentOpacity);
            connectorEndDotRef.current.setAttribute('cx', `${endX}`);
            connectorEndDotRef.current.setAttribute('cy', `${endY}`);
          }
        } else {
          selectedPinpointRef.current.style.display = 'none';
          if (cardRef.current) cardRef.current.style.display = 'none';
          if (connectorPathRef.current) connectorPathRef.current.style.display = 'none';
          if (connectorStartDotRef.current) connectorStartDotRef.current.style.display = 'none';
          if (connectorEndDotRef.current) connectorEndDotRef.current.style.display = 'none';
        }
      }
    },
  }));

  // Handle decode sequence whenever selectedInfo changes
  useEffect(() => {
    if (!selectedInfo) {
      setDecodePhase('gathering');
      setScrambleText('');
      return;
    }

    setDecodePhase('gathering');
    const chars = '0101100101010101110010101010010101101010101010110101010101010101010110101';
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      let rand = '';
      for (let i = 0; i < 28; i++) {
        rand += chars[Math.floor(Math.random() * chars.length)];
      }
      setScrambleText(rand);

      if (frame === 6) {
        setDecodePhase('resolving');
      }
      if (frame >= 11) {
        clearInterval(interval);
        setDecodePhase('revealed');
        if (selectedInfo?.id) {
          onDiscoveryCommitted?.(selectedInfo.id);
        }
      }
    }, 35);

    return () => clearInterval(interval);
  }, [selectedInfo?.id]);

  return (
    <div
      id="network-information-system"
      aria-label="Network Information System"
      className="absolute inset-0 pointer-events-none select-none z-30 font-matrix-mono overflow-hidden"
    >
      {/* -------------------------------------------------------------------- */}
      {/* 1. DESKTOP HOVER: PREVIEW PINPOINT + TINY IDENTIFIER                 */}
      {/* -------------------------------------------------------------------- */}
      <div
        ref={hoverPinpointRef}
        id="network-hover-preview"
        style={{ display: 'none' }}
        className="absolute pointer-events-none will-change-transform"
      >
        {hoverInfoTag(hoveredInfo)}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 2. COMMITTED PINPOINT ON OBJECT 3D POSITION                          */}
      {/* -------------------------------------------------------------------- */}
      <div
        ref={selectedPinpointRef}
        id="network-selected-pinpoint"
        style={{ display: 'none' }}
        className="absolute pointer-events-none will-change-transform"
      >
        <div className="relative -top-3.5 -left-3.5 w-7 h-7 flex items-center justify-center">
          {/* Precision Crosshair Bracket */}
          <div className="absolute inset-0 border border-emerald-400/70 rounded-full animate-spin-slow" />
          <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#86efac]" />
          {/* Micro Corner Ticks */}
          <div className="absolute -top-1 left-3 w-1 h-1 border-t border-emerald-300" />
          <div className="absolute -bottom-1 left-3 w-1 h-1 border-b border-emerald-300" />
          <div className="absolute top-3 -left-1 w-1 h-1 border-l border-emerald-300" />
          <div className="absolute top-3 -right-1 w-1 h-1 border-r border-emerald-300" />
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 3. DYNAMIC TECHNICAL CONNECTOR LINE (SVG)                            */}
      {/* -------------------------------------------------------------------- */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      >
        <path
          ref={connectorPathRef}
          fill="none"
          stroke="rgba(74, 222, 128, 0.75)"
          strokeWidth="1"
          strokeDasharray="4 3"
          style={{ display: 'none' }}
        />
        <circle
          ref={connectorStartDotRef}
          r="3"
          fill="#86efac"
          style={{ display: 'none' }}
        />
        <circle
          ref={connectorEndDotRef}
          r="2.5"
          fill="#4ade80"
          style={{ display: 'none' }}
        />
      </svg>

      {/* -------------------------------------------------------------------- */}
      {/* 4. INFORMATION CARD WITH 0101 DATA DECODE EFFECT                     */}
      {/* -------------------------------------------------------------------- */}
      {selectedInfo && (
        <>
          {/* Backdrop: Touching anywhere outside immediately dismisses without blocking */}
          <div
            id="network-info-backdrop"
            onClick={onClose}
            onTouchStart={onClose}
            className="fixed inset-0 z-10 pointer-events-auto bg-black/20 backdrop-blur-[1px] cursor-pointer"
            aria-hidden="true"
          />

          <div
            ref={cardRef}
            id={`network-info-card-${selectedInfo.id}`}
            style={{ display: 'none' }}
            className="absolute pointer-events-auto w-[310px] sm:w-[340px] rounded border border-emerald-500/40 bg-black/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(34,197,94,0.2)] text-emerald-300 overflow-hidden z-20 will-change-transform animate-matrix-pop-in"
          >
            {/* Header Strip with Decode State & Dismiss Button */}
            <div className="px-3.5 py-2 border-b border-emerald-500/25 bg-emerald-950/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-semibold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{selectedInfo.identifier}</span>
                <span className="text-white/30">•</span>
                <span className="text-[9px] text-emerald-300/80 uppercase">
                  {decodePhase === 'gathering'
                    ? 'GATHERING...'
                    : decodePhase === 'resolving'
                    ? 'DECODING...'
                    : 'SYNCHRONIZED'}
                </span>
              </div>

              <button
                id="network-info-close-btn"
                type="button"
                onClick={onClose}
                className="text-[11px] text-emerald-500/70 hover:text-emerald-300 hover:bg-emerald-900/40 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                title="Close (or simply scroll down to dismiss)"
              >
                [×]
              </button>
            </div>

          {/* Card Content Body */}
          <div className="p-3.5 flex flex-col gap-2.5 text-xs">
            {/* Type & Status */}
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-emerald-500/70">
                TYPE // STATUS
              </div>
              <div className="text-white text-[12px] font-medium tracking-[0.06em] flex items-center gap-2">
                <span>{selectedInfo.typeLabel}</span>
                <span className="text-white/20">|</span>
                <span className="text-[10px] text-emerald-400 tracking-[0.14em]">
                  {selectedInfo.status}
                </span>
              </div>
            </div>

            {/* Function Description / Decode Transition */}
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-emerald-500/70 mb-1">
                FUNCTION
              </div>
              {decodePhase !== 'revealed' ? (
                <div className="text-[11px] text-emerald-400/90 font-mono tracking-[0.12em] bg-emerald-950/20 p-2 rounded border border-emerald-500/20 min-h-[52px] break-all leading-relaxed">
                  <span className="text-white/40">// [BITSTREAM]</span> {scrambleText}
                </div>
              ) : (
                <p className="text-[11px] leading-relaxed text-neutral-200 tracking-[0.02em] font-sans font-normal">
                  {selectedInfo.functionDesc}
                </p>
              )}
            </div>

            {/* Technical Metrics Grid (Appears on Reveal) */}
            {decodePhase === 'revealed' && (
              <div className="pt-2 border-t border-emerald-500/20 grid grid-cols-2 gap-2 text-[10px]">
                {selectedInfo.metrics.map((metric, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-[0.16em] text-emerald-500/60">
                      {metric.label}
                    </span>
                    <span className="text-white/90 font-mono tracking-[0.05em] truncate">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Micro Corner Framing Reticles */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-400/80 pointer-events-none" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-400/80 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-400/80 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-400/80 pointer-events-none" />
        </div>
        </>
      )}
    </div>
  );
});

function hoverInfoTag(hoveredInfo: NetworkInspectableInfo | null) {
  if (!hoveredInfo) return null;
  return (
    <>
      <div className="relative -top-3 -left-3 w-6 h-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-emerald-400/50 animate-ping opacity-75" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/90 shadow-[0_0_8px_#4ade80]" />
      </div>

      <div className="absolute top-[-18px] left-5 whitespace-nowrap px-2 py-0.5 rounded bg-black/85 border border-emerald-500/40 text-[10px] tracking-[0.16em] text-emerald-300 backdrop-blur-sm flex items-center gap-1.5 shadow-[0_0_12px_rgba(34,197,94,0.25)]">
        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
        <span>{hoveredInfo.identifier}</span>
        <span className="text-emerald-500/60 text-[9px]">// TARGET</span>
      </div>
    </>
  );
}

export default NetworkInformationDisplay;
