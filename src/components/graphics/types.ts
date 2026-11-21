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

// ---------------------------------------------------------------------------
// AnimatedLine Types
// ---------------------------------------------------------------------------

export type LineOrientation = 'horizontal' | 'vertical' | 'diagonal' | 'custom';

export type LineAnimation =
  | 'none'
  | 'draw-in'
  | 'draw'
  | 'draw-out'
  | 'reveal-left'
  | 'reveal-right'
  | 'reveal-center'
  | 'reveal-start'
  | 'reveal-end'
  | 'fade-in'
  | 'fade-out'
  | 'move-in'
  | 'length-expansion'
  | 'expand'
  | 'stroke-width'
  | 'width-expansion';

export type LineAnimationDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'start'
  | 'end'
  | 'center';

export interface LineAnimationConfig {
  /** Animation preset type */
  type?: LineAnimation;
  /** Frame delay before animation begins (default: 0) */
  delay?: number;
  /** Duration in frames for animation progression (default: 20) */
  duration?: number;
  /** Easing function or preset name */
  easing?: EasingPresetName | EasingFunction;
  /** Spring physics preset key */
  springPreset?: SpringPresetName;
  /** Direction for movement, reveal, or expansion */
  direction?: LineAnimationDirection;
  /** Custom initial numeric value override (e.g. initial stroke width or progress) */
  from?: number;
  /** Custom target numeric value override */
  to?: number;
  /** Whether the animation repeats / loops continuously across frames */
  loop?: boolean;
}

export interface AnimatedLineProps {
  /** Starting horizontal coordinate in pixels (default: 0) */
  x1?: number;
  /** Starting vertical coordinate in pixels (default: 0) */
  y1?: number;
  /** Ending horizontal coordinate in pixels (default: 100 or resolved from length) */
  x2?: number;
  /** Ending vertical coordinate in pixels (default: 0 or resolved from length) */
  y2?: number;
  /** Convenience orientation helper ('horizontal' | 'vertical' | 'diagonal' | 'custom') */
  orientation?: LineOrientation;
  /** Line length in pixels when using orientation presets (default: 100) */
  length?: number;
  /** Stroke color (default: '#276EF1') */
  stroke?: string;
  /** Stroke line thickness in pixels (default: 2) */
  strokeWidth?: number;
  /** SVG line cap style ('round' | 'butt' | 'square', default: 'round') */
  strokeLinecap?: 'round' | 'butt' | 'square';
  /** SVG dash pattern (e.g. "6 4" for dashed, "2 4" for dotted) */
  strokeDasharray?: string | number;
  /** Base stroke dashoffset offset in pixels */
  strokeDashoffset?: number;
  /** Stroke opacity from 0 to 1 (default: 1) */
  strokeOpacity?: number;
  /** Overall container opacity from 0 to 1 (default: 1) */
  opacity?: number;
  /** Angular rotation in degrees (default: 0) */
  rotation?: number;
  /** CSS transform origin (default: 'center center') */
  transformOrigin?: string;
  /** Horizontal position translation in pixels */
  x?: number;
  /** Vertical position translation in pixels */
  y?: number;
  /** Uniform scale multiplier (default: 1) */
  scale?: number;
  /** Horizontal scale multiplier */
  scaleX?: number;
  /** Vertical scale multiplier */
  scaleY?: number;
  /** Explicit outer SVG width in pixels */
  width?: number;
  /** Explicit outer SVG height in pixels */
  height?: number;
  /** Animation preset type shorthand or full configuration */
  animation?: LineAnimation | LineAnimationConfig;
  /** Whether animation is enabled (default: true) */
  animate?: boolean;
  /** Frame delay before animation begins (shorthand for animation.delay) */
  delay?: number;
  /** Duration in frames (shorthand for animation.duration) */
  durationInFrames?: number;
  /** Easing preset name or custom function */
  easing?: EasingPresetName | EasingFunction;
  /** Spring physics preset */
  springPreset?: SpringPresetName;
  /** Direction for movement or reveal */
  direction?: LineAnimationDirection;
  /** Custom starting value override */
  from?: number;
  /** Custom target value override */
  to?: number;
  /** Optional exit animation frame trigger */
  exitFrame?: number;
  /** Duration in frames for exit transition */
  exitDurationInFrames?: number;
  /** Exit animation type */
  exitAnimation?: 'fade-out' | 'draw-out' | 'stroke-width';
  /** Child elements positioned relative to line container */
  children?: React.ReactNode;
  /** Outer container CSS style */
  style?: React.CSSProperties;
  /** SVG element CSS style */
  svgStyle?: React.CSSProperties;
  /** Direct SVG <line> element CSS style */
  lineStyle?: React.CSSProperties;
  /** Custom CSS class */
  className?: string;
}

