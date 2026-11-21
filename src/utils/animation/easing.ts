/**
 * Easing Presets and Utilities
 * Full suite of standard, exponential, cubic, quartic, and custom bezier easing functions.
 * Compatible with Remotion's Easing API.
 */

import { Easing } from 'remotion';
import { MOTION } from '../../styles/motion.ts';

/**
 * Creates a cubic bezier easing function from 4 control coordinates.
 */
export const createBezierEasing = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): ((t: number) => number) => {
  return Easing.bezier(x1, y1, x2, y2);
};

// Standard linear and classic easings
export const linear = Easing.linear;
export const easeIn = createBezierEasing(MOTION.easing.easeIn[0], MOTION.easing.easeIn[1], MOTION.easing.easeIn[2], MOTION.easing.easeIn[3]);
export const easeOut = createBezierEasing(MOTION.easing.easeOut[0], MOTION.easing.easeOut[1], MOTION.easing.easeOut[2], MOTION.easing.easeOut[3]);
export const easeInOut = createBezierEasing(MOTION.easing.easeInOut[0], MOTION.easing.easeInOut[1], MOTION.easing.easeInOut[2], MOTION.easing.easeInOut[3]);

// Cubic Easings
export const easeInCubic = createBezierEasing(MOTION.easing.easeInCubic[0], MOTION.easing.easeInCubic[1], MOTION.easing.easeInCubic[2], MOTION.easing.easeInCubic[3]);
export const easeOutCubic = createBezierEasing(MOTION.easing.easeOutCubic[0], MOTION.easing.easeOutCubic[1], MOTION.easing.easeOutCubic[2], MOTION.easing.easeOutCubic[3]);
export const easeInOutCubic = createBezierEasing(MOTION.easing.easeInOutCubic[0], MOTION.easing.easeInOutCubic[1], MOTION.easing.easeInOutCubic[2], MOTION.easing.easeInOutCubic[3]);

// Exponential Easings
export const easeInExpo = createBezierEasing(MOTION.easing.easeInExpo[0], MOTION.easing.easeInExpo[1], MOTION.easing.easeInExpo[2], MOTION.easing.easeInExpo[3]);
export const easeOutExpo = createBezierEasing(MOTION.easing.easeOutExpo[0], MOTION.easing.easeOutExpo[1], MOTION.easing.easeOutExpo[2], MOTION.easing.easeOutExpo[3]);
export const easeInOutExpo = createBezierEasing(MOTION.easing.easeInOutExpo[0], MOTION.easing.easeInOutExpo[1], MOTION.easing.easeInOutExpo[2], MOTION.easing.easeInOutExpo[3]);

// Quartic Easings
export const easeInQuart = createBezierEasing(MOTION.easing.easeInQuart[0], MOTION.easing.easeInQuart[1], MOTION.easing.easeInQuart[2], MOTION.easing.easeInQuart[3]);
export const easeOutQuart = createBezierEasing(MOTION.easing.easeOutQuart[0], MOTION.easing.easeOutQuart[1], MOTION.easing.easeOutQuart[2], MOTION.easing.easeOutQuart[3]);
export const easeInOutQuart = createBezierEasing(MOTION.easing.easeInOutQuart[0], MOTION.easing.easeInOutQuart[1], MOTION.easing.easeInOutQuart[2], MOTION.easing.easeInOutQuart[3]);

// Brand-specific custom curves
export const standardEasing = createBezierEasing(MOTION.easing.standard[0], MOTION.easing.standard[1], MOTION.easing.standard[2], MOTION.easing.standard[3]);
export const emphasizedEasing = createBezierEasing(MOTION.easing.emphasized[0], MOTION.easing.emphasized[1], MOTION.easing.emphasized[2], MOTION.easing.emphasized[3]);
export const decelerateEasing = createBezierEasing(MOTION.easing.decelerate[0], MOTION.easing.decelerate[1], MOTION.easing.decelerate[2], MOTION.easing.decelerate[3]);
export const accelerateEasing = createBezierEasing(MOTION.easing.accelerate[0], MOTION.easing.accelerate[1], MOTION.easing.accelerate[2], MOTION.easing.accelerate[3]);

export const EasingPresets = {
  linear,
  easeIn,
  easeOut,
  easeInOut,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  standard: standardEasing,
  emphasized: emphasizedEasing,
  decelerate: decelerateEasing,
  accelerate: accelerateEasing,
} as const;

export type EasingPresetName = keyof typeof EasingPresets;
export type EasingFunction = (t: number) => number;

/**
 * Resolves an easing name or custom easing function into an executable easing function.
 */
export const resolveEasing = (
  easing?: EasingPresetName | EasingFunction
): EasingFunction | undefined => {
  if (!easing) {
    return undefined;
  }
  if (typeof easing === 'function') {
    return easing;
  }
  return EasingPresets[easing];
};
