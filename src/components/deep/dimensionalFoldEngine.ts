/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { DimensionalFoldMetrics, DimensionalFoldPhase } from '../../types/livingCalculationTypes.ts';

/**
 * DIMENSIONAL FOLD ENGINE
 *
 * Implements DEEP — STEP 2: DIMENSIONAL FOLD.
 *
 * Transforms the existing 3D mathematical environment into an active, folding non-Euclidean manifold:
 * 1. Alignment & Pre-Fold Convergence (0.60 -> 0.66)
 *    - Scattered mathematical data points & pathways align into coherent parallel coordinate planes.
 * 2. 3D -> 2D Spatial Compression (0.66 -> 0.72)
 *    - Depths collapse onto an expansive computational mathematical sheet.
 * 3. The Dimensional Fold (0.72 -> 0.80)
 *    - The mathematical manifold bends and folds through 3D space along a non-Euclidean geodesic crease.
 *    - "DISTANCE IS BEING REDEFINED": previously distant points (e.g. separated by 580 units) become
 *      physically adjacent (<45 units apart) across the folded crease, connected by high-energy laser bridges.
 * 4. Reconstruction & The Impossible Geometry (0.80 -> 0.86)
 *    - Reconstructs the mathematical elements into a permanent NEW spatial relationship.
 *    - Reveals the Impossible Geometry: a 4D-projected non-Euclidean topological conduit linking previously separated regions.
 * 5. Stabilized Reconfigured Space (0.86 -> 0.90)
 *
 * Completely scroll-controlled & 100% reversible forward and backward.
 */
export class DimensionalFoldEngine {
  private scene: THREE.Scene;
  private masterGroup: THREE.Group;

  // The Deformable Mathematical Manifold Sheet
  private manifoldMesh: THREE.Mesh;
  private manifoldWireframe: THREE.LineSegments;
  private manifoldGeo: THREE.PlaneGeometry;
  private baseVertices: Float32Array;

  // Coordinate Grid Markers on the Manifold
  private coordinateLinesGroup: THREE.Group;

  // Dynamic Laser Metric Bridges (Distance Redefinition)
  private metricBridgeLines: THREE.LineSegments;
  private metricBridgeGeo: THREE.BufferGeometry;
  private metricBridgePulsePoints: THREE.Points;
  private metricBridgePulseGeo: THREE.BufferGeometry;

  // The Impossible Geometry (4D-Projected Non-Euclidean Conduit)
  private impossibleGeometryGroup: THREE.Group;
  private impossibleKnotMesh: THREE.Mesh;
  private impossibleRingMesh: THREE.Mesh;
  private impossibleFluxTubes: THREE.LineSegments;
  private impossibleCoreMesh: THREE.Mesh;
  private impossibleBadgeSprite: THREE.Sprite;

  // Particle Flow Across the Geodesic Fold
  private foldStreamParticles: THREE.Points;
  private foldStreamGeo: THREE.BufferGeometry;
  private foldStreamPositions: Float32Array;
  private foldStreamU: Float32Array; // parameter along curve [-1, 1]
  private foldStreamV: Float32Array; // parameter along Y [-1, 1]
  private foldStreamSpeed: Float32Array;

  // Current Metrics State
  private metrics: DimensionalFoldMetrics = {
    phase: 'idle',
    alignmentFactor: 0,
    compressionFactor: 0,
    foldFactor: 0,
    reconstructionFactor: 0,
    metricDistance: 560,
    isFoldActive: false,
  };

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.masterGroup = new THREE.Group();
    this.masterGroup.name = 'DIMENSIONAL_FOLD_SYSTEM';
    this.scene.add(this.masterGroup);

    // -------------------------------------------------------------------------
    // 1. Deformable Mathematical Manifold Sheet (64 x 44 segments = 2816 vertices)
    // -------------------------------------------------------------------------
    const gridCols = 64;
    const gridRows = 44;
    this.manifoldGeo = new THREE.PlaneGeometry(1600, 1100, gridCols, gridRows);
    
    // Store pristine planar coordinates
    const posAttr = this.manifoldGeo.attributes.position;
    this.baseVertices = new Float32Array(posAttr.array);

