/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Reusable Cinematic Transition System Types
 * 
 * Defines the contract for section transitions anchored to EXACT cinematic moments
 * (specific frame indices or video timestamps) rather than generic section ends or arbitrary scroll percentages.
 */

export type TransitionTriggerType = 'frame' | 'timestamp';

export type CinematicTransitionState = 
  | 'idle'        // Normal scroll prior to contact/trigger moment
  | 'holding'     // Held at exact trigger moment; contextual interaction visible
  | 'activating'  // User triggered interaction; reaction intensifies rapidly
  | 'flashing'    // Peak flash/ionization moment
  | 'completed';  // Target section established and unlocked

export interface CinematicAnchorCoordinates {
  /** X coordinate in native source asset resolution (e.g. 1280 in 1280x720) */
  sourceX: number;
  /** Y coordinate in native source asset resolution (e.g. 720 in 1280x720) */
  sourceY: number;
  /** Subject focal point X for cover reframing (default 0.5) */
  focalX?: number;
  /** Subject focal point Y for cover reframing (default 0.48) */
  focalY?: number;
}

export interface CinematicInteractionConfig {
  /** Primary action label displayed on the trigger, e.g. "TOUCH TO ENTER" */
  actionLabel: string;
  /** Status badge text, e.g. "CONTACT DETECTED // PROTOCOL 01" */
  statusBadge: string;
  /** Sub-label description, e.g. "INITIALIZE SUBSTRATE INGRESS" */
  subLabel?: string;
  /** Binary or hexadecimal telemetry preview */
  telemetryCode?: string;
  /** Screen position anchor in source coordinates */
  anchor: CinematicAnchorCoordinates;
}

export interface CinematicTransitionConfig {
  /** Unique identifier for the transition */
  id: string;
  /** Source section key, e.g. "surface" */
  sourceSectionId: string;
  /** Target section key, e.g. "deep" */
  targetSectionId: string;

  /** Trigger mechanism: frame-based or timestamp-based */
  triggerType: TransitionTriggerType;
  /** Sequence identifier (e.g. "seq2" or "matrix_bg") */
  sequenceId: string;
  
  /** Exact frame index where contact/trigger occurs (0-indexed) */
  triggerFrameIndex: number;
  /** Frame index where initial data reaction (0101 code) begins */
  reactionStartFrameIndex: number;
  /** Frame range that plays out during the intensified activation sequence */
  activationEndFrameIndex: number;
  /** Frame index of the peak flash/ionization */
  flashPeakFrameIndex: number;

  /** Scroll progress anchor within the source section (0.0 to 1.0) */
  triggerProgress: number;
  /** Size of the scroll hold window at the contact moment */
  holdWindow: number;

  /** Contextual interaction configuration */
  interaction: CinematicInteractionConfig;
}
