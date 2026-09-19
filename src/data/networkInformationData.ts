/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NetworkObjectType = 'node' | 'wave' | 'data_block' | 'structure' | 'central_entity';

export interface NetworkTechnicalMetric {
  label: string;
  value: string;
}

export interface NetworkInspectableInfo {
  id: string;
  type: NetworkObjectType;
  identifier: string;      // e.g. "NODE // 001", "SIGNAL // 001"
  typeLabel: string;       // e.g. "PRIMARY SYNAPTIC CORE"
  status: string;          // e.g. "ACTIVE // SYNCHRONIZED"
  functionDesc: string;    // Clear explanation of what the object does
  metrics: NetworkTechnicalMetric[];
  anchorPosition: [number, number, number];
  relatedPathwayIds: string[];
  relatedNodeIds: string[];
  color: string;
}

/**
 * Curated registry of inspectable Network objects.
 * Only deliberately selected objects respond to keep the environment atmospheric.
 * Every object has unique, highly authentic Matrix-inspired technical information.
 */
export const NETWORK_INFORMATION_REGISTRY: Record<string, NetworkInspectableInfo> = {
  // ==========================================================================
  // 1. CENTRAL ENTITY
  // ==========================================================================
  CENTRAL_ENTITY: {
    id: 'CENTRAL_ENTITY',
    type: 'central_entity',
    identifier: 'NEXUS // CORE-NULL-00',
    typeLabel: 'SYNAPTIC MONOLITH',
    status: 'OPTIMAL // TRAVERSING',
    functionDesc:
      'Master synchronization monolith coordinating reality vectors, neural clock cycles, and inter-cluster quantum tensor routing across all layers.',
    metrics: [
      { label: 'THROUGHPUT', value: '480.2 PB/s' },
      { label: 'SYNCHRONY', value: '99.9998%' },
      { label: 'TOPOLOGY', value: 'POLYHEDRAL NEXUS' },
      { label: 'CLOCK', value: '3.42 GHz // LOCKED' },
    ],
    anchorPosition: [0, 16, -70],
    relatedPathwayIds: ['CONNECTION_001', 'CONNECTION_002', 'CONNECTION_024'],
    relatedNodeIds: ['NODE_001', 'NODE_002', 'NODE_005'],
    color: '#86efac',
  },

  // ==========================================================================
  // 2. NETWORK NODES
  // ==========================================================================
  NODE_001: {
    id: 'NODE_001',
    type: 'node',
    identifier: 'NODE // 001',
    typeLabel: 'PRIMARY SYNAPSE CORE',
    status: 'ACTIVE // ROUTING',
    functionDesc:
      'Distributes high-level reality vectors and synchronization clocks across all downstream neural clusters and secondary switching relays.',
    metrics: [
      { label: 'CONNECTIONS', value: '4 BACKBONE' },
      { label: 'SIGNAL', value: 'STABLE // COHERENT' },
      { label: 'BANDWIDTH', value: '112.4 TB/s' },
      { label: 'PROTOCOL', value: 'SYNAPSE-SYNC // DIRECT' },
    ],
    anchorPosition: [0, 52, -160],
    relatedPathwayIds: ['CONNECTION_001', 'CONNECTION_002', 'CONNECTION_022', 'CONNECTION_024'],
    relatedNodeIds: ['NODE_002', 'NODE_003', 'NODE_008', 'NODE_005'],
    color: '#86efac',
  },

  NODE_002: {
    id: 'NODE_002',
    type: 'node',
    identifier: 'NODE // 002',
    typeLabel: 'QUANTUM INGRESS ALPHA',
    status: 'ACTIVE // RECEIVING',
    functionDesc:
      'Buffers and serializes incoming dimensional tensor states from deep sector pipelines before distribution through synaptic highway channels.',
    metrics: [
      { label: 'CONNECTIONS', value: '3 LOCAL' },
      { label: 'SIGNAL', value: '98.4% FIDELITY' },
      { label: 'THROUGHPUT', value: '54.2 TB/s' },
      { label: 'INGRESS', value: 'NEURO-TCP // v4.2' },
    ],
    anchorPosition: [-270, 95, -110],
    relatedPathwayIds: ['CONNECTION_001', 'CONNECTION_005', 'CONNECTION_006', 'CONNECTION_021'],
    relatedNodeIds: ['NODE_001', 'NODE_005', 'NODE_006', 'NODE_010'],
    color: '#4ade80',
  },

  NODE_003: {
    id: 'NODE_003',
    type: 'node',
    identifier: 'NODE // 003',
    typeLabel: 'NEURAL BACKBONE BETA',
    status: 'ACTIVE // TRUNK LINKED',
    functionDesc:
      'High-speed trunk router maintaining quantum phase alignment across distributed memory nodes and arbitration subnets.',
    metrics: [
      { label: 'CONNECTIONS', value: '3 TRUNK' },
      { label: 'SIGNAL', value: 'MAXIMAL' },
      { label: 'BANDWIDTH', value: '98.6 TB/s' },
      { label: 'CARRIER', value: 'HYPER-NEXUS // DIRECT' },
    ],
    anchorPosition: [280, -60, -210],
    relatedPathwayIds: ['CONNECTION_002', 'CONNECTION_012', 'CONNECTION_013'],
    relatedNodeIds: ['NODE_001', 'NODE_007', 'NODE_009'],
    color: '#86efac',
  },

  NODE_004: {
    id: 'NODE_004',
    type: 'node',
    identifier: 'NODE // 004',
    typeLabel: 'VECTOR MATRIX DELTA',
    status: 'ACTIVE // PROCESSING',
    functionDesc:
      'Executes multi-dimensional projection transforms and floating matrix multiplications for deep background perceptual rendering.',
    metrics: [
      { label: 'CONNECTIONS', value: '4 CLUSTER' },
      { label: 'LATENCY', value: '0.14 ms' },
      { label: 'COMPUTE', value: '38.4 PFLOPS' },
      { label: 'PRECISION', value: 'FP-64 QUANTUM' },
    ],
    anchorPosition: [-410, -130, -350],
    relatedPathwayIds: ['CONNECTION_009', 'CONNECTION_010', 'CONNECTION_011', 'CONNECTION_023'],
    relatedNodeIds: ['NODE_006', 'NODE_012', 'NODE_015', 'NODE_009'],
    color: '#22c55e',
  },

  NODE_006: {
    id: 'NODE_006',
    type: 'node',
    identifier: 'NODE // 006',
    typeLabel: 'CRYO STATE CACHE',
    status: 'STANDBY // PERSISTED',
    functionDesc:
      'Maintains short-term temporal snapshot caches for fast rollback and state reconciliation during high-frequency perceptual branch divergence.',
    metrics: [
      { label: 'CONNECTIONS', value: '2 LOCAL' },
      { label: 'CACHE HIT', value: '99.4%' },
      { label: 'RETENTION', value: '400 ms SNAPSHOTS' },
      { label: 'VOLATILITY', value: 'ZERO-LOSS' },
    ],
    anchorPosition: [-290, 25, -65],
    relatedPathwayIds: ['CONNECTION_006', 'CONNECTION_009'],
    relatedNodeIds: ['NODE_002', 'NODE_004'],
    color: '#4ade80',
  },

  NODE_010: {
    id: 'NODE_010',
    type: 'node',
    identifier: 'NODE // 010',
    typeLabel: 'FOREGROUND INGRESS SENSOR',
    status: 'ACTIVE // SAMPLING',
    functionDesc:
      'High-sensitivity telemetry sensor scanning spatial observation boundaries and translating spectator focus vectors into network coordinates.',
    metrics: [
      { label: 'CONNECTIONS', value: '2 LOCAL' },
      { label: 'POLL RATE', value: '240 Hz' },
      { label: 'SAMPLING', value: 'CONTINUOUS 3D' },
      { label: 'FIELD', value: 'NEAR-PROXIMITY' },
    ],
    anchorPosition: [-115, -65, 75],
    relatedPathwayIds: ['CONNECTION_007', 'CONNECTION_021'],
    relatedNodeIds: ['NODE_005', 'NODE_002'],
    color: '#86efac',
  },

  NODE_011: {
    id: 'NODE_011',
    type: 'node',
    identifier: 'NODE // 011',
    typeLabel: 'OPTICAL TRANSLATOR NODE',
    status: 'ACTIVE // EMITTING',
    functionDesc:
      'Converts coherent photonic wavelength frequencies into low-noise logical signals, bridging visual display registers and central core memory.',
    metrics: [
      { label: 'CONNECTIONS', value: '2 BUS' },
      { label: 'WAVELENGTH', value: '532 nm (EMERALD)' },
      { label: 'JITTER', value: '< 2 ps' },
      { label: 'OUTPUT', value: 'PHOTONIC BUS' },
    ],
    anchorPosition: [165, 85, 45],
    relatedPathwayIds: ['CONNECTION_004', 'CONNECTION_015'],
    relatedNodeIds: ['NODE_001', 'NODE_007'],
    color: '#bbf7d0',
  },

  // ==========================================================================
  // 3. FLOWING DATA WAVES / SIGNALS
  // ==========================================================================
  WAVE_001: {
    id: 'WAVE_001',
    type: 'wave',
    identifier: 'SIGNAL // WAVE_001',
    typeLabel: 'SYNAPTIC HIGHWAY',
    status: 'STREAMING // HIGH-THROUGHPUT',
    functionDesc:
      'Continuous multi-strand particle pipeline sweeping primary consciousness telemetry from deep sector ingress directly into the Synaptic Core.',
    metrics: [
      { label: 'ROUTE', value: 'DEEP SECTOR → NODE_002 → NODE_001' },
      { label: 'VELOCITY', value: '0.84 c (QUANTUM)' },
      { label: 'DENSITY', value: '140 PARTICLES/STREAM' },
      { label: 'INTEGRITY', value: '100% UNCORRUPTED' },
    ],
    anchorPosition: [-110, 74, -135],
    relatedPathwayIds: ['CONNECTION_001', 'CONNECTION_005'],
    relatedNodeIds: ['NODE_001', 'NODE_002'],
    color: '#86efac',
  },

  WAVE_002: {
    id: 'WAVE_002',
    type: 'wave',
    identifier: 'SIGNAL // WAVE_002',
    typeLabel: 'DEEP ABYSS FLUX',
    status: 'IN TRANSIT // SUB-LAYER',
    functionDesc:
      'Transfers heavy structural state matrices and tensor weight updates between bottom vector matrix clusters and eastern neural backbone trunks.',
    metrics: [
      { label: 'ROUTE', value: 'NODE_004 → CENTRAL NEXUS → NODE_003' },
      { label: 'CARRIER', value: 'UNDULATING HARMONIC' },
      { label: 'FLOW RATE', value: '72.8 TB/s' },
      { label: 'AMPLITUDE', value: 'DYNAMIC ±4.2 units' },
    ],
    anchorPosition: [40, 16, -60],
    relatedPathwayIds: ['CONNECTION_002', 'CONNECTION_011'],
    relatedNodeIds: ['NODE_004', 'NODE_003'],
    color: '#4ade80',
  },

  WAVE_004: {
    id: 'WAVE_004',
    type: 'wave',
    identifier: 'SIGNAL // WAVE_004',
    typeLabel: 'FOREGROUND CONDUIT',
    status: 'STREAMING // LOCAL',
    functionDesc:
      'Feeds live real-time observer coordinate telemetry and focus vectors from near-camera space directly into the Central Monolith.',
    metrics: [
      { label: 'ROUTE', value: 'NODE_010 → OBSERVER PLANE' },
      { label: 'LATENCY', value: '0.04 ms' },
      { label: 'BANDWIDTH', value: '18.4 TB/s' },
      { label: 'PRIORITY', value: 'URGENT // IMMEDIATE' },
    ],
    anchorPosition: [-75, -40, 35],
    relatedPathwayIds: ['CONNECTION_007'],
    relatedNodeIds: ['NODE_010'],
    color: '#86efac',
  },

  // ==========================================================================
  // 4. FLOATING DATA BLOCKS
  // ==========================================================================
  DATA_BLOCK_001: {
    id: 'DATA_BLOCK_001',
    type: 'data_block',
    identifier: 'DATA BLOCK // 001',
    typeLabel: 'CRYPTOGRAPHIC CELL ALPHA',
    status: 'ENCRYPTED // PERSISTED',
    functionDesc:
      'Encapsulates sealed cryptographic verification keys and entropy seeds ensuring untampered execution of spatial network consensus protocols.',
    metrics: [
      { label: 'ALGORITHM', value: 'CRYPTO-SHA-512 MATRIX' },
      { label: 'INTEGRITY', value: 'SEALED // VERIFIED' },
      { label: 'SCALE', value: '32 GEOMETRIC UNITS' },
      { label: 'ROTATION', value: 'TRIAXIAL STABLE' },
    ],
    anchorPosition: [-210, 130, -40],
    relatedPathwayIds: ['CONNECTION_005'],
    relatedNodeIds: ['NODE_002', 'NODE_005'],
    color: '#86efac',
  },

  DATA_BLOCK_002: {
    id: 'DATA_BLOCK_002',
    type: 'data_block',
    identifier: 'DATA BLOCK // 002',
    typeLabel: 'BUS REGISTER MATRIX',
    status: 'COMMITTED // BUFFERED',
    functionDesc:
      'Parallel 1024-bit register array staging intermediate tensor hop calculations before injection into primary synaptic bus channels.',
    metrics: [
      { label: 'CAPACITY', value: '1024-BIT WIDE BUS' },
      { label: 'STATE', value: 'COMMITTED' },
      { label: 'ACCESS', value: 'DIRECT MEMORY ACCESS' },
      { label: 'CYCLING', value: 'SYNCHRONOUS' },
    ],
    anchorPosition: [-90, -80, -110],
    relatedPathwayIds: ['CONNECTION_006'],
    relatedNodeIds: ['NODE_006'],
    color: '#22c55e',
  },

  DATA_BLOCK_003: {
    id: 'DATA_BLOCK_003',
    type: 'data_block',
    identifier: 'DATA BLOCK // 003',
    typeLabel: 'OCTAHEDRAL MEMORY CELL',
    status: 'STORED // COLD CACHE',
    functionDesc:
      'High-density faceted memory prism preserving historical state checkpoints from preceding layer transitions (SURFACE and DEEP).',
    metrics: [
      { label: 'ARCHIVE', value: 'LAYER 01 / LAYER 02 DUMP' },
      { label: 'READ RATE', value: 'ON-DEMAND QUERY' },
      { label: 'COMPRESSION', value: '18:1 VECTOR LOSSLESS' },
      { label: 'STATUS', value: 'IMMUTABLE' },
    ],
    anchorPosition: [230, -110, -160],
    relatedPathwayIds: ['CONNECTION_012'],
    relatedNodeIds: ['NODE_003', 'NODE_007'],
    color: '#4ade80',
  },

  // ==========================================================================
  // 5. NETWORK STRUCTURES
  // ==========================================================================
  DATA_BLOCK_005: {
    id: 'DATA_BLOCK_005',
    type: 'structure',
    identifier: 'STRUCTURE // 005',
    typeLabel: 'SPATIAL ROUTING PLANE',
    status: 'ALIGNED // 3D GRID',
    functionDesc:
      'Suspended planar routing grid projecting Euclidean spatial coordinate axes and spatial bounds across the midground computation volume.',
    metrics: [
      { label: 'ORIENTATION', value: 'HORIZONTAL REFERENCE' },
      { label: 'GRID SCALE', value: '48 × 48 MATRIX' },
      { label: 'AXIS ALIGN', value: '[X: 0, Y: -120, Z: -220]' },
      { label: 'PURPOSE', value: 'SPATIAL TELEMETRY ZERO' },
    ],
    anchorPosition: [0, -120, -220],
    relatedPathwayIds: ['CONNECTION_002', 'CONNECTION_014'],
    relatedNodeIds: ['NODE_001', 'NODE_007'],
    color: '#22c55e',
  },

  DATA_BLOCK_007: {
    id: 'DATA_BLOCK_007',
    type: 'structure',
    identifier: 'STRUCTURE // 007',
    typeLabel: 'COORDINATE LATTICE 512',
    status: 'ACTIVE // CALIBRATED',
    functionDesc:
      'Geometric framework anchoring topological geodesics and relative camera angle projections in deep network space.',
    metrics: [
      { label: 'DIMENSIONS', value: '56 × 56 SPATIAL LATTICE' },
      { label: 'COORDINATES', value: '[-220, +090, +160]' },
      { label: 'PRECISION', value: '0.001 MILLIRADIANS' },
      { label: 'CALIBRATION', value: 'STEADY LOCK' },
    ],
    anchorPosition: [-160, 140, -190],
    relatedPathwayIds: ['CONNECTION_005', 'CONNECTION_024'],
    relatedNodeIds: ['NODE_005', 'NODE_001'],
    color: '#86efac',
  },
};
