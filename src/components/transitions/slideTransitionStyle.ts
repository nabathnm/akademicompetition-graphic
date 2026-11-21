/**
 * SlideTransition Pure Mathematical Engine & Styling Logic
 * Frame-accurate calculation of directional movement vectors,
 * spring overshoots, simultaneous opacity fades, and replace cross-slides.
 */

import { easeOut, resolveEasing } from '../../utils/animation/easing.ts';
import type { EasingFunction, EasingPresetName } from '../../utils/animation/easing.ts';
import { createSpring } from '../../utils/animation/spring.ts';
import type { SpringPresetName } from '../../styles/motion.ts';
import type {
  SlideDirection,
  SlideTransitionMetrics,
  SlideTransitionMode,
} from './types.ts';

export interface ParsedSlideDistance {
  value: number;
  unit: 'px' | '%';
}

/**
 * Parses distance into numeric magnitude and CSS unit.
 * Defaults to 100%.
 */
export function parseSlideDistance(distance?: number | string): ParsedSlideDistance {
  if (distance === undefined || distance === null) {
    return { value: 100, unit: '%' };
  }

  if (typeof distance === 'number') {
    return { value: Math.abs(distance), unit: 'px' };
  }

  const str = distance.toString().trim();
  if (str.endsWith('%')) {
    const parsed = Number.parseFloat(str);
    return { value: Number.isNaN(parsed) ? 100 : Math.abs(parsed), unit: '%' };
  }

  if (str.endsWith('px')) {
    const parsed = Number.parseFloat(str);
    return { value: Number.isNaN(parsed) ? 100 : Math.abs(parsed), unit: 'px' };
  }

  const parsed = Number.parseFloat(str);
  return { value: Number.isNaN(parsed) ? 100 : Math.abs(parsed), unit: 'px' };
}

/**
 * Resolves movement vector (vx, vy) where:
 * - vx represents movement direction along X (-1 = leftward, +1 = rightward)
 * - vy represents movement direction along Y (-1 = upward, +1 = downward)
 */
export function resolveDirectionVector(direction: SlideDirection = 'left'): {
  vx: number;
  vy: number;
} {
  switch (direction) {
    case 'left':
      return { vx: -1, vy: 0 };
    case 'right':
    case 'horizontal':
      return { vx: 1, vy: 0 };
    case 'top':
    case 'up':
      return { vx: 0, vy: -1 };
    case 'bottom':
    case 'down':
    case 'vertical':
      return { vx: 0, vy: 1 };
    case 'top-left':
    case 'topLeft':
      return { vx: -1, vy: -1 };
    case 'top-right':
    case 'topRight':
      return { vx: 1, vy: -1 };
    case 'bottom-left':
    case 'bottomLeft':
      return { vx: -1, vy: 1 };
    case 'bottom-right':
    case 'bottomRight':
      return { vx: 1, vy: 1 };
    default:
      return { vx: -1, vy: 0 };
  }
}

/**
 * Sanitizes numeric value to prevent IEEE-754 signed negative zero (-0).
 */
export function sanitizeNumber(val: number): number {
  if (Number.isNaN(val) || Math.abs(val) < 1e-6) {
    return 0;
  }
  return Number(val.toFixed(4));
}

export interface CalculateSlideMetricsParams {
  currentFrame: number;
  fps?: number;
  direction?: SlideDirection;
  mode?: SlideTransitionMode;
  distance?: number | string;
  duration?: number;
  durationInFrames?: number;
  delay?: number;
  easing?: EasingPresetName | EasingFunction;
  fade?: boolean;
  spring?: boolean | string;
  springPreset?: string;
  overshoot?: boolean;
  reverse?: boolean;
  inDuration?: number;
  holdDuration?: number;
  outDuration?: number;
  startPosition?: { x?: number | string; y?: number | string };
  endPosition?: { x?: number | string; y?: number | string };
}

/**
 * Normalizes input mode into standard transition mode.
 */
