/**
 * Sequence Timing Helpers
 * Pure mathematical utilities to calculate sequence boundaries, items progress, and timeline slices.
 */

import { clamp } from '../animation/clamp.ts';

export interface SequenceItemInput {
  durationInFrames: number;
  delay?: number;
}

export interface SequenceItemBounds {
  startFrame: number;
  endFrame: number;
  durationInFrames: number;
  index: number;
}

/**
 * Computes contiguous or delayed start and end frames for an array of sequence items.
 */
export const calculateSequenceBounds = (
  items: SequenceItemInput[],
  baseStartFrame: number = 0
): SequenceItemBounds[] => {
  let currentCursor = baseStartFrame;

  return items.map((item, index) => {
    const delay = item.delay ?? 0;
    const startFrame = currentCursor + delay;
    const endFrame = startFrame + item.durationInFrames;
    currentCursor = endFrame;

    return {
      startFrame,
      endFrame,
      durationInFrames: item.durationInFrames,
      index,
    };
  });
};

/**
 * Calculates progress (0..1) for a specific sequence item.
 */
export const getSequenceProgress = (
  currentFrame: number,
  sequenceItem: { startFrame: number; durationInFrames: number }
): number => {
  if (sequenceItem.durationInFrames <= 0) {
    return currentFrame >= sequenceItem.startFrame ? 1 : 0;
  }
  return clamp((currentFrame - sequenceItem.startFrame) / sequenceItem.durationInFrames, 0, 1);
};

/**
 * Returns the local frame relative to sequence start.
 */
export const getLocalSequenceFrame = (
  currentFrame: number,
  sequenceItem: { startFrame: number }
): number => {
  return currentFrame - sequenceItem.startFrame;
};

/**
 * Determines which sequence item is currently active for a given frame.
 * Returns -1 if before the first item or after the last item.
 */
export const getSequenceItemIndex = (
  currentFrame: number,
  bounds: Array<{ startFrame: number; endFrame: number }>
): number => {
  for (let i = 0; i < bounds.length; i++) {
    if (currentFrame >= bounds[i].startFrame && currentFrame < bounds[i].endFrame) {
      return i;
    }
  }
  return -1;
};

/**
 * Helper to calculate stagger offset for list items.
 */
export const calculateStagger = (
  index: number,
  intervalFrames: number,
  baseDelay: number = 0
): number => {
  return baseDelay + index * intervalFrames;
};
