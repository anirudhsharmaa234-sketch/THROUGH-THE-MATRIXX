/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface VerticalProgressProps {
  progress: number; // 0.0 to 1.0
  sectionCode?: string;
  sectionLabel?: string;
}

export default function VerticalProgress({
  progress,
  sectionCode = '01',
  sectionLabel = 'SURFACE',
}: VerticalProgressProps) {
  // Clamped progress percentage
  const pct = Math.max(0, Math.min(100, Math.round(progress * 100)));
  const trackHeight = 72; // px
  const pipY = Math.min(trackHeight, Math.max(0, progress * trackHeight));

  // Fade out Section 1 indicator during end void phase so it doesn't linger into Section 2
  let opacity = 1;
  if (sectionCode === '01' && progress >= 0.97) {
    opacity = Math.max(0, (1.0 - progress) / 0.03);
  }
  // Fade out Section 2 indicator during end white flash / complete black void transition
  if (sectionCode === '02' && progress >= 0.945) {
    opacity = Math.max(0, (0.970 - progress) / 0.025);
  }
  if (opacity <= 0.01) {
    return null;
  }

  return (
    <aside
      id={`cinematic-vertical-progress-${sectionCode}`}
      aria-label="Section Scroll Progress"
      data-about-id="vertical-progress"
      title="Tap to view Dimensional Depth Telemetry"
      style={{ opacity }}
      className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 pointer-events-auto cursor-pointer select-none flex flex-col items-center gap-2 font-matrix-mono transition-all duration-150 hover:brightness-125"
    >
      {/* Section Code Index */}
      <span className="text-[10px] sm:text-[11px] font-semibold text-[#86efac] tracking-[0.2em]">
        {sectionCode}
      </span>

      {/* Hairline Progress Track */}
      <div
        className="relative w-[1px] bg-white/15 my-1"
        style={{ height: `${trackHeight}px` }}
      >
        {/* Dynamic Progress Indicator Line */}
        <div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#22c55e]/40 to-[#4ade80] transition-[height] duration-75 ease-out"
          style={{ height: `${pipY}px` }}
        />

        {/* Traveling Laser Needle / Pip */}
        <div
          className="absolute -left-[1.5px] w-[4px] h-[4px] rounded-full bg-[#86efac] shadow-[0_0_6px_#4ade80] transition-transform duration-75 ease-out"
          style={{ transform: `translate3d(0, ${pipY}px, 0)` }}
        />
      </div>

      {/* Section Identifier Label */}
      <div className="flex flex-col items-center">
        <span className="text-[9px] tracking-[0.3em] uppercase text-neutral-400/80">
          {sectionLabel}
        </span>
        <span className="text-[8px] tracking-[0.2em] text-[#4ade80]/60 mt-0.5">
          {pct.toString().padStart(2, '0')}%
        </span>
      </div>
    </aside>
  );
}
