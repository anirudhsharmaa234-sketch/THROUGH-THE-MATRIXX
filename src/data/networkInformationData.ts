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
    typeLabel: '3D ARTIFACT SPHERE // QUANTUM NEXUS',
    status: 'ACTIVE // ROTATING // EXPANDING',
    functionDesc:
      'Central 3D cybernetic sphere artifact model and quantum nexus to which all 18 network nodes dock. Continuously rotates with armillary orbital rings and dynamically scales as intelligence streams inward across real-time neural conduits.',
    metrics: [
      { label: 'THROUGHPUT', value: '480.2 PB/s' },
      { label: 'SYNCHRONY', value: '99.9998%' },
      { label: 'TOPOLOGY', value: '3D SPHERE ARTIFACT // GEODESIC' },
      { label: 'LINKED NODES', value: '18 NODES CONVERGED' },
    ],
    anchorPosition: [0, 16, -70],
    relatedPathwayIds: ['CONNECTION_001', 'CONNECTION_002', 'CONNECTION_024'],
    relatedNodeIds: ['NODE_001', 'NODE_002', 'NODE_003', 'NODE_004', 'NODE_005'],
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
      { label: 'CONNECTIONS', value: '6 MESH EDGES' },
      { label: 'SIGNAL', value: 'STABLE // COHERENT' },
      { label: 'BANDWIDTH', value: '112.4 TB/s' },
      { label: 'PROTOCOL', value: 'SYNAPSE-SYNC // DIRECT' },
    ],
    anchorPosition: [0, 64, -80],
    relatedPathwayIds: ['CONNECTION_030', 'CONNECTION_031', 'CONNECTION_036', 'CONNECTION_037', 'CONNECTION_040', 'CONNECTION_041'],
    relatedNodeIds: ['NODE_008', 'NODE_009', 'NODE_013', 'NODE_015', 'NODE_016', 'NODE_017'],
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
      { label: 'CONNECTIONS', value: '5 MESH EDGES' },
      { label: 'SIGNAL', value: '98.4% FIDELITY' },
      { label: 'THROUGHPUT', value: '54.2 TB/s' },
      { label: 'INGRESS', value: 'NEURO-TCP // v4.2' },
    ],
    anchorPosition: [-82, 48, 255],
    relatedPathwayIds: ['CONNECTION_002', 'CONNECTION_004', 'CONNECTION_006', 'CONNECTION_009', 'CONNECTION_011'],
    relatedNodeIds: ['NODE_010', 'NODE_011', 'NODE_005', 'NODE_006', 'NODE_014'],
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
      { label: 'CONNECTIONS', value: '5 MESH EDGES' },
      { label: 'SIGNAL', value: 'MAXIMAL' },
      { label: 'BANDWIDTH', value: '98.6 TB/s' },
      { label: 'CARRIER', value: 'HYPER-NEXUS // DIRECT' },
    ],
    anchorPosition: [74, -14, 135],
    relatedPathwayIds: ['CONNECTION_012', 'CONNECTION_016', 'CONNECTION_017', 'CONNECTION_021', 'CONNECTION_023'],
    relatedNodeIds: ['NODE_005', 'NODE_007', 'NODE_006', 'NODE_012', 'NODE_008'],
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
      { label: 'CONNECTIONS', value: '6 MESH EDGES' },
      { label: 'LATENCY', value: '0.14 ms' },
      { label: 'COMPUTE', value: '38.4 PFLOPS' },
      { label: 'PRECISION', value: 'FP-64 QUANTUM' },
    ],
    anchorPosition: [-74, -12, 100],
    relatedPathwayIds: ['CONNECTION_018', 'CONNECTION_022', 'CONNECTION_024', 'CONNECTION_025', 'CONNECTION_027', 'CONNECTION_032'],
    relatedNodeIds: ['NODE_006', 'NODE_014', 'NODE_008', 'NODE_009', 'NODE_012', 'NODE_013'],
    color: '#22c55e',
  },

  NODE_005: {
    id: 'NODE_005',
    type: 'node',
    identifier: 'NODE // 005',
    typeLabel: 'DYNAMIC SWITCH RELAY',
    status: 'ACTIVE // SWITCHING',
    functionDesc:
      'High-frequency packet arbiter distributing tensor weights across parallel processing fibers in the entrance corridor.',
    metrics: [
      { label: 'CONNECTIONS', value: '5 MESH EDGES' },
      { label: 'THROUGHPUT', value: '38.2 TB/s' },
      { label: 'FABRIC', value: 'LOW-JITTER FIBER' },
      { label: 'ROUTING', value: 'ADAPTIVE MESH' },
    ],
    anchorPosition: [76, 12, 235],
    relatedPathwayIds: ['CONNECTION_003', 'CONNECTION_004', 'CONNECTION_005', 'CONNECTION_010', 'CONNECTION_012'],
    relatedNodeIds: ['NODE_011', 'NODE_002', 'NODE_007', 'NODE_003', 'NODE_010'],
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
      { label: 'CONNECTIONS', value: '6 MESH EDGES' },
      { label: 'CACHE HIT', value: '99.4%' },
      { label: 'RETENTION', value: '400 ms SNAPSHOTS' },
      { label: 'VOLATILITY', value: 'ZERO-LOSS' },
    ],
    anchorPosition: [-70, 16, 195],
    relatedPathwayIds: ['CONNECTION_007', 'CONNECTION_009', 'CONNECTION_013', 'CONNECTION_014', 'CONNECTION_016', 'CONNECTION_018'],
    relatedNodeIds: ['NODE_002', 'NODE_010', 'NODE_007', 'NODE_014', 'NODE_003', 'NODE_004'],
    color: '#4ade80',
  },

  NODE_007: {
    id: 'NODE_007',
    type: 'node',
    identifier: 'NODE // 007',
    typeLabel: 'OPTICAL BUS REPEATER',
    status: 'ACTIVE // AMPLIFYING',
    functionDesc:
      'Laser photon repeater boosting weakened data pulses along the mid-transit highway corridor.',
    metrics: [
      { label: 'CONNECTIONS', value: '6 MESH EDGES' },
      { label: 'AMPLIFICATION', value: '+18.4 dB' },
      { label: 'BANDWIDTH', value: '33.4 TB/s' },
      { label: 'PROTOCOL', value: 'OPTIC-BOOST // CWDM' },
    ],
    anchorPosition: [68, 54, 175],
    relatedPathwayIds: ['CONNECTION_008', 'CONNECTION_010', 'CONNECTION_013', 'CONNECTION_015', 'CONNECTION_017', 'CONNECTION_019'],
    relatedNodeIds: ['NODE_005', 'NODE_011', 'NODE_006', 'NODE_014', 'NODE_003', 'NODE_008'],
    color: '#4ade80',
  },

  NODE_008: {
    id: 'NODE_008',
    type: 'node',
    identifier: 'NODE // 008',
    typeLabel: 'SUBNET ARBITER GAMMA',
    status: 'ACTIVE // SCHEDULING',
    functionDesc:
      'Prioritization processor managing network congestion and collision-free routing across dense matrix trunks.',
    metrics: [
      { label: 'CONNECTIONS', value: '7 MESH EDGES' },
      { label: 'QUEUING', value: 'ZERO-LATENCY' },
      { label: 'THROUGHPUT', value: '44.0 TB/s' },
      { label: 'QOS', value: 'PRIORITY // KERNEL' },
    ],
    anchorPosition: [66, 48, 80],
    relatedPathwayIds: ['CONNECTION_019', 'CONNECTION_023', 'CONNECTION_024', 'CONNECTION_026', 'CONNECTION_028', 'CONNECTION_031', 'CONNECTION_033'],
    relatedNodeIds: ['NODE_007', 'NODE_003', 'NODE_004', 'NODE_009', 'NODE_012', 'NODE_015', 'NODE_001'],
    color: '#22c55e',
  },

  NODE_009: {
    id: 'NODE_009',
    type: 'node',
    identifier: 'NODE // 009',
    typeLabel: 'SYNAPTIC COLLECTOR',
    status: 'ACTIVE // HARVESTING',
    functionDesc:
      'Feedback aggregator pooling sensory back-propagation gradients and routing them to the primary synapse core.',
    metrics: [
      { label: 'CONNECTIONS', value: '6 MESH EDGES' },
      { label: 'AGGREGATION', value: 'FLOAT32 SUM' },
      { label: 'THROUGHPUT', value: '29.8 TB/s' },
      { label: 'GRADIENT', value: 'CONVERGING' },
    ],
    anchorPosition: [-60, 58, 60],
    relatedPathwayIds: ['CONNECTION_020', 'CONNECTION_025', 'CONNECTION_026', 'CONNECTION_029', 'CONNECTION_030'],
    relatedNodeIds: ['NODE_014', 'NODE_004', 'NODE_008', 'NODE_012', 'NODE_001', 'NODE_013'],
    color: '#16a34a',
  },

  NODE_010: {
    id: 'NODE_010',
    type: 'node',
    identifier: 'NODE // 010',
    typeLabel: 'INGRESS BUFFER CONDUIT',
    status: 'ACTIVE // SAMPLING',
    functionDesc:
      'Close-proximity buffer port interfacing with camera observation space and stream-caching localized rendering packets.',
    metrics: [
      { label: 'CONNECTIONS', value: '4 MESH EDGES' },
      { label: 'POLL RATE', value: '240 Hz' },
      { label: 'SAMPLING', value: 'CONTINUOUS 3D' },
      { label: 'FIELD', value: 'NEAR-PROXIMITY' },
    ],
    anchorPosition: [-58, 14, 310],
    relatedPathwayIds: ['CONNECTION_001', 'CONNECTION_002', 'CONNECTION_005', 'CONNECTION_007'],
    relatedNodeIds: ['NODE_011', 'NODE_002', 'NODE_006', 'NODE_005'],
    color: '#86efac',
  },

  NODE_011: {
    id: 'NODE_011',
    type: 'node',
    identifier: 'NODE // 011',
    typeLabel: 'EGRESS PORT GATEWAY',
    status: 'ACTIVE // EMITTING',
    functionDesc:
      'Foreground egress port discharging processed neural spikes into localized visual synthesis.',
    metrics: [
      { label: 'CONNECTIONS', value: '4 MESH EDGES' },
      { label: 'WAVELENGTH', value: '532 nm (EMERALD)' },
      { label: 'THROUGHPUT', value: '35.9 TB/s' },
      { label: 'OUTPUT', value: 'PHOTONIC BUS' },
    ],
    anchorPosition: [58, 32, 290],
    relatedPathwayIds: ['CONNECTION_001', 'CONNECTION_003', 'CONNECTION_006', 'CONNECTION_008'],
    relatedNodeIds: ['NODE_010', 'NODE_005', 'NODE_007', 'NODE_002'],
    color: '#bbf7d0',
  },

  NODE_012: {
    id: 'NODE_012',
    type: 'node',
    identifier: 'NODE // 012',
    typeLabel: 'NEURAL TERMINAL ENDPOINT',
    status: 'ACTIVE // BOUNDARY',
    functionDesc:
      'Peripheral leaf node interfacing with edge sensor vectors and grounding the core matrix.',
    metrics: [
      { label: 'CONNECTIONS', value: '6 MESH EDGES' },
      { label: 'THROUGHPUT', value: '8.4 TB/s' },
      { label: 'PROTOCOL', value: 'EDGE-SENSE // UDP' },
      { label: 'GROUNDING', value: 'ISOLATED' },
    ],
    anchorPosition: [64, -22, 40],
    relatedPathwayIds: ['CONNECTION_021', 'CONNECTION_027', 'CONNECTION_028', 'CONNECTION_029', 'CONNECTION_034'],
    relatedNodeIds: ['NODE_003', 'NODE_004', 'NODE_008', 'NODE_009', 'NODE_018', 'NODE_015'],
    color: '#15803d',
  },

  NODE_013: {
    id: 'NODE_013',
    type: 'node',
    identifier: 'NODE // 013',
    typeLabel: 'GATEWAY EDGE NODE',
    status: 'ACTIVE // FLANK ANCHOR',
    functionDesc:
      'Left equatorial anchor of the central sphere nexus, monitoring perimeter boundaries for signal degradation.',
    metrics: [
      { label: 'CONNECTIONS', value: '5 MESH EDGES' },
      { label: 'THROUGHPUT', value: '9.2 TB/s' },
      { label: 'ISOLATION', value: '100% SHIELDED' },
      { label: 'ROLE', value: 'NEXUS LEFT WING' },
    ],
    anchorPosition: [-82, 10, -65],
    relatedPathwayIds: ['CONNECTION_032', 'CONNECTION_036', 'CONNECTION_038', 'CONNECTION_043'],
    relatedNodeIds: ['NODE_004', 'NODE_009', 'NODE_001', 'NODE_018', 'NODE_017'],
    color: '#15803d',
  },

  NODE_014: {
    id: 'NODE_014',
    type: 'node',
    identifier: 'NODE // 014',
    typeLabel: 'SENSOR ARRAY ZENITH',
    status: 'ACTIVE // OVERHEAD ARCH',
    functionDesc:
      'High-elevation sensor array scanning upper topological space and measuring curvature of the network.',
    metrics: [
      { label: 'CONNECTIONS', value: '5 MESH EDGES' },
      { label: 'THROUGHPUT', value: '14.6 TB/s' },
      { label: 'ALTITUDE', value: '+76 UNITS' },
      { label: 'SCANNER', value: 'GEO-METRIC' },
    ],
    anchorPosition: [-14, 76, 155],
    relatedPathwayIds: ['CONNECTION_011', 'CONNECTION_014', 'CONNECTION_015', 'CONNECTION_020', 'CONNECTION_022'],
    relatedNodeIds: ['NODE_006', 'NODE_007', 'NODE_002', 'NODE_009', 'NODE_004'],
    color: '#22c55e',
  },

  NODE_015: {
    id: 'NODE_015',
    type: 'node',
    identifier: 'NODE // 015',
    typeLabel: 'DEEP SUBSTRATUM INGRESS',
    status: 'ACTIVE // RIGHT FLANK',
    functionDesc:
      'Right equatorial anchor of the central sphere nexus, receiving deep dimensional telemetry.',
    metrics: [
      { label: 'CONNECTIONS', value: '5 MESH EDGES' },
      { label: 'THROUGHPUT', value: '18.4 TB/s' },
      { label: 'ROLE', value: 'NEXUS RIGHT WING' },
      { label: 'HARMONICS', value: 'IN-PHASE' },
    ],
    anchorPosition: [82, 18, -70],
    relatedPathwayIds: ['CONNECTION_033', 'CONNECTION_037', 'CONNECTION_039', 'CONNECTION_044'],
    relatedNodeIds: ['NODE_008', 'NODE_012', 'NODE_001', 'NODE_018', 'NODE_016'],
    color: '#16a34a',
  },

  NODE_016: {
    id: 'NODE_016',
    type: 'node',
    identifier: 'NODE // 016',
    typeLabel: 'STELLAR RELAY ZENITH',
    status: 'ACTIVE // AFT STABILIZER',
    functionDesc:
      'Aft orbital relay coordinating rearward energy flow and maintaining harmonic balance across the nexus.',
    metrics: [
      { label: 'CONNECTIONS', value: '4 MESH EDGES' },
      { label: 'THROUGHPUT', value: '14.1 TB/s' },
      { label: 'ALIGNMENT', value: 'AFT LOWER' },
      { label: 'STABILITY', value: '99.98%' },
    ],
    anchorPosition: [50, -32, -95],
    relatedPathwayIds: ['CONNECTION_041', 'CONNECTION_042', 'CONNECTION_044', 'CONNECTION_045'],
    relatedNodeIds: ['NODE_001', 'NODE_015', 'NODE_018', 'NODE_017'],
    color: '#16a34a',
  },

  NODE_017: {
    id: 'NODE_017',
    type: 'node',
    identifier: 'NODE // 017',
    typeLabel: 'HORIZON GATEWAY NODE',
    status: 'ACTIVE // AFT BOUNDARY',
    functionDesc:
      'Upper aft boundary node interfacing with distant neural horizons and gathering ambient network vectors.',
    metrics: [
      { label: 'CONNECTIONS', value: '4 MESH EDGES' },
      { label: 'THROUGHPUT', value: '12.8 TB/s' },
      { label: 'ALIGNMENT', value: 'AFT UPPER' },
      { label: 'HORIZON', value: 'DEEP MATRIX' },
    ],
    anchorPosition: [-54, 36, -105],
    relatedPathwayIds: ['CONNECTION_040', 'CONNECTION_042', 'CONNECTION_043', 'CONNECTION_046'],
    relatedNodeIds: ['NODE_001', 'NODE_013', 'NODE_018', 'NODE_016'],
    color: '#15803d',
  },

  NODE_018: {
    id: 'NODE_018',
    type: 'node',
    identifier: 'NODE // 018',
    typeLabel: 'DEEP ABYSS TERMINAL',
    status: 'ACTIVE // NADIR ANCHOR',
    functionDesc:
      'Bottom nadir anchor of the Central Sphere core, providing ground plane stabilization and dimensional grounding.',
    metrics: [
      { label: 'CONNECTIONS', value: '6 MESH EDGES' },
      { label: 'THROUGHPUT', value: '19.6 TB/s' },
      { label: 'GROUNDING', value: 'ZERO-VOLT SUBSTRATE' },
      { label: 'ROLE', value: 'NEXUS NADIR' },
    ],
    anchorPosition: [0, -42, -75],
    relatedPathwayIds: ['CONNECTION_034', 'CONNECTION_038', 'CONNECTION_039', 'CONNECTION_045', 'CONNECTION_046'],
    relatedNodeIds: ['NODE_012', 'NODE_013', 'NODE_015', 'NODE_016', 'NODE_017', 'NODE_001'],
    color: '#15803d',
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
