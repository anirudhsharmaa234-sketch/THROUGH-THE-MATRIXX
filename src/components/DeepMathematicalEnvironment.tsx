/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface DeepMathematicalEnvironmentProps {
  scrollProgress: number; // 0.0 to 1.0 (pure scroll-driven, no autoplay)
  selectedElementId?: string | null;
  onSelectElement?: (elementId: string, screenPos: { x: number; y: number }) => void;
  onUpdateScreenPos?: (screenPos: { x: number; y: number }) => void;
}

// Element ID mapping matching ELEMENT_INFO_REGISTRY
export const FORMULA_ELEMENT_IDS = [
  'schrodinger-dynamics',
  'maxwell-field-tensor',
  'einstein-field-equation',
  'shannon-entropy',
  'de-rham-cohomology',
  'fourier-transform',
  'godel-incompleteness',
  'synaptic-tensor',
  'euler-identity',
  'eigenvalue-decomposition',
  'heisenberg-uncertainty',
  'geodesic-flow',
];

// 12 High-Detail Mathematical Equations & Formulations
const MATHEMATICAL_FORMULAS = [
  {
    category: 'QUANTUM FIELD // WAVE FUNCTION',
    title: 'SCHRÖDINGER DYNAMICS',
    equation: 'iħ ∂Ψ/∂t = ĤΨ',
    subtext: 'j = (ħ/2mi)(Ψ*∇Ψ - Ψ∇Ψ*) • PROBABILITY FLUX',
  },
  {
    category: 'ELECTRODYNAMICS // TENSOR FIELD',
    title: 'MAXWELL FIELD TENSOR',
    equation: '∂_μ F^μν = μ₀ J^ν',
    subtext: 'F^μν = ∂^μ A^ν - ∂^ν A^μ • GAUGE INVARIANCE',
  },
  {
    category: 'RELATIVISTIC GEOMETRY // SUBSTRATE',
    title: 'EINSTEIN FIELD EQUATION',
    equation: 'G_μν + Λ g_μν = (8πG/c⁴) T_μν',
    subtext: 'R_μν - ½ R g_μν = κ T_μν • CURVATURE TENSOR',
  },
  {
    category: 'INFORMATION ENTROPY // RECURSION',
    title: 'SHANNON MEASURE',
    equation: 'H(X) = -∑ p(x) log₂ p(x)',
    subtext: 'D_KL(P || Q) = ∑ P(x) log(P(x)/Q(x)) • DIVERGENCE',
  },
  {
    category: 'TOPOLOGY // EXTERIOR CALCULUS',
    title: 'DE RHAM COHOMOLOGY',
    equation: 'd(α ∧ β) = dα ∧ β + (-1)^p α ∧ dβ',
    subtext: 'd²ω = 0 ⇔ ∮_∂Σ ω = ∬_Σ dω • STOKES THEOREM',
  },
  {
    category: 'HARMONIC ANALYSIS // SPECTRUM',
    title: 'FOURIER TRANSFORM',
    equation: 'F{ψ}(ω) = (1/√2π) ∫ ψ(t) e^(-iωt) dt',
    subtext: '∫ |ψ(t)|² dt = ∫ |F(ω)|² dω • PARSEVAL IDENTITY',
  },
  {
    category: 'RECURSIVE LOGIC // FOUNDATIONS',
    title: 'GÖDEL FORMAL INCOMPLETENESS',
    equation: '∀F [Cons(F) ⇒ ∃G (True(G) ∧ ¬Prov_F(G))]',
    subtext: 'λx.(x x)(λy.y) • RECURSIVE ENCODING FIXPOINT',
  },
  {
    category: 'NEURAL SUBSTRATE // WEIGHT TENSOR',
    title: 'SYNAPTIC TENSOR MAPPING',
    equation: 'H^(l+1) = σ(W^(l) H^(l) + b^(l))',
    subtext: '∇_W L = ∑ δ_k ⊗ a_j • BACKPROPAGATION KERNEL',
  },
  {
    category: 'COMPLEX ANALYSIS // IDENTITY',
    title: 'EULER IDENTITY',
    equation: 'e^(iπ) + 1 = 0',
    subtext: '∮_C f(z)/(z - z₀) dz = 2πi f(z₀) • CAUCHY INTEGRAL',
  },
  {
    category: 'SPECTRAL THEORY // OPERATORS',
    title: 'EIGENVALUE DECOMPOSITION',
    equation: 'det(A - λI) = 0',
    subtext: 'A = Q Λ Q⁻¹ • SPECTRAL ORTHOGONALITY',
  },
  {
    category: 'QUANTUM KINEMATICS // COMMUTATION',
    title: 'HEISENBERG UNCERTAINTY',
    equation: '[x̂, p̂] = iħ I',
    subtext: 'Δx Δp ≥ ħ/2 • CANONICAL COMMUTATION',
  },
  {
    category: 'DIFFERENTIAL GEOMETRY // GEODESICS',
    title: 'GEODESIC FLOW',
    equation: 'd²x^μ/ds² + Γ^μ_αβ (dx^α/ds)(dx^β/ds) = 0',
    subtext: 'Γ^μ_αβ = ½ g^μλ (∂_α g_βλ + ∂_β g_αλ - ∂_λ g_αβ)',
  },
];

// 4D Tesseract (Hypercube) Vertices in [-1, 1]^4
const TESSERACT_VERTICES_4D: number[][] = [];
for (let x = -1; x <= 1; x += 2) {
  for (let y = -1; y <= 1; y += 2) {
    for (let z = -1; z <= 1; z += 2) {
      for (let w = -1; w <= 1; w += 2) {
        TESSERACT_VERTICES_4D.push([x, y, z, w]);
      }
    }
  }
}

// 4D Tesseract Edges (32 edges connecting vertices differing by 1 coordinate)
const TESSERACT_EDGES: [number, number][] = [];
for (let i = 0; i < TESSERACT_VERTICES_4D.length; i++) {
  for (let j = i + 1; j < TESSERACT_VERTICES_4D.length; j++) {
    let diff = 0;
    for (let c = 0; c < 4; c++) {
      if (TESSERACT_VERTICES_4D[i][c] !== TESSERACT_VERTICES_4D[j][c]) {
        diff++;
      }
    }
    if (diff === 1) {
      TESSERACT_EDGES.push([i, j]);
    }
  }
}

/**
 * Creates high-resolution canvas texture for mathematical formula cards
 */
function createFormulaTexture(data: (typeof MATHEMATICAL_FORMULAS)[0]): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 420;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle dark matrix glass background
    ctx.fillStyle = 'rgba(1, 15, 6, 0.88)';
    ctx.fillRect(8, 8, canvas.width - 16, canvas.height - 16);

    // Outer cyber border
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.45)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

    // 4 Corner brackets
    const bLen = 28;
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 4;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(8, 8 + bLen);
    ctx.lineTo(8, 8);
    ctx.lineTo(8 + bLen, 8);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(canvas.width - 8 - bLen, 8);
    ctx.lineTo(canvas.width - 8, 8);
    ctx.lineTo(canvas.width - 8, 8 + bLen);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(8, canvas.height - 8 - bLen);
    ctx.lineTo(8, canvas.height - 8);
    ctx.lineTo(8 + bLen, canvas.height - 8);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(canvas.width - 8 - bLen, canvas.height - 8);
    ctx.lineTo(canvas.width - 8, canvas.height - 8);
    ctx.lineTo(canvas.width - 8, canvas.height - 8 - bLen);
    ctx.stroke();

    // Category tag
    ctx.font = '600 24px "Share Tech Mono", monospace';
    ctx.fillStyle = 'rgba(134, 239, 172, 0.85)';
    ctx.fillText(`[ ${data.category} ]`, 42, 58);

    // Title
    ctx.font = '700 32px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(74, 222, 128, 0.6)';
    ctx.shadowBlur = 12;
    ctx.fillText(data.title, 42, 108);

    // Divider
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(42, 134);
    ctx.lineTo(canvas.width - 42, 134);
    ctx.stroke();

    // Core Equation (Large, high-contrast, glowing display)
    ctx.font = '700 52px "Share Tech Mono", monospace';
    ctx.fillStyle = '#f0fdf4';
    ctx.shadowColor = 'rgba(74, 222, 128, 0.9)';
    ctx.shadowBlur = 18;
    ctx.fillText(data.equation, 46, 230);

    // Subtext / Parameter Breakdown
    ctx.shadowBlur = 0;
    ctx.font = '500 22px "Share Tech Mono", monospace';
    ctx.fillStyle = 'rgba(134, 239, 172, 0.9)';
    ctx.fillText(data.subtext, 46, 330);

    // Micro telemetry indicator in bottom-right
    ctx.font = '400 18px "Share Tech Mono", monospace';
    ctx.fillStyle = 'rgba(74, 222, 128, 0.6)';
    ctx.textAlign = 'right';
    ctx.fillText('DEEP // FORMULATION [ACTIVE]', canvas.width - 42, 380);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

