/**
 * AnimatedArrow Style & Motion Calculations
 * Pure mathematical functions computing arrow coordinates, tangent angles,
 * curved Bezier paths, arrowhead vertices, bounding boxes, and stroke drawing kinetics.
 * Layer 2 of the Motion Graphics Framework.
 */

import type {
  ArrowDirection,
  ArrowheadStyle,
  ArrowheadTiming,
  ArrowAnimation,
  ArrowAnimationConfig,
  AnimatedArrowProps,
} from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { resolveEasing, easeOutCubic } from '../../utils/animation/easing.ts';
import { createSpring } from '../../utils/animation/spring.ts';

export interface ArrowCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cx: number;
  cy: number;
  isCurved: boolean;
  length: number;
  endAngle: number;
  startAngle: number;
}

export interface ArrowBoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  boxWidth: number;
  boxHeight: number;
  viewBox: string;
}

export interface ArrowMotionState {
  progress: number;
  lineProgress: number;
  headProgress: number;
  headScale: number;
  headOpacity: number;
  opacity: number;
  translateX: number;
  translateY: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  effectiveStrokeWidth: number;
  strokeDasharray: string | number | undefined;
  strokeDashoffset: number | undefined;
  pathLength: number;
  isAnimating: boolean;
  hasExited: boolean;
}

/**
 * Computes approximate arc length of a quadratic Bezier curve using 10 subdivisions.
 */
export function calculateQuadraticBezierLength(
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number
): number {
  let length = 0;
  let prevX = x1;
  let prevY = y1;
  const steps = 10;

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const invT = 1 - t;
    const currX = invT * invT * x1 + 2 * invT * t * cx + t * t * x2;
    const currY = invT * invT * y1 + 2 * invT * t * cy + t * t * y2;
    const dx = currX - prevX;
    const dy = currY - prevY;
    length += Math.sqrt(dx * dx + dy * dy);
    prevX = currX;
    prevY = currY;
  }

  return length;
}

/**
 * Resolves arrow coordinates, curvature control point, and tangent angles.
 */
export function resolveArrowCoordinates(props: AnimatedArrowProps): ArrowCoordinates {
  const {
    x1: rawX1,
    y1: rawY1,
    x2: rawX2,
    y2: rawY2,
    direction = 'right',
    length: rawLength = 100,
    curvature = 0,
    controlPoint,
  } = props;

  const x1 = rawX1 ?? 0;
  const y1 = rawY1 ?? 0;

  let x2: number;
  let y2: number;

  if (rawX2 !== undefined && rawY2 !== undefined) {
    x2 = rawX2;
    y2 = rawY2;
  } else {
    switch (direction as ArrowDirection) {
      case 'left':
        x2 = x1 - rawLength;
        y2 = y1;
        break;
      case 'up':
        x2 = x1;
        y2 = y1 - rawLength;
        break;
      case 'down':
        x2 = x1;
        y2 = y1 + rawLength;
        break;
      case 'diagonal-up-right':
        x2 = x1 + rawLength;
        y2 = y1 - rawLength;
        break;
      case 'diagonal-down-right':
        x2 = x1 + rawLength;
        y2 = y1 + rawLength;
        break;
      case 'diagonal-up-left':
        x2 = x1 - rawLength;
        y2 = y1 - rawLength;
        break;
      case 'diagonal-down-left':
        x2 = x1 - rawLength;
        y2 = y1 + rawLength;
        break;
      case 'right':
      case 'custom':
      default:
        x2 = x1 + rawLength;
        y2 = y1;
        break;
    }
  }

  const dx = x2 - x1;
  const dy = y2 - y1;
  const chordLength = Math.max(1, Math.sqrt(dx * dx + dy * dy));

  let cx: number;
  let cy: number;
  let isCurved = false;

  if (controlPoint) {
    cx = controlPoint.x;
    cy = controlPoint.y;
    isCurved = true;
  } else if (curvature !== 0) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    // Perpendicular normal vector
    const nx = -dy / chordLength;
    const ny = dx / chordLength;
    const offset = curvature * chordLength * 0.5;
    cx = mx + nx * offset;
    cy = my + ny * offset;
    isCurved = true;
  } else {
    cx = (x1 + x2) / 2;
    cy = (y1 + y2) / 2;
  }

  // Tangent angle at end point
  let endAngle: number;
  let startAngle: number;

  if (isCurved) {
    endAngle = (Math.atan2(y2 - cy, x2 - cx) * 180) / Math.PI;
    startAngle = (Math.atan2(y1 - cy, x1 - cx) * 180) / Math.PI;
  } else {
    endAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
    startAngle = endAngle + 180;
  }

  const length = isCurved
    ? calculateQuadraticBezierLength(x1, y1, cx, cy, x2, y2)
    : chordLength;

  return { x1, y1, x2, y2, cx, cy, isCurved, length, endAngle, startAngle };
}

