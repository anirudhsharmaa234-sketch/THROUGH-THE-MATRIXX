/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface DeepContextualTextProps {
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

const DEEP_TEXT_CUES: TextCue[] = [
  {
    id: 'deep-init',
    start: 0.08,
    peakStart: 0.12,
    peakEnd: 0.22,
    end: 0.26,
    layer: 'LAYER 02',
    title: 'SUBSTRATE INGRESS',
    detail: 'RECURSIVE DIGITAL VOID',
  },
  {
    id: 'deep-decode',
    start: 0.28,
    peakStart: 0.32,
    peakEnd: 0.44,
    end: 0.48,
    layer: 'DECODE 02',
    title: 'FORMULATION SYNTHESIS',
    detail: 'FUNDAMENTAL LAWS ASSEMBLE',
  },
  {
    id: 'deep-topology',
    start: 0.50,
    peakStart: 0.54,
    peakEnd: 0.66,
    end: 0.70,
    layer: 'TOPOLOGY 02',
    title: '4D TESSERACT MANIFOLD',
    detail: 'HYPERCUBE PROJECTION STABILIZED',
  },
  {
    id: 'deep-neural',
    start: 0.72,
    peakStart: 0.76,
    peakEnd: 0.88,
    end: 0.92,
    layer: 'SYNAPSE 02',
    title: 'NEURAL DATA FILAMENTS',
    detail: 'COHERENT LOGICAL MATRIX ACTIVE',
  },
  {
    id: 'deep-transit',
    start: 0.92,
    peakStart: 0.935,
    peakEnd: 0.948,
    end: 0.958,
    layer: 'TRANSIT 02',
    title: 'SINGULARITY CONVERGENCE',
    detail: 'STANDBY FOR NETWORK INGRESS',
  },
];

export default function DeepContextualText({ progress }: DeepContextualTextProps) {
  const activeCue = DEEP_TEXT_CUES.find(
    (c) => progress >= c.start && progress <= c.end
  );

  if (!activeCue) return null;

  let opacity = 0;
  if (progress < activeCue.peakStart) {
    opacity = (progress - activeCue.start) / (activeCue.peakStart - activeCue.start);
  } else if (progress <= activeCue.peakEnd) {
    opacity = 1;
  } else {
    opacity = 1 - (progress - activeCue.peakEnd) / (activeCue.end - activeCue.peakEnd);
  }

  const clampedOpacity = Math.max(0, Math.min(1, opacity));
  if (clampedOpacity < 0.01) return null;

  return (
    <div
      id="deep-contextual-text-overlay"
      className="fixed bottom-6 sm:bottom-10 left-5 sm:left-10 z-30 pointer-events-none select-none font-matrix-mono transition-opacity duration-150"
      style={{ opacity: clampedOpacity }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shadow-[0_0_6px_#4ade80]" />
        <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#86efac]">
          {activeCue.layer}
        </span>
      </div>
      <h3 className="font-matrix-display text-sm sm:text-base md:text-lg font-bold tracking-[0.2em] text-white uppercase drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
        {activeCue.title}
      </h3>
      <p className="text-[9px] sm:text-[10px] tracking-[0.25em] text-neutral-400 mt-0.5 uppercase">
        {activeCue.detail}
      </p>
    </div>
  );
}
