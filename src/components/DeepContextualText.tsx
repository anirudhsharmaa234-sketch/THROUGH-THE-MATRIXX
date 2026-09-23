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
    end: 0.25,
    layer: 'LAYER 02',
    title: 'SUBSTRATE INGRESS',
    detail: 'RECURSIVE DIGITAL VOID',
  },
  {
    id: 'deep-decode',
    start: 0.26,
    peakStart: 0.30,
    peakEnd: 0.42,
    end: 0.45,
    layer: 'DECODE 02',
    title: 'FORMULATION SYNTHESIS',
    detail: 'FUNDAMENTAL LAWS ASSEMBLE',
  },
  {
    id: 'deep-living',
    start: 0.46,
    peakStart: 0.50,
    peakEnd: 0.57,
    end: 0.60,
    layer: 'CALCULUS 02',
    title: 'LIVING MATHEMATICS',
    detail: 'ACTIVE GENERATIVE CONSTRUCTS',
  },
  {
    id: 'deep-compression',
    start: 0.58,
    peakStart: 0.61,
    peakEnd: 0.66,
    end: 0.68,
    layer: 'ALIGNMENT 02',
    title: 'SPATIAL COMPRESSION',
    detail: '3D SUBSTRATE COLLAPSES TO PLANAR MANIFOLD',
  },
  {
    id: 'deep-fold',
    start: 0.685,
    peakStart: 0.700,
    peakEnd: 0.718,
    end: 0.725,
    layer: 'DIMENSION 02',
    title: 'DIMENSIONAL FOLD',
    detail: 'GEODESIC WARP // DISTANCE REDEFINED',
  },
  {
    id: 'deep-recursive-core01',
    start: 0.728,
    peakStart: 0.738,
    peakEnd: 0.755,
    end: 0.762,
    layer: 'RECURSION 01',
    title: 'RECURSIVE STRUCTURE // 01',
    detail: 'SPATIAL MODEL // NESTED HORIZON DETECTED',
  },
  {
    id: 'deep-recursive-depth01',
    start: 0.765,
    peakStart: 0.778,
    peakEnd: 0.812,
    end: 0.822,
    layer: 'DEPTH 01',
    title: 'DEPTH // 01',
    detail: 'IMPOSSIBLE SCALE // INTERNAL UNIVERSE REVEALED',
  },
  {
    id: 'deep-mat-stage1',
    start: 0.825,
    peakStart: 0.832,
    peakEnd: 0.845,
    end: 0.849,
    layer: 'SYNTHESIS 01',
    title: 'EQUATION // PRECURSOR',
    detail: 'RAW MATHEMATICAL MATERIAL CONCENTRATES',
  },
  {
    id: 'deep-mat-stage2',
    start: 0.851,
    peakStart: 0.858,
    peakEnd: 0.870,
    end: 0.874,
    layer: 'SYNTHESIS 02',
    title: 'SYMBOLS SEPARATE',
    detail: 'DATA PARTICLES EMERGE FROM EQUATION MATRIX',
  },
  {
    id: 'deep-mat-stage3',
    start: 0.876,
    peakStart: 0.884,
    peakEnd: 0.895,
    end: 0.899,
    layer: 'SYNTHESIS 03',
    title: 'COMPUTATIONAL BLUEPRINT',
    detail: 'PARTICLES CONVERGE // WIREFRAME FORMATION',
  },
  {
    id: 'deep-mat-stage4',
    start: 0.901,
    peakStart: 0.908,
    peakEnd: 0.920,
    end: 0.924,
    layer: 'SYNTHESIS 04',
    title: 'GEOMETRIC COHESION',
    detail: 'FACETED BODY TESSELLATES // DENSITY ACCELERATION',
  },
  {
    id: 'deep-mat-stage5',
    start: 0.926,
    peakStart: 0.932,
    peakEnd: 0.944,
    end: 0.947,
    layer: 'REALITY 01',
    title: 'EQUATION → PHYSICAL REALITY',
    detail: 'THE SYSTEM IS GENERATING REALITY // ARTIFACT STABILIZED',
  },
  {
    id: 'deep-solution-convergence',
    start: 0.948,
    peakStart: 0.951,
    peakEnd: 0.957,
    end: 0.960,
    layer: 'CONVERGENCE 05',
    title: 'ALL PATHWAYS CONVERGE',
    detail: 'SCATTERED EQUATIONS & DATA CURRENTS SYNCHRONIZE',
  },
  {
    id: 'deep-impossible-state',
    start: 0.961,
    peakStart: 0.964,
    peakEnd: 0.970,
    end: 0.972,
    layer: 'IMPOSSIBLE STATE',
    title: 'TOPOLOGICAL INVERSION',
    detail: 'NON-EUCLIDEAN ALIGNMENT // UNIVERSE NESTED IN CORE',
  },
  {
    id: 'deep-solution-resolved',
    start: 0.973,
    peakStart: 0.975,
    peakEnd: 0.982,
    end: 0.984,
    layer: 'STATE // CONVERGED',
    title: 'SOLUTION RESOLVED',
    detail: 'SYSTEM CEASES CALCULATION // ANSWER REACHED',
  },
  {
    id: 'deep-network-genesis',
    start: 0.985,
    peakStart: 0.988,
    peakEnd: 0.997,
    end: 1.000,
    layer: 'NETWORK GENESIS',
    title: 'THE CONNECTIONS EMERGE',
    detail: 'ONE SOLUTION GENERATES THE NETWORK',
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
      data-about-id="contextual-narrative"
      title="Tap to view Cognitive Stream Telemetry"
      className="fixed bottom-6 sm:bottom-10 left-5 sm:left-10 z-30 pointer-events-auto cursor-pointer select-none font-matrix-mono transition-all duration-150 hover:brightness-125"
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
