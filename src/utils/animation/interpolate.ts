/**
 * Interpolation Utility
 * High-performance, type-safe interpolation wrapper with multi-point range mapping.
 */

import { interpolate, type InterpolateOptions } from 'remotion';
import { resolveEasing } from './easing.ts';
import type { EasingPresetName, EasingFunction } from './easing.ts';

export interface InterpolateValueOptions {
  frame: number;
  inputRange: number[];
  outputRange: number[];
  easing?: EasingPresetName | EasingFunction;
  extrapolateLeft?: InterpolateOptions['extrapolateLeft'];
  extrapolateRight?: InterpolateOptions['extrapolateRight'];
}

export interface ClampedInterpolateOptions {
  frame: number;
  inputRange: [number, number];
  outputRange: [number, number];
  easing?: EasingPresetName | EasingFunction;
  extrapolateLeft?: InterpolateOptions['extrapolateLeft'];
  extrapolateRight?: InterpolateOptions['extrapolateRight'];
}

/**
 * Interpolates a value across a multi-point or two-point range with easing and extrapolation.
 */
export const interpolateValue = ({
  frame,
  inputRange,
  outputRange,
  easing,
  extrapolateLeft = 'clamp',
  extrapolateRight = 'clamp',
}: InterpolateValueOptions): number => {
  const easingFn = resolveEasing(easing);

  return interpolate(frame, inputRange, outputRange, {
    extrapolateLeft,
    extrapolateRight,
    easing: easingFn,
  });
};

/**
 * Backward-compatible helper with strict 2-element tuple input and output ranges.
 */
export const clampedInterpolate = (options: ClampedInterpolateOptions): number => {
  return interpolateValue({
    ...options,
    extrapolateLeft: options.extrapolateLeft ?? 'clamp',
    extrapolateRight: options.extrapolateRight ?? 'clamp',
  });
};
