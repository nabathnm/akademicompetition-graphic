/**
 * AnimatedCircle Style & Motion Calculations
 * Pure mathematical functions computing circle dimensions, arc paths,
 * circular circumferences, radial sweeps, pulse oscillations, and SVG stroke-dash progress.
 * Layer 2 of the Motion Graphics Framework.
 */

import type {
  CircleAnimation,
  CircleAnimationConfig,
  AnimatedCircleProps,
} from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { resolveEasing, easeOutCubic } from '../../utils/animation/easing.ts';
import { createSpring } from '../../utils/animation/spring.ts';

export interface CircleDimensions {
  radius: number;
  diameter: number;
  size: number;
  cx: number;
  cy: number;
  circumference: number;
}

export interface CircleMotionState {
  progress: number;
  opacity: number;
  scaleX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
  rotation: number;
  effectiveRadius: number;
  effectiveStrokeWidth: number;
  strokeDasharray: string | number | undefined;
  strokeDashoffset: number | undefined;
  effectiveStartAngle: number;
  effectiveEndAngle: number;
  effectiveProgress: number;
  isAnimating: boolean;
  hasExited: boolean;
}

/**
 * Calculates circle circumference: C = 2 * PI * r
 */
export function calculateCircumference(radius: number): number {
  return 2 * Math.PI * Math.max(0, radius);
}

/**
 * Resolves radius, size, center coordinates, and circumference from props.
 */
export function resolveCircleDimensions(props: AnimatedCircleProps): CircleDimensions {
  const strokeWidth = props.strokeWidth ?? 2;
  let radius: number;

  if (props.radius !== undefined) {
    radius = Math.max(1, props.radius);
  } else if (props.size !== undefined) {
    radius = Math.max(1, (props.size - strokeWidth) / 2);
  } else {
    radius = 50;
  }

  const diameter = radius * 2;
  const size = props.size !== undefined
    ? Math.max(1, props.size)
    : Math.ceil(diameter + strokeWidth);

  const cx = size / 2;
  const cy = size / 2;
  const circumference = calculateCircumference(radius);

  return { radius, diameter, size, cx, cy, circumference };
}

/**
 * Converts polar coordinate (angle in degrees, radius) to Cartesian (x, y).
 * 0 degrees points straight UP (12 o'clock).
 */
export function calculateArcCoordinates(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const radians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

/**
 * Computes SVG path string for an arc or sector wedge.
 */
export function describeArcPath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  closed = false
): string {
  const span = Math.abs(endAngle - startAngle);
  if (span <= 0) return '';

  // If full circle, render as two connected semicircles to avoid zero-length arc singularity
  if (span >= 359.99) {
    const top = calculateArcCoordinates(cx, cy, radius, 0);
    const bottom = calculateArcCoordinates(cx, cy, radius, 180);
    return `M ${top.x.toFixed(2)} ${top.y.toFixed(2)} A ${radius.toFixed(2)} ${radius.toFixed(2)} 0 1 1 ${bottom.x.toFixed(2)} ${bottom.y.toFixed(2)} A ${radius.toFixed(2)} ${radius.toFixed(2)} 0 1 1 ${top.x.toFixed(2)} ${top.y.toFixed(2)} ${closed ? 'Z' : ''}`;
  }

  const start = calculateArcCoordinates(cx, cy, radius, startAngle);
  const end = calculateArcCoordinates(cx, cy, radius, endAngle);
  const largeArcFlag = span > 180 ? 1 : 0;
  const sweepFlag = endAngle >= startAngle ? 1 : 0;

  if (closed) {
    return `M ${cx.toFixed(2)} ${cy.toFixed(2)} L ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius.toFixed(2)} ${radius.toFixed(2)} 0 ${largeArcFlag} ${sweepFlag} ${end.x.toFixed(2)} ${end.y.toFixed(2)} Z`;
  }

  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius.toFixed(2)} ${radius.toFixed(2)} 0 ${largeArcFlag} ${sweepFlag} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

/**
 * Normalizes user animation input into a unified CircleAnimationConfig.
 */
