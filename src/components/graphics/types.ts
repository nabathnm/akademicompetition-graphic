/**
 * Graphic & Shape Component Prop Types
 */

import { BaseMotionProps } from '../types';

export interface GridBackgroundProps extends BaseMotionProps {
  gridSize?: number;
  lineColor?: string;
  pattern?: 'dots' | 'lines' | 'crosses';
  fadeEdges?: boolean;
}

export interface GradientMeshProps extends BaseMotionProps {
  colors?: string[];
  blurRadius?: number;
  animatePosition?: boolean;
}

export interface VectorPathProps extends BaseMotionProps {
  d: string;
  strokeColor?: string;
  strokeWidth?: number;
  drawDurationFrames?: number;
}
