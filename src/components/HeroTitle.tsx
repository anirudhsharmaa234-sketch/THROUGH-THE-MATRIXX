/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface HeroTitleProps {
  onDecoded?: () => void;
  style?: React.CSSProperties;
  className?: string;
  scrollProgress?: number;
}

const TARGET_TEXT = 'THROUGH THE MATRIX';
const BINARY_CHARS = ['0', '1'];
const FRAGMENT_CHARS = ['0', '1', '1', '0', '0', '1', '/', '|'];

type Stage = 'dark' | 'scattered' | 'converging' | 'decoding' | 'resolved' | 'dissolving';

// Pre-calculated organic dissolve thresholds for each character (wave right-to-left with natural jitter)
const DISSOLVE_THRESHOLDS = TARGET_TEXT.split('').map((char, index) => {
  if (char === ' ') return 1.0;
  const revNormalized = (TARGET_TEXT.length - 1 - index) / (TARGET_TEXT.length - 1);
  const organicJitter = (((index * 17 + 5) % 7) - 3) * 0.035;
  return Math.max(0.04, Math.min(0.92, revNormalized * 0.82 + 0.06 + organicJitter));
});

export default function HeroTitle({ onDecoded, style, className, scrollProgress }: HeroTitleProps) {
  const [stage, setStage] = useState<Stage>('dark');
  const [resolvedCount, setResolvedCount] = useState<number>(0);
  const [activeChars, setActiveChars] = useState<string[]>(() =>
    Array(TARGET_TEXT.length).fill('')
  );
  const [recentlyLocked, setRecentlyLocked] = useState<boolean[]>(() =>
    Array(TARGET_TEXT.length).fill(false)
  );
  const [recentlyDissolved, setRecentlyDissolved] = useState<boolean[]>(() =>
    Array(TARGET_TEXT.length).fill(false)
  );
  const [dissolvedMask, setDissolvedMask] = useState<boolean[]>(() =>
    Array(TARGET_TEXT.length).fill(false)
  );

  const animationFrameRef = useRef<number | null>(null);
  const cycleStartTimeRef = useRef<number | null>(null);
  const cycleIndexRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);
  const tickCounterRef = useRef<number>(0);
  const isAtTopRef = useRef<boolean>(true);
  const scrollProgressRef = useRef<number | undefined>(scrollProgress);
  scrollProgressRef.current = scrollProgress;

  const returnToTopTimeoutRef = useRef<number | null>(null);
  const stageRef = useRef<Stage>('dark');
  stageRef.current = stage;

  // Settle title immediately to static resolved state on downward scroll
  const settleToResolved = useCallback(() => {
    setStage('resolved');
    setResolvedCount(TARGET_TEXT.length);
    setActiveChars(TARGET_TEXT.split(''));
    setRecentlyLocked(Array(TARGET_TEXT.length).fill(false));
    setRecentlyDissolved(Array(TARGET_TEXT.length).fill(false));
    setDissolvedMask(Array(TARGET_TEXT.length).fill(false));
  }, []);

  // Gracefully resume animation cycle from resolved state after user returns to top
  const resumeLoopFromResolved = useCallback(() => {
    if (!isAtTopRef.current) return;
    // Set cycle start time so that it begins with a brief hold then dissolves
    // In our loop math: resolved hold runs from 0 to 2200ms, then dissolving starts at 2200ms
    cycleIndexRef.current += 1;
    cycleStartTimeRef.current = performance.now() - 1400; // 800ms remaining in hold, then dissolves
    setStage('resolved');
    setResolvedCount(TARGET_TEXT.length);
    setActiveChars(TARGET_TEXT.split(''));
    setDissolvedMask(Array(TARGET_TEXT.length).fill(false));
    setRecentlyLocked(Array(TARGET_TEXT.length).fill(false));
    setRecentlyDissolved(Array(TARGET_TEXT.length).fill(false));

    // Ensure animation frame loop is running
    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(runAnimationLoop);
    }
  }, []);

  // Main high-performance animation frame loop
  const runAnimationLoop = useCallback((now: number) => {
    // If user has scrolled down, pause loop immediately to save CPU/GPU cycles
    if (!isAtTopRef.current) {
      animationFrameRef.current = null;
      return;
    }

    if (!cycleStartTimeRef.current) {
      cycleStartTimeRef.current = now;
    }

    const isFirstCycle = cycleIndexRef.current === 0;

    // Timeline Configuration (ms)
    // First cycle includes initial dark boot sequence (380ms)
    const DARK_DURATION = isFirstCycle ? 380 : 0;
    const SCATTER_DURATION = 650;
    const CONVERGE_DURATION = 600;
    const DECODE_DURATION = 1600;
    const HOLD_DURATION = 2200; // Brief completed hold
    const DISSOLVE_DURATION = 1400; // Dissolves back into 0101 data

    const scatterStart = DARK_DURATION;
    const convergeStart = scatterStart + SCATTER_DURATION;
    const decodeStart = convergeStart + CONVERGE_DURATION;
    const resolvedStart = decodeStart + DECODE_DURATION;
    const dissolveStart = resolvedStart + HOLD_DURATION;
    const cycleTotalDuration = dissolveStart + DISSOLVE_DURATION;

    const elapsed = now - cycleStartTimeRef.current;

    // 0. Stage: Initial Dark Boot (first cycle only)
    if (elapsed < DARK_DURATION) {
      if (stageRef.current !== 'dark') setStage('dark');
    }
    // 1. Stage: Scattered 0101 binary data particles
    else if (elapsed < convergeStart) {
      if (stageRef.current !== 'scattered') {
        setStage('scattered');
        setResolvedCount(0);
        setDissolvedMask(Array(TARGET_TEXT.length).fill(false));
        setRecentlyLocked(Array(TARGET_TEXT.length).fill(false));
        setRecentlyDissolved(Array(TARGET_TEXT.length).fill(false));
      }

      if (now - lastTickRef.current > 55) {
        lastTickRef.current = now;
        tickCounterRef.current += 1;
        setActiveChars(
          TARGET_TEXT.split('').map((char) =>
            char === ' ' ? ' ' : BINARY_CHARS[Math.floor(Math.random() * BINARY_CHARS.length)]
          )
        );
      }
    }
    // 2. Stage: Binary converges into letter alignments
    else if (elapsed < decodeStart) {
      if (stageRef.current !== 'converging') {
        setStage('converging');
      }

      if (now - lastTickRef.current > 45) {
        lastTickRef.current = now;
        tickCounterRef.current += 1;
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
    // 3. Stage: Progressive decoding into TARGET_TEXT
    else if (elapsed < resolvedStart) {
      if (stageRef.current !== 'decoding') {
        setStage('decoding');
      }

      const decodeProgress = (elapsed - decodeStart) / DECODE_DURATION;
      const targetResolved = Math.min(
        TARGET_TEXT.length,
        Math.floor(decodeProgress * (TARGET_TEXT.length + 1))
      );

      setResolvedCount((prev) => {
        if (targetResolved > prev) {
          // Flash newly locked letters in bright white
          setRecentlyLocked((prevLocked) => {
            const next = [...prevLocked];
            for (let i = prev; i < targetResolved; i++) {
              next[i] = true;
            }
            return next;
          });
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
        tickCounterRef.current += 1;
        setActiveChars(
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
    // 4. Stage: Resolved & Brief Hold of "THROUGH THE MATRIX"
    else if (elapsed < dissolveStart) {
      if (stageRef.current !== 'resolved') {
        setStage('resolved');
        setResolvedCount(TARGET_TEXT.length);
        setActiveChars(TARGET_TEXT.split(''));
        setRecentlyLocked(Array(TARGET_TEXT.length).fill(false));
        setRecentlyDissolved(Array(TARGET_TEXT.length).fill(false));
        setDissolvedMask(Array(TARGET_TEXT.length).fill(false));
        if (isFirstCycle && onDecoded) onDecoded();
      }
    }
    // 5. Stage: Dissolving/Breaking title back into 0101 data
    else if (elapsed < cycleTotalDuration) {
      if (stageRef.current !== 'dissolving') {
        setStage('dissolving');
      }

      const dissolveProgress = (elapsed - dissolveStart) / DISSOLVE_DURATION;

      // Update character destabilization mask according to organic thresholds
      setDissolvedMask((prevMask) => {
        let changed = false;
        const nextMask = [...prevMask];
        for (let i = 0; i < TARGET_TEXT.length; i++) {
          if (TARGET_TEXT[i] === ' ') continue;
          const shouldDissolve = dissolveProgress >= DISSOLVE_THRESHOLDS[i];
          if (shouldDissolve && !nextMask[i]) {
            nextMask[i] = true;
            changed = true;
            // Trigger brief neon-green destabilization flash
            setRecentlyDissolved((prevDissolved) => {
              const updated = [...prevDissolved];
              updated[i] = true;
              return updated;
            });
            setTimeout(() => {
              setRecentlyDissolved((prevDissolved) => {
                const updated = [...prevDissolved];
                updated[i] = false;
                return updated;
              });
            }, 120);
          }
        }
        return changed ? nextMask : prevMask;
      });

      if (now - lastTickRef.current > 42) {
        lastTickRef.current = now;
        tickCounterRef.current += 1;
        setActiveChars(
          TARGET_TEXT.split('').map((char, index) => {
            if (char === ' ') return ' ';
            const isCharDissolved = dissolveProgress >= DISSOLVE_THRESHOLDS[index];
            if (!isCharDissolved) {
              return char; // Still holds resolved letter until wave reaches it
            }
            // Dissolved into active binary data stream
            return Math.random() > 0.15
              ? BINARY_CHARS[Math.floor(Math.random() * BINARY_CHARS.length)]
              : FRAGMENT_CHARS[Math.floor(Math.random() * FRAGMENT_CHARS.length)];
          })
        );
      }
    }
    // 6. Complete Cycle -> Seamlessly restart decode sequence from 0101 data
    else {
      cycleIndexRef.current += 1;
      cycleStartTimeRef.current = now;
      setStage('scattered');
      setResolvedCount(0);
      setDissolvedMask(Array(TARGET_TEXT.length).fill(false));
      setRecentlyLocked(Array(TARGET_TEXT.length).fill(false));
      setRecentlyDissolved(Array(TARGET_TEXT.length).fill(false));
      setActiveChars(
        TARGET_TEXT.split('').map((char) =>
          char === ' ' ? ' ' : BINARY_CHARS[Math.floor(Math.random() * BINARY_CHARS.length)]
        )
      );
    }

    // Schedule next frame in single continuous loop
    animationFrameRef.current = requestAnimationFrame(runAnimationLoop);
  }, [onDecoded]);

  // Initial boot and scroll monitor setup
  useEffect(() => {
    isAtTopRef.current =
      (scrollProgressRef.current === undefined || scrollProgressRef.current <= 0.015) &&
      window.scrollY <= 25;

    // Start single animation loop
    animationFrameRef.current = requestAnimationFrame(runAnimationLoop);

    const handleScrollCheck = () => {
      const propVal = scrollProgressRef.current;
      const isScrolledDown =
        (propVal !== undefined && propVal > 0.015) || window.scrollY > 25;

      if (isScrolledDown && isAtTopRef.current) {
        // Detected meaningful downward scroll -> stop intro loop & gracefully settle
        isAtTopRef.current = false;
        if (returnToTopTimeoutRef.current) {
          clearTimeout(returnToTopTimeoutRef.current);
          returnToTopTimeoutRef.current = null;
        }
        settleToResolved();
      } else if (!isScrolledDown && !isAtTopRef.current) {
        // Returned to top of page -> debounce and gracefully resume single loop
        if (returnToTopTimeoutRef.current) {
          clearTimeout(returnToTopTimeoutRef.current);
        }
        returnToTopTimeoutRef.current = window.setTimeout(() => {
          const currentScrolledDown =
            (scrollProgressRef.current !== undefined && scrollProgressRef.current > 0.015) ||
            window.scrollY > 25;
          if (!currentScrolledDown) {
            isAtTopRef.current = true;
            resumeLoopFromResolved();
          }
        }, 800);
      }
    };

    window.addEventListener('scroll', handleScrollCheck, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollCheck);
      if (returnToTopTimeoutRef.current) {
        clearTimeout(returnToTopTimeoutRef.current);
      }
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [runAnimationLoop, settleToResolved, resumeLoopFromResolved]);

  // Handle prop changes for scrollProgress
  useEffect(() => {
    const isScrolledDown =
      (scrollProgress !== undefined && scrollProgress > 0.015) || window.scrollY > 25;

    if (isScrolledDown && isAtTopRef.current) {
      isAtTopRef.current = false;
      if (returnToTopTimeoutRef.current) {
        clearTimeout(returnToTopTimeoutRef.current);
        returnToTopTimeoutRef.current = null;
      }
      settleToResolved();
    } else if (!isScrolledDown && !isAtTopRef.current) {
      if (returnToTopTimeoutRef.current) {
        clearTimeout(returnToTopTimeoutRef.current);
      }
      returnToTopTimeoutRef.current = window.setTimeout(() => {
        const currentScrolledDown =
          (scrollProgressRef.current !== undefined && scrollProgressRef.current > 0.015) ||
          window.scrollY > 25;
        if (!currentScrolledDown) {
          isAtTopRef.current = true;
          resumeLoopFromResolved();
        }
      }, 800);
    }
  }, [scrollProgress, settleToResolved, resumeLoopFromResolved]);

  // Click to replay decoding sequence
  const handleManualReplay = () => {
    if (!isAtTopRef.current) return;
    cycleIndexRef.current += 1;
    cycleStartTimeRef.current = performance.now();
    setStage('scattered');
    setResolvedCount(0);
    setDissolvedMask(Array(TARGET_TEXT.length).fill(false));
    setRecentlyLocked(Array(TARGET_TEXT.length).fill(false));
    setRecentlyDissolved(Array(TARGET_TEXT.length).fill(false));
    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(runAnimationLoop);
    }
  };

  // Split target text into words for responsive wrapping without breaking individual words
  const words = ['THROUGH', 'THE', 'MATRIX'];
  let charCursor = 0;

  return (
    <div
      id="hero-title-container"
      style={style}
      className={`relative z-20 flex flex-col items-center justify-center px-4 sm:px-6 select-none pointer-events-auto cursor-default ${className || ''}`}
      onClick={stage === 'resolved' ? handleManualReplay : undefined}
      title={stage === 'resolved' ? 'Click to trigger decode sequence' : undefined}
    >
      {/* Subtle Binary Stream Telemetry during active decoding and dissolving states */}
      <div
        id="hero-binary-stream-tracker"
        className={`font-matrix-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase transition-opacity duration-500 mb-3 sm:mb-5 ${
          stage === 'scattered' || stage === 'converging'
            ? 'opacity-40 text-[#4ade80]'
            : stage === 'decoding'
            ? 'opacity-30 text-[#22c55e]'
            : stage === 'dissolving'
            ? 'opacity-35 text-[#4ade80]'
            : 'opacity-0 text-transparent pointer-events-none'
        }`}
        aria-hidden="true"
      >
        <span>
          {stage === 'scattered' && '0101 0010 1101 0101 // INITIALIZING'}
          {stage === 'converging' && '1011 0100 0011 1110 // CONVERGING DATA'}
          {stage === 'decoding' && '0111 0010 0110 0101 // RESOLVING GLYPHS'}
          {stage === 'dissolving' && '1100 0101 1010 0001 // DISSOLVING TO DATA'}
          {stage === 'resolved' && ''}
          {stage === 'dark' && ''}
        </span>
      </div>

      {/* Main Hero Display Title */}
      <h1
        id="hero-main-title"
        className={`font-matrix-display font-bold uppercase text-center transition-all duration-300 ${
          stage === 'dark'
            ? 'opacity-0'
            : stage === 'scattered'
            ? 'opacity-75 blur-[0.5px]'
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
                  const isLetterResolved =
                    globalIndex < resolvedCount || stage === 'resolved';
                  const isCharDissolved =
                    stage === 'dissolving' && dissolvedMask[globalIndex];
                  const isLockedFlash = recentlyLocked[globalIndex];
                  const isDissolveFlash = recentlyDissolved[globalIndex];

                  // Determine active character glyph
                  const currentChar = isCharDissolved
                    ? activeChars[globalIndex] || '0'
                    : isLetterResolved
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
                    if (isLetterResolved) {
                      charColor = isLockedFlash
                        ? 'text-white drop-shadow-[0_0_12px_#ffffff]'
                        : 'text-[#eefbf1]';
                      charFont = 'font-matrix-display';
                    } else {
                      charColor = 'text-[#4ade80]';
                      charFont = 'font-matrix-mono';
                      if (Math.random() > 0.85) {
                        extraEffects = 'opacity-60 scale-95';
                      }
                    }
                  } else if (stage === 'resolved') {
                    charColor = 'text-[#f0fcf3]';
                    charFont = 'font-matrix-display';
                  } else if (stage === 'dissolving') {
                    if (isCharDissolved) {
                      charColor = isDissolveFlash
                        ? 'text-white drop-shadow-[0_0_12px_#4ade80]'
                        : 'text-[#4ade80]';
                      charFont = 'font-matrix-mono';
                      if (Math.random() > 0.85) {
                        extraEffects = 'opacity-70 scale-95';
                      }
                    } else {
                      charColor = 'text-[#eefbf1]';
                      charFont = 'font-matrix-display';
                    }
                  }

                  const scatterStyle =
                    stage === 'scattered'
                      ? {
                          transform: `translate(${((globalIndex * 7) % 6) - 3}px, ${((globalIndex * 11) % 6) - 3}px)`,
                        }
                      : isCharDissolved
                      ? {
                          transform: `translate(${((globalIndex * 5 + tickCounterRef.current) % 5) - 2}px, ${((globalIndex * 7 + tickCounterRef.current) % 5) - 2}px)`,
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
        className={`mt-4 sm:mt-6 h-[1px] bg-gradient-to-r from-transparent via-[#22c55e]/30 to-transparent transition-all duration-700 ${
          stage === 'resolved'
            ? 'w-32 sm:w-48 md:w-64 opacity-60'
            : stage === 'decoding'
            ? 'w-16 sm:w-24 opacity-30'
            : stage === 'dissolving'
            ? 'w-8 sm:w-16 opacity-15'
            : 'w-0 opacity-0'
        }`}
        aria-hidden="true"
      />
    </div>
  );
}

