/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';

interface DeepTitleProps {
  scrollProgress: number; // 0.0 to 1.0
}

const DEEP_LETTERS = ['D', 'E', 'E', 'P'];
const MATH_SYMBOLS = ['∇', '∂', '∫', '∑', 'ħ', 'Ψ', 'λ', '∞', '∮', '⊗', '⊕', '√'];
const BINARY_CHARS = ['0', '1'];

export default function DeepTitle({ scrollProgress }: DeepTitleProps) {
  // Timeline boundaries for DEEP title reveal:
  // < 0.18: Pure black, zero title
  // 0.18 -> 0.32: Symbols and binary fragments emerge
  // 0.32 -> 0.45: Resolves into full display word DEEP + LAYER 02
  // 0.45 -> 0.65: Full prominence
  // 0.65 -> 0.82: Smoothly translates upward and fades into the deep mathematical field
  // > 0.82: Hidden
  const isVisible = scrollProgress >= 0.18 && scrollProgress <= 0.85;

  const { titleOpacity, titleTranslateY, charStates, subLayerAlpha } = useMemo(() => {
    if (scrollProgress < 0.18 || scrollProgress > 0.85) {
      return {
        titleOpacity: 0,
        titleTranslateY: 40,
        charStates: DEEP_LETTERS.map(() => ({ char: '', isLocked: false, isGlitch: false })),
        subLayerAlpha: 0,
      };
    }

    let opacity = 1;
    let translateY = 0;

    // Entry phase (0.18 to 0.35)
    if (scrollProgress < 0.35) {
      const t = (scrollProgress - 0.18) / 0.17;
      opacity = Math.pow(t, 1.2);
      translateY = (1 - t) * 35; // Rises into view
    }
    // Exit phase (0.65 to 0.85)
    else if (scrollProgress > 0.65) {
      const t = (scrollProgress - 0.65) / 0.20;
      opacity = Math.max(0, 1 - Math.pow(t, 1.4));
      translateY = -t * 60; // Floats upward into the darkness
    }

    // Sub-layer badge alpha
    const subLayerAlpha =
      scrollProgress < 0.28
        ? 0
        : scrollProgress < 0.40
        ? (scrollProgress - 0.28) / 0.12
        : opacity;

    // Determine character states based on scroll progress
    // Progressively lock each letter from left to right as scroll advances from 0.22 to 0.40
    const lockThresholds = [0.24, 0.29, 0.34, 0.39];

    const charStates = DEEP_LETTERS.map((targetChar, index) => {
      const threshold = lockThresholds[index];
      const isLocked = scrollProgress >= threshold;

      if (isLocked) {
        return {
          char: targetChar,
          isLocked: true,
          isGlitch: false,
        };
      }

      // If close to locking (within 0.04), flicker between binary and target
      if (scrollProgress >= threshold - 0.04) {
        const pseudorandom = (Math.sin(scrollProgress * 1500 + index * 42) + 1) / 2;
        return {
          char: pseudorandom > 0.5 ? targetChar : BINARY_CHARS[Math.floor(pseudorandom * 2)],
          isLocked: false,
          isGlitch: true,
        };
      }

      // Early phase: mathematical symbol
      const symIndex = Math.abs(Math.floor(scrollProgress * 80 + index * 3)) % MATH_SYMBOLS.length;
      return {
        char: MATH_SYMBOLS[symIndex],
        isLocked: false,
        isGlitch: false,
      };
    });

    return {
      titleOpacity: opacity,
      titleTranslateY: translateY,
      charStates,
      subLayerAlpha,
    };
  }, [scrollProgress]);

  if (!isVisible || titleOpacity <= 0.001) {
    return null;
  }

  return (
    <div
      id="deep-section-title-overlay"
      style={{
        transform: `translate3d(0, ${titleTranslateY}px, 0)`,
        opacity: titleOpacity,
      }}
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30 select-none will-change-transform"
      aria-label="DEEP LAYER 02"
    >
      {/* Upper Technical Identification Bar */}
      <div
        className="flex items-center gap-3 font-matrix-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#86efac] mb-3 sm:mb-4 px-4 py-1 bg-black/60 border border-[#22c55e]/30 backdrop-blur-sm"
        style={{ opacity: subLayerAlpha }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
        <span>RECURSIVE ARCHITECTURE // SUBSTRATE</span>
        <span className="text-neutral-500">|</span>
        <span className="text-[#4ade80]">DIM: 4D_PROJECTION</span>
      </div>

      {/* Main DEEP Title Display Typography */}
      <h2
        id="deep-main-heading"
        className="font-matrix-display font-black tracking-[0.24em] sm:tracking-[0.32em] md:tracking-[0.38em] text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase text-white flex items-center justify-center gap-2 sm:gap-4"
        style={{
          textShadow:
            '0 0 35px rgba(74, 222, 128, 0.45), 0 0 80px rgba(34, 197, 94, 0.2), 0 0 10px rgba(255, 255, 255, 0.8)',
        }}
      >
        {charStates.map((state, i) => (
          <span
            key={`deep-char-${i}`}
            className={`inline-block transition-all duration-75 min-w-[0.75em] text-center ${
              state.isLocked
                ? 'text-[#f0fdf4]'
                : state.isGlitch
                ? 'text-[#86efac] drop-shadow-[0_0_12px_#4ade80]'
                : 'text-[#4ade80]/80 font-matrix-mono text-[0.8em]'
            }`}
          >
            {state.char}
          </span>
        ))}
      </h2>

      {/* Secondary Layer Designation: LAYER 02 */}
      <div
        className="mt-3 sm:mt-5 flex items-center gap-4 font-matrix-mono text-xs sm:text-sm tracking-[0.35em] uppercase text-neutral-300"
        style={{ opacity: subLayerAlpha }}
      >
        <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#4ade80]/60" />
        <span className="font-semibold text-[#86efac] bg-black/40 px-3 py-1 border border-[#22c55e]/25">
          LAYER 02
        </span>
        <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#4ade80]/60" />
      </div>

      {/* Micro Status Footnote */}
      <div
        className="mt-3 font-matrix-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-[#4ade80]/70 uppercase"
        style={{ opacity: subLayerAlpha * 0.8 }}
      >
        [ MATHEMATICAL FOUNDATION UNLOCKED ]
      </div>
    </div>
  );
}
