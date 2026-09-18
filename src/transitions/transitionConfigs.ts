/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CinematicTransitionConfig } from '../types/cinematicTransition.ts';

/**
 * REUSABLE TRANSITION CONFIGURATION REGISTRY
 * 
 * Each section registers its OWN exact cinematic trigger point:
 * - Specific asset sequence & exact frame index / timestamp where the event happens.
 * - Exact source coordinates for the interaction anchor (e.g. fingertip contact point).
 * - Contextual interaction content ("TOUCH TO ENTER", "CONNECT", "ENTER CORE", etc.).
 * 
 * NOTE: As per guidelines, only SURFACE -> DEEP is implemented now.
 * Future section transitions (DEEP -> NETWORK, NETWORK -> SIMULATION, etc.)
 * will define their own entries here with their specific trigger moments.
 */

export const SURFACE_TO_DEEP_TRANSITION: CinematicTransitionConfig = {
  id: 'surface-to-deep',
  sourceSectionId: 'surface',
  targetSectionId: 'deep',

  // Exact cinematic frame anchors in Seq2 (1280x720 native):
  // Frame 42 (frame_043.webp): Agent finger makes contact with digital glass
  // Frame 43 (frame_044.webp): 0101 / digital code reaction begins around contact point
  // Frames 44-54: Reaction intensifies into full shockwave & code burst
  // Frame 56: Peak white flash ionization before substrate ingress
  triggerType: 'frame',
  sequenceId: 'seq2',
  triggerFrameIndex: 42,
  reactionStartFrameIndex: 43,
  activationEndFrameIndex: 54,
  flashPeakFrameIndex: 56,

  // Scroll mapping within Section 1
  // Progress 0.732 is the exact point where seq2 reaches frame 42 (finger contacts screen)
  // and frame 43 (0101 digital code reaction begins around contact point)
  triggerProgress: 0.732,
  holdWindow: 0.08,

  interaction: {
    actionLabel: 'TOUCH TO ENTER',
    statusBadge: 'CONTACT DETECTED // 0101 REACTION',
    subLabel: 'INITIALIZE SUBSTRATE INGRESS',
    telemetryCode: '01000101 01001110 01010100 01000101 01010010', // ASCII for "ENTER"
    anchor: {
      // Exact fingertip contact point in 1280x720 source coordinates:
      sourceX: 648,
      sourceY: 368,
      focalX: 0.50,
      focalY: 0.48,
    },
  },
};
