/**
 * WipeTransition Pure Mathematical Engine & Styling Logic
 * Frame-accurate calculation of directional clipping boundaries,
 * center expansions, diagonal polygon cuts, radial circle masks,
 * and dual-layer wipe replacements.
 */

import { easeInOut, resolveEasing } from '../../utils/animation/easing.ts';
import type { EasingFunction, EasingPresetName } from '../../utils/animation/easing.ts';
import type {
  WipeDirection,
  WipeTransitionMetrics,
  WipeTransitionMode,
} from './types.ts';

/**
 * Sanitizes numeric values to prevent IEEE-754 signed negative zero (-0)
 * and floating point inaccuracy.
 */
export function sanitizeWipeNumber(val: number): number {
  if (Number.isNaN(val) || Math.abs(val) < 1e-6) {
    return 0;
  }
  return Number(val.toFixed(4));
}

/**
 * Normalizes input mode into standard wipe mode.
 */
export function normalizeWipeMode(
  mode?: WipeTransitionMode
): 'reveal' | 'hide' | 'reveal-hide' | 'replace' {
  if (!mode || mode === 'reveal' || mode === 'in') {
    return 'reveal';
  }
  if (mode === 'hide' || mode === 'out') {
    return 'hide';
  }
  if (mode === 'reveal-hide' || mode === 'in-out') {
    return 'reveal-hide';
  }
  if (mode === 'replace' || mode === 'cross-wipe') {
    return 'replace';
  }
  return 'reveal';
}

/**
 * Normalizes input direction into standard wipe direction.
 */
export function normalizeWipeDirection(
  dir?: WipeDirection
):
  | 'left-to-right'
  | 'right-to-left'
  | 'top-to-bottom'
  | 'bottom-to-top'
  | 'center-out'
  | 'center-in'
  | 'diagonal'
  | 'radial' {
  if (!dir || dir === 'left-to-right' || dir === 'leftToRight') {
    return 'left-to-right';
  }
  if (dir === 'right-to-left' || dir === 'rightToLeft') {
    return 'right-to-left';
  }
  if (dir === 'top-to-bottom' || dir === 'topToBottom') {
    return 'top-to-bottom';
  }
  if (dir === 'bottom-to-top' || dir === 'bottomToTop') {
    return 'bottom-to-top';
  }
  if (dir === 'center-out' || dir === 'centerOut') {
    return 'center-out';
  }
  if (dir === 'center-in' || dir === 'centerIn') {
    return 'center-in';
  }
  if (
    dir === 'diagonal' ||
    dir === 'diagonal-top-left' ||
    dir === 'diagonal-top-right'
  ) {
    return 'diagonal';
  }
  if (dir === 'radial' || dir === 'circle') {
    return 'radial';
  }
  return 'left-to-right';
}

/**
 * Resolves origin coordinates for radial and center wipes.
 */
export function resolveWipeOrigin(origin?: string): { x: string; y: string } {
  if (!origin || origin.trim() === '') {
    return { x: '50%', y: '50%' };
  }
  const clean = origin.trim().toLowerCase();
  switch (clean) {
    case 'center':
      return { x: '50%', y: '50%' };
    case 'top':
      return { x: '50%', y: '0%' };
    case 'bottom':
      return { x: '50%', y: '100%' };
    case 'left':
      return { x: '0%', y: '50%' };
    case 'right':
      return { x: '100%', y: '50%' };
    case 'top left':
    case 'topleft':
      return { x: '0%', y: '0%' };
    case 'top right':
    case 'topright':
      return { x: '100%', y: '0%' };
    case 'bottom left':
    case 'bottomleft':
      return { x: '0%', y: '100%' };
    case 'bottom right':
    case 'bottomright':
      return { x: '100%', y: '100%' };
    default: {
      const parts = origin.split(/\s+/);
      if (parts.length === 2) {
        return { x: parts[0], y: parts[1] };
      }
      return { x: '50%', y: '50%' };
    }
  }
}

/**
 * Calculates CSS clipPath string and edge position for a given normalized progress p in [0, 1].
 */
