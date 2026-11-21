/**
 * Transition Component Prop Types
 */

import React from 'react';
import type { EasingFunction, EasingPresetName } from '../../utils/animation/easing';

export type FadeTransitionMode = 'in' | 'out' | 'in-out' | 'crossfade';

export interface FadeTransitionMetrics {
  opacity: number;
  outgoingOpacity: number;
  incomingOpacity: number;
  progress: number;
  isComplete: boolean;
  phase: 'pending' | 'in' | 'hold' | 'out' | 'complete';
}

export interface FadeTransitionProps {
  /** Transition mode ('in' | 'out' | 'in-out' | 'crossfade', default: 'in') */
  mode?: FadeTransitionMode;
  /** Direction alias for mode ('in' | 'out') */
  direction?: 'in' | 'out';
  /** Total animation duration in frames (default: 25) */
  duration?: number;
  /** Alias for duration in frames (matches Remotion standard) */
  durationInFrames?: number;
  /** Frame delay before the transition begins (default: 0) */
  delay?: number;
  /** Initial opacity value (default: 0) */
  fromOpacity?: number;
  /** Final target opacity value (default: 1) */
  toOpacity?: number;
  /** Inverts the transition timing progress (default: false) */
  reverse?: boolean;
  /** Easing function or preset name (default: 'easeInOut') */
  easing?: EasingPresetName | EasingFunction;
  /** Duration of entrance fade in 'in-out' mode (optional) */
  inDuration?: number;
  /** Duration of hold phase in 'in-out' mode (optional) */
  holdDuration?: number;
  /** Duration of exit fade in 'in-out' mode (optional) */
  outDuration?: number;
  /** Outgoing content layer for crossfade mode */
  fromContent?: React.ReactNode;
  /** Outgoing content layer alias for crossfade mode */
  outgoingContent?: React.ReactNode;
  /** Incoming content layer for crossfade mode */
  toContent?: React.ReactNode;
  /** Incoming content layer alias for crossfade mode */
  incomingContent?: React.ReactNode;
  /** Optional container background color */
  backgroundColor?: string;
  /** Custom container style */
  style?: React.CSSProperties;
  /** Custom container class name */
  className?: string;
  /** Children to be faded, or array/tuple of [outgoing, incoming] for crossfade */
  children?: React.ReactNode;
}

export type WipeDirection =
  | 'left-to-right'
  | 'leftToRight'
  | 'right-to-left'
  | 'rightToLeft'
  | 'top-to-bottom'
  | 'topToBottom'
  | 'bottom-to-top'
  | 'bottomToTop'
  | 'center-out'
  | 'centerOut'
  | 'center-in'
  | 'centerIn'
  | 'diagonal'
  | 'diagonal-top-left'
  | 'diagonal-top-right'
  | 'radial'
  | 'circle';

export type WipeTransitionMode =
  | 'reveal'
  | 'in'
  | 'hide'
  | 'out'
  | 'reveal-hide'
  | 'in-out'
  | 'replace'
  | 'cross-wipe';

export interface WipeEdgeStyle {
  color?: string;
  width?: number;
  glow?: boolean;
  shadow?: string;
}

export interface WipeTransitionMetrics {
  clipPath: string;
  opacity: number;
  progress: number;
  isComplete: boolean;
  phase: 'pending' | 'in' | 'hold' | 'out' | 'complete';
  edgePosition?: {
    x?: string;
    y?: string;
    width?: string;
    height?: string;
    visible: boolean;
  };
  outgoingClipPath: string;
  outgoingOpacity: number;
  incomingClipPath: string;
  incomingOpacity: number;
}

