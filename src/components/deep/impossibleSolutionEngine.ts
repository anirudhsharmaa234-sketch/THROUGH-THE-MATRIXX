/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import {
  ImpossibleSolutionMetrics,
  ImpossibleSolutionPhase,
} from '../../types/livingCalculationTypes.ts';
import { PhysicalMaterializationEngine } from './physicalMaterializationEngine.ts';

// 8 Primary Convergence Vector angles corresponding to the 8 Living Calculation Constructs
const CONVERGENCE_DIRECTIONS = [
  { angle: 0, radY: 18, label: 'SCHRÖDINGER' },
  { angle: Math.PI * 0.25, radY: -14, label: 'RIEMANN' },
  { angle: Math.PI * 0.50, radY: 22, label: 'EULER' },
  { angle: Math.PI * 0.75, radY: -20, label: 'EINSTEIN' },
  { angle: Math.PI * 1.00, radY: 15, label: 'MAXWELL' },
  { angle: Math.PI * 1.25, radY: -18, label: 'DIRAC' },
  { angle: Math.PI * 1.50, radY: 20, label: 'GÖDEL' },
  { angle: Math.PI * 1.75, radY: -16, label: 'ENTROPY' },
];

// Target coordinates for Network Genesis conduits (matching Section 3 Network topology origin)
const NETWORK_GENESIS_DESTINATIONS = [
  new THREE.Vector3(0, 20, -70),       // Central Entity Core
  new THREE.Vector3(-110, 60, -130),   // Alpha Node Cluster
  new THREE.Vector3(120, -40, -140),   // Beta Wave Cluster
  new THREE.Vector3(-70, -55, -200),   // Gamma Flux
  new THREE.Vector3(95, 70, -190),     // Delta Hub
  new THREE.Vector3(-180, 25, -280),   // Outer Relay 1
  new THREE.Vector3(175, -20, -290),   // Outer Relay 2
  new THREE.Vector3(0, -75, -240),     // Ground Lattice
];

export class ImpossibleSolutionEngine {
  public masterGroup: THREE.Group;

  // 1. Non-Euclidean Topological Inversion Core (Nested mini-universe inside monolith)
  private inversionGroup: THREE.Group;
  private nestedTesseract: THREE.LineSegments;
  private nestedHorizonRings: THREE.LineSegments;
  private nestedCoreAperture: THREE.Mesh;

  // 2. Inter-Layer Convergence Braids (Harmonic spline conduits from outer DEEP into monolith)
  private convergenceBraidsGroup: THREE.Group;
  private braidLines: THREE.Line[];
  private braidParticles: THREE.Points;
  private braidParticlePositions: Float32Array;

  // 3. Equilibrium / Halted Calculation Stabilization Rings
  private equilibriumGroup: THREE.Group;
  private equilibriumRings: THREE.LineSegments;
  private solutionHorizonPlane: THREE.Mesh;

  // 4. Network Genesis Conduit System (8 vector pathways branching into Section 3 Network topology)
  private networkGenesisGroup: THREE.Group;
  private networkConduitLines: THREE.Line[];
  private networkConduitPulses: THREE.Points;
  private networkPulsePositions: Float32Array;
  private networkPulseProgresses: number[];
  private networkTerminalNodes: THREE.Points;

  // Memory & WebGL resource tracking
  private managedGeometries: THREE.BufferGeometry[] = [];
  private managedMaterials: THREE.Material[] = [];
  private managedTextures: THREE.Texture[] = [];

  // Current calculated metrics
  public currentMetrics: ImpossibleSolutionMetrics = {
    phase: 'dormant',
    phaseProgress: 0,
    convergenceFactor: 0,
    impossibleFactor: 0,
    calculationStability: 0,
    networkTopologyGenesis: 0,
    isSolutionActive: false,
    isImpossibleResolved: false,
    stateIndicator: 'DEEP SYSTEM // STATE // CONVERGED',
    subReadout: 'SOLUTION // RESOLVED',
  };

