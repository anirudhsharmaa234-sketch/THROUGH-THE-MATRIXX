/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  NetworkNodeData,
  NetworkPathwayData,
  FloatingTechnicalStructure,
  CentralEntityData,
  DataWaveData,
  TravellingPacketData,
} from '../types/networkTypes.ts';

/**
 * ============================================================================
 * 1. CENTRAL OBJECT IDENTITY (CENTRAL_ENTITY)
 * Primary subject of THE NETWORK — technological artifact / network core.
 * Positioned in midground space, built to be smoothly traversed in future steps.
 * ============================================================================
 */
export const CENTRAL_ENTITY_DATA: CentralEntityData = {
  id: 'CENTRAL_ENTITY',
  name: 'THE CENTRAL ARTIFACT // SYNAPTIC CORE',
  code: 'CORE-NULL-00',
  category: 'NEXUS_CORE // MONOLITH',
  position: [0, 16, -70],
  scale: 30,
  coreColor: '#86efac',
  glowColor: '#22c55e',
  energyPulseRate: 1.4,
};

/**
 * ============================================================================
 * 2. NETWORK NODES (NODE_001 through NODE_018)
 * Topologically structured nodes distributed across 3D space:
 * - Foreground: high detail, close proximity to camera, responsive reticles.
 * - Midground: major hubs and secondary relays forming the backbone topology.
 * - Distant / Far Background: atmospheric micro-nodes receding into the dark void.
 * Visual language variations:
 * - 'polyhedral_core', 'orbital_rings', 'digital_layers', 'crystalline', 'compact_core'
 * ============================================================================
 */
