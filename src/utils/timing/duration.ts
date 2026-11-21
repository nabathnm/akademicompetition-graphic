/**
 * Timing & Frame Window Helpers
 * Helpers to evaluate local frame offsets, boundaries, and remaining durations.
 */

import { clamp } from '../animation/clamp.ts';

/**
 * Calculates local frame relative to a starting frame position.
 */
export const getLocalFrame = (currentFrame: number, startFrame: number): number => {
  return currentFrame - startFrame;
};

/**
 * Calculates delayed frame offset (currentFrame - delay).
 */
export const getDelayedFrame = (currentFrame: number, delayInFrames: number): number => {
  return currentFrame - delayInFrames;
};

/**
 * Evaluates whether currentFrame falls within [startFrame, startFrame + durationInFrames).
 */
export const isFrameInRange = (
  currentFrame: number,
  startFrame: number,
  durationInFrames: number
): boolean => {
  return currentFrame >= startFrame && currentFrame < startFrame + durationInFrames;
};

/**
 * Calculates remaining frames until animation completion.
 * Returns 0 if the animation is completed.
 */
export const getRemainingFrames = (
  currentFrame: number,
  startFrame: number,
  durationInFrames: number
): number => {
  const endFrame = startFrame + durationInFrames;
  if (currentFrame >= endFrame) {
    return 0;
  }
  if (currentFrame < startFrame) {
    return durationInFrames;
  }
  return endFrame - currentFrame;
};

/**
 * Calculates deterministic animation progress between 0 and 1.
 */
export const getAnimationProgress = (
  currentFrame: number,
  startFrame: number,
  durationInFrames: number,
  clamped: boolean = true
): number => {
  if (durationInFrames <= 0) {
    return currentFrame >= startFrame ? 1 : 0;
  }
  const rawProgress = (currentFrame - startFrame) / durationInFrames;
  return clamped ? clamp(rawProgress, 0, 1) : rawProgress;
};
