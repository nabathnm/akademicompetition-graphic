/**
 * TextMask Style & Timing Calculations
 * Pure mathematical functions determining clipping boundaries, transforms, and line stagger offsets for TextMask.
 * Separated from JSX to allow deterministic testing and framework reusability.
 */

import type {
  TextMaskStyleOptions,
  CalculatedMaskStyle,
} from './types.ts';
import { interpolateValue } from '../../utils/animation/interpolate.ts';
import { resolveEasing } from '../../utils/animation/easing.ts';
import { MOTION } from '../../styles/motion.ts';

export type { CalculatedMaskStyle };

/**
 * Parses multi-line strings or arrays into clean lines for line-by-line masked reveals.
 */
export const parseMaskLines = (text?: string, lines?: string[]): string[] => {
  if (lines && lines.length > 0) {
    return lines;
  }
  if (!text || typeof text !== 'string') {
    return [];
  }
  return text.split('\n');
};

export interface LineMaskTimingOptions {
  startFrame?: number;
  staggerDelay?: number;
  lineDuration?: number;
  durationInFrames?: number;
  reverse?: boolean;
}

/**
 * Calculates start, end, and duration frame timings for individual lines.
 */
export const calculateLineMaskTiming = (
  totalLines: number,
  options: LineMaskTimingOptions = {}
) => {
  const {
    startFrame = 0,
    staggerDelay = 4,
    lineDuration,
    durationInFrames,
    reverse = false,
  } = options;

  const computedLineDuration =
    lineDuration ??
    (durationInFrames !== undefined
      ? Math.max(1, durationInFrames - Math.max(0, totalLines - 1) * staggerDelay)
      : 18);

  const totalEntranceSpan =
    totalLines <= 0
      ? 0
      : Math.max(0, totalLines - 1) * staggerDelay + computedLineDuration;

  const totalDuration = durationInFrames ?? totalEntranceSpan;

  const getLineTiming = (lineIndex: number) => {
    if (lineIndex < 0 || lineIndex >= totalLines) {
      return {
        lineStartFrame: startFrame,
        lineDuration: computedLineDuration,
        lineEndFrame: startFrame + computedLineDuration,
      };
    }
    const effectiveIndex = reverse ? totalLines - 1 - lineIndex : lineIndex;
    const lineStart = startFrame + effectiveIndex * staggerDelay;
    const lineEnd = lineStart + computedLineDuration;
    return {
      lineStartFrame: lineStart,
      lineDuration: computedLineDuration,
      lineEndFrame: lineEnd,
    };
  };

  return {
    totalLines,
    computedLineDuration,
    totalEntranceSpan,
    totalDurationInFrames: totalDuration,
    getLineTiming,
  };
};

/**
 * Pure calculation function determining clipping paths and transforms for TextMask.
 */