/**
 * Creates texture for fragmented mathematical glyph clusters
 */
function createGlyphCloudTexture(symbols: string[]): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    symbols.forEach((sym, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const x = 90 + col * 165;
      const y = 90 + row * 165;

      ctx.font = '600 68px "Share Tech Mono", monospace';
      ctx.fillStyle = idx % 2 === 0 ? '#4ade80' : '#86efac';
      ctx.shadowColor = 'rgba(74, 222, 128, 0.7)';
      ctx.shadowBlur = 14;
      ctx.fillText(sym, x, y);

      // Micro coordinate index
      ctx.shadowBlur = 0;
      ctx.font = '400 13px "Share Tech Mono", monospace';
      ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
      ctx.fillText(`0x${(idx * 17).toString(16).padStart(2, '0')}`, x, y + 46);
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Creates high-detail cybernetic matrix face textures for the 3D Cubic Model
 */
function createCubicBoxFaceTexture(faceLabel: string, glyph: string, equation: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 512, 512);

    // Dark emerald semi-transparent glass panel
    ctx.fillStyle = 'rgba(2, 22, 10, 0.76)';
    ctx.fillRect(8, 8, 496, 496);

    // Fine coordinate grid lines
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.22)';
    ctx.lineWidth = 1;
    const step = 32;
    for (let x = 32; x < 480; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 16);
      ctx.lineTo(x, 496);
      ctx.stroke();
    }
    for (let y = 32; y < 480; y += step) {
      ctx.beginPath();
      ctx.moveTo(16, y);
      ctx.lineTo(496, y);
      ctx.stroke();
    }

    // Outer cyber border
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.65)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(16, 16, 480, 480);

    // Corner brackets
    const bLen = 32;
    ctx.strokeStyle = '#86efac';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(16, 16 + bLen); ctx.lineTo(16, 16); ctx.lineTo(16 + bLen, 16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(496 - bLen, 16); ctx.lineTo(496, 16); ctx.lineTo(496, 16 + bLen); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(16, 496 - bLen); ctx.lineTo(16, 496); ctx.lineTo(16 + bLen, 496); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(496 - bLen, 496); ctx.lineTo(496, 496); ctx.lineTo(496, 496 - bLen); ctx.stroke();

    // Central crosshair
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(232, 256); ctx.lineTo(280, 256); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(256, 232); ctx.lineTo(256, 280); ctx.stroke();

    // Face header designation
    ctx.font = '600 20px "Share Tech Mono", monospace';
    ctx.fillStyle = '#86efac';
    ctx.fillText(`[ ${faceLabel} ]`, 32, 54);

    // Central glowing tensor/wave glyph
    ctx.font = '700 84px "Share Tech Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(74, 222, 128, 0.9)';
    ctx.shadowBlur = 18;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(glyph, 256, 240);

    // Equation display
    ctx.shadowBlur = 0;
    ctx.font = '600 22px "Share Tech Mono", monospace';
    ctx.fillStyle = '#86efac';
    ctx.fillText(equation, 256, 340);

    // Substrate telemetry footnote
    ctx.font = '400 15px "Share Tech Mono", monospace';
    ctx.fillStyle = 'rgba(74, 222, 128, 0.65)';
    ctx.fillText('HYPERCUBE // SUBSTRATE MANIFOLD', 256, 450);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

export default function DeepMathematicalEnvironment({
  scrollProgress,
  selectedElementId = null,
  onSelectElement,
  onUpdateScreenPos,
}: DeepMathematicalEnvironmentProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // References to keep Three.js scene alive without re-allocating
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Exploration / Interaction references
  const interactiveObjectsRef = useRef<THREE.Object3D[]>([]);
  const hoveredElementIdRef = useRef<string | null>(null);
  const selectedElementIdRef = useRef<string | null>(selectedElementId || null);
  const onSelectElementRef = useRef(onSelectElement);
  const onUpdateScreenPosRef = useRef(onUpdateScreenPos);

  // 3D Cubic Model Interaction State & HUD Controls
  const [dragMode, setDragMode] = useState<'rotate' | 'move' | 'zoom'>('rotate');
  const [isInteractingModel, setIsInteractingModel] = useState<boolean>(false);
  const [modelTelemetry, setModelTelemetry] = useState<{
    rotX: number;
    rotY: number;
    rotZ: number;
    posX: number;
    posY: number;
    scale: number;
  }>({
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    posX: 0,
    posY: 0,
    scale: 1.0,
  });

  const dragModeRef = useRef<'rotate' | 'move' | 'zoom'>('rotate');
  useEffect(() => {
    dragModeRef.current = dragMode;
  }, [dragMode]);

  const cubicBoxGroupRef = useRef<THREE.Group | null>(null);
  const cubicBoxMaterialsRef = useRef<THREE.Material[]>([]);
  const innerCubeGroupRef = useRef<THREE.Group | null>(null);
  const coreMeshRef = useRef<THREE.Mesh | null>(null);
  const gimbalHorizontalRef = useRef<THREE.Mesh | null>(null);
  const gimbalVerticalRef = useRef<THREE.Mesh | null>(null);

  // Interactive 3D Model rotation, position & scale targets (lerped in render loop)
  const modelRotRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const targetModelRotRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const modelPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetModelPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const modelScaleRef = useRef<number>(1.0);
  const targetModelScaleRef = useRef<number>(1.0);
  const lastTelemetryUpdateRef = useRef<number>(0);

  const isPointerDownOnModelRef = useRef<boolean>(false);
  const isDraggingModelRef = useRef<boolean>(false);
  const activeDragModeRef = useRef<'rotate' | 'move' | 'zoom'>('rotate');

  // Interactive zoom / size increase and decrease handlers
  const handleZoomIn = () => {
    targetModelScaleRef.current = Math.min(2.5, Math.round((targetModelScaleRef.current + 0.15) * 100) / 100);
  };

  const handleZoomOut = () => {
    targetModelScaleRef.current = Math.max(0.4, Math.round((targetModelScaleRef.current - 0.15) * 100) / 100);
  };

  const handleSetScale = (scale: number) => {
    targetModelScaleRef.current = Math.max(0.4, Math.min(2.5, scale));
  };

  // Interactive finger-tap rotation handlers (X, Y, Z axes)
  const handleRotateY = (delta: number) => {
    targetModelRotRef.current.y += delta;
  };

  const handleRotateX = (delta: number) => {
    targetModelRotRef.current.x += delta;
  };

  const handleRotateZ = (delta: number) => {
    targetModelRotRef.current.z += delta;
  };

  // Reset 3D Model orientation, position & scale to baseline
  const handleResetModel = () => {
    targetModelRotRef.current = { x: 0, y: 0, z: 0 };
    targetModelPosRef.current = { x: 0, y: 0 };
    targetModelScaleRef.current = 1.0;
  };

  useEffect(() => {
    selectedElementIdRef.current = selectedElementId || null;
  }, [selectedElementId]);

  useEffect(() => {
    onSelectElementRef.current = onSelectElement;
    onUpdateScreenPosRef.current = onUpdateScreenPos;
  }, [onSelectElement, onUpdateScreenPos]);

  // Groups for progressive reveal mapping
  const starfieldPointsRef = useRef<THREE.Points | null>(null);
  const glyphPlanesGroupRef = useRef<THREE.Group | null>(null);
  const formulaCardsGroupRef = useRef<THREE.Group | null>(null);
  const tesseractLinesRef = useRef<THREE.LineSegments | null>(null);
  const auxiliaryGeoGroupRef = useRef<THREE.Group | null>(null);
  const neuralNetworkGroupRef = useRef<THREE.Group | null>(null);
  const neuralLineSegmentsRef = useRef<THREE.LineSegments | null>(null);
  const neuralNodesPointsRef = useRef<THREE.Points | null>(null);
  const binaryColumnsGroupRef = useRef<THREE.Group | null>(null);

  // Mouse parallax coordinates
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // Current scroll progress ref for requestAnimationFrame loop
  const scrollProgressRef = useRef(scrollProgress);
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  // Handle subtle mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseRef.current.targetX = (e.clientX - halfW) / halfW;
      mouseRef.current.targetY = (e.clientY - halfH) / halfH;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null; // Transparent to allow cinematic Flow background video underneath
    scene.fog = new THREE.FogExp2(0x000000, 0.0012);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(54, width / height, 1, 3500);
    camera.position.set(0, 0, 750);
    cameraRef.current = camera;

    // 3. Renderer with high performance and sharpness
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // -------------------------------------------------------------------------
    // LAYER 1: 3D Quantum Starfield / Deep Data Points
    // -------------------------------------------------------------------------
    const particleCount = 2200;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 2200;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 1600;
      particlePositions[i * 3 + 2] = -Math.random() * 2600 + 400;
      particleScales[i] = Math.random() * 3.5 + 1.2;
    }

    const starfieldGeo = new THREE.BufferGeometry();
    starfieldGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    starfieldGeo.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

    // Particle circular glow texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(74, 222, 128, 0.9)');
      grad.addColorStop(0.7, 'rgba(34, 197, 94, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(pCanvas);

    const starfieldMat = new THREE.PointsMaterial({
      size: 6.5,
      map: particleTexture,
      transparent: true,
      opacity: 0, // Starts 0 on pure black opening
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0x86efac,
    });

    const starfieldPoints = new THREE.Points(starfieldGeo, starfieldMat);
    scene.add(starfieldPoints);
    starfieldPointsRef.current = starfieldPoints;

    // -------------------------------------------------------------------------
    // LAYER 2: Fragmented Mathematical Symbols (Floating Glyphs in 3D Space)
    // -------------------------------------------------------------------------
    const glyphPlanesGroup = new THREE.Group();
    glyphPlanesGroupRef.current = glyphPlanesGroup;
    scene.add(glyphPlanesGroup);

    const glyphSets = [
      ['∫', '∂', '∇', '∑', 'ħ', 'Ψ', 'λ', '∞', '∮'],
      ['⊗', '⊕', '√', 'π', 'σ', 'Δ', 'Ω', 'μ', '≡'],
      ['∀', '∃', '⊂', '∈', 'ℱ', 'Ĥ', 'ℒ', 'δ', 'θ'],
    ];

    glyphSets.forEach((set, setIdx) => {
      const texture = createGlyphCloudTexture(set);
      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const geo = new THREE.PlaneGeometry(160, 160);

      for (let k = 0; k < 3; k++) {
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
          (Math.random() - 0.5) * 1100,
          (Math.random() - 0.5) * 750,
          -200 - (setIdx * 3 + k) * 180
        );
        mesh.rotation.z = (Math.random() - 0.5) * 0.4;
        mesh.userData = {
          elementId: 'symbolic-glyphs',
          type: 'symbol',
          title: 'OPERATOR GLYPHS',
        };
        glyphPlanesGroup.add(mesh);
        interactiveObjectsRef.current.push(mesh);
      }
    });

    // -------------------------------------------------------------------------
    // LAYER 3: 12 Floating Mathematical Formulation Cards in Deep Space
    // -------------------------------------------------------------------------
    const formulaCardsGroup = new THREE.Group();
    formulaCardsGroupRef.current = formulaCardsGroup;
    scene.add(formulaCardsGroup);

    const cardGeo = new THREE.PlaneGeometry(180, 74);
    const cardPositions = [
      { x: -320, y: 140, z: -100 },
      { x: 310, y: 120, z: -220 },
      { x: -340, y: -130, z: -340 },
      { x: 330, y: -140, z: -460 },
      { x: -280, y: 160, z: -580 },
      { x: 290, y: 170, z: -700 },
      { x: -330, y: -110, z: -820 },
      { x: 320, y: -100, z: -940 },
      { x: -300, y: 150, z: -1060 },
      { x: 280, y: 130, z: -1180 },
      { x: -320, y: -150, z: -1300 },
      { x: 310, y: -130, z: -1420 },
    ];

    MATHEMATICAL_FORMULAS.forEach((data, index) => {
      const texture = createFormulaTexture(data);
      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      const cardMesh = new THREE.Mesh(cardGeo, mat);
      const pos = cardPositions[index % cardPositions.length];
      cardMesh.position.set(pos.x, pos.y, pos.z);
      cardMesh.rotation.y = pos.x < 0 ? 0.14 : -0.14;

      // Tag element for exploration system
      const elemId = FORMULA_ELEMENT_IDS[index % FORMULA_ELEMENT_IDS.length];
      cardMesh.userData = {
        elementId: elemId,
        type: 'equation',
        index,
        title: data.title,
      };

      formulaCardsGroup.add(cardMesh);
      interactiveObjectsRef.current.push(cardMesh);
    });

    // -------------------------------------------------------------------------
    // LAYER 4: Interactive 3D Cybernetic Cubic Box & 4D Tesseract Model
    // -------------------------------------------------------------------------
    const cubicBoxGroup = new THREE.Group();
    cubicBoxGroup.position.set(0, 0, -320);
    scene.add(cubicBoxGroup);
    cubicBoxGroupRef.current = cubicBoxGroup;
    cubicBoxMaterialsRef.current = [];

    // Outer 3D Cube with 6 procedural cybernetic face panels
    const faceConfigs = [
      { name: 'TENSOR FIELD +X', glyph: 'G_μν', eq: 'G_μν + Λg_μν = 8πT_μν' },
      { name: 'WAVE MECHANICS -X', glyph: 'Ψ', eq: 'iħ ∂Ψ/∂t = ĤΨ' },
      { name: 'TOPOLOGICAL METRIC +Y', glyph: 'd²=0', eq: 'd(α ∧ β) = dα ∧ β' },
      { name: 'ENTROPY CELL -Y', glyph: 'H(X)', eq: '-∑ p(x) log₂(p(x))' },
      { name: '4D HYPERCUBE +Z', glyph: 'ℝ⁴', eq: '[-1, 1]⁴ ⊂ ℝ⁴' },
      { name: 'SUBSTRATE BASIS -Z', glyph: 'ħ', eq: 'Δx Δp ≥ ħ/2' },
    ];
    const outerBoxGeo = new THREE.BoxGeometry(165, 165, 165);
    const outerCubeMats = faceConfigs.map((cfg) => {
      const tex = createCubicBoxFaceTexture(cfg.name, cfg.glyph, cfg.eq);
      const m = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      m.userData = { baseAlpha: 0.85 };
      cubicBoxMaterialsRef.current.push(m);
      return m;
    });
    const outerCubeMesh = new THREE.Mesh(outerBoxGeo, outerCubeMats);
    cubicBoxGroup.add(outerCubeMesh);

    // Outer Wireframe Edges
    const outerEdgesGeo = new THREE.EdgesGeometry(outerBoxGeo);
    const outerEdgesMat = new THREE.LineBasicMaterial({
      color: 0x4ade80,
      transparent: true,
      opacity: 0,
      linewidth: 2,
      blending: THREE.AdditiveBlending,
    });
    outerEdgesMat.userData = { baseAlpha: 0.95 };
    cubicBoxMaterialsRef.current.push(outerEdgesMat);
    const outerEdges = new THREE.LineSegments(outerEdgesGeo, outerEdgesMat);
    cubicBoxGroup.add(outerEdges);

    // 8 Glowing Octahedral Corner Vertex Nodes
    const cornerNodesGroup = new THREE.Group();
    const cornerMat = new THREE.MeshBasicMaterial({
      color: 0x86efac,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    cornerMat.userData = { baseAlpha: 1.0 };
    cubicBoxMaterialsRef.current.push(cornerMat);
    const cornerGeo = new THREE.OctahedronGeometry(6.5, 0);
    const halfSize = 82.5;
    for (const cx of [-halfSize, halfSize]) {
      for (const cy of [-halfSize, halfSize]) {
        for (const cz of [-halfSize, halfSize]) {
          const node = new THREE.Mesh(cornerGeo, cornerMat);
          node.position.set(cx, cy, cz);
          cornerNodesGroup.add(node);
        }
      }
    }
    cubicBoxGroup.add(cornerNodesGroup);

    // Inner Concentric 3D Cube (Counter-rotating nested structure)
    const innerCubeGroup = new THREE.Group();
    innerCubeGroupRef.current = innerCubeGroup;
    cubicBoxGroup.add(innerCubeGroup);

    const innerBoxGeo = new THREE.BoxGeometry(92, 92, 92);
    const innerEdgesGeo = new THREE.EdgesGeometry(innerBoxGeo);
    const innerEdgesMat = new THREE.LineBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      linewidth: 1.5,
    });
    innerEdgesMat.userData = { baseAlpha: 0.85 };
    cubicBoxMaterialsRef.current.push(innerEdgesMat);
    const innerEdges = new THREE.LineSegments(innerEdgesGeo, innerEdgesMat);
    innerCubeGroup.add(innerEdges);

    const innerFaceMat = new THREE.MeshBasicMaterial({
      color: 0x14532d,
      transparent: true,
      opacity: 0,
      wireframe: true,
      blending: THREE.AdditiveBlending,
    });
    innerFaceMat.userData = { baseAlpha: 0.45 };
    cubicBoxMaterialsRef.current.push(innerFaceMat);
    const innerFaceMesh = new THREE.Mesh(innerBoxGeo, innerFaceMat);
    innerCubeGroup.add(innerFaceMesh);

    // 4D Tesseract Dynamic Struts
    const tesseractLineGeo = new THREE.BufferGeometry();
    const tesseractPositions = new Float32Array(TESSERACT_EDGES.length * 2 * 3);
    tesseractLineGeo.setAttribute('position', new THREE.BufferAttribute(tesseractPositions, 3));

    const tesseractMat = new THREE.LineBasicMaterial({
      color: 0x86efac,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      linewidth: 2,
    });
    tesseractMat.userData = { baseAlpha: 0.9 };
    cubicBoxMaterialsRef.current.push(tesseractMat);

    const tesseractLines = new THREE.LineSegments(tesseractLineGeo, tesseractMat);
    cubicBoxGroup.add(tesseractLines);
    tesseractLinesRef.current = tesseractLines;

    // Central Quantum Singularity Core
    const coreGeo = new THREE.IcosahedronGeometry(22, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x4ade80,
      wireframe: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    coreMat.userData = { baseAlpha: 1.0 };
    cubicBoxMaterialsRef.current.push(coreMat);
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    cubicBoxGroup.add(coreMesh);
    coreMeshRef.current = coreMesh;

    // Orbital Gimbal Coordinate Rings
    const ringMat = new THREE.LineBasicMaterial({
      color: 0x4ade80,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    ringMat.userData = { baseAlpha: 0.5 };
    cubicBoxMaterialsRef.current.push(ringMat);

    const ringGeoH = new THREE.TorusGeometry(132, 1.2, 16, 64);
    const ringH = new THREE.Mesh(ringGeoH, ringMat);
    ringH.rotation.x = Math.PI / 2;
    cubicBoxGroup.add(ringH);
    gimbalHorizontalRef.current = ringH;

    const ringGeoV = new THREE.TorusGeometry(138, 1.2, 16, 64);
    const ringV = new THREE.Mesh(ringGeoV, ringMat);
    cubicBoxGroup.add(ringV);
    gimbalVerticalRef.current = ringV;

    // Volumetric hit detection volume for drag manipulation & inspection
    const tesseractHitGeo = new THREE.BoxGeometry(220, 220, 220);
    const tesseractHitMat = new THREE.MeshBasicMaterial({ visible: false });
    const tesseractHitMesh = new THREE.Mesh(tesseractHitGeo, tesseractHitMat);
    tesseractHitMesh.userData = {
      elementId: 'tesseract-4d',
      isCubicModel: true,
      type: 'structure',
      title: '4D HYPERCUBE TESSERACT',
    };
    cubicBoxGroup.add(tesseractHitMesh);
    interactiveObjectsRef.current.push(tesseractHitMesh);

    // Auxiliary Geometric Elements (Rotating Icosahedron wireframes at depth)
    const auxGeoGroup = new THREE.Group();
    auxiliaryGeoGroupRef.current = auxGeoGroup;
    scene.add(auxGeoGroup);

    const icoGeo1 = new THREE.IcosahedronGeometry(75, 1);
    const icoMat1 = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      wireframe: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const icoMesh1 = new THREE.Mesh(icoGeo1, icoMat1);
    icoMesh1.position.set(-340, 0, -650);
    icoMesh1.userData = {
      elementId: 'icosahedron-lattice',
      type: 'geometry',
      title: 'ICOSAHEDRAL LATTICE',
    };
    auxGeoGroup.add(icoMesh1);
    interactiveObjectsRef.current.push(icoMesh1);

    const icoGeo2 = new THREE.OctahedronGeometry(90, 1);
    const icoMat2 = new THREE.MeshBasicMaterial({
      color: 0x86efac,
      wireframe: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const icoMesh2 = new THREE.Mesh(icoGeo2, icoMat2);
    icoMesh2.position.set(340, -40, -850);
    icoMesh2.userData = {
      elementId: 'octahedron-frame',
      type: 'geometry',
      title: 'OCTAHEDRAL FRAME',
    };
    auxGeoGroup.add(icoMesh2);
    interactiveObjectsRef.current.push(icoMesh2);

    // Coordinate Grid Planes (Floor and Ceiling infinite grids)
    const gridHelper = new THREE.GridHelper(2400, 48, 0x22c55e, 0x14532d);
    gridHelper.position.set(0, -380, -900);
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0;
    auxGeoGroup.add(gridHelper);

    // -------------------------------------------------------------------------
    // LAYER 5: Neural Data Filaments & Synaptic Node Vectors
    // -------------------------------------------------------------------------
    const neuralNetworkGroup = new THREE.Group();
    neuralNetworkGroupRef.current = neuralNetworkGroup;
    scene.add(neuralNetworkGroup);

    const nodeCount = 48;
    const nodeCoords: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodeCoords.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 800,
          (Math.random() - 0.5) * 550,
          -Math.random() * 1600 + 100
        )
      );
    }

    const filamentSegments: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      // Connect to closest 3 neighbors to form organic neural lattice
      const distances: { index: number; dist: number }[] = [];
      for (let j = 0; j < nodeCount; j++) {
        if (i === j) continue;
        distances.push({ index: j, dist: nodeCoords[i].distanceTo(nodeCoords[j]) });
      }
      distances.sort((a, b) => a.dist - b.dist);
      for (let k = 0; k < 3; k++) {
        const neighborIdx = distances[k].index;
        filamentSegments.push(
          nodeCoords[i].x,
          nodeCoords[i].y,
          nodeCoords[i].z,
          nodeCoords[neighborIdx].x,
          nodeCoords[neighborIdx].y,
          nodeCoords[neighborIdx].z
        );
      }
    }

    const neuralLineGeo = new THREE.BufferGeometry();
    neuralLineGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(filamentSegments, 3)
    );
    const neuralLineMat = new THREE.LineBasicMaterial({
      color: 0x4ade80,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const neuralLines = new THREE.LineSegments(neuralLineGeo, neuralLineMat);
    neuralNetworkGroup.add(neuralLines);
    neuralLineSegmentsRef.current = neuralLines;

    // Glowing Node Points
    const nodePointGeo = new THREE.BufferGeometry();
    const nodePointsPos: number[] = [];
    nodeCoords.forEach((v) => nodePointsPos.push(v.x, v.y, v.z));
    nodePointGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(nodePointsPos, 3)
    );
    const nodePointMat = new THREE.PointsMaterial({
      size: 9.0,
      map: particleTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      color: 0xffffff,
    });
    const nodePoints = new THREE.Points(nodePointGeo, nodePointMat);
    neuralNetworkGroup.add(nodePoints);
    neuralNodesPointsRef.current = nodePoints;

    // Invisible hit volume for neural network cluster
    const neuralHitGeo = new THREE.SphereGeometry(320, 8, 8);
    const neuralHitMat = new THREE.MeshBasicMaterial({ visible: false });
    const neuralHitMesh = new THREE.Mesh(neuralHitGeo, neuralHitMat);
    neuralHitMesh.position.set(0, 0, -650);
    neuralHitMesh.userData = {
      elementId: 'neural-lattice',
      type: 'neural',
      title: 'SYNAPTIC NEURAL CLUSTER',
    };
    scene.add(neuralHitMesh);
    interactiveObjectsRef.current.push(neuralHitMesh);

    // -------------------------------------------------------------------------
    // LAYER 6: 3D Binary Data Columns (Deep Distance)
    // -------------------------------------------------------------------------
    const binaryGroup = new THREE.Group();
    binaryColumnsGroupRef.current = binaryGroup;
    scene.add(binaryGroup);

    // Create 3D binary rain texture
    const bCanvas = document.createElement('canvas');
    bCanvas.width = 128;
    bCanvas.height = 1024;
    const bCtx = bCanvas.getContext('2d');
    if (bCtx) {
      bCtx.fillStyle = 'rgba(0, 0, 0, 0)';
      bCtx.fillRect(0, 0, 128, 1024);
      bCtx.font = '600 22px "Share Tech Mono", monospace';
      bCtx.textAlign = 'center';
      for (let y = 30; y < 1024; y += 28) {
        const bin = Math.random() > 0.5 ? '1' : '0';
        bCtx.fillStyle = Math.random() > 0.8 ? '#ffffff' : '#22c55e';
        bCtx.fillText(bin, 64, y);
      }
    }
    const binaryTex = new THREE.CanvasTexture(bCanvas);

    for (let c = 0; c < 16; c++) {
      const bMat = new THREE.MeshBasicMaterial({
        map: binaryTex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const bMesh = new THREE.Mesh(new THREE.PlaneGeometry(36, 450), bMat);
      bMesh.position.set(
        (c - 8) * 110 + (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 200,
        -1000 - Math.random() * 800
      );
      bMesh.userData = {
        elementId: 'binary-cascade',
        type: 'stream',
        title: 'BINARY DATA RAIN',
      };
      binaryGroup.add(bMesh);
      interactiveObjectsRef.current.push(bMesh);
    }

    // -------------------------------------------------------------------------
    // Animation & Scroll Render Loop (NO AUTOPLAY, PURE SCROLL MAPPING)
    // -------------------------------------------------------------------------
    let lastRenderTime = 0;

    const renderLoop = (now: number) => {
      animFrameIdRef.current = requestAnimationFrame(renderLoop);

      // Smooth mouse parallax lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const p = scrollProgressRef.current; // 0.0 to 1.0

      // -----------------------------------------------------------------------
      // SCROLL-DRIVEN PROGRESSION SCHEDULE:
      // 0% -> Pure Black
      // 10% -> First tiny particles / data traces begin appearing
      // 20% -> Mathematical fragments begin appearing
      // 35% -> Binary / data streams emerge
      // 50% -> Larger mathematical structures reveal (tesseract, geometry)
      // 65% -> Neural / data filaments become visible
      // 80% -> Complete DEEP environment established
      // 100% -> Transition prepares for next layer
      // -----------------------------------------------------------------------

      // 1. Starfield Particles Opacity
      let starfieldAlpha = 0;
      if (p >= 0.06 && p < 0.20) {
        starfieldAlpha = (p - 0.06) / 0.14; // 0.0 to 1.0
      } else if (p >= 0.20) {
        starfieldAlpha = 1.0;
      }
      if (starfieldPointsRef.current) {
        (starfieldPointsRef.current.material as THREE.PointsMaterial).opacity =
          starfieldAlpha * 0.85;
      }

      // 2. Mathematical Fragment Glyphs Opacity
      let glyphAlpha = 0;
      if (p >= 0.16 && p < 0.35) {
        glyphAlpha = (p - 0.16) / 0.19;
      } else if (p >= 0.35 && p <= 0.88) {
        glyphAlpha = 1.0;
      } else if (p > 0.88) {
        glyphAlpha = Math.max(0, 1 - (p - 0.88) / 0.12);
      }
      if (glyphPlanesGroupRef.current) {
        glyphPlanesGroupRef.current.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            (child.material as THREE.MeshBasicMaterial).opacity = glyphAlpha * 0.75;
          }
        });
      }

      // 3. Binary Columns Opacity
      let binaryAlpha = 0;
      if (p >= 0.26 && p < 0.44) {
        binaryAlpha = (p - 0.26) / 0.18;
      } else if (p >= 0.44 && p <= 0.88) {
        binaryAlpha = 1.0;
      } else if (p > 0.88) {
        binaryAlpha = Math.max(0, 1 - (p - 0.88) / 0.12);
      }
      if (binaryColumnsGroupRef.current) {
        binaryColumnsGroupRef.current.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            (child.material as THREE.MeshBasicMaterial).opacity = binaryAlpha * 0.5;
          }
        });
      }

      // 4. Mathematical Equation Formulation Cards Opacity
      let cardAlpha = 0;
      if (p >= 0.32 && p < 0.52) {
        cardAlpha = (p - 0.32) / 0.20;
      } else if (p >= 0.52 && p <= 0.90) {
        cardAlpha = 1.0;
      } else if (p > 0.90) {
        cardAlpha = Math.max(0, 1 - (p - 0.90) / 0.10);
      }
      if (formulaCardsGroupRef.current) {
        formulaCardsGroupRef.current.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            (child.material as THREE.MeshBasicMaterial).opacity = cardAlpha * 0.95;
          }
        });
      }

      // 5. 3D Cubic Model & 4D Tesseract Dynamic Rotation, Opacity & User Manipulation
      let tesseractAlpha = 0;
      if (p >= 0.35 && p < 0.55) {
        tesseractAlpha = (p - 0.35) / 0.20;
      } else if (p >= 0.55 && p <= 0.88) {
        tesseractAlpha = 1.0;
      } else if (p > 0.88) {
        // Dematerializes cleanly into photonic singularity particles before white flash
        tesseractAlpha = Math.max(0, 1 - (p - 0.88) / 0.04);
      }

      // Smooth lerp user interactive rotation, translation and scale targets
      modelRotRef.current.x += (targetModelRotRef.current.x - modelRotRef.current.x) * 0.14;
      modelRotRef.current.y += (targetModelRotRef.current.y - modelRotRef.current.y) * 0.14;
      modelRotRef.current.z += (targetModelRotRef.current.z - modelRotRef.current.z) * 0.14;
      modelPosRef.current.x += (targetModelPosRef.current.x - modelPosRef.current.x) * 0.14;
      modelPosRef.current.y += (targetModelPosRef.current.y - modelPosRef.current.y) * 0.14;
      modelScaleRef.current += (targetModelScaleRef.current - modelScaleRef.current) * 0.16;

      // Throttled live telemetry state update for HUD
      if (now - lastTelemetryUpdateRef.current > 120) {
        lastTelemetryUpdateRef.current = now;
        setModelTelemetry({
          rotX: modelRotRef.current.x,
          rotY: modelRotRef.current.y,
          rotZ: modelRotRef.current.z,
          posX: modelPosRef.current.x,
          posY: modelPosRef.current.y,
          scale: modelScaleRef.current,
        });
      }

      if (cubicBoxGroupRef.current) {
        // Base procedural rotation from scroll progression
        const autoRotY = p * Math.PI * 2.2;
        const autoRotX = Math.sin(p * Math.PI * 1.4) * 0.35;

        // Position: Maintain constant optimal distance of 460 units in front of the camera
        // This ensures the 3D cubic model is NEVER over-magnified, NEVER fills the screen, and NEVER obstructs scrolling
        const currentCamZ = cameraRef.current ? cameraRef.current.position.z : 650;
        const targetBoxZ = currentCamZ - 460;

        cubicBoxGroupRef.current.position.set(
          modelPosRef.current.x,
          modelPosRef.current.y,
          targetBoxZ
        );

        // Rotation: Scroll auto-rotation + User interactive rotation
        cubicBoxGroupRef.current.rotation.set(
          autoRotX + modelRotRef.current.x,
          autoRotY + modelRotRef.current.y,
          modelRotRef.current.z
        );

        // Responsive Zoom/Scale: user scale multiplied by subtle hover/select feedback
        const isHovered = hoveredElementIdRef.current === 'tesseract-4d';
        const isSelected = selectedElementIdRef.current === 'tesseract-4d';
        const hoverBonus = isSelected ? 1.08 : isHovered ? 1.04 : 1.0;
        const finalScale = modelScaleRef.current * hoverBonus;
        cubicBoxGroupRef.current.scale.set(finalScale, finalScale, finalScale);

        // Fade all materials in cubic box group
        cubicBoxMaterialsRef.current.forEach((mat) => {
          mat.opacity = tesseractAlpha * (((mat.userData?.baseAlpha as number | undefined) ?? 0.85));
        });

        // 4D projected rotation inside hypercube struts
        if (tesseractLinesRef.current) {
          const angleXW = p * Math.PI * 4 + modelRotRef.current.x * 0.4;
          const angleZW = p * Math.PI * 2.5 + modelRotRef.current.y * 0.4;

          const cosXW = Math.cos(angleXW);
          const sinXW = Math.sin(angleXW);
          const cosZW = Math.cos(angleZW);
          const sinZW = Math.sin(angleZW);

          const posAttr = tesseractLinesRef.current.geometry.attributes
            .position as THREE.BufferAttribute;
          const posArray = posAttr.array as Float32Array;

          let ptr = 0;
          const scale = 105;
          const distance4D = 2.8;

          for (let e = 0; e < TESSERACT_EDGES.length; e++) {
            const [idxA, idxB] = TESSERACT_EDGES[e];
            const vA = TESSERACT_VERTICES_4D[idxA];
            const vB = TESSERACT_VERTICES_4D[idxB];

            [vA, vB].forEach(([x, y, z, w]) => {
              const x1 = x * cosXW - w * sinXW;
              const w1 = x * sinXW + w * cosXW;
              const z1 = z * cosZW - w1 * sinZW;
              const w2 = z * sinZW + w1 * cosZW;

              const projFactor = 1 / (distance4D - w2);
              posArray[ptr++] = x1 * projFactor * scale;
              posArray[ptr++] = y * projFactor * scale;
              posArray[ptr++] = z1 * projFactor * scale;
            });
          }
          posAttr.needsUpdate = true;
        }

        // Inner nested cube counter-rotation
        if (innerCubeGroupRef.current) {
          innerCubeGroupRef.current.rotation.y = -autoRotY * 0.6 - modelRotRef.current.y * 0.5;
          innerCubeGroupRef.current.rotation.x = -autoRotX * 0.6 - modelRotRef.current.x * 0.5;
        }

        // Quantum core rotation & pulsation
        if (coreMeshRef.current) {
          coreMeshRef.current.rotation.y = now * 0.002;
          coreMeshRef.current.rotation.z = now * 0.0015;
          const pulse = 1 + Math.sin(now * 0.005) * 0.12;
          coreMeshRef.current.scale.set(pulse, pulse, pulse);
        }

        // Orbital gimbal rings rotation
        if (gimbalHorizontalRef.current) {
          gimbalHorizontalRef.current.rotation.z = now * 0.0006;
        }
        if (gimbalVerticalRef.current) {
          gimbalVerticalRef.current.rotation.x = now * 0.0008;
        }
      }

      if (auxiliaryGeoGroupRef.current) {
        auxiliaryGeoGroupRef.current.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            (child.material as THREE.MeshBasicMaterial).opacity = tesseractAlpha * 0.7;
            child.rotation.x = p * Math.PI * 1.5;
            child.rotation.y = p * Math.PI * 2.0;
          } else if (child instanceof THREE.GridHelper) {
            (child.material as THREE.Material).opacity = tesseractAlpha * 0.25;
          }
        });
      }

      // 6. Neural Data Filaments & Synaptic Connections Opacity
      let neuralAlpha = 0;
      if (p >= 0.54 && p < 0.74) {
        neuralAlpha = (p - 0.54) / 0.20;
      } else if (p >= 0.74) {
        neuralAlpha = 1.0;
      }
      if (neuralLineSegmentsRef.current) {
        (neuralLineSegmentsRef.current.material as THREE.LineBasicMaterial).opacity =
          neuralAlpha * 0.75;
      }
      if (neuralNodesPointsRef.current) {
        (neuralNodesPointsRef.current.material as THREE.PointsMaterial).opacity =
          neuralAlpha * 0.95;
      }

      // 7. Dynamic Camera Fly-through mapped to Scroll Progress
      if (cameraRef.current) {
        // Starts at Z=650, glides forward smoothly to Z=-400 as user scrolls
        const targetZ = 650 - p * 1050;
        cameraRef.current.position.z = targetZ;

        // Subtle lateral camera sweep and mouse parallax
        const lateralSweep = Math.sin(p * Math.PI * 1.5) * 60;
        const verticalSweep = Math.cos(p * Math.PI * 1.2) * 35;
        cameraRef.current.position.x = lateralSweep + mouseRef.current.x * 40;
        cameraRef.current.position.y = verticalSweep - mouseRef.current.y * 30;

        // Subtle camera tilt
        cameraRef.current.rotation.z = Math.sin(p * Math.PI) * 0.03;
      }

      // 8. Atmospheric Fog modulation
      if (sceneRef.current && sceneRef.current.fog) {
        // Fog density stays optimal for continuous depth perception
        (sceneRef.current.fog as THREE.FogExp2).density = 0.0012 + (1 - starfieldAlpha) * 0.002;
      }

      // 9. Interactive Element Highlight Lerping
      if (formulaCardsGroupRef.current) {
        formulaCardsGroupRef.current.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            const isSelected = child.userData?.elementId === selectedElementIdRef.current;
            const isHovered = child.userData?.elementId === hoveredElementIdRef.current;
            const targetScale = isSelected ? 1.16 : isHovered ? 1.08 : 1.0;
            child.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
          }
        });
      }

      // 10. Live Real-Time Screen Position Tracking of Selected Element
      if (selectedElementIdRef.current && cameraRef.current) {
        const targetObj = interactiveObjectsRef.current.find(
          (o) => o.userData?.elementId === selectedElementIdRef.current
        );
        if (targetObj) {
          const worldPos = new THREE.Vector3();
          targetObj.getWorldPosition(worldPos);
          worldPos.project(cameraRef.current);
          if (worldPos.z < 1.0) {
            const screenX = (worldPos.x * 0.5 + 0.5) * window.innerWidth;
            const screenY = (-worldPos.y * 0.5 + 0.5) * window.innerHeight;
            onUpdateScreenPosRef.current?.({ x: screenX, y: screenY });
          }
        }
      }

      // Render scene
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      lastRenderTime = now;
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    // -------------------------------------------------------------------------
    // Raycasting & User Selection Handlers (Desktop click/hover & Mobile tap)
    // -------------------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const pointerVec = new THREE.Vector2();
    let pointerDownCoord = { x: 0, y: 0 };
    let lastPointerCoord = { x: 0, y: 0 };
    let dragDistance = 0;

    // Multi-touch tracking for 2-finger twist rotation, 3D orbit, and pinch zoom
    const activePointers = new Map<number, { x: number; y: number }>();
    let initialPinchDistance = 0;
    let initialPinchScale = 1.0;
    let lastPinchAngle = 0;
    let lastPinchCenter = { x: 0, y: 0 };

    const checkIntersection = (clientX: number, clientY: number) => {
      if (!cameraRef.current || !rendererRef.current) return null;
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      pointerVec.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerVec.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointerVec, cameraRef.current);
      const hits = raycaster.intersectObjects(interactiveObjectsRef.current, false);

      for (let i = 0; i < hits.length; i++) {
        const obj = hits[i].object;
        if (obj.userData?.elementId) {
          return { hit: hits[i], object: obj, elementId: obj.userData.elementId as string };
        }
      }
      return null;
    };

    const domEl = renderer.domElement;

    const onPointerDown = (e: PointerEvent) => {
      if (scrollProgressRef.current >= 0.91) return;

      pointerDownCoord = { x: e.clientX, y: e.clientY };
      lastPointerCoord = { x: e.clientX, y: e.clientY };
      dragDistance = 0;

      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // Handle 2-finger multi-touch gestures (Twist for roll rotation, Drag for pitch/yaw rotation, Pinch for zoom)
      if (activePointers.size === 2) {
        const coords = Array.from(activePointers.values());
        const p1 = coords[0];
        const p2 = coords[1];
        initialPinchDistance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        initialPinchScale = targetModelScaleRef.current;
        lastPinchAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        lastPinchCenter = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

        isPointerDownOnModelRef.current = true;
        isDraggingModelRef.current = true;
        setIsInteractingModel(true);
        domEl.style.touchAction = 'none';
        return;
      }

      const match = checkIntersection(e.clientX, e.clientY);
      if (match && (match.object.userData?.isCubicModel || match.elementId === 'tesseract-4d')) {
        isPointerDownOnModelRef.current = true;
        isDraggingModelRef.current = false;

        // When interacting with the 3D model via finger touch, prevent browser scroll stealing
        if (e.pointerType === 'touch') {
          domEl.style.touchAction = 'none';
          try {
            domEl.setPointerCapture(e.pointerId);
          } catch {}
        }

        if (e.shiftKey || e.button === 2) {
          activeDragModeRef.current = 'move';
        } else if (e.altKey) {
          activeDragModeRef.current = 'zoom';
        } else {
          activeDragModeRef.current = dragModeRef.current;
        }

        domEl.style.cursor = activeDragModeRef.current === 'zoom' ? 'ns-resize' : 'grab';
      } else {
        isPointerDownOnModelRef.current = false;
        isDraggingModelRef.current = false;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (scrollProgressRef.current >= 0.91) return;

      if (activePointers.has(e.pointerId)) {
        activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }

      // Handle active 2-finger multi-touch gestures (Twist / Roll, Orbit / Pitch & Yaw, Pinch Zoom)
      if (activePointers.size === 2 && initialPinchDistance > 10) {
        const coords = Array.from(activePointers.values());
        const p1 = coords[0];
        const p2 = coords[1];

        // 1. Two-finger twist: angular rotation around Z-axis (roll)
        const currentAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        let deltaAngle = currentAngle - lastPinchAngle;
        if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
        if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;
        targetModelRotRef.current.z += deltaAngle * 1.35;
        lastPinchAngle = currentAngle;

        // 2. Two-finger center movement: 3D rotation in X/Y or translation
        const currentCenter = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        const centerDx = currentCenter.x - lastPinchCenter.x;
        const centerDy = currentCenter.y - lastPinchCenter.y;
        if (activeDragModeRef.current === 'move') {
          targetModelPosRef.current.x = Math.max(-380, Math.min(380, targetModelPosRef.current.x + centerDx * 0.85));
          targetModelPosRef.current.y = Math.max(-260, Math.min(260, targetModelPosRef.current.y - centerDy * 0.85));
        } else {
          // Direct 3D rotation with 2 fingers
          targetModelRotRef.current.y += centerDx * 0.013;
          targetModelRotRef.current.x += centerDy * 0.013;
        }
        lastPinchCenter = currentCenter;

        // 3. Two-finger pinch: scale/zoom
        const currentDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const pinchRatio = currentDist / initialPinchDistance;
        targetModelScaleRef.current = Math.max(0.4, Math.min(2.5, initialPinchScale * pinchRatio));

        setIsInteractingModel(true);
        return;
      }

      if (isPointerDownOnModelRef.current) {
        const dx = e.clientX - lastPointerCoord.x;
        const dy = e.clientY - lastPointerCoord.y;
        dragDistance += Math.hypot(dx, dy);

        // Lower threshold for finger touch responsiveness
        const dragThreshold = e.pointerType === 'touch' ? 3 : 5;
        if (dragDistance > dragThreshold) {
          isDraggingModelRef.current = true;
          setIsInteractingModel(true);

          if (activeDragModeRef.current === 'move') {
            domEl.style.cursor = 'grabbing';
            targetModelPosRef.current.x = Math.max(-380, Math.min(380, targetModelPosRef.current.x + dx * 0.85));
            targetModelPosRef.current.y = Math.max(-260, Math.min(260, targetModelPosRef.current.y - dy * 0.85));
          } else if (activeDragModeRef.current === 'zoom') {
            domEl.style.cursor = 'ns-resize';
            // Dragging up increases scale, dragging down decreases scale
            targetModelScaleRef.current = Math.max(
              0.4,
              Math.min(2.5, targetModelScaleRef.current - dy * 0.007)
            );
          } else {
            domEl.style.cursor = 'grabbing';
            // Finger touch rotates 3D model across horizontal (Y) and vertical (X) axes
            targetModelRotRef.current.y += dx * 0.014;
            targetModelRotRef.current.x += dy * 0.014;
          }
        }
        lastPointerCoord = { x: e.clientX, y: e.clientY };
        return;
      }

      // Hover feedback when not dragging
      if (e.pointerType === 'touch') return;
      const match = checkIntersection(e.clientX, e.clientY);
      if (match) {
        hoveredElementIdRef.current = match.elementId;
        if (match.object.userData?.isCubicModel || match.elementId === 'tesseract-4d') {
          domEl.style.cursor = dragModeRef.current === 'zoom' ? 'ns-resize' : 'grab';
        } else {
          domEl.style.cursor = 'pointer';
        }
      } else {
        hoveredElementIdRef.current = null;
        domEl.style.cursor = 'default';
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      activePointers.delete(e.pointerId);
      if (activePointers.size < 2) {
        initialPinchDistance = 0;
      }

      if (isPointerDownOnModelRef.current) {
        try {
          domEl.releasePointerCapture(e.pointerId);
        } catch {}

        if (activePointers.size === 0) {
          domEl.style.touchAction = 'pan-y';
          setIsInteractingModel(false);
          isPointerDownOnModelRef.current = false;
          isDraggingModelRef.current = false;
          domEl.style.cursor = dragModeRef.current === 'zoom' ? 'ns-resize' : 'grab';
        }
        return;
      }

      // Handle clicks on other interactive elements (equations, glyphs)
      const dist = Math.hypot(e.clientX - pointerDownCoord.x, e.clientY - pointerDownCoord.y);
      if (dist > 8) return; // Ignore drags or scrolls

      const match = checkIntersection(e.clientX, e.clientY);
      if (match) {
        const { object, elementId } = match;
        // Do not auto-open on cubic model tap to prevent interrupting scroll flow
        if (elementId === 'tesseract-4d' || object.userData?.isCubicModel) {
          return;
        }

        const worldPos = new THREE.Vector3();
        object.getWorldPosition(worldPos);

        if (cameraRef.current) {
          const projected = worldPos.clone().project(cameraRef.current);
          const screenX = (projected.x * 0.5 + 0.5) * window.innerWidth;
          const screenY = (-projected.y * 0.5 + 0.5) * window.innerHeight;
          onSelectElementRef.current?.(elementId, { x: screenX, y: screenY });
        }
      }
    };

    // Wheel zoom on model when holding modifier key or in ZOOM mode
    const onWheel = (e: WheelEvent) => {
      if (scrollProgressRef.current >= 0.91) return;

      const match = checkIntersection(e.clientX, e.clientY);
      if (match && (match.object.userData?.isCubicModel || match.elementId === 'tesseract-4d')) {
        if (e.ctrlKey || e.altKey || e.shiftKey || dragModeRef.current === 'zoom') {
          e.preventDefault();
          const zoomDelta = -Math.sign(e.deltaY) * 0.12;
          targetModelScaleRef.current = Math.max(0.4, Math.min(2.5, targetModelScaleRef.current + zoomDelta));
        }
      }
    };

    domEl.addEventListener('pointerdown', onPointerDown, { passive: true });
    domEl.addEventListener('pointerup', onPointerUp, { passive: true });
    domEl.addEventListener('pointercancel', onPointerUp, { passive: true });
    domEl.addEventListener('pointermove', onPointerMove, { passive: true });
    domEl.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });

    // Responsive window resize observer
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup when unmounting
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('pointerdown', onPointerDown);
      domEl.removeEventListener('pointerup', onPointerUp);
      domEl.removeEventListener('pointercancel', onPointerUp);
      domEl.removeEventListener('pointermove', onPointerMove);
      domEl.removeEventListener('wheel', onWheel);
      window.removeEventListener('pointercancel', onPointerUp);

      if (rendererRef.current && rendererRef.current.domElement) {
        if (rendererRef.current.domElement.parentNode) {
          rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <>
      <div
        ref={mountRef}
        id="deep-webgl-mathematical-canvas"
        className={`absolute inset-0 w-full h-full z-10 overflow-hidden bg-black ${
          scrollProgress >= 0.08 && scrollProgress < 0.92 ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{ touchAction: 'pan-y' }}
        aria-hidden="true"
      />

      {/* Cybernetic 3D Cubic Model HUD Controller & Telemetry */}
      {scrollProgress >= 0.20 && scrollProgress < 0.92 && (
        <div
          id="cubic-model-hud-controller"
          className="fixed bottom-6 sm:bottom-8 right-5 sm:right-8 z-30 pointer-events-auto flex flex-col items-end gap-2 font-matrix-mono select-none"
        >
          {/* Main Control Pill */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-black/90 border border-[#22c55e]/40 rounded-sm backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.22)]">
            <span className="px-2 py-0.5 text-[9px] tracking-[0.2em] text-[#86efac] font-bold border-r border-[#22c55e]/30 hidden md:inline">
              3D MODEL
            </span>

            {/* Mode Switcher: Rotate, Move, Zoom */}
            <div className="flex items-center bg-black/60 p-0.5 border border-neutral-800 rounded-sm">
              <button
                type="button"
                id="cubic-model-mode-rotate"
                onClick={() => {
                  setDragMode('rotate');
                  dragModeRef.current = 'rotate';
                }}
                className={`px-2 py-1 text-[9px] tracking-[0.16em] uppercase transition-all rounded-xs cursor-pointer ${
                  dragMode === 'rotate'
                    ? 'bg-[#22c55e]/30 border border-[#4ade80] text-[#86efac] shadow-[0_0_8px_rgba(74,222,128,0.3)]'
                    : 'border border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
                title="Rotate 3D Hypercube on X/Y axes"
              >
                ⟳ <span className="hidden sm:inline">ROTATE</span>
              </button>
              <button
                type="button"
                id="cubic-model-mode-move"
                onClick={() => {
                  setDragMode('move');
                  dragModeRef.current = 'move';
                }}
                className={`px-2 py-1 text-[9px] tracking-[0.16em] uppercase transition-all rounded-xs cursor-pointer ${
                  dragMode === 'move'
                    ? 'bg-[#22c55e]/30 border border-[#4ade80] text-[#86efac] shadow-[0_0_8px_rgba(74,222,128,0.3)]'
                    : 'border border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
                title="Reposition / Pan 3D Hypercube across screen"
              >
                ✥ <span className="hidden sm:inline">MOVE</span>
              </button>
              <button
                type="button"
                id="cubic-model-mode-zoom"
                onClick={() => {
                  setDragMode('zoom');
                  dragModeRef.current = 'zoom';
                }}
                className={`px-2 py-1 text-[9px] tracking-[0.16em] uppercase transition-all rounded-xs cursor-pointer ${
                  dragMode === 'zoom'
                    ? 'bg-[#22c55e]/30 border border-[#4ade80] text-[#86efac] shadow-[0_0_8px_rgba(74,222,128,0.3)]'
                    : 'border border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
                title="Zoom in/out: Drag up to expand size, drag down to shrink"
              >
                🔍 <span className="hidden sm:inline">ZOOM</span>
              </button>
            </div>

            {/* Quick Finger-Tap Rotation Buttons (Y, X, Z Roll) */}
            <div className="flex items-center gap-1 border-l border-[#22c55e]/30 pl-1.5">
              <button
                type="button"
                id="cubic-model-rot-y-ccw"
                onClick={() => handleRotateY(-Math.PI / 4)}
                className="w-6 h-6 flex items-center justify-center text-[10px] font-bold bg-black/60 hover:bg-[#22c55e]/25 border border-neutral-700 hover:border-[#4ade80] text-neutral-300 hover:text-[#86efac] transition-all rounded-xs cursor-pointer"
                title="Rotate Yaw -45° (Counter-Clockwise)"
              >
                ↶
              </button>
              <button
                type="button"
                id="cubic-model-rot-y-cw"
                onClick={() => handleRotateY(Math.PI / 4)}
                className="w-6 h-6 flex items-center justify-center text-[10px] font-bold bg-black/60 hover:bg-[#22c55e]/25 border border-neutral-700 hover:border-[#4ade80] text-neutral-300 hover:text-[#86efac] transition-all rounded-xs cursor-pointer"
                title="Rotate Yaw +45° (Clockwise)"
              >
                ↷
              </button>
              <button
                type="button"
                id="cubic-model-rot-x-step"
                onClick={() => handleRotateX(Math.PI / 4)}
                className="px-1 h-6 flex items-center justify-center text-[9px] font-bold bg-black/60 hover:bg-[#22c55e]/25 border border-neutral-700 hover:border-[#4ade80] text-neutral-300 hover:text-[#86efac] transition-all rounded-xs cursor-pointer"
                title="Rotate Pitch +45° (X-Axis)"
              >
                X↻
              </button>
              <button
                type="button"
                id="cubic-model-rot-z-step"
                onClick={() => handleRotateZ(Math.PI / 4)}
                className="px-1 h-6 flex items-center justify-center text-[9px] font-bold bg-black/60 hover:bg-[#22c55e]/25 border border-neutral-700 hover:border-[#4ade80] text-[#86efac] transition-all rounded-xs cursor-pointer"
                title="Twist Roll +45° (Z-Axis / 2-Finger Twist)"
              >
                Z↻
              </button>
            </div>

            {/* Quick Size In/Out Step Controls */}
            <div className="flex items-center gap-1 border-l border-[#22c55e]/30 pl-1.5">
              <button
                type="button"
                id="cubic-model-zoom-out-btn"
                onClick={handleZoomOut}
                className="w-6 h-6 flex items-center justify-center text-[12px] font-bold bg-black/60 hover:bg-[#22c55e]/25 border border-neutral-700 hover:border-[#4ade80] text-neutral-300 hover:text-[#86efac] transition-all rounded-xs cursor-pointer"
                title="Decrease Size / Zoom Out (−15%)"
              >
                −
              </button>

              <button
                type="button"
                id="cubic-model-zoom-indicator-btn"
                onClick={() => handleSetScale(1.0)}
                className="px-1.5 py-0.5 min-w-[46px] text-center text-[9px] font-bold tracking-[0.1em] bg-black/60 hover:bg-neutral-800 border border-neutral-700 text-[#4ade80] transition-colors rounded-xs cursor-pointer"
                title="Current Size Scale — Click to reset to 100%"
              >
                {Math.round(modelTelemetry.scale * 100)}%
              </button>

              <button
                type="button"
                id="cubic-model-zoom-in-btn"
                onClick={handleZoomIn}
                className="w-6 h-6 flex items-center justify-center text-[12px] font-bold bg-black/60 hover:bg-[#22c55e]/25 border border-neutral-700 hover:border-[#4ade80] text-neutral-300 hover:text-[#86efac] transition-all rounded-xs cursor-pointer"
                title="Increase Size / Zoom In (+15%)"
              >
                +
              </button>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              id="cubic-model-reset-btn"
              onClick={handleResetModel}
              className="px-2 py-1 text-[9px] tracking-[0.16em] uppercase bg-black/60 hover:bg-[#22c55e]/20 border border-neutral-700 hover:border-[#4ade80] text-neutral-300 hover:text-[#86efac] transition-all rounded-sm cursor-pointer ml-0.5"
              title="Reset 3D Cubic Model Position, Orientation & Size to 100%"
            >
              ⟲ RESET
            </button>

            {/* Dedicated Info / Details Button */}
            <button
              type="button"
              id="cubic-model-info-btn"
              onClick={() => {
                if (cameraRef.current && cubicBoxGroupRef.current) {
                  const worldPos = new THREE.Vector3();
                  cubicBoxGroupRef.current.getWorldPosition(worldPos);
                  const projected = worldPos.clone().project(cameraRef.current);
                  const screenX = (projected.x * 0.5 + 0.5) * window.innerWidth;
                  const screenY = (-projected.y * 0.5 + 0.5) * window.innerHeight;
                  onSelectElementRef.current?.('tesseract-4d', { x: screenX, y: screenY });
                }
              }}
              className="px-2 py-1 text-[9px] tracking-[0.16em] uppercase bg-black/60 hover:bg-[#22c55e]/20 border border-neutral-700 hover:border-[#4ade80] text-neutral-300 hover:text-[#86efac] transition-all rounded-sm cursor-pointer"
              title="View 4D Hypercube Tesseract Details & Formulation"
            >
              ⓘ INFO
            </button>
          </div>

          {/* Orientation & Size Telemetry & Multi-Touch Guidance */}
          <div className="flex items-center gap-2 text-[8px] sm:text-[9px] tracking-[0.18em] text-neutral-400 uppercase bg-black/75 px-2.5 py-1 border border-[#22c55e]/25 rounded-sm shadow-[0_0_12px_rgba(0,0,0,0.6)]">
            <span className="text-[#86efac] font-bold">
              SIZE: {Math.round(modelTelemetry.scale * 100)}%
            </span>
            <span className="text-[#4ade80]/50">•</span>
            <span className="text-neutral-300">
              ψ:{Math.round((modelTelemetry.rotY * 180) / Math.PI)}° θ:{' '}
              {Math.round((modelTelemetry.rotX * 180) / Math.PI)}° φ:{' '}
              {Math.round((modelTelemetry.rotZ * 180) / Math.PI)}°
            </span>
            <span className="text-[#4ade80]/50">•</span>
            <span className="text-neutral-400 hidden sm:inline">
              1 FINGER: ROTATE 3D // 2 FINGERS: TWIST (ROLL) & PINCH ZOOM
            </span>
            <span className="text-neutral-400 sm:hidden">
              1-FINGER ROTATE // 2-FINGER TWIST & PINCH
            </span>
          </div>
        </div>
      )}
    </>
  );
}
