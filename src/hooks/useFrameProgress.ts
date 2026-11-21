/**
 * useFrameProgress Hook
 * Computes deterministic, normalized animation progress (0..1) with easing and boundary states.
 */

import { useCurrentFrame } from 'remotion';
import { resolveEasing, EasingPresetName, EasingFunction } from '../utils/animation/easing';
import { interpolateValue } from '../utils/animation/interpolate';
import { clamp } from '../utils/animation/clamp';

export interface FrameProgressOptions {
  /** Frame at which the animation begins (default: 0) */
  startFrame?: number;
  /** Total duration in frames */
  durationInFrames: number;
  /** Optional easing curve or preset */
  easing?: EasingPresetName | EasingFunction;
  /** Invert animation from 1 to 0 (default: false) */
  reverse?: boolean;
  /** Boundary extrapolation behavior */
  extrapolateLeft?: 'clamp' | 'extend' | 'identity';
  extrapolateRight?: 'clamp' | 'extend' | 'identity';
}

export interface FrameProgressState {
  /** Linear progress between 0 and 1 */
  rawProgress: number;
  /** Progress with easing curve applied */
  easedProgress: number;
  /** True when animation has reached or passed startFrame */
  isStarted: boolean;
  /** True when currentFrame is between startFrame and startFrame + durationInFrames */
  isActive: boolean;
  /** True when currentFrame is at or past startFrame + durationInFrames */
  isComplete: boolean;
  /** Local frame offset relative to startFrame */
  localFrame: number;
}

export const useFrameProgress = ({
  startFrame = 0,
  durationInFrames,
  easing,
  reverse = false,
  extrapolateLeft = 'clamp',
  extrapolateRight = 'clamp',
}: FrameProgressOptions): FrameProgressState => {
  const currentFrame = useCurrentFrame();
  const localFrame = currentFrame - startFrame;

  const safeDuration = durationInFrames > 0 ? durationInFrames : 1;
  const rawLinear = clamp(localFrame / safeDuration, 0, 1);
  const rawProgress = reverse ? 1 - rawLinear : rawLinear;

  const easedProgress = interpolateValue({
    frame: currentFrame,
    inputRange: [startFrame, startFrame + safeDuration],
    outputRange: reverse ? [1, 0] : [0, 1],
    easing: resolveEasing(easing),
    extrapolateLeft,
    extrapolateRight,
  });

  const isStarted = currentFrame >= startFrame;
  const isComplete = currentFrame >= startFrame + durationInFrames;
  const isActive = isStarted && !isComplete;

  return {
    rawProgress,
    easedProgress,
    isStarted,
    isActive,
    isComplete,
    localFrame,
  };
};