export const calculateTextMaskStyle = ({
  currentFrame,
  variant = 'bottom-reveal',
  startFrame = 0,
  durationInFrames = MOTION.duration.normal,
  exitFrame,
  exitDurationInFrames = MOTION.duration.fast,
  easing = 'easeOutCubic',
  direction = 'both',
  distance = '100%',
  reverse = false,
}: TextMaskStyleOptions): CalculatedMaskStyle => {
  const effectiveDuration = Math.max(0, durationInFrames);

  // 1. Entrance Progress Calculation (0..1)
  let inProgress = 0;
  if (direction === 'out') {
    inProgress = 1;
  } else if (effectiveDuration === 0) {
    inProgress = currentFrame >= startFrame ? 1 : 0;
  } else if (currentFrame < startFrame) {
    inProgress = 0;
  } else if (currentFrame >= startFrame + effectiveDuration) {
    inProgress = 1;
  } else {
    inProgress = interpolateValue({
      frame: currentFrame,
      inputRange: [startFrame, startFrame + effectiveDuration],
      outputRange: [0, 1],
      easing: resolveEasing(easing),
    });
  }

  // 2. Exit Progress Calculation (0..1)
  let outProgress = 0;
  const hasExit =
    direction !== 'in' &&
    typeof exitFrame === 'number' &&
    (direction === 'out' || exitFrame >= startFrame);

  const effectiveExitStart = hasExit ? (exitFrame as number) : Infinity;
  const effectiveExitDuration = Math.max(0, exitDurationInFrames);

  if (!hasExit || currentFrame < effectiveExitStart) {
    outProgress = 0;
  } else if (effectiveExitDuration === 0) {
    outProgress = currentFrame >= effectiveExitStart ? 1 : 0;
  } else if (currentFrame >= effectiveExitStart + effectiveExitDuration) {
    outProgress = 1;
  } else {
    outProgress = interpolateValue({
      frame: currentFrame,
      inputRange: [effectiveExitStart, effectiveExitStart + effectiveExitDuration],
      outputRange: [0, 1],
      easing: resolveEasing(easing),
    });
  }

  // 3. Lifecycle boundaries
  if (direction !== 'out' && currentFrame < startFrame) {
    return { opacity: 0, visibility: 'hidden' };
  }
  if (hasExit && currentFrame >= effectiveExitStart + effectiveExitDuration) {
    return { opacity: 0, visibility: 'hidden' };
  }

  // 4. Reverse handling
  const p = reverse ? 1 - inProgress : inProgress;
  const outP = reverse ? 1 - outProgress : outProgress;

  let calculatedClipPath: string | undefined = undefined;
  let calculatedTransform: string | undefined = undefined;
  const calculatedOpacity = 1;

  switch (variant) {
    case 'bottom-reveal': {
      // Text reveals from bottom to top (revealed area expands upward from bottom)
      const topInset = (1 - p) * 100;
      const bottomInset = outP * 100;
      calculatedClipPath = `inset(${topInset.toFixed(2)}% 0% ${bottomInset.toFixed(2)}% 0%)`;
      break;
    }

    case 'top-reveal': {
      // Text reveals from top to bottom (revealed area expands downward from top)
      const bottomInset = (1 - p) * 100;
      const topInset = outP * 100;
      calculatedClipPath = `inset(${topInset.toFixed(2)}% 0% ${bottomInset.toFixed(2)}% 0%)`;
      break;
    }

    case 'left-reveal': {
      // Text reveals from left to right (revealed area expands rightward from left edge)
      const rightInset = (1 - p) * 100;
      const leftInset = outP * 100;
      calculatedClipPath = `inset(0% ${rightInset.toFixed(2)}% 0% ${leftInset.toFixed(2)}%)`;
      break;
    }

    case 'right-reveal': {
      // Text reveals from right to left (revealed area expands leftward from right edge)
      const leftInset = (1 - p) * 100;
      const rightInset = outP * 100;
      calculatedClipPath = `inset(0% ${rightInset.toFixed(2)}% 0% ${leftInset.toFixed(2)}%)`;
      break;
    }

    case 'center-reveal': {
      // Reveals outward from horizontal center
      const hInset = (1 - p) * 50 + outP * 50;
      calculatedClipPath = `inset(0% ${hInset.toFixed(2)}% 0% ${hInset.toFixed(2)}%)`;
      break;
    }

    case 'center-collapse': {
      // Reveals inward from outer edges towards center
      const hInset = (1 - p) * 50;
      const vInset = (1 - p) * 25;
      calculatedClipPath = `inset(${vInset.toFixed(2)}% ${hInset.toFixed(2)}% ${vInset.toFixed(2)}% ${hInset.toFixed(2)}%)`;
      break;
    }

    case 'vertical-wipe': {
      // Full-height vertical clipping wipe
      const topEdge = outP * 100;
      const bottomEdge = (1 - p) * 100;
      calculatedClipPath = `inset(${topEdge.toFixed(2)}% 0% ${bottomEdge.toFixed(2)}% 0%)`;
      break;
    }

    case 'horizontal-wipe': {
      // Full-width horizontal clipping wipe
      const leftEdge = outP * 100;
      const rightEdge = (1 - p) * 100;
      calculatedClipPath = `inset(0% ${rightEdge.toFixed(2)}% 0% ${leftEdge.toFixed(2)}%)`;
      break;
    }

    case 'diagonal-wipe': {
      // 45-degree diagonal polygon wipe
      const topX = Math.min(100, Math.max(0, p * 150));
      const bottomX = Math.min(100, Math.max(0, p * 150 - 50));
      const exitTopX = Math.min(100, Math.max(0, outP * 150));
      const exitBottomX = Math.min(100, Math.max(0, outP * 150 - 50));
      calculatedClipPath = `polygon(${exitTopX.toFixed(1)}% 0%, ${topX.toFixed(1)}% 0%, ${bottomX.toFixed(1)}% 100%, ${exitBottomX.toFixed(1)}% 100%)`;
      break;
    }

    case 'mask-slide-up':
    case 'line-reveal':
    default: {
      // Translate behind overflow container
      if (typeof distance === 'number') {
        const currentY = (1 - p) * distance - outP * distance;
        calculatedTransform = `translateY(${currentY.toFixed(2)}px)`;
      } else {
        const currentY = (1 - p) * 100 - outP * 100;
        calculatedTransform = `translateY(${currentY.toFixed(2)}%)`;
      }
      break;
    }
  }

  return {
    clipPath: calculatedClipPath,
    transform: calculatedTransform,
    opacity: calculatedOpacity,
    visibility: 'visible',
  };
};
