/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import NetworkFlowBackground from './NetworkFlowBackground.tsx';
import NetworkSpatialEnvironment from './NetworkSpatialEnvironment.tsx';
import NetworkTitle from './NetworkTitle.tsx';
import NetworkAtmosphereOverlay from './NetworkAtmosphereOverlay.tsx';
import NetworkInformationDisplay, {
  NetworkInformationDisplayHandle,
  ScreenAnchor,
} from './NetworkInformationDisplay.tsx';
import NetworkConvergenceFlash from './NetworkConvergenceFlash.tsx';
import NetworkPatternTelemetry from './NetworkPatternTelemetry.tsx';
import { useNetworkDiscovery } from '../utils/useNetworkDiscovery.ts';
import { NETWORK_INFORMATION_REGISTRY } from '../data/networkInformationData.ts';

export interface Section3NetworkSequenceProps {
  /**
   * Scroll progress supplied by unified master timeline in App.tsx (0.0 to 1.0).
   */
  controlledProgress?: number;
  /**
   * Overall section opacity for timeline cross-fades.
   */
  opacity?: number;
  /**
   * Whether running embedded inside App.tsx or standalone.
   */
  isEmbedded?: boolean;
}

/**
 * Section3NetworkSequence — "THE NETWORK" (LAYER 03)
 *
 * Conceptual Translation:
 * - SURFACE = THE WORLD
 * - DEEP = THE INTELLIGENCE
 * - NETWORK = THE CONNECTIONS
 *
 * STEP 4: THE NETWORK REMEMBERS YOUR DISCOVERIES
 * - Session-level discovery tracking of explored nodes, waves, and data blocks
 * - Threshold: after 3 discoveries, triggers a tranquil memory event
 * - Quiets ambient background, illuminates discovered objects
 * - Reveals hidden Catmull-Rom pathway with flowing particles to Central Entity
 * - Displays minimal technical pattern telemetry (dynamic breakdown)
 * - Central Entity absorbs discovered intelligence and resonates with complex harmonics
 */
export default function Section3NetworkSequence({
  controlledProgress,
  opacity = 1,
  isEmbedded = false,
}: Section3NetworkSequenceProps) {
  // Standalone scroll management when tested independently
  const [standaloneProgress, setStandaloneProgress] = useState(0);

  // Active interactive selection and hover states
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const infoDisplayRef = useRef<NetworkInformationDisplayHandle | null>(null);

  // Convergence & Flash states
  const [convergenceIntensity, setConvergenceIntensity] = useState<number>(0);
  const [flashTimestamp, setFlashTimestamp] = useState<number>(0);

  // Step 4: The Network Remembers Your Discoveries
  const { discoveryState, recordDiscovery } = useNetworkDiscovery();

  const handleUpdateAnchors = useCallback((selected: ScreenAnchor | null, hovered: ScreenAnchor | null) => {
    if (infoDisplayRef.current) {
      infoDisplayRef.current.updateAnchors(selected, hovered);
    }
  }, []);

  const handleTriggerFlash = useCallback(() => {
    setFlashTimestamp(Date.now());
  }, []);

  const selectedInfo = selectedId ? NETWORK_INFORMATION_REGISTRY[selectedId] || null : null;
  const hoveredInfo = hoveredId ? NETWORK_INFORMATION_REGISTRY[hoveredId] || null : null;

  useEffect(() => {
    if (isEmbedded) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setStandaloneProgress(Math.min(1, Math.max(0, scrollY / totalScroll)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isEmbedded]);

  const effectiveProgress = isEmbedded
    ? Math.max(0, Math.min(1, controlledProgress ?? 0))
    : standaloneProgress;

  // Auto-close any open information panel when entering convergence zone (> 0.88)
  useEffect(() => {
    if (effectiveProgress >= 0.88 && selectedId !== null) {
      setSelectedId(null);
    }
  }, [effectiveProgress, selectedId]);

  if (opacity <= 0.001) {
    return null;
  }

  return (
    <section
      id="section3-network-sequence"
      aria-label="Section 3: The Network (Layer 03)"
      style={{ opacity }}
      className={`fixed inset-0 w-full h-full pointer-events-none select-none overflow-hidden bg-black transition-opacity duration-150 ${
        isEmbedded ? 'z-20' : 'z-10'
      }`}
    >
      {/* 
        LAYER 1: Ambient Black Base / Void
        Guarantees pitch-black continuity when entering from DEEP's ending 
      */}
      <div className="absolute inset-0 w-full h-full bg-[#000000] pointer-events-none z-0" />

      {/* 
        LAYER 2: Ambient Flow Loop (Google Flow AI Background)
        Continuously loops, independent of scroll, sitting behind the 3D structures
      */}
      <NetworkFlowBackground scrollProgress={effectiveProgress} />

      {/* 
        LAYER 3: Massive 3D Spatial Network Environment (Three.js WebGL)
        Scroll-controlled nodes, branching pathways, pulses, structures, and travelling elements
      */}
      <NetworkSpatialEnvironment
        scrollProgress={effectiveProgress}
        selectedId={selectedId}
        hoveredId={hoveredId}
        onSelectId={setSelectedId}
        onHoverId={setHoveredId}
        onUpdateAnchors={handleUpdateAnchors}
        onConvergenceChange={setConvergenceIntensity}
        onTriggerFlash={handleTriggerFlash}
        discoveredIds={discoveryState.discoveredIds}
        discoveryEventStage={discoveryState.eventStage}
        discoveryStageProgress={discoveryState.stageProgress}
      />

      {/* 
        LAYER 4: Section Architectural Identity (THE NETWORK // LAYER 03)
        Emerges during the reveal, establishing the architectural layer
      */}
      <NetworkTitle scrollProgress={effectiveProgress} />

      {/* 
        LAYER 5: Network Atmosphere & Telemetry Overlay
        Telemetry counters, coordinate reticles, phase indicator, and discovery tally
      */}
      <NetworkAtmosphereOverlay
        scrollProgress={effectiveProgress}
        discoveryCount={discoveryState.totalDiscoveries}
        discoveryPatternActive={discoveryState.eventStage === 'pattern_established' || discoveryState.eventStage === 'absorbed'}
      />

      {/* 
        LAYER 6: Network Information System (HUD Overlay)
        3D Pinpoint, dynamic technical connector line, 0101 decode stream, and technical info card
      */}
      <NetworkInformationDisplay
        ref={infoDisplayRef}
        hoveredInfo={hoveredInfo}
        selectedInfo={selectedInfo}
        onClose={() => setSelectedId(null)}
        onDiscoveryCommitted={recordDiscovery}
      />

      {/* 
        LAYER 6b: Discovery Pattern Telemetry Layer (STEP 4: NETWORK REMEMBERS)
        Minimal technical information layer for established hidden relationships
      */}
      <NetworkPatternTelemetry discoveryState={discoveryState} />

      {/* 
        LAYER 7: Final Convergence & Cinematic Flash (STEP 4)
        Green Energy Surge -> White Core Overload -> Immediate return to Network state
      */}
      <NetworkConvergenceFlash
        convergenceIntensity={convergenceIntensity}
        flashTriggerTimestamp={flashTimestamp}
      />

      {/* 
        Near-Black Void Mask at early scroll (< 0.12)
        Ensures 100% pure black opening as user scrolls into the section 
      */}
      {effectiveProgress < 0.12 && (
        <div
          className="absolute inset-0 w-full h-full bg-black pointer-events-none z-40 transition-opacity duration-100"
          style={{
            opacity: Math.max(0, 1 - effectiveProgress / 0.12),
          }}
        />
      )}
    </section>
  );
}