export const NETWORK_NODES: NetworkNodeData[] = [
  // --------------------------------------------------------------------------
  // MAJOR NODES (Hubs)
  // --------------------------------------------------------------------------
  {
    id: 'NODE_001',
    name: 'PRIMARY SYNAPSE CORE',
    code: 'ND_001-CORE',
    category: 'BACKBONE // SPATIAL MATRIX',
    depth: 'midground',
    shapeType: 'orbital_rings',
    position: [0, 52, -160],
    size: 16,
    color: '#86efac',
    clusterId: 'cluster-core',
    connections: ['NODE_002', 'NODE_003', 'NODE_007', 'NODE_011'],
    pulseRate: 1.8,
    pinpoint: { x: 0, y: 52, z: -160, labelOffset: [0, 30] },
    connectorLine: { length: 50, angle: 90 },
    informationBlock: {
      title: 'PRIMARY SYNAPSE CORE',
      whatItIs: 'Central synchronizer distributing high-level reality vectors.',
      whatItDoes: 'Clock distribution and synchronization across all downstream clusters.',
      systemRole: 'Core routing nexus.',
      packetThroughput: '112.4 TB/s',
      protocol: 'SYNAPSE-SYNC // DIRECT',
    },
  },
  {
    id: 'NODE_002',
    name: 'QUANTUM INGRESS ALPHA',
    code: 'ND_002-INGRESS',
    category: 'INGRESS // ROUTING PROTOCOL',
    depth: 'midground',
    shapeType: 'polyhedral_core',
    position: [-270, 95, -110],
    size: 14,
    color: '#4ade80',
    clusterId: 'cluster-alpha',
    connections: ['NODE_001', 'NODE_005', 'NODE_006'],
    pulseRate: 1.3,
    pinpoint: { x: -270, y: 95, z: -110, labelOffset: [-25, 20] },
    connectorLine: { length: 46, angle: 45 },
    informationBlock: {
      title: 'QUANTUM INGRESS ALPHA',
      whatItIs: 'Primary ingress multiplexer routing neural telemetry vectors.',
      whatItDoes: 'Buffers and serializes incoming dimensional tensor states.',
      systemRole: 'Inbound packet validation & high-bandwidth multiplexing.',
      packetThroughput: '54.2 TB/s',
      protocol: 'NEURO-TCP // v4.2',
    },
  },
  {
    id: 'NODE_003',
    name: 'NEURAL BACKBONE BETA',
    code: 'ND_003-BACKBONE',
    category: 'BACKBONE // SPATIAL MATRIX',
    depth: 'midground',
    shapeType: 'crystalline',
    position: [280, -60, -210],
    size: 15,
    color: '#86efac',
    clusterId: 'cluster-beta',
    connections: ['NODE_001', 'NODE_007', 'NODE_009'],
    pulseRate: 2.0,
    pinpoint: { x: 280, y: -60, z: -210, labelOffset: [30, -20] },
    connectorLine: { length: 52, angle: 135 },
    informationBlock: {
      title: 'NEURAL BACKBONE BETA',
      whatItIs: 'High-speed trunk router connecting regional subnet clusters.',
      whatItDoes: 'Maintains quantum phase alignment across distributed memory nodes.',
      systemRole: 'Cross-cluster backbone arbiter.',
      packetThroughput: '98.6 TB/s',
      protocol: 'HYPER-NEXUS // DIRECT',
    },
  },
  {
    id: 'NODE_004',
    name: 'VECTOR MATRIX DELTA',
    code: 'ND_004-MATRIX',
    category: 'COMPUTATION // ARRAY',
    depth: 'midground',
    shapeType: 'compact_core',
    position: [-410, -130, -350],
    size: 13,
    color: '#22c55e',
    clusterId: 'cluster-delta',
    connections: ['NODE_006', 'NODE_012', 'NODE_015'],
    pulseRate: 1.1,
    pinpoint: { x: -410, y: -130, z: -350 },
    informationBlock: {
      title: 'VECTOR MATRIX DELTA',
      whatItIs: 'Distributed tensor matrix performing spatial transformations.',
      whatItDoes: 'Executes high-order differential projections across network space.',
      systemRole: 'Matrix computation unit.',
      packetThroughput: '46.1 TB/s',
      protocol: 'TENSOR-FLOW // CORE',
    },
  },

  // --------------------------------------------------------------------------
  // MEDIUM NODES (Relays, Switches, and Foreground Passing Nodes)
  // --------------------------------------------------------------------------
  {
    id: 'NODE_005',
    name: 'DYNAMIC SWITCH RELAY',
    code: 'ND_005-SWITCH',
    category: 'NEURAL SWITCH // FABRIC',
    depth: 'midground',
    shapeType: 'digital_layers',
    position: [-150, 175, 35],
    size: 11,
    color: '#22c55e',
    clusterId: 'cluster-alpha',
    connections: ['NODE_002', 'NODE_010', 'NODE_014'],
    pulseRate: 1.6,
    pinpoint: { x: -150, y: 175, z: 35 },
    informationBlock: {
      title: 'DYNAMIC SWITCH RELAY',
      whatItIs: 'High-frequency packet arbiter distributing tensor weights.',
      whatItDoes: 'Fans out weight matrices across parallel processing fibers.',
      systemRole: 'Workload balancing across synaptic pathways.',
      packetThroughput: '38.2 TB/s',
      protocol: 'FIBER-FABRIC // RAW',
    },
  },
  {
    id: 'NODE_006',
    name: 'CRYO STATE CACHE',
    code: 'ND_006-CACHE',
    category: 'LOCAL MEMORY // CACHE',
    depth: 'midground',
    shapeType: 'compact_core',
    position: [-290, 25, -65],
    size: 10,
    color: '#16a34a',
    clusterId: 'cluster-alpha',
    connections: ['NODE_002', 'NODE_004'],
    pulseRate: 0.9,
    pinpoint: { x: -290, y: 25, z: -65 },
    informationBlock: {
      title: 'CRYO STATE CACHE',
      whatItIs: 'Cryogenic quantum state register holding intermediate states.',
      whatItDoes: 'Prevents state collapse during inter-cluster pipeline hops.',
      systemRole: 'Phase preservation memory bank.',
      packetThroughput: '24.1 TB/s',
      protocol: 'Q-REG // COHERENT',
    },
  },
  {
    id: 'NODE_007',
    name: 'OPTICAL BUS REPEATER',
    code: 'ND_007-REPEATER',
    category: 'SIGNAL AMPLIFIER // BUS',
    depth: 'midground',
    shapeType: 'orbital_rings',
    position: [210, 45, 25],
    size: 11,
    color: '#4ade80',
    clusterId: 'cluster-beta',
    connections: ['NODE_001', 'NODE_003', 'NODE_008', 'NODE_011'],
    pulseRate: 1.5,
    pinpoint: { x: 210, y: 45, z: 25 },
    informationBlock: {
      title: 'OPTICAL BUS REPEATER',
      whatItIs: 'Laser photon repeater boosting weakened data pulses.',
      whatItDoes: 'Regenerates waveform integrity over long-distance network runs.',
      systemRole: 'Photon amplification & signal reconstruction.',
      packetThroughput: '33.4 TB/s',
      protocol: 'OPTIC-BOOST // CWDM',
    },
  },
  {
    id: 'NODE_008',
    name: 'SUBNET ARBITER GAMMA',
    code: 'ND_008-ARBITER',
    category: 'PACKET ARBITER // QUEUE',
    depth: 'midground',
    shapeType: 'digital_layers',
    position: [350, 145, -370],
    size: 12,
    color: '#22c55e',
    clusterId: 'cluster-gamma',
    connections: ['NODE_007', 'NODE_016'],
    pulseRate: 1.4,
    pinpoint: { x: 350, y: 145, z: -370 },
    informationBlock: {
      title: 'SUBNET ARBITER GAMMA',
      whatItIs: 'Prioritization processor managing network congestion and signal queues.',
      whatItDoes: 'Prevents packet collision across dense transmission trunks.',
      systemRole: 'Traffic routing & latency optimization.',
      packetThroughput: '44.0 TB/s',
      protocol: 'QOS-PRIORITY // KERNEL',
    },
  },
  {
    id: 'NODE_009',
    name: 'SYNAPTIC COLLECTOR',
    code: 'ND_009-COLLECT',
    category: 'COLLECTOR // HARVEST',
    depth: 'midground',
    shapeType: 'crystalline',
    position: [145, -175, -85],
    size: 11,
    color: '#16a34a',
    clusterId: 'cluster-beta',
    connections: ['NODE_003', 'NODE_013', 'NODE_018'],
    pulseRate: 1.2,
    pinpoint: { x: 145, y: -175, z: -85 },
    informationBlock: {
      title: 'SYNAPTIC COLLECTOR',
      whatItIs: 'Feedback aggregator pooling sensory back-propagation gradients.',
      whatItDoes: 'Calculates global gradient descent vectors.',
      systemRole: 'Back-prop gathering & optimization.',
      packetThroughput: '29.8 TB/s',
      protocol: 'GRADIENT-SYNC // FLOAT32',
    },
  },
  {
    id: 'NODE_010',
    name: 'INGRESS BUFFER CONDUIT',
    code: 'ND_010-FORE_A',
    category: 'FOREGROUND // INGRESS PORT',
    depth: 'foreground',
    shapeType: 'compact_core',
    position: [-115, -65, 75],
    size: 13,
    color: '#86efac',
    clusterId: 'cluster-alpha',
    connections: ['NODE_005', 'NODE_002'],
    pulseRate: 2.2,
    pinpoint: { x: -115, y: -65, z: 75, labelOffset: [-20, -20] },
    connectorLine: { length: 44, angle: 225 },
    informationBlock: {
      title: 'INGRESS BUFFER CONDUIT',
      whatItIs: 'Close-proximity buffer port interfacing with camera observation space.',
      whatItDoes: 'Stream-caches localized rendering packets before broadcast.',
      systemRole: 'Near-field observation buffer.',
      packetThroughput: '31.5 TB/s',
      protocol: 'NEAR-BUS // L0',
    },
  },
  {
    id: 'NODE_011',
    name: 'EGRESS PORT GATEWAY',
    code: 'ND_011-FORE_B',
    category: 'FOREGROUND // EGRESS PORT',
    depth: 'foreground',
    shapeType: 'orbital_rings',
    position: [165, 85, 45],
    size: 14,
    color: '#86efac',
    clusterId: 'cluster-beta',
    connections: ['NODE_001', 'NODE_007'],
    pulseRate: 1.9,
    pinpoint: { x: 165, y: 85, z: 45, labelOffset: [25, 20] },
    connectorLine: { length: 48, angle: 45 },
    informationBlock: {
      title: 'EGRESS PORT GATEWAY',
      whatItIs: 'Foreground egress port discharging processed neural spikes.',
      whatItDoes: 'Feeds high-velocity outputs into localized visual synthesis.',
      systemRole: 'Near-field discharge terminal.',
      packetThroughput: '35.9 TB/s',
      protocol: 'EGRESS-PULSE // RAW',
    },
  },

  // --------------------------------------------------------------------------
  // SMALL NODES (Endpoints & Boundary Arrays)
  // --------------------------------------------------------------------------
  {
    id: 'NODE_012',
    name: 'NEURAL TERMINAL ENDPOINT',
    code: 'ND_012-TERM_A',
    category: 'EDGE NODE // LEAF',
    depth: 'midground',
    shapeType: 'crystalline',
    position: [-480, 180, -210],
    size: 8,
    color: '#15803d',
    clusterId: 'cluster-delta',
    connections: ['NODE_004'],
    pulseRate: 0.8,
    informationBlock: {
      title: 'NEURAL TERMINAL ENDPOINT',
      whatItIs: 'Peripheral leaf node interfacing with edge sensor vectors.',
      whatItDoes: 'Translates peripheral events into raw byte packets.',
      systemRole: 'Sensor edge receiver.',
      packetThroughput: '8.4 TB/s',
      protocol: 'EDGE-SENSE // UDP',
    },
  },
  {
    id: 'NODE_013',
    name: 'GATEWAY EDGE NODE',
    code: 'ND_013-TERM_B',
    category: 'EDGE NODE // LEAF',
    depth: 'midground',
    shapeType: 'compact_core',
    position: [450, -135, -135],
    size: 8,
    color: '#15803d',
    clusterId: 'cluster-beta',
    connections: ['NODE_009'],
    pulseRate: 0.7,
    informationBlock: {
      title: 'GATEWAY EDGE NODE',
      whatItIs: 'External perimeter receiver tracking anomalous inputs.',
      whatItDoes: 'Monitors perimeter boundaries for signal degradation.',
      systemRole: 'Boundary monitor.',
      packetThroughput: '9.2 TB/s',
      protocol: 'GUARD-TRACE // v1',
    },
  },
  {
    id: 'NODE_014',
    name: 'SENSOR ARRAY ZENITH',
    code: 'ND_014-ZENITH',
    category: 'SENSOR ARRAY // SKY',
    depth: 'midground',
    shapeType: 'digital_layers',
    position: [-75, 255, -185],
    size: 9,
    color: '#22c55e',
    clusterId: 'cluster-alpha',
    connections: ['NODE_005'],
    pulseRate: 1.1,
    informationBlock: {
      title: 'SENSOR ARRAY ZENITH',
      whatItIs: 'High-elevation sensor array scanning upper topological space.',
      whatItDoes: 'Measures topological curvature of the surrounding network space.',
      systemRole: 'Geodesic metric sensor.',
      packetThroughput: '14.6 TB/s',
      protocol: 'METRIC-SCAN // GEO',
    },
  },

  // --------------------------------------------------------------------------
  // DISTANT NODES (Atmospheric Spatial Depth)
  // --------------------------------------------------------------------------
  {
    id: 'NODE_015',
    name: 'DEEP SUBSTRATUM INGRESS',
    code: 'ND_015-DIST_1',
    category: 'DEEP ROUTING // HORIZON',
    depth: 'distant',
    shapeType: 'polyhedral_core',
    position: [-540, -270, -840],
    size: 11,
    color: '#16a34a',
    clusterId: 'cluster-deep',
    connections: ['NODE_004', 'NODE_017'],
    pulseRate: 0.6,
  },
  {
    id: 'NODE_016',
    name: 'STELLAR RELAY ZENITH',
    code: 'ND_016-DIST_2',
    category: 'DEEP ROUTING // HORIZON',
    depth: 'distant',
    shapeType: 'crystalline',
    position: [610, 330, -970],
    size: 10,
    color: '#16a34a',
    clusterId: 'cluster-deep',
    connections: ['NODE_008', 'NODE_018'],
    pulseRate: 0.5,
  },
  {
    id: 'NODE_017',
    name: 'HORIZON GATEWAY NODE',
    code: 'ND_017-DIST_3',
    category: 'FAR DEEP // ABYSS',
    depth: 'distant',
    shapeType: 'compact_core',
    position: [-740, 210, -1340],
    size: 9,
    color: '#15803d',
    clusterId: 'cluster-deep',
    connections: ['NODE_015'],
    pulseRate: 0.4,
  },
  {
    id: 'NODE_018',
    name: 'DEEP ABYSS TERMINAL',
    code: 'ND_018-DIST_4',
    category: 'FAR DEEP // ABYSS',
    depth: 'distant',
    shapeType: 'polyhedral_core',
    position: [570, -300, -1540],
    size: 8,
    color: '#15803d',
    clusterId: 'cluster-deep',
    connections: ['NODE_016'],
    pulseRate: 0.35,
  },
];