  constructor(scene: THREE.Scene) {
    this.masterGroup = new THREE.Group();
    this.masterGroup.name = 'impossible-solution-master-group';
    // Anchored at z = -600, exactly concentric with the Step 4 Materialized Physical Monolith
    this.masterGroup.position.set(0, 0, -600);
    scene.add(this.masterGroup);

    // Build sub-assemblies
    const inversion = this.buildInversionCore();
    this.inversionGroup = inversion.group;
    this.nestedTesseract = inversion.tesseract;
    this.nestedHorizonRings = inversion.horizonRings;
    this.nestedCoreAperture = inversion.aperture;
    this.masterGroup.add(this.inversionGroup);

    const braids = this.buildConvergenceBraids();
    this.convergenceBraidsGroup = braids.group;
    this.braidLines = braids.lines;
    this.braidParticles = braids.particles;
    this.braidParticlePositions = braids.particlePositions;
    this.masterGroup.add(this.convergenceBraidsGroup);

    const equilibrium = this.buildEquilibriumStructure();
    this.equilibriumGroup = equilibrium.group;
    this.equilibriumRings = equilibrium.rings;
    this.solutionHorizonPlane = equilibrium.horizonPlane;
    this.masterGroup.add(this.equilibriumGroup);

    const genesis = this.buildNetworkGenesisConduits();
    this.networkGenesisGroup = genesis.group;
    this.networkConduitLines = genesis.conduitLines;
    this.networkConduitPulses = genesis.conduitPulses;
    this.networkPulsePositions = genesis.pulsePositions;
    this.networkPulseProgresses = genesis.pulseProgresses;
    this.networkTerminalNodes = genesis.terminalNodes;
    this.masterGroup.add(this.networkGenesisGroup);
  }

  // =========================================================================
  // SUB-ASSEMBLY BUILDERS
  // =========================================================================

