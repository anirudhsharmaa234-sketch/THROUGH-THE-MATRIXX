/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NodeDepthTier = 'foreground' | 'midground' | 'distant';

export type NodeShapeType =
  | 'polyhedral_core'
  | 'orbital_rings'
  | 'digital_layers'
  | 'crystalline'
  | 'compact_core';

export interface NetworkInformationBlock {
  title: string;
  whatItIs: string;
  whatItDoes: string;
  systemRole: string;
  packetThroughput: string;
  protocol: string;
}

export interface NetworkNodeData {
  id: string; // Stable ID: NODE_001, NODE_002, etc.
  name: string;
  code: string;
  category: string;
  depth: NodeDepthTier;
  shapeType: NodeShapeType;
  position: [number, number, number];
  size: number;
  color: string;
  clusterId: string;
  connections: string[]; // Connected node IDs
  pulseRate: number;
  /** Latent structure prepared for the next step's interaction system */
  pinpoint?: {
    x: number;
    y: number;
    z: number;
    labelOffset?: [number, number];
  };
  connectorLine?: {
    length: number;
    angle: number;
  };
  informationBlock?: NetworkInformationBlock;
}

export interface NetworkPathwayData {
  id: string; // Stable ID: CONNECTION_001, etc.
  sourceId: string;
  targetId: string;
  tier: 'local' | 'inter-cluster' | 'backbone';
  activationThreshold: number; // 0.0 to 1.0 scroll progress when pathway ignites
  pulseCount: number;
  speed: number;
}

export interface CentralEntityData {
  id: 'CENTRAL_ENTITY';
  name: string;
  code: string;
  category: string;
  position: [number, number, number];
  scale: number;
  coreColor: string;
  glowColor: string;
  energyPulseRate: number;
}

export interface DataWaveData {
  id: string; // Stable ID: WAVE_001, WAVE_002, etc.
  name: string;
  scale: 'large' | 'medium' | 'small';
  origin: [number, number, number];
  controlPoints: [number, number, number][];
  destination: [number, number, number];
  particleCount: number;
  speed: number;
  color: string;
  pulseIntensity: number;
  connectedNodeIds?: string[];
}

export interface TravellingPacketData {
  id: string;
  pathwayId: string;
  progress: number; // 0.0 to 1.0 along line
  speed: number;
  size: number;
  color: string;
  intensity: number;
}

export interface FloatingTechnicalStructure {
  id: string; // Stable ID: DATA_BLOCK_001, etc.
  type: 'polyhedron' | 'bus_register' | 'routing_plane' | 'data_lattice' | 'cryptographic_cell';
  position: [number, number, number];
  rotationSpeed: [number, number, number];
  scale: number;
  label: string;
  code: string;
  opacity: number;
}