/**
 * ============================================================================
 * 3. CONNECTION PATHWAYS (CONNECTION_001 through CONNECTION_024)
 * Structural connections between relevant nodes.
 * Thin lines, travelling particles, restrained illumination.
 * ============================================================================
 */
export const NETWORK_PATHWAYS: NetworkPathwayData[] = [
  // Primary Core Backbone
  {
    id: 'CONNECTION_001',
    sourceId: 'NODE_001',
    targetId: 'NODE_002',
    tier: 'backbone',
    activationThreshold: 0.22,
    pulseCount: 3,
    speed: 1.2,
  },
  {
    id: 'CONNECTION_002',
    sourceId: 'NODE_001',
    targetId: 'NODE_003',
    tier: 'backbone',
    activationThreshold: 0.25,
    pulseCount: 3,
    speed: 1.3,
  },
  {
    id: 'CONNECTION_003',
    sourceId: 'NODE_001',
    targetId: 'NODE_007',
    tier: 'inter-cluster',
    activationThreshold: 0.29,
    pulseCount: 2,
    speed: 1.1,
  },
  {
    id: 'CONNECTION_004',
    sourceId: 'NODE_001',
    targetId: 'NODE_011',
    tier: 'local',
    activationThreshold: 0.32,
    pulseCount: 2,
    speed: 1.5,
  },

  // Cluster Alpha Paths
  {
    id: 'CONNECTION_005',
    sourceId: 'NODE_002',
    targetId: 'NODE_005',
    tier: 'inter-cluster',
    activationThreshold: 0.34,
    pulseCount: 2,
    speed: 1.0,
  },
  {
    id: 'CONNECTION_006',
    sourceId: 'NODE_002',
    targetId: 'NODE_006',
    tier: 'local',
    activationThreshold: 0.37,
    pulseCount: 2,
    speed: 0.9,
  },
  {
    id: 'CONNECTION_007',
    sourceId: 'NODE_005',
    targetId: 'NODE_010',
    tier: 'local',
    activationThreshold: 0.39,
    pulseCount: 2,
    speed: 1.4,
  },
  {
    id: 'CONNECTION_008',
    sourceId: 'NODE_005',
    targetId: 'NODE_014',
    tier: 'local',
    activationThreshold: 0.42,
    pulseCount: 1,
    speed: 0.8,
  },

  // Cluster Delta Paths
  {
    id: 'CONNECTION_009',
    sourceId: 'NODE_006',
    targetId: 'NODE_004',
    tier: 'inter-cluster',
    activationThreshold: 0.44,
    pulseCount: 2,
    speed: 1.1,
  },
  {
    id: 'CONNECTION_010',
    sourceId: 'NODE_004',
    targetId: 'NODE_012',
    tier: 'local',
    activationThreshold: 0.48,
    pulseCount: 1,
    speed: 0.7,
  },
  {
    id: 'CONNECTION_011',
    sourceId: 'NODE_004',
    targetId: 'NODE_015',
    tier: 'inter-cluster',
    activationThreshold: 0.52,
    pulseCount: 2,
    speed: 0.9,
  },

  // Cluster Beta Paths
  {
    id: 'CONNECTION_012',
    sourceId: 'NODE_003',
    targetId: 'NODE_007',
    tier: 'inter-cluster',
    activationThreshold: 0.36,
    pulseCount: 2,
    speed: 1.2,
  },
  {
    id: 'CONNECTION_013',
    sourceId: 'NODE_003',
    targetId: 'NODE_009',
    tier: 'inter-cluster',
    activationThreshold: 0.41,
    pulseCount: 2,
    speed: 1.0,
  },
  {
    id: 'CONNECTION_014',
    sourceId: 'NODE_007',
    targetId: 'NODE_008',
    tier: 'backbone',
    activationThreshold: 0.46,
    pulseCount: 2,
    speed: 1.1,
  },
  {
    id: 'CONNECTION_015',
    sourceId: 'NODE_007',
    targetId: 'NODE_011',
    tier: 'local',
    activationThreshold: 0.49,
    pulseCount: 2,
    speed: 1.6,
  },

  // Peripheral & Leaf Paths
  {
    id: 'CONNECTION_016',
    sourceId: 'NODE_009',
    targetId: 'NODE_013',
    tier: 'local',
    activationThreshold: 0.53,
    pulseCount: 1,
    speed: 0.8,
  },
  {
    id: 'CONNECTION_017',
    sourceId: 'NODE_009',
    targetId: 'NODE_018',
    tier: 'inter-cluster',
    activationThreshold: 0.57,
    pulseCount: 2,
    speed: 0.95,
  },
  {
    id: 'CONNECTION_018',
    sourceId: 'NODE_008',
    targetId: 'NODE_016',
    tier: 'inter-cluster',
    activationThreshold: 0.55,
    pulseCount: 2,
    speed: 1.05,
  },

  // Distant Deep Links
  {
    id: 'CONNECTION_019',
    sourceId: 'NODE_015',
    targetId: 'NODE_017',
    tier: 'inter-cluster',
    activationThreshold: 0.62,
    pulseCount: 1,
    speed: 0.75,
  },
  {
    id: 'CONNECTION_020',
    sourceId: 'NODE_016',
    targetId: 'NODE_018',
    tier: 'inter-cluster',
    activationThreshold: 0.66,
    pulseCount: 1,
    speed: 0.7,
  },
  {
    id: 'CONNECTION_021',
    sourceId: 'NODE_010',
    targetId: 'NODE_002',
    tier: 'local',
    activationThreshold: 0.43,
    pulseCount: 1,
    speed: 1.3,
  },
  {
    id: 'CONNECTION_022',
    sourceId: 'NODE_008',
    targetId: 'NODE_001',
    tier: 'inter-cluster',
    activationThreshold: 0.50,
    pulseCount: 2,
    speed: 1.25,
  },
  {
    id: 'CONNECTION_023',
    sourceId: 'NODE_004',
    targetId: 'NODE_009',
    tier: 'inter-cluster',
    activationThreshold: 0.59,
    pulseCount: 2,
    speed: 0.85,
  },
  {
    id: 'CONNECTION_024',
    sourceId: 'NODE_005',
    targetId: 'NODE_001',
    tier: 'inter-cluster',
    activationThreshold: 0.45,
    pulseCount: 2,
    speed: 1.15,
  },
];

