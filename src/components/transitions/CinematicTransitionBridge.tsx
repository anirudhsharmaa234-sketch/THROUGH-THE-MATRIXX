/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CinematicTransitionConfig,
  CinematicTransitionState,
} from '../../types/cinematicTransition.ts';
import TouchToEnterInteraction from './TouchToEnterInteraction.tsx';

export interface CinematicTransitionBridgeProps {
  /** Reusable transition configuration */
  config: CinematicTransitionConfig;
  /** Current progress of the source section (0.0 to 1.0) */
  sectionProgress: number;
  /** Whether this transition layer is currently active */
  isActive: boolean;
  /** Callback to request a specific frame index from the sequence player */
  onFrameOverride?: (frameIndex: number | null) => void;
  /** Callback when the peak white flash occurs */
  onFlashTrigger?: (intensity: number) => void;
  /** Callback when transition successfully completes and target section should take over */
  onTransitionComplete: () => void;
}

/**
 * REUSABLE CINEMATIC TRANSITION BRIDGE
 * 
 * Manages section transitions anchored to an EXACT CINEMATIC MOMENT:
 * 1. Frame range before contact -> normal scroll-controlled cinematic.
 * 2. Exact contact frame (triggerFrameIndex) -> hold state.
 * 3. Immediately after contact (reactionStartFrameIndex) -> 0101 data reaction begins.
 * 4. Contact hold state -> "TOUCH TO ENTER" appears at exact contact anchor.
 * 5. User activates -> activation sequence plays: digital reaction intensifies (activationEndFrameIndex).
 * 6. Flash peak (flashPeakFrameIndex) -> intense white ionization flash.
 * 7. Transition hand-off -> target section established.
 * 
 * Reusable across sections: each section later supplies its own CinematicTransitionConfig.
 */
export default function CinematicTransitionBridge({
  config,
  sectionProgress,
  isActive,
  onFrameOverride,
  onFlashTrigger,
  onTransitionComplete,
}: CinematicTransitionBridgeProps) {
  const [transitionState, setTransitionState] = useState<CinematicTransitionState>('idle');
  const [activationProgress, setActivationProgress] = useState<number>(0);

  const animFrameIdRef = useRef<number | null>(null);
  const stateRef = useRef<CinematicTransitionState>('idle');
  stateRef.current = transitionState;

  const triggerProgress = config.triggerProgress;
  const holdEndProgress = triggerProgress + config.holdWindow;

  // Monitor scroll progress to enter / leave hold state
  useEffect(() => {
    if (!isActive) {
      if (stateRef.current !== 'completed') {
        setTransitionState('idle');
        onFrameOverride?.(null);
      }
      return;
    }

    // Do not interrupt if actively running the activation/flash sequence
    if (stateRef.current === 'activating' || stateRef.current === 'flashing' || stateRef.current === 'completed') {
      return;
    }

    if (sectionProgress < triggerProgress) {
      // Prior to contact moment: normal cinematic scrubbing
      if (stateRef.current !== 'idle') {
        setTransitionState('idle');
        onFrameOverride?.(null);
      }
    } else if (sectionProgress >= triggerProgress && sectionProgress <= holdEndProgress) {
      // Reached the EXACT CONTACT MOMENT: hold state
      if (stateRef.current !== 'holding') {
        setTransitionState('holding');
        // Hold frame on the contact / 0101 start moment
        onFrameOverride?.(config.reactionStartFrameIndex);
      }
    } else if (sectionProgress > holdEndProgress) {
      // If user aggressively scrolls past hold window, auto-trigger activation
      if (stateRef.current === 'holding') {
        handleActivate();
      }
    }
  }, [sectionProgress, triggerProgress, holdEndProgress, isActive, config, onFrameOverride]);

  // Execute the continuous cinematic activation sequence:
  // Reaction intensifies -> frames advance rapidly -> peak flash -> target section
  const handleActivate = useCallback(() => {
    if (stateRef.current === 'activating' || stateRef.current === 'completed') return;

    setTransitionState('activating');
    const startTime = performance.now();
    const durationMs = 1200; // 1.2s high-impact cinematic activation sequence

    const { reactionStartFrameIndex, activationEndFrameIndex, flashPeakFrameIndex } = config;
    const totalFrameSpan = activationEndFrameIndex - reactionStartFrameIndex;

    const animateActivation = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      setActivationProgress(progress);

      if (progress < 0.65) {
        // Phase 1: 0101 Digital reaction intensifies (frames 43 -> 54)
        const frameT = progress / 0.65;
        // Ease-in acceleration
        const currentFrame = Math.round(reactionStartFrameIndex + Math.pow(frameT, 1.4) * totalFrameSpan);
        onFrameOverride?.(currentFrame);
        onFlashTrigger?.(Math.pow(frameT, 3) * 0.4); // subtle building ionization
      } else if (progress < 0.85) {
        // Phase 2: High-intensity white flash at flashPeakFrameIndex (frame 56)
        if (stateRef.current !== 'flashing') {
          setTransitionState('flashing');
        }
        onFrameOverride?.(flashPeakFrameIndex);
        const flashT = (progress - 0.65) / 0.20;
        // Bell-curve flash intensity
        const flashIntensity = Math.sin(flashT * Math.PI);
        onFlashTrigger?.(flashIntensity);
      } else {
        // Phase 3: Transition hands off into the target section
        onFlashTrigger?.(0);
        onFrameOverride?.(null);
        setTransitionState('completed');
        onTransitionComplete();
        return;
      }

      animFrameIdRef.current = requestAnimationFrame(animateActivation);
    };

    animFrameIdRef.current = requestAnimationFrame(animateActivation);
  }, [config, onFrameOverride, onFlashTrigger, onTransitionComplete]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  const isHolding = transitionState === 'holding';
  const isActivating = transitionState === 'activating';
  const isFlashing = transitionState === 'flashing';

  if (!isActive || (!isHolding && !isActivating && !isFlashing)) {
    return null;
  }

  return (
    <div
      id={`cinematic-transition-bridge-${config.id}`}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-30"
    >
      <TouchToEnterInteraction
        config={config.interaction}
        state={isFlashing ? 'flashing' : isActivating ? 'activating' : 'holding'}
        onActivate={handleActivate}
        activationProgress={activationProgress}
        frameNumber={config.triggerFrameIndex + 1}
      />
    </div>
  );
}
