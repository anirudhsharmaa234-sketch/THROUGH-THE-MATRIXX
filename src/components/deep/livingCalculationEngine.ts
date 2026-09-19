/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import {
  CalculationConstructConfig,
  CalculationConstructRuntime,
  DataParticle,
  CalculationConstructId,
} from '../../types/livingCalculationTypes.ts';

// 8 Master Calculation Constructs representing living mathematics controlling the environment
export const CALCULATION_CONSTRUCT_CONFIGS: CalculationConstructConfig[] = [
  {
    id: 'sigma-convergence',
    symbol: 'Σ',
    equation: '∑_{k=1}^∞ k⁻ˢ = ζ(s)',
    subEquation: 'DATA CONVERGENCE // DISCRETE ACCUMULATION',
    category: 'SERIES CONVERGENCE',
    role: 'PULLS SCATTERED DATA INTO STABLE LATTICE',
    depthTier: 'foreground',
    anchorPosition: new THREE.Vector3(-270, 70, -80),
    colorHex: 0x4ade80,
    highlightColorHex: 0xf0fdf4,
    dataPointCount: 28,
    variableTokens: ['x₁', 'x₂', 'xₖ', 'k=1', '∑', '0.5772', '1.6449', '2.7182', 's=2', 'ζ(s)'],
  },
  {
    id: 'nabla-gradient',
    symbol: '∇',
    equation: '∇²Φ = 0  •  ∇×A = B',
    subEquation: 'DIRECTIONAL FIELD // POTENTIAL DIVERGENCE',
    category: 'GRADIENT OPERATOR',
    role: 'ALIGNS LOCAL PARTICLES ALONG VECTOR FIELD',
    depthTier: 'midground',
    anchorPosition: new THREE.Vector3(280, -60, -180),
    colorHex: 0x22c55e,
    highlightColorHex: 0x86efac,
    dataPointCount: 26,
    variableTokens: ['∇', '∂Φ/∂x', '∂Φ/∂y', 'dx/dt', '∇·v', 'curl(F)', 'tangent', '∇f(x)'],
  },
  {
    id: 'lambda-spectral',
    symbol: 'λ',
    equation: 'λ f(x) = Ĥ f(x)  •  λν = c',
    subEquation: 'SPECTRAL WAVELENGTH // HARMONIC PHASE',
    category: 'SPECTRAL OPERATOR',
    role: 'MODULATES WAVELENGTH OF NEARBY GEOMETRY',
    depthTier: 'foreground',
    anchorPosition: new THREE.Vector3(260, 150, 20),
    colorHex: 0x86efac,
    highlightColorHex: 0xffffff,
    dataPointCount: 24,
    variableTokens: ['λ', 'λ₁=1.414', 'λ₂=2.718', 'ħω', 'ψ(x)', 'phase(θ)', 'Eₙ', 'sin(kx)'],
  },
  {
    id: 'integral-accumulation',
    symbol: '∫',
    equation: '∫_Ω ω = ∮_∂Ω dω  •  lim Δx→0',
    subEquation: 'CONTINUOUS ACCUMULATION // STOKES MEASURE',
    category: 'CONTINUOUS ACCUMULATION',
    role: 'ACCUMULATES SCATTERED DATA INTO SOLID STRUCTURE',
    depthTier: 'midground',
    anchorPosition: new THREE.Vector3(-300, -130, -240),
    colorHex: 0x34d399,
    highlightColorHex: 0xf0fdf4,
    dataPointCount: 30,
    variableTokens: ['∫', 'dx', 'dy', 'dz', 'lim Δx→0', '∮', '∑f(xᵢ)Δx', 'vol(Ω)', 'dω'],
  },
  {
    id: 'pi-metric',
    symbol: 'π',
    equation: 'e^(iπ) + 1 = 0  •  ∮ dz/z = 2πi',
    subEquation: 'CIRCULAR METRIC // TOPOLOGY INVARIANCE',
    category: 'METRIC INVARIANCE',
    role: 'BREATHES CIRCULAR GEOMETRIC EXPANSION',
    depthTier: 'foreground',
    anchorPosition: new THREE.Vector3(-30, 210, -50),
    colorHex: 0x4ade80,
    highlightColorHex: 0xffffff,
    dataPointCount: 24,
    variableTokens: ['π', '2πr', 'e^(iθ)', 'θ=2π/n', 'rad', '3.14159', 'cos(θ)', 'sin(θ)'],
  },
  {
    id: 'delta-differential',
    symbol: 'Δ',
    equation: 'Δx → 0  •  ΔE Δt ≥ ħ/2',
    subEquation: 'COORDINATE SHIFT // PERTURBATION OFFSET',
    category: 'DIFFERENTIAL SHIFT',
    role: 'SHIFTS AND RECALIBRATES COORDINATE MATRIX',
    depthTier: 'background',
    anchorPosition: new THREE.Vector3(-250, 160, -420),
    colorHex: 0x10b981,
    highlightColorHex: 0xa7f3d0,
    dataPointCount: 26,
    variableTokens: ['Δ', 'Δx', 'Δy', 'Δz', 'x + Δx', '(x₂ - x₁)', 'δt', 'ε_k'],
  },
  {
    id: 'partial-flux',
    symbol: '∂',
    equation: '∂ρ/∂t + ∇·j = 0  •  ∂_μ F^μν',
    subEquation: 'PARTIAL FLUX // CONTINUITY TRANSPORT',
    category: 'FLUX DIVERGENCE',
    role: 'TRANSPORTS PARTICLES THROUGH POLYHEDRAL GATES',
    depthTier: 'midground',
    anchorPosition: new THREE.Vector3(270, 90, -360),
    colorHex: 0x22c55e,
    highlightColorHex: 0xf0fdf4,
    dataPointCount: 28,
    variableTokens: ['∂', '∂/∂t', '∂Ψ/∂x', 'flux(Φ)', 'div(j)', 'j_μ', 'ρ(x,t)', 'd²=0'],
  },
  {
    id: 'infinity-limit',
    symbol: '∞',
    equation: 'lim_{n→∞} (1 + 1/n)^n = e  •  ∀ε > 0',
    subEquation: 'ASYMPTOTIC LIMIT // CONTINUOUS LOOP',
    category: 'ASYMPTOTIC CONVERGENCE',
    role: 'ACCELERATES DATA TOWARD BOUNDARY LOOP',
    depthTier: 'background',
    anchorPosition: new THREE.Vector3(0, -180, -580),
    colorHex: 0x4ade80,
    highlightColorHex: 0xffffff,
    dataPointCount: 32,
    variableTokens: ['∞', 'n→∞', '1/k', '1/2ⁿ', 'ε > 0', 'lim_sup', 'R^∞', 'e=2.718'],
  },
];

