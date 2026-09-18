/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface ContextualTextProps {
  progress: number;
}

interface TextCue {
  id: string;
  start: number;
  peakStart: number;
  peakEnd: number;
  end: number;
  layer: string;
  title: string;
  detail: string;
}

const TEXT_CUES: TextCue[] = [
  {
    id: 'approach',
    start: 0.14,
    peakStart: 0.18,
    peakEnd: 0.34,
    end: 0.39,
    layer: 'LAYER 01',
    title: 'SURFACE',
    detail: 'THRESHOLD OF PERCEPTION',
  },
  {
    id: 'contact',
    start: 0.43,
    peakStart: 0.48,
    peakEnd: 0.62,
    end: 0.67,
    layer: 'LINK 01',
    title: 'NEURAL CONTACT',
    detail: 'VECTOR SYNCHRONIZATION',
  },
  {
    id: 'impact',
    start: 0.70,
    peakStart: 0.74,
    peakEnd: 0.88,
    end: 0.93,
    layer: 'PHASE 01',
    title: 'CONVERGENCE',
    detail: 'ENERGY DISCHARGE COMPLETE',
  },
  {
    id: 'gateway',
    start: 0.94,
    peakStart: 0.96,
    peakEnd: 1.0,
    end: 1.0,
    layer: 'TRANSIT',
    title: 'GATEWAY REACHED',
    detail: 'STANDBY FOR DEEPER ACCESS',
  },
];

export default function ContextualText({ progress }: ContextualTextProps) {
  // Find current active cue
  const activeCue = TEXT_CUES.find(
    (cue) => progress >= cue.start && progress <= cue.end
  );

  if (!activeCue) return null;

  // Calculate smooth fade-in and fade-out factor
  let opacity = 0;
  if (progress < activeCue.peakStart) {
    opacity = (progress - activeCue.start) / (activeCue.peakStart - activeCue.start);
  } else if (progress <= activeCue.peakEnd) {
    opacity = 1;
  } else {
    opacity = 1 - (progress - activeCue.peakEnd) / (activeCue.end - activeCue.peakEnd);
  }

  // Smooth ease curve
  const clampedOpacity = Math.max(0, Math.min(1, opacity));
  const easedOpacity = clampedOpacity * clampedOpacity * (3 - 2 * clampedOpacity);
  const translateY = (1 - easedOpacity) * 8; // Subtle 8px vertical drift

  return (
    <div
      id="cinematic-contextual-overlay"
      aria-live="polite"
      style={{
        opacity: easedOpacity,
        transform: `translate3d(0, ${translateY}px, 0)`,
      }}
      className="fixed bottom-7 sm:bottom-10 left-5 sm:left-10 z-20 pointer-events-none select-none flex flex-col gap-1 transition-transform ease-out will-change-transform"
    >
      {/* Category / Layer Supertitle */}
      <div className="flex items-center gap-2">
        <span className="w-1 h-1 rounded-full bg-[#22c55e]" />
        <span className="font-matrix-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#86efac]">
          {activeCue.layer}
        </span>
      </div>

      {/* Main Narrative Display Title */}
      <h2 className="font-matrix-display text-base sm:text-lg font-bold tracking-[0.22em] uppercase text-neutral-100">
        {activeCue.title}
      </h2>

      {/* Subtitle / Telemetry Detail */}
      <p className="font-matrix-mono text-[9px] sm:text-[10px] tracking-[0.24em] uppercase text-neutral-400/80">
        {activeCue.detail}
      </p>
    </div>
  );
}