  /**
   * 1. Builds the Non-Euclidean Inversion Core
   * Situated inside the monolith, revealing that the surrounding cosmic calculation
   * is nested inside its core in inverse mathematical proportion.
   */
  private buildInversionCore(): {
    group: THREE.Group;
    tesseract: THREE.LineSegments;
    horizonRings: THREE.LineSegments;
    aperture: THREE.Mesh;
  } {
    const group = new THREE.Group();

    // Nested Hypercube / Tesseract representing the folded outer universe inside the core
    const tesseractVertices: number[] = [];
    const size = 18;
    const innerSize = 9;
    // Outer cube
    const oc = [
      [-size, -size, -size], [size, -size, -size],
      [size, size, -size], [-size, size, -size],
      [-size, -size, size], [size, -size, size],
      [size, size, size], [-size, size, size],
    ];
    // Inner cube
    const ic = [
      [-innerSize, -innerSize, -innerSize], [innerSize, -innerSize, -innerSize],
      [innerSize, innerSize, -innerSize], [-innerSize, innerSize, -innerSize],
      [-innerSize, -innerSize, innerSize], [innerSize, -innerSize, innerSize],
      [innerSize, innerSize, innerSize], [-innerSize, innerSize, innerSize],
    ];

    const addEdge = (a: number[], b: number[]) => {
      tesseractVertices.push(a[0], a[1], a[2], b[0], b[1], b[2]);
    };

    // Outer cube edges
    const edges = [
      [0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],
      [0,4],[1,5],[2,6],[3,7]
    ];
    edges.forEach(([i, j]) => addEdge(oc[i], oc[j]));
    edges.forEach(([i, j]) => addEdge(ic[i], ic[j]));
    // 4D projection interconnects
    for (let k = 0; k < 8; k++) {
      addEdge(oc[k], ic[k]);
    }

    const tesseractGeo = new THREE.BufferGeometry();
    tesseractGeo.setAttribute('position', new THREE.Float32BufferAttribute(tesseractVertices, 3));
    this.managedGeometries.push(tesseractGeo);

    const tesseractMat = new THREE.LineBasicMaterial({
      color: 0x86efac,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.managedMaterials.push(tesseractMat);

    const tesseract = new THREE.LineSegments(tesseractGeo, tesseractMat);
    group.add(tesseract);

    // Concentric nested horizon rings
    const ringSegments = 64;
    const ringVertices: number[] = [];
    const ringRadii = [6, 12, 20, 28];
    ringRadii.forEach((r, ringIdx) => {
      const zOffset = (ringIdx - 1.5) * 4;
      for (let s = 0; s < ringSegments; s++) {
        const theta1 = (s / ringSegments) * Math.PI * 2;
        const theta2 = ((s + 1) / ringSegments) * Math.PI * 2;
        ringVertices.push(
          Math.cos(theta1) * r, Math.sin(theta1) * r, zOffset,
          Math.cos(theta2) * r, Math.sin(theta2) * r, zOffset
        );
      }
    });
    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute('position', new THREE.Float32BufferAttribute(ringVertices, 3));
    this.managedGeometries.push(ringGeo);

    const ringMat = new THREE.LineBasicMaterial({
      color: 0x4ade80,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.managedMaterials.push(ringMat);

    const horizonRings = new THREE.LineSegments(ringGeo, ringMat);
    group.add(horizonRings);

    // Optical Core Aperture: Translucent spherical quantum lens inside the monolith
    const apertureGeo = new THREE.IcosahedronGeometry(14, 2);
    this.managedGeometries.push(apertureGeo);
    const apertureMat = new THREE.MeshBasicMaterial({
      color: 0xf0fdf4,
      transparent: true,
      opacity: 0,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.managedMaterials.push(apertureMat);
    const aperture = new THREE.Mesh(apertureGeo, apertureMat);
    group.add(aperture);

    return { group, tesseract, horizonRings, aperture };
  }

  /**
   * 2. Builds the Inter-Layer Convergence Braids
   * 8 glowing harmonic spline conduits linking outer living calculation coordinates
   * into the monolith's core without spatial clipping or destruction.
   */
  private buildConvergenceBraids(): {
    group: THREE.Group;
    lines: THREE.Line[];
    particles: THREE.Points;
    particlePositions: Float32Array;
  } {
    const group = new THREE.Group();
    const lines: THREE.Line[] = [];

    // Outer calculation origins in space relative to monolith at (0, 0, -600):
    // Construct coordinates are around z = -100 to z = 300, so relative z is +300 to +700
    const outerRadius = 140;

    CONVERGENCE_DIRECTIONS.forEach((dir, i) => {
      const startX = Math.cos(dir.angle) * outerRadius;
      const startY = Math.sin(dir.angle) * outerRadius + dir.radY;
      const startZ = 450 + (i % 3) * 60; // Relative to monolith (world z = -150)

      const mid1X = Math.cos(dir.angle + 0.3) * (outerRadius * 0.6);
      const mid1Y = Math.sin(dir.angle + 0.3) * (outerRadius * 0.6);
      const mid1Z = 220;

      const mid2X = Math.cos(dir.angle - 0.2) * 45;
      const mid2Y = Math.sin(dir.angle - 0.2) * 45;
      const mid2Z = 80;

      // Terminates at monolith core node
      const endX = Math.cos(dir.angle) * 8;
      const endY = Math.sin(dir.angle) * 8;
      const endZ = 0;

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(startX, startY, startZ),
        new THREE.Vector3(mid1X, mid1Y, mid1Z),
        new THREE.Vector3(mid2X, mid2Y, mid2Z),
        new THREE.Vector3(endX, endY, endZ),
      ]);
      curve.curveType = 'centripetal';

      const points = curve.getPoints(48);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      this.managedGeometries.push(geo);

      const mat = new THREE.LineBasicMaterial({
        color: 0x22c55e,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      this.managedMaterials.push(mat);

      const line = new THREE.Line(geo, mat);
      group.add(line);
      lines.push(line);
    });

    // Convergence Data Particles flowing along the braids
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = 0;
      particlePositions[p * 3 + 1] = 0;
      particlePositions[p * 3 + 2] = 0;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    this.managedGeometries.push(particleGeo);

    const particleMat = new THREE.PointsMaterial({
      color: 0x86efac,
      size: 3.2,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.managedMaterials.push(particleMat);

    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    return { group, lines, particles, particlePositions };
  }

  /**
   * 3. Builds the Equilibrium / Halted Calculation Structure
   * Symmetrical radial coordinate rings that lock in integer phase when the system stops calculating.
   */
  private buildEquilibriumStructure(): {
    group: THREE.Group;
    rings: THREE.LineSegments;
    horizonPlane: THREE.Mesh;
  } {
    const group = new THREE.Group();

    // Symmetrical geometric equilibrium disc
    const segs = 96;
    const vertices: number[] = [];
    const radii = [32, 54, 82, 115, 150];
    radii.forEach((r, idx) => {
      const zPos = (idx - 2) * 3;
      for (let s = 0; s < segs; s++) {
        const th1 = (s / segs) * Math.PI * 2;
        const th2 = ((s + 1) / segs) * Math.PI * 2;
        vertices.push(
          Math.cos(th1) * r, Math.sin(th1) * r, zPos,
          Math.cos(th2) * r, Math.sin(th2) * r, zPos
        );
      }
    });
    // Radial spoke vectors
    for (let sp = 0; sp < 16; sp++) {
      const th = (sp / 16) * Math.PI * 2;
      vertices.push(
        Math.cos(th) * 25, Math.sin(th) * 25, 0,
        Math.cos(th) * 150, Math.sin(th) * 150, 0
      );
    }

    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.managedGeometries.push(ringGeo);

    const ringMat = new THREE.LineBasicMaterial({
      color: 0x4ade80,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.managedMaterials.push(ringMat);

    const rings = new THREE.LineSegments(ringGeo, ringMat);
    group.add(rings);

    // Solution Horizon Plane: A razor-thin harmonic planar grid at z = 0
    const planeGeo = new THREE.RingGeometry(18, 148, 64, 4);
    this.managedGeometries.push(planeGeo);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x052e16,
      transparent: true,
      opacity: 0,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.managedMaterials.push(planeMat);
    const horizonPlane = new THREE.Mesh(planeGeo, planeMat);
    group.add(horizonPlane);

    return { group, rings, horizonPlane };
  }

  /**
   * 4. Builds the Network Genesis Conduit System
   * 8 primary vector conduits that radiate forward from the monolith at z = -600
   * into the coordinates of Section 3's Central Entity and Primary Nodes (z = -70 to z = +200).
   */
  private buildNetworkGenesisConduits(): {
    group: THREE.Group;
    conduitLines: THREE.Line[];
    conduitPulses: THREE.Points;
    pulsePositions: Float32Array;
    pulseProgresses: number[];
    terminalNodes: THREE.Points;
  } {
    const group = new THREE.Group();
    const conduitLines: THREE.Line[] = [];

    // Each conduit begins at monolith center (0, 0, 0) relative to monolith
    // and extends forward to NETWORK_GENESIS_DESTINATIONS (converted to relative coords)
    // Monolith world Z is -600. Destination world Z is -70 -> relative Z is +530.
    NETWORK_GENESIS_DESTINATIONS.forEach((dest, i) => {
      const relDest = new THREE.Vector3(dest.x, dest.y, dest.z - (-600));

      // 3-point spline with subtle natural cybernetic curve
      const midPoint = new THREE.Vector3(
        dest.x * 0.45 + Math.sin(i * 1.2) * 30,
        dest.y * 0.45 + Math.cos(i * 1.2) * 20,
        relDest.z * 0.5
      );

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        midPoint,
        relDest,
      ]);
      curve.curveType = 'centripetal';

      const points = curve.getPoints(54);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      this.managedGeometries.push(geo);

      const mat = new THREE.LineBasicMaterial({
        color: 0x4ade80,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      this.managedMaterials.push(mat);

      const line = new THREE.Line(geo, mat);
      group.add(line);
      conduitLines.push(line);
    });

    // Traveling Data Packets along the conduits
    const pulseCount = 64;
    const pulsePositions = new Float32Array(pulseCount * 3);
    const pulseProgresses: number[] = [];
    for (let p = 0; p < pulseCount; p++) {
      pulsePositions[p * 3] = 0;
      pulsePositions[p * 3 + 1] = 0;
      pulsePositions[p * 3 + 2] = 0;
      pulseProgresses.push((p / pulseCount));
    }
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
    this.managedGeometries.push(pulseGeo);

    const pulseMat = new THREE.PointsMaterial({
      color: 0xf0fdf4,
      size: 4.5,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.managedMaterials.push(pulseMat);

    const conduitPulses = new THREE.Points(pulseGeo, pulseMat);
    group.add(conduitPulses);

    // Terminal Node Beacons at the tips of the conduits (initial seeds of Network nodes)
    const nodeCount = NETWORK_GENESIS_DESTINATIONS.length;
    const nodePositions = new Float32Array(nodeCount * 3);
    NETWORK_GENESIS_DESTINATIONS.forEach((dest, i) => {
      const relDest = new THREE.Vector3(dest.x, dest.y, dest.z - (-600));
      nodePositions[i * 3] = relDest.x;
      nodePositions[i * 3 + 1] = relDest.y;
      nodePositions[i * 3 + 2] = relDest.z;
    });
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    this.managedGeometries.push(nodeGeo);

    const nodeMat = new THREE.PointsMaterial({
      color: 0x86efac,
      size: 7.5,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.managedMaterials.push(nodeMat);

    const terminalNodes = new THREE.Points(nodeGeo, nodeMat);
    group.add(terminalNodes);

    return {
      group,
      conduitLines,
      conduitPulses,
      pulsePositions,
      pulseProgresses,
      terminalNodes,
    };
  }

  // =========================================================================
  // UPDATE LOOP (100% Scroll-Controlled & Fully Reversible)
  // =========================================================================

  /**
   * Updates the Impossible Solution sequence.
   *
   * Scroll Timeline:
   * p < 0.938: Dormant
   * p in [0.938, 0.954]: CONVERGENCE BUILDUP (Elements align, equations synchronize, recursive structures converge)
   * p in [0.954, 0.968]: THE IMPOSSIBLE STATE (Non-Euclidean topological inversion, outer universe nested in monolith)
   * p in [0.968, 0.982]: CALCULATION HALTED (System stops calculating, particles slow, noise vanishes, answer reached)
   * p in [0.982, 0.996]: NETWORK GENESIS (Structured signal radiates, 8 conduits form Network root topology)
   * p in [0.996, 1.000]: NETWORK HANDOFF (Continuous bridge into Section 3 Network opening)
   */
  public update(
    delta: number,
    time: number,
    scrollProgress: number,
    materializationEngine?: PhysicalMaterializationEngine
  ): ImpossibleSolutionMetrics {
    const p = scrollProgress;

    let phase: ImpossibleSolutionPhase = 'dormant';
    let phaseProgress = 0;
    let convergenceFactor = 0;
    let impossibleFactor = 0;
    let calculationStability = 0;
    let networkTopologyGenesis = 0;
    let isSolutionActive = false;
    let isImpossibleResolved = false;
    let stateIndicator = 'DEEP SYSTEM // CALCULATION ACTIVE';
    let subReadout = 'RESOLVING QUANTUM TOPOLOGY...';

    if (p >= 0.938 && p < 0.954) {
      phase = 'convergence_buildup';
      phaseProgress = (p - 0.938) / 0.016;
      convergenceFactor = phaseProgress;
      isSolutionActive = true;
      stateIndicator = 'CONVERGENCE // SYNCHRONIZING';
      subReadout = 'ALIGNING 8 MATHEMATICAL CONSTRUCTS';
    } else if (p >= 0.954 && p < 0.968) {
      phase = 'impossible_state';
      phaseProgress = (p - 0.954) / 0.014;
      convergenceFactor = 1.0;
      impossibleFactor = phaseProgress;
      isSolutionActive = true;
      stateIndicator = 'NON-EUCLIDEAN TOPOLOGICAL INVERSION';
      subReadout = 'OUTER UNIVERSE NESTED IN MONOLITH CORE';
    } else if (p >= 0.968 && p < 0.982) {
      phase = 'calculation_halted';
      phaseProgress = (p - 0.968) / 0.014;
      convergenceFactor = 1.0;
      impossibleFactor = 1.0;
      calculationStability = phaseProgress;
      isSolutionActive = true;
      isImpossibleResolved = true;
      stateIndicator = 'DEEP SYSTEM // STATE // CONVERGED';
      subReadout = 'SOLUTION // RESOLVED';
    } else if (p >= 0.982 && p < 0.996) {
      phase = 'network_genesis';
      phaseProgress = (p - 0.982) / 0.014;
      convergenceFactor = 1.0;
      impossibleFactor = 1.0;
      calculationStability = 1.0;
      networkTopologyGenesis = phaseProgress;
      isSolutionActive = true;
      isImpossibleResolved = true;
      stateIndicator = 'DEEP SYSTEM // STATE // CONVERGED';
      subReadout = 'NETWORK TOPOLOGY SYNTHESIZED';
    } else if (p >= 0.996) {
      phase = 'network_handoff';
      phaseProgress = Math.min(1, (p - 0.996) / 0.004);
      convergenceFactor = 1.0;
      impossibleFactor = 1.0;
      calculationStability = 1.0;
      networkTopologyGenesis = 1.0;
      isSolutionActive = true;
      isImpossibleResolved = true;
      stateIndicator = 'NETWORK INGRESS // ACTIVE';
      subReadout = 'THE CONNECTIONS // INITIALIZED';
    }

    this.currentMetrics = {
      phase,
      phaseProgress,
      convergenceFactor,
      impossibleFactor,
      calculationStability,
      networkTopologyGenesis,
      isSolutionActive,
      isImpossibleResolved,
      stateIndicator,
      subReadout,
    };

    // -------------------------------------------------------------------------
    // 1. UPDATE CONVERGENCE BRAIDS
    // -------------------------------------------------------------------------
    const braidAlpha = Math.min(1, convergenceFactor * 1.15);
    this.braidLines.forEach((line, idx) => {
      const mat = line.material as THREE.LineBasicMaterial;
      mat.opacity = braidAlpha * 0.75;
      // When calculation halts, braids lock into perfectly crisp neon hairlines
      if (calculationStability > 0) {
        mat.color.setHex(0x86efac);
      } else {
        mat.color.setHex(0x22c55e);
      }
    });

    // Animate particles converging inward along braids toward monolith
    const particleMat = this.braidParticles.material as THREE.PointsMaterial;
    particleMat.opacity = braidAlpha * 0.95;
    if (braidAlpha > 0.02) {
      // Speed slows down as calculation halts ("system stops calculating")
      const speedMultiplier = 1.0 - calculationStability * 0.85;
      const count = this.braidParticlePositions.length / 3;
      for (let i = 0; i < count; i++) {
        const conduitIdx = i % CONVERGENCE_DIRECTIONS.length;
        const dir = CONVERGENCE_DIRECTIONS[conduitIdx];
        const t = ((time * 0.45 * speedMultiplier + i / count) % 1.0);
        // Lerp from outer space (+450 rel Z) inward to monolith center (0, 0, 0)
        const radius = THREE.MathUtils.lerp(140, 6, Math.pow(t, 1.8));
        const angle = dir.angle + (1 - t) * 0.6;
        this.braidParticlePositions[i * 3] = Math.cos(angle) * radius;
        this.braidParticlePositions[i * 3 + 1] = Math.sin(angle) * radius + dir.radY * (1 - t);
        this.braidParticlePositions[i * 3 + 2] = THREE.MathUtils.lerp(450, 0, Math.pow(t, 1.4));
      }
      (this.braidParticles.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }

    // -------------------------------------------------------------------------
    // 2. UPDATE NON-EUCLIDEAN INVERSION CORE (The Impossible State)
    // -------------------------------------------------------------------------
    const inversionAlpha = Math.min(1, impossibleFactor * 1.25);
    (this.nestedTesseract.material as THREE.LineBasicMaterial).opacity = inversionAlpha * 0.85;
    (this.nestedHorizonRings.material as THREE.LineBasicMaterial).opacity = inversionAlpha * 0.75;
    (this.nestedCoreAperture.material as THREE.MeshBasicMaterial).opacity = inversionAlpha * 0.65;

    if (inversionAlpha > 0.01) {
      // Rotation rate slows down as calculation halts into answer equilibrium
      const rotSpeed = 1.0 - calculationStability * 0.88;
      this.nestedTesseract.rotation.x = time * 0.4 * rotSpeed;
      this.nestedTesseract.rotation.y = time * 0.6 * rotSpeed;
      this.nestedTesseract.rotation.z = p * Math.PI * 2.0;

      // Aperture dilation: expands inside the monolith revealing nested scale
      const apertureScale = 1.0 + impossibleFactor * 2.2;
      this.nestedCoreAperture.scale.set(apertureScale, apertureScale, apertureScale);
    }

    // -------------------------------------------------------------------------
    // 3. UPDATE EQUILIBRIUM STRUCTURE (Halted Calculation)
    // -------------------------------------------------------------------------
    const eqAlpha = calculationStability;
    (this.equilibriumRings.material as THREE.LineBasicMaterial).opacity = eqAlpha * 0.70;
    (this.solutionHorizonPlane.material as THREE.MeshBasicMaterial).opacity = eqAlpha * 0.35;
    if (eqAlpha > 0.01) {
      // Perfect stationary mathematical symmetry
      this.equilibriumRings.rotation.z = Math.round(p * 8) * (Math.PI / 8);
    }

    // -------------------------------------------------------------------------
    // 4. UPDATE NETWORK GENESIS CONDUITS
    // -------------------------------------------------------------------------
    const genesisAlpha = networkTopologyGenesis;
    this.networkConduitLines.forEach((line) => {
      const mat = line.material as THREE.LineBasicMaterial;
      mat.opacity = genesisAlpha * 0.85;
      mat.color.setHex(0x4ade80);
    });

    const pulseMat = this.networkConduitPulses.material as THREE.PointsMaterial;
    pulseMat.opacity = genesisAlpha * 0.95;

    const nodeMat = this.networkTerminalNodes.material as THREE.PointsMaterial;
    nodeMat.opacity = genesisAlpha * 0.90;
    // Pulsing size of terminal network node seeds
    nodeMat.size = 6.0 + Math.sin(time * 4.0) * 1.8;

    if (genesisAlpha > 0.02) {
      // Flow packets along the conduits forward into the Network space
      const pulseCount = this.networkPulseProgresses.length;
      for (let i = 0; i < pulseCount; i++) {
        const conduitIdx = i % NETWORK_GENESIS_DESTINATIONS.length;
        const dest = NETWORK_GENESIS_DESTINATIONS[conduitIdx];
        const relDest = new THREE.Vector3(dest.x, dest.y, dest.z - (-600));

        // Advance progress
        this.networkPulseProgresses[i] = (this.networkPulseProgresses[i] + delta * 0.5) % 1.0;
        const prog = this.networkPulseProgresses[i];

        // 3-point CatmullRom evaluation
        const midPoint = new THREE.Vector3(
          dest.x * 0.45 + Math.sin(conduitIdx * 1.2) * 30,
          dest.y * 0.45 + Math.cos(conduitIdx * 1.2) * 20,
          relDest.z * 0.5
        );
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0, 0),
          midPoint,
          relDest,
        ]);
        const pt = curve.getPoint(prog);

        this.networkPulsePositions[i * 3] = pt.x;
        this.networkPulsePositions[i * 3 + 1] = pt.y;
        this.networkPulsePositions[i * 3 + 2] = pt.z;
      }
      (this.networkConduitPulses.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }

    // -------------------------------------------------------------------------
    // 5. COORDINATE WITH MATERIALIZATION ENGINE (The Object as the Center)
    // -------------------------------------------------------------------------
    if (materializationEngine && isSolutionActive) {
      // Instruct monolith facets to become translucent during the impossible state
      // so the visitor can look inside the monolith and see the nested cosmos
      const monolithGroup = materializationEngine.masterGroup;
      if (monolithGroup) {
        // Monolith remains rock-steady as the anchor center
        const settleRate = 1.0 - calculationStability * 0.95;
        monolithGroup.rotation.y = time * 0.15 * settleRate + impossibleFactor * 0.1;
      }
    }

    return this.currentMetrics;
  }

  /**
   * Returns the gravitational / convergence pull center for other engines.
   */
  public getConvergenceCenter(): { position: THREE.Vector3; factor: number; stability: number } {
    return {
      position: new THREE.Vector3(0, 0, -600),
      factor: this.currentMetrics.convergenceFactor,
      stability: this.currentMetrics.calculationStability,
    };
  }

  // =========================================================================
  // CLEANUP & MEMORY MANAGEMENT
  // =========================================================================

  public dispose(): void {
    if (this.masterGroup.parent) {
      this.masterGroup.parent.remove(this.masterGroup);
    }
    this.managedGeometries.forEach((g) => g.dispose());
    this.managedMaterials.forEach((m) => m.dispose());
    this.managedTextures.forEach((t) => t.dispose());
    this.managedGeometries = [];
    this.managedMaterials = [];
    this.managedTextures = [];
  }
}