    // Manifold surface material: translucent deep computational emerald/cyan
    const manifoldMat = new THREE.MeshBasicMaterial({
      color: 0x052e16,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.manifoldMesh = new THREE.Mesh(this.manifoldGeo, manifoldMat);
    this.manifoldMesh.position.set(0, 0, -340);
    this.masterGroup.add(this.manifoldMesh);

    // Manifold wireframe: vibrant matrix green coordinates
    const wireframeGeo = new THREE.WireframeGeometry(this.manifoldGeo);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.manifoldWireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
    this.manifoldWireframe.position.set(0, 0, -340);
    this.masterGroup.add(this.manifoldWireframe);

    // Coordinate lines group for iso-contours & metric axes
    this.coordinateLinesGroup = new THREE.Group();
    this.masterGroup.add(this.coordinateLinesGroup);

    // -------------------------------------------------------------------------
    // 2. Dynamic Laser Metric Bridges (Visual Proof that Distance is Redefined)
    // -------------------------------------------------------------------------
    const bridgeLineCount = 18; // 6 line segments per pair (3 pairs of paired structures)
    const bridgePositions = new Float32Array(bridgeLineCount * 2 * 3);
    this.metricBridgeGeo = new THREE.BufferGeometry();
    this.metricBridgeGeo.setAttribute('position', new THREE.BufferAttribute(bridgePositions, 3));

    const bridgeMat = new THREE.LineBasicMaterial({
      color: 0x86efac,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      linewidth: 2,
    });
    this.metricBridgeLines = new THREE.LineSegments(this.metricBridgeGeo, bridgeMat);
    this.masterGroup.add(this.metricBridgeLines);

    // Pulsing energy beads traveling along the bridges
    const pulsePointCount = 24;
    const pulsePositions = new Float32Array(pulsePointCount * 3);
    this.metricBridgePulseGeo = new THREE.BufferGeometry();
    this.metricBridgePulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));

    const pulseCanvas = document.createElement('canvas');
    pulseCanvas.width = 32;
    pulseCanvas.height = 32;
    const pctx = pulseCanvas.getContext('2d');
    if (pctx) {
      const grad = pctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(134, 239, 172, 0.9)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      pctx.fillStyle = grad;
      pctx.fillRect(0, 0, 32, 32);
    }
    const pulseTexture = new THREE.CanvasTexture(pulseCanvas);

    const pulseMat = new THREE.PointsMaterial({
      size: 10,
      map: pulseTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffffff,
    });
    this.metricBridgePulsePoints = new THREE.Points(this.metricBridgePulseGeo, pulseMat);
    this.masterGroup.add(this.metricBridgePulsePoints);

    // -------------------------------------------------------------------------
    // 3. Flowing Geodesic Particles (Particles traversing the folded curvature)
    // -------------------------------------------------------------------------
    const streamCount = 260;
    this.foldStreamPositions = new Float32Array(streamCount * 3);
    this.foldStreamU = new Float32Array(streamCount);
    this.foldStreamV = new Float32Array(streamCount);
    this.foldStreamSpeed = new Float32Array(streamCount);

    for (let i = 0; i < streamCount; i++) {
      this.foldStreamU[i] = (Math.random() - 0.5) * 2; // -1 to 1
      this.foldStreamV[i] = (Math.random() - 0.5) * 2; // -1 to 1
      this.foldStreamSpeed[i] = Math.random() * 0.4 + 0.3;
    }