// ---------------------------------------------------------------------------
// AnimatedCircle Types
// ---------------------------------------------------------------------------

export type CircleType = 'fill' | 'outline' | 'ring' | 'arc' | 'progress';

export type CircleAnimation =
  | 'none'
  | 'scale-in'
  | 'scale-out'
  | 'fade-in'
  | 'fade-out'
  | 'draw'
  | 'draw-in'
  | 'draw-out'
  | 'radial-reveal'
  | 'ring-expansion'
  | 'expand'
  | 'rotate'
  | 'pulse'
  | 'progress'
  | 'circular-progress'
  | 'stroke-width';

export type CircleAnimationDirection =
  | 'clockwise'
  | 'counter-clockwise'
  | 'inward'
  | 'outward';

export interface CircleAnimationConfig {
  /** Animation preset type */
  type?: CircleAnimation;
  /** Frame delay before animation begins (default: 0) */
  delay?: number;
  /** Duration in frames for animation progression (default: 20) */
  duration?: number;
  /** Easing function or preset name */
  easing?: EasingPresetName | EasingFunction;
  /** Spring physics preset key */
  springPreset?: SpringPresetName;
  /** Sweep or rotation direction */
  direction?: CircleAnimationDirection;
  /** Custom initial numeric value override */
  from?: number;
  /** Custom target numeric value override */
  to?: number;
  /** Whether the animation repeats / loops continuously across frames */
  loop?: boolean;
  /** Oscillation magnitude for pulse animation (scale factor, default: 0.08) */
  pulseMagnitude?: number;
  /** Frequency / cycle length in frames for pulse animation (default: 30) */
  pulseFrequency?: number;
}

