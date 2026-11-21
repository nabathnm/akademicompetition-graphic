/**
 * Transition Component Prop Types
 */

import React from 'react';
import { BaseMotionProps } from '../types';
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

export interface WipeTransitionProps extends BaseMotionProps {
  direction?: 'leftToRight' | 'rightToLeft' | 'topToBottom' | 'bottomToTop';
  color?: string;
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

export interface ZoomTransitionProps extends BaseMotionProps {
  type?: 'zoomIn' | 'zoomOut';
  maxScale?: number;
}
