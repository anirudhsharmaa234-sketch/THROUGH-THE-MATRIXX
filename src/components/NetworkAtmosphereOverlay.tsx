/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface NetworkAtmosphereOverlayProps {
  /**
   * Scroll progress within Section 3 (0.0 to 1.0).
   */
  scrollProgress: number;
  /**
   * Count of meaningfully discovered network objects
   */
  discoveryCount?: number;
  /**
   * Whether the hidden relationship pattern is established
   */
  discoveryPatternActive?: boolean;
}

/**
 * NetworkAtmosphereOverlay
 *
 * Provides architectural framing, telemetry coordinates, and dynamic phase readouts
 * that reflect the waking up of the network without cluttering the spatial field.
 */
export default function NetworkAtmosphereOverlay({
  scrollProgress,
  discoveryCount = 0,
  discoveryPatternActive = false,
}: NetworkAtmosphereOverlayProps) {
  // Emerges smoothly starting at 0.12
  let opacity = 0;
  if (scrollProgress >= 0.12) {
    opacity = Math.min(1, (scrollProgress - 0.12) / 0.2);
  }

  if (opacity <= 0.01) {
    return null;
  }

  // Dynamic phase title matching prompt progression:
  // isolated signals -> first connection -> pathways forming -> systems interconnected -> network established
  let phaseText = 'ISOLATED_SIGNALS // DISCOVERY';
  let phaseCode = 'PHASE_01';
  let activeNodes = Math.min(18, Math.max(1, Math.round(scrollProgress * 24)));
  let pathwayCount = 0;

  if (scrollProgress < 0.22) {
    phaseText = 'ISOLATED_SIGNALS // SEARCHING';
    phaseCode = 'PHASE_01';
    pathwayCount = 0;
  } else if (scrollProgress < 0.38) {
    phaseText = 'FIRST_CONNECTION // SYNAPSE_IGNITION';
    phaseCode = 'PHASE_02';
    pathwayCount = Math.round(((scrollProgress - 0.22) / 0.16) * 4);
  } else if (scrollProgress < 0.54) {
    phaseText = 'TOPOLOGY_EXPANSION // PATHWAYS_EXTENDING';
    phaseCode = 'PHASE_03';
    pathwayCount = 4 + Math.round(((scrollProgress - 0.38) / 0.16) * 7);
  } else if (scrollProgress < 0.72) {
    phaseText = 'SYSTEMS_INTERCONNECTED // BACKBONE_ONLINE';
    phaseCode = 'PHASE_04';
    pathwayCount = 11 + Math.round(((scrollProgress - 0.54) / 0.18) * 6);
  } else {
    phaseText = 'THE_NETWORK_ESTABLISHED // GLOBAL_CONVERGENCE';
    phaseCode = 'PHASE_05';
    pathwayCount = 24;
    activeNodes = 18;
  }

  return (
    <div
      id="network-atmosphere-overlay"
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none z-20 font-matrix-mono transition-opacity duration-200"
      style={{ opacity }}
    >
      {/* Bottom-left Phase & Telemetry Monitor */}
      <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-14 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-emerald-400/90">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">{phaseCode}</span>
          <span className="text-white/30">•</span>
          <span className="text-emerald-400">{phaseText}</span>
        </div>

        <div className="flex items-center gap-4 text-[9px] sm:text-[10px] text-neutral-400 tracking-[0.16em]">
          <span>CORE: CENTRAL_ENTITY // ACTIVE</span>
          <span className="text-white/20">|</span>
          <span>NODES: {activeNodes}/18</span>
          <span className="text-white/20">|</span>
          <span>PATHWAYS: {pathwayCount}/24</span>
          {discoveryCount > 0 && (
            <>
              <span className="text-white/20">|</span>
              <span className={discoveryPatternActive ? 'text-emerald-300 font-semibold' : 'text-neutral-300'}>
                DISCOVERED: {discoveryCount}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Top-right Spatial Reference Coordinate Brackets */}
      <div className="absolute top-20 sm:top-24 right-6 sm:right-14 text-right hidden md:flex flex-col gap-1 text-[9px] tracking-[0.2em] text-emerald-500/60">
        <div>TOPOLOGY: 3D_SPATIAL_MESH</div>
        <div>COORDINATES: [-220, +090, +160]</div>
        <div>DATA_PACKETS: STREAMING</div>
      </div>

      {/* Subtle Corner Reticles */}
      <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-emerald-500/25 pointer-events-none" />
      <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-emerald-500/25 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-emerald-500/25 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-emerald-500/25 pointer-events-none" />
    </div>
  );
}