export interface WipeTransitionProps {
  /** Wipe movement direction (default: 'left-to-right') */
  direction?: WipeDirection;
  /** Transition mode ('reveal' | 'hide' | 'reveal-hide' | 'replace', default: 'reveal') */
  mode?: WipeTransitionMode;
  /** Total animation duration in frames (default: 25) */
  duration?: number;
  /** Duration in frames alias (matches Remotion standard) */
  durationInFrames?: number;
  /** Frame delay before wipe begins (default: 0) */
  delay?: number;
  /** Easing curve preset or custom easing function (default: 'easeInOut') */
  easing?: EasingPresetName | EasingFunction;
  /** Reveal origin for radial / center wipes (default: 'center') */
  revealOrigin?: string;
  /** Simultaneous opacity fade along with wipe (default: false) */
  fade?: boolean;
  /** Explicit starting opacity override */
  fromOpacity?: number;
  /** Explicit ending opacity override */
  toOpacity?: number;
  /** Inverts the transition timing progress (default: false) */
  reverse?: boolean;
  /** Optional visual leading edge bar styling */
  edgeStyle?: WipeEdgeStyle;
  /** Edge color alias */
  edgeColor?: string;
  /** Edge width in pixels */
  edgeWidth?: number;
  /** Duration of entrance phase in 'reveal-hide' mode */
  inDuration?: number;
  /** Duration of hold phase in 'reveal-hide' mode */
  holdDuration?: number;
  /** Duration of exit phase in 'reveal-hide' mode */
  outDuration?: number;
  /** Outgoing layer for replace mode */
  fromContent?: React.ReactNode;
  /** Outgoing layer alias for replace mode */
  outgoingContent?: React.ReactNode;
  /** Incoming layer for replace mode */
  toContent?: React.ReactNode;
  /** Incoming layer alias for replace mode */
  incomingContent?: React.ReactNode;
  /** Optional container background color */
  backgroundColor?: string;
  /** Custom container style */
  style?: React.CSSProperties;
  /** Custom container class name */
  className?: string;
  /** Child content elements */
  children?: React.ReactNode;
}

export type SlideDirection =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'up'
  | 'down'
  | 'top-left'
  | 'topLeft'
  | 'top-right'
  | 'topRight'
  | 'bottom-left'
  | 'bottomLeft'
  | 'bottom-right'
  | 'bottomRight'
  | 'horizontal'
  | 'vertical';

export type SlideTransitionMode =
  | 'enter'
  | 'in'
  | 'exit'
  | 'out'
  | 'enter-exit'
  | 'in-out'
  | 'replace'
  | 'cross-slide';

export interface SlideTransitionMetrics {
  translateX: string;
  translateY: string;
  rawX: number;
  rawY: number;
  opacity: number;
  outgoingTranslateX: string;
  outgoingTranslateY: string;
  outgoingOpacity: number;
  incomingTranslateX: string;
  incomingTranslateY: string;
  incomingOpacity: number;
  progress: number;
  isComplete: boolean;
  phase: 'pending' | 'enter' | 'hold' | 'exit' | 'complete';
}

export interface SlideTransitionProps {
  /** Slide movement direction (default: 'left') */
  direction?: SlideDirection;
  /** Transition mode ('enter' | 'exit' | 'enter-exit' | 'replace', default: 'enter') */
  mode?: SlideTransitionMode;
  /** Distance to travel (e.g. 100, 300, '100%', default: '100%') */
  distance?: number | string;
  /** Custom starting position coordinates override */
  startPosition?: { x?: number | string; y?: number | string };
  /** Custom ending position coordinates override */
  endPosition?: { x?: number | string; y?: number | string };
  /** Duration in frames (default: 25) */
  duration?: number;
  /** Duration in frames alias */
  durationInFrames?: number;
  /** Frame delay before movement begins (default: 0) */
  delay?: number;
  /** Easing curve preset or custom easing function (default: 'easeOut') */
  easing?: EasingPresetName | EasingFunction;
  /** Simultaneous opacity fade along with slide movement (default: false) */
  fade?: boolean;
  /** Physics-based spring motion (boolean or spring preset name) */
  spring?: boolean | string;
  /** Spring preset alias */
  springPreset?: string;
  /** Whether to allow spring overshoot past target before settling */
  overshoot?: boolean;
  /** Inverts the transition timing progress (default: false) */
  reverse?: boolean;
  /** Clip content moving outside container bounds (default: true) */
  clip?: boolean;
  /** Container overflow override */
  overflow?: 'hidden' | 'visible';
  /** Duration of enter phase in 'enter-exit' mode */
  inDuration?: number;
  /** Duration of hold phase in 'enter-exit' mode */
  holdDuration?: number;
  /** Duration of exit phase in 'enter-exit' mode */
  outDuration?: number;
  /** Outgoing layer for replace mode */
  fromContent?: React.ReactNode;
  /** Outgoing layer alias for replace mode */
  outgoingContent?: React.ReactNode;
  /** Incoming layer for replace mode */
  toContent?: React.ReactNode;
  /** Incoming layer alias for replace mode */
  incomingContent?: React.ReactNode;
  /** Optional container background color */
  backgroundColor?: string;
  /** Custom container style */
  style?: React.CSSProperties;
  /** Custom container class name */
  className?: string;
  /** Child content elements */
  children?: React.ReactNode;
}