export function resolveCircleAnimationConfig(
  props: AnimatedCircleProps
): CircleAnimationConfig {
  const {
    animation,
    animate = true,
    delay: propDelay = 0,
    startFrame,
    durationInFrames = 20,
    easing = 'easeOutCubic',
    springPreset,
    direction = 'clockwise',
    from,
    to,
  } = props;

  const delay = propDelay !== 0 ? propDelay : (startFrame ?? 0);

  if (!animate) {
    return { type: 'none', delay: 0, duration: 0 };
  }

  if (typeof animation === 'string') {
    return {
      type: animation,
      delay,
      duration: durationInFrames,
      easing,
      springPreset,
      direction,
      from,
      to,
    };
  }

  if (typeof animation === 'object' && animation !== null) {
    return {
      type: animation.type ?? 'scale-in',
      delay: animation.delay ?? delay,
      duration: animation.duration ?? durationInFrames,
      easing: animation.easing ?? easing,
      springPreset: animation.springPreset ?? springPreset,
      direction: animation.direction ?? direction,
      from: animation.from ?? from,
      to: animation.to ?? to,
      loop: animation.loop ?? false,
      pulseMagnitude: animation.pulseMagnitude ?? 0.08,
      pulseFrequency: animation.pulseFrequency ?? 30,
    };
  }

  // Default to progress animation if progress prop is provided, otherwise scale-in
  const defaultType: CircleAnimation = props.progress !== undefined ? 'progress' : 'scale-in';

  return {
    type: defaultType,
    delay,
    duration: durationInFrames,
    easing,
    springPreset,
    direction,
    from,
    to,
  };
}

export interface CalculateCircleMotionParams {
  currentFrame: number;
  fps: number;
  dimensions: CircleDimensions;
  strokeWidth: number;
  userDasharray?: string | number;
  userDashoffset?: number;
  baseOpacity?: number;
  baseRotation?: number;
  baseX?: number;
  baseY?: number;
  baseScale?: number;
  baseScaleX?: number;
  baseScaleY?: number;
  startAngle?: number;
  endAngle?: number;
  progress?: number;
  config: CircleAnimationConfig;
  exitFrame?: number;
  exitDurationInFrames?: number;
  exitAnimation?: 'fade-out' | 'scale-out' | 'draw-out' | 'stroke-width';
}

/**
 * Computes deterministic frame-accurate motion state for AnimatedCircle.
 */
