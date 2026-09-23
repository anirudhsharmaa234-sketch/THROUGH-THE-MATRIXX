/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import {
  RecursiveDepthLevel,
  RecursivePhase,
  RecursiveDeepMetrics,
} from '../../types/livingCalculationTypes.ts';

/**
 * RECURSIVE DEEP ENGINE
 *
 * Implements Step 3 of DEEP: "RECURSIVE DEEP"
 *
 * Core Concept:
 * The visitor discovers that the mathematical structures inside DEEP contain
 * another layer of the same computational world.
 *
 * Key Visual Paradox:
 * A structure that appears finite from the outside contains a much larger
 * environment inside it. The visitor does not simply zoom into an object;
 * they physically ENTER it.
 *
 * Recursive Hierarchy:
 * - RECURSIVE_CORE_01: Primary exterior structure (at z = -320)
 *     ↓ (Cross Boundary 1: p ~ 0.78 - 0.82)
 * - DEPTH 01: Massive internal computational universe (scale paradox: 10x larger inside)
 *     ↓ (Approach RECURSIVE_CORE_02: p ~ 0.82 - 0.86)
 * - RECURSIVE_CORE_02: Self-similar transformed core (at z = -1100)
 *     ↓ (Cross Boundary 2: p ~ 0.86 - 0.89)
 * - DEPTH 02: Deeper harmonic calculus realm
 *     ↓ (Approach RECURSIVE_CORE_03: p ~ 0.89 - 0.93)
 * - RECURSIVE_CORE_03: Primordial computational substrate (at z = -2200)
 *     ↓ (Depth 03 -> Singularity convergence)
 *
 * Fully scroll-controlled, 100% reversible, high-performance instanced/procedural geometry.
 */
export class RecursiveDeepEngine {
  public masterGroup: THREE.Group;

  // Stable Core Objects
  public core01Group: THREE.Group; // RECURSIVE_CORE_01
  public core02Group: THREE.Group; // RECURSIVE_CORE_02
  public core03Group: THREE.Group; // RECURSIVE_CORE_03

  // Internal Massive Environments (The Impossible Scale)
  public depth01WorldGroup: THREE.Group;
  public depth02WorldGroup: THREE.Group;
  public depth03WorldGroup: THREE.Group;

  // Boundary Crossing Particle Conduit
  private boundaryParticlesMesh: THREE.Points;
  private boundaryParticlesGeo: THREE.BufferGeometry;
  private boundaryParticlePos: Float32Array;
  private boundaryParticleVel: Float32Array;

  // Core 01 Components
  private core01OuterShell: THREE.Mesh;
  private core01InnerLattice: THREE.LineSegments;
  private core01ConcentricRings: THREE.LineSegments;
  private core01DepthPreviewGroup: THREE.Group;
  private core01CentripetalFilaments: THREE.LineSegments;

  // Core 02 Components (Self-Similar Transformed)
  private core02OuterPolyhedron: THREE.Mesh;
  private core02StellatedLattice: THREE.LineSegments;
  private core02HarmonicRings: THREE.LineSegments;

  // Core 03 Components (Primordial Core)
  private core03MobiusLattice: THREE.LineSegments;
  private core03SingularityCore: THREE.Mesh;

  // Internal World 1 Components (Depth 01)
  private depth01RadialGrid: THREE.LineSegments;
  private depth01CalculusRings: THREE.Group;
  private depth01DataPathways: THREE.LineSegments;
  private depth01FloatingFormulas: THREE.Group;

  // Internal World 2 Components (Depth 02)
  private depth02InvertedLattice: THREE.LineSegments;
  private depth02WaveGeometry: THREE.LineSegments;

  // Internal World 3 Components (Depth 03)
  private depth03PrimordialGrid: THREE.LineSegments;
  private depth03DataSingularityLines: THREE.LineSegments;

  // Materials track for clean disposal
  private managedMaterials: THREE.Material[] = [];
  private managedGeometries: THREE.BufferGeometry[] = [];
  private managedTextures: THREE.Texture[] = [];

  // Active Metrics
  public currentMetrics: RecursiveDeepMetrics = {
    currentDepth: 0,
    phase: 'dormant',
    activeCoreId: null,
    invitationFactor: 0,
    boundaryPenetration: 0,
    internalExpansionFactor: 1.0,
    selfSimilarityIndex: 0,
    isRecursiveActive: false,
    depthLabel: 'DEPTH // 00',
    modelLabel: 'SPATIAL MODEL // BASELINE',
  };

