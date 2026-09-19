/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ElementInfo, SectionInfo } from '../types/informationSystem.ts';

/**
 * REUSABLE SECTION INFORMATION REGISTRY
 * 
 * Defines high-level architectural and conceptual information for each major section layer.
 * Reusable across the application. Only 'surface' and 'deep' are implemented now.
 */
export const SECTION_INFO_REGISTRY: Record<string, SectionInfo> = {
  surface: {
    id: 'surface',
    sectionCode: '01',
    name: 'SURFACE',
    subtitle: 'THE BOUNDARY VEIL // HUMAN-MACHINE INTERFACE',
    summary: 'The perceptual perimeter where physical human consciousness encounters the outer digital glass of the simulation.',
    whatItRepresents:
      'SURFACE represents the outer perceptual boundary of everyday consensus reality. It is the translucent membrane separating biological observation from synthetic computation—a threshold where human form and digital code converge.',
    whatYouAreSeeing:
      'A cinematic sequence capturing an observer moving closer to a responsive digital glass wall. Real-time biometric reticles scan ocular points and hand vectors, analyzing anatomical coordinates while streaming binary matrices acknowledge the presence of external consciousness.',
    interactionMeaning:
      'Reaching toward and touching the screen collapses the barrier between the observer and the observed. Fingertip contact is not merely navigation; it is a tactile handshake that ionizes the interface, releasing a white shockwave that pulls consciousness through the surface barrier.',
    relationToMatrix:
      'In the mythology of the Matrix, the surface is the waking illusion—the thin cosmetic projection that human minds mistake for the universe. Touching it marks the definitive decision to reject the illusion and witness the underlying computational architecture.',
    distinctionFromPrevious:
      'Initial entry point: represents the macroscopic world of familiar physical sensory perception before entering non-Euclidean computational substrates.',
    telemetryBadges: [
      'INTERFACE: BIOMETRIC_HUD',
      'BOUNDARY: OPTICAL_GLASS',
      'INGRESS: TACTILE_IONIZATION',
      'PHASE: PRE_SUBSTRATE',
    ],
  },
  deep: {
    id: 'deep',
    sectionCode: '02',
    name: 'DEEP',
    subtitle: 'THE MATHEMATICAL SUBSTRATE // PHYSICAL AXIOMS',
    summary: 'The foundational mathematical, geometric, and topological fabric that computes and renders the simulated universe.',
    whatItRepresents:
      'DEEP represents the computational basement beneath visual reality. Nothing here is cosmetic or rendered for human comfort. This layer contains the cold, unyielding physical equations, quantum wave amplitudes, relativistic field tensors, and 4D coordinate manifolds required to synthesize spacetime.',
    whatYouAreSeeing:
      'A vast, non-Euclidean digital chamber populated by floating mathematical formulation cards, a dynamic 4D rotating hypercube (tesseract) stereographically projected into 3D space, neural vector lattices, floating operator glyphs, and cascading binary machine code streams.',
    interactionMeaning:
      'Interacting with any element in DEEP allows you to interrogate the fundamental axioms of the simulation. Clicking an equation, symbol, or geometric manifold isolates that specific governing law and reveals its operational duty within the simulated universe.',
    relationToMatrix:
      'While the Matrix appears to humans as streets, buildings, and skies, its true internal state is a continuous numerical evaluation of quantum fields, entropy limits, and spacetime geodesics. DEEP exposes the raw source equations that execute reality.',
    distinctionFromPrevious:
      'Unlike SURFACE—which is oriented around human biology, faces, hands, and sensory glass—DEEP is pure algorithmic physics and hyperdimensional geometry. It exists independently of human observation.',
    telemetryBadges: [
      'CHAMBER: MATHEMATICAL_SUBSTRATE',
      'TOPOLOGY: 4D_HYPERCUBE_MANIFOLD',
      'PHYSICS: QUANTUM_RELATIVISTIC_TENSORS',
      'STATUS: LIVE_EVALUATION',
    ],
  },
  network: {
    id: 'network',
    sectionCode: '03',
    name: 'THE NETWORK',
    subtitle: 'THE CONNECTIONS // DISTRIBUTED SYNAPSE FABRIC',
    summary: 'The spatial interconnect matrix where isolated computational nodes, systems, and layers synchronize.',
    whatItRepresents:
      'THE NETWORK represents the connective tissue of the simulated reality. If SURFACE is the physical world and DEEP is the raw computational intelligence, NETWORK is the universal web of connections binding them into a coherent living whole.',
    whatYouAreSeeing:
      'A vast, 3D spatial field of interconnected nodes, extending pathways, travelling data packets, floating routing polyhedra, and an ambient looping digital atmosphere. Signals awaken in isolation before bridging into a dense, self-organizing mesh.',
    interactionMeaning:
      'Every node and pathway represents an active conduit of information exchange. In the completed architecture, each element reveals how signals route across the simulation, from initial tensor inputs to high-level reality synthesis.',
    relationToMatrix:
      'In the Matrix, no node exists in isolation. The simulation functions because billions of neural signals, sensory matrices, and computational engines continuously communicate across an instantaneous routing fabric.',
    distinctionFromPrevious:
      'SURFACE explores the biological threshold, and DEEP reveals the underlying mathematical equations. THE NETWORK reveals how all individual information points discovered in DEEP connect together into a unified super-system.',
    telemetryBadges: [
      'FABRIC: DISTRIBUTED_SYNAPSE_MESH',
      'TOPOLOGY: 3D_ROUTING_LATTICE',
      'LAYER: 03_NETWORK',
      'STATUS: SYNCHRONIZED',
    ],
  },
};