export function calculateClipPathForProgress(
  direction: ReturnType<typeof normalizeWipeDirection>,
  p: number,
  isHide: boolean = false,
  originStr?: string,
  edgeWidth: number = 2
): {
  clipPath: string;
  edgePosition?: WipeTransitionMetrics['edgePosition'];
} {
  const clampedP = Math.max(0, Math.min(1, p));
  const effectiveP = isHide ? 1.0 - clampedP : clampedP;
  const pct = sanitizeWipeNumber(effectiveP * 100);
  const invPct = sanitizeWipeNumber(100 - pct);

  let clipPath = 'inset(0% 0% 0% 0%)';
  let edgePosition: WipeTransitionMetrics['edgePosition'] = undefined;

  switch (direction) {
    case 'left-to-right': {
      clipPath = `inset(0% ${invPct}% 0% 0%)`;
      if (clampedP > 0 && clampedP < 1) {
        edgePosition = {
          x: `${pct}%`,
          y: '0%',
          width: `${edgeWidth}px`,
          height: '100%',
          visible: true,
        };
      }
      break;
    }

    case 'right-to-left': {
      clipPath = `inset(0% 0% 0% ${invPct}%)`;
      if (clampedP > 0 && clampedP < 1) {
        edgePosition = {
          x: `${invPct}%`,
          y: '0%',
          width: `${edgeWidth}px`,
          height: '100%',
          visible: true,
        };
      }
      break;
    }

    case 'top-to-bottom': {
      clipPath = `inset(0% 0% ${invPct}% 0%)`;
      if (clampedP > 0 && clampedP < 1) {
        edgePosition = {
          x: '0%',
          y: `${pct}%`,
          width: '100%',
          height: `${edgeWidth}px`,
          visible: true,
        };
      }
      break;
    }

    case 'bottom-to-top': {
      clipPath = `inset(${invPct}% 0% 0% 0%)`;
      if (clampedP > 0 && clampedP < 1) {
        edgePosition = {
          x: '0%',
          y: `${invPct}%`,
          width: '100%',
          height: `${edgeWidth}px`,
          visible: true,
        };
      }
      break;
    }

    case 'center-out': {
      const vInset = sanitizeWipeNumber((1.0 - effectiveP) * 50);
      const hInset = sanitizeWipeNumber((1.0 - effectiveP) * 50);
      clipPath = `inset(${vInset}% ${hInset}% ${vInset}% ${hInset}%)`;
      break;
    }

    case 'center-in': {
      const vInset = sanitizeWipeNumber(effectiveP * 50);
      const hInset = sanitizeWipeNumber(effectiveP * 50);
      clipPath = `inset(${vInset}% ${hInset}% ${vInset}% ${hInset}%)`;
      break;
    }

    case 'diagonal': {
      // Sweeping 45-degree diagonal line across canvas from top-left to bottom-right
      const S = effectiveP * 200; // in [0, 200]
      if (S <= 0.001) {
        clipPath = 'polygon(0% 0%, 0% 0%, 0% 0%)';
      } else if (S <= 100) {
        const x1 = sanitizeWipeNumber(S);
        const y1 = sanitizeWipeNumber(S);
        clipPath = `polygon(0% 0%, ${x1}% 0%, 0% ${y1}%)`;
      } else if (S < 200) {
        const y2 = sanitizeWipeNumber(S - 100);
        const x2 = sanitizeWipeNumber(S - 100);
        clipPath = `polygon(0% 0%, 100% 0%, 100% ${y2}%, ${x2}% 100%, 0% 100%)`;
      } else {
        clipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
      }
      break;
    }

    case 'radial': {
      const origin = resolveWipeOrigin(originStr);
      // Radius reaches 142% at full progress to guarantee covering rectangular corners
      const radius = sanitizeWipeNumber(effectiveP * 142);
      clipPath = `circle(${radius}% at ${origin.x} ${origin.y})`;
      break;
    }
  }

  return { clipPath, edgePosition };
}

export interface CalculateWipeMetricsParams {
  currentFrame: number;
  direction?: WipeDirection;
  mode?: WipeTransitionMode;
  duration?: number;
  durationInFrames?: number;
  delay?: number;
  easing?: EasingPresetName | EasingFunction;
  revealOrigin?: string;
  fade?: boolean;
  fromOpacity?: number;
  toOpacity?: number;
  reverse?: boolean;
  edgeWidth?: number;
  inDuration?: number;
  holdDuration?: number;
  outDuration?: number;
}