/**
 * Procedural circular glow texture for mathematical data particles
 */
function createParticleGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(134, 239, 172, 0.95)');
    grad.addColorStop(0.65, 'rgba(34, 197, 94, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Creates high-detail Canvas texture for living mathematical operator node
 */
function renderOperatorCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: CalculationConstructConfig,
  intensity: number,
  hoverIntensity: number,
  time: number
) {
  ctx.clearRect(0, 0, width, height);

  const isHighActive = intensity > 0.1 || hoverIntensity > 0.1;
  const glowAmount = Math.max(intensity, hoverIntensity);

  // Subtle dark matrix glass backplate
  ctx.fillStyle = isHighActive
    ? 'rgba(2, 28, 12, 0.92)'
    : 'rgba(1, 14, 6, 0.78)';
  ctx.fillRect(6, 6, width - 12, height - 12);

  // Outer border with technical corner brackets
  ctx.strokeStyle = isHighActive
    ? `rgba(134, 239, 172, ${0.45 + glowAmount * 0.5})`
    : 'rgba(34, 197, 94, 0.28)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(6, 6, width - 12, height - 12);

  // Corner brackets
  const b = 18;
  ctx.strokeStyle = isHighActive ? '#f0fdf4' : '#4ade80';
  ctx.lineWidth = 2.5;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(6, 6 + b);
  ctx.lineTo(6, 6);
  ctx.lineTo(6 + b, 6);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(width - 6 - b, 6);
  ctx.lineTo(width - 6, 6);
  ctx.lineTo(width - 6, 6 + b);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(6, height - 6 - b);
  ctx.lineTo(6, height - 6);
  ctx.lineTo(6 + b, height - 6);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(width - 6 - b, height - 6);
  ctx.lineTo(width - 6, height - 6);
  ctx.lineTo(width - 6, height - 6 - b);
  ctx.stroke();

  // Fine technical crosshairs inside
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width * 0.5 - 30, 20);
  ctx.lineTo(width * 0.5 + 30, 20);
  ctx.moveTo(width * 0.5, 10);
  ctx.lineTo(width * 0.5, 30);
  ctx.stroke();

  // Giant Main Symbol (Δ, λ, π, Σ, ∫, ∂, ∞, ∇)
  ctx.font = '700 84px "Share Tech Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (glowAmount > 0.05) {
    ctx.shadowColor = '#86efac';
    ctx.shadowBlur = 16 + glowAmount * 18;
    ctx.fillStyle = glowAmount > 0.6 ? '#ffffff' : '#f0fdf4';
  } else {
    ctx.shadowColor = 'rgba(74, 222, 128, 0.6)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#86efac';
  }
  ctx.fillText(config.symbol, width * 0.5, height * 0.42);

  // Subtle calculation tick indicator
  ctx.shadowBlur = 0;
  ctx.font = '600 13px "Share Tech Mono", monospace';
  ctx.fillStyle = 'rgba(134, 239, 172, 0.85)';
  ctx.fillText(`[ ${config.category} ]`, width * 0.5, height * 0.72);

  // Core Equation
  ctx.font = '500 18px "Share Tech Mono", monospace';
  ctx.fillStyle = isHighActive ? '#ffffff' : 'rgba(240, 253, 244, 0.9)';
  if (isHighActive) {
    ctx.shadowColor = 'rgba(74, 222, 128, 0.8)';
    ctx.shadowBlur = 10;
  }
  ctx.fillText(config.equation, width * 0.5, height * 0.86);

  // Micro State / Numerical Sequence at bottom
  ctx.shadowBlur = 0;
  ctx.font = '400 11px "Share Tech Mono", monospace';
  ctx.fillStyle = 'rgba(74, 222, 128, 0.6)';
  const calcStep = Math.floor((time * 4) % 100);
  ctx.fillText(`CALC // STATE 0x${calcStep.toString(16).padStart(2, '0')} • ACTIVE`, width * 0.5, height * 0.95);
}

/**
 * Creates floating text sprites for micro variables (e.g., x₁, x₂, f(x), Δx)
 */
function createFloatingVariableSprite(text: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 256, 64);
    ctx.font = '600 24px "Share Tech Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(134, 239, 172, 0.85)';
    ctx.shadowColor = 'rgba(74, 222, 128, 0.7)';
    ctx.shadowBlur = 8;
    ctx.fillText(text, 128, 32);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(38, 9.5, 1);
  return sprite;
}

/**
 * Procedural Geometric Structure Generator for each mathematical construct
 */
