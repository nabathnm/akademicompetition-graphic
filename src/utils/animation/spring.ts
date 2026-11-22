/**
 * Spring Calculation Utility
 * Reusable, physics-based deterministic spring calculation wrapping Remotion's spring().
 */

import { spring } from 'remotion';
import { MOTION } from '../../styles/motion.ts';
import type { SpringPresetName } from '../../styles/motion.ts';

export interface SpringPhysicsConfig {
  damping?: number;
  mass?: number;
  stiffness?: number;
  overshootClamping?: boolean;
}

export interface SpringAnimationOptions {
  frame: number;
  fps: number;
  delay?: number;
  preset?: SpringPresetName;
  from?: number;
  to?: number;
  reverse?: boolean;
  config?: SpringPhysicsConfig;
}

/**
 * Calculates a deterministic spring value using design system presets or custom overrides.
 * Guarantees boundary safety: returns `from` (or `to` if reverse) when frame < delay.
 */
export const createSpring = ({
  frame,
  fps,
  delay = 0,
  preset = 'smooth',
  from = 0,
  to = 1,
  reverse = false,
  config,
}: SpringAnimationOptions): number => {
  const baseConfig = MOTION.spring[preset] ?? MOTION.spring.smooth;
  const mergedConfig = config ? { ...baseConfig, ...config } : baseConfig;

  const effectiveFrom = reverse ? to : from;
  const effectiveTo = reverse ? from : to;

  if (frame < delay) {
    return effectiveFrom;
  }

  return spring({
    frame: frame - delay,
    fps,
    config: mergedConfig,
    from: effectiveFrom,
    to: effectiveTo,
  });
};

/**
 * Convenience alias for normalized 0..1 spring progression.
 */
export const getSpringProgress = (
  options: Omit<SpringAnimationOptions, 'from' | 'to'>
): number => {
  return createSpring({
    ...options,
    from: 0,
    to: 1,
  });
};