/**
 * Pure calculator for WipeTransition styling, clipping boundaries, and progress metrics.
 */
export function calculateWipeMetrics(
  params: CalculateWipeMetricsParams
): WipeTransitionMetrics {
  const {
    currentFrame,
    direction = 'left-to-right',
    mode = 'reveal',
    duration,
    durationInFrames,
    delay = 0,
    easing = 'easeInOut',
    revealOrigin = 'center',
    fade = false,
    fromOpacity,
    toOpacity,
    reverse = false,
    edgeWidth = 2,
    inDuration,
    holdDuration,
    outDuration,
  } = params;

  const normalizedMode = normalizeWipeMode(mode);
  const normalizedDir = normalizeWipeDirection(direction);
  const totalDuration = Math.max(1, duration ?? durationInFrames ?? 25);
  const startFrame = delay;
  const endFrame = startFrame + totalDuration;

  // Resolved easing function
  const easeFn = (easing ? resolveEasing(easing) : undefined) ?? easeInOut;

  // -------------------------------------------------------------------------
  // 1. Mode: 'reveal' (Reveal In)
  // -------------------------------------------------------------------------
  if (normalizedMode === 'reveal') {
    let progress = 0;
    let opacity = fade ? (fromOpacity ?? 0) : 1.0;
    let phase: WipeTransitionMetrics['phase'] = 'in';

    if (currentFrame < startFrame) {
      phase = 'pending';
      progress = 0;
      opacity = fade ? (fromOpacity ?? 0) : 1.0;
    } else if (currentFrame >= endFrame) {
      phase = 'complete';
      progress = 1.0;
      opacity = toOpacity ?? 1.0;
    } else {
      phase = 'in';
      const linearU = (currentFrame - startFrame) / totalDuration;
      const u = reverse ? 1.0 - linearU : linearU;
      progress = easeFn(u);
      opacity = fade
        ? (fromOpacity ?? 0) + ((toOpacity ?? 1.0) - (fromOpacity ?? 0)) * (reverse ? 1.0 - linearU : linearU)
        : 1.0;
    }

    const { clipPath, edgePosition } = calculateClipPathForProgress(
      normalizedDir,
      progress,
      false,
      revealOrigin,
      edgeWidth
    );

    opacity = Math.max(0, Math.min(1, sanitizeWipeNumber(opacity)));

    return {
      clipPath,
      opacity,
      progress: sanitizeWipeNumber(progress),
      isComplete: phase === 'complete',
      phase,
      edgePosition,
      outgoingClipPath: 'inset(0% 0% 0% 0%)',
      outgoingOpacity: 1,
      incomingClipPath: clipPath,
      incomingOpacity: opacity,
    };
  }

  // -------------------------------------------------------------------------
  // 2. Mode: 'hide' (Hide Out)
  // -------------------------------------------------------------------------
  if (normalizedMode === 'hide') {
    let progress = 0;
    let opacity = 1.0;
    let phase: WipeTransitionMetrics['phase'] = 'out';

    if (currentFrame < startFrame) {
      phase = 'pending';
      progress = 0;
      opacity = fromOpacity ?? 1.0;
    } else if (currentFrame >= endFrame) {
      phase = 'complete';
      progress = 1.0;
      opacity = fade ? (toOpacity ?? 0) : 1.0;
    } else {
      phase = 'out';
      const linearU = (currentFrame - startFrame) / totalDuration;
      const u = reverse ? 1.0 - linearU : linearU;
      progress = easeFn(u);
      opacity = fade
        ? (fromOpacity ?? 1.0) + ((toOpacity ?? 0) - (fromOpacity ?? 1.0)) * (reverse ? 1.0 - linearU : linearU)
        : 1.0;
    }

    const { clipPath, edgePosition } = calculateClipPathForProgress(
      normalizedDir,
      progress,
      true, // isHide: true
      revealOrigin,
      edgeWidth
    );

    opacity = Math.max(0, Math.min(1, sanitizeWipeNumber(opacity)));

    return {
      clipPath,
      opacity,
      progress: sanitizeWipeNumber(progress),
      isComplete: phase === 'complete',
      phase,
      edgePosition,
      outgoingClipPath: clipPath,
      outgoingOpacity: opacity,
      incomingClipPath: 'inset(0% 0% 0% 0%)',
      incomingOpacity: 1,
    };
  }

  // -------------------------------------------------------------------------
  // 3. Mode: 'reveal-hide' (Reveal In, Plateau Hold, Hide Out)
  // -------------------------------------------------------------------------
  if (normalizedMode === 'reveal-hide') {
    const inDur = Math.max(1, inDuration ?? Math.floor(totalDuration * 0.4));
    const holdDur = Math.max(0, holdDuration ?? Math.floor(totalDuration * 0.2));
    const outDur = Math.max(1, outDuration ?? (totalDuration - inDur - holdDur));

    const inEnd = startFrame + inDur;
    const holdEnd = inEnd + holdDur;
    const outEnd = holdEnd + outDur;

    let progress = 0;
    let opacity = fade ? 0 : 1.0;
    let phase: WipeTransitionMetrics['phase'] = 'in';
    let isHide = false;
    let p = 0;

    if (currentFrame < startFrame) {
      phase = 'pending';
      progress = 0;
      p = 0;
      opacity = fade ? 0 : 1.0;
    } else if (currentFrame < inEnd) {
      phase = 'in';
      const u = (currentFrame - startFrame) / inDur;
      p = easeFn(u);
      progress = p * 0.5;
      opacity = fade ? p : 1.0;
    } else if (currentFrame < holdEnd) {
      phase = 'hold';
      progress = 0.5;
      p = 1.0;
      opacity = 1.0;
    } else if (currentFrame < outEnd) {
      phase = 'out';
      const u = (currentFrame - holdEnd) / outDur;
      const outP = easeFn(u);
      progress = 0.5 + outP * 0.5;
      p = outP;
      isHide = true;
      opacity = fade ? 1.0 - outP : 1.0;
    } else {
      phase = 'complete';
      progress = 1.0;
      p = 1.0;
      isHide = true;
      opacity = fade ? 0 : 1.0;
    }

    const { clipPath, edgePosition } = calculateClipPathForProgress(
      normalizedDir,
      p,
      isHide,
      revealOrigin,
      edgeWidth
    );

    opacity = Math.max(0, Math.min(1, sanitizeWipeNumber(opacity)));

    return {
      clipPath,
      opacity,
      progress: sanitizeWipeNumber(progress),
      isComplete: phase === 'complete',
      phase,
      edgePosition,
      outgoingClipPath: clipPath,
      outgoingOpacity: opacity,
      incomingClipPath: clipPath,
      incomingOpacity: opacity,
    };
  }

  // -------------------------------------------------------------------------
  // 4. Mode: 'replace' (Dual Layer Cross-Wipe)
  // -------------------------------------------------------------------------
  let progress = 0;
  let p = 0;
  let phase: WipeTransitionMetrics['phase'] = 'in';

  if (currentFrame < startFrame) {
    phase = 'pending';
    progress = 0;
    p = 0;
  } else if (currentFrame >= endFrame) {
    phase = 'complete';
    progress = 1.0;
    p = 1.0;
  } else {
    phase = 'in';
    const linearU = (currentFrame - startFrame) / totalDuration;
    const u = reverse ? 1.0 - linearU : linearU;
    p = easeFn(u);
    progress = linearU;
  }

  // Outgoing layer wipes away (hide)
  const outgoingCalc = calculateClipPathForProgress(
    normalizedDir,
    p,
    true, // isHide: true
    revealOrigin,
    edgeWidth
  );

  // Incoming layer wipes in (reveal)
  const incomingCalc = calculateClipPathForProgress(
    normalizedDir,
    p,
    false, // isHide: false
    revealOrigin,
    edgeWidth
  );

  const outOpacity = fade ? Math.max(0, Math.min(1, sanitizeWipeNumber(1.0 - p))) : 1.0;
  const inOpacity = fade ? Math.max(0, Math.min(1, sanitizeWipeNumber(p))) : 1.0;

  return {
    clipPath: incomingCalc.clipPath,
    opacity: inOpacity,
    progress: sanitizeWipeNumber(progress),
    isComplete: phase === 'complete',
    phase,
    edgePosition: incomingCalc.edgePosition,
    outgoingClipPath: outgoingCalc.clipPath,
    outgoingOpacity: outOpacity,
    incomingClipPath: incomingCalc.clipPath,
    incomingOpacity: inOpacity,
  };
}
