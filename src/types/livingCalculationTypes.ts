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
