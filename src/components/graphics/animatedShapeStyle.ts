/**
 * AnimatedShape Style & Motion Calculations
 * Pure mathematical functions determining geometric shape points, Ramanujan ellipse perimeters,
 * SVG stroke-dash calculations, spring & easing transformations, and SVG rendering attributes.
 * Layer 2 of the Motion Graphics Framework.
 */

import type {
  ShapeType,
  ShapeAnimation,
  ShapeAnimationConfig,
  AnimatedShapeProps,
} from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { resolveEasing, easeOutCubic, easeInOutCubic } from '../../utils/animation/easing.ts';
import { createSpring } from '../../utils/animation/spring.ts';

/**
 * Normalizes user animation input into a unified ShapeAnimationConfig.
 */
export function resolveShapeAnimationConfig(
  props: AnimatedShapeProps
): ShapeAnimationConfig {
  const {
    animation,
    animate = true,
    delay: propDelay = 0,
    startFrame,
    durationInFrames = 20,
    easing = 'easeOutCubic',
    springPreset = 'snappy',
    direction = 'up',
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
      type: animation.type ?? 'fade-in',
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
    type: 'fade-in',
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
 * Computes SVG polygon points for regular N-gon shapes.
 */
export function calculatePolygonPoints(
  width: number,
  height: number,
  sides = 6,
  strokeWidth = 2
): string {
  const n = Math.max(3, sides);
  const cx = width / 2;
  const cy = height / 2;
  const rx = Math.max(1, (width - strokeWidth) / 2);
  const ry = Math.max(1, (height - strokeWidth) / 2);

  const coords: string[] = [];
  for (let i = 0; i < n; i++) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
    const x = cx + rx * Math.cos(angle);
    const y = cy + ry * Math.sin(angle);
    coords.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return coords.join(' ');
}

/**
 * Computes SVG star vertices alternating outer tips and inner valleys.
 */
export function calculateStarPoints(
  width: number,
  height: number,
  points = 5,
  innerRatio = 0.45,
  strokeWidth = 2
): string {
  const n = Math.max(3, points);
  const cx = width / 2;
  const cy = height / 2;
  const outerRx = Math.max(1, (width - strokeWidth) / 2);
  const outerRy = Math.max(1, (height - strokeWidth) / 2);
  const innerRx = outerRx * clamp(innerRatio, 0.1, 0.9);
  const innerRy = outerRy * clamp(innerRatio, 0.1, 0.9);

  const coords: string[] = [];
  const totalVertices = n * 2;

  for (let i = 0; i < totalVertices; i++) {
    const isOuter = i % 2 === 0;
    const rx = isOuter ? outerRx : innerRx;
    const ry = isOuter ? outerRy : innerRy;
    const angle = -Math.PI / 2 + (Math.PI * i) / n;
    const x = cx + rx * Math.cos(angle);
    const y = cy + ry * Math.sin(angle);
    coords.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return coords.join(' ');
}

/**
 * Calculates geometric perimeter length for draw-like reveals and dashed strokes.
 */
export function calculateShapePerimeter(
  shape: ShapeType,
  width: number,
  height: number,
  sides = 6,
  borderRadius = 12
): number {
  const w = Math.max(1, width);
  const h = Math.max(1, height);

  switch (shape) {
    case 'rectangle':
      return 2 * (w + h);

    case 'rounded-rectangle': {
      const maxR = Math.min(w / 2, h / 2);
      const r = clamp(borderRadius, 0, maxR);
      return 2 * (w + h) - 8 * r + 2 * Math.PI * r;
    }

    case 'circle':
    case 'ellipse': {
      const a = w / 2;
      const b = h / 2;
      if (Math.abs(a - b) < 0.001) {
        return 2 * Math.PI * a;
      }
      // Ramanujan's formula for ellipse circumference
      const hTerm = Math.pow(a - b, 2) / Math.pow(a + b, 2);
      return Math.PI * (a + b) * (1 + (3 * hTerm) / (10 + Math.sqrt(4 - 3 * hTerm)));
    }

    case 'triangle': {
      const n = 3;
      const r = Math.min(w, h) / 2;
      return n * 2 * r * Math.sin(Math.PI / n);
    }

    case 'polygon': {
      const n = Math.max(3, sides);
      const r = Math.min(w, h) / 2;
      return n * 2 * r * Math.sin(Math.PI / n);
    }

    case 'star': {
      const n = 5;
      const outerR = Math.min(w, h) / 2;
      const innerR = outerR * 0.45;
      const angle = Math.PI / n;
      const sideLength = Math.sqrt(
        Math.pow(outerR, 2) + Math.pow(innerR, 2) - 2 * outerR * innerR * Math.cos(angle)
      );
      return 2 * n * sideLength;
    }

    default:
      return 2 * (w + h);
  }
}

export interface ShapeMotionResult {
  opacity: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  translateX: number;
  translateY: number;
  drawProgress: number;
  strokeDashoffset: number;
  perimeter: number;
  isAnimating: boolean;
}

export interface ShapeMotionOptions {
  currentFrame: number;
  fps?: number;
  shape: ShapeType;
  width: number;
  height: number;
  sides?: number;
  borderRadius?: number;
  baseOpacity?: number;
  baseRotation?: number;
  baseX?: number;
  baseY?: number;
  baseScale?: number;
  baseScaleX?: number;
  baseScaleY?: number;
  config: ShapeAnimationConfig;
  exitFrame?: number;
  exitDurationInFrames?: number;
  exitAnimation?: ShapeAnimation;
}

/**
 * Evaluates frame-based geometric transformations, rotations, translations, and draw progresses.
 */
export function calculateShapeMotion({
  currentFrame,
  fps = 30,
  shape,
  width,
  height,
  sides = 6,
  borderRadius = 12,
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
}: ShapeMotionOptions): ShapeMotionResult {
  const perimeter = calculateShapePerimeter(shape, width, height, sides, borderRadius);

  const {
    type = 'fade-in',
    delay = 0,
    duration = 20,
    easing = 'easeOutCubic',
    springPreset = 'snappy',
    direction = 'up',
    from,
    to,
    loop = false,
  } = config;

  // Static shape
  if (type === 'none') {
    return {
      opacity: baseOpacity,
      scaleX: baseScale * baseScaleX,
      scaleY: baseScale * baseScaleY,
      rotation: baseRotation,
      translateX: baseX,
      translateY: baseY,
      drawProgress: 1,
      strokeDashoffset: 0,
      perimeter,
      isAnimating: false,
    };
  }

  // Pre-animation state
  if (currentFrame < delay) {
    if (type === 'fade-in' || type === 'scale-in' || type === 'pop' || type === 'bounce') {
      return {
        opacity: 0,
        scaleX: 0,
        scaleY: 0,
        rotation: baseRotation,
        translateX: baseX,
        translateY: baseY,
        drawProgress: 0,
        strokeDashoffset: perimeter,
        perimeter,
        isAnimating: false,
      };
    }
    if (type === 'draw') {
      return {
        opacity: baseOpacity,
        scaleX: baseScale * baseScaleX,
        scaleY: baseScale * baseScaleY,
        rotation: baseRotation,
        translateX: baseX,
        translateY: baseY,
        drawProgress: 0,
        strokeDashoffset: perimeter,
        perimeter,
        isAnimating: false,
      };
    }
  }

  const elapsed = currentFrame - delay;
  const dur = Math.max(1, duration);
  const normLinear = loop ? ((elapsed % dur) / dur) : clamp(elapsed / dur, 0, 1);
  const isAnimating = loop || (elapsed >= 0 && elapsed <= dur * 1.5);

  let currentOpacity = baseOpacity;
  let currentScale = baseScale;
  let animRotation = 0;
  let animMoveX = 0;
  let animMoveY = 0;
  let drawProgress = 1;

  switch (type) {
    case 'fade-in': {
      const easingFn = resolveEasing(easing) ?? easeOutCubic;
      const p = easingFn(normLinear);
      const fromVal = from ?? 0;
      const toVal = to ?? 1;
      currentOpacity = baseOpacity * (fromVal + (toVal - fromVal) * p);
      break;
    }
    case 'fade-out': {
      const easingFn = resolveEasing(easing) ?? easeOutCubic;
      const p = easingFn(normLinear);
      const fromVal = from ?? 1;
      const toVal = to ?? 0;
      currentOpacity = baseOpacity * (fromVal + (toVal - fromVal) * p);
      break;
    }
    case 'scale-in': {
      const easingFn = resolveEasing(easing) ?? easeOutCubic;
      const p = easingFn(normLinear);
      const fromVal = from ?? 0;
      const toVal = to ?? 1;
      currentScale = baseScale * (fromVal + (toVal - fromVal) * p);
      currentOpacity = baseOpacity * clamp(p * 2, 0, 1);
      break;
    }
    case 'scale-out': {
      const easingFn = resolveEasing(easing) ?? easeOutCubic;
      const p = easingFn(normLinear);
      const fromVal = from ?? 1;
      const toVal = to ?? 0;
      currentScale = baseScale * (fromVal + (toVal - fromVal) * p);
      currentOpacity = baseOpacity * (1 - p);
      break;
    }
    case 'rotate': {
      const totalAngle = to ?? 360;
      const startAngle = from ?? 0;
      const isCCW = direction === 'counter-clockwise';
      const dirSign = isCCW ? -1 : 1;

      if (loop) {
        animRotation = dirSign * ((elapsed / dur) * totalAngle);
      } else {
        const easingFn = resolveEasing(easing) ?? easeInOutCubic;
        const p = easingFn(normLinear);
        animRotation = dirSign * (startAngle + (totalAngle - startAngle) * p);
      }
      break;
    }
    case 'move': {
      const easingFn = resolveEasing(easing) ?? easeOutCubic;
      const p = easingFn(normLinear);
      const distance = to ?? 60;
      const startDist = from ?? distance;
      const remainingDist = startDist * (1 - p);

      if (direction === 'up') {
        animMoveY = remainingDist;
      } else if (direction === 'down') {
        animMoveY = -remainingDist;
      } else if (direction === 'left') {
        animMoveX = remainingDist;
      } else if (direction === 'right') {
        animMoveX = -remainingDist;
      }
      currentOpacity = baseOpacity * clamp(p * 1.5, 0, 1);
      break;
    }
    case 'pop': {
      const springVal = createSpring({
        frame: currentFrame,
        fps,
        delay,
        preset: springPreset ?? 'bouncy',
        from: from ?? 0,
        to: to ?? 1,
      });
      currentScale = baseScale * springVal;
      currentOpacity = baseOpacity * clamp(springVal * 1.5, 0, 1);
      break;
    }
    case 'bounce': {
      const springVal = createSpring({
        frame: currentFrame,
        fps,
        delay,
        preset: springPreset ?? 'snappy',
        from: from ?? 0,
        to: to ?? 1,
      });
      currentScale = baseScale * springVal;
      currentOpacity = baseOpacity * clamp(springVal, 0, 1);
      break;
    }
    case 'draw': {
      const easingFn = resolveEasing(easing) ?? easeOutCubic;
      drawProgress = easingFn(normLinear);
      break;
    }
    case 'combined': {
      const springVal = createSpring({
        frame: currentFrame,
        fps,
        delay,
        preset: springPreset ?? 'snappy',
        from: 0,
        to: 1,
      });
      currentScale = baseScale * springVal;
      currentOpacity = baseOpacity * clamp(springVal, 0, 1);
      drawProgress = clamp(normLinear * 1.2, 0, 1);
      break;
    }
    default:
      break;
  }

  // Handle optional exit transition
  if (exitFrame !== undefined && currentFrame >= exitFrame) {
    const exitElapsed = currentFrame - exitFrame;
    const exitDur = Math.max(1, exitDurationInFrames);
    const exitProgress = clamp(exitElapsed / exitDur, 0, 1);

    if (exitAnimation === 'fade-out') {
      currentOpacity *= (1 - exitProgress);
    } else if (exitAnimation === 'scale-out') {
      currentScale *= (1 - exitProgress);
      currentOpacity *= (1 - exitProgress);
    }
  }

  const strokeDashoffset = (1 - drawProgress) * perimeter;

  return {
    opacity: clamp(currentOpacity, 0, 1),
    scaleX: currentScale * baseScaleX,
    scaleY: currentScale * baseScaleY,
    rotation: baseRotation + animRotation,
    translateX: baseX + animMoveX,
    translateY: baseY + animMoveY,
    drawProgress,
    strokeDashoffset,
    perimeter,
    isAnimating,
  };
}