function buildConstructGeometry(config: CalculationConstructConfig): {
  group: THREE.Group;
  primaryObject: THREE.Object3D;
} {
  const group = new THREE.Group();
  let primaryObject: THREE.Object3D;

  switch (config.id) {
    case 'sigma-convergence': {
      // Faceted Mathematical Convergence Lattice (Interconnected concentric polygon prisms)
      const latGroup = new THREE.Group();
      const outerGeo = new THREE.CylinderGeometry(55, 55, 45, 6, 2, true);
      const outerMat = new THREE.MeshBasicMaterial({
        color: 0x4ade80,
        wireframe: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      });
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      latGroup.add(outerMesh);

      const innerGeo = new THREE.IcosahedronGeometry(32, 1);
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0x86efac,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      latGroup.add(innerMesh);

      // Equator node ring
      const nodeRingGeo = new THREE.BufferGeometry();
      const nodePositions: number[] = [];
      for (let i = 0; i < 12; i++) {
        const theta = (i / 12) * Math.PI * 2;
        nodePositions.push(Math.cos(theta) * 62, 0, Math.sin(theta) * 62);
      }
      nodeRingGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));
      const nodeRingMat = new THREE.PointsMaterial({
        size: 5,
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      latGroup.add(new THREE.Points(nodeRingGeo, nodeRingMat));

      primaryObject = latGroup;
      group.add(latGroup);
      break;
    }

    case 'nabla-gradient': {
      // Curved Coordinate Manifold / Vector Flow Ribs
      const manifoldGroup = new THREE.Group();
      const ribCount = 9;
      const pointsPerRib = 24;

      for (let r = 0; r < ribCount; r++) {
        const u = (r / (ribCount - 1) - 0.5) * 80;
        const curvePoints: THREE.Vector3[] = [];
        for (let p = 0; p < pointsPerRib; p++) {
          const v = (p / (pointsPerRib - 1) - 0.5) * 90;
          // Gradient curved parabolic manifold: z = A*(x^2 - y^2)
          const z = (u * u - v * v) * 0.008;
          curvePoints.push(new THREE.Vector3(u, v, z));
        }
        const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
        const curveMat = new THREE.LineBasicMaterial({
          color: r % 2 === 0 ? 0x22c55e : 0x4ade80,
          transparent: true,
          opacity: 0.65,
          blending: THREE.AdditiveBlending,
        });
        manifoldGroup.add(new THREE.Line(curveGeo, curveMat));
      }

      // Normal directional vector needles
      const arrowGeo = new THREE.BufferGeometry();
      const arrowCoords: number[] = [];
      for (let a = 0; a < 14; a++) {
        const ax = (Math.random() - 0.5) * 65;
        const ay = (Math.random() - 0.5) * 75;
        const az = (ax * ax - ay * ay) * 0.008;
        const normalZ = 16;
        arrowCoords.push(ax, ay, az, ax + ay * 0.15, ay + ax * 0.15, az + normalZ);
      }
      arrowGeo.setAttribute('position', new THREE.Float32BufferAttribute(arrowCoords, 3));
      const arrowMat = new THREE.LineSegments(
        arrowGeo,
        new THREE.LineBasicMaterial({
          color: 0x86efac,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
        })
      );
      manifoldGroup.add(arrowMat);

      primaryObject = manifoldGroup;
      group.add(manifoldGroup);
      break;
    }

    case 'lambda-spectral': {
      // Harmonic Sinusoid Wave Ribbon
      const waveGroup = new THREE.Group();
      const wavePointsCount = 64;
      const ribbonTracks = 5;

      for (let t = 0; t < ribbonTracks; t++) {
        const offsetZ = (t - (ribbonTracks - 1) / 2) * 12;
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i < wavePointsCount; i++) {
          const x = (i / (wavePointsCount - 1) - 0.5) * 130;
          const phase = (i / wavePointsCount) * Math.PI * 4;
          const y = Math.sin(phase) * 26 + Math.cos(phase * 2) * 8;
          pts.push(new THREE.Vector3(x, y, offsetZ));
        }
        const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
        const lineMat = new THREE.LineBasicMaterial({
          color: t === 2 ? 0xffffff : 0x86efac,
          transparent: true,
          opacity: t === 2 ? 0.95 : 0.55,
          blending: THREE.AdditiveBlending,
        });
        waveGroup.add(new THREE.Line(lineGeo, lineMat));
      }

      // Harmonic node crossbars
      const barGeo = new THREE.BufferGeometry();
      const barCoords: number[] = [];
      for (let b = 0; b < 10; b++) {
        const progress = b / 9;
        const x = (progress - 0.5) * 130;
        const phase = progress * Math.PI * 4;
        const y = Math.sin(phase) * 26 + Math.cos(phase * 2) * 8;
        barCoords.push(x, y, -28, x, y, 28);
      }
      barGeo.setAttribute('position', new THREE.Float32BufferAttribute(barCoords, 3));
      waveGroup.add(
        new THREE.LineSegments(
          barGeo,
          new THREE.LineBasicMaterial({
            color: 0x4ade80,
            transparent: true,
            opacity: 0.65,
            blending: THREE.AdditiveBlending,
          })
        )
      );

      primaryObject = waveGroup;
      group.add(waveGroup);
      break;
    }

    case 'integral-accumulation': {
      // Stratified Layered Planes Accumulating Area into Volume
      const planeGroup = new THREE.Group();
      const layerCount = 6;

      for (let l = 0; l < layerCount; l++) {
        const heightNorm = l / (layerCount - 1);
        const y = (heightNorm - 0.5) * 70;
        const radius = 22 + Math.sin(heightNorm * Math.PI) * 32;

        const sliceGeo = new THREE.RingGeometry(1, radius, 16);
        const sliceMat = new THREE.MeshBasicMaterial({
          color: 0x34d399,
          wireframe: true,
          transparent: true,
          opacity: 0.55 + heightNorm * 0.35,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        });
        const sliceMesh = new THREE.Mesh(sliceGeo, sliceMat);
        sliceMesh.rotation.x = Math.PI / 2;
        sliceMesh.position.y = y;
        planeGroup.add(sliceMesh);
      }

      // Vertical Accumulation Axis
      const axisGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -42, 0),
        new THREE.Vector3(0, 42, 0),
      ]);
      planeGroup.add(
        new THREE.Line(
          axisGeo,
          new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
          })
        )
      );

      primaryObject = planeGroup;
      group.add(planeGroup);
      break;
    }

    case 'pi-metric': {
      // Circular Metric & Resonating Geodesic Ring Framework
      const ringGroup = new THREE.Group();

      const r1 = new THREE.TorusGeometry(48, 1.2, 16, 48);
      const r2 = new THREE.TorusGeometry(36, 1.0, 16, 48);
      const r3 = new THREE.TorusGeometry(24, 0.8, 16, 32);

      const ringMat = new THREE.LineBasicMaterial({
        color: 0x4ade80,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      });

      const mesh1 = new THREE.Mesh(r1, ringMat);
      const mesh2 = new THREE.Mesh(r2, ringMat);
      mesh2.rotation.x = Math.PI / 3;
      const mesh3 = new THREE.Mesh(r3, ringMat);
      mesh3.rotation.y = Math.PI / 3;

      ringGroup.add(mesh1);
      ringGroup.add(mesh2);
      ringGroup.add(mesh3);

      // 8 Radial Metric Spokes
      const spokeGeo = new THREE.BufferGeometry();
      const spokeCoords: number[] = [];
      for (let s = 0; s < 8; s++) {
        const theta = (s / 8) * Math.PI * 2;
        spokeCoords.push(0, 0, 0, Math.cos(theta) * 48, Math.sin(theta) * 48, 0);
      }
      spokeGeo.setAttribute('position', new THREE.Float32BufferAttribute(spokeCoords, 3));
      ringGroup.add(
        new THREE.LineSegments(
          spokeGeo,
          new THREE.LineBasicMaterial({
            color: 0x86efac,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
          })
        )
      );

      primaryObject = ringGroup;
      group.add(ringGroup);
      break;
    }

    case 'delta-differential': {
      // Shifting Coordinate Framework Matrix
      const matrixGroup = new THREE.Group();
      const boxSize = 75;
      const gridGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize, 2, 2, 2);
      const gridMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        wireframe: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      });
      const gridMesh = new THREE.Mesh(gridGeo, gridMat);
      matrixGroup.add(gridMesh);

      // Vertex highlight cubes
      const nodeGeo = new THREE.BoxGeometry(4.5, 4.5, 4.5);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: 0xa7f3d0,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      const half = boxSize / 2;
      for (const x of [-half, 0, half]) {
        for (const y of [-half, 0, half]) {
          for (const z of [-half, 0, half]) {
            const m = new THREE.Mesh(nodeGeo, nodeMat);
            m.position.set(x, y, z);
            matrixGroup.add(m);
          }
        }
      }

      primaryObject = matrixGroup;
      group.add(matrixGroup);
      break;
    }

    case 'partial-flux': {
      // Polyhedral Flux Cage with Translucent Facets & Flux Vectors
      const polyGroup = new THREE.Group();
      const cageGeo = new THREE.DodecahedronGeometry(44, 0);
      const cageWireMat = new THREE.LineBasicMaterial({
        color: 0x22c55e,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      const edges = new THREE.EdgesGeometry(cageGeo);
      polyGroup.add(new THREE.LineSegments(edges, cageWireMat));

      const cageFaceMat = new THREE.MeshBasicMaterial({
        color: 0x14532d,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      polyGroup.add(new THREE.Mesh(cageGeo, cageFaceMat));

      // Core singularity flux point
      const coreGeo = new THREE.OctahedronGeometry(14, 0);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x86efac,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      polyGroup.add(new THREE.Mesh(coreGeo, coreMat));

      primaryObject = polyGroup;
      group.add(polyGroup);
      break;
    }

    case 'infinity-limit':
    default: {
      // Asymptotic Mobius Ribbon / Double-Loop Lemniscate
      const mobiusGroup = new THREE.Group();
      const loopSegments = 64;
      const pts: THREE.Vector3[] = [];
      const a = 62;

      for (let i = 0; i <= loopSegments; i++) {
        const t = (i / loopSegments) * Math.PI * 2;
        // Lemniscate of Bernoulli
        const scale = a / (1 + Math.sin(t) * Math.sin(t));
        const x = scale * Math.cos(t);
        const y = scale * Math.sin(t) * Math.cos(t);
        const z = Math.sin(t * 3) * 16;
        pts.push(new THREE.Vector3(x, y, z));
      }

      const loopGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const loopMat = new THREE.LineBasicMaterial({
        color: 0x4ade80,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      mobiusGroup.add(new THREE.Line(loopGeo, loopMat));

      // Secondary nested loop
      const innerPts = pts.map((p) => p.clone().multiplyScalar(0.7));
      const innerGeo = new THREE.BufferGeometry().setFromPoints(innerPts);
      mobiusGroup.add(
        new THREE.Line(
          innerGeo,
          new THREE.LineBasicMaterial({
            color: 0x86efac,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
          })
        )
      );

      primaryObject = mobiusGroup;
      group.add(mobiusGroup);
      break;
    }
  }

  return { group, primaryObject };
}

/**
 * Living Calculation Engine Class
 * Manages all 8 mathematical constructs, their data particles, dynamic relationships,
 * and cinematic calculation activation cycles.
 */
export class LivingCalculationEngine {
  public scene: THREE.Scene;
  public constructs: CalculationConstructRuntime[] = [];
  public masterGroup: THREE.Group;
  public particleTexture: THREE.CanvasTexture;
  public ambientDustMesh: THREE.Points | null = null;
  public distantDataPlanesGroup: THREE.Group | null = null;
  public cameraCrossingParticles: THREE.Points | null = null;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.masterGroup = new THREE.Group();
    this.masterGroup.name = 'LIVING_CALCULATION_ENVIRONMENT';
    this.scene.add(this.masterGroup);
    this.particleTexture = createParticleGlowTexture();
    this.initConstructs();
    this.initAtmosphericDepthLayers();
  }

  /**
   * Initializes all 8 Calculation Constructs
   */
  private initConstructs() {
    CALCULATION_CONSTRUCT_CONFIGS.forEach((cfg) => {
      const constructGroup = new THREE.Group();
      constructGroup.name = `CONSTRUCT_${cfg.id}`;
      constructGroup.position.copy(cfg.anchorPosition);

      // 1. Operator Canvas & Texture
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        renderOperatorCanvas(ctx, 512, 300, cfg, 0, 0, 0);
      }
      const symbolTexture = new THREE.CanvasTexture(canvas);
      symbolTexture.minFilter = THREE.LinearFilter;
      symbolTexture.magFilter = THREE.LinearFilter;

      // Operator Display Plane (No conventional card: cybernetic translucent mathematical aperture)
      const symbolGeo = new THREE.PlaneGeometry(94, 55);
      const symbolMat = new THREE.MeshBasicMaterial({
        map: symbolTexture,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const symbolMesh = new THREE.Mesh(symbolGeo, symbolMat);
      symbolMesh.position.set(0, 0, 10);
      constructGroup.add(symbolMesh);

      // 2. Associated Procedural Geometry
      const { group: geometryGroup, primaryObject } = buildConstructGeometry(cfg);
      geometryGroup.position.set(cfg.anchorPosition.x < 0 ? 90 : -90, -10, -35);
      constructGroup.add(geometryGroup);

      // 3. Local Data Particle Cluster
      const particles: DataParticle[] = [];
      const particlePositions = new Float32Array(cfg.dataPointCount * 3);
      const particleColors = new Float32Array(cfg.dataPointCount * 3);
      const baseColor = new THREE.Color(cfg.colorHex);
      const highlightColor = new THREE.Color(cfg.highlightColorHex);

      const clusterRadius = 110;
      for (let p = 0; p < cfg.dataPointCount; p++) {
        // Scatter in spherical shell around the anchor
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const r = clusterRadius * (0.4 + Math.random() * 0.6);

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        const basePos = new THREE.Vector3(x, y, z);
        const currentPos = basePos.clone();
        // Target convergence point: between the operator symbol and its generated geometry
        const targetConvergencePos = new THREE.Vector3(
          (geometryGroup.position.x) * (0.3 + Math.random() * 0.4),
          (geometryGroup.position.y) * (0.3 + Math.random() * 0.4),
          (geometryGroup.position.z) * 0.5
        );

        const token = cfg.variableTokens[p % cfg.variableTokens.length];
        particles.push({
          basePosition: basePos,
          currentPosition: currentPos,
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.4
          ),
          targetConvergencePos,
          scale: 1.0 + Math.random() * 1.4,
          alpha: 0.6 + Math.random() * 0.4,
          phaseOffset: Math.random() * Math.PI * 2,
          variableText: token,
          driftRadius: 8 + Math.random() * 14,
        });

        particlePositions[p * 3 + 0] = x;
        particlePositions[p * 3 + 1] = y;
        particlePositions[p * 3 + 2] = z;

        particleColors[p * 3 + 0] = baseColor.r;
        particleColors[p * 3 + 1] = baseColor.g;
        particleColors[p * 3 + 2] = baseColor.b;
      }

      const dataPointsGeo = new THREE.BufferGeometry();
      dataPointsGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(particlePositions, 3)
      );
      dataPointsGeo.setAttribute(
        'color',
        new THREE.BufferAttribute(particleColors, 3)
      );

      const dataPointsMat = new THREE.PointsMaterial({
        size: 7.5,
        map: this.particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const dataPointsMesh = new THREE.Points(dataPointsGeo, dataPointsMat);
      constructGroup.add(dataPointsMesh);

      // 4. Dynamic Relationship Connecting Lines (Connecting symbol, data particles, and geometry)
      // Each particle has a potential link to the symbol and to the geometry
      const maxLines = cfg.dataPointCount * 2;
      const linePositions = new Float32Array(maxLines * 2 * 3);
      const connectingLinesGeo = new THREE.BufferGeometry();
      connectingLinesGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(linePositions, 3)
      );

      const connectingLinesMat = new THREE.LineBasicMaterial({
        color: cfg.colorHex,
        transparent: true,
        opacity: 0.0, // Ambient: invisible; emerges during calculation
        blending: THREE.AdditiveBlending,
        linewidth: 1,
      });
      const connectingLinesMesh = new THREE.LineSegments(
        connectingLinesGeo,
        connectingLinesMat
      );
      constructGroup.add(connectingLinesMesh);

      // 5. Micro Floating Variable Text Sprites (e.g. x₁, x₂, f(x), Δx)
      const floatingTextSprites: THREE.Sprite[] = [];
      for (let s = 0; s < 4; s++) {
        const token = cfg.variableTokens[s % cfg.variableTokens.length];
        const sprite = createFloatingVariableSprite(token);
        const randPart = particles[s * 3];
        sprite.position.set(
          randPart.basePosition.x + 10,
          randPart.basePosition.y + 10,
          randPart.basePosition.z
        );
        constructGroup.add(sprite);
        floatingTextSprites.push(sprite);
      }

      // 6. Interactive Raycast Hit Collider (Invisible sphere for comfortable desktop hover & mobile tap)
      const hitRadius = cfg.depthTier === 'foreground' ? 68 : 82;
      const hitGeo = new THREE.SphereGeometry(hitRadius, 10, 10);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitCollider = new THREE.Mesh(hitGeo, hitMat);
      hitCollider.position.set(0, 0, 10);
      hitCollider.userData = {
        isLivingCalculationConstruct: true,
        constructId: cfg.id,
        title: `${cfg.symbol} // ${cfg.category}`,
      };
      constructGroup.add(hitCollider);

      this.masterGroup.add(constructGroup);

      this.constructs.push({
        config: cfg,
        group: constructGroup,
        symbolMesh,
        symbolTexture,
        symbolCanvas: canvas,
        symbolContext: ctx,
        geometryGroup,
        geometryMesh: primaryObject,
        dataPointsMesh,
        dataPointsGeo,
        dataParticles: particles,
        connectingLinesMesh,
        connectingLinesGeo,
        state: {
          constructId: cfg.id,
          phase: 'ambient',
          phaseProgress: 0,
          totalTimeElapsed: 0,
          totalDuration: 2.6,
          isHovered: false,
          isSelected: false,
          activationIntensity: 0,
          hoverIntensity: 0,
        },
        hitCollider,
        floatingTextSprites,
      });
    });
  }

  /**
   * Initializes Layered Depth atmospheric fields:
   * Foreground crossing particles, Midground pathways, and Background distant mathematical fields
   */
  private initAtmosphericDepthLayers() {
    // 1. Camera-Crossing Foreground Particles (Very close, occasional slow drift)
    const fgCount = 180;
    const fgPositions = new Float32Array(fgCount * 3);
    for (let i = 0; i < fgCount; i++) {
      fgPositions[i * 3 + 0] = (Math.random() - 0.5) * 850;
      fgPositions[i * 3 + 1] = (Math.random() - 0.5) * 550;
      fgPositions[i * 3 + 2] = Math.random() * 450 + 150; // Z in front of camera start
    }
    const fgGeo = new THREE.BufferGeometry();
    fgGeo.setAttribute('position', new THREE.BufferAttribute(fgPositions, 3));
    const fgMat = new THREE.PointsMaterial({
      size: 9.0,
      map: this.particleTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0x86efac,
    });
    this.cameraCrossingParticles = new THREE.Points(fgGeo, fgMat);
    this.masterGroup.add(this.cameraCrossingParticles);

    // 2. Distant Mathematical Field Planes & Faint 0101 Streams (Deep Background Z = -900 to -2200)
    const distantGroup = new THREE.Group();
    distantGroup.name = 'DISTANT_MATHEMATICAL_FIELD';

    // Distant coordinate lattices
    const distantGrid = new THREE.GridHelper(3200, 32, 0x14532d, 0x052e16);
    distantGrid.position.set(0, -320, -1400);
    (distantGrid.material as THREE.Material).transparent = true;
    (distantGrid.material as THREE.Material).opacity = 0.28;
    distantGroup.add(distantGrid);

    // Deep background mathematical glyph planes
    const distantSymbols = ['∇²Ψ', 'lim', '∮_C', '∑_{i=1}^n', 'd(α∧β)', 'det(A-λI)', 'H(X)', '∂_μ F^μν'];
    distantSymbols.forEach((sym, idx) => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 128;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.font = '500 28px "Share Tech Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
        ctx.fillText(sym, 128, 64);
      }
      const tex = new THREE.CanvasTexture(c);
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(160, 80),
        new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: 0.35,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      m.position.set(
        (Math.random() - 0.5) * 1600,
        (Math.random() - 0.5) * 900,
        -1100 - idx * 160
      );
      distantGroup.add(m);
    });

    this.distantDataPlanesGroup = distantGroup;
    this.masterGroup.add(distantGroup);

    // 3. Subtle Ambient Quantum Dust (Volumetric 3D field)
    const dustCount = 800;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3 + 0] = (Math.random() - 0.5) * 1800;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 1200;
      dustPositions[i * 3 + 2] = -Math.random() * 2200 + 300;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 4.5,
      map: this.particleTexture,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      color: 0x4ade80,
      depthWrite: false,
    });
    this.ambientDustMesh = new THREE.Points(dustGeo, dustMat);
    this.masterGroup.add(this.ambientDustMesh);
  }

  /**
   * Sets hovered construct by ID
   */
  public setHoveredConstruct(constructId: CalculationConstructId | null) {
    this.constructs.forEach((c) => {
      c.state.isHovered = c.config.id === constructId;
    });
  }

  /**
   * Triggers active calculation sequence for selected construct
   */
  public triggerCalculation(constructId: CalculationConstructId) {
    const target = this.constructs.find((c) => c.config.id === constructId);
    if (target) {
      target.state.phase = 'attracting';
      target.state.phaseProgress = 0;
      target.state.totalTimeElapsed = 0;
      target.state.isSelected = true;
    }
  }

  /**
   * Updates the Living Calculation Environment on every animation frame
   */
  public update(delta: number, time: number, scrollProgress: number) {
    // 1. Overall Environmental Visibility according to scroll progress
    // Seamlessly matches DEEP Section 2 progression:
    // Starts emerging at p = 0.08, fully established by p = 0.30 - 0.88, smoothly exits at 0.90
    let envAlpha = 0;
    if (scrollProgress >= 0.08 && scrollProgress < 0.28) {
      envAlpha = (scrollProgress - 0.08) / 0.20;
    } else if (scrollProgress >= 0.28 && scrollProgress <= 0.88) {
      envAlpha = 1.0;
    } else if (scrollProgress > 0.88) {
      envAlpha = Math.max(0, 1 - (scrollProgress - 0.88) / 0.08);
    }

    // Update Foreground Crossing Particles
    if (this.cameraCrossingParticles) {
      const posAttr = this.cameraCrossingParticles.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        arr[i + 1] += Math.sin(time * 0.4 + i) * 0.15;
        arr[i + 2] -= 0.6; // Drift toward camera
        if (arr[i + 2] < -200) {
          arr[i + 2] = 550;
        }
      }
      posAttr.needsUpdate = true;
      (this.cameraCrossingParticles.material as THREE.PointsMaterial).opacity = envAlpha * 0.45;
    }

    // Update Distant Atmospheric Background Field
    if (this.distantDataPlanesGroup) {
      this.distantDataPlanesGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          (child.material as THREE.MeshBasicMaterial).opacity = envAlpha * 0.35;
          child.position.y += Math.sin(time * 0.2 + child.position.x) * 0.08;
        } else if (child instanceof THREE.GridHelper) {
          (child.material as THREE.Material).opacity = envAlpha * 0.25;
        }
      });
    }

    if (this.ambientDustMesh) {
      (this.ambientDustMesh.material as THREE.PointsMaterial).opacity = envAlpha * 0.35;
    }

    // 2. Process each of the 8 Living Calculation Constructs
    this.constructs.forEach((c) => {
      const { state, config, dataParticles, dataPointsGeo, connectingLinesGeo, geometryMesh } = c;

      // Smooth lerping of hover intensity
      const targetHover = state.isHovered ? 1.0 : 0.0;
      state.hoverIntensity += (targetHover - state.hoverIntensity) * 0.14;

      // Calculation Sequence State Machine
      if (state.phase !== 'ambient') {
        state.totalTimeElapsed += delta;
        const totalDuration = state.totalDuration; // ~2.6s
        const t = state.totalTimeElapsed;

        // Phase 1: Attracting (0.0s to 0.4s) -> Symbol sharpens, particles begin converging
        if (t < 0.4) {
          state.phase = 'attracting';
          state.phaseProgress = t / 0.4;
          state.activationIntensity = state.phaseProgress;
        }
        // Phase 2: Connecting (0.4s to 1.1s) -> Laser lines emerge, relationship established
        else if (t < 1.1) {
          state.phase = 'connecting';
          state.phaseProgress = (t - 0.4) / 0.7;
          state.activationIntensity = 1.0;
        }
        // Phase 3: Geometry Reacting (1.1s to 1.8s) -> Nearby geometric structure responds
        else if (t < 1.8) {
          state.phase = 'geometry_reacting';
          state.phaseProgress = (t - 1.1) / 0.7;
          state.activationIntensity = 1.0;
        }
        // Phase 4: Stabilizing (1.8s to 2.3s) -> System locks into mathematical equilibrium
        else if (t < 2.3) {
          state.phase = 'stabilizing';
          state.phaseProgress = (t - 1.8) / 0.5;
          state.activationIntensity = 0.95;
        }
        // Phase 5: Decaying / Return to ambient (2.3s to 2.8s)
        else if (t < 2.8) {
          state.phase = 'decaying';
          state.phaseProgress = (t - 2.3) / 0.5;
          state.activationIntensity = Math.max(0, 1 - state.phaseProgress);
        } else {
          state.phase = 'ambient';
          state.phaseProgress = 0;
          state.totalTimeElapsed = 0;
          state.isSelected = false;
          state.activationIntensity = 0;
        }
      } else {
        state.activationIntensity = 0;
      }

      const activeGlow = Math.max(state.activationIntensity, state.hoverIntensity * 0.65);

      // Re-render Operator Canvas on active state change or periodically for micro-ticks
      if (c.symbolContext && (activeGlow > 0.05 || Math.random() < 0.03)) {
        renderOperatorCanvas(
          c.symbolContext,
          512,
          300,
          config,
          state.activationIntensity,
          state.hoverIntensity,
          time
        );
        c.symbolTexture.needsUpdate = true;
      }

      // Depth Tier Base Opacity
      const tierAlpha = config.depthTier === 'foreground' ? 1.0 : config.depthTier === 'midground' ? 0.8 : 0.6;
      const finalSymbolAlpha = envAlpha * tierAlpha * (0.8 + activeGlow * 0.2);
      (c.symbolMesh.material as THREE.MeshBasicMaterial).opacity = finalSymbolAlpha;

      // Subtle breath scale on symbol
      const breathScale = 1.0 + Math.sin(time * 1.5 + config.anchorPosition.x) * 0.02 + activeGlow * 0.06;
      c.symbolMesh.scale.set(breathScale, breathScale, breathScale);

      // -----------------------------------------------------------------------
      // DATA PARTICLES UPDATE: Data -> Calculation -> Geometry
      // -----------------------------------------------------------------------
      const posAttr = dataPointsGeo.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      const linePosAttr = connectingLinesGeo.attributes.position as THREE.BufferAttribute;
      const linePosArray = linePosAttr.array as Float32Array;
      let lineIndex = 0;

      dataParticles.forEach((p, idx) => {
        // Ambient gentle drift: orbiting around base position
        const ambientX = p.basePosition.x + Math.sin(time * 0.8 + p.phaseOffset) * p.driftRadius;
        const ambientY = p.basePosition.y + Math.cos(time * 0.7 + p.phaseOffset) * p.driftRadius;
        const ambientZ = p.basePosition.z + Math.sin(time * 0.5 + p.phaseOffset) * (p.driftRadius * 0.6);

        // When active (attracting/connecting/geometry_reacting/stabilizing):
        // Data converges inward toward the calculation nexus and geometric framework!
        const convergenceWeight = activeGlow; // 0.0 to 1.0
        const targetX = THREE.MathUtils.lerp(ambientX, p.targetConvergencePos.x, convergenceWeight * 0.82);
        const targetY = THREE.MathUtils.lerp(ambientY, p.targetConvergencePos.y, convergenceWeight * 0.82);
        const targetZ = THREE.MathUtils.lerp(ambientZ, p.targetConvergencePos.z, convergenceWeight * 0.82);

        p.currentPosition.x += (targetX - p.currentPosition.x) * 0.12;
        p.currentPosition.y += (targetY - p.currentPosition.y) * 0.12;
        p.currentPosition.z += (targetZ - p.currentPosition.z) * 0.12;

        posArray[idx * 3 + 0] = p.currentPosition.x;
        posArray[idx * 3 + 1] = p.currentPosition.y;
        posArray[idx * 3 + 2] = p.currentPosition.z;

        // Populate connecting lines if actively calculating or hovered
        if (activeGlow > 0.08) {
          // Line from Symbol Center (0, 0, 10) to this Data Particle
          linePosArray[lineIndex++] = 0;
          linePosArray[lineIndex++] = 0;
          linePosArray[lineIndex++] = 10;

          linePosArray[lineIndex++] = p.currentPosition.x;
          linePosArray[lineIndex++] = p.currentPosition.y;
          linePosArray[lineIndex++] = p.currentPosition.z;

          // Line from Data Particle to Generated Geometry anchor
          if (idx % 2 === 0) {
            linePosArray[lineIndex++] = p.currentPosition.x;
            linePosArray[lineIndex++] = p.currentPosition.y;
            linePosArray[lineIndex++] = p.currentPosition.z;

            linePosArray[lineIndex++] = c.geometryGroup.position.x;
            linePosArray[lineIndex++] = c.geometryGroup.position.y;
            linePosArray[lineIndex++] = c.geometryGroup.position.z;
          }
        }
      });

      posAttr.needsUpdate = true;
      (c.dataPointsMesh.material as THREE.PointsMaterial).opacity = envAlpha * (0.65 + activeGlow * 0.35);

      // Connecting lines opacity and update
      linePosAttr.needsUpdate = true;
      const lineMat = c.connectingLinesMesh.material as THREE.LineBasicMaterial;
      lineMat.opacity = envAlpha * Math.min(1.0, activeGlow * 0.85);

      // Floating variable text sprites update
      c.floatingTextSprites.forEach((sprite, sIdx) => {
        const p = dataParticles[sIdx * 4];
        if (p) {
          sprite.position.set(
            p.currentPosition.x + 12,
            p.currentPosition.y + 12,
            p.currentPosition.z
          );
        }
        const sMat = sprite.material as THREE.SpriteMaterial;
        sMat.opacity = envAlpha * (0.45 + activeGlow * 0.45);
      });

      // -----------------------------------------------------------------------
      // GEOMETRIC STRUCTURE RESPONSE: Generated by the Calculation!
      // -----------------------------------------------------------------------
      const baseRotSpeed = 0.25;
      const activeSpeedMultiplier = 1.0 + activeGlow * 2.4;

      if (geometryMesh) {
        geometryMesh.rotation.y += delta * baseRotSpeed * activeSpeedMultiplier;
        geometryMesh.rotation.x += delta * 0.12 * activeSpeedMultiplier;

        // Specific construct geometric reactions:
        switch (config.id) {
          case 'sigma-convergence': {
            // Lattice contracts and tightens vertices during summation
            const tighten = 1.0 - activeGlow * 0.18;
            geometryMesh.scale.set(tighten, tighten, tighten);
            break;
          }
          case 'nabla-gradient': {
            // Manifold flexes along gradient curvature
            const flex = 1.0 + Math.sin(time * 3) * (0.05 + activeGlow * 0.15);
            geometryMesh.scale.set(1.0, flex, 1.0);
            break;
          }
          case 'lambda-spectral': {
            // Wave crests oscillate with modulated wavelength
            const waveScale = 1.0 + Math.sin(time * (2.5 + activeGlow * 4)) * (0.08 + activeGlow * 0.2);
            geometryMesh.scale.set(1.0, waveScale, 1.0);
            break;
          }
          case 'integral-accumulation': {
            // Stratified planes illuminate and expand sequentially
            const expand = 1.0 + activeGlow * 0.16;
            geometryMesh.scale.set(expand, expand, expand);
            break;
          }
          case 'pi-metric': {
            // Geodesic ring breathing expansion/contraction
            const breathe = 1.0 + Math.sin(time * (1.8 + activeGlow * 2.5)) * (0.06 + activeGlow * 0.14);
            geometryMesh.scale.set(breathe, breathe, breathe);
            break;
          }
          case 'delta-differential': {
            // Coordinate framework shifts position
            const shiftX = Math.sin(time * 2) * (activeGlow * 8);
            const shiftY = Math.cos(time * 2) * (activeGlow * 8);
            c.geometryGroup.position.x = (config.anchorPosition.x < 0 ? 90 : -90) + shiftX;
            c.geometryGroup.position.y = -10 + shiftY;
            break;
          }
          case 'partial-flux': {
            // Polyhedral cage shimmers with refracted flux
            const fluxScale = 1.0 + Math.sin(time * 4) * (activeGlow * 0.12);
            geometryMesh.scale.set(fluxScale, fluxScale, fluxScale);
            break;
          }
          case 'infinity-limit': {
            // Asymptotic loop tilts and accelerates
            geometryMesh.rotation.z += delta * 0.4 * activeSpeedMultiplier;
            break;
          }
        }
      }
    });
  }

  /**
   * Cleanup Three.js resources
   */
  public dispose() {
    this.constructs.forEach((c) => {
      c.symbolTexture.dispose();
      c.symbolMesh.geometry.dispose();
      (c.symbolMesh.material as THREE.Material).dispose();

      c.dataPointsGeo.dispose();
      (c.dataPointsMesh.material as THREE.Material).dispose();

      c.connectingLinesGeo.dispose();
      (c.connectingLinesMesh.material as THREE.Material).dispose();

      c.hitCollider.geometry.dispose();
      (c.hitCollider.material as THREE.Material).dispose();

      c.floatingTextSprites.forEach((s) => {
        s.material.map?.dispose();
        s.material.dispose();
      });
    });

    if (this.cameraCrossingParticles) {
      this.cameraCrossingParticles.geometry.dispose();
      (this.cameraCrossingParticles.material as THREE.Material).dispose();
    }

    if (this.ambientDustMesh) {
      this.ambientDustMesh.geometry.dispose();
      (this.ambientDustMesh.material as THREE.Material).dispose();
    }

    this.particleTexture.dispose();
    this.scene.remove(this.masterGroup);
  }
}