/**
 * ============================================================================
 * 4. FLOWING DATA WAVES (WAVE_001 through WAVE_006)
 * Large flowing wave-like structures travelling through the network.
 * Built from structured 3D CatmullRom trajectories, particle streams,
 * and travelling points of light with distinct origins, paths, and destinations.
 * ============================================================================
 */
export const DATA_WAVES: DataWaveData[] = [
  // --------------------------------------------------------------------------
  // LARGE WAVES: Major Network Traffic Routes
  // --------------------------------------------------------------------------
  {
    id: 'WAVE_001',
    name: 'MAJOR SYNAPTIC HIGHWAY',
    scale: 'large',
    origin: [-750, 260, -1150],
    controlPoints: [
      [-420, 180, -600],
      [-270, 95, -110], // Near NODE_002
      [-50, 30, -70],   // Sweeping around CENTRAL_ENTITY
      [0, 52, -160],    // Through NODE_001
      [140, -10, -110],
      [380, -120, -340],
    ],
    destination: [720, -220, -780],
    particleCount: 140,
    speed: 0.0018,
    color: '#86efac',
    pulseIntensity: 1.0,
    connectedNodeIds: ['NODE_002', 'NODE_001'],
  },
  {
    id: 'WAVE_002',
    name: 'DEEP ABYSS NEURAL FLUX',
    scale: 'large',
    origin: [-320, -480, -920],
    controlPoints: [
      [-410, -130, -350], // Through NODE_004
      [-180, -40, -180],
      [40, 16, -60],      // Near CENTRAL_ENTITY
      [280, -60, -210],   // Through NODE_003
      [390, 180, -320],
    ],
    destination: [520, 440, -650],
    particleCount: 120,
    speed: 0.0022,
    color: '#4ade80',
    pulseIntensity: 0.9,
    connectedNodeIds: ['NODE_004', 'NODE_003'],
  },

  // --------------------------------------------------------------------------
  // MEDIUM WAVES: Inter-Cluster Connections
  // --------------------------------------------------------------------------
  {
    id: 'WAVE_003',
    name: 'INTER-CLUSTER SYNCHRONIZER',
    scale: 'medium',
    origin: [-270, 95, -110], // NODE_002
    controlPoints: [
      [-150, 175, 35],  // NODE_005
      [60, 210, -140],
      [220, 180, -280],
    ],
    destination: [350, 145, -370], // NODE_008
    particleCount: 80,
    speed: 0.0030,
    color: '#22c55e',
    pulseIntensity: 0.8,
    connectedNodeIds: ['NODE_002', 'NODE_005', 'NODE_008'],
  },
  {
    id: 'WAVE_004',
    name: 'CORE-TO-FOREGROUND CONDUIT',
    scale: 'medium',
    origin: [0, 16, -70], // CENTRAL_ENTITY
    controlPoints: [
      [-40, -15, 0],
      [-115, -65, 75], // Foreground NODE_010
      [-180, -120, 160],
    ],
    destination: [-260, -220, 260],
    particleCount: 65,
    speed: 0.0036,
    color: '#86efac',
    pulseIntensity: 0.85,
    connectedNodeIds: ['NODE_010'],
  },

  // --------------------------------------------------------------------------
  // SMALL WAVES: Local Rapid Data Transfers
  // --------------------------------------------------------------------------
  {
    id: 'WAVE_005',
    name: 'HIGH-SPEED CORE BURST',
    scale: 'small',
    origin: [0, 52, -160], // NODE_001
    controlPoints: [
      [80, 70, -60],
      [165, 85, 45], // Foreground NODE_011
    ],
    destination: [280, 120, 140],
    particleCount: 45,
    speed: 0.0055,
    color: '#bbf7d0',
    pulseIntensity: 0.75,
    connectedNodeIds: ['NODE_001', 'NODE_011'],
  },
  {
    id: 'WAVE_006',
    name: 'DISTANT AMBIENT DATA RIVER',
    scale: 'large',
    origin: [-980, -140, -1480],
    controlPoints: [
      [-540, -270, -840], // NODE_015
      [0, -180, -1250],
      [610, 330, -970],   // NODE_016
    ],
    destination: [1020, 190, -1650],
    particleCount: 160,
    speed: 0.0012,
    color: '#16a34a',
    pulseIntensity: 0.65,
    connectedNodeIds: ['NODE_015', 'NODE_016'],
  },
];

