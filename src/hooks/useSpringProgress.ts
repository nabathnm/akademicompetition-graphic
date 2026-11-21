/**
 * useSpringProgress Hook
 * Computes deterministic physics-based spring progression using Remotion's spring() and design tokens.
 */

import { useCurrentFrame, useVideoConfig } from 'remotion';
import { SpringPresetName } from '../styles/motion';
import { createSpring, SpringPhysicsConfig } from '../utils/animation/spring';

export interface UseSpringProgressOptions {
  /** Initial frame at which spring starts calculating (default: 0) */
  startFrame?: number;
  /** Optional additional frame delay before starting spring calculation */
  delay?: number;
  /** Named physics preset from design tokens */
  preset?: SpringPresetName;
  /** Starting numeric value (default: 0) */
  from?: number;
  /** Target numeric value (default: 1) */
  to?: number;
  /** Reverse the motion direction from target to start (default: false) */
  reverse?: boolean;
  /** Individual physics parameter overrides */
  damping?: number;
  stiffness?: number;
  mass?: number;
  overshootClamping?: boolean;
}

export const useSpringProgress = ({
  startFrame = 0,
  delay = 0,
  preset = 'smooth',
  from = 0,
  to = 1,
  reverse = false,
  damping,
  stiffness,
  mass,
  overshootClamping,
}: UseSpringProgressOptions = {}): number => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalDelay = startFrame + delay;

  const customConfig: SpringPhysicsConfig = {};
  if (damping !== undefined) customConfig.damping = damping;
  if (stiffness !== undefined) customConfig.stiffness = stiffness;
  if (mass !== undefined) customConfig.mass = mass;
  if (overshootClamping !== undefined) customConfig.overshootClamping = overshootClamping;

  return createSpring({
    frame: currentFrame,
    fps,
    delay: totalDelay,
    preset,
    from,
    to,
    reverse,
    config: Object.keys(customConfig).length > 0 ? customConfig : undefined,
  });
};
