/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Scene Elements Configuration (`sceneElements.ts`)
 *
 * Provides unique metadata, labels, status codes, telemetry metrics,
 * spatial anchors, and diagnostics for the 4 core scene elements:
 * - 'Person' : Primary Operator / Anomaly-001
 * - 'Hand'   : Tactile Interface Contact / Surface Impact Threshold
 * - 'Suit'   : Residual Self-Image / Structural Kinetic Weave
 * - 'Shard'  : Volumetric Data Fragments / Octree Construct
 *
 * Plus supporting visual markers (Optic & Codestream) for the holographic HUD.
 */

export type SceneElementKey = 'person' | 'hand' | 'suit' | 'shard' | 'optic' | 'stream';

export interface TelemetryRow {
  label: string;
  value: string;
  binaryHint?: string;
}

export interface SceneElementMetadata {
  entityType?: string;
  clearanceLevel?: string;
  neuralCoherence?: string;
  synapticOscillation?: string;
  carrierFrequency?: string;
  cipherProtocol?: string;
  memoryAddress: string;
  anomalyCoefficient?: string;
  signalPurity?: string;

  contactState?: string;
  synapticTransferRate?: string;
  surfaceOscillation?: string;
  compressionGradient?: string;
  dischargeVoltage?: string;
  writeAuthority?: string;
  contactPhaseThreshold?: string;

  materialStructure?: string;
  dampingCoefficient?: string;
  kineticAbsorption?: string;
  gravitationalTether?: string;
  volumetricShield?: string;
  distortionTolerance?: string;
  fiberThermalLimit?: string;

  geometryClass?: string;
  polygonDensity?: string;
  refractionIndex?: string;
  clusterIdentifier?: string;
  driftVelocity?: string;
  cacheLifetime?: string;
  reconstructionState?: string;

  [customKey: string]: string | undefined;
}

export interface SceneElementConfig {
  id: string;
  key: SceneElementKey;
  name: string;
  label: string;
  technicalLabel: string;
  code: string;
  statusCode: string;
  statusCodeHex: string;
  category: string;
  statusBadge: string;
  decodedTitle: string;
  decodedSubtitle: string;
  technicalSummary: string;
  metadata: SceneElementMetadata;
  telemetryRows: TelemetryRow[];
  baseVx: number;
  baseVy: number;
  hitRadius: number;
  panelSide: 'left' | 'right';
  targetDepth: 'foreground' | 'midground' | 'ambient';
  tracksSubjectMotion: boolean;
}

export type ScanTargetDef = SceneElementConfig;

// =============================================================================
// 1. PERSON ELEMENT
// =============================================================================
export const PERSON_ELEMENT: SceneElementConfig = {
  id: 'agent-core',
  key: 'person',
  name: 'Person',
  label: 'PERSON // PRIMARY OPERATOR',
  technicalLabel: 'BIO-NEURAL CONSTRUCT [OPERATOR]',
  code: 'PRS-01',
  statusCode: 'ST-0x01 // ACCESS_ROOT_KERNEL',
  statusCodeHex: '0x00A1',
  category: 'SENTIENT BIO-CARRIER',
  statusBadge: 'ACCESS: ROOT PRIVILEGE',
  decodedTitle: 'OPERATOR: ANOMALY-001',
  decodedSubtitle: 'DIRECT ARCHITECTURAL BYPASS',
  technicalSummary:
    'Bi-directional construct synchronization detected without mainframe latency. Unconstrained neural operator operating with root-level kernel execution authority.',
  metadata: {
    entityType: 'Sentient Operator // Anomaly-001',
    clearanceLevel: 'Tier-0 [Kernel Bypass Granted]',
    neuralCoherence: '99.984% Continuous Phase',
    synapticOscillation: '44.1 Hz [Gamma Lock]',
    carrierFrequency: '10.42 GHz Carrier',
    cipherProtocol: 'PRIME-0x8F4A // ASYMMETRIC',
    memoryAddress: '0x7FFF5FBFF8C0',
    anomalyCoefficient: '0.9998',
    signalPurity: '100% Coherent [Uncompressed]',
  },
  telemetryRows: [
    { label: 'IDENTITY', value: 'THE ONE // PRIMARY ITERATION', binaryHint: '01001111' },
    { label: 'STATUS CODE', value: 'ST-0x01 [ROOT_KERNEL_BYPASS]', binaryHint: '00110001' },
    { label: 'SYSTEM STATUS', value: 'UNCONTAINED [EXCEEDS BOUNDS]', binaryHint: '01010101' },
    { label: 'ACCESS LEVEL', value: 'TIER-0 [KERNEL GRANTED]', binaryHint: '00110000' },
    { label: 'SIGNAL PURITY', value: '99.984% COHERENT', binaryHint: '01100001' },
    { label: 'NEURAL FREQ', value: '44.1 Hz GAMMA OSCILLATION', binaryHint: '01000111' },
  ],
  baseVx: 0.492,
  baseVy: 0.38,
  hitRadius: 42,
  panelSide: 'right',
  targetDepth: 'foreground',
  tracksSubjectMotion: true,
};