export type ZoomTransitionMode =
  | 'in'
  | 'zoom-in'
  | 'zoomIn'
  | 'out'
  | 'zoom-out'
  | 'zoomOut'
  | 'in-out'
  | 'inOut'
  | 'zoom-in-out'
  | 'through'
  | 'zoom-through'
  | 'zoomThrough'
  | 'replace'
  | 'zoom-replace'
  | 'cross-zoom';

export interface ZoomTransitionMetrics {
  scale: number;
  opacity: number;
  rotation: number;
  transform: string;
  transformOrigin: string;
  outgoingScale: number;
  outgoingOpacity: number;
  outgoingRotation: number;
  outgoingTransform: string;
  incomingScale: number;
  incomingOpacity: number;
  incomingRotation: number;
  incomingTransform: string;
  progress: number;
  isComplete: boolean;
  phase: 'pending' | 'in' | 'hold' | 'out' | 'complete';
}

export interface ZoomTransitionProps {
  /** Transition mode: 'in' | 'out' | 'in-out' | 'through' | 'replace' (default: 'in') */
  mode?: ZoomTransitionMode;
  /** Initial scale value (default: mode-dependent, e.g. 0 for 'in', 1 for 'out') */
  initialScale?: number;
  /** Final scale value (default: mode-dependent, e.g. 1 for 'in', 0 for 'out', 2.5 for 'through') */
  finalScale?: number;
  /** Midpoint scale for 'through' mode (default: 1.0) */
  throughScale?: number;
  /** Scale for outgoing layer in 'replace' mode (default: 1.4) */
  outgoingScale?: number;
  /** Initial scale for incoming layer in 'replace' mode (default: 0.6) */
  incomingScale?: number;
  /** Transform origin pivot point (e.g. 'center', 'top left', '50% 50%', default: 'center') */
  transformOrigin?: string;
  /** Total animation duration in frames (default: 25) */
  duration?: number;
  /** Duration in frames alias (matches Remotion standard) */
  durationInFrames?: number;
  /** Frame delay before zoom begins (default: 0) */
  delay?: number;
  /** Easing curve preset or custom easing function (default: 'easeOut') */
  easing?: EasingPresetName | EasingFunction;
  /** Simultaneous opacity fade along with zoom (default: false) */
  fade?: boolean;
  /** Explicit starting opacity override */
  fromOpacity?: number;
  /** Explicit ending opacity override */
  toOpacity?: number;
  /** Subtle rotation in degrees during zoom (default: 0) */
  rotation?: number;
  /** Starting rotation angle in degrees */
  initialRotation?: number;
  /** Ending rotation angle in degrees */
  finalRotation?: number;
  /** Physics-based spring motion (boolean or spring preset name) */
  spring?: boolean | string;
  /** Spring preset alias */
  springPreset?: string;
  /** Whether to allow spring overshoot past target scale before settling */
  overshoot?: boolean;
  /** Inverts the transition timing progress (default: false) */
  reverse?: boolean;
  /** Clip content moving outside container bounds (default: true) */
  clip?: boolean;
  /** Container overflow override */
  overflow?: 'hidden' | 'visible';
  /** Duration of entrance phase in 'in-out' mode */
  inDuration?: number;
  /** Duration of hold phase in 'in-out' mode */
  holdDuration?: number;
  /** Duration of exit phase in 'in-out' mode */
  outDuration?: number;
  /** Outgoing layer for replace mode */
  fromContent?: React.ReactNode;
  /** Outgoing layer alias for replace mode */
  outgoingContent?: React.ReactNode;
  /** Incoming layer for replace mode */
  toContent?: React.ReactNode;
  /** Incoming layer alias for replace mode */
  incomingContent?: React.ReactNode;
  /** Optional container background color */
  backgroundColor?: string;
  /** Custom container style */
  style?: React.CSSProperties;
  /** Custom container class name */
  className?: string;
  /** Child content elements */
  children?: React.ReactNode;
}

export type MaskType =
  | 'rectangle'
  | 'rect'
  | 'rounded-rectangle'
  | 'roundedRectangle'
  | 'rounded-rect'
  | 'roundedRect'
  | 'circle'
  | 'ellipse'
  | 'polygon'
  | 'path'
  | 'svg-path'
  | 'svgPath'
  | 'svg';

export type MaskTransitionMode =
  | 'reveal'
  | 'expand'
  | 'in'
  | 'hide'
  | 'contract'
  | 'out'
  | 'reveal-hide'
  | 'in-out'
  | 'revealHide'
  | 'replace'
  | 'cross-mask'
  | 'crossMask';

export type MaskPolygonShape =
  | 'triangle'
  | 'star'
  | 'diamond'
  | 'hexagon'
  | 'pentagon';