/**
 * Returns SVG path string for arrow shaft (straight line or quadratic Bezier).
 */
export function describeArrowPath(coords: ArrowCoordinates): string {
  const { x1, y1, cx, cy, x2, y2, isCurved } = coords;
  if (isCurved) {
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  }
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

/**
 * Computes SVG path string for an arrowhead given tip position, angle, and style.
 */
export function calculateArrowheadPath(params: {
  tipX: number;
  tipY: number;
  angleInDegrees: number;
  size: number;
  flareAngle?: number;
  style?: ArrowheadStyle;
}): string {
  const {
    tipX,
    tipY,
    angleInDegrees,
    size,
    flareAngle = 32,
    style = 'triangle',
  } = params;

  const tipAngleRad = (angleInDegrees * Math.PI) / 180;
  const flareRad = (flareAngle * Math.PI) / 180;

  // Left and right wing barb angles (swept backwards from tip)
  const leftAngle = tipAngleRad + Math.PI - flareRad;
  const rightAngle = tipAngleRad + Math.PI + flareRad;

  const w1x = tipX + size * Math.cos(leftAngle);
  const w1y = tipY + size * Math.sin(leftAngle);
  const w2x = tipX + size * Math.cos(rightAngle);
  const w2y = tipY + size * Math.sin(rightAngle);

  switch (style) {
    case 'chevron':
      // Open V-shaped stroke path
      return `M ${w1x.toFixed(2)} ${w1y.toFixed(2)} L ${tipX.toFixed(2)} ${tipY.toFixed(2)} L ${w2x.toFixed(2)} ${w2y.toFixed(2)}`;

    case 'stealth': {
      // Inward notched tactical stealth triangle
      const notchDist = size * 0.7;
      const notchAngle = tipAngleRad + Math.PI;
      const nx = tipX + notchDist * Math.cos(notchAngle);
      const ny = tipY + notchDist * Math.sin(notchAngle);
      return `M ${tipX.toFixed(2)} ${tipY.toFixed(2)} L ${w1x.toFixed(2)} ${w1y.toFixed(2)} L ${nx.toFixed(2)} ${ny.toFixed(2)} L ${w2x.toFixed(2)} ${w2y.toFixed(2)} Z`;
    }

    case 'barb': {
      // Curved barb
      const mx = (w1x + w2x) / 2;
      const my = (w1y + w2y) / 2;
      return `M ${tipX.toFixed(2)} ${tipY.toFixed(2)} L ${w1x.toFixed(2)} ${w1y.toFixed(2)} Q ${mx.toFixed(2)} ${my.toFixed(2)} ${w2x.toFixed(2)} ${w2y.toFixed(2)} Z`;
    }

    case 'circle': {
      // Circle dot indicator at tip
      const r = Math.max(2, size / 3);
      return `M ${tipX - r} ${tipY} A ${r} ${r} 0 1 0 ${tipX + r} ${tipY} A ${r} ${r} 0 1 0 ${tipX - r} ${tipY} Z`;
    }

    case 'triangle':
    default:
      // Classic solid triangle
      return `M ${tipX.toFixed(2)} ${tipY.toFixed(2)} L ${w1x.toFixed(2)} ${w1y.toFixed(2)} L ${w2x.toFixed(2)} ${w2y.toFixed(2)} Z`;
  }
}

/**
 * Calculates SVG bounding box and viewBox dimensions for arrow rendering.
 */
export function calculateArrowBoundingBox(params: {
  coords: ArrowCoordinates;
  arrowheadSize: number;
  strokeWidth: number;
  width?: number;
  height?: number;
}): ArrowBoundingBox {
  const { coords, arrowheadSize, strokeWidth, width, height } = params;
  const { x1, y1, cx, cy, x2, y2, isCurved } = coords;

  const pad = Math.max(arrowheadSize * 1.5, strokeWidth * 2);

  const pointsX = isCurved ? [x1, x2, cx] : [x1, x2];
  const pointsY = isCurved ? [y1, y2, cy] : [y1, y2];

  const minX = Math.min(...pointsX);
  const minY = Math.min(...pointsY);
  const maxX = Math.max(...pointsX);
  const maxY = Math.max(...pointsY);

  const boxWidth = width ?? Math.max(pad * 2, maxX - minX + pad * 2);
  const boxHeight = height ?? Math.max(pad * 2, maxY - minY + pad * 2);

  return {
    minX,
    minY,
    maxX,
    maxY,
    boxWidth: Math.max(1, Math.ceil(boxWidth)),
    boxHeight: Math.max(1, Math.ceil(boxHeight)),
    viewBox: `0 0 ${Math.max(1, Math.ceil(boxWidth))} ${Math.max(1, Math.ceil(boxHeight))}`,
  };
}

/**
 * Normalizes user animation input into a unified ArrowAnimationConfig.
 */
export function resolveArrowAnimationConfig(
  props: AnimatedArrowProps
): ArrowAnimationConfig {
  const {
    animation,
    animate = true,
    delay: propDelay = 0,
    startFrame,
    durationInFrames = 20,
    easing = 'easeOutCubic',
    springPreset,
    headTiming = 'with-line',
    headDelay,
    headDurationInFrames,
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
      headTiming,
      headDelay,
      headDuration: headDurationInFrames,
      from,
      to,
    };
  }

  if (typeof animation === 'object' && animation !== null) {
    return {
      type: animation.type ?? 'draw-in',
      delay: animation.delay ?? delay,
      duration: animation.duration ?? durationInFrames,
      easing: animation.easing ?? easing,
      springPreset: animation.springPreset ?? springPreset,
      direction: animation.direction ?? 'forward',
      headTiming: animation.headTiming ?? headTiming,
      headDelay: animation.headDelay ?? headDelay,
      headDuration: animation.headDuration ?? headDurationInFrames,
      from: animation.from ?? from,
      to: animation.to ?? to,
      loop: animation.loop ?? false,
    };
  }

  return {
    type: 'draw-in',
    delay,
    duration: durationInFrames,
    easing,
    springPreset,
    headTiming,
    headDelay,
    headDuration: headDurationInFrames,
    from,
    to,
  };
}

