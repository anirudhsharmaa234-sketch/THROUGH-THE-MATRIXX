import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

interface TriverseArtifactProps {
  scrollProgress: number;
}

export default function TriverseArtifact({ scrollProgress }: TriverseArtifactProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loadStatus, setLoadStatus] = useState<'searching' | 'loaded' | 'awaiting_glb' | 'error'>('searching');
  const [modelSource, setModelSource] = useState<string>('');

  // Refs for Three.js objects to avoid recreation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const artifactGroupRef = useRef<THREE.Group | null>(null);
  const loadedModelRef = useRef<THREE.Object3D | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Mouse parallax coordinates
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // Load a GLTF/GLB from URL or ObjectURL
  const loadGLB = useCallback((url: string, sourceName: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const scene = sceneRef.current;
      const artifactGroup = artifactGroupRef.current;
      if (!scene || !artifactGroup) {
        resolve(false);
        return;
      }

      setLoadStatus('searching');

      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
      loader.setDRACOLoader(dracoLoader);

      loader.load(
        url,
        (gltf) => {
          // Remove previous model if exists
          if (loadedModelRef.current) {
            artifactGroup.remove(loadedModelRef.current);
            loadedModelRef.current.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.geometry?.dispose();
                if (Array.isArray(child.material)) {
                  child.material.forEach((m) => m.dispose());
                } else if (child.material) {
                  child.material.dispose();
                }
              }
            });
            loadedModelRef.current = null;
          }

          const model = gltf.scene;

          // Compute exact bounding box and scale to natural viewport proportion
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());

          // Center the model's pivot
          model.position.x = -center.x;
          model.position.y = -center.y;
          model.position.z = -center.z;

          const maxDim = Math.max(size.x, size.y, size.z);
          const targetScale = maxDim > 0 ? 2.4 / maxDim : 1;

          const wrapper = new THREE.Group();
          wrapper.add(model);
          wrapper.scale.set(targetScale, targetScale, targetScale);

          // Preserve original textures, materials, and normal detail without downscaling
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;

              if (child.material) {
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach((mat) => {
                  if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
                    if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
                    if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
                    mat.needsUpdate = true;
                  }
                });
              }
            }
          });

          artifactGroup.add(wrapper);
          loadedModelRef.current = wrapper;

          setLoadStatus('loaded');
          setModelSource(sourceName);
          resolve(true);
        },
        undefined,
        () => {
          resolve(false);
        }
      );
    });
  }, []);

  // Handle local GLB upload/drag-and-drop
  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    loadGLB(objectUrl, file.name);
  }, [loadGLB]);

  // Initial WebGL Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera with true perspective depth
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.5);
    cameraRef.current = camera;

    // 3. Transparent High-Fidelity WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      precision: 'highp',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // 100% transparent: background animation shows through flawlessly
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Matrix Environmental Lighting
    // Ambient green fill
    const ambientLight = new THREE.AmbientLight(0x0e2815, 1.8);
    scene.add(ambientLight);

    // Primary Emerald Key Light
    const keyLight = new THREE.DirectionalLight(0x4ade80, 3.2);
    keyLight.position.set(3.5, 4.5, 4.0);
    scene.add(keyLight);

    // Deep Green Rim Light
    const rimLight = new THREE.DirectionalLight(0x15803d, 2.0);
    rimLight.position.set(-3.5, -3.0, -3.0);
    scene.add(rimLight);

    // Center Core Matrix Glow Light
    const corePointLight = new THREE.PointLight(0x22c55e, 2.5, 8, 1.2);
    corePointLight.position.set(0, 0, 0.5);
    scene.add(corePointLight);

    // 5. Environmental 3D Artifact Group
    const artifactGroup = new THREE.Group();
    scene.add(artifactGroup);
    artifactGroupRef.current = artifactGroup;

    // --- Environmental Feature A: Floating Matrix 3D Dust / Data Particles ---
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 8.5;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 5.0;
      particleScales[i] = Math.random() * 0.8 + 0.2;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x4ade80,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Environmental Feature B: Translucent Crystalline Shards ---
    const shardGroup = new THREE.Group();
    const shardGeo = new THREE.TetrahedronGeometry(0.12, 0);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.35,
      wireframe: false,
    });

    const shardMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      const shard = new THREE.Mesh(shardGeo, shardMat);
      const angle = (i / 8) * Math.PI * 2;
      const radius = 1.9 + (i % 3) * 0.3;
      shard.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 1.2,
        Math.sin(angle) * radius
      );
      shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      shardGroup.add(shard);
      shardMeshes.push(shard);
    }
    artifactGroup.add(shardGroup);

    // --- Environmental Feature C: Subtle Orbital Matrix Data Rings ---
    const ringGroup = new THREE.Group();
    const ring1Geo = new THREE.TorusGeometry(1.75, 0.008, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x4ade80,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.1, 0.006, 16, 100);
    const ring2 = new THREE.Mesh(ring2Geo, ringMat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    ringGroup.add(ring2);

    artifactGroup.add(ringGroup);

    // 6. Attempt Loading Candidate Models in Sequence
    const candidatePaths = [
      '/models/triverse_artifact.glb',
      '/triverse_artifact.glb',
      '/models/artifact.glb',
    ];

    let found = false;
    const tryCandidates = async () => {
      for (const path of candidatePaths) {
        try {
          const res = await fetch(path, { method: 'HEAD' });
          if (res.ok) {
            const success = await loadGLB(path, path.split('/').pop() || 'artifact.glb');
            if (success) {
              found = true;
              break;
            }
          }
        } catch {
          // Continue to next candidate
        }
      }
      if (!found) {
        setLoadStatus('awaiting_glb');
      }
    };
    tryCandidates();

    // 7. Animation & Render Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse parallax lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      if (artifactGroup) {
        // Subtle controlled 3D rotation (never rapid, pure cinematic elegance)
        artifactGroup.rotation.y = elapsedTime * 0.12 + mouseRef.current.x * 0.45;
        artifactGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.06 + mouseRef.current.y * 0.35;
        artifactGroup.rotation.z = Math.cos(elapsedTime * 0.4) * 0.03;

        // Extremely subtle floating levitation
        artifactGroup.position.y = Math.sin(elapsedTime * 0.9) * 0.07;

        // Animate surrounding environmental features
        shardGroup.rotation.y = -elapsedTime * 0.18;
        shardMeshes.forEach((shard, idx) => {
          shard.rotation.x += 0.01;
          shard.rotation.y += 0.015;
          shard.position.y += Math.sin(elapsedTime * 1.5 + idx) * 0.0015;
        });

        ring1.rotation.z = elapsedTime * 0.15;
        ring2.rotation.z = -elapsedTime * 0.12;
      }

      // Drift floating background particles
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += 0.002;
        if (positions[i * 3 + 1] > 3.5) {
          positions[i * 3 + 1] = -3.5;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    window.addEventListener('resize', handleResize);

    // 9. Pointer Movement Parallax Listener
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Drag and drop listener for local GLB
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);

      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      particleGeo.dispose();
      particleMat.dispose();
      shardGeo.dispose();
      shardMat.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      ringMat.dispose();

      if (loadedModelRef.current) {
        loadedModelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry?.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else if (child.material) {
              child.material.dispose();
            }
          }
        });
      }

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [handleFile, loadGLB]);

  // Adjust artifact depth & scale in sync with Surface scroll journey
  // During approach (0.0 to 0.45) it is prominent; as user approaches contact (0.45 to 0.8),
  // it gracefully scales and integrates into the physical convergence
  const scrollScale = Math.max(0.65, 1.0 - scrollProgress * 0.35);
  const scrollOpacity = scrollProgress > 0.88 ? Math.max(0, (1 - scrollProgress) / 0.12) : 1;

  return (
    <div
      id="triverse-3d-artifact-layer"
      className="absolute inset-0 w-full h-full pointer-events-none z-15 overflow-hidden transition-opacity duration-500"
      style={{
        opacity: scrollOpacity,
        transform: `scale(${scrollScale})`,
      }}
    >
      {/* Real WebGL Three.js Canvas Container */}
      <div
        ref={mountRef}
        id="triverse-webgl-mount"
        className="w-full h-full block"
      />

      {/* Hidden File Input for Direct GLB Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb,.gltf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Subtle, restrained status indicator in top-right corner */}
      <div
        id="artifact-status-pill"
        className="absolute top-18 right-6 pointer-events-auto flex items-center gap-2 px-2.5 py-1 rounded bg-black/60 border border-[#22c55e]/20 text-[#86efac] font-matrix-mono text-[9px] tracking-[0.2em] backdrop-blur-sm transition-all duration-300 hover:border-[#22c55e]/50 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        title="Click to import or drop an exported .glb model file"
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            loadStatus === 'loaded'
              ? 'bg-[#22c55e] animate-pulse'
              : 'bg-[#eab308] animate-ping'
          }`}
        />
        <span>
          {loadStatus === 'loaded'
            ? `ARTIFACT 3D // ${modelSource.toUpperCase()}`
            : 'TRIVERSE 3D ARTIFACT // READY FOR GLB'}
        </span>
      </div>
    </div>
  );
}
