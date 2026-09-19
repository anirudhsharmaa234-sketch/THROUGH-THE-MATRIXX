/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface NetworkTitleProps {
  /**
   * Scroll progress within Section 3 (0.0 to 1.0).
   */
  scrollProgress: number;
}

/**
 * NetworkTitle
 *
 * Directives:
 * - Introduced during the reveal rather than immediately at page load.
 * - Fades in between progress 0.46 and 0.72 as pathways bridge the clusters.
 * - Architectural / technical typography: crisp geometric tracking, hairline brackets,
 *   subtle technical badges, and layer indicators.
 */
export default function NetworkTitle({ scrollProgress }: NetworkTitleProps) {
  // Title emerges once pathways start forming (0.45 -> 0.70) and stays established
  let opacity = 0;
  let translateY = 14;
  let letterSpacingScale = 0.38;

  if (scrollProgress >= 0.42) {
    const t = Math.min(1, (scrollProgress - 0.42) / 0.22);
    opacity = t;
    translateY = (1 - t) * 14;
    letterSpacingScale = 0.38 + (1 - t) * 0.12;
  }

  if (opacity <= 0.01) {
    return null;
  }

  return (
    <div
      id="network-identity-block"
      aria-label="Section 3: The Network"
      className="absolute top-20 sm:top-24 left-6 sm:left-14 z-20 pointer-events-none select-none transition-all duration-150 ease-out"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* Top Architectural Subtitle / Layer Index */}
      <div className="flex items-center gap-3 mb-2 font-matrix-mono text-[10px] sm:text-[11px] tracking-[0.24em] text-emerald-400/80">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-xs shadow-[0_0_8px_#4ade80]" />
        <span className="font-semibold uppercase text-emerald-300">LAYER 03</span>
        <span className="text-white/20">|</span>
        <span className="text-emerald-500/70 tracking-[0.2em] hidden xs:inline">
          DISTRIBUTED_SYNAPSE_FABRIC
        </span>
      </div>

      {/* Main Architectural Heading */}
      <div className="relative">
        <h1
          className="font-matrix-display text-3xl sm:text-5xl lg:text-6xl font-bold uppercase text-white tracking-[0.28em] sm:tracking-[0.34em]"
          style={{
            letterSpacing: `${letterSpacingScale}em`,
            textShadow: '0 0 24px rgba(74, 222, 128, 0.25), 0 0 48px rgba(34, 197, 94, 0.12)',
          }}
        >
          THE NETWORK
        </h1>

        {/* Hairline Accent Divider */}
        <div className="mt-3 flex items-center gap-3">
          <div className="h-[1px] w-24 sm:w-40 bg-gradient-to-r from-emerald-400 to-transparent" />
          <span className="font-matrix-mono text-[9px] sm:text-[10px] text-emerald-400/50 tracking-[0.2em]">
            [ SEC_03 // ROUTING_TOPOLOGY ]
          </span>
        </div>
      </div>

      {/* Conceptual Descriptor */}
      <p className="mt-2.5 max-w-sm sm:max-w-md font-matrix-mono text-[11px] sm:text-[12px] text-neutral-400/90 leading-relaxed tracking-wide">
        From isolated intelligence to interconnected systems. The spatial mesh where autonomous
        computational nodes synchronize.
      </p>
    </div>
  );
}