export interface AnimatedCircleProps {
  /** Radius in pixels (default: 50) */
  radius?: number;
  /** Overall diameter / bounding box size in pixels (overrides radius if provided) */
  size?: number;
  /** Fill color or gradient (default: 'transparent' for outlines, or '#276EF1' for filled) */
  fill?: string;
  /** Stroke border color (default: '#276EF1') */
  stroke?: string;
  /** Stroke thickness in pixels (default: 2) */
  strokeWidth?: number;
  /** SVG stroke line cap ('round' | 'butt' | 'square', default: 'round') */
  strokeLinecap?: 'round' | 'butt' | 'square';
  /** Stroke dasharray for dashed circles or pattern styling */
  strokeDasharray?: string | number;
  /** Base stroke dashoffset */
  strokeDashoffset?: number;
  /** Stroke opacity from 0 to 1 (default: 1) */
  strokeOpacity?: number;
  /** Overall container opacity from 0 to 1 (default: 1) */
  opacity?: number;
  /** Angular rotation in degrees (default: 0) */
  rotation?: number;
  /** Starting arc angle in degrees (0 = 12 o'clock top, default: 0) */
  startAngle?: number;
  /** Ending arc angle in degrees (default: 360) */
  endAngle?: number;
  /** Circular progress ratio from 0 to 1 (or 0 to 100 percentage) */
  progress?: number;
  /** Whether to render a background track circle (useful for progress bars / rings, default: false) */
  showTrack?: boolean;
  /** Background track stroke color (default: 'rgba(255, 255, 255, 0.1)') */
  trackStroke?: string;
  /** Background track stroke thickness in pixels (default: same as strokeWidth) */
  trackStrokeWidth?: number;
  /** Whether a partial circle with fill is closed to center as a wedge/sector (default: false) */
  closed?: boolean;
  /** CSS transform origin (default: 'center center') */
  transformOrigin?: string;
  /** Horizontal position translation offset in pixels */
  x?: number;
  /** Vertical position translation offset in pixels */
  y?: number;
  /** Uniform scale multiplier (default: 1) */
  scale?: number;
  /** Horizontal scale multiplier */
  scaleX?: number;
  /** Vertical scale multiplier */
  scaleY?: number;
  /** Primary animation type shorthand or full config */
  animation?: CircleAnimation | CircleAnimationConfig;
  /** Whether animation is enabled (default: true) */
  animate?: boolean;
  /** Frame delay before animation begins (shorthand for animation.delay) */
  delay?: number;
  /** Duration in frames (shorthand for animation.duration) */
  durationInFrames?: number;
  /** Easing preset or custom function */
  easing?: EasingPresetName | EasingFunction;
  /** Spring physics preset */
  springPreset?: SpringPresetName;
  /** Direction for rotation or sweep */
  direction?: CircleAnimationDirection;
  /** Custom starting value override */
  from?: number;
  /** Custom target value override */
  to?: number;
  /** Optional exit animation frame trigger */
  exitFrame?: number;
  /** Duration in frames for exit transition */
  exitDurationInFrames?: number;
  /** Exit animation type */
  exitAnimation?: 'fade-out' | 'scale-out' | 'draw-out' | 'stroke-width';
  /** Child elements placed inside circle center (e.g. progress percentage, icon, badge) */
  children?: React.ReactNode;
  /** Outer container CSS style */
  style?: React.CSSProperties;
  /** SVG element CSS style */
  svgStyle?: React.CSSProperties;
  /** Custom CSS class */
  className?: string;
}

// ---------------------------------------------------------------------------
// AnimatedArrow Types
// ---------------------------------------------------------------------------

export type ArrowheadStyle = 'triangle' | 'chevron' | 'stealth' | 'barb' | 'circle';

export type ArrowheadPlacement = 'end' | 'start' | 'both';

export type ArrowheadTiming = 'with-line' | 'after-line' | 'independent';

export type ArrowDirection =
  | 'right'
  | 'left'
  | 'up'
  | 'down'
  | 'diagonal-up-right'
  | 'diagonal-down-right'
  | 'diagonal-up-left'
  | 'diagonal-down-left'
  | 'custom';

export type ArrowAnimation =
  | 'none'
  | 'draw-in'
  | 'draw'
  | 'draw-out'
  | 'directional-reveal'
  | 'reveal'
  | 'move-in'
  | 'arrowhead-reveal'
  | 'scale-in'
  | 'scale-out'
  | 'fade-in'
  | 'fade-out';

export interface ArrowAnimationConfig {
  /** Animation preset type */
  type?: ArrowAnimation;
  /** Frame delay before animation begins (default: 0) */
  delay?: number;
  /** Duration in frames for animation progression (default: 20) */
  duration?: number;
  /** Easing function or preset name */
  easing?: EasingPresetName | EasingFunction;
  /** Spring physics preset key */
  springPreset?: SpringPresetName;
  /** Direction for movement or reveal */
  direction?: 'forward' | 'backward';
  /** How arrowhead entrance is sequenced relative to line */
  headTiming?: ArrowheadTiming;
  /** Frame delay for arrowhead when using independent timing */
  headDelay?: number;
  /** Frame duration for arrowhead entrance */
  headDuration?: number;
  /** Custom initial numeric value override */
  from?: number;
  /** Custom target numeric value override */
  to?: number;
  /** Whether the animation repeats / loops continuously across frames */
  loop?: boolean;
}

