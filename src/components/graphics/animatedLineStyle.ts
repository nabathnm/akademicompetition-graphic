/**
 * AnimatedLine Style & Motion Calculations
 * Pure mathematical functions computing line lengths, angles, midpoints,
 * SVG stroke-dash arrays, directional reveals, spring & easing transformations.
 * Layer 2 of the Motion Graphics Framework.
 */

import type {
  LineOrientation,
  LineAnimation,
  LineAnimationConfig,
  AnimatedLineProps,
} from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { resolveEasing, easeOutCubic } from '../../utils/animation/easing.ts';
import { createSpring } from '../../utils/animation/spring.ts';

export interface LineCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number;
  angle: number;
  midpoint: { x: number; y: number };
}

export interface LineBoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  boxWidth: number;
  boxHeight: number;
  viewBox: string;
}

export interface LineMotionState {
  progress: number;
  opacity: number;
  translateX: number;
  translateY: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  effectiveX1: number;
  effectiveY1: number;
  effectiveX2: number;
  effectiveY2: number;
  effectiveStrokeWidth: number;
  strokeDasharray: string | number | undefined;
  strokeDashoffset: number | undefined;
  length: number;
  isAnimating: boolean;
  hasExited: boolean;
}

/**
 * Calculates Euclidean distance between two endpoints.
 */
export function calculateLineLength(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Computes angle in degrees from (x1, y1) to (x2, y2).
 */
export function calculateLineAngle(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
}

/**
 * Computes midpoint between two coordinates.
 */
export function calculateLineMidpoint(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): { x: number; y: number } {
  return {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2,
  };
}

/**
 * Resolves full line coordinates taking into account orientation presets and lengths.
 */
export function resolveLineCoordinates(props: AnimatedLineProps): LineCoordinates {
  const {
    x1: rawX1,
    y1: rawY1,
    x2: rawX2,
    y2: rawY2,
    orientation = 'horizontal',
    length: rawLength = 100,
  } = props;

  const x1 = rawX1 ?? 0;
  const y1 = rawY1 ?? 0;

  let x2: number;
  let y2: number;

  if (rawX2 !== undefined && rawY2 !== undefined) {
    x2 = rawX2;
    y2 = rawY2;
  } else {
    switch (orientation as LineOrientation) {
      case 'vertical':
        x2 = x1;
        y2 = y1 + rawLength;
        break;

      case 'diagonal':
        x2 = x1 + rawLength;
        y2 = y1 + rawLength;
        break;

      case 'custom':
        x2 = rawX2 ?? x1 + rawLength;
        y2 = rawY2 ?? y1;
        break;

      case 'horizontal':
      default:
        x2 = x1 + rawLength;
        y2 = y1;
        break;
    }
  }

  const length = calculateLineLength(x1, y1, x2, y2);
  const angle = calculateLineAngle(x1, y1, x2, y2);
  const midpoint = calculateLineMidpoint(x1, y1, x2, y2);

  return { x1, y1, x2, y2, length, angle, midpoint };
}

/**
 * Normalizes user animation input into a unified LineAnimationConfig.
 */
export function resolveLineAnimationConfig(
  props: AnimatedLineProps
): LineAnimationConfig {
  const {
    animation,
    animate = true,
    delay = 0,
    durationInFrames = 20,
    easing = 'easeOutCubic',
    springPreset,
    direction = 'start',
    from,
    to,
  } = props;

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
      type: animation.type ?? 'draw-in',
      delay: animation.delay ?? delay,
      duration: animation.duration ?? durationInFrames,
      easing: animation.easing ?? easing,
      springPreset: animation.springPreset ?? springPreset,
      direction: animation.direction ?? direction,
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
    direction,
    from,
    to,
  };
}

/**
 * Calculates SVG bounding box and viewBox dimensions for line rendering.
 */
export function calculateLineBoundingBox(params: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeWidth: number;
  width?: number;
  height?: number;
}): LineBoundingBox {
  const { x1, y1, x2, y2, strokeWidth, width, height } = params;

  const minX = Math.min(x1, x2);
  const minY = Math.min(y1, y2);
  const maxX = Math.max(x1, x2);
  const maxY = Math.max(y1, y2);

  const boxWidth = width ?? Math.max(strokeWidth, maxX);
  const boxHeight = height ?? Math.max(strokeWidth, maxY);

  return {
    minX,
    minY,
    maxX,
    maxY,
    boxWidth: Math.max(1, boxWidth),
    boxHeight: Math.max(1, boxHeight),
    viewBox: `0 0 ${Math.max(1, boxWidth)} ${Math.max(1, boxHeight)}`,
  };
}

export interface CalculateLineMotionParams {
  currentFrame: number;
  fps: number;
  coords: LineCoordinates;
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
  config: LineAnimationConfig;
  exitFrame?: number;
  exitDurationInFrames?: number;
  exitAnimation?: 'fade-out' | 'draw-out' | 'stroke-width';
}

/**
 * Computes deterministic frame-accurate motion state for AnimatedLine.
 */