  constructor(scene: THREE.Scene) {
    this.masterGroup = new THREE.Group();
    this.masterGroup.name = 'recursive-deep-master-group';
    scene.add(this.masterGroup);

    // 1. RECURSIVE_CORE_01 Setup (Anchor: z = -320)
    this.core01Group = new THREE.Group();
    this.core01Group.position.set(0, 0, -320);
    this.core01Group.name = 'RECURSIVE_CORE_01';
    this.core01Group.userData = {
      id: 'RECURSIVE_CORE_01',
      title: 'RECURSIVE CORE 01',
      type: 'recursive-structure',
    };
    this.masterGroup.add(this.core01Group);

    const { outerShell, innerLattice, concentricRings, previewGroup, centripetalFilaments } =
      this.buildCore01();
    this.core01OuterShell = outerShell;
    this.core01InnerLattice = innerLattice;
    this.core01ConcentricRings = concentricRings;
    this.core01DepthPreviewGroup = previewGroup;
    this.core01CentripetalFilaments = centripetalFilaments;

    // 2. DEPTH 01 Massive Internal World Setup (Anchor: z = -320 to -1100)
    this.depth01WorldGroup = new THREE.Group();
    this.depth01WorldGroup.position.set(0, 0, -320);
    this.depth01WorldGroup.name = 'DEPTH_01_MASSIVE_WORLD';
    this.masterGroup.add(this.depth01WorldGroup);

    const { radialGrid, calculusRings, pathways, formulas } = this.buildDepth01World();
    this.depth01RadialGrid = radialGrid;
    this.depth01CalculusRings = calculusRings;
    this.depth01DataPathways = pathways;
    this.depth01FloatingFormulas = formulas;

    // 3. RECURSIVE_CORE_02 Setup (Anchor: z = -1100)
    this.core02Group = new THREE.Group();
    this.core02Group.position.set(0, 0, -1100);
    this.core02Group.name = 'RECURSIVE_CORE_02';
    this.core02Group.userData = {
      id: 'RECURSIVE_CORE_02',
      title: 'RECURSIVE CORE 02',
      type: 'recursive-structure',
    };
    this.masterGroup.add(this.core02Group);

    const { c2Outer, c2Stellated, c2Harmonic } = this.buildCore02();
    this.core02OuterPolyhedron = c2Outer;
    this.core02StellatedLattice = c2Stellated;
    this.core02HarmonicRings = c2Harmonic;

    // 4. DEPTH 02 Massive Internal World Setup (Anchor: z = -1100 to -2200)
    this.depth02WorldGroup = new THREE.Group();
    this.depth02WorldGroup.position.set(0, 0, -1100);
    this.depth02WorldGroup.name = 'DEPTH_02_WORLD';
    this.masterGroup.add(this.depth02WorldGroup);

    const { invertedLattice, waveGeo } = this.buildDepth02World();
    this.depth02InvertedLattice = invertedLattice;
    this.depth02WaveGeometry = waveGeo;

    // 5. RECURSIVE_CORE_03 Setup (Anchor: z = -2200)
    this.core03Group = new THREE.Group();
    this.core03Group.position.set(0, 0, -2200);
    this.core03Group.name = 'RECURSIVE_CORE_03';
    this.core03Group.userData = {
      id: 'RECURSIVE_CORE_03',
      title: 'RECURSIVE CORE 03',
      type: 'recursive-structure',
    };
    this.masterGroup.add(this.core03Group);

    const { mobiusLattice, singularityCore } = this.buildCore03();
    this.core03MobiusLattice = mobiusLattice;
    this.core03SingularityCore = singularityCore;

    // 6. DEPTH 03 Primordial World Setup (Anchor: z = -2200 to -3200)
    this.depth03WorldGroup = new THREE.Group();
    this.depth03WorldGroup.position.set(0, 0, -2200);
    this.depth03WorldGroup.name = 'DEPTH_03_PRIMORDIAL_WORLD';
    this.masterGroup.add(this.depth03WorldGroup);

    const { primordialGrid, singularityLines } = this.buildDepth03World();
    this.depth03PrimordialGrid = primordialGrid;
    this.depth03DataSingularityLines = singularityLines;

    // 7. Boundary Crossing Particle Conduit
    const { particlesMesh, particlesGeo, positions, velocities } =
      this.buildBoundaryParticles();
    this.boundaryParticlesMesh = particlesMesh;
    this.boundaryParticlesGeo = particlesGeo;
    this.boundaryParticlePos = positions;
    this.boundaryParticleVel = velocities;
    this.masterGroup.add(this.boundaryParticlesMesh);
  }

  // =========================================================================
  // BUILD METHODS
  // =========================================================================