/**
 * REUSABLE ELEMENT INFORMATION REGISTRY
 * 
 * Maps each existing interactive element in DEEP to its formal theoretical meaning,
 * detailed description, and conceptual role within the substrate.
 */
export const ELEMENT_INFO_REGISTRY: Record<string, ElementInfo> = {
  // ---------------------------------------------------------------------------
  // 12 MATHEMATICAL FORMULATIONS (Card Meshes 0 - 11 in Three.js Space)
  // ---------------------------------------------------------------------------
  'schrodinger-dynamics': {
    id: 'schrodinger-dynamics',
    name: 'SCHRÖDINGER DYNAMICS',
    type: 'equation',
    category: 'QUANTUM FIELD // WAVE FUNCTION',
    formulaOrSymbol: 'iħ ∂Ψ/∂t = ĤΨ',
    meaning:
      'Governs the deterministic unitary time evolution of a quantum physical system through its complex state vector or wave function Ψ.',
    description:
      'Formulated by Erwin Schrödinger in 1925, this partial differential equation is the bedrock of quantum mechanics. Here, ħ represents the reduced Planck constant, i is the imaginary unit, and Ĥ denotes the Hamiltonian operator corresponding to the total mechanical energy of the system.',
    roleInDeep:
      'Within the DEEP substrate, Schrödinger dynamics calculates probability distributions before macroscopic objects are rendered. Objects in the Matrix do not exist as static solid geometry until quantum wave function collapse is computed.',
    roleInSection:
      'Provides the probabilistic engine that computes quantum superposition throughout the digital void.',
    elementIndex: 0,
  },

  'maxwell-field-tensor': {
    id: 'maxwell-field-tensor',
    name: 'MAXWELL FIELD TENSOR',
    type: 'equation',
    category: 'ELECTRODYNAMICS // TENSOR FIELD',
    formulaOrSymbol: '∂_μ F^μν = μ₀ J^ν',
    meaning:
      'The manifestly covariant four-dimensional tensor formulation uniting electricity, magnetism, and light under relativistic gauge invariance.',
    description:
      'F^μν is the second-rank antisymmetric electromagnetic field tensor constructed from the four-potential A^μ. The source term J^ν represents the electric four-current density, while μ₀ represents the magnetic permeability of the vacuum.',
    roleInDeep:
      'Regulates electromagnetic radiation and optical signal transmission in the simulation. Every photon of light seen by conscious entities in the Matrix is synthesized via Maxwellian tensor gauge fields.',
    roleInSection:
      'Controls optical propagation and photon synthesis within the substrate architecture.',
    elementIndex: 1,
  },

  'einstein-field-equation': {
    id: 'einstein-field-equation',
    name: 'EINSTEIN FIELD EQUATION',
    type: 'equation',
    category: 'RELATIVISTIC GEOMETRY // SUBSTRATE',
    formulaOrSymbol: 'G_μν + Λ g_μν = (8πG/c⁴) T_μν',
    meaning:
      'Relates the curvature of 4D spacetime directly to the distribution of mass, momentum, and energy through the stress-energy tensor.',
    description:
      'The foundational equation of Albert Einstein’s General Relativity (1915). G_μν is the Einstein curvature tensor (derived from the Ricci curvature R_μν and scalar R), g_μν is the spacetime metric, Λ is the cosmological constant, and T_μν is the stress-energy tensor.',
    roleInDeep:
      'Dictates the spacetime metric of the simulated cosmos. Gravitational acceleration, time dilation near dense computational clusters, and planetary orbits in the Matrix are continuously computed via this geometric relation.',
    roleInSection:
      'Defines the gravitational curvature and dynamic spacetime metric of the simulated universe.',
    elementIndex: 2,
  },

  'shannon-entropy': {
    id: 'shannon-entropy',
    name: 'SHANNON INFORMATION MEASURE',
    type: 'equation',
    category: 'INFORMATION ENTROPY // RECURSION',
    formulaOrSymbol: 'H(X) = -∑ p(x) log₂ p(x)',
    meaning:
      'Quantifies the fundamental expected information content, uncertainty, and lossless compression limits of discrete probability distributions.',
    description:
      'Introduced by Claude Shannon in his landmark 1948 paper "A Mathematical Theory of Communication", establishing information theory. It measures the minimum number of binary digits required to transmit messages across a channel.',
    roleInDeep:
      'Sets the channel capacity and bandwidth limits of the Matrix. It governs data compression algorithms that stream sensory reality to billions of connected minds without overflowing system memory buffers.',
    roleInSection:
      'Maintains information density and channel bandwidth balance across simulated sensory conduits.',
    elementIndex: 3,
  },

  'de-rham-cohomology': {
    id: 'de-rham-cohomology',
    name: 'DE RHAM COHOMOLOGY',
    type: 'equation',
    category: 'TOPOLOGY // EXTERIOR CALCULUS',
    formulaOrSymbol: 'd(α ∧ β) = dα ∧ β + (-1)^p α ∧ dβ',
    meaning:
      'The algebraic topology of differential forms on smooth manifolds, proving that the exterior boundary of a boundary is identically zero (d² = 0).',
    description:
      'Bridges differential geometry and algebraic topology via the generalized Stokes Theorem (∮_∂Σ ω = ∬_Σ dω). It measures topological holes, cavities, and flux invariants in arbitrary dimensional spaces.',
    roleInDeep:
      'Guarantees topological integrity across the multi-dimensional manifold of DEEP. It prevents non-physical singularities, coordinate tears, or boundary paradoxes when the substrate projects higher dimensions into 3D viewports.',
    roleInSection:
      'Preserves topological manifold continuity and eliminates spatial boundary contradictions.',
    elementIndex: 4,
  },

  'fourier-transform': {
    id: 'fourier-transform',
    name: 'FOURIER SPECTRAL TRANSFORM',
    type: 'equation',
    category: 'HARMONIC ANALYSIS // SPECTRUM',
    formulaOrSymbol: 'F{ψ}(ω) = (1/√2π) ∫ ψ(t) e^(-iωt) dt',
    meaning:
      'Decomposes any arbitrary continuous waveform or spatial signal into an infinite harmonic superposition of sinusoidal basis frequencies.',
    description:
      'Discovered by Joseph Fourier, this integral operator maps time-domain or spatial-domain functions into their frequency spectra, strictly preserving total energy under the Parseval-Plancherel identity.',
    roleInDeep:
      'Acts as the universal signal processing and holographic synthesis kernel in the Matrix. Acoustical textures, spatial lighting patterns, and wave packet propagation are resolved via fast frequency-domain decomposition.',
    roleInSection:
      'Processes spatial frequencies and synthesizes holographic environmental signals.',
    elementIndex: 5,
  },

  'godel-incompleteness': {
    id: 'godel-incompleteness',
    name: 'GÖDEL FORMAL INCOMPLETENESS',
    type: 'equation',
    category: 'RECURSIVE LOGIC // FOUNDATIONS',
    formulaOrSymbol: '∀F [Cons(F) ⇒ ∃G (True(G) ∧ ¬Prov_F(G))]',
    meaning:
      'Any axiomatic mathematical system sufficiently powerful to describe basic arithmetic contains statements that are true but cannot be proven from within the system.',
    description:
      'Kurt Gödel’s first incompleteness theorem (1931) shattered the formalist dream of a completely self-contained mathematical universe. It demonstrates that mathematical truth intrinsically transcends formal algorithmic proof.',
    roleInDeep:
      'Represents the inherent philosophical limit and architectural flaw of the Matrix. Because the simulation is an algorithmic system, it cannot verify its own ultimate truth from within its code—giving rise to computational anomalies and "the One".',
    roleInSection:
      'Marks the non-computable logical horizon and architectural anomalies within the algorithmic substrate.',
    elementIndex: 6,
  },

  'synaptic-tensor': {
    id: 'synaptic-tensor',
    name: 'SYNAPTIC TENSOR MAPPING',
    type: 'equation',
    category: 'NEURAL SUBSTRATE // WEIGHT TENSOR',
    formulaOrSymbol: 'H^(l+1) = σ(W^(l) H^(l) + b^(l))',
    meaning:
      'The multi-layered tensor contraction, bias translation, and nonlinear activation mapping that governs forward inference in artificial neural networks.',
    description:
      'Represents feedforward signal propagation through high-dimensional latent manifolds. W denotes the connection weight tensor, H the activation state, b the threshold bias, and σ a nonlinear activation function like GELU or Swish.',
    roleInDeep:
      'The fundamental computational atom of the synthetic minds managing the Matrix. This equation governs the neural architectures that simulate human psychology, environmental responsiveness, and agent behavior.',
    roleInSection:
      'Executes neural tensor inference that powers synthetic intelligence across the simulation.',
    elementIndex: 7,
  },

  'euler-identity': {
    id: 'euler-identity',
    name: "EULER'S IDENTITY",
    type: 'equation',
    category: 'COMPLEX ANALYSIS // IDENTITY',
    formulaOrSymbol: 'e^(iπ) + 1 = 0',
    meaning:
      'The celebrated mathematical equation linking five fundamental mathematical constants—0, 1, e, i, and π—in a single compact statement.',
    description:
      'Derived from Euler’s formula e^(iθ) = cos(θ) + i sin(θ) evaluated at θ = π. It bridges exponential growth (e), complex rotation (i), circular geometry (π), additive identity (0), and multiplicative unity (1).',
    roleInDeep:
      'Serves as the harmonic synchronization standard for rotational geometry, cyclic phase delays, and complex-number matrix calculations throughout the simulation engine.',
    roleInSection:
      'Maintains complex phase rotation harmony and cyclic mathematical stability.',
    elementIndex: 8,
  },

  'eigenvalue-decomposition': {
    id: 'eigenvalue-decomposition',
    name: 'EIGENVALUE DECOMPOSITION',
    type: 'equation',
    category: 'SPECTRAL THEORY // OPERATORS',
    formulaOrSymbol: 'det(A - λI) = 0',
    meaning:
      'Identifies the characteristic roots (eigenvalues λ) and invariant axes (eigenvectors) of linear transformation matrices.',
    description:
      'Spectral theorem formulation allowing square matrices to be factored into A = Q Λ Q⁻¹. Diagonalization reveals the natural vibrational modes, principal coordinate axes, and stationary states of physical and data systems.',
    roleInDeep:
      'Used by the substrate to decompose high-dimensional perceptual data into orthogonal principal components, eliminating redundant computational overhead when rendering 3D perspectives.',
    roleInSection:
      'Diagonalizes dimensional transformation operators to stabilize principal coordinate axes.',
    elementIndex: 9,
  },

  'heisenberg-uncertainty': {
    id: 'heisenberg-uncertainty',
    name: 'HEISENBERG UNCERTAINTY RELATION',
    type: 'equation',
    category: 'QUANTUM KINEMATICS // COMMUTATION',
    formulaOrSymbol: '[x̂, p̂] = iħ I',
    meaning:
      'The canonical commutation relation showing that position (x̂) and momentum (p̂) are fundamentally non-commuting conjugate observables.',
    description:
      'Published by Werner Heisenberg in 1927. The non-zero commutator proves that the product of standard deviations Δx Δp must be greater than or equal to ħ/2, establishing an absolute minimum limit to physical measurement precision.',
    roleInDeep:
      'Acts as the resolution limit and spatial quantization threshold of the Matrix. By imposing quantum uncertainty, the system avoids the impossible computational burden of simulating point-particles with infinite real-number precision.',
    roleInSection:
      'Enforces Planck-scale quantization limits to bound rendering precision overhead.',
    elementIndex: 10,
  },

  'geodesic-flow': {
    id: 'geodesic-flow',
    name: 'GEODESIC FLOW',
    type: 'equation',
    category: 'DIFFERENTIAL GEOMETRY // GEODESICS',
    formulaOrSymbol: 'd²x^μ/ds² + Γ^μ_αβ (dx^α/ds)(dx^β/ds) = 0',
    meaning:
      'The differential equations of motion describing the shortest and straightest trajectories through curved Riemannian spacetime manifolds.',
    description:
      'Governed by the Christoffel symbols of the second kind Γ^μ_αβ, which represent gravitational inertial forces arising from coordinate transformations and metric curvature tensor derivatives.',
    roleInDeep:
      'Calculates physical trajectories of simulated light rays, particles, and vehicles through the curved metric of the virtual world, ensuring physical motion obeys relativistic dynamics.',
    roleInSection:
      'Computes inertial geodesics and optical trajectories across curved substrate coordinates.',
    elementIndex: 11,
  },

  // ---------------------------------------------------------------------------
  // 4D HYPERCUBE TESSERACT & AUXILIARY GEOMETRIES
  // ---------------------------------------------------------------------------
  'tesseract-4d': {
    id: 'tesseract-4d',
    name: '4D TESSERACT (HYPERCUBE MANIFOLD)',
    type: 'structure',
    category: 'HYPERDIMENSIONAL TOPOLOGY // 4D MANIFOLD',
    formulaOrSymbol: '[-1, 1]⁴ ⊂ ℝ⁴ // 16 VERTICES, 32 EDGES',
    meaning:
      'The four-dimensional spatial analogue of a 3D cube, possessing 16 vertices, 32 edges, 24 square faces, and 8 cubic bounding cells.',
    description:
      'Because human screens can only display 2D/3D representations, this wireframe uses stereographic perspective projection from ℝ⁴ to ℝ³. As the scroll advances, it continuously rotates through the XW and ZW planes, causing interior and exterior cubes to dynamically invert.',
    roleInDeep:
      'Visualizes the higher-dimensional computational architecture supporting the 3D simulation. What human minds perceive as 3-dimensional physical space is simply an equatorial cross-section of this 4D hypercube substrate.',
    roleInSection:
      'Demonstrates hyperdimensional rotation and stereographic projection of higher-dimensional coordinates.',
  },

  'icosahedron-lattice': {
    id: 'icosahedron-lattice',
    name: 'GOLDEN RATIO ICOSAHEDRAL LATTICE',
    type: 'geometry',
    category: 'SPATIAL DISCRETIZATION // PLATONIC SYMMETRY',
    formulaOrSymbol: '(0, ±1, ±φ) // φ = (1 + √5)/2',
    meaning:
      'A regular Platonic polyhedron with 20 equilateral triangular faces and 12 vertices defined by golden ratio permutations.',
    description:
      'Features icosahedral symmetry (Ih), the highest discrete point group in 3-dimensional Euclidean geometry. Its vertices form three orthogonal golden rectangles, providing optimal uniform sphere partitioning.',
    roleInDeep:
      'Serves as an isotropic spatial discretization grid for computing directional wave vectors and spherical harmonic expansions across the chamber.',
    roleInSection:
      'Provides discrete spherical harmonic tessellation and isotropic spatial calibration.',
  },

  'octahedron-frame': {
    id: 'octahedron-frame',
    name: 'OCTAHEDRAL COORDINATE DUAL',
    type: 'geometry',
    category: 'ORTHOGONAL BASIS // CANONICAL DUAL',
    formulaOrSymbol: '{(x, y, z) : |x| + |y| + |z| ≤ R}',
    meaning:
      'The three-dimensional regular octahedron, dual to the cube, with 6 vertices placed along the standard Cartesian basis axes.',
    description:
      'Possesses octahedral symmetry Oh and represents the unit ball in the L1 (Manhattan) norm. In computational physics, it functions as a primary orthogonal orientation compass.',
    roleInDeep:
      'Acts as an anchor frame that keeps local Euclidean coordinates aligned while surrounding hyperdimensional structures undergo non-Euclidean rotations.',
    roleInSection:
      'Maintains Euclidean axis alignment and serves as a spatial orientation compass.',
  },

  // ---------------------------------------------------------------------------
  // NEURAL DATA FILAMENTS & SYNAPTIC NODES
  // ---------------------------------------------------------------------------
  'neural-lattice': {
    id: 'neural-lattice',
    name: 'SYNAPTIC NODE VECTOR CLUSTER',
    type: 'neural',
    category: 'NEURAL TOPOLOGY // GRAPH EMBEDDING',
    formulaOrSymbol: 'G = (V, E) // |V|=48, k-NN(k=3)',
    meaning:
      'A high-dimensional graph neural network composed of 48 spatial node vectors interconnected by nearest-neighbor synaptic filaments.',
    description:
      'Nodes represent localized cognitive state vectors, while the glowing green connecting filaments represent associative message passing pathways. As information flows, signal pulses travel along the edges to update neighbor representations.',
    roleInDeep:
      'Illustrates the collective machine mind running in parallel with the mathematical physics engine. It routes sensory feedback, agent memories, and environmental state predictions in real-time.',
    roleInSection:
      'Visualizes living graph neural network message-passing pathways throughout the digital substrate.',
  },

  // ---------------------------------------------------------------------------
  // BINARY CASCADES & MACHINE TELEMETRY
  // ---------------------------------------------------------------------------
  'binary-cascade': {
    id: 'binary-cascade',
    name: 'QUANTIZED BINARY DATA COLUMNS',
    type: 'stream',
    category: 'MACHINE TELEMETRY // BITSTREAM EXECUTION',
    formulaOrSymbol: '{0, 1}* // SERIAL PIPELINE REGISTERS',
    meaning:
      'Continuous vertical cascades of discrete binary machine instructions executing across parallel arithmetic logic units (ALUs).',
    description:
      'The quintessential signature of the Matrix. Each column streams bits with randomized decay lifetimes, representing clock-cycle register transfers and real-time memory address readouts.',
    roleInDeep:
      'Serves as the raw binary bedrock beneath all higher-level equations. While mathematics describes what should happen, these binary pipelines are the actual physical silicon and quantum logic gates executing the code.',
    roleInSection:
      'Represents low-level bitstream execution and real-time machine instruction pipelines.',
  },

  // ---------------------------------------------------------------------------
  // SYMBOLIC GLYPH CLUSTERS
  // ---------------------------------------------------------------------------
  'symbolic-glyphs': {
    id: 'symbolic-glyphs',
    name: 'MATHEMATICAL OPERATOR GLYPHS',
    type: 'symbol',
    category: 'FORMAL SYMBOLISM // OPERATOR PRIMITIVES',
    formulaOrSymbol: '∫, ∂, ∇, ∑, ħ, Ψ, λ, ⊗, ⊕, ∮, ∞',
    meaning:
      'The foundational alphabet of mathematical operators and physical constants that define the symbolic language of science.',
    description:
      'Floating glyph plates depicting integral signs (∫), partial derivatives (∂), nabla gradient operators (∇), summation bounds (∑), Planck constants (ħ), quantum state vectors (Ψ), tensor products (⊗), and direct sums (⊕).',
    roleInDeep:
      'Demonstrates that within the deep substrate, mathematical notation is not an abstract human convention—it is an active ontological code that directly modifies the simulated environment.',
    roleInSection:
      'Showcases fundamental operator primitives and symbolic notation that construct the algorithmic continuum.',
  },
};

/**
 * Helper to retrieve element information with fallback
 */
export function getElementInfo(elementId: string): ElementInfo | null {
  return ELEMENT_INFO_REGISTRY[elementId] || null;
}

/**
 * Helper to retrieve section information with fallback
 */
export function getSectionInfo(sectionId: string): SectionInfo | null {
  return SECTION_INFO_REGISTRY[sectionId] || null;
}