export interface MaskOriginPoint {
  x: number;
  y: number;
  label: string;
}

export interface MaskShapeData {
  type: 'rectangle' | 'rounded-rectangle' | 'circle' | 'ellipse' | 'polygon' | 'path';
  rx?: number;
  ry?: number;
  points?: string;
  d?: string;
  viewBox?: string;
  pathTransform?: string;
}

export interface MaskTransitionMetrics {
  scale: number;
  opacity: number;
  rotation: number;
  progress: number;
  isComplete: boolean;
  phase: 'pending' | 'in' | 'hold' | 'out' | 'complete';
  transform: string;
  clipPath: string;
  clipId: string;
  origin: MaskOriginPoint;
  shape: MaskShapeData;
  outgoingScale: number;
  outgoingOpacity: number;
  outgoingRotation: number;
  outgoingTransform: string;
  incomingScale: number;
  incomingOpacity: number;
  incomingRotation: number;
  incomingTransform: string;
}

export interface MaskTransitionProps {
  /** Mask geometry type (default: 'circle') */
  maskType?: MaskType;
  /** Transition mode ('reveal' | 'hide' | 'reveal-hide' | 'replace', default: 'reveal') */
  mode?: MaskTransitionMode;
  /** Total animation duration in frames (default: 25) */
  duration?: number;
  /** Duration in frames alias (matches Remotion standard) */
  durationInFrames?: number;
  /** Frame delay before transition begins (default: 0) */
  delay?: number;
  /** Easing curve preset or custom easing function (default: 'easeInOut') */
  easing?: EasingPresetName | EasingFunction;
  /** Mask expansion/contraction origin point ('center', 'top left', 'bottom right', or '50% 50%', default: 'center') */
  origin?: string;
  /** Alias for origin */
  maskOrigin?: string;
  /** Geometric shape for polygon mask type ('star' | 'triangle' | 'diamond' | 'hexagon' | 'pentagon', default: 'star') */
  shape?: MaskPolygonShape;
  /** Custom polygon vertices string (e.g. "0,-0.5 0.5,0.5 -0.5,0.5") */
  polygonPoints?: string;
  /** Custom SVG path string (e.g. 'M 50 10 ...') or preset name ('heart' | 'star' | 'diamond' | 'badge' | 'cloud' | 'flower') */
  pathData?: string;
  /** Alias for pathData */
  d?: string;
  /** ViewBox for custom SVG path (default: '0 0 100 100') */
  pathViewBox?: string;
  /** Corner radius for rectangle and rounded-rectangle masks (0 to 0.5 normalized, default: 0.1 for rounded, 0 for rect) */
  cornerRadius?: number;
  /** Subtle rotation in degrees or animated rotation angle (default: 0) */
  rotation?: number;
  /** Starting rotation angle in degrees */
  initialRotation?: number;
  /** Ending rotation angle in degrees */
  finalRotation?: number;
  /** Scale multiplier applied to maximum coverage scale (default: 1.0) */
  scaleMultiplier?: number;
  /** Maximum scale override */
  maxScale?: number;
  /** Simultaneous opacity fade along with mask animation (default: false) */
  fade?: boolean;
  /** Explicit starting opacity override */
  fromOpacity?: number;
  /** Explicit ending opacity override */
  toOpacity?: number;
  /** Physics-based spring motion (boolean or spring preset name) */
  spring?: boolean | string;
  /** Spring preset alias */
  springPreset?: string;
  /** Whether to allow spring overshoot */
  overshoot?: boolean;
  /** Inverts the transition timing progress (default: false) */
  reverse?: boolean;
  /** Custom clipPath ID override */
  clipId?: string;
  /** Clip container overflow (default: 'hidden') */
  overflow?: 'hidden' | 'visible';
  /** Duration of entrance phase in 'reveal-hide' mode */
  inDuration?: number;
  /** Duration of hold phase in 'reveal-hide' mode */
  holdDuration?: number;
  /** Duration of exit phase in 'reveal-hide' mode */
  outDuration?: number;
  /** Outgoing layer for replace mode */
  fromContent?: React.ReactNode;
  /** Outgoing layer alias for replace mode */
  outgoingContent?: React.ReactNode;
  /** Incoming layer for replace mode */
  toContent?: React.ReactNode;
  /** Incoming layer alias for replace mode */
  incomingContent?: React.ReactNode;
  /** Optional container background color */
  backgroundColor?: string;
  /** Custom container style */
  style?: React.CSSProperties;
  /** Custom container class name */
  className?: string;
  /** Child content elements */
  children?: React.ReactNode;
}
