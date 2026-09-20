/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UniversalMetric {
  label: string;
  value: string;
}

export interface UniversalAboutData {
  id: string;
  code: string;
  title: string;
  category: string;
  status: string;
  summary: string;
  description: string;
  metrics: UniversalMetric[];
  accentColor?: string;
}

/**
 * Universal Registry of "About Info" for all elements across the entire website.
 * Covers UI controls, 3D entities, mathematical formulations, and spatial structures.
 */
export const UNIVERSAL_ABOUT_REGISTRY: Record<string, UniversalAboutData> = {
  // ==========================================================================
  // GLOBAL UI ELEMENTS
  // ==========================================================================
  'nav-surface': {
    id: 'nav-surface',
    code: 'NAV // SEC-01',
    title: 'LAYER 01: SURFACE // THE BOUNDARY VEIL',
    category: 'NAVIGATION // PERCEPTUAL HORIZON',
    status: 'ACTIVE // ONLINE',
    summary: 'The outer threshold where biological human consciousness encounters the digital glass of the simulation.',
    description:
      'SURFACE represents the outer perceptual envelope of everyday consensus reality. It is the translucent membrane separating biological observation from synthetic computation. Interacting with it ionizes the interface, releasing a white shockwave that pulls consciousness through into the substrate.',
    metrics: [
      { label: 'COORDINATE', value: 'TIMELINE 0.00 - 0.31' },
      { label: 'BOUNDARY', value: 'OPTICAL GLASS' },
      { label: 'INGRESS', value: 'TACTILE IONIZATION' },
      { label: 'PHASE', value: 'PRE-SUBSTRATE' },
    ],
    accentColor: '#4ade80',
  },

  'nav-deep': {
    id: 'nav-deep',
    code: 'NAV // SEC-02',
    title: 'LAYER 02: DEEP // THE MATHEMATICAL SUBSTRATE',
    category: 'NAVIGATION // COMPUTATIONAL BASEMENT',
    status: 'SYNCHRONIZED // COMPUTING',
    summary: 'The foundational mathematical, geometric, and physical laws computing and rendering simulated spacetime.',
    description:
      'DEEP represents the raw algorithmic engine running beneath visual reality. Contains the cold, unyielding physical equations, quantum wave functions, relativistic field tensors, and a 4D rotating hypercube (tesseract) that synthesize geometry and perception.',
    metrics: [
      { label: 'COORDINATE', value: 'TIMELINE 0.32 - 0.65' },
      { label: 'TOPOLOGY', value: '4D HYPERCUBE TESSERACT' },
      { label: 'PHYSICS', value: 'QUANTUM-RELATIVISTIC' },
      { label: 'STATE', value: 'CONTINUOUS EVALUATION' },
    ],
    accentColor: '#86efac',
  },

  'nav-network': {
    id: 'nav-network',
    code: 'NAV // SEC-03',
    title: 'LAYER 03: THE NETWORK // SPATIAL INTERCONNECT',
    category: 'NAVIGATION // DISTRIBUTED SYNAPSE',
    status: 'ACTIVE // 18 NODES CONVERGED',
    summary: 'The spatial interconnect matrix where distributed computational nodes synchronize with the central 3D sphere artifact model.',
    description:
      'THE NETWORK represents the living connective tissue of the simulated reality. A massive 3D spatial field of 18 interconnected nodes, flowing data packet streams, dynamic conduits, and the central 3D sphere artifact model continuously exchanging reality vectors.',
    metrics: [
      { label: 'COORDINATE', value: 'TIMELINE 0.64 - 1.00' },
      { label: 'TOPOLOGY', value: '3D ROUTING LATTICE' },
      { label: 'THROUGHPUT', value: '480.2 PB/s' },
      { label: 'SYNC RATE', value: '99.9998%' },
    ],
    accentColor: '#22c55e',
  },

  'brand-wordmark': {
    id: 'brand-wordmark',
    code: 'SYS // ROOT-00',
    title: 'THROUGH THE MATRIX // EXPERIENCE ARCHITECTURE',
    category: 'SIMULATION CORE // MASTER TIMELINE',
    status: 'INITIALIZED // 60 FPS',
    summary: 'The unified cinematic master journey traversing the three core layers of synthetic reality.',
    description:
      'Through The Matrix is an interactive architectural simulation designed to guide human perception through three distinct structural layers: the biological boundary (SURFACE), the mathematical axioms (DEEP), and the universal synaptic fabric (THE NETWORK). All state is linked along a seamless 1350vh timeline.',
    metrics: [
      { label: 'FRAMEWORK', value: 'REACT + THREE.JS' },
      { label: 'TIMELINE', value: '1350vh MASTER' },
      { label: 'SHADING', value: 'CUSTOM GLSL + PROCEDURAL' },
      { label: 'DIMENSIONS', value: '4D -> 3D PROJECTION' },
    ],
    accentColor: '#86efac',
  },

  'vertical-progress': {
    id: 'vertical-progress',
    code: 'HUD // DEPTH-01',
    title: 'DIMENSIONAL DEPTH & PROGRESS TELEMETRY',
    category: 'HUD SENSOR // COORDINATE TRACKER',
    status: 'REAL-TIME TRACKING',
    summary: 'Continuous 64-bit normalized coordinate tracker measuring vertical penetration through the matrix.',
    description:
      'Displays real-time timeline scroll progress, current active layer code (01, 02, or 03), and high-precision fractional depth metrics. Guides the observer through the exact operational envelope of the simulation.',
    metrics: [
      { label: 'SAMPLING', value: '120 Hz SUBPIXEL' },
      { label: 'RANGE', value: '0.0000 -> 1.0000' },
      { label: 'SECTOR', value: 'ACTIVE SYNC' },
      { label: 'OUTPUT', value: 'NORMALIZED SCALAR' },
    ],
    accentColor: '#4ade80',
  },

  'auto-scroll-btn': {
    id: 'auto-scroll-btn',
    code: 'ENG // PROPULSION',
    title: 'AUTONOMOUS TIMELINE PROPULSION ENGINE',
    category: 'LOCOMOTION // VELOCITY CONTROLLER',
    status: 'READY // RESPONSIVE',
    summary: 'Autonomous continuous propulsion mechanism driving smooth cinematic timeline navigation.',
    description:
      'Allows hands-free cinematic observation by automatically calculating dynamic timeline velocity. Can be engaged with a single touch or click, and gracefully yields whenever manual touch scrolling or dragging is initiated.',
    metrics: [
      { label: 'MODE', value: 'AUTONOMOUS KINEMATICS' },
      { label: 'DAMPING', value: 'EXPONENTIAL SMOOTH' },
      { label: 'OVERRIDE', value: 'INSTANT ON TOUCH' },
      { label: 'ENERGY', value: 'COHERENT DRIFT' },
    ],
    accentColor: '#86efac',
  },

  'contextual-narrative': {
    id: 'contextual-narrative',
    code: 'NEURAL // STREAM',
    title: 'COGNITIVE PERCEPTION STREAM',
    category: 'NARRATIVE HUD // PSYCHOMETRICS',
    status: 'TRANSMITTING',
    summary: 'Real-time sensory telemetry reflecting the observer’s psychological and neural state.',
    description:
      'Decodes and renders streaming narrative telemetry as the observer approaches the digital glass and enters the non-Euclidean computational continuum. Tracks consciousness cohesion, perceptual breakdown, and synthetic convergence.',
    metrics: [
      { label: 'DATASTREAM', value: 'PARALLEL BITSTREAM' },
      { label: 'ENCODING', value: 'CHAKRA PETCH MONO' },
      { label: 'FIDELITY', value: 'SYNCHRONIZED' },
      { label: 'RESONANCE', value: '100% NEURAL' },
    ],
    accentColor: '#22c55e',
  },

  'substrate-button': {
    id: 'substrate-button',
    code: 'AXIOM // SUBSTRATE',
    title: 'MATHEMATICAL SUBSTRATE CATALOG // HUD',
    category: 'AXIOM EXPLORER // EQUATION INDEX',
    status: '12 FORMULATIONS LOADED',
    summary: 'Interactive index of the 12 governing physical, quantum, and logical laws computing the simulation.',
    description:
      'Provides direct access to the 12 foundational mathematical cards floating in DEEP space. Allows immediate inspection of Schrödinger dynamics, Einstein field equations, Dirac spinors, Gödel incompleteness, and the 4D hypercube.',
    metrics: [
      { label: 'CARD COUNT', value: '12 FORMULATIONS' },
      { label: 'OPERATORS', value: 'TENSOR, INTEGRAL, WAVE' },
      { label: 'GEOMETRY', value: 'NON-EUCLIDEAN' },
      { label: 'STATUS', value: 'INTERACTIVE INSPECT' },
    ],
    accentColor: '#86efac',
  },

  // ==========================================================================
  // LIVING CALCULATION CONSTRUCTS
  // ==========================================================================
  'sigma-convergence': {
    id: 'sigma-convergence',
    code: 'CALC // Σ-CONVERGE',
    title: 'DISCRETE SUMMATION CONVERGENCE (∑)',
    category: 'SERIES CONVERGENCE // LATTICE SYNTHESIZER',
    status: 'GENERATIVE // LIVE CALCULATION',
    summary: 'The Sigma operator pulls scattered numerical and coordinate tokens toward its central calculation axis, crystallizing into an articulated geometric lattice.',
    description:
      'Rather than serving as decorative symbols, equations in DEEP are living generative mechanisms. When Sigma evaluates, nearby scattered data points converge, forming dynamic relationship lasers that assemble a structured polygonal lattice.',
    metrics: [
      { label: 'OPERATOR', value: 'DISCRETE SUMMATION (∑)' },
      { label: 'EQUATION', value: '∑ k⁻ˢ = ζ(s)' },
      { label: 'RESULT', value: 'POLYGONAL LATTICE' },
      { label: 'STATE', value: 'DYNAMIC CONVERGENCE' },
    ],
    accentColor: '#4ade80',
  },

  'nabla-gradient': {
    id: 'nabla-gradient',
    code: 'CALC // ∇-GRADIENT',
    title: 'GRADIENT VECTOR FIELD (∇)',
    category: 'VECTOR FIELD // MANIFOLD CURVATURE',
    status: 'GENERATIVE // LIVE CALCULATION',
    summary: 'Computes spatial gradients, flexing curved coordinate manifolds and guiding floating data particles along potential vectors.',
    description:
      'The Nabla differential operator computes multidimensional gradients. As calculation executes, directional vectors erupt along the local field, flexing the contour ribs of a parabolic geometric manifold.',
    metrics: [
      { label: 'OPERATOR', value: 'NABLA GRADIENT (∇)' },
      { label: 'EQUATION', value: '∇²Φ = 0 • ∇×A = B' },
      { label: 'RESULT', value: 'CURVED MANIFOLD' },
      { label: 'STATE', value: 'VECTOR DIRECTED' },
    ],
    accentColor: '#22c55e',
  },

  'lambda-spectral': {
    id: 'lambda-spectral',
    code: 'CALC // λ-SPECTRAL',
    title: 'SPECTRAL HARMONIC MODULATOR (λ)',
    category: 'SPECTRAL OPERATOR // HARMONIC WAVE',
    status: 'GENERATIVE // LIVE CALCULATION',
    summary: 'Determines characteristic spatial wavelengths, stimulating data points to oscillate in harmonic unison along multi-track ribbons.',
    description:
      'The Lambda eigenvalue operator governs spectral frequencies. Evaluating it drives sinusoidal oscillations across geometric ribbons, illustrating how continuous wave surfaces are generated from discrete eigenvalue calculations.',
    metrics: [
      { label: 'OPERATOR', value: 'EIGENVALUE / WAVELENGTH (λ)' },
      { label: 'EQUATION', value: 'λ f(x) = Ĥ f(x)' },
      { label: 'RESULT', value: 'HARMONIC WAVE RIBBON' },
      { label: 'STATE', value: 'RESONANT FREQUENCY' },
    ],
    accentColor: '#86efac',
  },

  'integral-accumulation': {
    id: 'integral-accumulation',
    code: 'CALC // ∫-INTEGRAL',
    title: 'CONTINUOUS ACCUMULATION MEASURE (∫)',
    category: 'STOKES MEASURE // VOLUMETRIC PRISM',
    status: 'GENERATIVE // LIVE CALCULATION',
    summary: 'Integrates infinitesimal area slices into volumetric spatial enclosures.',
    description:
      'The Integral operator accumulates scattered differential data paths into continuous geometric forms. As the calculation executes, stratified planar slices illuminate in sequence along the vertical axis, forming a complete volumetric prism.',
    metrics: [
      { label: 'OPERATOR', value: 'DEFINITE INTEGRAL (∫)' },
      { label: 'EQUATION', value: '∫_Ω ω = ∮_∂Ω dω' },
      { label: 'RESULT', value: 'STRATIFIED PRISM' },
      { label: 'STATE', value: 'VOLUMETRIC ACCUMULATION' },
    ],
    accentColor: '#4ade80',
  },

  'pi-metric': {
    id: 'pi-metric',
    code: 'CALC // π-METRIC',
    title: 'CIRCULAR METRIC & GEODESIC RESONATOR (π)',
    category: 'METRIC INVARIANCE // GEODESIC FRAMEWORK',
    status: 'GENERATIVE // LIVE CALCULATION',
    summary: 'Anchors circular topology invariance and radial metric boundaries across coordinate space.',
    description:
      'The Pi construct maintains rotational metric consistency. Evaluation pulses three concentric geodesic rings, expanding and contracting radial spoke needles in harmonic equilibrium.',
    metrics: [
      { label: 'OPERATOR', value: 'RADIAL INVARIANCE (π)' },
      { label: 'EQUATION', value: 'e^(iπ) + 1 = 0' },
      { label: 'RESULT', value: 'GEODESIC RINGS' },
      { label: 'STATE', value: 'RADIAL HARMONY' },
    ],
    accentColor: '#22c55e',
  },

  'delta-differential': {
    id: 'delta-differential',
    code: 'CALC // Δ-DELTA',
    title: 'DIFFERENTIAL COORDINATE SHIFTER (Δ)',
    category: 'DIFFERENTIAL SHIFT // COORDINATE CALIBRATION',
    status: 'GENERATIVE // LIVE CALCULATION',
    summary: 'Calculates finite increments and uncertainties, perturbing and recalibrating floating coordinate cube matrices.',
    description:
      'The Delta differential operator calculates finite increments and uncertainties. Activating Delta applies a dynamic spatial perturbation to a floating 3D coordinate cube matrix, shifting its vertices before recalibrating to baseline.',
    metrics: [
      { label: 'OPERATOR', value: 'FINITE DIFFERENCE (Δ)' },
      { label: 'EQUATION', value: 'Δx → 0 • ΔE Δt ≥ ħ/2' },
      { label: 'RESULT', value: 'PERTURBED CUBE MATRIX' },
      { label: 'STATE', value: 'UNCERTAINTY CALIBRATION' },
    ],
    accentColor: '#86efac',
  },

  'partial-flux': {
    id: 'partial-flux',
    code: 'CALC // ∂-FLUX',
    title: 'PARTIAL FLUX & CONTINUITY GATE (∂)',
    category: 'FLUX DIVERGENCE // POLYHEDRAL CAGE',
    status: 'GENERATIVE // LIVE CALCULATION',
    summary: 'Monitors conserved informational flux, filtering data tokens through translucent dodecahedral facets.',
    description:
      'The Partial derivative operator monitors conserved informational flux. When triggered, translucent dodecahedral facets shimmer as data tokens pass through their wireframe boundaries into a central core singularity.',
    metrics: [
      { label: 'OPERATOR', value: 'PARTIAL DERIVATIVE (∂)' },
      { label: 'EQUATION', value: '∂ρ/∂t + ∇·j = 0' },
      { label: 'RESULT', value: 'DODECAHEDRAL CAGE' },
      { label: 'STATE', value: 'FLUX CONSERVATION' },
    ],
    accentColor: '#4ade80',
  },

  'infinity-limit': {
    id: 'infinity-limit',
    code: 'CALC // ∞-LIMIT',
    title: 'ASYMPTOTIC LIMIT & INFINITE LOOP (∞)',
    category: 'ASYMPTOTIC CONVERGENCE // RECURSIVE LOOP',
    status: 'GENERATIVE // LIVE CALCULATION',
    summary: 'Calculates infinite recursion limits, accelerating data tokens along continuous Bernoulli lemniscate curves.',
    description:
      'The Infinity operator governs asymptotic convergence. Activation accelerates data tokens along the continuous curvature of a Bernoulli lemniscate loop, simulating infinite convergence within finite computational bounds.',
    metrics: [
      { label: 'OPERATOR', value: 'ASYMPTOTIC LIMIT (∞)' },
      { label: 'EQUATION', value: 'lim (1 + 1/n)^n = e' },
      { label: 'RESULT', value: 'LEMNISCATE DUAL LOOP' },
      { label: 'STATE', value: 'ASYMPTOTIC RECURSION' },
    ],
    accentColor: '#22c55e',
  },
};

export function getUniversalAboutInfo(id: string): UniversalAboutData | null {
  return UNIVERSAL_ABOUT_REGISTRY[id] || null;
}
