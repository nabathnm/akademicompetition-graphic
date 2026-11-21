/**
 * Interpolation Utility
 * Deterministic value interpolation with safe boundary clamping.
 */

import { interpolate, InterpolateOptions } from 'remotion';
import { EasingPresets, EasingPresetName } from './easing';

export interface ClampedInterpolateOptions {
  frame: number;
  inputRange: [number, number];
  outputRange: [number, number];
  easing?: EasingPresetName;
  extrapolateLeft?: InterpolateOptions['extrapolateLeft'];
  extrapolateRight?: InterpolateOptions['extrapolateRight'];
}

/**
 * Linearly or easing-interpolates a value between ranges with strict clamp defaults.
 */
export const clampedInterpolate = ({
  frame,
  inputRange,
  outputRange,
  easing,
  extrapolateLeft = 'clamp',
  extrapolateRight = 'clamp',
}: ClampedInterpolateOptions): number => {
  const easingFn = easing ? EasingPresets[easing] : undefined;

  return interpolate(frame, inputRange, outputRange, {
    extrapolateLeft,
    extrapolateRight,
    easing: easingFn,
  });
};
