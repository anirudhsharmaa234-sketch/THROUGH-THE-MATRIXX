/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DiscoveredObjectType = 'node' | 'wave' | 'data_block' | 'structure' | 'central_entity';

export interface DiscoveredObjectRecord {
  id: string;
  type: DiscoveredObjectType;
  identifier: string;
  typeLabel: string;
  discoveredAt: number; // Timestamp
  discoveryIndex: number;
}

export type MemoryEventStage =
  | 'dormant'             // < 3 discoveries
  | 'stabilizing'         // 3rd discovery just revealed, brief waiting period
  | 'quieting'            // Ambient network activity becomes quieter
  | 'reconnecting'        // Previously invisible pathway materializes between discovered objects
  | 'pattern_established' // Full pathway formed, flowing particles active, telemetry active
  | 'absorbed';           // Central entity absorbs discovered data, normal exploration continues

export interface NetworkDiscoveryState {
  /** Array of discovered object IDs in order of discovery */
  discoveredIds: string[];
  /** Detailed metadata for each discovered object in order */
  discoveredRecords: DiscoveredObjectRecord[];
  /** Total count of distinct meaningful discoveries */
  totalDiscoveries: number;
  
  /** Current state of the memory event sequence */
  eventStage: MemoryEventStage;
  /** Normalized progress of the memory event transition (0.0 to 1.0) */
  stageProgress: number;

  /** Dynamic metrics computed from discovered objects */
  nodeCount: number;
  waveCount: number;
  dataBlockCount: number;
  structureCount: number;
  unresolvedConnections: number;

  /** Hidden Route Latent Architecture (prepared for subsequent steps) */
  hiddenSignalLock: boolean;
  carrierFrequency: string;
  hiddenRoutePrepared: boolean;
}