    this.foldStreamGeo = new THREE.BufferGeometry();
    this.foldStreamGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(this.foldStreamPositions, 3)
    );

    const streamMat = new THREE.PointsMaterial({
      size: 7,
      map: pulseTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0x4ade80,
    });
    this.foldStreamParticles = new THREE.Points(this.foldStreamGeo, streamMat);
    this.masterGroup.add(this.foldStreamParticles);

    // -------------------------------------------------------------------------
    // 4. The Impossible Geometry (Non-Euclidean Hyper-Dimensional Conduit)
    // -------------------------------------------------------------------------
    this.impossibleGeometryGroup = new THREE.Group();
    this.impossibleGeometryGroup.name = 'IMPOSSIBLE_GEOMETRY';
    this.impossibleGeometryGroup.position.set(0, 0, -340);
    this.masterGroup.add(this.impossibleGeometryGroup);

    // Outer Torus Knot (Parametric 4D projection)
    const knotGeo = new THREE.TorusKnotGeometry(68, 14, 120, 16, 2, 5);
    const knotMat = new THREE.MeshBasicMaterial({
      color: 0x4ade80,
      wireframe: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.impossibleKnotMesh = new THREE.Mesh(knotGeo, knotMat);
    this.impossibleGeometryGroup.add(this.impossibleKnotMesh);

    // Inner Counter-Rotating Geodesic Ring
    const ringGeo = new THREE.TorusGeometry(40, 2.5, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x86efac,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.impossibleRingMesh = new THREE.Mesh(ringGeo, ringMat);
    this.impossibleRingMesh.rotation.x = Math.PI / 2;
    this.impossibleGeometryGroup.add(this.impossibleRingMesh);

    // Quantum Core Sphere
    const coreGeo = new THREE.IcosahedronGeometry(18, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.impossibleCoreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.impossibleGeometryGroup.add(this.impossibleCoreMesh);

    // Hyper-flux tentacles reaching out to both folded wings
    const fluxPositions = new Float32Array(24 * 2 * 3);
    const fluxGeo = new THREE.BufferGeometry();
    fluxGeo.setAttribute('position', new THREE.BufferAttribute(fluxPositions, 3));
    const fluxMat = new THREE.LineBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.impossibleFluxTubes = new THREE.LineSegments(fluxGeo, fluxMat);
    this.impossibleGeometryGroup.add(this.impossibleFluxTubes);

    // Floating subtle technical label sprite
    const badgeCanvas = document.createElement('canvas');
    badgeCanvas.width = 512;
    badgeCanvas.height = 128;
    const bctx = badgeCanvas.getContext('2d');
    if (bctx) {
      bctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      bctx.strokeStyle = 'rgba(74, 222, 128, 0.8)';
      bctx.lineWidth = 1.5;
      bctx.strokeRect(10, 10, 492, 108);

      bctx.font = '600 24px "Share Tech Mono", monospace';
      bctx.fillStyle = '#86efac';
      bctx.textAlign = 'center';
      bctx.fillText('DIMENSIONAL STATE // RECONFIGURED', 256, 48);

      bctx.font = '400 18px "Share Tech Mono", monospace';
      bctx.fillStyle = 'rgba(187, 247, 208, 0.85)';
      bctx.fillText('NON-EUCLIDEAN CONDUIT LINK ACTIVE', 256, 82);
    }
    const badgeTex = new THREE.CanvasTexture(badgeCanvas);
    const badgeSpriteMat = new THREE.SpriteMaterial({
      map: badgeTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.impossibleBadgeSprite = new THREE.Sprite(badgeSpriteMat);
    this.impossibleBadgeSprite.scale.set(160, 40, 1);
    this.impossibleBadgeSprite.position.set(0, -95, 0);
    this.impossibleGeometryGroup.add(this.impossibleBadgeSprite);
  }

  /**
   * Main per-frame update driven strictly by scrollProgress (0.0 to 1.0) and time
   */
  public update(
    delta: number,
    time: number,
    scrollProgress: number,
    camera?: THREE.PerspectiveCamera
  ): DimensionalFoldMetrics {
    const p = scrollProgress;

    // -------------------------------------------------------------------------
    // COMPUTE CONTINUOUS SCROLL PHASES (Reversible forward & backward)
    // -------------------------------------------------------------------------
    let phase: DimensionalFoldPhase = 'idle';
    let alignmentFactor = 0;
    let compressionFactor = 0;
    let foldFactor = 0;
    let reconstructionFactor = 0;

    if (p < 0.58) {
      phase = 'idle';
    } else if (p >= 0.58 && p < 0.63) {
      phase = 'aligning';
      alignmentFactor = (p - 0.58) / 0.05;
    } else if (p >= 0.63 && p < 0.68) {
      phase = 'compressing';
      alignmentFactor = 1.0;
      compressionFactor = (p - 0.63) / 0.05;
    } else if (p >= 0.68 && p < 0.72) {
      phase = 'folding';
      alignmentFactor = 1.0;
      compressionFactor = 1.0;
      foldFactor = (p - 0.68) / 0.04;
    } else if (p >= 0.72 && p < 0.745) {
      phase = 'reconstructing';
      alignmentFactor = 1.0;
      compressionFactor = 1.0;
      foldFactor = 1.0 - ((p - 0.72) / 0.025) * 0.25;
      reconstructionFactor = (p - 0.72) / 0.025;
    } else if (p >= 0.745 && p <= 0.88) {
      phase = 'stabilized';
      alignmentFactor = 1.0;
      compressionFactor = 1.0;
      foldFactor = 0.75;
      reconstructionFactor = 1.0;
    } else {
      phase = 'idle';
    }

    // Fold HUD is active during the primary transformation; hands off to Recursive Deep HUD at 0.74
    const isFoldActive = p >= 0.58 && p < 0.745;
    const foldEnvelope = p >= 0.58 && p <= 0.88
      ? p < 0.62
        ? (p - 0.58) / 0.04
        : p > 0.84
        ? Math.max(0, 1 - (p - 0.84) / 0.04)
        : 1.0
      : 0;

    // Metric distance calculation (starts ~560 units apart, collapses down to 42 units)
    const metricDistance = Math.round(560 - foldFactor * 518);

    this.metrics = {
      phase,
      alignmentFactor,
      compressionFactor,
      foldFactor,
      reconstructionFactor,
      metricDistance,
      isFoldActive,
    };

    // -------------------------------------------------------------------------
    // CAMERA PERSPECTIVE COMPRESSION & SUBTLE ORBIT
    // -------------------------------------------------------------------------
    if (camera) {
      // Subtle focal length compression (54deg -> 46deg during peak fold)
      const baseFov = 54;
      const targetFov = baseFov - (compressionFactor * 4 + foldFactor * 4);
      if (Math.abs(camera.fov - targetFov) > 0.01) {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
      }

      // Controlled subtle tilt revealing the 3D curvature of the fold
      const foldPitch = Math.sin(foldFactor * Math.PI) * 0.06;
      const foldYaw = Math.sin(foldFactor * Math.PI) * 0.07;
      camera.rotation.x += (foldPitch - camera.rotation.x) * 0.1;
      camera.rotation.y += (foldYaw - camera.rotation.y) * 0.1;
    }

    // -------------------------------------------------------------------------
    // 1. DEFORM MATHEMATICAL MANIFOLD SHEET
    // -------------------------------------------------------------------------
    const manifoldOpacity = foldEnvelope * (compressionFactor * 0.45 + foldFactor * 0.45);
    (this.manifoldMesh.material as THREE.MeshBasicMaterial).opacity = manifoldOpacity * 0.35;
    (this.manifoldWireframe.material as THREE.LineBasicMaterial).opacity = manifoldOpacity * 0.85;

    if (manifoldOpacity > 0.01) {
      const posAttr = this.manifoldGeo.attributes.position;
      const posArray = posAttr.array as Float32Array;
      const vertexCount = posAttr.count;

      for (let i = 0; i < vertexCount; i++) {
        const i3 = i * 3;
        const x0 = this.baseVertices[i3 + 0];
        const y0 = this.baseVertices[i3 + 1];

        // Normalized distance from fold spine: u in [-1, 1]
        const u = Math.max(-1, Math.min(1, x0 / 750));
        const absU = Math.abs(u);

        // Curvature along the fold: wings curl inward in Z
        const zCurl = -(1 - Math.cos(absU * Math.PI * 0.5)) * 420 * Math.sin(foldFactor * Math.PI * 0.5);
        
        // Compression along X as wings fold inward
        const xWarp = x0 * (1 - foldFactor * 0.68 * (1 - Math.cos(absU * Math.PI * 0.5)));

        // Hyper-dimensional ripple & curvature
        const yRipple = y0 + Math.sin(x0 * 0.012 + time * 2) * 16 * foldFactor;
        const zHyper = zCurl + Math.cos(y0 * 0.015) * 32 * foldFactor;

        // Apply deformation
        posArray[i3 + 0] = xWarp;
        posArray[i3 + 1] = yRipple;
        posArray[i3 + 2] = zHyper;
      }
      posAttr.needsUpdate = true;
      this.manifoldGeo.computeVertexNormals();

      // Update wireframe copy
      this.manifoldWireframe.geometry.dispose();
      this.manifoldWireframe.geometry = new THREE.WireframeGeometry(this.manifoldGeo);
    }

    // -------------------------------------------------------------------------
    // 2. DYNAMIC LASER METRIC BRIDGES (Visual Proof of Redefined Distance)
    // -------------------------------------------------------------------------
    const bridgeOpacity = foldEnvelope * Math.max(0, (foldFactor - 0.15) / 0.85);
    (this.metricBridgeLines.material as THREE.LineBasicMaterial).opacity = bridgeOpacity * 0.9;
    (this.metricBridgePulsePoints.material as THREE.PointsMaterial).opacity = bridgeOpacity * 1.0;

    if (bridgeOpacity > 0.01) {
      const linePosAttr = this.metricBridgeGeo.attributes.position;
      const lineArray = linePosAttr.array as Float32Array;

      const pulsePosAttr = this.metricBridgePulseGeo.attributes.position;
      const pulseArray = pulsePosAttr.array as Float32Array;

      // 3 Paired Anchors across the fold:
      // Pair 1: Sigma construct (left) <-> Nabla construct (right)
      // Pair 2: Formula Card 0 (left) <-> Formula Card 1 (right)
      // Pair 3: Formula Card 4 (left) <-> Formula Card 5 (right)
      const pairs = [
        {
          left: this.transformPosition(new THREE.Vector3(-270, 70, -80), p, time),
          right: this.transformPosition(new THREE.Vector3(280, -60, -180), p, time),
        },
        {
          left: this.transformPosition(new THREE.Vector3(-320, 140, -100), p, time),
          right: this.transformPosition(new THREE.Vector3(310, 120, -220), p, time),
        },
        {
          left: this.transformPosition(new THREE.Vector3(-280, 160, -580), p, time),
          right: this.transformPosition(new THREE.Vector3(290, 170, -700), p, time),
        },
      ];

      let linePtr = 0;
      let pulsePtr = 0;

      pairs.forEach((pair, pairIdx) => {
        // Draw 6 braided laser lines between the paired structures
        for (let l = 0; l < 6; l++) {
          const jitterX = Math.sin(time * 6 + l + pairIdx) * (4 * (1 - foldFactor * 0.5));
          const jitterY = Math.cos(time * 6 + l + pairIdx) * (4 * (1 - foldFactor * 0.5));

          lineArray[linePtr++] = pair.left.x + jitterX;
          lineArray[linePtr++] = pair.left.y + jitterY;
          lineArray[linePtr++] = pair.left.z;

          lineArray[linePtr++] = pair.right.x - jitterX;
          lineArray[linePtr++] = pair.right.y - jitterY;
          lineArray[linePtr++] = pair.right.z;
        }

        // Draw 8 traveling energy beads per pair
        for (let pt = 0; pt < 8; pt++) {
          const tPos = ((time * 1.8 + pt * 0.125) % 1.0);
          pulseArray[pulsePtr++] = pair.left.x + (pair.right.x - pair.left.x) * tPos;
          pulseArray[pulsePtr++] = pair.left.y + (pair.right.y - pair.left.y) * tPos;
          pulseArray[pulsePtr++] = pair.left.z + (pair.right.z - pair.left.z) * tPos;
        }
      });

      linePosAttr.needsUpdate = true;
      pulsePosAttr.needsUpdate = true;
    }

    // -------------------------------------------------------------------------
    // 3. FLOWING GEODESIC PARTICLES ALONG THE FOLD
    // -------------------------------------------------------------------------
    (this.foldStreamParticles.material as THREE.PointsMaterial).opacity =
      foldEnvelope * (compressionFactor * 0.4 + foldFactor * 0.6);

    if (foldEnvelope > 0.05) {
      const posAttr = this.foldStreamGeo.attributes.position;
      const posArray = posAttr.array as Float32Array;
      const count = this.foldStreamU.length;

      for (let i = 0; i < count; i++) {
        // Advance particle along curve
        this.foldStreamU[i] += delta * this.foldStreamSpeed[i] * (0.6 + foldFactor * 1.2);
        if (this.foldStreamU[i] > 1.0) this.foldStreamU[i] = -1.0;

        const u = this.foldStreamU[i];
        const v = this.foldStreamV[i];

        const x0 = u * 650;
        const y0 = v * 400;

        const pos = this.transformPosition(new THREE.Vector3(x0, y0, -340), p, time);
        posArray[i * 3 + 0] = pos.x;
        posArray[i * 3 + 1] = pos.y;
        posArray[i * 3 + 2] = pos.z;
      }
      posAttr.needsUpdate = true;
    }

    // -------------------------------------------------------------------------
    // 4. THE IMPOSSIBLE GEOMETRY (Climax of Fold & Reconstruction)
    // -------------------------------------------------------------------------
    const impossibleAlpha = foldEnvelope * reconstructionFactor;
    (this.impossibleKnotMesh.material as THREE.MeshBasicMaterial).opacity = impossibleAlpha * 0.85;
    (this.impossibleRingMesh.material as THREE.MeshBasicMaterial).opacity = impossibleAlpha * 0.95;
    (this.impossibleCoreMesh.material as THREE.MeshBasicMaterial).opacity = impossibleAlpha * 0.90;
    (this.impossibleFluxTubes.material as THREE.LineBasicMaterial).opacity = impossibleAlpha * 0.75;
    (this.impossibleBadgeSprite.material as THREE.SpriteMaterial).opacity = impossibleAlpha * 0.95;

    if (impossibleAlpha > 0.01) {
      // Rotation & pulsation of the impossible conduit
      this.impossibleKnotMesh.rotation.y += delta * 0.6;
      this.impossibleKnotMesh.rotation.x += delta * 0.35;

      this.impossibleRingMesh.rotation.z += delta * 1.2;
      this.impossibleRingMesh.rotation.y = Math.sin(time * 2) * 0.2;

      this.impossibleCoreMesh.rotation.y -= delta * 0.8;
      const pulse = 1.0 + Math.sin(time * 4) * 0.15;
      this.impossibleCoreMesh.scale.set(pulse, pulse, pulse);

      // Scale smoothly with reconstruction progress
      const targetScale = 0.4 + reconstructionFactor * 0.75;
      this.impossibleGeometryGroup.scale.set(targetScale, targetScale, targetScale);

      // Update flux lines reaching out to both wings of the fold
      const fluxPosAttr = this.impossibleFluxTubes.geometry.attributes
        .position as THREE.BufferAttribute;
      const fluxArray = fluxPosAttr.array as Float32Array;
      let fPtr = 0;

      for (let k = 0; k < 24; k++) {
        const angle = (k / 24) * Math.PI * 2 + time * 0.5;
        const side = k % 2 === 0 ? -1 : 1;
        const reach = 120 + Math.sin(time * 3 + k) * 30;

        // Inner knot surface anchor
        fluxArray[fPtr++] = Math.cos(angle) * 35;
        fluxArray[fPtr++] = Math.sin(angle) * 35;
        fluxArray[fPtr++] = Math.sin(angle * 2) * 15;

        // Outer wing anchor
        fluxArray[fPtr++] = side * reach;
        fluxArray[fPtr++] = Math.sin(angle) * 80;
        fluxArray[fPtr++] = -side * 40 + Math.cos(angle) * 30;
      }
      fluxPosAttr.needsUpdate = true;
    } else {
      this.impossibleGeometryGroup.scale.set(0.001, 0.001, 0.001);
    }

    return this.metrics;
  }

  /**
   * Deterministic Spatial Transformation Function
   * Maps ANY 3D point (orig) to its transformed position under alignment, compression, fold, and reconstruction.
   * Completely continuous and 100% reversible with scroll.
   */
  public transformPosition(orig: THREE.Vector3, p: number, time: number): THREE.Vector3 {
    if (p < 0.60) {
      return orig.clone();
    }

    const res = orig.clone();

    // Phase 1: Alignment (0.60 -> 0.66)
    // Mathematical elements align toward parallel coordinate planes
    if (p >= 0.60) {
      const alignProgress = Math.min(1, (p - 0.60) / 0.06);
      const targetY = Math.round(orig.y / 70) * 70;
      res.y += (targetY - res.y) * alignProgress * 0.45;
    }

    // Phase 2: Planar Compression (0.66 -> 0.72)
    // Z-coordinates collapse onto the reference 2D mathematical sheet (Z = -340)
    const sheetZ = -340;
    if (p >= 0.66) {
      const compressProgress = Math.min(1, (p - 0.66) / 0.06);
      res.z += (sheetZ - res.z) * compressProgress;
    }

    // Phase 3: The Dimensional Fold (0.72 -> 0.80)
    // The mathematical plane folds through 3D space: Distance is Redefined!
    if (p >= 0.72) {
      const foldProgress = Math.min(1, (p - 0.72) / 0.08);

      const u = Math.max(-1, Math.min(1, orig.x / 680));
      const absU = Math.abs(u);

      // Curvature: wings curl toward each other along Z
      const zFold = -(1 - Math.cos(absU * Math.PI * 0.5)) * 420 * Math.sin(foldProgress * Math.PI * 0.5);
      
      // Horizontal curl inward: distance between left and right collapses!
      const xFold = orig.x * (1 - foldProgress * 0.72 * (1 - Math.cos(absU * Math.PI * 0.5)));

      // Hyper-dimensional ripple & metric bending
      const yFold = res.y + Math.sin(orig.x * 0.012 + time * 1.5) * 16 * foldProgress;

      res.x = xFold;
      res.y = yFold;
      res.z = sheetZ + zFold + Math.cos(orig.y * 0.015) * 30 * foldProgress;
    }

    // Phase 4: Reconstruction (0.80 -> 0.86)
    // Rebuilds into the NEW permanent spatial relationship
    if (p >= 0.80) {
      const reconProgress = Math.min(1, (p - 0.80) / 0.06);

      // Previously separated elements now occupy clustered adjacent topology around the impossible geometry
      const signX = Math.sign(orig.x) || 1;
      const newClusteredX = signX * (55 + Math.abs(orig.x) * 0.22);
      const newClusteredZ = -350 + signX * 25 + Math.cos(orig.y * 0.02) * 20;

      res.x += (newClusteredX - res.x) * reconProgress;
      res.z += (newClusteredZ - res.z) * reconProgress;
    }

    return res;
  }

  /**
   * Surface Normal Rotation Calculation
   * Computes the Euler tilt of any object attached to the folding manifold.
   */
  public getFoldRotation(orig: THREE.Vector3, p: number): THREE.Euler {
    if (p < 0.72) {
      return new THREE.Euler(0, 0, 0);
    }
    const foldProgress = Math.min(1, (p - 0.72) / 0.08);
    const u = Math.max(-1, Math.min(1, orig.x / 680));
    
    // Rotation around Y axis matches the curl angle of the folding wing
    const rotY = -u * foldProgress * 1.1;
    // Subtle tilt around Z
    const rotZ = Math.sin(u * Math.PI) * foldProgress * 0.15;

    return new THREE.Euler(0, rotY, rotZ);
  }

  /**
   * Cleanup Three.js resources
   */
  public dispose() {
    this.manifoldGeo.dispose();
    (this.manifoldMesh.material as THREE.Material).dispose();
    this.manifoldWireframe.geometry.dispose();
    (this.manifoldWireframe.material as THREE.Material).dispose();

    this.metricBridgeGeo.dispose();
    (this.metricBridgeLines.material as THREE.Material).dispose();
    this.metricBridgePulseGeo.dispose();
    (this.metricBridgePulsePoints.material as THREE.Material).dispose();

    this.foldStreamGeo.dispose();
    (this.foldStreamParticles.material as THREE.Material).dispose();

    this.impossibleKnotMesh.geometry.dispose();
    (this.impossibleKnotMesh.material as THREE.Material).dispose();
    this.impossibleRingMesh.geometry.dispose();
    (this.impossibleRingMesh.material as THREE.Material).dispose();
    this.impossibleCoreMesh.geometry.dispose();
    (this.impossibleCoreMesh.material as THREE.Material).dispose();
    this.impossibleFluxTubes.geometry.dispose();
    (this.impossibleFluxTubes.material as THREE.Material).dispose();

    this.impossibleBadgeSprite.material.map?.dispose();
    this.impossibleBadgeSprite.material.dispose();

    this.scene.remove(this.masterGroup);
  }
}