// =============================================================================
// 2. HAND ELEMENT
// =============================================================================
export const HAND_ELEMENT: SceneElementConfig = {
  id: 'tactile-interface',
  key: 'hand',
  name: 'Hand',
  label: 'HAND // CONTACT APPARATUS',
  technicalLabel: 'SYNAPTIC TACTILE TERMINAL',
  code: 'HND-03',
  statusCode: 'ST-0x03 // SURFACE_IONIZE_IMMINENT',
  statusCodeHex: '0x00B2',
  category: 'TACTILE INTERFACE CONTACT',
  statusBadge: 'SURFACE: CONTACT IMMINENT',
  decodedTitle: 'TACTILE CONVERGENCE POINT',
  decodedSubtitle: 'PHYSICAL-TO-DIGITAL BREACH',
  technicalSummary:
    'Direct physical-to-digital boundary breach triggers instant cascading viewport ionization, high-frequency compression ripples, and digital shockwave on contact.',
  metadata: {
    contactState: 'Surface Compression Detected',
    synapticTransferRate: '8.44 GB/s High-Throughput Bus',
    surfaceOscillation: '128.40 Hz Harmonic Resonance',
    compressionGradient: '0.984 G Tactile Impulse',
    dischargeVoltage: '3.20 kV Transient Ionization',
    memoryAddress: '0x7FFF5FBFF9A8',
    writeAuthority: 'Verified [RWX KERNEL MAPPING]',
    contactPhaseThreshold: '0.742 Progress Impact Trigger',
  },
  telemetryRows: [
    { label: 'CONTACT STATE', value: 'SURFACE COMPRESSION DETECTED', binaryHint: '01010011' },
    { label: 'STATUS CODE', value: 'ST-0x03 [SURFACE_IONIZE_ACTIVE]', binaryHint: '00110011' },
    { label: 'TRANSFER RATE', value: '8.44 GB/s SYNAPTIC BUS', binaryHint: '01011001' },
    { label: 'SURFACE RIPPLE', value: 'FREQUENCY: 128.40 Hz', binaryHint: '01001110' },
    { label: 'SYSTEM PERM', value: 'WRITE AUTHORITY VERIFIED', binaryHint: '01010111' },
    { label: 'IONIC PULSE', value: '3.2 kV TRANSIENT CAPACITANCE', binaryHint: '01010100' },
  ],
  baseVx: 0.608,
  baseVy: 0.532,
  hitRadius: 38,
  panelSide: 'right',
  targetDepth: 'foreground',
  tracksSubjectMotion: true,
};

// =============================================================================
// 3. SUIT ELEMENT
// =============================================================================
export const SUIT_ELEMENT: SceneElementConfig = {
  id: 'structural-body',
  key: 'suit',
  name: 'Suit',
  label: 'SUIT // RESIDUAL SELF-IMAGE',
  technicalLabel: 'KINETIC SELF-IMAGE WEAVE',
  code: 'SUT-04',
  statusCode: 'ST-0x04 // BALLISTIC_INTEGRITY_NOMINAL',
  statusCodeHex: '0x00C3',
  category: 'STRUCTURAL KINETIC INTEGRITY',
  statusBadge: 'INTEGRITY: 100% NOMINAL',
  decodedTitle: 'RESIDUAL SELF-IMAGE',
  decodedSubtitle: 'STRUCTURAL SYSTEM CARRIER',
  technicalSummary:
    'Calculated mental self-projection withstands high-velocity spatial distortion, gravitational decompression, and digital tearing without frame degradation.',
  metadata: {
    materialStructure: 'Ballistic Carbon-Fiber Weave',
    dampingCoefficient: '0.0000 [Zero Fluid Drag]',
    kineticAbsorption: '100% Dynamic Deflection',
    gravitationalTether: 'Simulated 9.806 m/s² Grounding',
    volumetricShield: 'Passive Continuous Flux',
    memoryAddress: '0x7FFF5FBFFA40',
    distortionTolerance: 'Infinite [Zero Drift]',
    fiberThermalLimit: '2,400 K Superconductive',
  },
  telemetryRows: [
    { label: 'FRAME STABILITY', value: 'KINETIC BALANCE: NOMINAL', binaryHint: '01001011' },
    { label: 'STATUS CODE', value: 'ST-0x04 [BALLISTIC_INTEGRITY]', binaryHint: '00110100' },
    { label: 'ENERGY SHIELD', value: 'ZERO DAMPING COEFFICIENT', binaryHint: '01011010' },
    { label: 'BIOMASS TETHER', value: 'GROUNDED [9.806 m/s² GRAV]', binaryHint: '01000111' },
    { label: 'AVATAR SIGN', value: 'COAT FIBER RESIST: INF', binaryHint: '01000001' },
    { label: 'SPATIAL DRIFT', value: '±0.00 mm [LOCKED MATRIX]', binaryHint: '01010010' },
  ],
  baseVx: 0.415,
  baseVy: 0.338,
  hitRadius: 38,
  panelSide: 'left',
  targetDepth: 'midground',
  tracksSubjectMotion: true,
};