export interface AnimatedArrowProps {
  /** Starting horizontal coordinate in pixels (default: 0) */
  x1?: number;
  /** Starting vertical coordinate in pixels (default: 0) */
  y1?: number;
  /** Ending horizontal coordinate in pixels (default: 100 or resolved from direction) */
  x2?: number;
  /** Ending vertical coordinate in pixels (default: 0 or resolved from direction) */
  y2?: number;
  /** Cardinal / diagonal direction preset */
  direction?: ArrowDirection;
  /** Arrow length in pixels when using direction presets (default: 100) */
  length?: number;
  /** Curvature factor for curved arrows (-1 to 1, 0 = straight line, default: 0) */
  curvature?: number;
  /** Optional explicit Bezier control point for custom curve shaping */
  controlPoint?: { x: number; y: number };
  /** Arrowhead visual style ('triangle' | 'chevron' | 'stealth' | 'barb' | 'circle', default: 'triangle') */
  arrowheadStyle?: ArrowheadStyle;
  /** Arrowhead placement on line ('end' | 'start' | 'both', default: 'end') */
  arrowheadPlacement?: ArrowheadPlacement;
  /** Arrowhead dimension/size in pixels (default: 14) */
  arrowheadSize?: number;
  /** Arrowhead tip flare angle in degrees (default: 32) */
  arrowheadAngle?: number;
  /** Custom fill color for closed arrowheads (defaults to stroke color) */
  arrowheadFill?: string;
  /** Arrowhead entrance sequencing relative to line ('with-line' | 'after-line' | 'independent') */
  headTiming?: ArrowheadTiming;
  /** Delay in frames before arrowhead appears when using independent timing */
  headDelay?: number;
  /** Duration in frames for arrowhead entrance */
  headDurationInFrames?: number;
  /** Stroke color (default: '#276EF1') */
  stroke?: string;
  /** Stroke thickness in pixels (default: 2) */
  strokeWidth?: number;
  /** SVG line cap ('round' | 'butt' | 'square', default: 'round') */
  strokeLinecap?: 'round' | 'butt' | 'square';
  /** SVG line join ('round' | 'miter' | 'bevel', default: 'round') */
  strokeLinejoin?: 'round' | 'miter' | 'bevel';
  /** SVG stroke dash pattern (e.g. "8 4" for dashed arrows) */
  strokeDasharray?: string | number;
  /** Base stroke dash offset */
  strokeDashoffset?: number;
  /** Stroke opacity from 0 to 1 (default: 1) */
  strokeOpacity?: number;
  /** Overall container opacity from 0 to 1 (default: 1) */
  opacity?: number;
  /** Angular rotation in degrees (default: 0) */
  rotation?: number;
  /** CSS transform origin (default: 'center center') */
  transformOrigin?: string;
  /** Horizontal position translation offset in pixels */
  x?: number;
  /** Vertical position translation offset in pixels */
  y?: number;
  /** Uniform scale multiplier (default: 1) */
  scale?: number;
  /** Horizontal scale multiplier */
  scaleX?: number;
  /** Vertical scale multiplier */
  scaleY?: number;
  /** Explicit outer SVG width in pixels */
  width?: number;
  /** Explicit outer SVG height in pixels */
  height?: number;
  /** Primary animation type shorthand or full config */
  animation?: ArrowAnimation | ArrowAnimationConfig;
  /** Whether animation is enabled (default: true) */
  animate?: boolean;
  /** Frame delay before animation begins (shorthand for animation.delay) */
  delay?: number;
  /** Duration in frames (shorthand for animation.duration) */
  durationInFrames?: number;
  /** Easing preset or custom function */
  easing?: EasingPresetName | EasingFunction;
  /** Spring physics preset */
  springPreset?: SpringPresetName;
  /** Custom starting value override */
  from?: number;
  /** Custom target value override */
  to?: number;
  /** Optional exit animation frame trigger */
  exitFrame?: number;
  /** Duration in frames for exit transition */
  exitDurationInFrames?: number;
  /** Exit animation type */
  exitAnimation?: 'fade-out' | 'scale-out' | 'draw-out';
  /** Child elements positioned relative to arrow container */
  children?: React.ReactNode;
  /** Outer container CSS style */
  style?: React.CSSProperties;
  /** SVG element CSS style */
  svgStyle?: React.CSSProperties;
  /** Custom CSS class */
  className?: string;
}

