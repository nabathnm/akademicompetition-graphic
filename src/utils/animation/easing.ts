/**
 * Easing Curves Utility
 * Pre-configured easing functions mapped to the Motion design tokens.
 */

import { Easing } from 'remotion';
import { Motion } from '../../styles/motion';

export const standardEasing = Easing.bezier(
  Motion.easing.standard[0],
  Motion.easing.standard[1],
  Motion.easing.standard[2],
  Motion.easing.standard[3]
);

export const emphasizedEasing = Easing.bezier(
  Motion.easing.emphasized[0],
  Motion.easing.emphasized[1],
  Motion.easing.emphasized[2],
  Motion.easing.emphasized[3]
);

export const decelerateEasing = Easing.bezier(
  Motion.easing.decelerate[0],
  Motion.easing.decelerate[1],
  Motion.easing.decelerate[2],
  Motion.easing.decelerate[3]
);

export const accelerateEasing = Easing.bezier(
  Motion.easing.accelerate[0],
  Motion.easing.accelerate[1],
  Motion.easing.accelerate[2],
  Motion.easing.accelerate[3]
);

export const linearEasing = Easing.linear;

export const EasingPresets = {
  standard: standardEasing,
  emphasized: emphasizedEasing,
  decelerate: decelerateEasing,
  accelerate: accelerateEasing,
  linear: linearEasing,
} as const;

export type EasingPresetName = keyof typeof EasingPresets;