// =============================================================================
// 4. SHARD ELEMENT
// =============================================================================
export const SHARD_ELEMENT: SceneElementConfig = {
  id: 'digital-shards',
  key: 'shard',
  name: 'Shard',
  label: 'SHARD // VOLUMETRIC ARTIFACT',
  technicalLabel: 'OCTREE VOLUMETRIC CIPHER MESH',
  code: 'SHD-05',
  statusCode: 'ST-0x05 // OCTREE_CLUSTER_STABLE',
  statusCodeHex: '0x00D4',
  category: 'CONSTRUCT CIPHER ARTIFACTS',
  statusBadge: 'STATE: FLOATING CONSTRUCT',
  decodedTitle: 'VOLUMETRIC DATA FRAGMENTS',
  decodedSubtitle: 'POLYGONAL CIPHER ARTIFACTS',
  technicalSummary:
    'Dispersed geometric memory nodes and polygonal octree remnants from prior architectural cycles suspended in matrix reality awaiting systemic garbage collection.',
  metadata: {
    geometryClass: 'Quaternion Octree Mesh',
    polygonDensity: '65,536 Floating Nodes',
    refractionIndex: '1.542 [Virtual Emerald Quartz]',
    clusterIdentifier: 'CLUSTER-B // 0x7F9A',
    driftVelocity: '0.012 m/s Volumetric Float',
    memoryAddress: '0x7FFF5FBFFB10',
    cacheLifetime: 'Persistent Volumetric Cache',
    reconstructionState: 'Awaiting Cycle Garbage Collect',
  },
  telemetryRows: [
    { label: 'OBJECT ID', value: 'SHARD-0x7F9A // CLUSTER-B', binaryHint: '01111111' },
    { label: 'STATUS CODE', value: 'ST-0x05 [OCTREE_CLUSTER_FLOAT]', binaryHint: '00110101' },
    { label: 'DATA TYPE', value: 'OCTREE MESH // QUATERNION', binaryHint: '01001101' },
    { label: 'POLYGON DENSITY', value: '65,536 FLOATING NODES', binaryHint: '01010000' },
    { label: 'REFRACTION', value: '1.542 VIRTUAL QUARTZ', binaryHint: '01010011' },
    { label: 'LIFESPAN', value: 'PERSISTENT VOLUMETRIC CACHE', binaryHint: '01000011' },
  ],
  baseVx: 0.745,
  baseVy: 0.36,
  hitRadius: 44,
  panelSide: 'right',
  targetDepth: 'ambient',
  tracksSubjectMotion: false,
};

// =============================================================================
// SUPPORTING ELEMENTS (Optic / Head & Vertical Codestream)
// =============================================================================
export const OPTIC_ELEMENT: SceneElementConfig = {
  id: 'neural-optic',
  key: 'optic',
  name: 'Optic',
  label: 'HEAD // NEURAL OPTIC',
  technicalLabel: 'SPECTRAL VISUAL SENSOR',
  code: 'OPT-02',
  statusCode: 'ST-0x02 // 520NM_EMERALD_LOCKED',
  statusCodeHex: '0x00E5',
  category: 'NEURAL & VISUAL SCAN',
  statusBadge: 'SYNAPSE: 44.1 HZ GAMMA',
  decodedTitle: 'OPTIC APPARATUS // 520nm',
  decodedSubtitle: 'UNFILTERED MATRIX PERCEPTION',
  technicalSummary:
    'Sub-millisecond code rendering bypasses human visual cortex simulation filters to perceive raw green matrix syntax.',
  metadata: {
    spectralBand: '520nm Emerald Matrix',
    frameScan: '240 FPS Native Synchronous',
    latency: '0.02 ms Synaptic Delay',
    memoryAddress: '0x7FFF5FBFF8E0',
  },
  telemetryRows: [
    { label: 'CODE PERCEPTION', value: 'NATIVE CODESTREAM [RAW]', binaryHint: '01000011' },
    { label: 'STATUS CODE', value: 'ST-0x02 [EMERALD_520NM]', binaryHint: '00110010' },
    { label: 'OPTIC RESPONSE', value: '0.02ms LATENCY [REALTIME]', binaryHint: '01001111' },
    { label: 'SPECTRAL FREQ', value: '520nm EMERALD MATRIX', binaryHint: '01000100' },
    { label: 'CORTEX LOCK', value: 'DECODING DEPTH: 100%', binaryHint: '01000101' },
  ],
  baseVx: 0.502,
  baseVy: 0.208,
  hitRadius: 36,
  panelSide: 'right',
  targetDepth: 'foreground',
  tracksSubjectMotion: true,
};

