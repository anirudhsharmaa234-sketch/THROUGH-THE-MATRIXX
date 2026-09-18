/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';

interface HeroTitleProps {
  onDecoded?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const TARGET_TEXT = 'THROUGH THE MATRIX';
const BINARY_CHARS = ['0', '1'];
const FRAGMENT_CHARS = ['0', '1', '1', '0', '0', '1', '/', '|'];

type Stage = 'dark' | 'scattered' | 'converging' | 'decoding' | 'resolved';

export default function HeroTitle({ onDecoded, style, className }: HeroTitleProps) {
  const [stage, setStage] = useState<Stage>('dark');
  const [resolvedCount, setResolvedCount] = useState<number>(0);
  const [activeChars, setActiveChars] = useState<string[]>(() =>
    Array(TARGET_TEXT.length).fill('')
  );
  const [recentlyLocked, setRecentlyLocked] = useState<boolean[]>(() =>
    Array(TARGET_TEXT.length).fill(false)
  );

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  const startAnimation = () => {
    setStage('dark');
    setResolvedCount(0);
    setActiveChars(Array(TARGET_TEXT.length).fill(''));
    setRecentlyLocked(Array(TARGET_TEXT.length).fill(false));
    startTimeRef.current = performance.now();
    lastTickRef.current = 0;
  };

  useEffect(() => {
    startAnimation();

    const loop = (now: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = now;
      }
      const elapsed = now - startTimeRef.current;

      // 1. Stage: Dark Screen (0 - 450ms)
      if (elapsed < 450) {
        setStage('dark');
      }
      // 2. Stage: Scattered 0/1 characters (450ms - 1100ms)
      else if (elapsed < 1100) {
        setStage('scattered');
        // Update random binary characters at ~50ms intervals
        if (now - lastTickRef.current > 55) {
          lastTickRef.current = now;
          setActiveChars(
            TARGET_TEXT.split('').map((char) =>
              char === ' '
                ? ' '
                : BINARY_CHARS[Math.floor(Math.random() * BINARY_CHARS.length)]
            )
          );
        }
      }
      // 3. Stage: Binary converges into letter shapes (1100ms - 1700ms)
      else if (elapsed < 1700) {
        setStage('converging');
        if (now - lastTickRef.current > 45) {
          lastTickRef.current = now;
          setActiveChars(
            TARGET_TEXT.split('').map((char) =>
              char === ' '
                ? ' '
                : Math.random() > 0.15
                ? BINARY_CHARS[Math.floor(Math.random() * BINARY_CHARS.length)]
                : FRAGMENT_CHARS[Math.floor(Math.random() * FRAGMENT_CHARS.length)]
            )
          );
        }
      }
      // 4. Stage: Progressive decoding into TARGET_TEXT (1700ms - 3400ms)
      else if (elapsed < 3500) {
        setStage('decoding');
        const decodeProgress = (elapsed - 1700) / 1700; // 0 to 1
        const targetResolved = Math.min(
          TARGET_TEXT.length,
          Math.floor(decodeProgress * (TARGET_TEXT.length + 1))
        );

        setResolvedCount((prev) => {
          if (targetResolved > prev) {
            // Flash recently locked letters
            setRecentlyLocked((prevLocked) => {
              const next = [...prevLocked];
              for (let i = prev; i < targetResolved; i++) {
                next[i] = true;
              }
              return next;
            });
            // Clear lock flash after 120ms
            setTimeout(() => {
              setRecentlyLocked((prevLocked) => {
                const next = [...prevLocked];
                for (let i = prev; i < targetResolved; i++) {
                  next[i] = false;
                }
                return next;
              });
            }, 120);
          }
          return targetResolved;
        });

        if (now - lastTickRef.current > 38) {
          lastTickRef.current = now;
          setActiveChars((prev) =>
            TARGET_TEXT.split('').map((char, index) => {
              if (index < targetResolved) {
                return char;
              }
              if (char === ' ') return ' ';
              return Math.random() > 0.2
                ? BINARY_CHARS[Math.floor(Math.random() * BINARY_CHARS.length)]
                : FRAGMENT_CHARS[Math.floor(Math.random() * FRAGMENT_CHARS.length)];
            })
          );
        }
      }
      // 5. Stage: Resolved & Clean Stable State
      else {
        setStage('resolved');
        setResolvedCount(TARGET_TEXT.length);
        setActiveChars(TARGET_TEXT.split(''));
        setRecentlyLocked(Array(TARGET_TEXT.length).fill(false));
        if (onDecoded) onDecoded();
        return; // Halt loop
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Split target text into words to guarantee robust responsive wrapping without breaking individual words
  const words = ['THROUGH', 'THE', 'MATRIX'];
  let charCursor = 0;

  return (
    <div
      id="hero-title-container"
      style={style}
      className={`relative z-20 flex flex-col items-center justify-center px-4 sm:px-6 select-none pointer-events-auto cursor-default ${className || ''}`}
      onClick={stage === 'resolved' ? startAnimation : undefined}
      title={stage === 'resolved' ? 'Click to replay decoding sequence' : undefined}
    >
      {/* Subtle Binary Stream Telemetry during initial decoding stages */}
      <div
        id="hero-binary-stream-tracker"
        className={`font-matrix-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase transition-opacity duration-700 mb-3 sm:mb-5 ${
          stage === 'scattered' || stage === 'converging'
            ? 'opacity-40 text-[#4ade80]'
            : stage === 'decoding'
            ? 'opacity-20 text-[#22c55e]'
            : 'opacity-0 text-transparent pointer-events-none'
        }`}
        aria-hidden="true"
      >
        <span>
          {stage === 'scattered' && '0101 0010 1101 0101 // INITIALIZING'}
          {stage === 'converging' && '1011 0100 0011 1110 // CONVERGING DATA'}
          {stage === 'decoding' && '0111 0010 0110 0101 // RESOLVING GLYPHS'}
          {stage === 'resolved' && ''}
          {stage === 'dark' && ''}
        </span>
      </div>

      {/* Main Hero Display Title */}
      <h1
        id="hero-main-title"
        className={`font-matrix-display font-bold uppercase text-center transition-all duration-500 ${
          stage === 'dark'
            ? 'opacity-0'
            : stage === 'scattered'
            ? 'opacity-70 blur-[0.6px]'
            : stage === 'converging'
            ? 'opacity-90'
            : 'opacity-100'
        }`}
        style={{
          textShadow:
            stage === 'resolved'
              ? '0 0 24px rgba(74, 222, 128, 0.18), 0 0 4px rgba(255, 255, 255, 0.4)'
              : '0 0 16px rgba(74, 222, 128, 0.4)',
        }}
        aria-label={TARGET_TEXT}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-[0.35em] sm:gap-x-[0.4em] md:gap-x-[0.45em] gap-y-1">
          {words.map((word, wordIndex) => {
            const wordChars = word.split('');
            const startIndex = charCursor;
            charCursor += wordChars.length + (wordIndex < words.length - 1 ? 1 : 0);

            return (
              <span
                key={`word-${wordIndex}`}
                className="inline-flex items-center tracking-[0.18em] sm:tracking-[0.24em] md:tracking-[0.28em] lg:tracking-[0.32em] text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
              >
                {wordChars.map((targetLetter, letterOffset) => {
                  const globalIndex = startIndex + letterOffset;
                  const isResolved = globalIndex < resolvedCount || stage === 'resolved';
                  const isLockedFlash = recentlyLocked[globalIndex];
                  const currentChar = isResolved
                    ? targetLetter
                    : activeChars[globalIndex] || '0';

                  // Dynamic styles for the individual character state
                  let charColor = 'text-[#eefbf1]';
                  let charFont = 'font-matrix-display';
                  let extraEffects = '';

                  if (stage === 'scattered') {
                    charColor = 'text-[#4ade80]/70';
                    charFont = 'font-matrix-mono';
                  } else if (stage === 'converging') {
                    charColor = 'text-[#38ef7d]';
                    charFont = 'font-matrix-mono';
                  } else if (stage === 'decoding') {
                    if (isResolved) {
                      charColor = isLockedFlash
                        ? 'text-white drop-shadow-[0_0_12px_#ffffff]'
                        : 'text-[#eefbf1]';
                      charFont = 'font-matrix-display';
                    } else {
                      charColor = 'text-[#4ade80]';
                      charFont = 'font-matrix-mono';
                      // Subtle flicker only during decoding
                      if (Math.random() > 0.85) {
                        extraEffects = 'opacity-60 scale-95';
                      }
                    }
                  } else if (stage === 'resolved') {
                    charColor = 'text-[#f0fcf3]';
                    charFont = 'font-matrix-display';
                  }

                  const scatterStyle =
                    stage === 'scattered'
                      ? {
                          transform: `translate(${((globalIndex * 7) % 6) - 3}px, ${((globalIndex * 11) % 6) - 3}px)`,
                        }
                      : undefined;

                  return (
                    <span
                      key={`char-${globalIndex}`}
                      style={scatterStyle}
                      className={`inline-block transition-all duration-75 min-w-[0.62em] text-center ${charColor} ${charFont} ${extraEffects}`}
                    >
                      {currentChar}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </div>
      </h1>

      {/* Subtle baseline system rule anchor strictly as part of title interface grounding */}
      <div
        id="hero-title-baseline"
        className={`mt-4 sm:mt-6 h-[1px] bg-gradient-to-r from-transparent via-[#22c55e]/30 to-transparent transition-all duration-1000 ${
          stage === 'resolved'
            ? 'w-32 sm:w-48 md:w-64 opacity-60'
            : stage === 'decoding'
            ? 'w-16 sm:w-24 opacity-30'
            : 'w-0 opacity-0'
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
