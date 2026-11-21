/**
 * Component Library Base Types
 * Unified interface standards for all reusable motion and visual components.
 */

import React from 'react';
import { SpringPresetName } from '../styles/motion';
import { EasingPresetName } from '../utils/animation/easing';

export type ComponentCategory =
  | 'motion'
  | 'typography'
  | 'ui'
  | 'mockups'
  | 'graphics'
  | 'transitions';

/**
 * Standard motion properties shared by all animatable components.
 */
export interface BaseMotionProps {
  /** Delay in frames before the component starts animating */
  delay?: number;
  /** Custom duration in frames (defaults to token preset if omitted) */
  durationInFrames?: number;
  /** Spring physics preset when using physics-based motion */
  springPreset?: SpringPresetName;
  /** Easing curve preset when using interpolation */
  easing?: EasingPresetName;
  /** Container custom style override */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
  /** Child elements */
  children?: React.ReactNode;
}

/**
 * Metadata definition for component documentation and playground registration.
 */
export interface ComponentDocMeta {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  availableVariants?: string[];
  defaultProps?: Record<string, unknown>;
}
