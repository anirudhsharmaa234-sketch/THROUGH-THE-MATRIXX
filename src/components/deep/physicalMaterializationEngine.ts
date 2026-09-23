/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import {
  MaterializationStage,
  PhysicalMaterializationMetrics,
} from '../../types/livingCalculationTypes.ts';

interface MathematicalParticle {
  id: number;
  symbol: string;
  sourcePos: THREE.Vector3;
  orbitPos: THREE.Vector3;
  targetVertexIndex: number;
  currentPos: THREE.Vector3;
  driftVelocity: THREE.Vector3;
  phaseOffset: number;
  colorHex: number;
}

/**
 * PHYSICAL MATERIALIZATION ENGINE
 *
 * Implements Step 4 of DEEP: "EQUATION → PHYSICAL REALITY"
 *
 * Core Concept:
 * "The system isn't describing reality. It's generating it."
 * Equations, variables, and data stop behaving like information
 * and begin behaving like the raw material from which the environment
 * is physically constructed.
 *
 * Sequence:
 * EQUATION
 *   ↓
 * SYMBOLS SEPARATE
 *   ↓
 * DATA PARTICLES EMERGE
 *   ↓
 * PARTICLES CONVERGE
 *   ↓
 * WIREFRAME FORMS
 *   ↓
 * SURFACE DEVELOPS
 *   ↓
 * PHYSICAL STRUCTURE STABILIZES
 *   ↓
 * INTERNAL SYSTEM ACTIVATION
 *
 * Fully scroll-controlled, 100% reversible forward & backward.
 */
export class PhysicalMaterializationEngine {
  public masterGroup: THREE.Group;

  // Stage 1: Master Equation Construct
  private equationGroup: THREE.Group;
  private equationBillboards: THREE.Mesh[] = [];
  private symbolSprites: THREE.Mesh[] = [];

  // Stage 2: Particle Field (Deconstructed Equations & Data Fragments)
  private mathematicalParticles: MathematicalParticle[] = [];
  private particlePointsMesh: THREE.Points;
  private particleGeo: THREE.BufferGeometry;
  private particlePositions: Float32Array;
  private particleColors: Float32Array;
  private particleSizes: Float32Array;

  // Stage 3 & 4: Structural Skeleton & Wireframe
  private skeletonGroup: THREE.Group;
  private vertexNodesMesh: THREE.InstancedMesh;
  private skeletonEdgesMesh: THREE.LineSegments;
  private skeletonEdgesGeo: THREE.BufferGeometry;
  private blueprintRingsMesh: THREE.LineSegments;
  private coordinateGuidesMesh: THREE.LineSegments;

  // Stage 5 & 6: Physical Solid Surface & Materialization
  private physicalObjectGroup: THREE.Group;
  private solidFacetMesh: THREE.Mesh;
  private beveledEdgesMesh: THREE.LineSegments;
  private internalCoreMesh: THREE.Mesh;
  private internalLatticeMesh: THREE.LineSegments;
  private internalFluxRings: THREE.LineSegments;
  private surfaceGlyphsMesh: THREE.Mesh;

  // Object Vertices (Mathematical Monolith Polyhedron)
  private monolithVertices: THREE.Vector3[] = [];
  private monolithEdges: [number, number][] = [];

  // Interaction State
  public isHovered = false;
  private hoverProgress = 0; // 0.0 to 1.0 smooth lerp
  public raycastTarget: THREE.Mesh;

  // Managed Three.js Resources for clean disposal
  private managedMaterials: THREE.Material[] = [];
  private managedGeometries: THREE.BufferGeometry[] = [];
  private managedTextures: THREE.Texture[] = [];

  // Active Metrics
  public currentMetrics: PhysicalMaterializationMetrics = {
    stage: 'dormant',
    stageProgress: 0,
    overallProgress: 0,
    symbolSeparation: 0,
    particleConvergence: 0,
    wireframeIntegrity: 0,
    surfaceDensity: 0,
    activationPulse: 0,
    hoverIntensity: 0,
    isMaterializationActive: false,
    stageName: 'STAGE 00 // DORMANT',
    statusLabel: 'WAITING FOR MATHEMATICAL CONVERGENCE',
    equationOrigin: 'ĤΨ = iħ∂Ψ/∂t • ∑λ_k x_k',
  };

  constructor(scene: THREE.Scene) {
    this.masterGroup = new THREE.Group();
    this.masterGroup.name = 'physical-materialization-master-group';
    // Anchored at z = -600, situated inside the deep recursive space
    this.masterGroup.position.set(0, 0, -600);
    scene.add(this.masterGroup);

    // 1. Build the Monolith Vertex & Edge Skeleton Topology
    this.buildMonolithTopology();

    // 2. Build Stage 1: Master Equation Display
    this.equationGroup = new THREE.Group();
    this.masterGroup.add(this.equationGroup);
    this.buildStage1EquationConstruct();

    // 3. Build Stage 2: Equation Data Particles Field
    const { pointsMesh, geo, positions, colors, sizes } = this.buildStage2ParticleField();
    this.particlePointsMesh = pointsMesh;
    this.particleGeo = geo;
    this.particlePositions = positions;
    this.particleColors = colors;
    this.particleSizes = sizes;
    this.masterGroup.add(this.particlePointsMesh);

    // 4. Build Stage 3 & 4: Structural Skeleton & Wireframe
    const {
      skeletonGrp,
      nodesMesh,
      edgesMesh,
      edgesGeo,
      ringsMesh,
      guidesMesh,
    } = this.buildStage3Wireframe();
    this.skeletonGroup = skeletonGrp;
    this.vertexNodesMesh = nodesMesh;
    this.skeletonEdgesMesh = edgesMesh;
    this.skeletonEdgesGeo = edgesGeo;
    this.blueprintRingsMesh = ringsMesh;
    this.coordinateGuidesMesh = guidesMesh;
    this.masterGroup.add(this.skeletonGroup);

    // 5. Build Stage 5 & 6: Physical Surface & Internal Core
    const {
      physicalGrp,
      facetMesh,
      bevelMesh,
      coreMesh,
      latticeMesh,
      fluxRings,
      glyphsMesh,
      raycastMesh,
    } = this.buildStage5PhysicalObject();
    this.physicalObjectGroup = physicalGrp;
    this.solidFacetMesh = facetMesh;
    this.beveledEdgesMesh = bevelMesh;
    this.internalCoreMesh = coreMesh;
    this.internalLatticeMesh = latticeMesh;
    this.internalFluxRings = fluxRings;
    this.surfaceGlyphsMesh = glyphsMesh;
    this.raycastTarget = raycastMesh;
    this.masterGroup.add(this.physicalObjectGroup);
  }