// ---------------------------------------------------------------------------
// AnimatedPath Types
// ---------------------------------------------------------------------------

export type PathAnimation =
  | 'none'
  | 'draw-in'
  | 'draw-out'
  | 'reverse-draw'
  | 'progressive-reveal'
  | 'fade-in'
  | 'fade-out'
  | 'scale-in'
  | 'scale-out'
  | 'rotate'
  | 'stroke-width'
  | 'fill-reveal'
  | 'motion-along-path';

export type PathFillRevealTiming = 'with-draw' | 'after-draw' | 'independent';

export interface PathPoint {
  x: number;
  y: number;
  angle: number;
  distance: number;
  progress: number;
}

export interface PathFollowerConfig {
  /** Whether the follower is enabled and visible */
  enabled?: boolean;
  /** Radius / size of the follower indicator in pixels (default: 8) */
  size?: number;
  /** Fill color for default follower dot (defaults to stroke color) */
  color?: string;
  /** Stroke border color for follower */
  stroke?: string;
  /** Stroke width for follower */
  strokeWidth?: number;
  /** Whether follower automatically rotates to align with path tangent (default: true) */
  autoRotate?: boolean;
  /** Angle offset in degrees added to tangent angle (default: 0) */
  offsetAngle?: number;
  /** Frame delay before follower motion starts (default: 0) */
  delay?: number;
  /** Duration in frames for follower journey (default: same as path duration) */
  duration?: number;
  /** Whether follower repeats / loops continuously across frames */
  loop?: boolean;
  /** Easing function or preset for follower */
  easing?: EasingPresetName | EasingFunction;
  /** Custom follower element or render callback */
  customElement?: React.ReactNode | ((point: PathPoint) => React.ReactNode);
}

export interface PathAnimationConfig {
  /** Primary path animation preset */
  type?: PathAnimation;
  /** Delay in frames before animation triggers (default: 0) */
  delay?: number;
  /** Duration in frames for animation (default: 30) */
  duration?: number;
  /** Easing preset or custom function */
  easing?: EasingPresetName | EasingFunction;
  /** Spring physics preset */
  springPreset?: SpringPresetName;
  /** Custom initial numeric value */
  from?: number;
  /** Custom target numeric value */
  to?: number;
  /** Whether the animation repeats / loops continuously */
  loop?: boolean;
}

