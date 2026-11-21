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

// ---------------------------------------------------------------------------
// AnimatedShape Types
// ---------------------------------------------------------------------------

import type { EasingPresetName, EasingFunction } from '../../utils/animation/easing';
import type { SpringPresetName } from '../../styles/motion';

export type ShapeType =
  | 'rectangle'
  | 'rounded-rectangle'
  | 'ellipse'
  | 'circle'
  | 'polygon'
  | 'triangle'
  | 'star';

export type ShapeAnimation =
  | 'none'
  | 'fade-in'
  | 'fade-out'
  | 'scale-in'
  | 'scale-out'
  | 'rotate'
  | 'move'
  | 'pop'
  | 'bounce'
  | 'draw'
  | 'combined';

export type ShapeAnimationDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'clockwise'
  | 'counter-clockwise';

export interface ShapeAnimationConfig {
  /** Animation preset type */
  type?: ShapeAnimation;
  /** Frame delay before animation triggers (default: 0) */
  delay?: number;
  /** Duration in frames for animation progression (default: 20) */
  duration?: number;
  /** Easing function or preset name */
  easing?: EasingPresetName | EasingFunction;
  /** Spring physics preset key */
  springPreset?: SpringPresetName;
  /** Movement or rotation direction */
  direction?: ShapeAnimationDirection;
  /** Custom initial numeric value (e.g. initial scale, opacity, angle, or distance) */
  from?: number;
  /** Custom target numeric value */
  to?: number;
  /** Whether the animation repeats / loops continuously across frames */
  loop?: boolean;
}

export interface AnimatedShapeProps {
  /** Geometric shape type (default: 'rectangle') */
  shape?: ShapeType;
  /** Overall width of the shape in pixels (default: 100) */
  width?: number;
  /** Overall height of the shape in pixels (default: 100) */
  height?: number;
  /** Fill color or gradient (default: 'rgba(39, 110, 241, 0.2)') */
  fill?: string;
  /** Stroke border color (default: '#276EF1') */
  stroke?: string;
  /** Stroke width in pixels (default: 2) */
  strokeWidth?: number;
  /** Stroke dasharray for dashed borders or custom stroke patterns */
  strokeDasharray?: string | number;
  /** Stroke linecap ('round' | 'butt' | 'square', default: 'round') */
  strokeLinecap?: 'round' | 'butt' | 'square';
  /** Stroke linejoin ('round' | 'miter' | 'bevel', default: 'round') */
  strokeLinejoin?: 'round' | 'miter' | 'bevel';
  /** Corner radius for rectangles / rounded rectangles (default: 12) */
  borderRadius?: number;
  /** Base opacity from 0 to 1 (default: 1) */
  opacity?: number;
  /** Base rotation in degrees (default: 0) */
  rotation?: number;
  /** Horizontal position offset in pixels */
  x?: number;
  /** Vertical position offset in pixels */
  y?: number;
  /** Uniform scale multiplier (default: 1) */
  scale?: number;
  /** Separate horizontal scale multiplier */
  scaleX?: number;
  /** Separate vertical scale multiplier */
  scaleY?: number;
  /** CSS transform origin (default: 'center center') */
  transformOrigin?: string;
  /** Number of sides for regular polygons (default: 6 for polygon, 3 for triangle) */
  sides?: number;
  /** Number of points for star shape (default: 5) */
  starPoints?: number;
  /** Inner radius ratio for star shape (0 to 1, default: 0.45) */
  starInnerRadiusRatio?: number;
  /** Custom polygon point coordinate string (e.g. "50,0 100,100 0,100") */
  points?: string;
  /** Primary animation type shorthand or full config */
  animation?: ShapeAnimation | ShapeAnimationConfig;
  /** Whether animation is enabled (default: true) */
  animate?: boolean;
  /** Frame delay before animation begins (shorthand for animation.delay) */
  delay?: number;
  /** Duration in frames (shorthand for animation.duration) */
  durationInFrames?: number;
  /** Easing preset or function */
  easing?: EasingPresetName | EasingFunction;
  /** Spring physics preset */
  springPreset?: SpringPresetName;
  /** Direction for move or rotate animations */
  direction?: ShapeAnimationDirection;
  /** Custom starting value override */
  from?: number;
  /** Custom target value override */
  to?: number;
  /** Optional exit animation frame trigger */
  exitFrame?: number;
  /** Duration in frames for exit transition */
  exitDurationInFrames?: number;
  /** Exit animation type */
  exitAnimation?: ShapeAnimation;
  /** Child nodes rendered inside SVG or overlaying shape */
  children?: React.ReactNode;
  /** Custom CSS container styling */
  style?: React.CSSProperties;
  /** SVG element custom styling */
  svgStyle?: React.CSSProperties;
  /** Custom CSS class */
  className?: string;
}