  // =========================================================================
  // TOPOLOGY BUILDER: MATHEMATICAL MONOLITH (Faceted Polyhedral Synthesizer)
  // =========================================================================

  private buildMonolithTopology() {
    this.monolithVertices = [];
    this.monolithEdges = [];

    // Total height: 132u, Width: ~76u, Depth: ~76u
    // Polyhedral Golden-Ratio Geometry with 42 key nodal vertices:
    // 0: Top Apex
    this.monolithVertices.push(new THREE.Vector3(0, 68, 0));

    // 1..6: Upper Tier (6 vertices arranged in regular hexagon at y = 38, radius 32)
    const upperRadius = 32;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      this.monolithVertices.push(
        new THREE.Vector3(Math.cos(a) * upperRadius, 38, Math.sin(a) * upperRadius)
      );
    }

    // 7..12: Equatorial Collar Upper (6 vertices at y = 14, radius 44, rotated 30 deg)
    const eqRadius = 44;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
      this.monolithVertices.push(
        new THREE.Vector3(Math.cos(a) * eqRadius, 14, Math.sin(a) * eqRadius)
      );
    }

    // 13..18: Equatorial Collar Lower (6 vertices at y = -14, radius 44, rotated 30 deg)
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
      this.monolithVertices.push(
        new THREE.Vector3(Math.cos(a) * eqRadius, -14, Math.sin(a) * eqRadius)
      );
    }

    // 19..24: Lower Tier (6 vertices at y = -38, radius 32)
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      this.monolithVertices.push(
        new THREE.Vector3(Math.cos(a) * upperRadius, -38, Math.sin(a) * upperRadius)
      );
    }

    // 25: Bottom Apex
    this.monolithVertices.push(new THREE.Vector3(0, -68, 0));

    // 26..33: Nested Internal Octahedron Core Vertices (Radius 18)
    const coreR = 18;
    this.monolithVertices.push(new THREE.Vector3(0, coreR * 1.3, 0)); // 26: Top core
    this.monolithVertices.push(new THREE.Vector3(coreR, 0, 0));       // 27: +X
    this.monolithVertices.push(new THREE.Vector3(0, 0, coreR));       // 28: +Z
    this.monolithVertices.push(new THREE.Vector3(-coreR, 0, 0));      // 29: -X
    this.monolithVertices.push(new THREE.Vector3(0, 0, -coreR));      // 30: -Z
    this.monolithVertices.push(new THREE.Vector3(0, -coreR * 1.3, 0)); // 31: Bottom core

    // 32..41: Perimeter Coordinate Anchor Nodes
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      this.monolithVertices.push(
        new THREE.Vector3(Math.cos(a) * 52, Math.sin(i * 1.2) * 28, Math.sin(a) * 52)
      );
    }

    // Connect Primary Edges:
    // Top apex (0) to Upper Tier (1..6)
    for (let i = 1; i <= 6; i++) {
      this.monolithEdges.push([0, i]);
    }
    // Upper tier ring
    for (let i = 1; i <= 6; i++) {
      const next = i === 6 ? 1 : i + 1;
      this.monolithEdges.push([i, next]);
    }
    // Upper tier to Equatorial upper (7..12)
    for (let i = 1; i <= 6; i++) {
      const eqIdx = 6 + i;
      const eqNext = 6 + (i === 6 ? 1 : i + 1);
      this.monolithEdges.push([i, eqIdx]);
      this.monolithEdges.push([i, eqNext]);
    }
    // Equatorial collar verticals (7..12 to 13..18)
    for (let i = 0; i < 6; i++) {
      this.monolithEdges.push([7 + i, 13 + i]);
      const next = (i + 1) % 6;
      this.monolithEdges.push([7 + i, 13 + next]);
    }
    // Equatorial lower to Lower tier (19..24)
    for (let i = 1; i <= 6; i++) {
      const eqIdx = 12 + i;
      const lowIdx = 18 + i;
      const lowNext = 18 + (i === 6 ? 1 : i + 1);
      this.monolithEdges.push([eqIdx, lowIdx]);
      this.monolithEdges.push([eqIdx, lowNext]);
    }
    // Lower tier ring
    for (let i = 19; i <= 24; i++) {
      const next = i === 24 ? 19 : i + 1;
      this.monolithEdges.push([i, next]);
    }
    // Lower tier to Bottom Apex (25)
    for (let i = 19; i <= 24; i++) {
      this.monolithEdges.push([i, 25]);
    }
    // Internal Core Octahedron Edges (26..31)
    this.monolithEdges.push([26, 27], [26, 28], [26, 29], [26, 30]);
    this.monolithEdges.push([27, 28], [28, 29], [29, 30], [30, 27]);
    this.monolithEdges.push([31, 27], [31, 28], [31, 29], [31, 30]);
  }

  // =========================================================================
  // STAGE 1: MASTER EQUATION CONSTRUCT
  // =========================================================================

  private buildStage1EquationConstruct() {
    // 1. Primary Equation Billboard Plane
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 1024, 256);
      ctx.font = '700 40px "Share Tech Mono", monospace';
      ctx.fillStyle = '#86efac';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ĤΨ = iħ ∂Ψ/∂t  •  ∇²Φ = 0', 512, 80);

      ctx.font = '600 24px "Share Tech Mono", monospace';
      ctx.fillStyle = '#4ade80';
      ctx.fillText('∑_{k=1}^∞ λ_k x_k  •  ∮_∂Ω ω = ∫_Ω dω', 512, 145);

      ctx.font = '500 16px "Share Tech Mono", monospace';
      ctx.fillStyle = '#22c55e';
      ctx.fillText('[ PRIMORDIAL CALCULUS // TRANSFORMATION PRECURSOR ]', 512, 200);
    }

    const eqTex = new THREE.CanvasTexture(canvas);
    this.managedTextures.push(eqTex);

    const eqMat = new THREE.MeshBasicMaterial({
      map: eqTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.managedMaterials.push(eqMat);

    const eqMesh = new THREE.Mesh(new THREE.PlaneGeometry(160, 40), eqMat);
    eqMesh.position.set(0, 0, 0);
    this.equationGroup.add(eqMesh);
    this.equationBillboards.push(eqMesh);

    // 2. Individual Floating Mathematical Glyphs (Will lift off and disperse into particles)
    const symbols = ['Δ', 'λ', 'Σ', '∇', 'x₁', 'x₂', 'ħ', 'ω', '∂t', 'Ψ', 'Φ', 'ζ'];
    const radius = 55;

    symbols.forEach((sym, idx) => {
      const sCanvas = document.createElement('canvas');
      sCanvas.width = 128;
      sCanvas.height = 128;
      const sCtx = sCanvas.getContext('2d');
      if (sCtx) {
        sCtx.clearRect(0, 0, 128, 128);
        sCtx.font = '700 52px "Share Tech Mono", monospace';
        sCtx.fillStyle = '#ffffff';
        sCtx.textAlign = 'center';
        sCtx.textBaseline = 'middle';
        sCtx.fillText(sym, 64, 64);
      }
      const sTex = new THREE.CanvasTexture(sCanvas);
      this.managedTextures.push(sTex);

      const sMat = new THREE.MeshBasicMaterial({
        map: sTex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      this.managedMaterials.push(sMat);

      const sMesh = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), sMat);
      const angle = (idx / symbols.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * (radius * 0.65);
      const z = (idx % 2 === 0 ? 10 : -10);

      sMesh.position.set(x, y, z);
      sMesh.userData = {
        baseX: x,
        baseY: y,
        baseZ: z,
        symbol: sym,
        angle,
      };

      this.equationGroup.add(sMesh);
      this.symbolSprites.push(sMesh);
    });
  }

  // =========================================================================
  // STAGE 2: MATHEMATICAL DATA PARTICLES FIELD
  // =========================================================================

  private buildStage2ParticleField() {
    const particleCount = 280;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const symbols = ['Δ', 'λ', 'Σ', '∇', 'x₁', 'x₂', 'ħ', 'ω', '∂', 'Ψ', 'Φ', 'ζ', 'k', '0', '1'];

    for (let i = 0; i < particleCount; i++) {
      const sym = symbols[i % symbols.length];
      const targetIdx = i % this.monolithVertices.length;

      // Starting point: distributed along the equation plane at (0, 0, 0)
      const sx = (Math.random() - 0.5) * 140;
      const sy = (Math.random() - 0.5) * 45;
      const sz = (Math.random() - 0.5) * 20;

      // Dispersed orbit point: helical computational vector field
      const theta = (i / particleCount) * Math.PI * 8;
      const r = 70 + Math.random() * 45;
      const ox = Math.cos(theta) * r;
      const oy = ((i / particleCount) - 0.5) * 140;
      const oz = Math.sin(theta) * r;

      const p: MathematicalParticle = {
        id: i,
        symbol: sym,
        sourcePos: new THREE.Vector3(sx, sy, sz),
        orbitPos: new THREE.Vector3(ox, oy, oz),
        targetVertexIndex: targetIdx,
        currentPos: new THREE.Vector3(sx, sy, sz),
        driftVelocity: new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4
        ),
        phaseOffset: Math.random() * Math.PI * 2,
        colorHex: i % 3 === 0 ? 0x86efac : i % 3 === 1 ? 0x4ade80 : 0x22c55e,
      };

      this.mathematicalParticles.push(p);

      positions[i * 3 + 0] = sx;
      positions[i * 3 + 1] = sy;
      positions[i * 3 + 2] = sz;

      const c = new THREE.Color(p.colorHex);
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = 4.5 + Math.random() * 3.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    this.managedGeometries.push(geo);

    // Crisp high-resolution particle texture with soft glowing mathematical core
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, '#86efac');
      grad.addColorStop(0.75, '#22c55e');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 64, 64);
    }
    const pTex = new THREE.CanvasTexture(pCanvas);
    this.managedTextures.push(pTex);

    const mat = new THREE.PointsMaterial({
      size: 5.5,
      vertexColors: true,
      map: pTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.managedMaterials.push(mat);

    const pointsMesh = new THREE.Points(geo, mat);
    return { pointsMesh, geo, positions, colors, sizes };
  }

  // =========================================================================
  // STAGE 3 & 4: STRUCTURAL SKELETON & WIREFRAME BLUEPRINT
  // =========================================================================

  private buildStage3Wireframe() {
    const skeletonGrp = new THREE.Group();

    // 1. Vertex Nodal Anchors (Small diamond points that lock into place)
    const nodeGeo = new THREE.OctahedronGeometry(1.6, 0);
    this.managedGeometries.push(nodeGeo);

    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0x86efac,
      wireframe: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(nodeMat);

    const nodesMesh = new THREE.InstancedMesh(nodeGeo, nodeMat, this.monolithVertices.length);
    const dummy = new THREE.Object3D();
    this.monolithVertices.forEach((v, idx) => {
      dummy.position.copy(v);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      nodesMesh.setMatrixAt(idx, dummy.matrix);
    });
    nodesMesh.instanceMatrix.needsUpdate = true;
    skeletonGrp.add(nodesMesh);

    // 2. Primary Skeleton Edge Lines
    const edgeSegments: number[] = [];
    this.monolithEdges.forEach(([vA, vB]) => {
      const pA = this.monolithVertices[vA];
      const pB = this.monolithVertices[vB];
      edgeSegments.push(pA.x, pA.y, pA.z, pB.x, pB.y, pB.z);
    });

    const edgesGeo = new THREE.BufferGeometry();
    edgesGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgeSegments, 3));
    this.managedGeometries.push(edgesGeo);

    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x4ade80,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(edgesMat);

    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    skeletonGrp.add(edgesMesh);

    // 3. Mathematical Blueprint Rings & Coordinate Guides
    const ringSegments: number[] = [];
    const guideRadii = [34, 46, 34];
    const guideHeights = [38, 0, -38];

    guideRadii.forEach((radius, rIdx) => {
      const y = guideHeights[rIdx];
      const segs = 36;
      for (let i = 0; i < segs; i++) {
        const a1 = (i / segs) * Math.PI * 2;
        const a2 = ((i + 1) / segs) * Math.PI * 2;
        ringSegments.push(
          Math.cos(a1) * radius, y, Math.sin(a1) * radius,
          Math.cos(a2) * radius, y, Math.sin(a2) * radius
        );
      }
    });

    const ringsGeo = new THREE.BufferGeometry();
    ringsGeo.setAttribute('position', new THREE.Float32BufferAttribute(ringSegments, 3));
    this.managedGeometries.push(ringsGeo);

    const ringsMat = new THREE.LineBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(ringsMat);

    const ringsMesh = new THREE.LineSegments(ringsGeo, ringsMat);
    skeletonGrp.add(ringsMesh);

    // 4. Coordinate Guide Axes & Intersections
    const axisSegments: number[] = [
      // Central vertical spine
      0, -80, 0, 0, 80, 0,
      // Lateral ticks
      -55, 0, 0, 55, 0, 0,
      0, 0, -55, 0, 0, 55,
    ];
    const guidesGeo = new THREE.BufferGeometry();
    guidesGeo.setAttribute('position', new THREE.Float32BufferAttribute(axisSegments, 3));
    this.managedGeometries.push(guidesGeo);

    const guidesMat = new THREE.LineBasicMaterial({
      color: 0x15803d,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(guidesMat);

    const guidesMesh = new THREE.LineSegments(guidesGeo, guidesMat);
    skeletonGrp.add(guidesMesh);

    return {
      skeletonGrp,
      nodesMesh,
      edgesMesh,
      edgesGeo,
      ringsMesh,
      guidesMesh,
    };
  }

  // =========================================================================
  // STAGE 5 & 6: PHYSICAL SOLID SURFACE & ACTIVATED SYSTEM
  // =========================================================================

  private buildStage5PhysicalObject() {
    const physicalGrp = new THREE.Group();

    // 1. Precision Solid Faceted Geometry
    const facetPositions: number[] = [];

    // Triangles for Top Apex (0) to Upper Tier (1..6)
    for (let i = 1; i <= 6; i++) {
      const next = i === 6 ? 1 : i + 1;
      const p0 = this.monolithVertices[0];
      const p1 = this.monolithVertices[i];
      const p2 = this.monolithVertices[next];
      facetPositions.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    }

    // Quads (2 triangles) for Upper Tier to Equatorial Upper (7..12)
    for (let i = 1; i <= 6; i++) {
      const u1 = this.monolithVertices[i];
      const u2 = this.monolithVertices[i === 6 ? 1 : i + 1];
      const eq1 = this.monolithVertices[6 + i];
      const eq2 = this.monolithVertices[6 + (i === 6 ? 1 : i + 1)];

      facetPositions.push(u1.x, u1.y, u1.z, eq1.x, eq1.y, eq1.z, eq2.x, eq2.y, eq2.z);
      facetPositions.push(u1.x, u1.y, u1.z, eq2.x, eq2.y, eq2.z, u2.x, u2.y, u2.z);
    }

    // Quads for Equatorial Collar (7..12 to 13..18)
    for (let i = 0; i < 6; i++) {
      const next = (i + 1) % 6;
      const t1 = this.monolithVertices[7 + i];
      const t2 = this.monolithVertices[7 + next];
      const b1 = this.monolithVertices[13 + i];
      const b2 = this.monolithVertices[13 + next];

      facetPositions.push(t1.x, t1.y, t1.z, b1.x, b1.y, b1.z, b2.x, b2.y, b2.z);
      facetPositions.push(t1.x, t1.y, t1.z, b2.x, b2.y, b2.z, t2.x, t2.y, t2.z);
    }

    // Quads for Equatorial Lower to Lower Tier (19..24)
    for (let i = 1; i <= 6; i++) {
      const eq1 = this.monolithVertices[12 + i];
      const eq2 = this.monolithVertices[12 + (i === 6 ? 1 : i + 1)];
      const l1 = this.monolithVertices[18 + i];
      const l2 = this.monolithVertices[18 + (i === 6 ? 1 : i + 1)];

      facetPositions.push(eq1.x, eq1.y, eq1.z, l1.x, l1.y, l1.z, l2.x, l2.y, l2.z);
      facetPositions.push(eq1.x, eq1.y, eq1.z, l2.x, l2.y, l2.z, eq2.x, eq2.y, eq2.z);
    }

    // Triangles for Lower Tier to Bottom Apex (25)
    for (let i = 19; i <= 24; i++) {
      const next = i === 24 ? 19 : i + 1;
      const p0 = this.monolithVertices[25];
      const p1 = this.monolithVertices[next];
      const p2 = this.monolithVertices[i];
      facetPositions.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    }

    const solidGeo = new THREE.BufferGeometry();
    solidGeo.setAttribute('position', new THREE.Float32BufferAttribute(facetPositions, 3));
    solidGeo.computeVertexNormals();
    this.managedGeometries.push(solidGeo);

    // Physical Obsidian-Chitin Material with Subtle Translucent Green Emission & Specular Sheen
    const solidMat = new THREE.MeshStandardMaterial({
      color: 0x050a06,
      roughness: 0.28,
      metalness: 0.72,
      emissive: 0x064e3b,
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: true,
    });
    this.managedMaterials.push(solidMat);

    const facetMesh = new THREE.Mesh(solidGeo, solidMat);
    physicalGrp.add(facetMesh);

    // 2. Beveled Luminous Edges
    const bevelWireGeo = new THREE.WireframeGeometry(solidGeo);
    this.managedGeometries.push(bevelWireGeo);

    const bevelMat = new THREE.LineBasicMaterial({
      color: 0x86efac,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(bevelMat);

    const bevelMesh = new THREE.LineSegments(bevelWireGeo, bevelMat);
    physicalGrp.add(bevelMesh);

    // 3. Internal Energy Core (Radiant Nested Octahedron)
    const coreGeo = new THREE.OctahedronGeometry(15, 1);
    this.managedGeometries.push(coreGeo);

    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(coreMat);

    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    physicalGrp.add(coreMesh);

    // 4. Internal Quantum Lattice Wireframe
    const latticeGeo = new THREE.IcosahedronGeometry(22, 1);
    this.managedGeometries.push(latticeGeo);
    const latticeWire = new THREE.WireframeGeometry(latticeGeo);
    this.managedGeometries.push(latticeWire);

    const latticeMat = new THREE.LineBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(latticeMat);

    const latticeMesh = new THREE.LineSegments(latticeWire, latticeMat);
    physicalGrp.add(latticeMesh);

    // 5. Circulating Internal Flux Rings
    const fluxSegments: number[] = [];
    const fluxRadii = [26, 30, 26];
    fluxRadii.forEach((r, idx) => {
      const segs = 32;
      for (let i = 0; i < segs; i++) {
        const a1 = (i / segs) * Math.PI * 2;
        const a2 = ((i + 1) / segs) * Math.PI * 2;
        if (idx === 0) {
          fluxSegments.push(
            Math.cos(a1) * r, Math.sin(a1) * r, 0,
            Math.cos(a2) * r, Math.sin(a2) * r, 0
          );
        } else if (idx === 1) {
          fluxSegments.push(
            Math.cos(a1) * r, 0, Math.sin(a1) * r,
            Math.cos(a2) * r, 0, Math.sin(a2) * r
          );
        } else {
          fluxSegments.push(
            0, Math.cos(a1) * r, Math.sin(a1) * r,
            0, Math.cos(a2) * r, Math.sin(a2) * r
          );
        }
      }
    });

    const fluxGeo = new THREE.BufferGeometry();
    fluxGeo.setAttribute('position', new THREE.Float32BufferAttribute(fluxSegments, 3));
    this.managedGeometries.push(fluxGeo);

    const fluxMat = new THREE.LineBasicMaterial({
      color: 0x86efac,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.managedMaterials.push(fluxMat);

    const fluxRings = new THREE.LineSegments(fluxGeo, fluxMat);
    physicalGrp.add(fluxRings);

    // 6. Surface Equation Runes (Subtle living equations moving across facets)
    const glyphCanvas = document.createElement('canvas');
    glyphCanvas.width = 512;
    glyphCanvas.height = 512;
    const gCtx = glyphCanvas.getContext('2d');
    if (gCtx) {
      gCtx.clearRect(0, 0, 512, 512);
      gCtx.font = '600 20px "Share Tech Mono", monospace';
      gCtx.fillStyle = '#86efac';
      const lines = [
        '∇²Φ - c⁻² ∂²Φ/∂t² = 0',
        'Ĥ|Ψ⟩ = iħ ∂/∂t|Ψ⟩',
        '∑_{k} λ_k |φ_k⟩⟨φ_k|',
        '∫_Ω dω = ∮_∂Ω ω',
        'ΔS_univ ≥ 0 • det(g_μν)',
        'x₁ = cos(θ) • x₂ = sin(θ)',
        'MATERIAL_STATE // SOLID',
      ];
      lines.forEach((line, i) => {
        gCtx.fillText(line, 20, 45 + i * 65);
      });
    }
    const glyphTex = new THREE.CanvasTexture(glyphCanvas);
    glyphTex.wrapS = THREE.RepeatWrapping;
    glyphTex.wrapT = THREE.RepeatWrapping;
    glyphTex.repeat.set(1, 2);
    this.managedTextures.push(glyphTex);

    const glyphMat = new THREE.MeshBasicMaterial({
      map: glyphTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.managedMaterials.push(glyphMat);

    // Outer skin carrying the equation glyphs
    const glyphGeo = solidGeo.clone();
    this.managedGeometries.push(glyphGeo);
    const glyphsMesh = new THREE.Mesh(glyphGeo, glyphMat);
    glyphsMesh.scale.set(1.008, 1.008, 1.008);
    physicalGrp.add(glyphsMesh);

    // 7. Raycast Interaction Target (Encompasses the monolith for smooth hover)
    const raycastGeo = new THREE.CylinderGeometry(48, 48, 140, 12);
    this.managedGeometries.push(raycastGeo);
    const raycastMat = new THREE.MeshBasicMaterial({
      visible: false,
    });
    this.managedMaterials.push(raycastMat);
    const raycastMesh = new THREE.Mesh(raycastGeo, raycastMat);
    physicalGrp.add(raycastMesh);

    return {
      physicalGrp,
      facetMesh,
      bevelMesh,
      coreMesh,
      latticeMesh,
      fluxRings,
      glyphsMesh,
      raycastMesh,
    };
  }

  // =========================================================================
  // UPDATE LOOP (100% Scroll-Controlled & Fully Reversible)
  // =========================================================================

  /**
   * Updates all physical materialization stages based on scroll progress.
   *
   * Timeline:
   * p < 0.825: Dormant
   * p in [0.825, 0.850]: STAGE 01 // EQUATION (Mathematical Information Stabilized)
   * p in [0.850, 0.875]: STAGE 02 // PARTICLES (Symbols Separate, Data Quanta Emerge)
   * p in [0.875, 0.895]: STAGE 03 // SKELETON (Particles Converge, Wireframe Blueprint Emerges)
   * p in [0.895, 0.915]: STAGE 04 // GEOMETRY (Tessellation & Facets Gain Density)
   * p in [0.915, 0.935]: STAGE 05 // PHYSICAL SURFACE (Solid Material, Obsidian-Chitin, Light Response)
   * p in [0.935, 0.955]: STAGE 06 // ACTIVATED OBJECT (Internal System Online, Visitor Interaction)
   * p > 0.955: Seamlessly transitions toward Network ingress
   */
  public update(
    delta: number,
    time: number,
    scrollProgress: number,
    camera?: THREE.PerspectiveCamera
  ): PhysicalMaterializationMetrics {
    const p = scrollProgress;

    // Smooth hover lerp
    const targetHover = this.isHovered ? 1.0 : 0.0;
    this.hoverProgress += (targetHover - this.hoverProgress) * Math.min(1, delta * 5.0);

    // Determine Stage & Continuous Factors
    let stage: MaterializationStage = 'dormant';
    let stageProgress = 0;
    let overallProgress = 0;
    let symbolSeparation = 0;
    let particleConvergence = 0;
    let wireframeIntegrity = 0;
    let surfaceDensity = 0;
    let activationPulse = 0;
    let stageName = 'STAGE 00 // DORMANT';
    let statusLabel = 'AWAITING MATHEMATICAL CONVERGENCE';

    if (p >= 0.825 && p < 0.850) {
      stage = 'stage1_equation';
      stageProgress = (p - 0.825) / 0.025;
      overallProgress = stageProgress * 0.16;
      stageName = 'STAGE 01 // EQUATION';
      statusLabel = 'MATHEMATICAL INFORMATION COHESION';
    } else if (p >= 0.850 && p < 0.875) {
      stage = 'stage2_particles';
      stageProgress = (p - 0.850) / 0.025;
      overallProgress = 0.16 + stageProgress * 0.18;
      symbolSeparation = stageProgress;
      stageName = 'STAGE 02 // PARTICLES';
      statusLabel = 'SYMBOLS SEPARATE → DATA PARTICLES EMERGE';
    } else if (p >= 0.875 && p < 0.895) {
      stage = 'stage3_skeleton';
      stageProgress = (p - 0.875) / 0.020;
      overallProgress = 0.34 + stageProgress * 0.22;
      symbolSeparation = 1.0;
      particleConvergence = stageProgress;
      wireframeIntegrity = stageProgress;
      stageName = 'STAGE 03 // SKELETON';
      statusLabel = 'PARTICLES CONVERGE → BLUEPRINT FORMS';
    } else if (p >= 0.895 && p < 0.915) {
      stage = 'stage4_geometry';
      stageProgress = (p - 0.895) / 0.020;
      overallProgress = 0.56 + stageProgress * 0.20;
      symbolSeparation = 1.0;
      particleConvergence = 1.0;
      wireframeIntegrity = 1.0;
      surfaceDensity = stageProgress * 0.45;
      stageName = 'STAGE 04 // GEOMETRY';
      statusLabel = 'GEOMETRIC BODY TESSELLATES';
    } else if (p >= 0.915 && p < 0.935) {
      stage = 'stage5_surface';
      stageProgress = (p - 0.915) / 0.020;
      overallProgress = 0.76 + stageProgress * 0.14;
      symbolSeparation = 1.0;
      particleConvergence = 1.0;
      wireframeIntegrity = 1.0;
      surfaceDensity = 0.45 + stageProgress * 0.55;
      stageName = 'STAGE 05 // PHYSICAL SURFACE';
      statusLabel = 'PHYSICAL SURFACE MATERIALIZED';
    } else if (p >= 0.935 && p <= 0.958) {
      stage = 'stage6_activated';
      stageProgress = Math.min(1, (p - 0.935) / 0.023);
      overallProgress = 0.90 + stageProgress * 0.10;
      symbolSeparation = 1.0;
      particleConvergence = 1.0;
      wireframeIntegrity = 1.0;
      surfaceDensity = 1.0;
      activationPulse = 0.85 + Math.sin(time * 3.0) * 0.15;
      stageName = 'STAGE 06 // ACTIVATED OBJECT';
      statusLabel = this.isHovered
        ? 'OBJECT INTERFACE ACTIVE // CORE COHESION: 100%'
        : 'PHYSICAL ARTIFACT STABILIZED';
    } else if (p > 0.958) {
      // Step 5: The Materialized Object becomes the central focal point
      stage = 'stage6_activated';
      stageProgress = 1.0;
      overallProgress = 1.0;
      symbolSeparation = 1.0;
      particleConvergence = 1.0;
      wireframeIntegrity = 1.0;
      surfaceDensity = 1.0;
      activationPulse = 1.0;
      stageName = 'STAGE 06 // ACTIVATED OBJECT';
      statusLabel = 'THE IMPOSSIBLE SOLUTION // CENTRAL NEXUS';
    }

    const isMaterializationActive = p >= 0.825 && p <= 1.000;

    this.currentMetrics = {
      stage,
      stageProgress,
      overallProgress,
      symbolSeparation,
      particleConvergence,
      wireframeIntegrity,
      surfaceDensity,
      activationPulse,
      hoverIntensity: this.hoverProgress,
      isMaterializationActive,
      stageName,
      statusLabel,
      equationOrigin: 'ĤΨ = iħ∂Ψ/∂t • ∑λ_k x_k',
    };

    if (!isMaterializationActive) {
      this.masterGroup.visible = false;
      return this.currentMetrics;
    }
    this.masterGroup.visible = true;

    // Gentle global rotation on the synthesized object
    const rotationRate = 0.18 + this.hoverProgress * 0.25;
    this.physicalObjectGroup.rotation.y = time * rotationRate;
    this.skeletonGroup.rotation.y = time * rotationRate;

    // Subtle hover dilation (micro-aperture response)
    const hoverScale = 1.0 + this.hoverProgress * 0.05 + Math.sin(time * 2.0) * 0.01;
    this.physicalObjectGroup.scale.set(hoverScale, hoverScale, hoverScale);
    this.skeletonGroup.scale.set(hoverScale, hoverScale, hoverScale);

    // -------------------------------------------------------------------------
    // 1. UPDATE STAGE 1: EQUATION VISIBILITY & SYMBOL SEPARATION
    // -------------------------------------------------------------------------
    let eqAlpha = 0;
    if (p >= 0.825 && p < 0.850) {
      eqAlpha = (p - 0.825) / 0.025;
    } else if (p >= 0.850 && p < 0.875) {
      // Equation board dissolves as symbols separate into particles
      eqAlpha = Math.max(0, 1 - (p - 0.850) / 0.018);
    }

    this.equationBillboards.forEach((mesh) => {
      (mesh.material as THREE.MeshBasicMaterial).opacity = eqAlpha * 0.92;
    });

    // Individual symbol sprites separating off the board
    this.symbolSprites.forEach((sprite, idx) => {
      const bX = sprite.userData.baseX as number;
      const bY = sprite.userData.baseY as number;
      const bZ = sprite.userData.baseZ as number;
      const angle = sprite.userData.angle as number;

      if (symbolSeparation > 0) {
        // Symbols lift forward and disperse outwards in 3D
        const liftDist = symbolSeparation * 65;
        const disperseR = 1.0 + symbolSeparation * 1.6;
        sprite.position.x = bX * disperseR;
        sprite.position.y = bY * disperseR + Math.sin(time * 2.0 + idx) * 3;
        sprite.position.z = bZ + Math.cos(angle) * liftDist;

        // Fades as they transition into particles in Stage 2/3
        const symAlpha = Math.max(0, 1 - symbolSeparation * 1.2);
        (sprite.material as THREE.MeshBasicMaterial).opacity = symAlpha;
      } else {
        sprite.position.set(bX, bY, bZ);
        (sprite.material as THREE.MeshBasicMaterial).opacity = eqAlpha * 0.95;
      }
    });

    // -------------------------------------------------------------------------
    // 2. UPDATE STAGE 2: MATHEMATICAL PARTICLES FIELD & CONVERGENCE
    // -------------------------------------------------------------------------
    let particlesAlpha = 0;
    if (p >= 0.845 && p < 0.875) {
      particlesAlpha = (p - 0.845) / 0.025;
    } else if (p >= 0.875 && p < 0.935) {
      particlesAlpha = 1.0;
    } else if (p >= 0.935 && p <= 0.96) {
      // Particles merge into the solid surface, leaving a subtle halo
      particlesAlpha = Math.max(0.15, 1 - (p - 0.935) / 0.02);
    } else if (p > 0.96) {
      particlesAlpha = 0;
    }

    const posAttr = this.particleGeo.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    this.mathematicalParticles.forEach((particle, idx) => {
      let tx: number;
      let ty: number;
      let tz: number;

      if (particleConvergence === 0) {
        // Stage 2: Dispersing from source into orbital helical trajectory
        const dispT = symbolSeparation;
        tx = THREE.MathUtils.lerp(particle.sourcePos.x, particle.orbitPos.x, dispT);
        ty = THREE.MathUtils.lerp(particle.sourcePos.y, particle.orbitPos.y, dispT);
        tz = THREE.MathUtils.lerp(particle.sourcePos.z, particle.orbitPos.z, dispT);

        // Add computational drift
        tx += Math.sin(time * 2.0 + particle.phaseOffset) * 4;
        ty += Math.cos(time * 1.8 + particle.phaseOffset) * 4;
      } else {
        // Stage 3 & 4: Converging from orbit to target vertex position!
        const targetV = this.monolithVertices[particle.targetVertexIndex];
        const convT = Math.min(1, particleConvergence * 1.15);

        // Calculate dynamic rotation of monolith
        const rotatedTarget = targetV.clone();
        rotatedTarget.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.physicalObjectGroup.rotation.y);

        tx = THREE.MathUtils.lerp(particle.orbitPos.x, rotatedTarget.x, convT);
        ty = THREE.MathUtils.lerp(particle.orbitPos.y, rotatedTarget.y, convT);
        tz = THREE.MathUtils.lerp(particle.orbitPos.z, rotatedTarget.z, convT);

        // In Stage 6, circulating halo particles react to visitor hover
        if (this.hoverProgress > 0) {
          const hoverPulse = Math.sin(time * 4.0 + idx * 0.1) * 6 * this.hoverProgress;
          tx += (tx > 0 ? 1 : -1) * hoverPulse;
          tz += (tz > 0 ? 1 : -1) * hoverPulse;
        }
      }

      posArray[idx * 3 + 0] = tx;
      posArray[idx * 3 + 1] = ty;
      posArray[idx * 3 + 2] = tz;
    });
    posAttr.needsUpdate = true;

    (this.particlePointsMesh.material as THREE.PointsMaterial).opacity = particlesAlpha * 0.90;

    // -------------------------------------------------------------------------
    // 3. UPDATE STAGE 3 & 4: SKELETON WIREFRAME & NODAL ANCHORS
    // -------------------------------------------------------------------------
    let wireAlpha = 0;
    if (p >= 0.875 && p < 0.895) {
      wireAlpha = (p - 0.875) / 0.020;
    } else if (p >= 0.895 && p < 0.935) {
      wireAlpha = 1.0;
    } else if (p >= 0.935 && p <= 0.96) {
      // Becomes subtle structural blueprint behind the physical surface
      wireAlpha = Math.max(0.40, 1 - (p - 0.935) / 0.025);
    } else if (p > 0.96) {
      // Step 5: Remains as luminous coordinate blueprint through the Impossible State
      wireAlpha = 0.55;
    }

    // Vertex node anchors
    (this.vertexNodesMesh.material as THREE.MeshBasicMaterial).opacity = wireAlpha * 0.95;

    // Progressive edge line construction: as particles arrive, edges draw inward
    (this.skeletonEdgesMesh.material as THREE.LineBasicMaterial).opacity = wireAlpha * 0.85;

    // Blueprint rings & guides
    (this.blueprintRingsMesh.material as THREE.LineBasicMaterial).opacity = wireAlpha * 0.70;
    (this.coordinateGuidesMesh.material as THREE.LineBasicMaterial).opacity = wireAlpha * 0.50;

    this.blueprintRingsMesh.rotation.y = -time * 0.15;

    // -------------------------------------------------------------------------
    // 4. UPDATE STAGE 5 & 6: PHYSICAL SURFACE, MATERIAL & INTERNAL SYSTEM
    // -------------------------------------------------------------------------
    const solidMat = this.solidFacetMesh.material as THREE.MeshStandardMaterial;
    // In Step 5 (p in 0.954 to 0.980), facets become crystalline translucent (0.65)
    // allowing the visitor to look through the facets into the nested non-Euclidean universe
    let targetFacetOpacity = surfaceDensity * 0.94;
    if (p >= 0.954 && p <= 0.980) {
      targetFacetOpacity = THREE.MathUtils.lerp(0.94, 0.65, (p - 0.954) / 0.015);
    } else if (p > 0.980) {
      targetFacetOpacity = 0.75;
    }
    solidMat.opacity = targetFacetOpacity;
    solidMat.emissiveIntensity = 0.20 + this.hoverProgress * 0.40 + (activationPulse > 0 ? 0.35 : 0);

    // Beveled edges
    (this.beveledEdgesMesh.material as THREE.LineBasicMaterial).opacity =
      surfaceDensity * (0.65 + this.hoverProgress * 0.35);

    // Internal core and flux rings
    const coreMat = this.internalCoreMesh.material as THREE.MeshBasicMaterial;
    coreMat.opacity = (surfaceDensity * 0.75 + activationPulse * 0.25) * (1.0 + this.hoverProgress * 0.6);

    (this.internalLatticeMesh.material as THREE.LineBasicMaterial).opacity =
      surfaceDensity * 0.60 * (1.0 + this.hoverProgress * 0.5);

    (this.internalFluxRings.material as THREE.LineBasicMaterial).opacity =
      surfaceDensity * 0.85 * (1.0 + this.hoverProgress * 0.4);

    this.internalCoreMesh.rotation.y = -time * (0.4 + this.hoverProgress * 0.6);
    this.internalCoreMesh.rotation.x = Math.sin(time * 0.5) * 0.2;
    this.internalFluxRings.rotation.z = time * (0.5 + this.hoverProgress * 0.8);
    this.internalFluxRings.rotation.x = time * 0.3;

    // Surface glyphs (Equations streaming across the physical monolith facets)
    const glyphMat = this.surfaceGlyphsMesh.material as THREE.MeshBasicMaterial;
    glyphMat.opacity = surfaceDensity * 0.80 * (0.8 + this.hoverProgress * 0.4);

    if (glyphMat.map) {
      glyphMat.map.offset.y = -(time * (0.05 + this.hoverProgress * 0.1)) % 1.0;
    }

    return this.currentMetrics;
  }

  /**
   * Environmental Gravity Factor:
   * Returns how strongly nearby DEEP calculations and particles should bend toward (0, 0, -480).
   */
  public getGravitationalCenter(): { position: THREE.Vector3; strength: number } {
    const p = this.currentMetrics;
    const strength = p.surfaceDensity > 0 ? p.surfaceDensity * (0.75 + this.hoverProgress * 0.25) : 0;
    return {
      position: this.masterGroup.position,
      strength,
    };
  }

  /**
   * Raycast detection for visitor interaction on the synthesized object
   */
  public testHover(raycaster: THREE.Raycaster): boolean {
    if (!this.currentMetrics.isMaterializationActive || this.currentMetrics.surfaceDensity < 0.2) {
      this.isHovered = false;
      return false;
    }

    const intersects = raycaster.intersectObject(this.raycastTarget, false);
    this.isHovered = intersects.length > 0;
    return this.isHovered;
  }

  /**
   * Tap / Click Trigger
   */
  public triggerInteractionPulse() {
    if (this.currentMetrics.isMaterializationActive) {
      this.hoverProgress = 1.0;
    }
  }

  /**
   * Dispose all Three.js resources cleanly
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