export function calculateLineMotion(params: CalculateLineMotionParams): LineMotionState {
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

  const { x1, y1, x2, y2, length } = coords;
  const safeLength = Math.max(1, length);

  const rawType: LineAnimation = config.type ?? 'draw-in';
  const delay = Math.max(0, config.delay ?? 0);
  const duration = Math.max(1, config.duration ?? 20);

  // Normalize animation type aliases
  let animationType: LineAnimation = rawType;
  if (rawType === 'draw') animationType = 'draw-in';
  else if (rawType === 'reveal-start') animationType = 'reveal-left';
  else if (rawType === 'reveal-end') animationType = 'reveal-right';
  else if (rawType === 'expand') animationType = 'length-expansion';
  else if (rawType === 'width-expansion') animationType = 'stroke-width';

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
  let translateX = baseX;
  let translateY = baseY;
  const rotation = baseRotation;
  const scaleX = baseScale * baseScaleX;
  const scaleY = baseScale * baseScaleY;

  let effectiveX1 = x1;
  let effectiveY1 = y1;
  let effectiveX2 = x2;
  let effectiveY2 = y2;
  let effectiveStrokeWidth = strokeWidth;

  let strokeDasharray: string | number | undefined = userDasharray;
  let strokeDashoffset: number | undefined = userDashoffset;

  // Apply primary entrance animation kinematics
  switch (animationType) {
    case 'draw-in':
    case 'reveal-left': {
      // Draws from start (x1, y1) to end (x2, y2)
      strokeDasharray = safeLength;
      const drawProgress = clamp(progress, 0, 1);
      const targetOffset = (1 - drawProgress) * safeLength;
      strokeDashoffset = userDashoffset + targetOffset;
      break;
    }

    case 'draw-out': {
      // Retracts / erases from start to end
      strokeDasharray = safeLength;
      const outProgress = clamp(progress, 0, 1);
      strokeDashoffset = userDashoffset + outProgress * safeLength;
      break;
    }

    case 'reveal-right': {
      // Reveals from end (x2, y2) backwards to start (x1, y1) using negative offset
      strokeDasharray = safeLength;
      const rightProgress = clamp(progress, 0, 1);
      strokeDashoffset = userDashoffset - (1 - rightProgress) * safeLength;
      break;
    }

    case 'reveal-center': {
      // Expands symmetrically outward from midpoint toward both ends
      const centerProgress = clamp(progress, 0, 1);
      if (centerProgress <= 0) {
        strokeDasharray = `0 ${(safeLength / 2).toFixed(2)} 0 ${safeLength.toFixed(2)}`;
        strokeDashoffset = 0;
      } else if (centerProgress >= 1) {
        strokeDasharray = userDasharray;
        strokeDashoffset = userDashoffset;
      } else {
        const gap = ((1 - centerProgress) * safeLength) / 2;
        const dash = centerProgress * safeLength;
        strokeDasharray = `0 ${gap.toFixed(2)} ${dash.toFixed(2)} ${safeLength.toFixed(2)}`;
        strokeDashoffset = 0;
      }
      break;
    }

    case 'length-expansion': {
      const expProgress = clamp(progress, 0, 1);
      if (config.direction === 'center') {
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const dx = x2 - x1;
        const dy = y2 - y1;
        effectiveX1 = cx - (expProgress * dx) / 2;
        effectiveY1 = cy - (expProgress * dy) / 2;
        effectiveX2 = cx + (expProgress * dx) / 2;
        effectiveY2 = cy + (expProgress * dy) / 2;
      } else {
        effectiveX1 = x1;
        effectiveY1 = y1;
        effectiveX2 = x1 + expProgress * (x2 - x1);
        effectiveY2 = y1 + expProgress * (y2 - y1);
      }
      break;
    }

    case 'stroke-width': {
      const widthProgress = clamp(progress, 0, 1);
      const startW = config.from ?? 0;
      const targetW = config.to ?? strokeWidth;
      effectiveStrokeWidth = startW + widthProgress * (targetW - startW);
      break;
    }

    case 'fade-in': {
      opacity = clamp(progress, 0, 1) * baseOpacity;
      break;
    }

    case 'fade-out': {
      opacity = clamp(1 - progress, 0, 1) * baseOpacity;
      break;
    }

    case 'move-in': {
      const moveProgress = clamp(progress, 0, 1);
      const offsetDist = 30;
      const dir = config.direction ?? 'up';

      if (dir === 'up') translateY += (1 - moveProgress) * offsetDist;
      else if (dir === 'down') translateY -= (1 - moveProgress) * offsetDist;
      else if (dir === 'left') translateX += (1 - moveProgress) * offsetDist;
      else if (dir === 'right') translateX -= (1 - moveProgress) * offsetDist;

      opacity = moveProgress * baseOpacity;
      break;
    }

    case 'none':
    default:
      // Fully rendered static line
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
    } else if (exitAnimation === 'draw-out') {
      strokeDasharray = safeLength;
      strokeDashoffset = (strokeDashoffset ?? 0) + exitProgress * safeLength;
    } else if (exitAnimation === 'stroke-width') {
      effectiveStrokeWidth *= 1 - exitProgress;
    }
  }

  return {
    progress,
    opacity: hasExited ? 0 : clamp(opacity, 0, 1),
    translateX,
    translateY,
    rotation,
    scaleX,
    scaleY,
    effectiveX1,
    effectiveY1,
    effectiveX2,
    effectiveY2,
    effectiveStrokeWidth: Math.max(0, effectiveStrokeWidth),
    strokeDasharray,
    strokeDashoffset,
    length,
    isAnimating,
    hasExited,
  };
}
