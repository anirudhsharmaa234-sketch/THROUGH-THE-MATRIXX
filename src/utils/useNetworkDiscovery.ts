/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  DiscoveredObjectRecord,
  MemoryEventStage,
  NetworkDiscoveryState,
} from '../types/networkDiscovery.ts';
import { NETWORK_INFORMATION_REGISTRY } from '../data/networkInformationData.ts';

const DISCOVERY_THRESHOLD = 3;

export function useNetworkDiscovery() {
  const [state, setState] = useState<NetworkDiscoveryState>({
    discoveredIds: [],
    discoveredRecords: [],
    totalDiscoveries: 0,
    eventStage: 'dormant',
    stageProgress: 0,
    nodeCount: 0,
    waveCount: 0,
    dataBlockCount: 0,
    structureCount: 0,
    unresolvedConnections: 0,
    hiddenSignalLock: false,
    carrierFrequency: '532.40 THz',
    hiddenRoutePrepared: false,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const eventTimerRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = useCallback(() => {
    eventTimerRef.current.forEach((t) => clearTimeout(t));
    eventTimerRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  /**
   * Register meaningful discovery upon interaction commit (reveal).
   * Prevents duplicates.
   */
  const recordDiscovery = useCallback(
    (id: string) => {
      if (!id) return;
      const current = stateRef.current;
      if (current.discoveredIds.includes(id)) {
        return; // Already discovered
      }

      const info = NETWORK_INFORMATION_REGISTRY[id];
      const type = info ? info.type : id.startsWith('NODE') ? 'node' : id.startsWith('WAVE') ? 'wave' : 'data_block';
      const identifier = info ? info.identifier : id;
      const typeLabel = info ? info.typeLabel : 'NETWORK OBJECT';

      const newRecord: DiscoveredObjectRecord = {
        id,
        type,
        identifier,
        typeLabel,
        discoveredAt: Date.now(),
        discoveryIndex: current.discoveredIds.length,
      };

      const updatedIds = [...current.discoveredIds, id];
      const updatedRecords = [...current.discoveredRecords, newRecord];

      let nodes = 0;
      let waves = 0;
      let blocks = 0;
      let structures = 0;

      updatedRecords.forEach((r) => {
        if (r.type === 'node') nodes++;
        else if (r.type === 'wave') waves++;
        else if (r.type === 'data_block') blocks++;
        else if (r.type === 'structure') structures++;
      });

      const total = updatedIds.length;
      const unresolved = Math.max(1, 4 - total);

      // Check if this discovery crosses the threshold for the first time
      const shouldTriggerEvent =
        total >= DISCOVERY_THRESHOLD && current.eventStage === 'dormant';

      setState((prev) => ({
        ...prev,
        discoveredIds: updatedIds,
        discoveredRecords: updatedRecords,
        totalDiscoveries: total,
        nodeCount: nodes,
        waveCount: waves,
        dataBlockCount: blocks,
        structureCount: structures,
        unresolvedConnections: unresolved,
        hiddenSignalLock: total >= DISCOVERY_THRESHOLD,
        carrierFrequency: `${(532.4 + total * 1.83).toFixed(2)} THz`,
        hiddenRoutePrepared: total >= DISCOVERY_THRESHOLD,
      }));

      if (shouldTriggerEvent) {
        clearTimers();

        // 1. STABILIZING: Complete 3rd object's normal reveal & allow user to absorb
        const t1 = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            eventStage: 'stabilizing',
            stageProgress: 0.1,
          }));

          // 2. QUIETING: Background data streams become calmer, discovered objects brighten
          const t2 = setTimeout(() => {
            setState((prev) => ({
              ...prev,
              eventStage: 'quieting',
              stageProgress: 0.35,
            }));

            // 3. RECONNECTING: Hidden pathway materializes between discovered objects
            const t3 = setTimeout(() => {
              setState((prev) => ({
                ...prev,
                eventStage: 'reconnecting',
                stageProgress: 0.65,
              }));

              // 4. PATTERN ESTABLISHED: Luminous pathway fully formed, flowing particles, HUD appears
              const t4 = setTimeout(() => {
                setState((prev) => ({
                  ...prev,
                  eventStage: 'pattern_established',
                  stageProgress: 0.85,
                }));

                // 5. ABSORBED: Central entity reacts and absorbs the pattern, exploration continues
                const t5 = setTimeout(() => {
                  setState((prev) => ({
                    ...prev,
                    eventStage: 'absorbed',
                    stageProgress: 1.0,
                  }));
                }, 2800);
                eventTimerRef.current.push(t5);
              }, 2200);
              eventTimerRef.current.push(t4);
            }, 1800);
            eventTimerRef.current.push(t3);
          }, 1600);
          eventTimerRef.current.push(t2);
        }, 1200);
        eventTimerRef.current.push(t1);
      }
    },
    [clearTimers]
  );

  return {
    discoveryState: state,
    recordDiscovery,
  };
}