/**
 * ============================================================================
 * 5. FLOATING DATA STRUCTURES (DATA_BLOCK_001 through DATA_BLOCK_008)
 * Purposeful, non-random suspended structures with stable identities.
 * ============================================================================
 */
export const FLOATING_STRUCTURES: FloatingTechnicalStructure[] = [
  {
    id: 'DATA_BLOCK_001',
    type: 'cryptographic_cell',
    position: [-210, 130, -40],
    rotationSpeed: [0.003, 0.005, 0.002],
    scale: 32,
    label: 'TRANSLUCENT_MONOLITH_ALPHA',
    code: 'BLK-0x89A',
    opacity: 0.65,
  },
  {
    id: 'DATA_BLOCK_002',
    type: 'bus_register',
    position: [-90, -80, -110],
    rotationSpeed: [0.001, 0.002, 0],
    scale: 28,
    label: 'BUS_REGISTER_MATRIX',
    code: 'REG-1024b',
    opacity: 0.55,
  },
  {
    id: 'DATA_BLOCK_003',
    type: 'polyhedron',
    position: [230, -110, -160],
    rotationSpeed: [-0.003, 0.004, 0.002],
    scale: 36,
    label: 'OCTAHEDRAL_MEMORY_CELL',
    code: 'OCT-0x4F1',
    opacity: 0.7,
  },
  {
    id: 'DATA_BLOCK_004',
    type: 'cryptographic_cell',
    position: [45, 75, -90],
    rotationSpeed: [0.002, -0.003, 0.004],
    scale: 24,
    label: 'PRISMATIC_VECTOR_CACHE',
    code: 'VEC-0x22C',
    opacity: 0.6,
  },
  {
    id: 'DATA_BLOCK_005',
    type: 'polyhedron',
    position: [-360, -160, -280],
    rotationSpeed: [0.004, 0.002, -0.003],
    scale: 34,
    label: 'HEXAGONAL_ROUTING_JUNCTION',
    code: 'JNC-0x9D0',
    opacity: 0.65,
  },
  {
    id: 'DATA_BLOCK_006',
    type: 'bus_register',
    position: [310, 170, -320],
    rotationSpeed: [0.001, -0.002, 0.001],
    scale: 26,
    label: 'SUSPENDED_BUFFER_REGISTER',
    code: 'BUF-512b',
    opacity: 0.5,
  },
  {
    id: 'DATA_BLOCK_007',
    type: 'routing_plane',
    position: [0, -140, -240],
    rotationSpeed: [0, 0, 0.0012],
    scale: 240,
    label: 'SPATIAL_COORDINATE_GRID',
    code: 'GRID-512',
    opacity: 0.3,
  },
  {
    id: 'DATA_BLOCK_008',
    type: 'polyhedron',
    position: [480, 240, -880],
    rotationSpeed: [0.0015, 0.002, 0.001],
    scale: 48,
    label: 'STELLAR_TELEMETRY_RING',
    code: 'TEL-0x0E8',
    opacity: 0.45,
  },
];

/**
 * ============================================================================
 * 6. TRAVELLING DATA PACKETS
 * ============================================================================
 */
export const TRAVELLING_DATA_BLOCKS: TravellingPacketData[] = [
  {
    id: 'PKT_001',
    pathwayId: 'CONNECTION_001',
    progress: 0.1,
    speed: 0.0032,
    size: 7,
    color: '#86efac',
    intensity: 1.0,
  },
  {
    id: 'PKT_002',
    pathwayId: 'CONNECTION_002',
    progress: 0.45,
    speed: 0.0038,
    size: 6,
    color: '#4ade80',
    intensity: 0.9,
  },
  {
    id: 'PKT_003',
    pathwayId: 'CONNECTION_005',
    progress: 0.7,
    speed: 0.0028,
    size: 7,
    color: '#86efac',
    intensity: 0.95,
  },
  {
    id: 'PKT_004',
    pathwayId: 'CONNECTION_012',
    progress: 0.3,
    speed: 0.0042,
    size: 5,
    color: '#bbf7d0',
    intensity: 0.85,
  },
];