export function calculateCircleMotion(
  params: CalculateCircleMotionParams
): CircleMotionState {
  const {
    currentFrame,
    fps,
    dimensions,
    strokeWidth,
    userDasharray,
    userDashoffset = 0,
    baseOpacity = 1,
    baseRotation = 0,
    baseX = 0,
    baseY = 0,
    baseScale = 1,
    baseScaleX = 1,
    baseScaleY = 1,
    startAngle = 0,
    endAngle = 360,
    progress: userProgress,
    config,
    exitFrame,
    exitDurationInFrames = 12,
    exitAnimation = 'fade-out',
  } = params;

  const { radius, circumference } = dimensions;
  const rawType: CircleAnimation = config.type ?? 'scale-in';
  const delay = Math.max(0, config.delay ?? 0);
  const duration = Math.max(1, config.duration ?? 20);

  // Normalize animation type aliases
  let animationType: CircleAnimation = rawType;
  if (rawType === 'draw') animationType = 'draw-in';
  else if (rawType === 'expand') animationType = 'ring-expansion';
  else if (rawType === 'circular-progress') animationType = 'progress';

  // Calculate entrance progress
  let progress = 1;
  let isAnimating = false;

  if (animationType !== 'none') {
    if (currentFrame < delay) {
      progress = 0;
      isAnimating = false;
    } else {
      const elapsed = currentFrame - delay;
      if (elapsed < duration) {
        isAnimating = true;
      }
      const rawT = clamp(elapsed / duration, 0, 1);

      if (config.springPreset) {
        progress = createSpring({
          frame: currentFrame,
          fps,
          delay,
          preset: config.springPreset,
          from: 0,
          to: 1,
        });
      } else {
        const easeFn = typeof config.easing === 'function'
          ? config.easing
          : (resolveEasing(config.easing ?? 'easeOutCubic') ?? easeOutCubic);
        progress = easeFn(rawT);
      }
    }
  }

  // Base state values
  let opacity = baseOpacity;
  let scaleX = baseScale * baseScaleX;
  let scaleY = baseScale * baseScaleY;
  const translateX = baseX;
  const translateY = baseY;
  let rotation = baseRotation;

  let effectiveRadius = radius;
  let effectiveStrokeWidth = strokeWidth;
  let strokeDasharray: string | number | undefined = userDasharray;
  let strokeDashoffset: number | undefined = userDashoffset;

  let effectiveStartAngle = startAngle;
  let effectiveEndAngle = endAngle;

  // Normalized target progress ratio (0 to 1)
  const targetProgress = userProgress !== undefined
    ? (userProgress > 1 ? userProgress / 100 : userProgress)
    : 1;
  let effectiveProgress = targetProgress;

  // Apply primary entrance animation kinematics
  switch (animationType) {
    case 'scale-in': {
      const p = clamp(progress, 0, 1.5);
      scaleX *= p;
      scaleY *= p;
      opacity = baseOpacity * clamp(progress * 1.5, 0, 1);
      break;
    }

    case 'scale-out': {
      const p = clamp(1 - progress, 0, 1);
      scaleX *= p;
      scaleY *= p;
      opacity = baseOpacity * p;
      break;
    }

    case 'fade-in': {
      opacity = baseOpacity * clamp(progress, 0, 1);
      break;
    }

    case 'fade-out': {
      opacity = baseOpacity * clamp(1 - progress, 0, 1);
      break;
    }

    case 'draw-in': {
      strokeDasharray = circumference;
      const drawProgress = clamp(progress, 0, 1);
      strokeDashoffset = userDashoffset + (1 - drawProgress) * circumference;
      break;
    }

    case 'draw-out': {
      strokeDasharray = circumference;
      const outProgress = clamp(progress, 0, 1);
      strokeDashoffset = userDashoffset + outProgress * circumference;
      break;
    }

    case 'radial-reveal': {
      const sweepProgress = clamp(progress, 0, 1);
      const totalSpan = endAngle - startAngle;
      if (config.direction === 'counter-clockwise') {
        effectiveStartAngle = endAngle - sweepProgress * totalSpan;
        effectiveEndAngle = endAngle;
      } else {
        effectiveStartAngle = startAngle;
        effectiveEndAngle = startAngle + sweepProgress * totalSpan;
      }
      break;
    }

    case 'ring-expansion': {
      const expProgress = clamp(progress, 0, 1);
      const startR = config.from ?? 0;
      const targetR = config.to ?? radius;
      effectiveRadius = startR + expProgress * (targetR - startR);
      break;
    }

    case 'rotate': {
      const dirSign = config.direction === 'counter-clockwise' ? -1 : 1;
      const totalAngle = config.to ?? 360;
      if (config.loop) {
        const elapsed = Math.max(0, currentFrame - delay);
        rotation = baseRotation + dirSign * ((elapsed / duration) * totalAngle);
      } else {
        rotation = baseRotation + dirSign * (clamp(progress, 0, 1) * totalAngle);
      }
      break;
    }

    case 'pulse': {
      const elapsed = Math.max(0, currentFrame - delay);
      const freq = Math.max(6, config.pulseFrequency ?? 30);
      const mag = config.pulseMagnitude ?? 0.08;
      const phase = (elapsed / freq) * 2 * Math.PI;
      const pulseFactor = 1 + Math.sin(phase) * mag;
      scaleX *= pulseFactor;
      scaleY *= pulseFactor;
      break;
    }

    case 'progress': {
      const p = clamp(progress, 0, 1);
      const startP = config.from ?? 0;
      effectiveProgress = startP + p * (targetProgress - startP);
      const arcLength = clamp(effectiveProgress, 0, 1) * circumference;
      strokeDasharray = `${arcLength.toFixed(2)} ${circumference.toFixed(2)}`;
      strokeDashoffset = 0;
      break;
    }

    case 'stroke-width': {
      const widthProgress = clamp(progress, 0, 1);
      const startW = config.from ?? 0;
      const targetW = config.to ?? strokeWidth;
      effectiveStrokeWidth = startW + widthProgress * (targetW - startW);
      break;
    }

    case 'none':
    default:
      break;
  }

  // Handle Exit Animation
  let hasExited = false;
  if (exitFrame !== undefined && currentFrame >= exitFrame) {
    const exitElapsed = currentFrame - exitFrame;
    const exitProgress = clamp(exitElapsed / Math.max(1, exitDurationInFrames), 0, 1);

    if (exitProgress >= 1) {
      hasExited = true;
    }

    if (exitAnimation === 'fade-out') {
      opacity *= 1 - exitProgress;
    } else if (exitAnimation === 'scale-out') {
      scaleX *= 1 - exitProgress;
      scaleY *= 1 - exitProgress;
      opacity *= 1 - exitProgress;
    } else if (exitAnimation === 'draw-out') {
      strokeDasharray = circumference;
      strokeDashoffset = (strokeDashoffset ?? 0) + exitProgress * circumference;
    } else if (exitAnimation === 'stroke-width') {
      effectiveStrokeWidth *= 1 - exitProgress;
    }
  }

  return {
    progress,
    opacity: hasExited ? 0 : clamp(opacity, 0, 1),
    scaleX,
    scaleY,
    translateX,
    translateY,
    rotation,
    effectiveRadius: Math.max(0, effectiveRadius),
    effectiveStrokeWidth: Math.max(0, effectiveStrokeWidth),
    strokeDasharray,
    strokeDashoffset,
    effectiveStartAngle,
    effectiveEndAngle,
    effectiveProgress: clamp(effectiveProgress, 0, 1),
    isAnimating,
    hasExited,
  };
}
