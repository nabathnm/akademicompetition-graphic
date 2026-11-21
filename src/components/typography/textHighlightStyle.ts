/**
 * TextHighlight Style & Segment Calculations
 * Pure mathematical functions determining text segmentation, clipping, stroke offsets, and styles for TextHighlight.
 * Separated from JSX to allow deterministic testing and framework reusability.
 */

import type {
  TextSegment,
  TextHighlightStyleOptions,
  CalculatedHighlightStyle,
} from './types.ts';
import { interpolateValue } from '../../utils/animation/interpolate.ts';
import { resolveEasing } from '../../utils/animation/easing.ts';
import { MOTION } from '../../styles/motion.ts';

export type { CalculatedHighlightStyle };

/**
 * Escapes special regex characters in a string.
 */
const escapeRegExp = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Parses a string into structured TextSegments based on targeted keywords, regex, or explicit segments.
 * Preserves exact text ordering, spaces, and punctuation.
 */
export const parseTextSegments = (
  text?: string,
  highlight?: string | string[] | RegExp,
  segments?: TextSegment[]
): TextSegment[] => {
  // 1. Explicit segments have highest precedence
  if (segments && segments.length > 0) {
    return segments;
  }

  if (!text || typeof text !== 'string') {
    return [];
  }

  // 2. No highlight filter provided -> entire text is highlighted
  if (!highlight) {
    return [{ text, highlighted: true }];
  }

  // 3. String keyword or array of keywords
  let regex: RegExp;
  if (typeof highlight === 'string') {
    if (!highlight.trim()) {
      return [{ text, highlighted: false }];
    }
    regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
  } else if (Array.isArray(highlight)) {
    const validTerms = highlight.filter((h) => typeof h === 'string' && h.trim().length > 0);
    if (validTerms.length === 0) {
      return [{ text, highlighted: false }];
    }
    regex = new RegExp(`(${validTerms.map(escapeRegExp).join('|')})`, 'gi');
  } else if (highlight instanceof RegExp) {
    // Ensure capture group exists so split() includes matched segments
    const source = highlight.source.startsWith('(') && highlight.source.endsWith(')')
      ? highlight.source
      : `(${highlight.source})`;
    const flags = highlight.flags.includes('g') ? highlight.flags : `${highlight.flags}g`;
    regex = new RegExp(source, flags);
  } else {
    return [{ text, highlighted: false }];
  }

  const parts = text.split(regex);
  const result: TextSegment[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;

    // Check if this part matches the highlight criteria
    let isMatch = false;
    if (typeof highlight === 'string') {
      isMatch = part.toLowerCase() === highlight.toLowerCase();
    } else if (Array.isArray(highlight)) {
      isMatch = highlight.some((h) => h.toLowerCase() === part.toLowerCase());
    } else if (highlight instanceof RegExp) {
      isMatch = new RegExp(`^${highlight.source}$`, highlight.flags.replace('g', '')).test(part);
    }

    result.push({
      text: part,
      highlighted: isMatch,
    });
  }

  return result;
};

/**
 * Pure calculation function determining visual style transformations for TextHighlight.
 */
export const calculateTextHighlightStyle = ({
  currentFrame,
  variant = 'background',
  startFrame = 0,
  durationInFrames = MOTION.duration.normal,
  exitFrame,
  exitDurationInFrames = MOTION.duration.fast,
  easing = 'easeOutCubic',
  direction = 'left-to-right',
  reverse = false,
}: TextHighlightStyleOptions): CalculatedHighlightStyle => {
  const effectiveDuration = Math.max(0, durationInFrames);

  // 1. Entrance Progress Calculation (0..1)
  let inProgress = 0;
  if (effectiveDuration === 0) {
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
  const hasExit = typeof exitFrame === 'number';
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
  if (currentFrame < startFrame) {
    return {
      progress: 0,
      outProgress: 0,
      opacity: 0,
      visibility: 'hidden',
    };
  }
  if (hasExit && currentFrame >= effectiveExitStart + effectiveExitDuration) {
    return {
      progress: 1,
      outProgress: 1,
      opacity: 0,
      visibility: 'hidden',
    };
  }

  // 4. Reverse handling
  const p = reverse ? 1 - inProgress : inProgress;
  const outP = reverse ? 1 - outProgress : outProgress;

  const calculatedOpacity = Math.max(0, (1 - outP));
  let calculatedClipPath: string | undefined = undefined;
  let calculatedTransform: string | undefined = undefined;
  let calculatedStrokeOffset: number | undefined = undefined;

  switch (variant) {
    case 'underline':
    case 'strike':
    case 'border-bottom':
    case 'background':
    case 'marker':
    case 'gradient': {
      if (direction === 'center') {
        const hInset = (1 - p) * 50 + outP * 50;
        calculatedClipPath = `inset(0% ${hInset.toFixed(2)}% 0% ${hInset.toFixed(2)}%)`;
      } else if (direction === 'right-to-left') {
        const leftInset = (1 - p) * 100;
        const rightInset = outP * 100;
        calculatedClipPath = `inset(0% ${rightInset.toFixed(2)}% 0% ${leftInset.toFixed(2)}%)`;
      } else {
        // default: left-to-right
        const rightInset = (1 - p) * 100;
        const leftInset = outP * 100;
        calculatedClipPath = `inset(0% ${rightInset.toFixed(2)}% 0% ${leftInset.toFixed(2)}%)`;
      }
      break;
    }

    case 'box':
    case 'circle': {
      // SVG stroke-dashoffset: normalized to 100% path length
      calculatedStrokeOffset = Number(((1 - p) * 100 + outP * 100).toFixed(2));
      break;
    }

    case 'glow': {
      calculatedTransform = `scale(${Math.max(0, 0.95 + p * 0.05).toFixed(3)})`;
      break;
    }

    case 'bracket': {
      const offset = (1 - p) * 8 - outP * 8;
      calculatedTransform = `translateX(${offset.toFixed(2)}px)`;
      break;
    }
  }

  return {
    progress: p,
    outProgress: outP,
    clipPath: calculatedClipPath,
    transform: calculatedTransform,
    opacity: Number(calculatedOpacity.toFixed(3)),
    strokeDashoffset: calculatedStrokeOffset,
    visibility: calculatedOpacity > 0 ? 'visible' : 'hidden',
  };
};
