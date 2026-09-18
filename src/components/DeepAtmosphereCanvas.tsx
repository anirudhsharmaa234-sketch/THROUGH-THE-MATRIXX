/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

interface DeepAtmosphereCanvasProps {
  scrollProgress: number; // 0.0 to 1.0
}

interface BinaryDrop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  length: number;
  opacity: number;
}

export default function DeepAtmosphereCanvas({ scrollProgress }: DeepAtmosphereCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animIdRef = useRef<number | null>(null);
  const dropsRef = useRef<BinaryDrop[]>([]);
  const scrollRef = useRef(scrollProgress);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDrops();
    };
    window.addEventListener('resize', handleResize);

    const initDrops = () => {
      const colWidth = 26;
      const count = Math.floor(width / colWidth);
      const newDrops: BinaryDrop[] = [];

      for (let i = 0; i < count; i++) {
        const length = Math.floor(Math.random() * 16) + 8;
        const chars: string[] = [];
        for (let c = 0; c < length; c++) {
          chars.push(Math.random() > 0.5 ? '1' : '0');
        }
        newDrops.push({
          x: i * colWidth + (Math.random() - 0.5) * 6,
          y: Math.random() * height * 1.5 - height * 0.5,
          speed: Math.random() * 1.8 + 0.8,
          chars,
          length,
          opacity: Math.random() * 0.4 + 0.15,
        });
      }
      dropsRef.current = newDrops;
    };
    initDrops();

    const render = () => {
      animIdRef.current = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      const p = scrollRef.current;

      // Pure black opening at 0%
      if (p < 0.08) {
        return;
      }

      // Atmospheric reveal mapped to scroll progress
      // 0.08 -> 0.25: Subtle emergence
      // 0.25 -> 0.85: Full intensity
      // 0.85 -> 1.00: Prepares for next layer
      let masterAlpha = 0;
      if (p >= 0.08 && p < 0.28) {
        masterAlpha = (p - 0.08) / 0.20;
      } else if (p >= 0.28 && p <= 0.88) {
        masterAlpha = 1.0;
      } else if (p > 0.88) {
        masterAlpha = Math.max(0, 1 - (p - 0.88) / 0.12);
      }

      // Draw faint 0101 streams
      const drops = dropsRef.current;
      ctx.font = '12px "Share Tech Mono", monospace';
      ctx.textAlign = 'center';

      for (let i = 0; i < drops.length; i++) {
        // Draw alternate columns based on scroll depth
        if (i % 2 === 0 && p < 0.35) continue;

        const drop = drops[i];
        drop.y += drop.speed;
        if (drop.y - drop.length * 18 > height) {
          drop.y = -100;
          for (let c = 0; c < drop.length; c++) {
            drop.chars[c] = Math.random() > 0.5 ? '1' : '0';
          }
        }

        for (let c = 0; c < drop.length; c++) {
          const charY = drop.y - c * 16;
          if (charY < -20 || charY > height + 20) continue;

          // Head of the stream is brighter
          if (c === 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${drop.opacity * masterAlpha * 0.9})`;
          } else if (c < 3) {
            ctx.fillStyle = `rgba(134, 239, 172, ${drop.opacity * masterAlpha * 0.75})`;
          } else {
            ctx.fillStyle = `rgba(34, 197, 94, ${(drop.opacity * masterAlpha * (drop.length - c)) / drop.length * 0.5})`;
          }

          ctx.fillText(drop.chars[c], drop.x, charY);
        }
      }

      // Draw subtle telemetry coordinates along screen borders
      if (p >= 0.20) {
        const borderAlpha = Math.min(1, (p - 0.20) / 0.15) * masterAlpha * 0.65;
        ctx.fillStyle = `rgba(74, 222, 128, ${borderAlpha})`;
        ctx.font = '10px "Share Tech Mono", monospace';

        // Top Left Coordinates
        ctx.textAlign = 'left';
        ctx.fillText('SUBSTRATE // TENSOR_MAP [0x8A4F]', 32, 42);
        ctx.fillText(`PHASE_OFFSET: ${(p * 360).toFixed(1)}° // SYNC_OK`, 32, 58);

        // Top Right Telemetry
        ctx.textAlign = 'right';
        ctx.fillText('TOPOLOGY: 4D_HYPERCUBE_PROJECTION', width - 32, 42);
        ctx.fillText(`ENTROPY_INDEX: ${(0.024 + p * 0.08).toFixed(4)}`, width - 32, 58);

        // Bottom Left Axis
        ctx.textAlign = 'left';
        ctx.fillText(`VECTOR: [${(p * 2.4).toFixed(3)}, ${(Math.sin(p * 4) * 1.5).toFixed(3)}, ${(-p * 8.2).toFixed(3)}]`, 32, height - 38);
        ctx.fillText('RECURSION_DEPTH: LEVEL_02_DEEP', 32, height - 22);

        // Bottom Right
        ctx.textAlign = 'right';
        ctx.fillText('CHAMBER // DEEP_MATHEMATICAL_SUBSTRATE', width - 32, height - 38);
        ctx.fillText('STATUS // NON_AUTOPLAY_SCROLL_LOCKED', width - 32, height - 22);
      }
    };

    animIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Compute soft atmospheric radial glow vignette
  let atmosphereOpacity = 0;
  if (scrollProgress >= 0.15 && scrollProgress < 0.40) {
    atmosphereOpacity = (scrollProgress - 0.15) / 0.25;
  } else if (scrollProgress >= 0.40 && scrollProgress <= 0.88) {
    atmosphereOpacity = 1.0;
  } else if (scrollProgress > 0.88) {
    atmosphereOpacity = Math.max(0, 1 - (scrollProgress - 0.88) / 0.12);
  }

  return (
    <div
      id="deep-atmosphere-container"
      className="absolute inset-0 w-full h-full pointer-events-none z-15 overflow-hidden"
      aria-hidden="true"
    >
      {/* 2D High-precision binary & telemetry canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Atmospheric emerald center glow */}
      <div
        className="absolute inset-0 w-full h-full transition-opacity duration-300"
        style={{
          opacity: atmosphereOpacity * 0.35,
          background:
            'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.12) 0%, rgba(16, 185, 129, 0.05) 45%, rgba(0, 0, 0, 0) 80%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Subtle Matrix scanline texture */}
      <div className="absolute inset-0 w-full h-full bg-cinematic-scanline opacity-15 pointer-events-none" />
    </div>
  );
}