export interface AnimatedPathProps {
  /** SVG path data string ('M ... L ... C ... Z') */
  d: string;
  /** Fill color or gradient (default: 'none') */
  fill?: string;
  /** Fill rule ('nonzero' | 'evenodd', default: 'nonzero') */
  fillRule?: 'nonzero' | 'evenodd';
  /** Base fill opacity from 0 to 1 (default: 1) */
  fillOpacity?: number;
  /** Stroke color (default: '#276EF1') */
  stroke?: string;
  /** Stroke width in pixels (default: 2) */
  strokeWidth?: number;
  /** SVG stroke line cap ('round' | 'butt' | 'square', default: 'round') */
  strokeLinecap?: 'round' | 'butt' | 'square';
  /** SVG stroke line join ('round' | 'miter' | 'bevel', default: 'round') */
  strokeLinejoin?: 'round' | 'miter' | 'bevel';
  /** Stroke miter limit (default: 4) */
  strokeMiterlimit?: number;
  /** Stroke dasharray pattern (e.g. "6 4") */
  strokeDasharray?: string | number;
  /** Stroke dash offset */
  strokeDashoffset?: number;
  /** Stroke opacity from 0 to 1 (default: 1) */
  strokeOpacity?: number;
  /** Overall container opacity from 0 to 1 (default: 1) */
  opacity?: number;
  /** Explicit path total length override */
  pathLength?: number;
  /** Whether the path is explicitly closed (auto-detected if d contains Z/z) */
  isClosed?: boolean;
  /** SVG viewBox attribute string (auto-computed from path if omitted) */
  viewBox?: string;
  /** Outer container / SVG width (pixels or percentage) */
  width?: number | string;
  /** Outer container / SVG height (pixels or percentage) */
  height?: number | string;
  /** SVG preserveAspectRatio attribute (default: 'xMidYMid meet') */
  preserveAspectRatio?: string;
  /** Horizontal position translation offset in pixels */
  x?: number;
  /** Vertical position translation offset in pixels */
  y?: number;
  /** Angular rotation in degrees (default: 0) */
  rotation?: number;
  /** CSS transform origin (default: 'center center') */
  transformOrigin?: string;
  /** Uniform scale multiplier (default: 1) */
  scale?: number;
  /** Horizontal scale multiplier */
  scaleX?: number;
  /** Vertical scale multiplier */
  scaleY?: number;
  /** Primary animation type shorthand or full config */
  animation?: PathAnimation | PathAnimationConfig;
  /** Whether animation is enabled (default: true) */
  animate?: boolean;
  /** Frame delay before animation begins (shorthand for animation.delay) */
  delay?: number;
  /** Duration in frames (shorthand for animation.duration) */
  durationInFrames?: number;
  /** Easing preset or custom function */
  easing?: EasingPresetName | EasingFunction;
  /** Spring physics preset */
  springPreset?: SpringPresetName;
  /** Custom starting value override */
  from?: number;
  /** Custom target value override */
  to?: number;
  /** Fill reveal timing relative to stroke draw ('with-draw' | 'after-draw' | 'independent') */
  fillRevealTiming?: PathFillRevealTiming;
  /** Delay in frames before fill begins revealing */
  fillDelay?: number;
  /** Duration in frames for fill reveal */
  fillDurationInFrames?: number;
  /** Whether to show a traveling follower marker along the path */
  showFollower?: boolean;
  /** Follower detailed configuration */
  follower?: PathFollowerConfig;
  /** Follower size in pixels (shorthand for follower.size) */
  followerSize?: number;
  /** Follower color (shorthand for follower.color) */
  followerColor?: string;
  /** Follower stroke color */
  followerStroke?: string;
  /** Follower stroke width */
  followerStrokeWidth?: number;
  /** Whether follower auto-rotates along path tangent (default: true) */
  autoRotateFollower?: boolean;
  /** Frame delay before follower motion starts */
  followerDelay?: number;
  /** Duration in frames for follower traversal */
  followerDurationInFrames?: number;
  /** Whether follower loops */
  followerLoop?: boolean;
  /** Explicit manual follower progress override (0 to 1) */
  followerProgress?: number;
  /** Custom follower render function */
  renderFollower?: (point: PathPoint) => React.ReactNode;
  /** Optional exit animation frame trigger */
  exitFrame?: number;
  /** Duration in frames for exit transition */
  exitDurationInFrames?: number;
  /** Exit animation type */
  exitAnimation?: 'fade-out' | 'scale-out' | 'draw-out';
  /** Child elements or render function receiving PathPoint */
  children?: React.ReactNode | ((point: PathPoint) => React.ReactNode);
  /** Outer container CSS style */
  style?: React.CSSProperties;
  /** SVG element CSS style */
  svgStyle?: React.CSSProperties;
  /** Custom CSS class */
  className?: string;
}

// ---------------------------------------------------------------------------
// ParticleSystem Types
// ---------------------------------------------------------------------------

export type ParticleShape =
  | 'circle'
  | 'square'
  | 'ring'
  | 'star'
  | 'triangle'
  | 'cross'
  | 'custom';

export type ParticleDistribution =
  | 'random'
  | 'grid'
  | 'radial'
  | 'circular'
  | 'custom';

