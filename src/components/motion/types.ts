/**
 * Motion Primitives Prop Types
 */

import { BaseMotionProps } from '../types';

export interface RevealProps extends BaseMotionProps {
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  overflowHidden?: boolean;
}

export interface FadeProps extends BaseMotionProps {
  fromOpacity?: number;
  toOpacity?: number;
}

export interface ScaleInProps extends BaseMotionProps {
  fromScale?: number;
  toScale?: number;
  origin?: string;
}

export interface StaggerGroupProps extends BaseMotionProps {
  staggerIntervalFrames?: number;
}
