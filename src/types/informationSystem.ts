/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ElementType =
  | 'equation'
  | 'symbol'
  | 'structure'
  | 'neural'
  | 'stream'
  | 'geometry'
  | 'construct';

export interface ElementInfo {
  /** Unique element identifier (e.g., 'schrodinger-dynamics', 'tesseract-4d') */
  id: string;
  /** Formal display title of the element */
  name: string;
  /** Categorical classification type */
  type: ElementType;
  /** Domain or subsystem category (e.g. 'QUANTUM FIELD // WAVE FUNCTION') */
  category: string;
  /** Core mathematical equation or symbolic expression, if applicable */
  formulaOrSymbol?: string;
  /** Fundamental theoretical meaning of the element */
  meaning: string;
  /** Detailed explanation of what the element is */
  description: string;
  /** Conceptual and functional role inside the DEEP section / substrate */
  roleInDeep: string;
  /** Generalized section role (reusable for future sections) */
  roleInSection?: string;
  /** Reference 3D coordinates or mesh index in the DEEP environment */
  elementIndex?: number;
}

export interface SectionInfo {
  /** Unique section identifier ('surface', 'deep', etc.) */
  id: string;
  /** Section code ('01', '02', etc.) */
  sectionCode: string;
  /** Section display name */
  name: string;
  /** Contextual subtitle */
  subtitle: string;
  /** High-level summary statement */
  summary: string;
  /** What this section represents conceptually */
  whatItRepresents: string;
  /** What the observer is seeing visually */
  whatYouAreSeeing: string;
  /** What the interactive mechanics in this section signify */
  interactionMeaning: string;
  /** How this layer relates to entering the Matrix */
  relationToMatrix: string;
  /** Conceptual distinction from previous layers (e.g. DEEP vs SURFACE) */
  distinctionFromPrevious?: string;
  /** Technical telemetry badges */
  telemetryBadges: string[];
}