export const STREAM_ELEMENT: SceneElementConfig = {
  id: 'binary-stream',
  key: 'stream',
  name: 'Stream',
  label: 'STREAM // DIGITAL RAIN',
  technicalLabel: 'EXECUTABLE MATRIX REALITY',
  code: 'STM-06',
  statusCode: 'ST-0x06 // CODESTREAM_ACTIVE_CARRIER',
  statusCodeHex: '0x00F6',
  category: 'CODE RAIN DYNAMICS',
  statusBadge: 'FLOW: 24,000 BYTES/SEC',
  decodedTitle: 'VERTICAL CODESTREAM',
  decodedSubtitle: 'EXECUTABLE MATRIX REALITY',
  technicalSummary:
    'Raw execution flow generating the tactile sensations, environmental textures, and physical constraints of the room.',
  metadata: {
    streamBandwidth: '24,000 Bytes/sec Matrix Flow',
    carrierProtocol: 'Phosphor Green Raster',
    cipherKey: '0x3F8A2B9C [UNPROTECTED]',
    memoryAddress: '0x7FFF5FBFFB80',
  },
  telemetryRows: [
    { label: 'STREAM ENCODING', value: 'GREEN PHOSPHOR CARRIER', binaryHint: '00110001' },
    { label: 'STATUS CODE', value: 'ST-0x06 [CARRIER_24KB_FLOW]', binaryHint: '00110110' },
    { label: 'SYNTAX CLASS', value: 'COMPLEX EQUATION MATRIX', binaryHint: '01000101' },
    { label: 'PARSER STATUS', value: 'PARALLEL DECOMPILATION ACTIVE', binaryHint: '01010000' },
    { label: 'CIPHER KEY', value: '0x3F8A2B9C [UNPROTECTED]', binaryHint: '01001011' },
  ],
  baseVx: 0.245,
  baseVy: 0.44,
  hitRadius: 44,
  panelSide: 'left',
  targetDepth: 'ambient',
  tracksSubjectMotion: false,
};

// =============================================================================
// REGISTRY & COLLECTIONS
// =============================================================================

/**
 * Core 4 scene elements requested: Person, Hand, Suit, Shard
 */
export const CORE_SCENE_ELEMENTS = {
  person: PERSON_ELEMENT,
  hand: HAND_ELEMENT,
  suit: SUIT_ELEMENT,
  shard: SHARD_ELEMENT,
  Person: PERSON_ELEMENT,
  Hand: HAND_ELEMENT,
  Suit: SUIT_ELEMENT,
  Shard: SHARD_ELEMENT,
} as const;

/**
 * Full dictionary of all scene elements by key and id
 */
export const SCENE_ELEMENTS: Record<string, SceneElementConfig> = {
  person: PERSON_ELEMENT,
  hand: HAND_ELEMENT,
  suit: SUIT_ELEMENT,
  shard: SHARD_ELEMENT,
  Person: PERSON_ELEMENT,
  Hand: HAND_ELEMENT,
  Suit: SUIT_ELEMENT,
  Shard: SHARD_ELEMENT,
  'agent-core': PERSON_ELEMENT,
  'tactile-interface': HAND_ELEMENT,
  'structural-body': SUIT_ELEMENT,
  'digital-shards': SHARD_ELEMENT,
  optic: OPTIC_ELEMENT,
  'neural-optic': OPTIC_ELEMENT,
  stream: STREAM_ELEMENT,
  'binary-stream': STREAM_ELEMENT,
};

/**
 * Standard array of all elements for rendering the interactive scanner HUD
 */
export const SCENE_ELEMENTS_LIST: SceneElementConfig[] = [
  PERSON_ELEMENT,
  OPTIC_ELEMENT,
  HAND_ELEMENT,
  SUIT_ELEMENT,
  SHARD_ELEMENT,
  STREAM_ELEMENT,
];

/**
 * Alias exported as SCAN_TARGETS for seamless integration with overlay components
 */
export const SCAN_TARGETS: SceneElementConfig[] = SCENE_ELEMENTS_LIST;

/**
 * Helper to retrieve a scene element by key or id safely
 */
export function getSceneElement(keyOrId: string): SceneElementConfig | undefined {
  return SCENE_ELEMENTS[keyOrId];
}
