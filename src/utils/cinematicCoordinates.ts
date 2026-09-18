/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CinematicAnchorCoordinates } from '../types/cinematicTransition.ts';

const SOURCE_WIDTH = 1280;
const SOURCE_HEIGHT = 720;
const SOURCE_RATIO = SOURCE_WIDTH / SOURCE_HEIGHT;

export interface ScreenAnchorResult {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
  isVisible: boolean;
}

/**
 * Calculates the exact screen pixel coordinates of an anchor point on the canvas,
 * taking into account cover-crop reframing (16:9, ultrawide 21:9, mobile portrait 9:16, etc.)
 * and high-DPI scaling.
 */
export function calculateScreenAnchor(
  anchor: CinematicAnchorCoordinates,
  viewportWidth: number,
  viewportHeight: number
): ScreenAnchorResult {
  if (viewportWidth <= 0 || viewportHeight <= 0) {
    return { x: 0, y: 0, normalizedX: 0.5, normalizedY: 0.5, isVisible: false };
  }

  const canvasRatio = viewportWidth / viewportHeight;
  const focalX = anchor.focalX ?? 0.5;
  const focalY = anchor.focalY ?? 0.48;

  let sw: number;
  let sh: number;
  let sx: number;
  let sy: number;

  if (Math.abs(canvasRatio - SOURCE_RATIO) < 0.008) {
    // Exact 16:9 fullscreen match
    sx = 0;
    sy = 0;
    sw = SOURCE_WIDTH;
    sh = SOURCE_HEIGHT;
  } else if (canvasRatio > SOURCE_RATIO) {
    // Ultrawide (cropped vertically)
    sw = SOURCE_WIDTH;
    sh = Math.round(SOURCE_WIDTH / canvasRatio);
    sx = 0;
    sy = Math.round(Math.max(0, Math.min(SOURCE_HEIGHT - sh, (SOURCE_HEIGHT - sh) * focalY)));
  } else {
    // Taller/narrower than 16:9 (standard desktop, laptop, tablet, mobile portrait)
    sh = SOURCE_HEIGHT;
    sw = Math.round(SOURCE_HEIGHT * canvasRatio);
    sy = 0;
    sx = Math.round(Math.max(0, Math.min(SOURCE_WIDTH - sw, (SOURCE_WIDTH - sw) * focalX)));
  }

  // Map source coordinate to viewport screen pixels
  const screenX = ((anchor.sourceX - sx) / sw) * viewportWidth;
  const screenY = ((anchor.sourceY - sy) / sh) * viewportHeight;

  const normalizedX = screenX / viewportWidth;
  const normalizedY = screenY / viewportHeight;

  const isVisible = screenX >= -20 && screenX <= viewportWidth + 20 &&
                    screenY >= -20 && screenY <= viewportHeight + 20;

  return {
    x: Math.round(screenX),
    y: Math.round(screenY),
    normalizedX,
    normalizedY,
    isVisible,
  };
}
