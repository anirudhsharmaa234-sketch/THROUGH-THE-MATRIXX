/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  CENTRAL_ENTITY_DATA,
  NETWORK_NODES,
  NETWORK_PATHWAYS,
  DATA_WAVES,
  FLOATING_STRUCTURES,
  TRAVELLING_DATA_BLOCKS,
} from '../data/networkTopologyData.ts';
import {
  NETWORK_INFORMATION_REGISTRY,
} from '../data/networkInformationData.ts';
import { ScreenAnchor } from './NetworkInformationDisplay.tsx';
import { MemoryEventStage } from '../types/networkDiscovery.ts';

// ----------------------------------------------------------------------------
// Central 3D Sphere Artifact Model Procedural Textures
// ----------------------------------------------------------------------------

/**
 * Creates high-detail technological cybernetic spherical map texture for the Central 3D Sphere Artifact Model
 */
function createSphereArtifactTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 1024, 512);

    // Deep technological tinted background panel
    ctx.fillStyle = 'rgba(2, 22, 10, 0.85)';
    ctx.fillRect(0, 0, 1024, 512);

    // Latitude & Longitude precision grid
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.25)';
    ctx.lineWidth = 1;

    // Longitude lines
    for (let x = 0; x <= 1024; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    // Latitude lines
    for (let y = 0; y <= 512; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Glowing Equator Technical Data Ribbon
    ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
    ctx.fillRect(0, 230, 1024, 52);

    ctx.strokeStyle = 'rgba(134, 239, 172, 0.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 230);
    ctx.lineTo(1024, 230);
    ctx.moveTo(0, 282);
    ctx.lineTo(1024, 282);
    ctx.stroke();

    // Equatorial Telemetry Text Stream
    ctx.font = '600 16px "Share Tech Mono", monospace';
    ctx.fillStyle = '#86efac';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      '// 3D SPHERICAL ARTIFACT // SYNAPTIC CORE-NULL-00 // 18 NODES CONVERGED // THROUGHPUT: 480.2 PB/s // SYNCHRONY 99.9998% //',
      24,
      256
    );

    // Secondary data repeat for 360 wrap
    ctx.fillText(
      '// SPATIAL NEXUS // G_μν ⊗ N(V,E) // DET(A - λI)=0 // 18 OPTICAL CONDUITS DOCKED //',
      620,
      256
    );

    // Northern & Southern Tropic Guide Rings
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.45)';
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(0, 128);
    ctx.lineTo(1024, 128);
    ctx.moveTo(0, 384);
    ctx.lineTo(1024, 384);
    ctx.stroke();
    ctx.setLineDash([]);

    // Major Cybernetic Nodes / Glyph Reticles distributed across the map
    const glyphs = [
      { x: 128, y: 128, text: '⬡ CORE +01', eq: 'Ψ_net' },
      { x: 384, y: 128, text: 'Ψ WAVE-02', eq: 'iħ ∂Ψ/∂t' },
      { x: 640, y: 128, text: 'Ω TOPOL-03', eq: 'd²=0' },
      { x: 896, y: 128, text: 'ℝ⁴ ARTIFACT', eq: 'G_μν' },
      { x: 256, y: 384, text: 'λ EIGEN-05', eq: 'det(A-λI)' },
      { x: 512, y: 384, text: 'H(X) ENTROPY', eq: '-∑ p log p' },
      { x: 768, y: 384, text: 'N(18) LINKED', eq: 'V ⊗ E' },
    ];

    glyphs.forEach((g) => {
      ctx.strokeStyle = 'rgba(134, 239, 172, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(g.x, g.y, 34, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(74, 222, 128, 0.15)';
      ctx.fill();

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(g.x - 44, g.y);
      ctx.lineTo(g.x + 44, g.y);
      ctx.moveTo(g.x, g.y - 44);
      ctx.lineTo(g.x, g.y + 44);
      ctx.stroke();

      // Label
      ctx.font = '600 13px "Share Tech Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(g.text, g.x, g.y - 8);

      ctx.font = '500 11px "Share Tech Mono", monospace';
      ctx.fillStyle = '#86efac';
      ctx.fillText(g.eq, g.x, g.y + 12);
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  return texture;
}

interface NetworkSpatialEnvironmentProps {
  /**
   * Scroll progress within Section 3 (0.0 to 1.0).
   * 100% scroll-controlled cinematic journey.
   */
  scrollProgress: number;
  /** Currently selected/committed interactive object ID */
  selectedId: string | null;
  /** Currently hovered interactive object ID */
  hoveredId: string | null;
  /** Callback when user clicks/taps an object */
  onSelectId: (id: string | null) => void;
  /** Callback when user hovers an object */
  onHoverId: (id: string | null) => void;
  /** Callback to update projected 2D screen positions at 60fps */
  onUpdateAnchors: (selected: ScreenAnchor | null, hovered: ScreenAnchor | null) => void;
  /** Callback for convergence pre-flash tension intensity (0.0 to 1.0) */
  onConvergenceChange?: (intensity: number) => void;
  /** Callback to trigger the final white + green cinematic flash */
  onTriggerFlash?: () => void;
  /** Discovered object IDs in chronological order */
  discoveredIds?: string[];
  /** Memory event stage */
  discoveryEventStage?: MemoryEventStage;
  /** Memory event normalized progress */
  discoveryStageProgress?: number;
}

/**
 * NetworkSpatialEnvironment
 *
 * STEP 4 — THE NETWORK REMEMBERS YOUR DISCOVERIES
 *
 * The Network maintains session-level awareness of explored objects.
 * When >= 3 objects are meaningfully discovered:
 * - Network briefly calms background activity
 * - Discovered objects pulse with distinct resonance
 * - A previously invisible luminous pathway connects them in 3D space
 * - Flowing data particles stream along the sequence toward the Central Entity
 * - Central Entity responds by absorbing the discovered intelligence
 * - Visitor can seamlessly continue scroll-controlled exploration
 */
export default function NetworkSpatialEnvironment({
  scrollProgress,
  selectedId,
  hoveredId,
  onSelectId,
  onHoverId,
  onUpdateAnchors,
  onConvergenceChange,
  onTriggerFlash,
  discoveredIds = [],
  discoveryEventStage = 'dormant',
  discoveryStageProgress = 0,
}: NetworkSpatialEnvironmentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Synchronized refs for fast animation-frame access without stale closures
  const progressRef = useRef(scrollProgress);
  const selectedIdRef = useRef(selectedId);
  const hoveredIdRef = useRef(hoveredId);
  const onSelectIdRef = useRef(onSelectId);
  const onHoverIdRef = useRef(onHoverId);
  const onUpdateAnchorsRef = useRef(onUpdateAnchors);
  const onConvergenceChangeRef = useRef(onConvergenceChange);
  const onTriggerFlashRef = useRef(onTriggerFlash);
  const discoveredIdsRef = useRef<string[]>(discoveredIds);
  const discoveryStageRef = useRef<MemoryEventStage>(discoveryEventStage);
  const discoveryProgressRef = useRef<number>(discoveryStageProgress);

  // Flash one-shot trigger latch
  const hasFlashedRef = useRef(false);
  const interactiveScaleBoostRef = useRef<number>(1.0);

  useEffect(() => {
    progressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    hoveredIdRef.current = hoveredId;
  }, [hoveredId]);

  useEffect(() => {
    discoveredIdsRef.current = discoveredIds;
  }, [discoveredIds]);

  useEffect(() => {
    discoveryStageRef.current = discoveryEventStage;
  }, [discoveryEventStage]);

  useEffect(() => {
    discoveryProgressRef.current = discoveryStageProgress;
  }, [discoveryStageProgress]);

  useEffect(() => {
    onSelectIdRef.current = onSelectId;
    onHoverIdRef.current = onHoverId;
    onUpdateAnchorsRef.current = onUpdateAnchors;
    onConvergenceChangeRef.current = onConvergenceChange;
    onTriggerFlashRef.current = onTriggerFlash;
  }, [onSelectId, onHoverId, onUpdateAnchors, onConvergenceChange, onTriggerFlash]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    let isMobile = width < 768;

    // ------------------------------------------------------------------------
    // 1. SCENE SETUP
    // ------------------------------------------------------------------------
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const sceneFog = new THREE.FogExp2(0x000201, 0.00095);
    scene.fog = sceneFog;

    // ------------------------------------------------------------------------
    // 2. CAMERA SETUP
    // ------------------------------------------------------------------------
    const camera = new THREE.PerspectiveCamera(isMobile ? 66 : 54, width / height, 1, 3800);
    cameraRef.current = camera;
    camera.position.set(0, 24, 380);

    // ------------------------------------------------------------------------
    // 3. RENDERER SETUP
    // ------------------------------------------------------------------------
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ------------------------------------------------------------------------
    // 4. MASTER SCENE GRAPH HIERARCHY
    // ------------------------------------------------------------------------
    const worldGroup = new THREE.Group();
    worldGroup.name = 'NETWORK_WORLD_ROOT';
    scene.add(worldGroup);

    const centralEntityGroup = new THREE.Group();
    centralEntityGroup.name = 'CENTRAL_ENTITY';
    centralEntityGroup.position.set(...CENTRAL_ENTITY_DATA.position);
    worldGroup.add(centralEntityGroup);

    const nodesGroup = new THREE.Group();
    nodesGroup.name = 'NETWORK_NODES_GROUP';
    worldGroup.add(nodesGroup);

    const wavesGroup = new THREE.Group();
    wavesGroup.name = 'DATA_WAVES_GROUP';
    worldGroup.add(wavesGroup);

    const pathwaysGroup = new THREE.Group();
    pathwaysGroup.name = 'CONNECTION_PATHWAYS_GROUP';
    worldGroup.add(pathwaysGroup);

    const structuresGroup = new THREE.Group();
    structuresGroup.name = 'FLOATING_STRUCTURES_GROUP';
    worldGroup.add(structuresGroup);

    const travellingGroup = new THREE.Group();
    travellingGroup.name = 'TRAVELLING_PACKETS_GROUP';
    worldGroup.add(travellingGroup);

    // Interactive Colliders Group (invisible hit-test targets)
    const collidersGroup = new THREE.Group();
    collidersGroup.name = 'INTERACTIVE_COLLIDERS';
    worldGroup.add(collidersGroup);
    const interactiveColliders: THREE.Mesh[] = [];

    // Map of object 3D positions for projecting 2D screen anchors
    const objectPosGetterMap = new Map<string, () => THREE.Vector3>();

    // ------------------------------------------------------------------------
    // 5. SHARED PROCEDURAL TEXTURES
    // ------------------------------------------------------------------------
    const createGlowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(187, 247, 208, 1)');
      grad.addColorStop(0.18, 'rgba(134, 239, 172, 0.9)');
      grad.addColorStop(0.42, 'rgba(74, 222, 128, 0.45)');
      grad.addColorStop(0.75, 'rgba(21, 128, 61, 0.12)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const glowTexture = createGlowTexture();

    // ------------------------------------------------------------------------
    // 6. BUILD CENTRAL 3D SPHERE ARTIFACT MODEL (CENTRAL_ENTITY)
    // ------------------------------------------------------------------------
    const centralComponents: {
      artifactModelGroup: THREE.Group;
      sphereMesh: THREE.Mesh;
      sphereTexture: THREE.CanvasTexture;
      sphereMaterial: THREE.MeshBasicMaterial;
      outerWire: THREE.LineSegments;
      dockNodesGroup: THREE.Group;
      dockNodeMeshes: THREE.Mesh[];
      innerSphereGroup: THREE.Group;
      innerEdges: THREE.LineSegments;
      innerFaceMesh: THREE.Mesh;
      meridianLines: THREE.LineSegments;
      innerCore: THREE.Mesh;
      innerWire: THREE.LineSegments;
      outerRing: THREE.LineLoop;
      innerRing: THREE.LineLoop;
      polarRing: THREE.LineLoop;
      shardGroup: THREE.Group;
      shardMeshes: THREE.Mesh[];
      haloSprite: THREE.Sprite;
      encounterAura: THREE.Sprite;
      centralCollider: THREE.Mesh;
    } = {} as any;

    const baseSphereRadius = 32;

    const buildCentralEntity = () => {
      // Group holding all components of the 3D Sphere Artifact Model
      const artifactModelGroup = new THREE.Group();
      artifactModelGroup.name = 'CENTRAL_SPHERE_ARTIFACT_MODEL';
      centralEntityGroup.add(artifactModelGroup);
      centralComponents.artifactModelGroup = artifactModelGroup;

      // 1. High-Detail Cybernetic Spherical Texture & Shell
      const sphereTexture = createSphereArtifactTexture();
      centralComponents.sphereTexture = sphereTexture;

      const sphereGeo = new THREE.SphereGeometry(baseSphereRadius, 40, 40);
      const sphereMaterial = new THREE.MeshBasicMaterial({
        map: sphereTexture,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMaterial);
      artifactModelGroup.add(sphereMesh);
      centralComponents.sphereMesh = sphereMesh;
      centralComponents.sphereMaterial = sphereMaterial;

      // 2. Geodesic Crystalline Outer Wireframe Shell
      const outerGeodesicGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(baseSphereRadius * 1.03, 2));
      const outerEdgesMat = new THREE.LineBasicMaterial({
        color: new THREE.Color('#4ade80'),
        transparent: true,
        opacity: 0,
        linewidth: 2,
        blending: THREE.AdditiveBlending,
      });
      const outerWire = new THREE.LineSegments(outerGeodesicGeo, outerEdgesMat);
      sphereMesh.add(outerWire);
      centralComponents.outerWire = outerWire;

      // 3. 18 Glowing Surface Docking Terminals on the Sphere Surface (one for each network node!)
      const dockNodesGroup = new THREE.Group();
      const dockNodeMeshes: THREE.Mesh[] = [];
      const dockGeo = new THREE.OctahedronGeometry(2.6, 0);
      const dockMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#86efac'),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });

      NETWORK_NODES.forEach((node) => {
        const nodePos = new THREE.Vector3(...node.position);
        const relDir = nodePos.clone().sub(centralEntityGroup.position).normalize();
        const dockPos = relDir.clone().multiplyScalar(baseSphereRadius);

        const dockNode = new THREE.Mesh(dockGeo, dockMat);
        dockNode.position.copy(dockPos);
        dockNode.lookAt(dockPos.clone().multiplyScalar(2));
        dockNodesGroup.add(dockNode);
        dockNodeMeshes.push(dockNode);
      });
      sphereMesh.add(dockNodesGroup);
      centralComponents.dockNodesGroup = dockNodesGroup;
      centralComponents.dockNodeMeshes = dockNodeMeshes;

      // 4. Inner Concentric 3D Spherical Structure (Counter-rotating nested structure)
      const innerSphereGroup = new THREE.Group();
      artifactModelGroup.add(innerSphereGroup);
      centralComponents.innerSphereGroup = innerSphereGroup;

      const innerSphereRadius = baseSphereRadius * 0.62;
      const innerSphereGeo = new THREE.IcosahedronGeometry(innerSphereRadius, 2);
      const innerEdgesMat = new THREE.LineBasicMaterial({
        color: new THREE.Color('#22c55e'),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        linewidth: 1.5,
      });
      const innerEdges = new THREE.LineSegments(new THREE.WireframeGeometry(innerSphereGeo), innerEdgesMat);
      innerSphereGroup.add(innerEdges);
      centralComponents.innerEdges = innerEdges;

      const innerFaceMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#14532d'),
        transparent: true,
        opacity: 0,
        wireframe: true,
        blending: THREE.AdditiveBlending,
      });
      const innerFaceMesh = new THREE.Mesh(innerSphereGeo, innerFaceMat);
      innerSphereGroup.add(innerFaceMesh);
      centralComponents.innerFaceMesh = innerFaceMesh;

      // 5. Spherical Quantum Filaments (Dynamic Meridian Flux Arcs)
      const meridianCount = 16;
      const meridianPts: number[] = [];
      for (let m = 0; m < meridianCount; m++) {
        const angle = (m / meridianCount) * Math.PI * 2;
        const ptsPerMeridian = 24;
        for (let pIdx = 0; pIdx < ptsPerMeridian; pIdx++) {
          const lat = -Math.PI / 2 + (pIdx / (ptsPerMeridian - 1)) * Math.PI;
          const nextLat = -Math.PI / 2 + ((pIdx + 1) / (ptsPerMeridian - 1)) * Math.PI;
          if (pIdx < ptsPerMeridian - 1) {
            const r = baseSphereRadius * 0.85;
            meridianPts.push(
              Math.cos(lat) * Math.cos(angle) * r,
              Math.sin(lat) * r,
              Math.cos(lat) * Math.sin(angle) * r,
              Math.cos(nextLat) * Math.cos(angle) * r,
              Math.sin(nextLat) * r,
              Math.cos(nextLat) * Math.sin(angle) * r
            );
          }
        }
      }
      const meridianGeo = new THREE.BufferGeometry();
      meridianGeo.setAttribute('position', new THREE.Float32BufferAttribute(meridianPts, 3));
      const meridianMat = new THREE.LineBasicMaterial({
        color: new THREE.Color('#86efac'),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        linewidth: 1.5,
      });
      const meridianLines = new THREE.LineSegments(meridianGeo, meridianMat);
      innerSphereGroup.add(meridianLines);
      centralComponents.meridianLines = meridianLines;

      // 6. Central Quantum Singularity Core
      const coreGeo = new THREE.IcosahedronGeometry(baseSphereRadius * 0.28, 1);
      const coreMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#86efac'),
        wireframe: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const innerCore = new THREE.Mesh(coreGeo, coreMat);
      artifactModelGroup.add(innerCore);
      centralComponents.innerCore = innerCore;

      const innerWireGeo = new THREE.WireframeGeometry(coreGeo);
      const innerWireMat = new THREE.LineBasicMaterial({
        color: new THREE.Color('#bbf7d0'),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const innerWire = new THREE.LineSegments(innerWireGeo, innerWireMat);
      innerCore.add(innerWire);
      centralComponents.innerWire = innerWire;

      // 7. Triple Orbital Armillary Gimbal Rings
      const createRing = (radius: number, colorStr: string, rotX: number, rotY: number) => {
        const ringGeo = new THREE.BufferGeometry();
        const pts: number[] = [];
        const segs = 72;
        for (let i = 0; i <= segs; i++) {
          const theta = (i / segs) * Math.PI * 2;
          pts.push(Math.cos(theta) * radius, Math.sin(theta) * radius, 0);
        }
        ringGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        const ringMat = new THREE.LineBasicMaterial({
          color: new THREE.Color(colorStr),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        });
        const ring = new THREE.LineLoop(ringGeo, ringMat);
        ring.rotation.x = rotX;
        ring.rotation.y = rotY;
        return ring;
      };

      const outerRing = createRing(baseSphereRadius * 1.42, '#86efac', Math.PI * 0.28, 0);
      artifactModelGroup.add(outerRing);
      centralComponents.outerRing = outerRing;

      const innerRing = createRing(baseSphereRadius * 1.22, '#22c55e', 0, Math.PI * 0.5);
      artifactModelGroup.add(innerRing);
      centralComponents.innerRing = innerRing;

      const polarRing = createRing(baseSphereRadius * 1.58, '#4ade80', Math.PI * 0.45, Math.PI * 0.25);
      artifactModelGroup.add(polarRing);
      centralComponents.polarRing = polarRing;

      // 8. Orbiting Crystalline Shards (Triverse Artifact Heritage)
      const shardGroup = new THREE.Group();
      const shardMeshes: THREE.Mesh[] = [];
      const shardCount = 10;
      const shardGeo = new THREE.TetrahedronGeometry(2.4, 0);
      const shardMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#bbf7d0'),
        wireframe: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });

      for (let s = 0; s < shardCount; s++) {
        const phi = (s / shardCount) * Math.PI * 2;
        const theta = (s % 2 === 0 ? 0.35 : -0.35) * Math.PI;
        const rad = baseSphereRadius * 1.68;
        const sx = Math.cos(theta) * Math.cos(phi) * rad;
        const sy = Math.sin(theta) * rad;
        const sz = Math.cos(theta) * Math.sin(phi) * rad;

        const shard = new THREE.Mesh(shardGeo, shardMat);
        shard.position.set(sx, sy, sz);
        shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        shardGroup.add(shard);
        shardMeshes.push(shard);
      }
      artifactModelGroup.add(shardGroup);
      centralComponents.shardGroup = shardGroup;
      centralComponents.shardMeshes = shardMeshes;

      // 9. Halo & Aura Sprites
      const haloMat = new THREE.SpriteMaterial({
        map: glowTexture,
        color: new THREE.Color('#86efac'),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const haloSprite = new THREE.Sprite(haloMat);
      const haloDim = baseSphereRadius * 4.6;
      haloSprite.scale.set(haloDim, haloDim, 1);
      artifactModelGroup.add(haloSprite);
      centralComponents.haloSprite = haloSprite;

      const auraMat = new THREE.SpriteMaterial({
        map: glowTexture,
        color: new THREE.Color('#bbf7d0'),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const encounterAura = new THREE.Sprite(auraMat);
      encounterAura.scale.set(baseSphereRadius * 6.8, baseSphereRadius * 6.8, 1);
      artifactModelGroup.add(encounterAura);
      centralComponents.encounterAura = encounterAura;

      // 10. Interactive hit collider for CENTRAL_ENTITY (Spherical target)
      const centralHitGeo = new THREE.SphereGeometry(baseSphereRadius * 1.45, 16, 16);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const centralCollider = new THREE.Mesh(centralHitGeo, hitMat);
      centralCollider.name = 'COLLIDER_CENTRAL_ENTITY';
      centralCollider.userData = { interactiveId: 'CENTRAL_ENTITY' };
      centralEntityGroup.add(centralCollider);
      interactiveColliders.push(centralCollider);
      centralComponents.centralCollider = centralCollider;

      objectPosGetterMap.set('CENTRAL_ENTITY', () => centralEntityGroup.position);
    };

    buildCentralEntity();

    // ------------------------------------------------------------------------
    // 7. BUILD 3D NETWORK NODES
    // ------------------------------------------------------------------------
    const nodeMeshes: {
      id: string;
      tier: string;
      group: THREE.Group;
      coreMesh: THREE.Mesh | THREE.LineSegments;
      haloSprite: THREE.Sprite;
      orbitRings?: THREE.LineLoop[];
      subDetails?: THREE.Object3D[];
      basePos: THREE.Vector3;
      baseSize: number;
      activationThreshold: number;
      encounterIntensity: number;
    }[] = [];

    const nodePositionMap = new Map<string, THREE.Vector3>();

    NETWORK_NODES.forEach((node, idx) => {
      const pos = new THREE.Vector3(...node.position);
      nodePositionMap.set(node.id, pos);

      const nodeGroup = new THREE.Group();
      nodeGroup.name = node.id;
      nodeGroup.position.copy(pos);
      nodesGroup.add(nodeGroup);

      let coreMesh: THREE.Mesh | THREE.LineSegments;
      const orbitRings: THREE.LineLoop[] = [];
      const subDetails: THREE.Object3D[] = [];

      if (node.shapeType === 'orbital_rings') {
        const geo = new THREE.SphereGeometry(node.size * 0.7, 16, 16);
        const mat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(node.color),
          transparent: true,
          opacity: 0,
        });
        coreMesh = new THREE.Mesh(geo, mat);
        nodeGroup.add(coreMesh);

        [1.6, 2.2].forEach((factor, rIdx) => {
          const rGeo = new THREE.BufferGeometry();
          const rPts: number[] = [];
          const rSegs = 32;
          const rRad = node.size * factor;
          for (let i = 0; i <= rSegs; i++) {
            const th = (i / rSegs) * Math.PI * 2;
            rPts.push(Math.cos(th) * rRad, Math.sin(th) * rRad, 0);
          }
          rGeo.setAttribute('position', new THREE.Float32BufferAttribute(rPts, 3));
          const rMat = new THREE.LineBasicMaterial({
            color: new THREE.Color(node.color),
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
          });
          const ring = new THREE.LineLoop(rGeo, rMat);
          ring.rotation.x = Math.PI * (0.2 + rIdx * 0.3);
          ring.rotation.y = Math.PI * (rIdx * 0.25);
          nodeGroup.add(ring);
          orbitRings.push(ring);
        });
      } else if (node.shapeType === 'polyhedral_core') {
        const geo = new THREE.IcosahedronGeometry(node.size * 0.8, 0);
        const mat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(node.color),
          transparent: true,
          opacity: 0,
        });
        coreMesh = new THREE.Mesh(geo, mat);
        nodeGroup.add(coreMesh);

        const wireGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(node.size * 1.15, 0));
        const wireMat = new THREE.LineBasicMaterial({
          color: new THREE.Color(node.color),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        });
        const wire = new THREE.LineSegments(wireGeo, wireMat);
        nodeGroup.add(wire);
        subDetails.push(wire);
      } else if (node.shapeType === 'crystalline') {
        const geo = new THREE.OctahedronGeometry(node.size * 0.75, 0);
        const wireGeo = new THREE.WireframeGeometry(geo);
        const mat = new THREE.LineBasicMaterial({
          color: new THREE.Color(node.color),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        });
        coreMesh = new THREE.LineSegments(wireGeo, mat);
        nodeGroup.add(coreMesh);

        const innerGeo = new THREE.OctahedronGeometry(node.size * 0.45, 0);
        const innerMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color('#bbf7d0'),
          transparent: true,
          opacity: 0,
        });
        const inner = new THREE.Mesh(innerGeo, innerMat);
        nodeGroup.add(inner);
        subDetails.push(inner);
      } else if (node.shapeType === 'digital_layers') {
        const hexGeo = new THREE.CylinderGeometry(node.size * 0.8, node.size * 0.8, 2, 6);
        const hexMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(node.color),
          transparent: true,
          opacity: 0,
        });
        coreMesh = new THREE.Mesh(hexGeo, hexMat);
        nodeGroup.add(coreMesh);

        [-node.size * 0.6, node.size * 0.6].forEach((yOff) => {
          const disc = new THREE.Mesh(hexGeo, hexMat);
          disc.position.y = yOff;
          disc.scale.set(0.7, 0.5, 0.7);
          nodeGroup.add(disc);
          subDetails.push(disc);
        });
      } else {
        const boxGeo = new THREE.BoxGeometry(node.size * 0.9, node.size * 0.9, node.size * 0.9);
        const wireGeo = new THREE.WireframeGeometry(boxGeo);
        const mat = new THREE.LineBasicMaterial({
          color: new THREE.Color(node.color),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        });
        coreMesh = new THREE.LineSegments(wireGeo, mat);
        nodeGroup.add(coreMesh);

        const innerGeo = new THREE.BoxGeometry(node.size * 0.5, node.size * 0.5, node.size * 0.5);
        const innerMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(node.color),
          transparent: true,
          opacity: 0,
        });
        const inner = new THREE.Mesh(innerGeo, innerMat);
        nodeGroup.add(inner);
        subDetails.push(inner);
      }

      const haloMat = new THREE.SpriteMaterial({
        map: glowTexture,
        color: new THREE.Color(node.color),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const haloSprite = new THREE.Sprite(haloMat);
      const haloDim = node.size * (node.depth === 'foreground' ? 5.2 : 4.0);
      haloSprite.scale.set(haloDim, haloDim, 1);
      nodeGroup.add(haloSprite);

      let activation = 0.02 + (idx / NETWORK_NODES.length) * 0.16;
      if (node.id === 'NODE_001' || node.id === 'NODE_002' || node.id === 'NODE_010' || node.id === 'NODE_011') {
        activation = 0.02;
      }

      nodeMeshes.push({
        id: node.id,
        tier: node.depth,
        group: nodeGroup,
        coreMesh,
        haloSprite,
        orbitRings,
        subDetails,
        basePos: pos,
        baseSize: node.size,
        activationThreshold: activation,
        encounterIntensity: 0,
      });

      // If this node is in the curated inspectable registry, add an interactive collider!
      if (NETWORK_INFORMATION_REGISTRY[node.id]) {
        const hitRadius = Math.max(26, node.size * 2.2);
        const hitGeo = new THREE.SphereGeometry(hitRadius, 8, 8);
        const hitMat = new THREE.MeshBasicMaterial({ visible: false });
        const collider = new THREE.Mesh(hitGeo, hitMat);
        collider.name = `COLLIDER_${node.id}`;
        collider.userData = { interactiveId: node.id };
        nodeGroup.add(collider);
        interactiveColliders.push(collider);

        objectPosGetterMap.set(node.id, () => nodeGroup.position);
      }
    });

    // ------------------------------------------------------------------------
    // 7B. ALL-NODE DYNAMIC CONDUITS CONNECTED TO CENTRAL 3D SPHERE ARTIFACT MODEL
    // Connects all 18 nodes directly to the surface of the central 3D sphere artifact
    // ------------------------------------------------------------------------
    const allNodeConduitsGroup = new THREE.Group();
    allNodeConduitsGroup.name = 'ALL_NODE_CONDUITS';
    worldGroup.add(allNodeConduitsGroup);

    const allNodeConduits: {
      nodeId: string;
      line: THREE.Line;
      geometry: THREE.BufferGeometry;
      material: THREE.LineBasicMaterial;
      originNodePos: THREE.Vector3;
      surfaceDockDir: THREE.Vector3;
    }[] = [];

    NETWORK_NODES.forEach((node) => {
      const nodePos = nodePositionMap.get(node.id);
      if (!nodePos) return;

      const relDir = nodePos.clone().sub(centralEntityGroup.position).normalize();

      const geo = new THREE.BufferGeometry();
      const pts = new Float32Array([
        nodePos.x, nodePos.y, nodePos.z,
        nodePos.x, nodePos.y, nodePos.z,
      ]);
      geo.setAttribute('position', new THREE.BufferAttribute(pts, 3));

      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color(node.id === 'NODE_001' ? '#bbf7d0' : '#4ade80'),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        linewidth: 1.5,
      });

      const line = new THREE.Line(geo, mat);
      line.name = `CENTRAL_CONDUIT_${node.id}`;
      allNodeConduitsGroup.add(line);

      allNodeConduits.push({
        nodeId: node.id,
        line,
        geometry: geo,
        material: mat,
        originNodePos: nodePos,
        surfaceDockDir: relDir,
      });
    });

    // Dynamic data packet pulses flowing between nodes and the central 3D sphere artifact model
    const conduitPulseCount = 42;
    const conduitPulseGeo = new THREE.BufferGeometry();
    const conduitPulsePositions = new Float32Array(conduitPulseCount * 3);
    conduitPulseGeo.setAttribute('position', new THREE.BufferAttribute(conduitPulsePositions, 3));
    const conduitPulseMat = new THREE.PointsMaterial({
      color: new THREE.Color('#bbf7d0'),
      size: 8.5,
      map: glowTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const conduitPulsePoints = new THREE.Points(conduitPulseGeo, conduitPulseMat);
    allNodeConduitsGroup.add(conduitPulsePoints);

    const conduitPulses = Array.from({ length: conduitPulseCount }, (_, i) => ({
      conduitIdx: i % Math.max(1, allNodeConduits.length),
      t: Math.random(),
      speed: 0.007 + Math.random() * 0.012,
    }));

    // ------------------------------------------------------------------------
    // 8. BUILD FLOWING DATA WAVES
    // ------------------------------------------------------------------------
    const waveSystems: {
      id: string;
      curve: THREE.CatmullRomCurve3;
      particles: THREE.Points;
      positions: Float32Array;
      tValues: Float32Array;
      speeds: Float32Array;
      speed: number;
      color: THREE.Color;
      pathLine: THREE.Line;
    }[] = [];

    DATA_WAVES.forEach((wave) => {
      const points = [
        new THREE.Vector3(...wave.origin),
        ...wave.controlPoints.map((p) => new THREE.Vector3(...p)),
        new THREE.Vector3(...wave.destination),
      ];
      const curve = new THREE.CatmullRomCurve3(points);
      curve.curveType = 'centripetal';
      curve.tension = 0.45;

      const curvePoints = curve.getPoints(80);
      const pathGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const pathMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(wave.color),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const pathLine = new THREE.Line(pathGeo, pathMat);
      wavesGroup.add(pathLine);

      const count = wave.particleCount;
      const geo = new THREE.BufferGeometry();
      const posArray = new Float32Array(count * 3);
      const colArray = new Float32Array(count * 3);
      const tValues = new Float32Array(count);
      const speeds = new Float32Array(count);

      const baseCol = new THREE.Color(wave.color);

      for (let i = 0; i < count; i++) {
        const t = i / count;
        tValues[i] = t;
        speeds[i] = wave.speed * (0.85 + Math.random() * 0.3);

        const pt = curve.getPoint(t);
        posArray[i * 3] = pt.x;
        posArray[i * 3 + 1] = pt.y;
        posArray[i * 3 + 2] = pt.z;

        const brightness = 0.5 + Math.sin(t * Math.PI) * 0.5;
        colArray[i * 3] = baseCol.r * brightness;
        colArray[i * 3 + 1] = baseCol.g * brightness;
        colArray[i * 3 + 2] = baseCol.b * brightness;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colArray, 3));

      const mat = new THREE.PointsMaterial({
        size: wave.scale === 'large' ? 9.0 : 7.0,
        map: glowTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particles = new THREE.Points(geo, mat);
      particles.name = wave.id;
      wavesGroup.add(particles);

      waveSystems.push({
        id: wave.id,
        curve,
        particles,
        positions: posArray,
        tValues,
        speeds,
        speed: wave.speed,
        color: baseCol,
        pathLine,
      });

      // If wave is in registry, add interactive collider along its prominent section
      if (NETWORK_INFORMATION_REGISTRY[wave.id]) {
        const info = NETWORK_INFORMATION_REGISTRY[wave.id];
        const hitGeo = new THREE.SphereGeometry(38, 8, 8);
        const hitMat = new THREE.MeshBasicMaterial({ visible: false });
        const waveCollider = new THREE.Mesh(hitGeo, hitMat);
        waveCollider.position.set(...info.anchorPosition);
        waveCollider.name = `COLLIDER_${wave.id}`;
        waveCollider.userData = { interactiveId: wave.id };
        collidersGroup.add(waveCollider);
        interactiveColliders.push(waveCollider);

        objectPosGetterMap.set(wave.id, () => waveCollider.position);
      }
    });

    // ------------------------------------------------------------------------
    // 9. BUILD CONNECTION PATHWAYS
    // ------------------------------------------------------------------------
    const pathwayObjects: {
      id: string;
      line: THREE.Line;
      geometry: THREE.BufferGeometry;
      material: THREE.LineBasicMaterial;
      srcPos: THREE.Vector3;
      tgtPos: THREE.Vector3;
      sourceId: string;
      targetId: string;
      activationThreshold: number;
      tier: string;
      baseColor: THREE.Color;
    }[] = [];

    NETWORK_PATHWAYS.forEach((path) => {
      const src = nodePositionMap.get(path.sourceId);
      const tgt = nodePositionMap.get(path.targetId);
      if (!src || !tgt) return;

      const pts = [src.x, src.y, src.z, src.x, src.y, src.z];
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));

      let lineColor = '#4ade80';
      if (path.tier === 'backbone') lineColor = '#86efac';
      else if (path.tier === 'inter-cluster') lineColor = '#22c55e';
      else lineColor = '#16a34a';

      const baseCol = new THREE.Color(lineColor);
      const mat = new THREE.LineBasicMaterial({
        color: baseCol,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });

      const line = new THREE.Line(geo, mat);
      line.name = path.id;
      pathwaysGroup.add(line);

      pathwayObjects.push({
        id: path.id,
        line,
        geometry: geo,
        material: mat,
        srcPos: src,
        tgtPos: tgt,
        sourceId: path.sourceId,
        targetId: path.targetId,
        activationThreshold: path.activationThreshold,
        tier: path.tier,
        baseColor: baseCol,
      });
    });

    // ------------------------------------------------------------------------
    // 10. TRAVELLING SIGNAL PULSES
    // ------------------------------------------------------------------------
    const pulseCount = 48;
    const pulseGeometry = new THREE.BufferGeometry();
    const pulsePositions = new Float32Array(pulseCount * 3);
    const pulseColors = new Float32Array(pulseCount * 3);
    const pulseBaseColor = new THREE.Color('#bbf7d0');

    for (let i = 0; i < pulseCount; i++) {
      pulsePositions[i * 3] = 0;
      pulsePositions[i * 3 + 1] = 0;
      pulsePositions[i * 3 + 2] = 0;
      pulseColors[i * 3] = pulseBaseColor.r;
      pulseColors[i * 3 + 1] = pulseBaseColor.g;
      pulseColors[i * 3 + 2] = pulseBaseColor.b;
    }

    pulseGeometry.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
    pulseGeometry.setAttribute('color', new THREE.BufferAttribute(pulseColors, 3));

    const pulseMaterial = new THREE.PointsMaterial({
      size: 7.5,
      map: glowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pulsesPoints = new THREE.Points(pulseGeometry, pulseMaterial);
    pathwaysGroup.add(pulsesPoints);

    const activePulses = Array.from({ length: pulseCount }, (_, i) => ({
      pathwayIndex: i % Math.max(1, NETWORK_PATHWAYS.length),
      t: Math.random(),
      speed: 0.0035 + Math.random() * 0.006,
    }));

    // ------------------------------------------------------------------------
    // 11. BUILD FLOATING DATA STRUCTURES
    // ------------------------------------------------------------------------
    const structureMeshes: {
      id: string;
      mesh: THREE.Object3D;
      rotSpeed: [number, number, number];
      baseOpacity: number;
      basePos: THREE.Vector3;
    }[] = [];

    FLOATING_STRUCTURES.forEach((struct) => {
      let obj: THREE.Object3D;

      if (struct.type === 'cryptographic_cell') {
        const group = new THREE.Group();
        const boxGeo = new THREE.BoxGeometry(struct.scale, struct.scale, struct.scale);
        const boxMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color('#15803d'),
          transparent: true,
          opacity: 0,
        });
        const boxMesh = new THREE.Mesh(boxGeo, boxMat);
        group.add(boxMesh);

        const wireGeo = new THREE.WireframeGeometry(boxGeo);
        const wireMat = new THREE.LineBasicMaterial({
          color: new THREE.Color('#86efac'),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        });
        const wire = new THREE.LineSegments(wireGeo, wireMat);
        group.add(wire);

        const innerGeo = new THREE.OctahedronGeometry(struct.scale * 0.45);
        const innerMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color('#4ade80'),
          transparent: true,
          opacity: 0,
        });
        const inner = new THREE.Mesh(innerGeo, innerMat);
        group.add(inner);

        obj = group;
      } else if (struct.type === 'polyhedron') {
        const geom = struct.id.includes('OCT')
          ? new THREE.OctahedronGeometry(struct.scale)
          : new THREE.DodecahedronGeometry(struct.scale);
        const wireGeo = new THREE.WireframeGeometry(geom);
        const wireMat = new THREE.LineBasicMaterial({
          color: new THREE.Color('#4ade80'),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        });
        obj = new THREE.LineSegments(wireGeo, wireMat);
      } else if (struct.type === 'bus_register') {
        const boxGeo = new THREE.BoxGeometry(
          struct.scale * 1.9,
          struct.scale * 0.85,
          struct.scale * 0.35
        );
        const wireGeo = new THREE.WireframeGeometry(boxGeo);
        const wireMat = new THREE.LineBasicMaterial({
          color: new THREE.Color('#22c55e'),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        });
        obj = new THREE.LineSegments(wireGeo, wireMat);
      } else {
        const grid = new THREE.GridHelper(struct.scale * 2, 20, 0x22c55e, 0x15803d);
        const mat = grid.material as THREE.Material;
        mat.transparent = true;
        mat.opacity = 0;
        obj = grid;
      }

      obj.name = struct.id;
      const posVec = new THREE.Vector3(...struct.position);
      obj.position.copy(posVec);
      structuresGroup.add(obj);

      structureMeshes.push({
        id: struct.id,
        mesh: obj,
        rotSpeed: struct.rotationSpeed,
        baseOpacity: struct.opacity,
        basePos: posVec,
      });

      // If struct is in registry, add interactive collider
      if (NETWORK_INFORMATION_REGISTRY[struct.id]) {
        const hitRadius = Math.max(28, struct.scale * 1.3);
        const hitGeo = new THREE.SphereGeometry(hitRadius, 8, 8);
        const hitMat = new THREE.MeshBasicMaterial({ visible: false });
        const collider = new THREE.Mesh(hitGeo, hitMat);
        collider.name = `COLLIDER_${struct.id}`;
        collider.userData = { interactiveId: struct.id };
        obj.add(collider);
        interactiveColliders.push(collider);

        objectPosGetterMap.set(struct.id, () => obj.position);
      }
    });

    // ------------------------------------------------------------------------
    // 12. TRAVELLING DATA PACKETS
    // ------------------------------------------------------------------------
    const dataBlockMeshes: {
      id: string;
      mesh: THREE.Mesh;
      src: THREE.Vector3;
      tgt: THREE.Vector3;
      t: number;
      speed: number;
    }[] = [];

    TRAVELLING_DATA_BLOCKS.forEach((block) => {
      const pathway = NETWORK_PATHWAYS.find((p) => p.id === block.pathwayId);
      if (!pathway) return;
      const src = nodePositionMap.get(pathway.sourceId);
      const tgt = nodePositionMap.get(pathway.targetId);
      if (!src || !tgt) return;

      const geom = new THREE.BoxGeometry(block.size, block.size, block.size);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(block.color),
        transparent: true,
        opacity: 0,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.name = block.id;

      const blockHalo = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTexture,
          color: new THREE.Color(block.color),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        })
      );
      blockHalo.scale.set(block.size * 3.4, block.size * 3.4, 1);
      mesh.add(blockHalo);

      travellingGroup.add(mesh);
      dataBlockMeshes.push({
        id: block.id,
        mesh,
        src,
        tgt,
        t: block.progress,
        speed: block.speed,
      });
    });

    // ------------------------------------------------------------------------
    // 12b. BUILD CONVERGENCE NETWORK FILAMENTS (STEP 4)
    // ------------------------------------------------------------------------
    const convergenceGroup = new THREE.Group();
    convergenceGroup.name = 'CONVERGENCE_SYSTEM_GROUP';
    worldGroup.add(convergenceGroup);

    const hubNodeIds = [
      'NODE_003',
      'NODE_007',
      'NODE_008',
      'NODE_014',
      'NODE_015',
      'NODE_016',
      'NODE_018',
    ];
    const convergenceFilaments: {
      nodeId: string;
      line: THREE.Line;
      geometry: THREE.BufferGeometry;
      material: THREE.LineBasicMaterial;
      originNodePos: THREE.Vector3;
    }[] = [];

    hubNodeIds.forEach((nodeId) => {
      const nodePos = nodePositionMap.get(nodeId);
      if (!nodePos) return;

      const pts = [nodePos.x, nodePos.y, nodePos.z, 50, 30, -540];
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color('#86efac'),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(geo, mat);
      line.name = `CONV_FILAMENT_${nodeId}`;
      convergenceGroup.add(line);

      convergenceFilaments.push({
        nodeId,
        line,
        geometry: geo,
        material: mat,
        originNodePos: nodePos,
      });
    });

    // Convergent in-flowing signal pulses
    const convPulseCount = 28;
    const convPulseGeo = new THREE.BufferGeometry();
    const convPulsePos = new Float32Array(convPulseCount * 3);
    const convPulseCol = new Float32Array(convPulseCount * 3);
    const convPulseBaseCol = new THREE.Color('#ffffff');

    for (let i = 0; i < convPulseCount; i++) {
      convPulsePos[i * 3] = 0;
      convPulsePos[i * 3 + 1] = 0;
      convPulsePos[i * 3 + 2] = 0;
      convPulseCol[i * 3] = convPulseBaseCol.r;
      convPulseCol[i * 3 + 1] = convPulseBaseCol.g;
      convPulseCol[i * 3 + 2] = convPulseBaseCol.b;
    }

    convPulseGeo.setAttribute('position', new THREE.BufferAttribute(convPulsePos, 3));
    convPulseGeo.setAttribute('color', new THREE.BufferAttribute(convPulseCol, 3));

    const convPulseMat = new THREE.PointsMaterial({
      size: 8.5,
      map: glowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const convPulsePoints = new THREE.Points(convPulseGeo, convPulseMat);
    convergenceGroup.add(convPulsePoints);

    const convPulses = Array.from({ length: convPulseCount }, (_, i) => ({
      filamentIdx: i % Math.max(1, convergenceFilaments.length),
      t: Math.random(),
      speed: 0.009 + Math.random() * 0.012,
    }));

    // ------------------------------------------------------------------------
    // 12c. BUILD DISCOVERY MEMORY PATHWAYS (STEP 4: NETWORK REMEMBERS)
    // ------------------------------------------------------------------------
    const discoveryMemoryGroup = new THREE.Group();
    discoveryMemoryGroup.name = 'DISCOVERY_MEMORY_GROUP';
    worldGroup.add(discoveryMemoryGroup);

    // Dynamic spline line connecting discovered objects in chronological order
    const maxDiscoveryPoints = 250;
    const discoveryLinePos = new Float32Array(maxDiscoveryPoints * 3);
    const discoveryLineGeo = new THREE.BufferGeometry();
    discoveryLineGeo.setAttribute('position', new THREE.BufferAttribute(discoveryLinePos, 3));
    discoveryLineGeo.setDrawRange(0, 0);

    const discoveryLineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#86efac'),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const discoveryLine = new THREE.Line(discoveryLineGeo, discoveryLineMat);
    discoveryMemoryGroup.add(discoveryLine);

    // Luminous flowing data particles along the discovered pathway
    const discPulseCount = 36;
    const discPulseGeo = new THREE.BufferGeometry();
    const discPulsePos = new Float32Array(discPulseCount * 3);
    const discPulseCol = new Float32Array(discPulseCount * 3);
    const discPulseBaseCol = new THREE.Color('#86efac');
    for (let i = 0; i < discPulseCount; i++) {
      discPulsePos[i * 3] = 0;
      discPulsePos[i * 3 + 1] = 0;
      discPulsePos[i * 3 + 2] = 0;
      discPulseCol[i * 3] = discPulseBaseCol.r;
      discPulseCol[i * 3 + 1] = discPulseBaseCol.g;
      discPulseCol[i * 3 + 2] = discPulseBaseCol.b;
    }
    discPulseGeo.setAttribute('position', new THREE.BufferAttribute(discPulsePos, 3));
    discPulseGeo.setAttribute('color', new THREE.BufferAttribute(discPulseCol, 3));

    const discPulseMat = new THREE.PointsMaterial({
      size: 8.5,
      map: glowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const discPulsePoints = new THREE.Points(discPulseGeo, discPulseMat);
    discoveryMemoryGroup.add(discPulsePoints);

    const discPulses = Array.from({ length: discPulseCount }, (_, i) => ({
      t: Math.random(),
      speed: 0.007 + Math.random() * 0.012,
    }));

    // ------------------------------------------------------------------------
    // 13. CINEMATIC JOURNEY SPLINES
    // ------------------------------------------------------------------------
    const centralJourneyPoints = [
      new THREE.Vector3(0, 16, -70),
      new THREE.Vector3(0, 24, -95),
      new THREE.Vector3(0, 52, -156),
      new THREE.Vector3(-110, 74, -135),
      new THREE.Vector3(-262, 95, -112),
      new THREE.Vector3(-210, -5, -170),
      new THREE.Vector3(-55, -60, -225),
      new THREE.Vector3(190, -42, -220),
      new THREE.Vector3(50, 30, -540),
    ];
    const centralJourneyCurve = new THREE.CatmullRomCurve3(centralJourneyPoints);
    centralJourneyCurve.curveType = 'centripetal';
    centralJourneyCurve.tension = 0.4;

    const cameraJourneyPoints = [
      new THREE.Vector3(0, 22, 380),
      new THREE.Vector3(0, 26, 310),
      new THREE.Vector3(65, 72, -30),
      new THREE.Vector3(-55, 96, -10),
      new THREE.Vector3(-175, 122, 25),
      new THREE.Vector3(-115, 45, -45),
      new THREE.Vector3(75, -25, -75),
      new THREE.Vector3(145, 48, -65),
      new THREE.Vector3(120, 130, -110),
    ];
    const cameraJourneyCurve = new THREE.CatmullRomCurve3(cameraJourneyPoints);
    cameraJourneyCurve.curveType = 'centripetal';
    cameraJourneyCurve.tension = 0.4;

    const lookAtPoints = [
      new THREE.Vector3(0, 16, -70),
      new THREE.Vector3(0, 26, -100),
      new THREE.Vector3(0, 52, -156),
      new THREE.Vector3(-150, 80, -130),
      new THREE.Vector3(-262, 95, -112),
      new THREE.Vector3(-170, -20, -190),
      new THREE.Vector3(-20, -50, -230),
      new THREE.Vector3(230, -48, -215),
      new THREE.Vector3(45, 20, -680),
    ];
    const lookAtCurve = new THREE.CatmullRomCurve3(lookAtPoints);
    lookAtCurve.curveType = 'centripetal';
    lookAtCurve.tension = 0.4;

    // ------------------------------------------------------------------------
    // 14. INTERACTION SYSTEM: RAYCASTING & HIT TESTING
    // ------------------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouseNdc = new THREE.Vector2(-999, -999);
    let mouseRawX = 0;
    let mouseRawY = 0;

    let pointerDownPos = { x: 0, y: 0 };
    let isPointerDown = false;

    const onPointerMove = (e: MouseEvent) => {
      mouseRawX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRawY = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseNdc.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNdc.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Raycast for hover detection
      raycaster.setFromCamera(mouseNdc, camera);
      const intersects = raycaster.intersectObjects(interactiveColliders, false);

      if (intersects.length > 0) {
        const hitId = intersects[0].object.userData.interactiveId;
        if (hitId && hitId !== hoveredIdRef.current) {
          onHoverIdRef.current(hitId);
          if (container) container.style.cursor = 'crosshair';
        }
      } else {
        if (hoveredIdRef.current !== null) {
          onHoverIdRef.current(null);
          if (container) container.style.cursor = 'default';
        }
      }
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isPointerDown = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      pointerDownPos = { x: clientX, y: clientY };
    };

    const onPointerUp = (e: MouseEvent | TouchEvent) => {
      if (!isPointerDown) return;
      isPointerDown = false;

      const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
      const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;

      // Distance check: if drag distance is > 8px, it was a scroll/drag, NOT a click/tap!
      const dist = Math.hypot(clientX - pointerDownPos.x, clientY - pointerDownPos.y);
      if (dist > 8) return;

      // Perform click/tap raycasting
      const tapNdc = new THREE.Vector2(
        (clientX / window.innerWidth) * 2 - 1,
        -(clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(tapNdc, camera);
      const intersects = raycaster.intersectObjects(interactiveColliders, false);

      if (intersects.length > 0) {
        const hitId = intersects[0].object.userData.interactiveId;
        if (hitId) {
          onSelectIdRef.current(hitId);
        }
      } else {
        // Tapped empty space -> gracefully dismiss active selection
        if (selectedIdRef.current !== null) {
          onSelectIdRef.current(null);
        }
      }
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mousedown', onPointerDown, { passive: true });
    window.addEventListener('mouseup', onPointerUp, { passive: true });
    window.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchend', onPointerUp, { passive: true });

    // ------------------------------------------------------------------------
    // 15. RESPONSIVE RESIZE
    // ------------------------------------------------------------------------
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      isMobile = width < 768;

      camera.aspect = width / height;
      camera.fov = isMobile ? 66 : 54;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // ------------------------------------------------------------------------
    // 16. MASTER ANIMATION & RENDER LOOP
    // ------------------------------------------------------------------------
    let animationFrameId: number;
    let clock = new THREE.Clock();

    let smoothedProgress = progressRef.current;
    const currentCentralPos = new THREE.Vector3();
    const currentCamPos = new THREE.Vector3();
    const currentLookAt = new THREE.Vector3();

    // Reusable Vector3 for projecting 2D screen positions
    const projVec = new THREE.Vector3();

    // Flash timing reference
    let localFlashStart = -1;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // Critically damped tracking to user scroll
      const targetProgress = Math.max(0, Math.min(1, progressRef.current));
      smoothedProgress += (targetProgress - smoothedProgress) * 0.12;
      const p = smoothedProgress;

      // Convergence intensity: 0.0 below 0.86, ramping smoothly to 1.0 at 0.96
      const convergenceIntensity = p >= 0.86 ? Math.min(1.0, (p - 0.86) / 0.10) : 0;
      onConvergenceChangeRef.current?.(convergenceIntensity);

      // Reset flash latch if user scrolls backward
      if (p < 0.90) {
        hasFlashedRef.current = false;
      }

      // Check for one-shot flash execution at journey arrival
      if (p >= 0.975 && !hasFlashedRef.current) {
        hasFlashedRef.current = true;
        localFlashStart = time;
        onTriggerFlashRef.current?.();
      }

      // Calculate 3D flash expansion curve
      let flash3DBurst = 0;
      if (localFlashStart > 0 && time - localFlashStart < 0.44) {
        const fElapsed = time - localFlashStart;
        const fNorm = fElapsed / 0.44;
        if (fNorm < 0.22) {
          flash3DBurst = Math.sin((fNorm / 0.22) * (Math.PI / 2));
        } else {
          flash3DBurst = Math.pow(1 - (fNorm - 0.22) / 0.78, 2.4);
        }
      }

      // Dynamic Fog Density & Flash Overexposure
      sceneFog.density = 0.00095 - p * 0.00033;
      if (flash3DBurst > 0) {
        sceneFog.color.setRGB(flash3DBurst * 0.15, flash3DBurst * 0.42, flash3DBurst * 0.2);
      } else {
        sceneFog.color.setHex(0x000201);
      }

      // Active selections and hovers
      const activeSelectedId = selectedIdRef.current;
      const activeHoveredId = hoveredIdRef.current;
      const activeSelectedInfo = activeSelectedId
        ? NETWORK_INFORMATION_REGISTRY[activeSelectedId]
        : null;

      // ----------------------------------------------------------------------
      // A. EVALUATE JOURNEY TRAJECTORIES WITH DESTINATION DECELERATION
      // ----------------------------------------------------------------------
      let effectiveTravelP = p;
      if (p >= 0.84) {
        const norm = Math.min(1.0, (p - 0.84) / 0.16);
        const eased = Math.sin(norm * (Math.PI / 2));
        effectiveTravelP = 0.84 + eased * 0.16;
      }
      const boundedTravelP = Math.min(1.0, effectiveTravelP);

      centralJourneyCurve.getPoint(boundedTravelP, currentCentralPos);
      cameraJourneyCurve.getPoint(boundedTravelP, currentCamPos);
      lookAtCurve.getPoint(boundedTravelP, currentLookAt);

      if (isMobile) {
        currentCamPos.z += 60;
        currentCamPos.y += 12;
      }

      const parallaxX = mouseRawX * (isMobile ? 8 : 18);
      const parallaxY = -mouseRawY * (isMobile ? 6 : 14);

      camera.position.set(
        currentCamPos.x + parallaxX,
        currentCamPos.y + parallaxY,
        currentCamPos.z
      );
      camera.lookAt(currentLookAt);

      worldGroup.rotation.y = Math.sin(time * 0.02) * 0.012;
      worldGroup.rotation.x = Math.cos(time * 0.018) * 0.008;

      // ----------------------------------------------------------------------
      // B. CENTRAL OBJECT MOVEMENT, ROTATION & DYNAMIC INCREASING SIZE
      // ----------------------------------------------------------------------
      centralEntityGroup.position.copy(currentCentralPos);

      const tangent = centralJourneyCurve.getTangent(boundedTravelP);
      const targetQuat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        tangent
      );
      centralEntityGroup.quaternion.slerp(targetQuat, 0.08);

      let centralOpacity = 0;
      if (p >= 0.04) {
        centralOpacity = Math.min(1, (p - 0.04) / 0.10);
      }

      const isCentralSelected = activeSelectedId === 'CENTRAL_ENTITY';
      const isCentralHovered = activeHoveredId === 'CENTRAL_ENTITY';
      const centralBoost = isCentralSelected ? 0.35 : isCentralHovered ? 0.18 : 0;

      // Memory Event Reactivity (Step 4: Network Remembers)
      const currentDiscStage = discoveryStageRef.current;
      const isMemoryEventActive = currentDiscStage === 'pattern_established' || currentDiscStage === 'absorbed';
      const memoryBoost = currentDiscStage === 'absorbed' ? 0.55 : currentDiscStage === 'pattern_established' ? 0.32 : 0;

      // 1. DYNAMIC INCREASING SIZE
      // - Progressive growth as user traverses deeper into the network (0.85 -> 2.45x)
      // - Organic breathing expansion pulse
      // - Interactive swell on hover (+22%) and selection (+42%)
      // - Convergence and memory burst surge
      const scrollScaleFactor = 0.85 + Math.pow(Math.min(1, p / 0.90), 1.25) * 1.55;
      const breathScale = 1.0 + Math.sin(time * 2.4) * 0.08;
      const targetInteractiveBoost = isCentralSelected ? 1.42 : isCentralHovered ? 1.22 : 1.0;
      interactiveScaleBoostRef.current = THREE.MathUtils.lerp(interactiveScaleBoostRef.current, targetInteractiveBoost, 0.08);
      const eventScaleBoost = 1.0 + convergenceIntensity * 0.55 + flash3DBurst * 1.6 + memoryBoost * 0.3;

      const totalSphereScale = scrollScaleFactor * breathScale * interactiveScaleBoostRef.current * eventScaleBoost;
      if (centralComponents.artifactModelGroup) {
        centralComponents.artifactModelGroup.scale.set(totalSphereScale, totalSphereScale, totalSphereScale);
      }
      if (centralComponents.centralCollider) {
        centralComponents.centralCollider.scale.set(totalSphereScale, totalSphereScale, totalSphereScale);
      }

      // 2. DYNAMIC CONTINUOUS ROTATION
      const rotSpeed = delta * (0.35 + centralBoost * 0.4 + convergenceIntensity * 0.9 + memoryBoost * 0.6);
      if (centralComponents.sphereMesh) {
        centralComponents.sphereMesh.rotation.y += rotSpeed;
        centralComponents.sphereMesh.rotation.x = Math.sin(time * 0.45) * 0.18 + (isCentralHovered ? 0.08 : 0);
        centralComponents.sphereMesh.rotation.z = Math.cos(time * 0.35) * 0.10;

        if (centralComponents.sphereMaterial) {
          centralComponents.sphereMaterial.opacity = Math.min(1, (centralOpacity + centralBoost + convergenceIntensity * 0.25 + memoryBoost * 0.25) * 0.88);
        }
      }

      if (centralComponents.outerWire) {
        const wireMat = centralComponents.outerWire.material as THREE.LineBasicMaterial;
        wireMat.opacity = Math.min(1, (centralOpacity + centralBoost + convergenceIntensity * 0.3 + memoryBoost * 0.3) * 0.85);
      }

      if (centralComponents.dockNodesGroup) {
        centralComponents.dockNodesGroup.children.forEach((dNode: any) => {
          if (dNode.material) {
            dNode.material.opacity = Math.min(1, (centralOpacity + centralBoost + convergenceIntensity * 0.3) * 0.95);
          }
        });
      }

      // Counter-rotating inner concentric spherical structure
      if (centralComponents.innerSphereGroup) {
        centralComponents.innerSphereGroup.rotation.y -= delta * (0.52 + centralBoost * 0.5 + convergenceIntensity * 1.3 + memoryBoost * 0.8);
        centralComponents.innerSphereGroup.rotation.x -= delta * (0.34 + convergenceIntensity * 0.8);
        centralComponents.innerSphereGroup.rotation.z += delta * 0.22;

        if (centralComponents.innerEdges) {
          const iEdgesMat = centralComponents.innerEdges.material as THREE.LineBasicMaterial;
          iEdgesMat.opacity = Math.min(1, (centralOpacity + centralBoost + convergenceIntensity * 0.3) * 0.75);
        }
        if (centralComponents.innerFaceMesh) {
          const iFaceMat = centralComponents.innerFaceMesh.material as THREE.MeshBasicMaterial;
          iFaceMat.opacity = Math.min(1, (centralOpacity + centralBoost + convergenceIntensity * 0.25) * 0.40);
        }
        if (centralComponents.meridianLines) {
          const mMat = centralComponents.meridianLines.material as THREE.LineBasicMaterial;
          mMat.opacity = Math.min(1, (centralOpacity + centralBoost + convergenceIntensity * 0.35 + memoryBoost * 0.3) * 0.78);
        }
      }

      // Orbital Armillary Gimbal Rings
      if (centralComponents.outerRing && centralComponents.innerRing && centralComponents.polarRing) {
        centralComponents.outerRing.rotation.z += delta * (0.40 + centralBoost * 0.6 + convergenceIntensity * 2.2 + memoryBoost * 1.6);
        centralComponents.innerRing.rotation.y -= delta * (0.46 + centralBoost * 0.6 + convergenceIntensity * 2.5 + memoryBoost * 1.8);
        centralComponents.polarRing.rotation.x += delta * (0.32 + centralBoost * 0.4 + convergenceIntensity * 1.8 + memoryBoost * 1.2);

        const oRingMat = centralComponents.outerRing.material as THREE.LineBasicMaterial;
        oRingMat.opacity = Math.min(1, (centralOpacity + centralBoost + convergenceIntensity * 0.3 + memoryBoost * 0.3) * 0.72);

        const iRingMat = centralComponents.innerRing.material as THREE.LineBasicMaterial;
        iRingMat.opacity = Math.min(1, (centralOpacity + centralBoost + convergenceIntensity * 0.3 + memoryBoost * 0.3) * 0.62);

        const pRingMat = centralComponents.polarRing.material as THREE.LineBasicMaterial;
        pRingMat.opacity = Math.min(1, (centralOpacity + centralBoost + convergenceIntensity * 0.3 + memoryBoost * 0.3) * 0.68);
      }

      // Orbiting Crystalline Shards (Triverse Artifact Heritage)
      if (centralComponents.shardGroup && centralComponents.shardMeshes) {
        centralComponents.shardGroup.rotation.y += delta * (0.28 + convergenceIntensity * 0.7 + memoryBoost * 0.5);
        centralComponents.shardGroup.rotation.x = Math.sin(time * 0.4) * 0.12;

        centralComponents.shardMeshes.forEach((shard, sIdx) => {
          shard.rotation.x += delta * (0.4 + sIdx * 0.05);
          shard.rotation.y += delta * (0.6 + sIdx * 0.08);
          const sMat = shard.material as THREE.MeshBasicMaterial;
          sMat.opacity = Math.min(1, (centralOpacity + centralBoost + convergenceIntensity * 0.3 + memoryBoost * 0.3) * 0.85);
        });
      }

      // Central Quantum Singularity Core
      if (centralComponents.innerCore) {
        const isStillnessPhase = p >= 0.965 && p < 0.975;
        const pulseFreq = isStillnessPhase ? 1.0 : (2.8 + centralBoost * 2 + convergenceIntensity * 4.0 + memoryBoost * 3.2);
        const pulseAmp = isStillnessPhase ? 0.03 : (0.12 + centralBoost * 0.08 + memoryBoost * 0.06);
        const corePulse =
          (1.0 + Math.sin(time * pulseFreq) * pulseAmp) *
          (1.0 + convergenceIntensity * 0.35 + flash3DBurst * 2.0 + memoryBoost * 0.15);

        centralComponents.innerCore.scale.set(corePulse, corePulse, corePulse);
        centralComponents.innerCore.rotation.y -= delta * (0.55 + convergenceIntensity * 1.5 + memoryBoost * 1.4);
        if (isMemoryEventActive) {
          centralComponents.innerCore.rotation.x += delta * (memoryBoost * 0.7);
        }

        const cMat = centralComponents.innerCore.material as THREE.MeshBasicMaterial;
        cMat.opacity = Math.min(1, (centralOpacity + centralBoost + convergenceIntensity * 0.2 + flash3DBurst * 0.4 + memoryBoost * 0.25) * 0.98);
        if (convergenceIntensity > 0.5 || currentDiscStage === 'absorbed') {
          cMat.color.set('#ffffff');
        } else {
          cMat.color.set('#86efac');
        }

        const iWireMat = centralComponents.innerWire.material as THREE.LineBasicMaterial;
        iWireMat.opacity = Math.min(1, (centralOpacity + centralBoost + convergenceIntensity * 0.2 + flash3DBurst * 0.4 + memoryBoost * 0.25) * 0.92);
        if (convergenceIntensity > 0.5 || currentDiscStage === 'absorbed') {
          iWireMat.color.set('#ffffff');
        } else {
          iWireMat.color.set('#bbf7d0');
        }
      }

      if (centralComponents.haloSprite) {
        const haloPulse = 0.85 + Math.sin(time * 2.2) * 0.15;
        const hMat = centralComponents.haloSprite.material as THREE.SpriteMaterial;
        hMat.opacity = (centralOpacity + centralBoost + convergenceIntensity * 0.35 + memoryBoost * 0.4) * 0.8 * haloPulse;
        if (isCentralSelected) {
          const dim = 64 * totalSphereScale * 2.5;
          centralComponents.haloSprite.scale.set(dim, dim, 1);
        } else if (isMemoryEventActive) {
          const dim = 64 * totalSphereScale * 1.8 * (1.0 + memoryBoost * 0.4);
          centralComponents.haloSprite.scale.set(dim, dim, 1);
        }
      }

      // 3. UPDATE ALL 18 NODE CONDUITS DYNAMICALLY CONNECTED TO CENTRAL 3D SPHERE ARTIFACT MODEL
      const conduitPulsePosArray = conduitPulseGeo.attributes.position.array as Float32Array;
      const sphereEuler = centralComponents.sphereMesh ? centralComponents.sphereMesh.rotation : new THREE.Euler();

      allNodeConduits.forEach((conduit, cIdx) => {
        const { geometry, material, originNodePos, surfaceDockDir, nodeId } = conduit;
        const isNodeSelected = activeSelectedId === nodeId;
        const isNodeHovered = activeHoveredId === nodeId;
        const isDiscovered = discoveredIdsRef.current.includes(nodeId);

        // Compute surface dock position on the rotating, scaled 3D sphere artifact in world coordinates
        const dockLocal = surfaceDockDir.clone().multiplyScalar(baseSphereRadius * totalSphereScale);
        dockLocal.applyEuler(sphereEuler);
        dockLocal.applyQuaternion(centralEntityGroup.quaternion);
        const dockPos = dockLocal.add(currentCentralPos);

        const posAttr = geometry.attributes.position;
        posAttr.setXYZ(0, originNodePos.x, originNodePos.y, originNodePos.z);
        posAttr.setXYZ(1, dockPos.x, dockPos.y, dockPos.z);
        posAttr.needsUpdate = true;

        if (isNodeSelected || isNodeHovered) {
          material.opacity = 0.95;
          material.color.set('#ffffff');
        } else if (isCentralSelected) {
          material.opacity = 0.82;
          material.color.set('#86efac');
        } else if (isCentralHovered) {
          material.opacity = 0.65;
          material.color.set('#4ade80');
        } else if (isDiscovered && isMemoryEventActive) {
          material.opacity = 0.85;
          material.color.set('#86efac');
        } else {
          material.opacity = Math.max(0.08, (centralOpacity * 0.32) + (Math.sin(time * 2.5 + cIdx) * 0.08));
          material.color.set('#34d399');
        }
      });

      // Conduit active data pulses flowing into the central 3D sphere artifact model
      let pulsePtr = 0;
      conduitPulses.forEach((pulse) => {
        const conduit = allNodeConduits[pulse.conduitIdx];
        if (!conduit) return;

        const isNodeSelected = activeSelectedId === conduit.nodeId;
        const isNodeHovered = activeHoveredId === conduit.nodeId;
        const speedMultiplier = (isNodeSelected || isNodeHovered || isCentralSelected) ? 3.0 : 1.0;

        pulse.t = (pulse.t + delta * pulse.speed * speedMultiplier) % 1.0;

        const dockLocal = conduit.surfaceDockDir.clone().multiplyScalar(baseSphereRadius * totalSphereScale);
        dockLocal.applyEuler(sphereEuler);
        dockLocal.applyQuaternion(centralEntityGroup.quaternion);
        const dockPos = dockLocal.add(currentCentralPos);

        const px = conduit.originNodePos.x + (dockPos.x - conduit.originNodePos.x) * pulse.t;
        const py = conduit.originNodePos.y + (dockPos.y - conduit.originNodePos.y) * pulse.t;
        const pz = conduit.originNodePos.z + (dockPos.z - conduit.originNodePos.z) * pulse.t;

        conduitPulsePosArray[pulsePtr++] = px;
        conduitPulsePosArray[pulsePtr++] = py;
        conduitPulsePosArray[pulsePtr++] = pz;
      });
      conduitPulseGeo.attributes.position.needsUpdate = true;
      conduitPulseMat.opacity = Math.min(1, (centralOpacity + centralBoost + convergenceIntensity * 0.4) * 0.85);

      // ----------------------------------------------------------------------
      // B2. CONVERGENCE FILAMENTS & SIGNALS (STEP 4)
      // ----------------------------------------------------------------------
      const convPulsePosArray = convPulseGeo.attributes.position.array as Float32Array;

      convergenceFilaments.forEach((fil, fIdx) => {
        const { geometry, material, originNodePos } = fil;
        const posAttr = geometry.attributes.position;
        posAttr.setXYZ(0, originNodePos.x, originNodePos.y, originNodePos.z);
        posAttr.setXYZ(1, currentCentralPos.x, currentCentralPos.y, currentCentralPos.z);
        posAttr.needsUpdate = true;

        material.opacity = Math.max(
          flash3DBurst * 0.85,
          convergenceIntensity * (0.42 + Math.sin(time * 4.0 + fIdx) * 0.18)
        );

        const pulse = convPulses[fIdx % convPulseCount];
        if (convergenceIntensity > 0 || flash3DBurst > 0) {
          const pulseSpeed = pulse.speed * (1.0 + convergenceIntensity * 3.2);
          pulse.t = (pulse.t + pulseSpeed) % 1.0;
          const px = originNodePos.x + (currentCentralPos.x - originNodePos.x) * pulse.t;
          const py = originNodePos.y + (currentCentralPos.y - originNodePos.y) * pulse.t;
          const pz = originNodePos.z + (currentCentralPos.z - originNodePos.z) * pulse.t;

          const pIdx = fIdx * 3;
          if (pIdx + 2 < convPulsePosArray.length) {
            convPulsePosArray[pIdx] = px;
            convPulsePosArray[pIdx + 1] = py;
            convPulsePosArray[pIdx + 2] = pz;
          }
        }
      });

      convPulseGeo.attributes.position.needsUpdate = true;
      convPulseMat.opacity = Math.max(
        flash3DBurst * 1.0,
        convergenceIntensity * 0.95
      );

      // ----------------------------------------------------------------------
      // C. NODE MOTION & OBJECT-SPECIFIC SELECTION RESPONSES
      // ----------------------------------------------------------------------
      let maxEncounterIntensity = 0;

      nodeMeshes.forEach((item, index) => {
        const { group, coreMesh, haloSprite, orbitRings, subDetails, basePos, baseSize, activationThreshold } = item;

        // Ambient float
        group.position.x = basePos.x + Math.sin(time * 0.6 + index) * 1.8;
        group.position.y = basePos.y + Math.cos(time * 0.55 + index * 1.3) * 1.8;
        group.position.z = basePos.z + Math.sin(time * 0.4 + index * 0.7) * 1.5;

        // Proximity to Central Entity
        const distToCentral = currentCentralPos.distanceTo(basePos);
        const encounterRadius = 115;
        let encounter = 0;
        if (distToCentral < encounterRadius) {
          encounter = Math.pow(1 - distToCentral / encounterRadius, 1.8);
        }
        item.encounterIntensity = encounter;
        if (encounter > maxEncounterIntensity) {
          maxEncounterIntensity = encounter;
        }

        // Selection & Hover States
        const isNodeSelected = activeSelectedId === item.id;
        const isNodeHovered = activeHoveredId === item.id;
        const isRelatedToSelection = activeSelectedInfo?.relatedNodeIds.includes(item.id);
        const isNodeDiscovered = discoveredIdsRef.current.includes(item.id);
        const isMemActive = discoveryStageRef.current !== 'dormant';
        const isQuietingPhase = discoveryStageRef.current === 'quieting' || discoveryStageRef.current === 'reconnecting';

        let selectionBoost = 0;
        if (isNodeSelected) selectionBoost = 0.55;
        else if (isNodeHovered) selectionBoost = 0.22;
        else if (isRelatedToSelection) selectionBoost = 0.32;
        else if (isNodeDiscovered && isMemActive) {
          selectionBoost = 0.38;
        } else if (hubNodeIds.includes(item.id) && convergenceIntensity > 0) {
          selectionBoost = convergenceIntensity * 0.45;
        }

        let nodeOpacity = 0;
        if (p >= activationThreshold) {
          const fade = Math.min(1, (p - activationThreshold) / 0.04);
          const pulseRate = isNodeDiscovered && isMemActive
            ? 4.6
            : (2.5 + (hubNodeIds.includes(item.id) ? convergenceIntensity * 3 : 0));
          const pulse = 0.88 + Math.sin(time * pulseRate + index * 0.85) * (isNodeDiscovered ? 0.22 : 0.12);
          nodeOpacity = fade * pulse;
        }

        // Ambient quieting for non-discovered objects during memory awakening
        if (isQuietingPhase && !isNodeDiscovered && !isNodeSelected && !isRelatedToSelection) {
          nodeOpacity *= 0.65;
        }

        const boostedOpacity = Math.min(1.0, nodeOpacity + encounter * 0.5 + selectionBoost);

        if ('material' in coreMesh) {
          const mat = coreMesh.material as THREE.Material;
          mat.opacity = boostedOpacity;
        }

        const haloMat = haloSprite.material as THREE.SpriteMaterial;
        haloMat.opacity = boostedOpacity * (0.75 + encounter * 0.6 + (isNodeSelected ? 0.4 : 0));
        const currentHaloDim =
          baseSize *
          (item.tier === 'foreground' ? 5.2 : 4.0) *
          (1.0 + encounter * 0.7 + (isNodeSelected ? 0.6 : isNodeHovered ? 0.2 : 0) + (hubNodeIds.includes(item.id) ? convergenceIntensity * 0.5 : 0));
        haloSprite.scale.set(currentHaloDim, currentHaloDim, 1);

        if (orbitRings && orbitRings.length > 0) {
          orbitRings.forEach((ring, rIdx) => {
            const ringMat = ring.material as THREE.LineBasicMaterial;
            ringMat.opacity = boostedOpacity * (0.55 + encounter * 0.45);
            ring.rotation.z += delta * (0.3 + rIdx * 0.15 + encounter * 1.5 + (isNodeSelected ? 1.2 : 0) + (hubNodeIds.includes(item.id) ? convergenceIntensity * 2 : 0));
          });
        }

        if (subDetails && subDetails.length > 0) {
          subDetails.forEach((sub) => {
            if ('material' in sub) {
              const subMat = (sub as any).material as THREE.Material;
              subMat.opacity = boostedOpacity * (0.65 + encounter * 0.35);
            }
            sub.rotation.y += delta * (0.2 + encounter * 0.8 + (isNodeSelected ? 0.8 : 0));
          });
        }
      });

      if (centralComponents.encounterAura) {
        const aMat = centralComponents.encounterAura.material as THREE.SpriteMaterial;
        aMat.opacity = Math.max(
          maxEncounterIntensity * 0.75,
          isCentralSelected ? 0.7 : 0,
          convergenceIntensity * 0.75,
          flash3DBurst * 1.0
        );
        const auraScale =
          56 *
          (6.0 +
            (maxEncounterIntensity + (isCentralSelected ? 0.8 : 0) + convergenceIntensity * 2.5) * 3.5 +
            flash3DBurst * 18.0);
        centralComponents.encounterAura.scale.set(auraScale, auraScale, 1);
        if (flash3DBurst > 0 || convergenceIntensity > 0.6) {
          aMat.color.set('#ffffff');
        } else {
          aMat.color.set('#bbf7d0');
        }
      }

      // ----------------------------------------------------------------------
      // D. WAVE TRAVEL & SELECTION
      // ----------------------------------------------------------------------
      const isWaveTravelPhase = p >= 0.36 && p <= 0.58;
      const waveTravelIntensity = isWaveTravelPhase
        ? Math.sin(((p - 0.36) / 0.22) * Math.PI)
        : 0;

      let waveOpacity = 0;
      if (p >= 0.16) {
        waveOpacity = Math.min(1, (p - 0.16) / 0.16);
      }

      waveSystems.forEach((wSys, wIdx) => {
        const { curve, particles, positions, tValues, speeds, pathLine } = wSys;
        const isGuideWave = wSys.id === 'WAVE_001';
        const isWaveSelected = activeSelectedId === wSys.id;
        const isWaveHovered = activeHoveredId === wSys.id;
        const isWaveDiscovered = discoveredIdsRef.current.includes(wSys.id);
        const isQuieting = discoveryStageRef.current === 'quieting' || discoveryStageRef.current === 'reconnecting';
        const isMemActive = discoveryStageRef.current !== 'dormant';

        const pathMat = pathLine.material as THREE.LineBasicMaterial;
        let pathBaseOpacity = waveOpacity * 0.22;
        if (isQuieting && !isWaveDiscovered && !isWaveSelected) {
          pathBaseOpacity *= 0.65;
        }

        pathMat.opacity = isWaveSelected
          ? 0.88
          : isWaveHovered
          ? 0.55
          : isWaveDiscovered && isMemActive
          ? 0.68
          : isGuideWave
          ? pathBaseOpacity + waveTravelIntensity * 0.65
          : pathBaseOpacity;

        const count = tValues.length;

        for (let i = 0; i < count; i++) {
          const boostFactor = isWaveSelected
            ? 2.5
            : isWaveHovered
            ? 1.5
            : isWaveDiscovered && isMemActive
            ? 1.4
            : isGuideWave
            ? 1.0 + waveTravelIntensity * 2.2
            : 1.0;
          const currentSpeed = speeds[i] * boostFactor;

          tValues[i] = (tValues[i] + currentSpeed) % 1.0;
          const t = tValues[i];

          const pt = curve.getPoint(t);

          const wavePhase = time * 2.4 + t * Math.PI * 4 + wIdx * 1.5;
          const undulationAmp = 2.4 + Math.sin(t * Math.PI * 2) * 1.8;
          const offsetY = Math.sin(wavePhase) * undulationAmp;
          const offsetX = Math.cos(wavePhase * 0.8) * (undulationAmp * 0.6);

          positions[i * 3] = pt.x + offsetX;
          positions[i * 3 + 1] = pt.y + offsetY;
          positions[i * 3 + 2] = pt.z;
        }

        particles.geometry.attributes.position.needsUpdate = true;
        const pMat = particles.material as THREE.PointsMaterial;
        let finalWaveParticleOpacity = isWaveSelected
          ? 1.0
          : isWaveHovered
          ? 0.95
          : isWaveDiscovered && isMemActive
          ? 0.95
          : isGuideWave
          ? waveOpacity * (0.9 + waveTravelIntensity * 0.4)
          : waveOpacity * 0.9;

        if (isQuieting && !isWaveDiscovered && !isWaveSelected) {
          finalWaveParticleOpacity *= 0.65;
        }
        pMat.opacity = finalWaveParticleOpacity;

        pMat.size =
          (wSys.particles.userData.scale === 'large' ? 9.0 : 7.0) *
          (1.0 + (isWaveSelected ? 0.7 : isWaveHovered ? 0.3 : isWaveDiscovered && isMemActive ? 0.25 : isGuideWave ? waveTravelIntensity * 0.4 : 0));
      });

      // ----------------------------------------------------------------------
      // E. CONNECTION PATHWAYS & LOCAL SELECTION ACTIVATION
      // Only relevant connections ignite when an object is selected!
      // ----------------------------------------------------------------------
      const pulsePosArray = pulseGeometry.attributes.position.array as Float32Array;

      pathwayObjects.forEach((pathObj, pIdx) => {
        const { geometry, material, srcPos, tgtPos, sourceId, targetId, activationThreshold } = pathObj;

        const srcNode = nodeMeshes.find((n) => n.id === sourceId);
        const tgtNode = nodeMeshes.find((n) => n.id === targetId);
        const pathEncounter = Math.max(
          srcNode?.encounterIntensity || 0,
          tgtNode?.encounterIntensity || 0
        );

        // Check if this pathway is explicitly related to active selection
        const isPathRelated = activeSelectedInfo?.relatedPathwayIds.includes(pathObj.id);
        const isDiscoveredEndpoint =
          discoveredIdsRef.current.includes(sourceId) ||
          discoveredIdsRef.current.includes(targetId);
        const isQuieting = discoveryStageRef.current === 'quieting' || discoveryStageRef.current === 'reconnecting';

        if (p < activationThreshold && !isPathRelated) {
          material.opacity = 0;
          const posAttr = geometry.attributes.position;
          posAttr.setXYZ(1, srcPos.x, srcPos.y, srcPos.z);
          posAttr.needsUpdate = true;
        } else {
          const drawSpan = 0.035;
          const progressAlong = isPathRelated
            ? 1.0
            : Math.min(1, (p - activationThreshold) / drawSpan);

          const curX = srcPos.x + (tgtPos.x - srcPos.x) * progressAlong;
          const curY = srcPos.y + (tgtPos.y - srcPos.y) * progressAlong;
          const curZ = srcPos.z + (tgtPos.z - srcPos.z) * progressAlong;

          const posAttr = geometry.attributes.position;
          posAttr.setXYZ(1, curX, curY, curZ);
          posAttr.needsUpdate = true;

          const targetOpacity = pathObj.tier === 'backbone' ? 0.85 : 0.65;
          let calculatedOpacity = isPathRelated
            ? 0.98
            : progressAlong * (targetOpacity + pathEncounter * 0.45);

          if (isQuieting && !isDiscoveredEndpoint && !isPathRelated) {
            calculatedOpacity *= 0.65;
          }
          material.opacity = calculatedOpacity;
        }

        const pulse = activePulses[pIdx % pulseCount];
        if (p >= activationThreshold || isPathRelated) {
          const speedMultiplier = isPathRelated ? 3.0 : 1.0 + pathEncounter * 1.8;
          const pulseSpeed = pulse.speed * speedMultiplier;
          pulse.t = (pulse.t + pulseSpeed) % 1;
          const px = srcPos.x + (tgtPos.x - srcPos.x) * pulse.t;
          const py = srcPos.y + (tgtPos.y - srcPos.y) * pulse.t;
          const pz = srcPos.z + (tgtPos.z - srcPos.z) * pulse.t;

          const idx = (pIdx % pulseCount) * 3;
          pulsePosArray[idx] = px;
          pulsePosArray[idx + 1] = py;
          pulsePosArray[idx + 2] = pz;
        }
      });

      pulseGeometry.attributes.position.needsUpdate = true;
      pulseMaterial.opacity = p >= 0.03 ? Math.min(1, (p - 0.03) / 0.08) * 0.95 : 0;

      // ----------------------------------------------------------------------
      // F. FLOATING DATA STRUCTURES
      // ----------------------------------------------------------------------
      structureMeshes.forEach((item) => {
        const isStructSelected = activeSelectedId === item.id;
        const isStructHovered = activeHoveredId === item.id;
        const rotMultiplier = isStructSelected ? 2.5 : isStructHovered ? 1.5 : 1.0;

        item.mesh.rotation.x += item.rotSpeed[0] * rotMultiplier;
        item.mesh.rotation.y += item.rotSpeed[1] * rotMultiplier;
        item.mesh.rotation.z += item.rotSpeed[2] * rotMultiplier;

        const dist = currentCentralPos.distanceTo(item.basePos);
        const structEncounter = dist < 120 ? (1 - dist / 120) * 0.4 : 0;

        let structOpacity = 0;
        if (p >= 0.32 || isStructSelected) {
          const fade = isStructSelected ? 1.0 : Math.min(1, (p - 0.32) / 0.18);
          const selectionBoost = isStructSelected ? 0.4 : isStructHovered ? 0.2 : 0;
          structOpacity = fade * (item.baseOpacity + structEncounter + selectionBoost);
        }

        item.mesh.traverse((child) => {
          if ('material' in child) {
            const m = (child as any).material as THREE.Material;
            m.opacity = Math.min(1.0, structOpacity);
          }
        });
      });

      // ----------------------------------------------------------------------
      // G. TRAVELLING DATA PACKETS
      // ----------------------------------------------------------------------
      dataBlockMeshes.forEach((blockItem) => {
        blockItem.t = (blockItem.t + blockItem.speed) % 1;
        const bx = blockItem.src.x + (blockItem.tgt.x - blockItem.src.x) * blockItem.t;
        const by = blockItem.src.y + (blockItem.tgt.y - blockItem.src.y) * blockItem.t;
        const bz = blockItem.src.z + (blockItem.tgt.z - blockItem.src.z) * blockItem.t;

        blockItem.mesh.position.set(bx, by, bz);
        blockItem.mesh.rotation.x += 0.02;
        blockItem.mesh.rotation.y += 0.03;

        let blockOpacity = 0;
        if (p >= 0.42) {
          const fade = Math.min(1, (p - 0.42) / 0.15);
          blockOpacity = fade * 0.85;
        }

        const bMat = blockItem.mesh.material as THREE.MeshBasicMaterial;
        bMat.opacity = blockOpacity;

        const haloChild = blockItem.mesh.children[0] as THREE.Sprite | undefined;
        if (haloChild && haloChild.material) {
          haloChild.material.opacity = blockOpacity * 0.7;
        }
      });

      // ----------------------------------------------------------------------
      // G2. DYNAMIC DISCOVERY MEMORY PATHWAY (STEP 4: NETWORK REMEMBERS)
      // Materializes thin luminous constellation between discovered objects
      // ----------------------------------------------------------------------
      const currentDiscIds = discoveredIdsRef.current;
      const memStage = discoveryStageRef.current;
      const isMemStageActive = memStage !== 'dormant';

      if (isMemStageActive && currentDiscIds.length >= 2) {
        const chainPoints: THREE.Vector3[] = [];
        currentDiscIds.forEach((discId) => {
          const getter = objectPosGetterMap.get(discId);
          if (getter) {
            chainPoints.push(getter().clone());
          }
        });
        // Connect discovered constellation inward toward Central Entity
        chainPoints.push(currentCentralPos.clone());

        if (chainPoints.length >= 2) {
          const discSpline = new THREE.CatmullRomCurve3(chainPoints);
          discSpline.curveType = 'centripetal';
          discSpline.tension = 0.4;

          const splineSamples = 80;
          const splinePoints = discSpline.getPoints(splineSamples);
          const linePosAttr = discoveryLineGeo.attributes.position as THREE.BufferAttribute;
          const linePosArr = linePosAttr.array as Float32Array;

          for (let i = 0; i <= splineSamples; i++) {
            const pt = splinePoints[i];
            linePosArr[i * 3] = pt.x;
            linePosArr[i * 3 + 1] = pt.y;
            linePosArr[i * 3 + 2] = pt.z;
          }
          linePosAttr.needsUpdate = true;
          discoveryLineGeo.setDrawRange(0, splineSamples + 1);

          let targetLineOpacity = 0;
          if (memStage === 'quieting') {
            targetLineOpacity = 0.35;
          } else if (memStage === 'reconnecting') {
            targetLineOpacity = 0.65;
          } else if (memStage === 'pattern_established' || memStage === 'absorbed') {
            targetLineOpacity = 0.82 + Math.sin(time * 3.5) * 0.12;
          }

          discoveryLineMat.opacity = targetLineOpacity;

          // Flowing micro-particles along the discovered pathway
          const pulsePosAttr = discPulseGeo.attributes.position as THREE.BufferAttribute;
          const pulsePosArr = pulsePosAttr.array as Float32Array;

          discPulses.forEach((dp, pIdx) => {
            dp.t = (dp.t + dp.speed * (memStage === 'absorbed' ? 1.5 : 1.0)) % 1.0;
            const pt = discSpline.getPoint(dp.t);
            pulsePosArr[pIdx * 3] = pt.x;
            pulsePosArr[pIdx * 3 + 1] = pt.y;
            pulsePosArr[pIdx * 3 + 2] = pt.z;
          });
          pulsePosAttr.needsUpdate = true;
          discPulseMat.opacity = targetLineOpacity * 0.95;
        }
      } else {
        discoveryLineMat.opacity = 0;
        discPulseMat.opacity = 0;
        discoveryLineGeo.setDrawRange(0, 0);
      }

      // ----------------------------------------------------------------------
      // H. 3D-TO-2D PROJECTION: PINPOINT & CONNECTOR ANCHORS
      // Synchronized directly with Three.js rendering every frame
      // ----------------------------------------------------------------------
      let selectedScreenAnchor: ScreenAnchor | null = null;
      let hoveredScreenAnchor: ScreenAnchor | null = null;

      if (activeSelectedId) {
        const getPos = objectPosGetterMap.get(activeSelectedId);
        if (getPos) {
          const wPos = getPos();
          projVec.copy(wPos);
          projVec.project(camera);

          const screenX = ((projVec.x + 1) * width) / 2;
          const screenY = ((-projVec.y + 1) * height) / 2;
          const visible = projVec.z < 1.0 && screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height;

          selectedScreenAnchor = { x: screenX, y: screenY, visible };
        }
      }

      if (activeHoveredId && !activeSelectedId) {
        const getPos = objectPosGetterMap.get(activeHoveredId);
        if (getPos) {
          const wPos = getPos();
          projVec.copy(wPos);
          projVec.project(camera);

          const screenX = ((projVec.x + 1) * width) / 2;
          const screenY = ((-projVec.y + 1) * height) / 2;
          const visible = projVec.z < 1.0 && screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height;

          hoveredScreenAnchor = { x: screenX, y: screenY, visible };
        }
      }

      onUpdateAnchorsRef.current(selectedScreenAnchor, hoveredScreenAnchor);

      // Render the 3D scene
      renderer.render(scene, camera);
    };

    render();

    // ------------------------------------------------------------------------
    // 17. COMPREHENSIVE CLEANUP ON UNMOUNT
    // ------------------------------------------------------------------------
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', onResize);

      const safeDisposeMaterial = (mat: any) => {
        if (!mat) return;
        if (Array.isArray(mat)) {
          mat.forEach((m) => {
            if (m && typeof m.dispose === 'function') m.dispose();
          });
        } else if (typeof mat.dispose === 'function') {
          mat.dispose();
        }
      };

      const safeDisposeGeometry = (geo: any) => {
        if (geo && typeof geo.dispose === 'function') {
          geo.dispose();
        }
      };

      Object.values(centralComponents).forEach((obj: any) => {
        if (!obj) return;
        if (Array.isArray(obj)) {
          obj.forEach((item: any) => {
            if (item) {
              safeDisposeGeometry(item.geometry);
              safeDisposeMaterial(item.material || item);
            }
          });
        } else {
          safeDisposeGeometry(obj.geometry);
          safeDisposeMaterial(obj.material);
        }
      });

      nodeMeshes.forEach((n) => {
        n.group.traverse((child) => {
          safeDisposeGeometry((child as any).geometry);
          safeDisposeMaterial((child as any).material);
        });
      });

      waveSystems.forEach((w) => {
        safeDisposeGeometry(w.particles.geometry);
        safeDisposeMaterial(w.particles.material);
        safeDisposeGeometry(w.pathLine.geometry);
        safeDisposeMaterial(w.pathLine.material);
      });

      pathwayObjects.forEach((p) => {
        safeDisposeGeometry(p.geometry);
        safeDisposeMaterial(p.material);
      });

      safeDisposeGeometry(pulseGeometry);
      safeDisposeMaterial(pulseMaterial);

      structureMeshes.forEach((s) => {
        s.mesh.traverse((child) => {
          safeDisposeGeometry((child as any).geometry);
          safeDisposeMaterial((child as any).material);
        });
      });

      dataBlockMeshes.forEach((b) => {
        safeDisposeGeometry(b.mesh.geometry);
        safeDisposeMaterial(b.mesh.material);
      });

      convergenceFilaments.forEach((f) => {
        safeDisposeGeometry(f.geometry);
        safeDisposeMaterial(f.material);
      });
      safeDisposeGeometry(convPulseGeo);
      safeDisposeMaterial(convPulseMat);

      safeDisposeGeometry(discoveryLineGeo);
      safeDisposeMaterial(discoveryLineMat);
      safeDisposeGeometry(discPulseGeo);
      safeDisposeMaterial(discPulseMat);

      allNodeConduits.forEach((c) => {
        safeDisposeGeometry(c.geometry);
        safeDisposeMaterial(c.material);
      });
      safeDisposeGeometry(conduitPulseGeo);
      safeDisposeMaterial(conduitPulseMat);

      if (centralComponents.sphereTexture && typeof centralComponents.sphereTexture.dispose === 'function') {
        centralComponents.sphereTexture.dispose();
      }

      if (glowTexture && typeof glowTexture.dispose === 'function') {
        glowTexture.dispose();
      }

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      id="network-spatial-3d-canvas"
      ref={containerRef}
      className="absolute inset-0 w-full h-full select-none z-10 pointer-events-auto"
      style={{
        width: '100vw',
        height: '100vh',
        touchAction: 'pan-y',
      }}
    />
  );
}
