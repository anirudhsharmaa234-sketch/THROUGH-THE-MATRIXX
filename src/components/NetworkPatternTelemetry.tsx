/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { NetworkDiscoveryState } from '../types/networkDiscovery.ts';

interface NetworkPatternTelemetryProps {
  discoveryState: NetworkDiscoveryState;
}

/**
 * NetworkPatternTelemetry
 *
 * Implements STEP 4: PATTERN DETECTED Technical Information Layer
 *
 * Displays a minimal, technical, cinematic readout within the Network environment.
 * Generates its content strictly from the visitor's actual discovered objects.
 * Never acts as a blocking modal or popup; seamlessly sits inside the 3D HUD overlay.
 */
export default function NetworkPatternTelemetry({
  discoveryState,
}: NetworkPatternTelemetryProps) {
  const [collapsed, setCollapsed] = useState(false);

  const isVisible =
    discoveryState.eventStage === 'pattern_established' ||
    discoveryState.eventStage === 'absorbed';

  if (!isVisible) {
    return null;
  }

  const {
    totalDiscoveries,
    discoveredRecords,
    nodeCount,
    waveCount,
    dataBlockCount,
    structureCount,
    unresolvedConnections,
    carrierFrequency,
    eventStage,
  } = discoveryState;

  // Build dynamic item breakdown summary
  const breakdownParts: string[] = [];
  if (nodeCount > 0) breakdownParts.push(`${nodeCount} ${nodeCount === 1 ? 'NODE' : 'NODES'}`);
  if (waveCount > 0) breakdownParts.push(`${waveCount} ${waveCount === 1 ? 'SIGNAL' : 'SIGNALS'}`);
  if (dataBlockCount > 0)
    breakdownParts.push(`${dataBlockCount} ${dataBlockCount === 1 ? 'DATA CELL' : 'DATA CELLS'}`);
  if (structureCount > 0)
    breakdownParts.push(`${structureCount} ${structureCount === 1 ? 'STRUCTURE' : 'STRUCTURES'}`);

  return (
    <aside
      id="network-pattern-telemetry"
      aria-label="Discovery Pattern Telemetry"
      className="absolute top-20 sm:top-28 left-4 sm:left-14 z-30 font-matrix-mono pointer-events-auto select-none transition-all duration-500 ease-out"
      style={{
        animation: 'matrixFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      <div className="relative max-w-[320px] sm:max-w-[380px] bg-black/85 border border-emerald-500/40 backdrop-blur-md px-4 py-3.5 text-xs text-neutral-300 shadow-[0_0_24px_rgba(16,185,129,0.18)]">
        {/* Corner Reticles */}
        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400" />
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400" />
        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400" />
        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400" />

        {/* Header line */}
        <div className="flex items-center justify-between border-b border-emerald-500/25 pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="text-[11px] font-bold tracking-[0.24em] text-emerald-300">
              PATTERN DETECTED
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] tracking-widest text-emerald-400/80 bg-emerald-950/70 px-1.5 py-0.5 border border-emerald-500/30">
              TRACE // 0{totalDiscoveries}
            </span>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-[9px] text-neutral-400 hover:text-emerald-300 hover:border-emerald-400 border border-neutral-700/60 px-1 py-0.5 transition-colors cursor-pointer"
              title={collapsed ? 'Expand details' : 'Collapse telemetry'}
            >
              {collapsed ? '[+]' : '[-]'}
            </button>
          </div>
        </div>

        {!collapsed && (
          <div className="space-y-2.5">
            {/* Discovered composition breakdown */}
            <div className="flex items-baseline justify-between text-[10px] tracking-wider">
              <span className="text-neutral-400">OBJECTS LINKED</span>
              <span className="text-white font-medium">0{totalDiscoveries} UNITS</span>
            </div>

            <div className="text-[10px] text-emerald-400/90 tracking-widest bg-emerald-950/40 p-1.5 border-l-2 border-emerald-400">
              {breakdownParts.join(' • ')}
            </div>

            {/* Sequence route breadcrumbs */}
            <div className="space-y-1">
              <div className="text-[9px] tracking-widest text-neutral-400">PATHWAY TOPOLOGY:</div>
              <div className="flex flex-wrap items-center gap-1 text-[9px] text-emerald-200">
                {discoveredRecords.map((rec, i) => (
                  <span key={rec.id} className="flex items-center gap-1">
                    <span className="bg-emerald-900/30 px-1.5 py-0.5 border border-emerald-500/20">
                      {rec.identifier}
                    </span>
                    {i < discoveredRecords.length - 1 && (
                      <span className="text-emerald-500">→</span>
                    )}
                  </span>
                ))}
                <span className="text-emerald-500">→</span>
                <span className="bg-emerald-800/40 text-emerald-300 px-1.5 py-0.5 border border-emerald-400/40">
                  NEXUS
                </span>
              </div>
            </div>

            {/* System Status Indicators */}
            <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[9px] tracking-widest">
              <div>
                <span className="text-neutral-400 block">SIGNAL PATH</span>
                <span className="text-emerald-400 font-semibold">ESTABLISHED // COHERENT</span>
              </div>
              <div>
                <span className="text-neutral-400 block">CARRIER FREQ</span>
                <span className="text-white font-semibold">{carrierFrequency}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">CENTRAL NEXUS</span>
                <span className="text-emerald-300 font-semibold">
                  {eventStage === 'absorbed' ? 'ABSORBED // RESONATING' : 'CONVERGING...'}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block">UNRESOLVED</span>
                <span className="text-emerald-400/80">0{unresolvedConnections} VECTORS</span>
              </div>
            </div>

            <div className="text-[8.5px] tracking-widest text-neutral-400 italic pt-1 text-center">
              SYSTEM MODIFIED BY VISITOR EXPLORATION // SCROLL CONTINUES
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
