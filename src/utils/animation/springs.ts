/**
 * Spring Calculation Utility
 * Wraps Remotion's spring() with standardized physics presets from Motion tokens.
 */

import { spring } from 'remotion';
import { Motion, SpringPresetName } from '../../styles/motion';

export interface SpringAnimationOptions {
  frame: number;
  fps: number;
  delay?: number;
  preset?: SpringPresetName;
  from?: number;
  to?: number;
  config?: Partial<typeof Motion.springs.smooth>;
}

/**
 * Calculates a deterministic spring value using design system presets.
 */
export const createSpring = ({
  frame,
  fps,
  delay = 0,
  preset = 'snappy',
  from = 0,
  to = 1,
  config,
}: SpringAnimationOptions): number => {
  const baseConfig = Motion.springs[preset];
  const mergedConfig = { ...baseConfig, ...config };

  return spring({
    frame: frame - delay,
    fps,
    config: mergedConfig,
    from,
    to,
  });
};
