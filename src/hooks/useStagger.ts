/**
 * useStagger Hook
 * Calculates sequential, staggered animation progress for multiple items in a list or group.
 */

import { useCurrentFrame, useVideoConfig } from 'remotion';
import { EasingPresetName, EasingFunction, resolveEasing } from '../utils/animation/easing';
import { interpolateValue } from '../utils/animation/interpolate';
import { clamp } from '../utils/animation/clamp';
import { createSpring } from '../utils/animation/spring';
import { SpringPresetName } from '../styles/motion';

export interface UseStaggerOptions {
  /** Number of elements in the group */
  itemCount: number;
  /** Base starting frame for the stagger group (default: 0) */
  startFrame?: number;
  /** Frame delay between consecutive item reveals (default: 4) */
  staggerDelay?: number;
  /** Animation duration per item in frames (default: 18) */
  itemDuration?: number;
  /** Optional easing curve */
  easing?: EasingPresetName | EasingFunction;
  /** If true, last item animates first (default: false) */
  reverseOrder?: boolean;
  /** Whether to use spring physics instead of easing interpolation (default: false) */
  useSpring?: boolean;
  /** Spring physics preset if useSpring is enabled */
  springPreset?: SpringPresetName;
}

export interface ItemStaggerStatus {
  progress: number;
  isStarted: boolean;
  isActive: boolean;
  isComplete: boolean;
  itemStartFrame: number;
}

export interface UseStaggerResult {
  /** Get progress (0..1) for item at specified index */
  getItemProgress: (index: number) => number;
  /** Get full state status for item at specified index */
  getItemStatus: (index: number) => ItemStaggerStatus;
  /** Array containing current progress for all items */
  progressList: number[];
  /** Total frame duration required for all items to complete */
  totalDurationInFrames: number;
}

export const useStagger = ({
  itemCount,
  startFrame = 0,
  staggerDelay = 4,
  itemDuration = 18,
  easing,
  reverseOrder = false,
  useSpring = false,
  springPreset = 'snappy',
}: UseStaggerOptions): UseStaggerResult => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalStaggerSpan = Math.max(0, itemCount - 1) * staggerDelay;
  const totalDurationInFrames = totalStaggerSpan + itemDuration;

  const getItemStartFrame = (index: number): number => {
    const effectiveIndex = reverseOrder ? itemCount - 1 - index : index;
    return startFrame + effectiveIndex * staggerDelay;
  };

  const getItemProgress = (index: number): number => {
    if (index < 0 || index >= itemCount) {
      return 0;
    }
    const itemStart = getItemStartFrame(index);

    if (useSpring) {
      return createSpring({
        frame: currentFrame,
        fps,
        delay: itemStart,
        preset: springPreset,
        from: 0,
        to: 1,
      });
    }

    if (currentFrame < itemStart) {
      return 0;
    }
    if (currentFrame >= itemStart + itemDuration) {
      return 1;
    }

    return interpolateValue({
      frame: currentFrame,
      inputRange: [itemStart, itemStart + itemDuration],
      outputRange: [0, 1],
      easing: resolveEasing(easing),
    });
  };

  const getItemStatus = (index: number): ItemStaggerStatus => {
    const itemStart = getItemStartFrame(index);
    const progress = getItemProgress(index);
    const isStarted = currentFrame >= itemStart;
    const isComplete = currentFrame >= itemStart + itemDuration;
    const isActive = isStarted && !isComplete;

    return {
      progress: clamp(progress, 0, 1),
      isStarted,
      isActive,
      isComplete,
      itemStartFrame: itemStart,
    };
  };

  const progressList = Array.from({ length: itemCount }, (_, idx) => getItemProgress(idx));

  return {
    getItemProgress,
    getItemStatus,
    progressList,
    totalDurationInFrames,
  };
};