export function normalizeSlideMode(
  mode?: SlideTransitionMode
): 'enter' | 'exit' | 'enter-exit' | 'replace' {
  if (!mode || mode === 'enter' || mode === 'in') {
    return 'enter';
  }
  if (mode === 'exit' || mode === 'out') {
    return 'exit';
  }
  if (mode === 'enter-exit' || mode === 'in-out') {
    return 'enter-exit';
  }
  if (mode === 'replace' || mode === 'cross-slide') {
    return 'replace';
  }
  return 'enter';
}

/**
 * Calculates frame-based position coordinates and opacity for slide transitions.
 */
export function calculateSlideMetrics(
  params: CalculateSlideMetricsParams
): SlideTransitionMetrics {
  const currentFrame = params.currentFrame;
  const fps = params.fps ?? 30;
  const mode = normalizeSlideMode(params.mode);
  const { vx, vy } = resolveDirectionVector(params.direction);
  const { value: distVal, unit } = parseSlideDistance(params.distance);
  const duration = Math.max(1, params.duration ?? params.durationInFrames ?? 25);
  const delay = Math.max(0, params.delay ?? 0);
  const isReverse = Boolean(params.reverse);
  const useFade = Boolean(params.fade);

  const easingFn =
    (params.easing ? resolveEasing(params.easing) : undefined) ?? easeOut;

  // Spring determination
  const useSpring = Boolean(params.spring || params.overshoot || params.springPreset);
  const springPresetName: SpringPresetName =
    typeof params.spring === 'string'
      ? (params.spring as SpringPresetName)
      : typeof params.springPreset === 'string'
        ? (params.springPreset as SpringPresetName)
        : params.overshoot
          ? 'bouncy'
          : 'snappy';

  // Helper to compute progress for a single phase window [fStart, fEnd]
  const computePhaseProgress = (fStart: number, fDuration: number): number => {
    if (currentFrame < fStart) {
      return 0;
    }
    if (useSpring) {
      const springVal = createSpring({
        frame: currentFrame,
        fps,
        delay: fStart,
        preset: springPresetName,
        from: 0,
        to: 1,
      });
      return springVal;
    }
    const linearT = Math.min(1, Math.max(0, (currentFrame - fStart) / fDuration));
    return easingFn(linearT);
  };

  // -------------------------------------------------------------------------
  // Mode 1: Enter (slides in toward 0, 0)
  // -------------------------------------------------------------------------
  if (mode === 'enter') {
    const startFrame = delay;
    const endFrame = delay + duration;

    let p = computePhaseProgress(startFrame, duration);
    if (isReverse) {
      p = 1 - p;
    }

    const isComplete = !useSpring ? currentFrame >= endFrame : currentFrame >= endFrame + 10;
    const phase = currentFrame < startFrame ? 'pending' : isComplete ? 'complete' : 'enter';

    // Offset starts at (-vx * dist, -vy * dist) and moves to 0
    const rawX = sanitizeNumber(-vx * distVal * (1 - p));
    const rawY = sanitizeNumber(-vy * distVal * (1 - p));

    const opacity = useFade
      ? Math.min(1, Math.max(0, sanitizeNumber(p)))
      : 1;

    return {
      translateX: `${rawX}${unit}`,
      translateY: `${rawY}${unit}`,
      rawX,
      rawY,
      opacity,
      outgoingTranslateX: '0px',
      outgoingTranslateY: '0px',
      outgoingOpacity: 0,
      incomingTranslateX: `${rawX}${unit}`,
      incomingTranslateY: `${rawY}${unit}`,
      incomingOpacity: opacity,
      progress: Math.min(1, Math.max(0, sanitizeNumber(p))),
      isComplete,
      phase,
    };
  }

  // -------------------------------------------------------------------------
  // Mode 2: Exit (slides away from 0, 0 toward direction vector)
  // -------------------------------------------------------------------------
  if (mode === 'exit') {
    const startFrame = delay;
    const endFrame = delay + duration;

    let p = computePhaseProgress(startFrame, duration);
    if (isReverse) {
      p = 1 - p;
    }

    const isComplete = !useSpring ? currentFrame >= endFrame : currentFrame >= endFrame + 10;
    const phase = currentFrame < startFrame ? 'pending' : isComplete ? 'complete' : 'exit';

    // Offset starts at 0 and moves toward (vx * dist, vy * dist)
    const rawX = sanitizeNumber(vx * distVal * p);
    const rawY = sanitizeNumber(vy * distVal * p);

    const opacity = useFade
      ? Math.min(1, Math.max(0, sanitizeNumber(1 - p)))
      : 1;

    return {
      translateX: `${rawX}${unit}`,
      translateY: `${rawY}${unit}`,
      rawX,
      rawY,
      opacity,
      outgoingTranslateX: `${rawX}${unit}`,
      outgoingTranslateY: `${rawY}${unit}`,
      outgoingOpacity: opacity,
      incomingTranslateX: '0px',
      incomingTranslateY: '0px',
      incomingOpacity: 0,
      progress: Math.min(1, Math.max(0, sanitizeNumber(p))),
      isComplete,
      phase,
    };
  }

  // -------------------------------------------------------------------------
  // Mode 3: Enter-Exit Envelope (Enter -> Hold -> Exit)
  // -------------------------------------------------------------------------
  if (mode === 'enter-exit') {
    const inD = params.inDuration ?? Math.max(1, Math.round(duration * 0.35));
    const holdD = params.holdDuration ?? Math.max(0, Math.round(duration * 0.3));
    const outD = params.outDuration ?? Math.max(1, duration - inD - holdD);

    const startFrame = delay;
    const holdStartFrame = delay + inD;
    const outStartFrame = holdStartFrame + holdD;
    const endFrame = outStartFrame + outD;

    if (currentFrame < startFrame) {
      const initialOffset = isReverse ? 0 : 1;
      const rawX = sanitizeNumber(-vx * distVal * initialOffset);
      const rawY = sanitizeNumber(-vy * distVal * initialOffset);
      return {
        translateX: `${rawX}${unit}`,
        translateY: `${rawY}${unit}`,
        rawX,
        rawY,
        opacity: useFade ? 0 : 1,
        outgoingTranslateX: '0px',
        outgoingTranslateY: '0px',
        outgoingOpacity: 0,
        incomingTranslateX: `${rawX}${unit}`,
        incomingTranslateY: `${rawY}${unit}`,
        incomingOpacity: useFade ? 0 : 1,
        progress: 0,
        isComplete: false,
        phase: 'pending',
      };
    }

    if (currentFrame >= endFrame) {
      const finalOffset = isReverse ? 0 : 1;
      const rawX = sanitizeNumber(vx * distVal * finalOffset);
      const rawY = sanitizeNumber(vy * distVal * finalOffset);
      return {
        translateX: `${rawX}${unit}`,
        translateY: `${rawY}${unit}`,
        rawX,
        rawY,
        opacity: useFade ? 0 : 1,
        outgoingTranslateX: `${rawX}${unit}`,
        outgoingTranslateY: `${rawY}${unit}`,
        outgoingOpacity: useFade ? 0 : 1,
        incomingTranslateX: '0px',
        incomingTranslateY: '0px',
        incomingOpacity: 0,
        progress: 1,
        isComplete: true,
        phase: 'complete',
      };
    }

    const totalEnvelope = inD + holdD + outD;
    const totalProgress = Math.min(1, Math.max(0, (currentFrame - startFrame) / totalEnvelope));

    // Phase A: Ingress Enter
    if (currentFrame < holdStartFrame) {
      let p = computePhaseProgress(startFrame, inD);
      if (isReverse) {
        p = 1 - p;
      }
      const rawX = sanitizeNumber(-vx * distVal * (1 - p));
      const rawY = sanitizeNumber(-vy * distVal * (1 - p));
      const opacity = useFade ? Math.min(1, Math.max(0, sanitizeNumber(p))) : 1;

      return {
        translateX: `${rawX}${unit}`,
        translateY: `${rawY}${unit}`,
        rawX,
        rawY,
        opacity,
        outgoingTranslateX: '0px',
        outgoingTranslateY: '0px',
        outgoingOpacity: 0,
        incomingTranslateX: `${rawX}${unit}`,
        incomingTranslateY: `${rawY}${unit}`,
        incomingOpacity: opacity,
        progress: sanitizeNumber(totalProgress),
        isComplete: false,
        phase: 'enter',
      };
    }

    // Phase B: Plateau Hold
    if (currentFrame < outStartFrame) {
      return {
        translateX: `0${unit}`,
        translateY: `0${unit}`,
        rawX: 0,
        rawY: 0,
        opacity: 1,
        outgoingTranslateX: '0px',
        outgoingTranslateY: '0px',
        outgoingOpacity: 0,
        incomingTranslateX: '0px',
        incomingTranslateY: '0px',
        incomingOpacity: 1,
        progress: sanitizeNumber(totalProgress),
        isComplete: false,
        phase: 'hold',
      };
    }

    // Phase C: Egress Exit
    let p = computePhaseProgress(outStartFrame, outD);
    if (isReverse) {
      p = 1 - p;
    }
    const rawX = sanitizeNumber(vx * distVal * p);
    const rawY = sanitizeNumber(vy * distVal * p);
    const opacity = useFade ? Math.min(1, Math.max(0, sanitizeNumber(1 - p))) : 1;

    return {
      translateX: `${rawX}${unit}`,
      translateY: `${rawY}${unit}`,
      rawX,
      rawY,
      opacity,
      outgoingTranslateX: `${rawX}${unit}`,
      outgoingTranslateY: `${rawY}${unit}`,
      outgoingOpacity: opacity,
      incomingTranslateX: '0px',
      incomingTranslateY: '0px',
      incomingOpacity: 0,
      progress: sanitizeNumber(totalProgress),
      isComplete: false,
      phase: 'exit',
    };
  }

  // -------------------------------------------------------------------------
  // Mode 4: Replace (Dual-Layer Push / Cross-Slide)
  // -------------------------------------------------------------------------
  const startFrame = delay;
  const endFrame = delay + duration;

  let p = computePhaseProgress(startFrame, duration);
  if (isReverse) {
    p = 1 - p;
  }

  const isComplete = !useSpring ? currentFrame >= endFrame : currentFrame >= endFrame + 10;
  const phase = currentFrame < startFrame ? 'pending' : isComplete ? 'complete' : 'enter';

  // Outgoing moves from 0 to (vx * dist, vy * dist)
  const outX = sanitizeNumber(vx * distVal * p);
  const outY = sanitizeNumber(vy * distVal * p);

  // Incoming moves from (-vx * dist, -vy * dist) to 0
  const inX = sanitizeNumber(-vx * distVal * (1 - p));
  const inY = sanitizeNumber(-vy * distVal * (1 - p));

  const outOpacity = useFade ? Math.min(1, Math.max(0, sanitizeNumber(1 - p))) : 1;
  const inOpacity = useFade ? Math.min(1, Math.max(0, sanitizeNumber(p))) : 1;

  return {
    translateX: `${inX}${unit}`,
    translateY: `${inY}${unit}`,
    rawX: inX,
    rawY: inY,
    opacity: inOpacity,
    outgoingTranslateX: `${outX}${unit}`,
    outgoingTranslateY: `${outY}${unit}`,
    outgoingOpacity: outOpacity,
    incomingTranslateX: `${inX}${unit}`,
    incomingTranslateY: `${inY}${unit}`,
    incomingOpacity: inOpacity,
    progress: Math.min(1, Math.max(0, sanitizeNumber(p))),
    isComplete,
    phase,
  };
}