  /**
   * Builds RECURSIVE_CORE_01:
   * Polyhedral outer shell with internal nested preview lattices and centripetal filaments.
   */
  private buildCore01() {
    // 1. Outer Translucent Polyhedral Boundary Shell
    const shellGeo = new THREE.IcosahedronGeometry(96, 1);
    this.managedGeometries.push(shellGeo);

    const shellMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      wireframe: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(shellMat);
    const outerShell = new THREE.Mesh(shellGeo, shellMat);
    this.core01Group.add(outerShell);

    // 2. Concentric Counter-Rotating Coordinate Rings
    const ringSegments: number[] = [];
    const ringRadii = [65, 80, 110];
    ringRadii.forEach((radius, ringIdx) => {
      const segs = 36;
      for (let i = 0; i < segs; i++) {
        const a1 = (i / segs) * Math.PI * 2;
        const a2 = ((i + 1) / segs) * Math.PI * 2;
        if (ringIdx === 0) {
          ringSegments.push(
            Math.cos(a1) * radius, Math.sin(a1) * radius, 0,
            Math.cos(a2) * radius, Math.sin(a2) * radius, 0
          );
        } else if (ringIdx === 1) {
          ringSegments.push(
            Math.cos(a1) * radius, 0, Math.sin(a1) * radius,
            Math.cos(a2) * radius, 0, Math.sin(a2) * radius
          );
        } else {
          ringSegments.push(
            0, Math.cos(a1) * radius, Math.sin(a1) * radius,
            0, Math.cos(a2) * radius, Math.sin(a2) * radius
          );
        }
      }
    });

    const ringsGeo = new THREE.BufferGeometry();
    ringsGeo.setAttribute('position', new THREE.Float32BufferAttribute(ringSegments, 3));
    this.managedGeometries.push(ringsGeo);

    const ringsMat = new THREE.LineBasicMaterial({
      color: 0x86efac,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(ringsMat);
    const concentricRings = new THREE.LineSegments(ringsGeo, ringsMat);
    this.core01Group.add(concentricRings);

    // 3. Inner Lattice Structure (Nested Octahedron & Cubic Struts)
    const innerLatticeGeo = new THREE.OctahedronGeometry(50, 1);
    this.managedGeometries.push(innerLatticeGeo);
    const innerLatticeWireGeo = new THREE.WireframeGeometry(innerLatticeGeo);
    this.managedGeometries.push(innerLatticeWireGeo);

    const innerLatticeMat = new THREE.LineBasicMaterial({
      color: 0x4ade80,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(innerLatticeMat);
    const innerLattice = new THREE.LineSegments(innerLatticeWireGeo, innerLatticeMat);
    this.core01Group.add(innerLattice);

    // 4. Depth Preview Group (Microcosmic universe visible inside before entry)
    const previewGroup = new THREE.Group();
    const previewGeo = new THREE.IcosahedronGeometry(28, 0);
    this.managedGeometries.push(previewGeo);
    const previewMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(previewMat);
    const previewMesh = new THREE.Mesh(previewGeo, previewMat);
    previewGroup.add(previewMesh);
    this.core01Group.add(previewGroup);

    // 5. Centripetal Ingress Filaments (Attract nearby ambient streams toward core)
    const centripetalSegments: number[] = [];
    const filamentCount = 28;
    for (let i = 0; i < filamentCount; i++) {
      const theta = (i / filamentCount) * Math.PI * 2;
      const phi = ((i * 1.618) % 1) * Math.PI - Math.PI / 2;
      const outerR = 280 + (i % 5) * 40;
      const innerR = 85;

      const ox = Math.cos(theta) * Math.cos(phi) * outerR;
      const oy = Math.sin(phi) * outerR;
      const oz = Math.sin(theta) * Math.cos(phi) * outerR;

      const ix = Math.cos(theta) * Math.cos(phi) * innerR;
      const iy = Math.sin(phi) * innerR;
      const iz = Math.sin(theta) * Math.cos(phi) * innerR;

      centripetalSegments.push(ox, oy, oz, ix, iy, iz);
    }

    const centripetalGeo = new THREE.BufferGeometry();
    centripetalGeo.setAttribute('position', new THREE.Float32BufferAttribute(centripetalSegments, 3));
    this.managedGeometries.push(centripetalGeo);

    const centripetalMat = new THREE.LineBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(centripetalMat);
    const centripetalFilaments = new THREE.LineSegments(centripetalGeo, centripetalMat);
    this.core01Group.add(centripetalFilaments);

    return { outerShell, innerLattice, concentricRings, previewGroup, centripetalFilaments };
  }

  /**
   * Builds DEPTH 01 Massive Internal World:
   * The "WHAT?" moment. Spans 2600u wide and 1600u deep inside an 180u core.
   */
  private buildDepth01World() {
    // 1. Vast Radial Matrix Coordinate Grid
    const gridSegments: number[] = [];
    const ringCount = 12;
    const maxRadius = 1300;

    // Concentric coordinate rings spanning thousands of units
    for (let r = 1; r <= ringCount; r++) {
      const rad = (r / ringCount) * maxRadius;
      const segs = 48;
      for (let i = 0; i < segs; i++) {
        const a1 = (i / segs) * Math.PI * 2;
        const a2 = ((i + 1) / segs) * Math.PI * 2;
        gridSegments.push(
          Math.cos(a1) * rad, -160, Math.sin(a1) * rad - 400,
          Math.cos(a2) * rad, -160, Math.sin(a2) * rad - 400
        );
      }
    }

    // Radial spokes extending outwards
    for (let s = 0; s < 16; s++) {
      const angle = (s / 16) * Math.PI * 2;
      gridSegments.push(
        0, -160, -400,
        Math.cos(angle) * maxRadius, -160, Math.sin(angle) * maxRadius - 400
      );
    }

    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridSegments, 3));
    this.managedGeometries.push(gridGeo);

    const gridMat = new THREE.LineBasicMaterial({
      color: 0x15803d,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(gridMat);
    const radialGrid = new THREE.LineSegments(gridGeo, gridMat);
    this.depth01WorldGroup.add(radialGrid);

    // 2. 8 Floating Self-Similar Calculus Rings
    const calculusRings = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const cGeo = new THREE.TorusGeometry(70 + (i % 3) * 30, 1.2, 8, 36);
      this.managedGeometries.push(cGeo);
      const cMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x4ade80 : 0x86efac,
        wireframe: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      this.managedMaterials.push(cMat);
      const ringMesh = new THREE.Mesh(cGeo, cMat);

      const angle = (i / 8) * Math.PI * 2;
      const dist = 360 + (i % 2) * 120;
      ringMesh.position.set(
        Math.cos(angle) * dist,
        Math.sin(angle) * 160,
        -400 + (i - 4) * 80
      );
      ringMesh.rotation.x = Math.PI / 4 + i * 0.3;
      ringMesh.rotation.y = angle;
      calculusRings.add(ringMesh);
    }
    this.depth01WorldGroup.add(calculusRings);

    // 3. Data Pathways streaming from Horizon to RECURSIVE_CORE_02
    const pathwaySegments: number[] = [];
    for (let p = 0; p < 24; p++) {
      const startAngle = (p / 24) * Math.PI * 2;
      const startR = 600;
      const sx = Math.cos(startAngle) * startR;
      const sy = Math.sin(startAngle) * 220;
      const sz = -100;

      // Convergence point near RECURSIVE_CORE_02 (z = -780 relative to worldGroup at -320)
      const ex = (Math.cos(startAngle * 2) * 80);
      const ey = (Math.sin(startAngle * 2) * 80);
      const ez = -780;

      pathwaySegments.push(sx, sy, sz, ex, ey, ez);
    }

    const pathwayGeo = new THREE.BufferGeometry();
    pathwayGeo.setAttribute('position', new THREE.Float32BufferAttribute(pathwaySegments, 3));
    this.managedGeometries.push(pathwayGeo);

    const pathwayMat = new THREE.LineBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(pathwayMat);
    const pathways = new THREE.LineSegments(pathwayGeo, pathwayMat);
    this.depth01WorldGroup.add(pathways);

    // 4. Floating Self-Similar Procedural Mathematical Formula Sprites
    const formulas = new THREE.Group();
    const subFormulas = [
      '\\oint_{\\mathcal{M}_1} \\omega = d\\eta',
      '\\mathcal{H}_{\\mathrm{rec}} = \\bigoplus_{k=0}^{\\infty} \\lambda^k',
      '\\lim_{n \\to \\infty} \\mathcal{T}^n(x) = \\Sigma^*',
      '\\delta S = \\int_{\\partial \\Omega} \\Phi \\wedge *\\Phi',
    ];

    subFormulas.forEach((formulaStr, fIdx) => {
      const fCanvas = document.createElement('canvas');
      fCanvas.width = 512;
      fCanvas.height = 128;
      const fCtx = fCanvas.getContext('2d');
      if (fCtx) {
        fCtx.clearRect(0, 0, 512, 128);
        fCtx.font = '600 24px "Share Tech Mono", monospace';
        fCtx.fillStyle = '#86efac';
        fCtx.textAlign = 'center';
        fCtx.textBaseline = 'middle';
        fCtx.fillText(`[ DEPTH 01 // ${formulaStr} ]`, 256, 64);
      }
      const tex = new THREE.CanvasTexture(fCanvas);
      this.managedTextures.push(tex);

      const fMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      this.managedMaterials.push(fMat);

      const fMesh = new THREE.Mesh(new THREE.PlaneGeometry(160, 40), fMat);
      const angle = (fIdx / subFormulas.length) * Math.PI * 2;
      fMesh.position.set(Math.cos(angle) * 320, 180 * (fIdx % 2 === 0 ? 1 : -1), -300 - fIdx * 90);
      formulas.add(fMesh);
    });
    this.depth01WorldGroup.add(formulas);

    return { radialGrid, calculusRings, pathways, formulas };
  }

  /**
   * Builds RECURSIVE_CORE_02:
   * Self-similar transformed core inside Depth 01 (at z = -1100).
   * Shares visual language of Core 01 but with transformed stellated octa-cube geometry.
   */
  private buildCore02() {
    // 1. Stellated Octahedron Outer Polyhedron
    const c2Geo = new THREE.OctahedronGeometry(75, 1);
    this.managedGeometries.push(c2Geo);

    const c2Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8, // Cyan-tinted emerald accent showing self-similarity evolution
      wireframe: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(c2Mat);
    const c2Outer = new THREE.Mesh(c2Geo, c2Mat);
    this.core02Group.add(c2Outer);

    // 2. Stellated Wireframe Lattice
    const stellatedGeo = new THREE.IcosahedronGeometry(55, 1);
    this.managedGeometries.push(stellatedGeo);
    const stellatedWire = new THREE.WireframeGeometry(stellatedGeo);
    this.managedGeometries.push(stellatedWire);

    const stellatedMat = new THREE.LineBasicMaterial({
      color: 0x4ade80,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(stellatedMat);
    const c2Stellated = new THREE.LineSegments(stellatedWire, stellatedMat);
    this.core02Group.add(c2Stellated);

    // 3. Harmonic Pulsing Wave Rings
    const harmonicSegments: number[] = [];
    for (let r = 0; r < 4; r++) {
      const radius = 90 + r * 22;
      const segs = 36;
      for (let i = 0; i < segs; i++) {
        const a1 = (i / segs) * Math.PI * 2;
        const a2 = ((i + 1) / segs) * Math.PI * 2;
        const wave1 = Math.sin(a1 * 6) * 12;
        const wave2 = Math.sin(a2 * 6) * 12;
        harmonicSegments.push(
          Math.cos(a1) * (radius + wave1), Math.sin(a1) * (radius + wave1), 0,
          Math.cos(a2) * (radius + wave2), Math.sin(a2) * (radius + wave2), 0
        );
      }
    }

    const harmonicGeo = new THREE.BufferGeometry();
    harmonicGeo.setAttribute('position', new THREE.Float32BufferAttribute(harmonicSegments, 3));
    this.managedGeometries.push(harmonicGeo);

    const harmonicMat = new THREE.LineBasicMaterial({
      color: 0x86efac,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(harmonicMat);
    const c2Harmonic = new THREE.LineSegments(harmonicGeo, harmonicMat);
    this.core02Group.add(c2Harmonic);

    return { c2Outer, c2Stellated, c2Harmonic };
  }

  /**
   * Builds DEPTH 02 Massive Internal World:
   * Inverted quantum lattice and wave geometry.
   */
  private buildDepth02World() {
    // 1. Inverted Hyper-Lattice
    const latticeSegments: number[] = [];
    const cols = 8;
    const rows = 8;
    const spacing = 180;
    const offsetX = -(cols * spacing) / 2;
    const offsetY = -(rows * spacing) / 2;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = offsetX + c * spacing;
        const y = offsetY + r * spacing;
        const z = -200 - ((c + r) % 3) * 60;

        // Draw crosshair nodes
        latticeSegments.push(
          x - 25, y, z, x + 25, y, z,
          x, y - 25, z, x, y + 25, z
        );
        // Connect to next column
        if (c < cols - 1) {
          latticeSegments.push(x, y, z, x + spacing, y, z);
        }
        // Connect to next row
        if (r < rows - 1) {
          latticeSegments.push(x, y, z, x, y + spacing, z);
        }
      }
    }

    const latticeGeo = new THREE.BufferGeometry();
    latticeGeo.setAttribute('position', new THREE.Float32BufferAttribute(latticeSegments, 3));
    this.managedGeometries.push(latticeGeo);

    const latticeMat = new THREE.LineBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(latticeMat);
    const invertedLattice = new THREE.LineSegments(latticeGeo, latticeMat);
    this.depth02WorldGroup.add(invertedLattice);

    // 2. Procedural Sinusoidal Wave Geometry (Topology shift from Depth 0 & 1)
    const waveSegments: number[] = [];
    const waveCount = 14;
    for (let w = 0; w < waveCount; w++) {
      const y = (w - waveCount / 2) * 60;
      const pts = 48;
      for (let p = 0; p < pts - 1; p++) {
        const x1 = (p / pts - 0.5) * 1600;
        const x2 = ((p + 1) / pts - 0.5) * 1600;
        const z1 = -500 + Math.sin(p * 0.4 + w) * 65;
        const z2 = -500 + Math.sin((p + 1) * 0.4 + w) * 65;
        waveSegments.push(x1, y, z1, x2, y, z2);
      }
    }

    const waveGeo = new THREE.BufferGeometry();
    waveGeo.setAttribute('position', new THREE.Float32BufferAttribute(waveSegments, 3));
    this.managedGeometries.push(waveGeo);

    const waveMat = new THREE.LineBasicMaterial({
      color: 0x4ade80,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(waveMat);
    const waveSegmentsMesh = new THREE.LineSegments(waveGeo, waveMat);
    this.depth02WorldGroup.add(waveSegmentsMesh);

    return { invertedLattice, waveGeo: waveSegmentsMesh };
  }

  /**
   * Builds RECURSIVE_CORE_03:
   * Primordial Computational Substrate Core at z = -2200.
   */
  private buildCore03() {
    // 1. Chiral Mobius / Toroidal Ring Lattice
    const mobiusGeo = new THREE.TorusKnotGeometry(60, 16, 64, 12, 2, 3);
    this.managedGeometries.push(mobiusGeo);
    const mobiusWire = new THREE.WireframeGeometry(mobiusGeo);
    this.managedGeometries.push(mobiusWire);

    const mobiusMat = new THREE.LineBasicMaterial({
      color: 0xa7f3d0,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(mobiusMat);
    const mobiusLattice = new THREE.LineSegments(mobiusWire, mobiusMat);
    this.core03Group.add(mobiusLattice);

    // 2. Radiant Center Singularity Seed
    const seedGeo = new THREE.DodecahedronGeometry(25, 0);
    this.managedGeometries.push(seedGeo);
    const seedMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(seedMat);
    const singularityCore = new THREE.Mesh(seedGeo, seedMat);
    this.core03Group.add(singularityCore);

    return { mobiusLattice, singularityCore };
  }

  /**
   * Builds DEPTH 03 Primordial World:
   * Hyper-dense matrix grid and singularity lines.
   */
  private buildDepth03World() {
    // 1. Primordial Quantum Matrix Grid
    const primSegments: number[] = [];
    const size = 1800;
    const step = 90;
    for (let x = -size / 2; x <= size / 2; x += step) {
      primSegments.push(x, -220, 0, x, -220, -1000);
      primSegments.push(x, 220, 0, x, 220, -1000);
    }
    for (let z = 0; z >= -1000; z -= step) {
      primSegments.push(-size / 2, -220, z, size / 2, -220, z);
      primSegments.push(-size / 2, 220, z, size / 2, 220, z);
    }

    const primGeo = new THREE.BufferGeometry();
    primGeo.setAttribute('position', new THREE.Float32BufferAttribute(primSegments, 3));
    this.managedGeometries.push(primGeo);

    const primMat = new THREE.LineBasicMaterial({
      color: 0x16a34a,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(primMat);
    const primordialGrid = new THREE.LineSegments(primGeo, primMat);
    this.depth03WorldGroup.add(primordialGrid);

    // 2. Converging Singularity Lines
    const singSegments: number[] = [];
    for (let i = 0; i < 32; i++) {
      const a = (i / 32) * Math.PI * 2;
      const r = 450;
      singSegments.push(
        Math.cos(a) * r, Math.sin(a) * r, 200,
        0, 0, -800
      );
    }

    const singGeo = new THREE.BufferGeometry();
    singGeo.setAttribute('position', new THREE.Float32BufferAttribute(singSegments, 3));
    this.managedGeometries.push(singGeo);

    const singMat = new THREE.LineBasicMaterial({
      color: 0x86efac,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(singMat);
    const singularityLines = new THREE.LineSegments(singGeo, singMat);
    this.depth03WorldGroup.add(singularityLines);

    return { primordialGrid, singularityLines };
  }

  /**
   * Builds Boundary Crossing Particle Conduit:
   * Streams forward past the camera lens during surface boundary transitions.
   */
  private buildBoundaryParticles() {
    const pCount = 180;
    const positions = new Float32Array(pCount * 3);
    const velocities = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 500;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 350;
      positions[i * 3 + 2] = -Math.random() * 800;

      velocities[i * 3 + 0] = (Math.random() - 0.5) * 15;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 15;
      velocities[i * 3 + 2] = 200 + Math.random() * 300;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.managedGeometries.push(particlesGeo);

    // Crisp green particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, '#86efac');
      grad.addColorStop(0.8, '#22c55e');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const pTex = new THREE.CanvasTexture(pCanvas);
    this.managedTextures.push(pTex);

    const particlesMat = new THREE.PointsMaterial({
      size: 7.0,
      map: pTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.managedMaterials.push(particlesMat);

    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    return { particlesMesh, particlesGeo, positions, velocities };
  }

  // =========================================================================
  // UPDATE LOOP (100% Scroll-Controlled & Reversible)
  // =========================================================================

  /**
   * Updates all recursive deep structures, scale expansions, and boundary transitions.
   *
   * Scroll Progress Timeline:
   * p < 0.74: Dormant (Dimensional Fold active in DEEP)
   * p in [0.74, 0.78]: Encounter RECURSIVE_CORE_01, Subtle Invitation, centripetal filaments
   * p in [0.78, 0.82]: Penetrate Boundary 1 -> DEPTH 01 (Impossible Scale Reveal: 10x interior)
   * p in [0.82, 0.86]: Depth 01 Cosmos -> Approach RECURSIVE_CORE_02
   * p in [0.86, 0.89]: Penetrate Boundary 2 -> DEPTH 02 (Self-Similar harmonic realm)
   * p in [0.89, 0.935]: Penetrate Boundary 3 -> DEPTH 03 (Primordial computational matrix)
   * p >= 0.935: Prepares for final singularity transit
   */
  public update(
    delta: number,
    time: number,
    scrollProgress: number,
    camera?: THREE.PerspectiveCamera
  ): RecursiveDeepMetrics {
    const p = scrollProgress;

    // Determine Recursive Phase & Metrics
    let phase: RecursivePhase = 'dormant';
    let currentDepth: RecursiveDepthLevel = 0;
    let activeCoreId: 'RECURSIVE_CORE_01' | 'RECURSIVE_CORE_02' | 'RECURSIVE_CORE_03' | null = null;
    let invitationFactor = 0;
    let boundaryPenetration = 0;
    let internalExpansionFactor = 1.0;
    let selfSimilarityIndex = 0;
    let depthLabel = 'DEPTH // 00';
    let modelLabel = 'SPATIAL MODEL // BASELINE';

    if (p >= 0.72 && p < 0.76) {
      phase = 'approaching';
      currentDepth = 0;
      activeCoreId = 'RECURSIVE_CORE_01';
      invitationFactor = (p - 0.72) / 0.04;
      depthLabel = 'DEPTH // 00';
      modelLabel = 'RECURSIVE STRUCTURE // 01';
    } else if (p >= 0.76 && p < 0.795) {
      phase = 'penetrating_1';
      currentDepth = 1;
      activeCoreId = 'RECURSIVE_CORE_01';
      boundaryPenetration = (p - 0.76) / 0.035;
      internalExpansionFactor = 1.0 + boundaryPenetration * 9.0; // 1.0 -> 10.0x scale paradox
      selfSimilarityIndex = 0.35;
      depthLabel = 'DEPTH // 01';
      modelLabel = 'SPATIAL MODEL // NESTED';
    } else if (p >= 0.795 && p < 0.825) {
      phase = 'depth_1';
      currentDepth = 1;
      activeCoreId = 'RECURSIVE_CORE_01';
      internalExpansionFactor = 10.0;
      selfSimilarityIndex = 0.65;
      depthLabel = 'DEPTH // 01';
      modelLabel = 'MODEL // SELF-SIMILAR';
    } else if (p >= 0.825) {
      phase = 'depth_1';
      currentDepth = 1;
      activeCoreId = 'RECURSIVE_CORE_01';
      internalExpansionFactor = 10.0;
      selfSimilarityIndex = 0.85;
      depthLabel = 'DEPTH // 01';
      modelLabel = 'SUBSTRATE // PRIMORDIAL';
    }

    const isRecursiveActive = p >= 0.72 && p < 0.825;

    this.currentMetrics = {
      currentDepth,
      phase,
      activeCoreId,
      invitationFactor,
      boundaryPenetration,
      internalExpansionFactor,
      selfSimilarityIndex,
      isRecursiveActive,
      depthLabel,
      modelLabel,
    };

    // -------------------------------------------------------------------------
    // 1. RECURSIVE_CORE_01 Animation & Opacity
    // -------------------------------------------------------------------------
    let core01Alpha = 0;
    if (p >= 0.72 && p < 0.78) {
      core01Alpha = (p - 0.72) / 0.06;
    } else if (p >= 0.78 && p < 0.85) {
      // While camera is inside Depth 01, Core 01's shell becomes translucent horizon
      core01Alpha = Math.max(0.15, 1 - (p - 0.78) / 0.07);
    } else if (p >= 0.85) {
      core01Alpha = 0;
    }

    (this.core01OuterShell.material as THREE.MeshBasicMaterial).opacity = core01Alpha * 0.65;
    (this.core01InnerLattice.material as THREE.LineBasicMaterial).opacity = core01Alpha * 0.90;
    (this.core01ConcentricRings.material as THREE.LineBasicMaterial).opacity = core01Alpha * 0.85;
    (this.core01CentripetalFilaments.material as THREE.LineBasicMaterial).opacity =
      invitationFactor * 0.75;

    // Preview group inside Core 01 glows brighter during invitation
    if (this.core01DepthPreviewGroup.children[0] instanceof THREE.Mesh) {
      (this.core01DepthPreviewGroup.children[0].material as THREE.MeshBasicMaterial).opacity =
        (0.2 + invitationFactor * 0.7) * core01Alpha;
    }

    // Gentle mechanical rotations
    this.core01OuterShell.rotation.y = time * 0.25;
    this.core01OuterShell.rotation.x = Math.sin(time * 0.2) * 0.15;
    this.core01InnerLattice.rotation.y = -time * 0.35;
    this.core01ConcentricRings.rotation.z = time * 0.18;
    this.core01DepthPreviewGroup.rotation.x = time * 0.4;
    this.core01DepthPreviewGroup.rotation.y = time * 0.5;

    // -------------------------------------------------------------------------
    // 2. DEPTH 01 Massive Internal World (The Impossible Scale)
    // -------------------------------------------------------------------------
    let depth01Alpha = 0;
    if (p >= 0.76 && p < 0.795) {
      // Rapid expansion on boundary crossing
      depth01Alpha = (p - 0.76) / 0.035;
    } else if (p >= 0.795 && p <= 0.955) {
      depth01Alpha = 0.85;
    } else if (p > 0.955) {
      depth01Alpha = Math.max(0, 1 - (p - 0.955) / 0.02);
    }

    (this.depth01RadialGrid.material as THREE.LineBasicMaterial).opacity = depth01Alpha * 0.55;
    (this.depth01DataPathways.material as THREE.LineBasicMaterial).opacity = depth01Alpha * 0.70;

    this.depth01CalculusRings.children.forEach((child, idx) => {
      if (child instanceof THREE.Mesh) {
        (child.material as THREE.MeshBasicMaterial).opacity = depth01Alpha * 0.85;
        child.rotation.z += delta * (0.3 + (idx % 3) * 0.15);
      }
    });

    this.depth01FloatingFormulas.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        (child.material as THREE.MeshBasicMaterial).opacity = depth01Alpha * 0.90;
      }
    });

    // Scale paradox: expanding internal bounds
    const internalScale = 1.0 + Math.min(1, Math.max(0, (p - 0.78) / 0.06)) * 1.5;
    this.depth01WorldGroup.scale.set(internalScale, internalScale, 1.0);

    // -------------------------------------------------------------------------
    // 3. RECURSIVE_CORE_02 Animation & Opacity (Inside Depth 01)
    // -------------------------------------------------------------------------
    let core02Alpha = 0;
    if (p >= 0.81 && p < 0.85) {
      core02Alpha = (p - 0.81) / 0.04;
    } else if (p >= 0.85 && p < 0.90) {
      core02Alpha = 1.0;
    } else if (p >= 0.90 && p < 0.93) {
      core02Alpha = Math.max(0, 1 - (p - 0.90) / 0.03);
    }

    (this.core02OuterPolyhedron.material as THREE.MeshBasicMaterial).opacity = core02Alpha * 0.75;
    (this.core02StellatedLattice.material as THREE.LineBasicMaterial).opacity = core02Alpha * 0.90;
    (this.core02HarmonicRings.material as THREE.LineBasicMaterial).opacity = core02Alpha * 0.80;

    this.core02OuterPolyhedron.rotation.y = -time * 0.3;
    this.core02StellatedLattice.rotation.x = time * 0.25;
    this.core02HarmonicRings.rotation.z = -time * 0.2;

    // -------------------------------------------------------------------------
    // 4. DEPTH 02 Massive World
    // -------------------------------------------------------------------------
    let depth02Alpha = 0;
    if (p >= 0.85 && p < 0.88) {
      depth02Alpha = (p - 0.85) / 0.03;
    } else if (p >= 0.88 && p < 0.92) {
      depth02Alpha = 1.0;
    } else if (p >= 0.92) {
      depth02Alpha = Math.max(0, 1 - (p - 0.92) / 0.02);
    }

    (this.depth02InvertedLattice.material as THREE.LineBasicMaterial).opacity = depth02Alpha * 0.60;
    (this.depth02WaveGeometry.material as THREE.LineBasicMaterial).opacity = depth02Alpha * 0.75;

    // -------------------------------------------------------------------------
    // 5. RECURSIVE_CORE_03 & DEPTH 03 Primordial World
    // -------------------------------------------------------------------------
    let depth03Alpha = 0;
    if (p >= 0.89 && p < 0.92) {
      depth03Alpha = (p - 0.89) / 0.03;
    } else if (p >= 0.92 && p <= 0.94) {
      depth03Alpha = 1.0;
    } else if (p > 0.94) {
      depth03Alpha = Math.max(0, 1 - (p - 0.94) / 0.02);
    }

    (this.core03MobiusLattice.material as THREE.LineBasicMaterial).opacity = depth03Alpha * 0.85;
    (this.core03SingularityCore.material as THREE.MeshBasicMaterial).opacity = depth03Alpha * 0.95;
    (this.depth03PrimordialGrid.material as THREE.LineBasicMaterial).opacity = depth03Alpha * 0.50;
    (this.depth03DataSingularityLines.material as THREE.LineBasicMaterial).opacity =
      depth03Alpha * 0.75;

    this.core03MobiusLattice.rotation.x = time * 0.35;
    this.core03MobiusLattice.rotation.y = time * 0.45;
    this.core03SingularityCore.rotation.z = -time * 0.5;

    // -------------------------------------------------------------------------
    // 6. Boundary Crossing Particles (Streaking past camera)
    // -------------------------------------------------------------------------
    const isPenetrating =
      (p >= 0.78 && p <= 0.82) || (p >= 0.86 && p <= 0.89) || (p >= 0.90 && p <= 0.93);

    const boundaryMat = this.boundaryParticlesMesh.material as THREE.PointsMaterial;
    if (isPenetrating) {
      boundaryMat.opacity = Math.min(0.9, boundaryPenetration > 0 ? boundaryPenetration : 0.8);

      const posAttr = this.boundaryParticlesGeo.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        // Particles streak forward in Z
        positions[i * 3 + 2] += this.boundaryParticleVel[i * 3 + 2] * delta;
        if (positions[i * 3 + 2] > 600) {
          positions[i * 3 + 2] = -800 - Math.random() * 200;
        }
      }
      posAttr.needsUpdate = true;
    } else {
      boundaryMat.opacity = 0;
    }

    // -------------------------------------------------------------------------
    // 7. Subtle Optical Depth Dilation on Camera (Crossing Boundary Effect)
    // -------------------------------------------------------------------------
    if (camera) {
      if (isPenetrating) {
        const fovBump = Math.sin(boundaryPenetration * Math.PI) * 6.5;
        camera.fov = 54 + fovBump;
        camera.updateProjectionMatrix();
      } else if (camera.fov !== 54) {
        camera.fov = 54;
        camera.updateProjectionMatrix();
      }
    }

    return this.currentMetrics;
  }

  /**
   * Calculates the cinematic camera Z translation for navigating through recursive depths.
   * Smooth, controlled, deterministic, and 100% reversible.
   */
  public getRecursiveCameraZ(baseCameraZ: number, scrollProgress: number): number {
    const p = scrollProgress;
    if (p < 0.72) {
      return baseCameraZ; // Baseline DEEP camera progression
    }

    // Phase 1: Approach RECURSIVE_CORE_01 (z = -320)
    if (p >= 0.72 && p < 0.76) {
      const t = (p - 0.72) / 0.04;
      // Glides from base camera (~150) right to the boundary surface at z = -200
      return THREE.MathUtils.lerp(baseCameraZ, -200, t);
    }

    // Phase 2: Penetrate Boundary 1 and Enter DEPTH 01 World
    if (p >= 0.76 && p < 0.795) {
      const t = (p - 0.76) / 0.035;
      // Crosses through z = -320 into internal space z = -380
      return THREE.MathUtils.lerp(-200, -380, t);
    }

    // Phase 3: DEPTH 01 World expanding, preparing for Equation Nexus
    if (p >= 0.795 && p < 0.825) {
      const t = (p - 0.795) / 0.030;
      return THREE.MathUtils.lerp(-380, -400, t);
    }

    // Phase 4: EQUATION → PHYSICAL REALITY (Monolith situated at z = -600)
    // Camera glides intimately from z = -400 to z = -435 for majestic framing of materialization
    if (p >= 0.825 && p < 0.938) {
      const t = (p - 0.825) / (0.938 - 0.825);
      return THREE.MathUtils.lerp(-400, -435, t);
    }

    // Phase 5A: CONVERGENCE & IMPOSSIBLE STATE (0.938 -> 0.970)
    // Camera approaches monolith aperture at z = -455 to inspect nested non-Euclidean universe
    if (p >= 0.938 && p < 0.970) {
      const t = (p - 0.938) / (0.970 - 0.938);
      return THREE.MathUtils.lerp(-435, -455, t);
    }

    // Phase 5B: SOLUTION RESOLVED & NETWORK GENESIS CONDUIT CORRIDOR (0.970 -> 0.996)
    // Camera glides forward through the branching network conduits
    if (p >= 0.970 && p < 0.996) {
      const t = (p - 0.970) / (0.996 - 0.970);
      return THREE.MathUtils.lerp(-455, -530, t);
    }

    // Phase 5C: Continuous transit bridge into Section 3 Network
    if (p >= 0.996) {
      const t = Math.min(1, (p - 0.996) / 0.004);
      return THREE.MathUtils.lerp(-530, -570, t);
    }

    return -435;
  }

  /**
   * Cleanup Three.js resources
   */
  public dispose() {
    this.managedGeometries.forEach((g) => g.dispose());
    this.managedMaterials.forEach((m) => m.dispose());
    this.managedTextures.forEach((t) => t.dispose());

    if (this.masterGroup.parent) {
      this.masterGroup.parent.remove(this.masterGroup);
    }
  }
}
