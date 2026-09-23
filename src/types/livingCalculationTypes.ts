/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export type CalculationConstructId =
  | 'sigma-convergence'
  | 'nabla-gradient'
  | 'lambda-spectral'
  | 'integral-accumulation'
  | 'pi-metric'
  | 'delta-differential'
  | 'partial-flux'
  | 'infinity-limit';

export type CalculationDepthTier = 'foreground' | 'midground' | 'background';

export type CalculationPhase =
  | 'ambient'
  | 'attracting'
  | 'connecting'
  | 'geometry_reacting'
  | 'stabilizing'
  | 'decaying';

export interface CalculationConstructConfig {
  id: CalculationConstructId;
  symbol: string;
  equation: string;
  subEquation: string;
  category: string;
  role: string;
  depthTier: CalculationDepthTier;
  anchorPosition: THREE.Vector3;
  colorHex: number;
  highlightColorHex: number;
  dataPointCount: number;
  variableTokens: string[];
}

export interface DataParticle {
  basePosition: THREE.Vector3;
  currentPosition: THREE.Vector3;
  velocity: THREE.Vector3;
  targetConvergencePos: THREE.Vector3;
  scale: number;
  alpha: number;
  phaseOffset: number;
  variableText: string;
  driftRadius: number;
}

export interface ActiveCalculationState {
  constructId: CalculationConstructId;
  phase: CalculationPhase;
  phaseProgress: number; // 0.0 to 1.0 within the current phase
  totalTimeElapsed: number; // in seconds since trigger
  totalDuration: number; // total duration of the cinematic calculation sequence (~2.6s)
  isHovered: boolean;
  isSelected: boolean;
  activationIntensity: number; // 0.0 to 1.0 smoothly lerped
  hoverIntensity: number; // 0.0 to 1.0 smoothly lerped
}

export interface CalculationConstructRuntime {
  config: CalculationConstructConfig;
  group: THREE.Group;
  symbolMesh: THREE.Mesh;
  symbolTexture: THREE.CanvasTexture;
  symbolCanvas: HTMLCanvasElement;
  symbolContext: CanvasRenderingContext2D | null;
  geometryGroup: THREE.Group;
  geometryMesh: THREE.Object3D;
  dataPointsMesh: THREE.Points;
  dataPointsGeo: THREE.BufferGeometry;
  dataParticles: DataParticle[];
  connectingLinesMesh: THREE.LineSegments;
  connectingLinesGeo: THREE.BufferGeometry;
  state: ActiveCalculationState;
  hitCollider: THREE.Mesh;
  floatingTextSprites: THREE.Sprite[];
}

export type DimensionalFoldPhase =
  | 'idle'
  | 'aligning'
  | 'compressing'
  | 'folding'
  | 'reconstructing'
  | 'stabilized';

export interface DimensionalFoldMetrics {
  phase: DimensionalFoldPhase;
  alignmentFactor: number;       // 0.0 to 1.0 (aligns scattered data & pathways)
  compressionFactor: number;     // 0.0 to 1.0 (collapses Z depth 3D -> 2D plane)
  foldFactor: number;            // 0.0 to 1.0 (bends & folds the manifold, redefining distance)
  reconstructionFactor: number;  // 0.0 to 1.0 (rebuilds into new spatial configuration)
  metricDistance: number;        // in units, e.g. 580u -> 42u
  isFoldActive: boolean;
}

export type RecursiveDepthLevel = 0 | 1 | 2 | 3;

export type RecursivePhase =
  | 'dormant'
  | 'approaching'
  | 'penetrating_1'
  | 'depth_1'
  | 'penetrating_2'
  | 'depth_2'
  | 'penetrating_3'
  | 'depth_3';