export type ParticleMotionMode =
  | 'float'
  | 'rise'
  | 'fall'
  | 'drift'
  | 'radial-expansion'
  | 'burst'
  | 'vortex'
  | 'none';

export type ParticleDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'radial'
  | 'omni'
  | 'drift';

export interface ParticleBounds {
  width: number;
  height: number;
}

export interface ParticleOrigin {
  x: number;
  y: number;
}

export interface ParticleDefinition {
  id: number;
  initialX: number;
  initialY: number;
  size: number;
  color: string;
  baseOpacity: number;
  shape: ParticleShape;
  angle: number;
  speed: number;
  rotationSpeed: number;
  phase: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  lifeOffset: number;
}

export interface ParticleLiveState {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  size: number;
  color: string;
  shape: ParticleShape;
}

export interface ParticleSystemConfig {
  /** Deterministic pseudo-random seed (string or number, default: 42) */
  seed?: string | number;
  /** Total number of particles to simulate (default: 40) */
  particleCount?: number;
  /** Geometric particle shape or array of shapes for mixed fields */
  shape?: ParticleShape | ParticleShape[];
  /** Spatial distribution algorithm across bounds (default: 'random') */
  distribution?: ParticleDistribution;
  /** Motion simulation mode (default: 'float') */
  motionMode?: ParticleMotionMode;
  /** Direction preset for linear motion ('up' | 'down' | 'left' | 'right' | 'radial' | 'omni' | 'drift') */
  direction?: ParticleDirection;
  /** Custom trajectory angle in degrees override */
  angle?: number;
  /** Simulation viewport dimensions in pixels (default: { width: 400, height: 300 }) */
  bounds?: ParticleBounds;
  /** Custom emission center/origin point */
  origin?: ParticleOrigin;
  /** Particle size in pixels or [min, max] range (default: [3, 8]) */
  size?: number | [number, number];
  /** Color or array of colors randomly distributed to particles */
  color?: string | string[];
  /** Particle opacity or [min, max] range (default: [0.3, 0.9]) */
  opacity?: number | [number, number];
  /** Particle movement speed multiplier or [min, max] range (default: 1) */
  speed?: number | [number, number];
  /** Angular rotation speed in deg/frame or [min, max] range (default: [-2, 2]) */
  rotationSpeed?: number | [number, number];
  /** Sinusoidal sway/wobble configuration or toggle (default: true) */
  wobble?: boolean | { frequency?: number; amplitude?: number };
  /** Dynamic scale breathing variation over lifetime (default: true) */
  scaleVariation?: boolean | [number, number];
  /** Whether particles fade in at birth and fade out at loop boundary (default: true) */
  fadeInOut?: boolean;
  /** Whether particle movement loops continuously across frames (default: true) */
  loop?: boolean;
  /** Frame delay before particle animation triggers (default: 0) */
  delay?: number;
  /** Duration in frames for a single motion lifecycle cycle (default: 60) */
  durationInFrames?: number;
  /** Custom initial particle coordinates for 'custom' distribution */
  customPositions?: Array<{ x: number; y: number }>;
}

export interface ParticleSystemProps extends ParticleSystemConfig {
  /** Master animation toggle (default: true) */
  animate?: boolean;
  /** Custom renderer callback for individual particles */
  renderParticle?: (particle: ParticleLiveState, index: number) => React.ReactNode;
  /** Frame trigger for exit transition */
  exitFrame?: number;
  /** Duration in frames for exit transition (default: 15) */
  exitDurationInFrames?: number;
  /** Exit transition type */
  exitAnimation?: 'fade-out' | 'scale-out';
  /** Outer container CSS styling */
  style?: React.CSSProperties;
  /** Inner SVG canvas CSS styling */
  svgStyle?: React.CSSProperties;
  /** Custom CSS class */
  className?: string;
  /** Child elements rendered inside/over the particle canvas */
  children?: React.ReactNode;
}