export interface CalculateArrowMotionParams {
  currentFrame: number;
  fps: number;
  coords: ArrowCoordinates;
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
  config: ArrowAnimationConfig;
  exitFrame?: number;
  exitDurationInFrames?: number;
  exitAnimation?: 'fade-out' | 'scale-out' | 'draw-out';
}

/**
 * Computes deterministic frame-accurate motion state for AnimatedArrow.
 */
export function calculateArrowMotion(params: CalculateArrowMotionParams): ArrowMotionState {
  const {
    currentFrame,
    fps,
    coords,
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
    config,
    exitFrame,
    exitDurationInFrames = 12,
    exitAnimation = 'fade-out',
  } = params;

  const { length } = coords;
  const pathLength = Math.max(1, length);

  const rawType: ArrowAnimation = config.type ?? 'draw-in';
  const delay = Math.max(0, config.delay ?? 0);
  const duration = Math.max(1, config.duration ?? 20);

  // Normalize animation type aliases
  let animationType: ArrowAnimation = rawType;
  if (rawType === 'draw' || rawType === 'reveal') animationType = 'draw-in';
  else if (rawType === 'directional-reveal') animationType = 'draw-in';

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
  let translateX = baseX;
  let translateY = baseY;
  const rotation = baseRotation;
  const effectiveStrokeWidth = strokeWidth;

  let strokeDasharray: string | number | undefined = userDasharray;
  let strokeDashoffset: number | undefined = userDashoffset;

  let lineProgress = clamp(progress, 0, 1);
  let headProgress = lineProgress;

  // Arrowhead reveal sequencing
  const headTiming: ArrowheadTiming = config.headTiming ?? 'with-line';

  if (animationType === 'draw-in' || animationType === 'arrowhead-reveal') {
    if (headTiming === 'after-line') {
      // Line draws in 0% to 75% of duration, head springs in during remaining 25%
      const lineDuration = duration * 0.75;
      const headDuration = duration * 0.25;
      const elapsed = Math.max(0, currentFrame - delay);

      const rawLineT = clamp(elapsed / Math.max(1, lineDuration), 0, 1);
      const rawHeadT = clamp((elapsed - lineDuration) / Math.max(1, headDuration), 0, 1);

      const easeFn = typeof config.easing === 'function'
        ? config.easing
        : (resolveEasing(config.easing ?? 'easeOutCubic') ?? easeOutCubic);

      lineProgress = currentFrame < delay ? 0 : easeFn(rawLineT);
      headProgress = currentFrame < delay + lineDuration ? 0 : easeFn(rawHeadT);
    } else if (headTiming === 'independent') {
      const hDelay = config.headDelay ?? delay + duration;
      const hDuration = Math.max(1, config.headDuration ?? 10);
      if (currentFrame < hDelay) {
        headProgress = 0;
      } else {
        const hElapsed = currentFrame - hDelay;
        const rawHeadT = clamp(hElapsed / hDuration, 0, 1);
        const easeFn = typeof config.easing === 'function'
          ? config.easing
          : (resolveEasing(config.easing ?? 'easeOutCubic') ?? easeOutCubic);
        headProgress = easeFn(rawHeadT);
      }
    } else {
      // with-line
      headProgress = lineProgress;
    }
  }

  // Primary animation kinematics
  switch (animationType) {
    case 'draw-in': {
      strokeDasharray = pathLength;
      strokeDashoffset = userDashoffset + (1 - lineProgress) * pathLength;
      break;
    }

    case 'draw-out': {
      strokeDasharray = pathLength;
      const outProgress = clamp(progress, 0, 1);
      strokeDashoffset = userDashoffset + outProgress * pathLength;
      headProgress = 1 - outProgress;
      break;
    }

    case 'arrowhead-reveal': {
      // Line is static, arrowhead springs / scales in
      lineProgress = 1;
      strokeDasharray = userDasharray;
      strokeDashoffset = userDashoffset;
      break;
    }

    case 'move-in': {
      const moveProgress = clamp(progress, 0, 1);
      const angleRad = (coords.endAngle * Math.PI) / 180;
      // Slides in from 30px backwards along arrow orientation
      const offsetDist = 30 * (1 - moveProgress);
      translateX += -Math.cos(angleRad) * offsetDist;
      translateY += -Math.sin(angleRad) * offsetDist;
      opacity = moveProgress * baseOpacity;
      break;
    }

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

    case 'none':
    default:
      lineProgress = 1;
      headProgress = 1;
      break;
  }

  // Head scale & opacity derived from headProgress
  const headScale = clamp(headProgress, 0, 1.5);
  const headOpacity = clamp(headProgress * 2, 0, 1);

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
      strokeDasharray = pathLength;
      strokeDashoffset = (strokeDashoffset ?? 0) + exitProgress * pathLength;
    }
  }

  return {
    progress,
    lineProgress,
    headProgress,
    headScale,
    headOpacity,
    opacity: hasExited ? 0 : clamp(opacity, 0, 1),
    translateX,
    translateY,
    rotation,
    scaleX,
    scaleY,
    effectiveStrokeWidth,
    strokeDasharray,
    strokeDashoffset,
    pathLength,
    isAnimating,
    hasExited,
  };
}