export interface RecursiveDeepMetrics {
  currentDepth: RecursiveDepthLevel;
  phase: RecursivePhase;
  activeCoreId: 'RECURSIVE_CORE_01' | 'RECURSIVE_CORE_02' | 'RECURSIVE_CORE_03' | null;
  invitationFactor: number;        // 0.0 to 1.0 (subtle quietening, data streams orienting toward core)
  boundaryPenetration: number;     // 0.0 to 1.0 (particles rushing past lens, optical shift)
  internalExpansionFactor: number; // 1.0 to 12.0 (impossible scale factor)
  selfSimilarityIndex: number;     // 0.0 to 1.0 (geometric resonance between recursive tiers)
  isRecursiveActive: boolean;
  depthLabel: string;              // e.g. "DEPTH // 01", "DEPTH // 02", "DEPTH // 03"
  modelLabel: string;              // e.g. "SPATIAL MODEL // NESTED", "MODEL // SELF-SIMILAR"
}

export type MaterializationStage =
  | 'dormant'
  | 'stage1_equation'
  | 'stage2_particles'
  | 'stage3_skeleton'
  | 'stage4_geometry'
  | 'stage5_surface'
  | 'stage6_activated';

export interface PhysicalMaterializationMetrics {
  stage: MaterializationStage;
  stageProgress: number;          // 0.0 to 1.0 within current stage
  overallProgress: number;        // 0.0 to 1.0 across the materialization sequence
  symbolSeparation: number;       // 0.0 to 1.0 (equations separating into particles)
  particleConvergence: number;    // 0.0 to 1.0 (particles converging to 3D nodal coordinates)
  wireframeIntegrity: number;     // 0.0 to 1.0 (skeleton edges and coordinate lines forming)
  surfaceDensity: number;         // 0.0 to 1.0 (physical facets and material solidifying)
  activationPulse: number;        // 0.0 to 1.0 (internal core system illumination)
  hoverIntensity: number;         // 0.0 to 1.0 (visitor interaction reaction)
  isMaterializationActive: boolean;
  stageName: string;              // e.g. "STAGE 01 // EQUATION", "STAGE 05 // PHYSICAL SURFACE"
  statusLabel: string;            // e.g. "EQUATION → PHYSICAL REALITY", "PHYSICAL OBJECT STABILIZED"
  equationOrigin: string;         // e.g. "ĤΨ = iħ∂Ψ/∂t • ∑λ_k"
}

// ----------------------------------------------------------------------------
// STEP 5: THE IMPOSSIBLE SOLUTION METRICS & PHASES
// ----------------------------------------------------------------------------

export type ImpossibleSolutionPhase =
  | 'dormant'
  | 'convergence_buildup'     // 0.938 -> 0.954: scattered elements align, equations synchronize, recursive structures converge
  | 'impossible_state'        // 0.954 -> 0.968: non-Euclidean topological inversion, multiple layers exist simultaneously
  | 'calculation_halted'      // 0.968 -> 0.982: system stops calculating, particles slow, noise reduces, DEEP SYSTEM STATE // CONVERGED
  | 'network_genesis'         // 0.982 -> 0.996: structured signal radiates, dividing into network topology conduits
  | 'network_handoff';        // 0.996 -> 1.000: seamless bridge into Section 3 Network

export interface ImpossibleSolutionMetrics {
  phase: ImpossibleSolutionPhase;
  phaseProgress: number;          // 0.0 to 1.0 within current phase
  convergenceFactor: number;      // 0.0 to 1.0 (how tightly all deep systems align to the monolith)
  impossibleFactor: number;       // 0.0 to 1.0 (intensity of the non-Euclidean topological inversion)
  calculationStability: number;   // 0.0 to 1.0 (drop in noise, turbulent movement settling into answer)
  networkTopologyGenesis: number; // 0.0 to 1.0 (radiation of the network conduits into space)
  isSolutionActive: boolean;
  isImpossibleResolved: boolean;  // true once solution is resolved
  stateIndicator: string;         // e.g. "DEEP SYSTEM // STATE // CONVERGED"
  subReadout: string;             // e.g. "SOLUTION // RESOLVED"
}
