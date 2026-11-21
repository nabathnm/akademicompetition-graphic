/**
 * SplitText Style & Segmentation Calculations
 * Pure mathematical functions determining text segmentation (line, word, character, sentence, custom),
 * deterministic seeded random shuffling, and frame-based animation styles for SplitText.
 * Separated from JSX to allow deterministic testing and maximum reusability.
 */

import type {
  SplitTextMode,
  SplitTextCustomSegment,
  SplitTextSegment,
  SplitTextStyleOptions,
  SplitTextTiming,
} from './types.ts';
import React from 'react';
import { interpolateValue } from '../../utils/animation/interpolate.ts';
import { resolveEasing } from '../../utils/animation/easing.ts';
import { createSpring } from '../../utils/animation/spring.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { getGraphemes } from './characterRevealStyle.ts';
import { MOTION } from '../../styles/motion.ts';

export interface CalculatedSplitTextStyle {
  opacity: number;
  transform?: string;
  filter?: string;
  transformOrigin?: string;
  visibility?: React.CSSProperties['visibility'];
}

/**
 * Deterministic 32-bit string hashing function.
 */
export const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

/**
 * Mulberry32 seeded deterministic random shuffle.
 * Produces an array of permutation indices for [0..count-1].
 * Completely deterministic and pure across renders given the same seed.
 */
export const createDeterministicShuffle = (
  count: number,
  seed: number | string = 42
): number[] => {
  if (count <= 1) return count === 1 ? [0] : [];

  let s = typeof seed === 'number' ? Math.floor(Math.abs(seed)) : hashString(String(seed));
  if (s === 0) s = 1337;

  // Mulberry32 PRNG
  const random = (): number => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const indices = Array.from({ length: count }, (_, i) => i);
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = indices[i];
    indices[i] = indices[j];
    indices[j] = temp;
  }

  // Convert to lookup: shuffledOrder[i] is the rank/order of segment i
  return indices;
};

/**
 * Splits text into segments according to splitBy mode:
 * - 'line': splits on \r?\n, preserving empty lines
 * - 'word': splits on \s+, attaching trailing whitespace to each word
 * - 'character': splits into grapheme clusters via Intl.Segmenter
 * - 'sentence': splits on sentence boundaries preserving trailing whitespace
 * - 'custom': wraps custom segment definitions
 */
export const splitTextIntoSegments = (
  text?: string,
  splitBy: SplitTextMode = 'word',
  customSegments?: SplitTextCustomSegment[],
  preserveWhitespace = true
): SplitTextSegment[] => {
  // 1. Custom mode takes precedence if provided or explicitly selected
  if (splitBy === 'custom' || (customSegments && customSegments.length > 0)) {
    if (!customSegments || customSegments.length === 0) return [];
    return customSegments.map((seg, idx) => ({
      id: seg.id || `custom-${idx}`,
      text: seg.text || '',
      index: idx,
      customData: seg,
    }));
  }

  if (!text || typeof text !== 'string') {
    return [];
  }

  // 2. Line mode: splits on newline characters
  if (splitBy === 'line') {
    const lines = text.split(/\r?\n/);
    return lines.map((line, idx) => ({
      id: `line-${idx}`,
      text: line,
      index: idx,
      lineIndex: idx,
      isNewline: idx < lines.length - 1,
    }));
  }

  // 3. Sentence mode
  if (splitBy === 'sentence') {
    // Try Intl.Segmenter with sentence granularity if available
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
      try {
        type IntlSegmenterConstructor = new (
          locales?: string | string[],
          options?: { granularity?: 'grapheme' | 'word' | 'sentence' }
        ) => {
          segment: (input: string) => Iterable<{ segment: string }>;
        };
        const SegmenterClass = (Intl as unknown as { Segmenter: IntlSegmenterConstructor }).Segmenter;
        const segmenter = new SegmenterClass(undefined, { granularity: 'sentence' });
        const sParts = Array.from(segmenter.segment(text), (s) => s.segment);
        if (sParts.length > 0) {
          return sParts.map((sentence, idx) => ({
            id: `sentence-${idx}`,
            text: sentence,
            index: idx,
            sentenceIndex: idx,
          }));
        }
      } catch {
        // Fall back to regex below
      }
    }

    // Fallback regex matching sentences with trailing punctuation and whitespace
    const sentenceMatches = text.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g);
    if (!sentenceMatches) {
      return [{ id: 'sentence-0', text, index: 0, sentenceIndex: 0 }];
    }
    return sentenceMatches.map((sentence, idx) => ({
      id: `sentence-${idx}`,
      text: sentence,
      index: idx,
      sentenceIndex: idx,
    }));
  }

  // 4. Character mode: grapheme clusters
  if (splitBy === 'character') {
    const graphemes = getGraphemes(text);
    return graphemes.map((char, idx) => ({
      id: `char-${idx}`,
      text: char,
      index: idx,
    }));
  }

  // 5. Word mode (default)
  // Split on whitespace capturing group to preserve spaces between words
  const parts = text.split(/(\s+)/);
  const segments: SplitTextSegment[] = [];
  let wordCounter = 0;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === '') continue;

    const isWhitespace = /^\s+$/.test(part);
    if (!isWhitespace) {
      // Find following whitespace if present
      let trailingSpace = '';
      if (preserveWhitespace && i + 1 < parts.length && /^\s+$/.test(parts[i + 1])) {
        trailingSpace = parts[i + 1];
        i++; // skip space token as it is attached to this word
      }

      segments.push({
        id: `word-${wordCounter}`,
        text: part,
        index: wordCounter,
        wordIndex: wordCounter,
        trailingSpace,
      });
      wordCounter++;
    } else if (preserveWhitespace) {
      // Standalone leading whitespace
      segments.push({
        id: `space-${wordCounter}`,
        text: '',
        index: wordCounter,
        trailingSpace: part,
      });
    }
  }

  return segments;
};

/**
 * Calculates start frames, end frames, and durations for a specific segment.
 */
export const calculateSplitTextTiming = ({
  totalSegments,
  segmentIndex,
  variant = 'slide-up',
  startFrame = 0,
  durationInFrames,
  staggerDelay = 2,
  segmentDuration = MOTION.duration.normal,
  exitFrame,
  exitDurationInFrames = MOTION.duration.fast,
  exitStaggerDelay,
  delay = 0,
  reverse = false,
  shuffledIndices,
}: Omit<SplitTextStyleOptions, 'currentFrame' | 'fps'>): SplitTextTiming => {
  const safeTotal = Math.max(1, totalSegments);
  const clampedIndex = clamp(segmentIndex, 0, safeTotal - 1);

  // Determine effective sequence index
  let effectiveIndex = clampedIndex;
  if (variant === 'random-stagger' && shuffledIndices && shuffledIndices.length === totalSegments) {
    effectiveIndex = shuffledIndices[clampedIndex];
  } else if (reverse) {
    effectiveIndex = (safeTotal - 1) - clampedIndex;
  }

  // Determine segment duration
  let effectiveSegDuration = segmentDuration;
  if (typeof durationInFrames === 'number' && durationInFrames > 0) {
    const maxStagger = (safeTotal - 1) * staggerDelay;
    effectiveSegDuration = Math.max(1, durationInFrames - maxStagger);
  }

  const segmentStart = startFrame + delay + effectiveIndex * staggerDelay;
  const segmentEnd = segmentStart + effectiveSegDuration;

  // Total duration spans from sequence start to the last finishing segment
  const totalDuration = startFrame + delay + (safeTotal - 1) * staggerDelay + effectiveSegDuration;

  let exitStart: number | undefined = undefined;
  let exitEnd: number | undefined = undefined;

  if (typeof exitFrame === 'number') {
    const effectiveExitStagger = typeof exitStaggerDelay === 'number' ? exitStaggerDelay : staggerDelay;
    let exitIndex = clampedIndex;
    if (reverse) {
      exitIndex = (safeTotal - 1) - clampedIndex;
    }
    exitStart = exitFrame + exitIndex * effectiveExitStagger;
    exitEnd = exitStart + exitDurationInFrames;
  }

  return {
    segmentStartFrame: segmentStart,
    segmentEndFrame: segmentEnd,
    segmentDuration: effectiveSegDuration,
    exitStartFrame: exitStart,
    exitEndFrame: exitEnd,
    exitDuration: exitDurationInFrames,
    totalDurationInFrames: totalDuration,
  };
};

/**
 * Pure calculation function determining visual style transformations for SplitText segments.
 */
export const calculateSplitTextStyle = ({
  currentFrame,
  fps,
  totalSegments,
  segmentIndex,
  variant = 'slide-up',
  startFrame = 0,
  durationInFrames,
  staggerDelay = 2,
  segmentDuration = MOTION.duration.normal,
  exitFrame,
  exitDurationInFrames = MOTION.duration.fast,
  exitStaggerDelay,
  delay = 0,
  easing = 'easeOutCubic',
  springPreset = 'snappy',
  distance = 30,
  initialScale = 0.85,
  initialRotation = -10,
  initialBlur = 8,
  reverse = false,
  direction = 'both',
  seed = 42,
  shuffledIndices,
}: SplitTextStyleOptions): CalculatedSplitTextStyle => {
  // Generate deterministic shuffle indices for random-stagger if needed
  let indices = shuffledIndices;
  if (variant === 'random-stagger' && (!indices || indices.length !== totalSegments)) {
    indices = createDeterministicShuffle(totalSegments, seed);
  }

  const timing = calculateSplitTextTiming({
    totalSegments,
    segmentIndex,
    variant,
    startFrame,
    durationInFrames,
    staggerDelay,
    segmentDuration,
    exitFrame,
    exitDurationInFrames,
    exitStaggerDelay,
    delay,
    reverse,
    seed,
    shuffledIndices: indices,
  });

  const { segmentStartFrame, segmentEndFrame, segmentDuration: segDur } = timing;
  const isSpring = variant === 'pop';

  // 1. Entrance Progress (0..1)
  let inProgress = 0;
  if (direction === 'out') {
    inProgress = 1;
  } else if (segDur === 0) {
    inProgress = currentFrame >= segmentStartFrame ? 1 : 0;
  } else if (currentFrame < segmentStartFrame) {
    inProgress = 0;
  } else if (currentFrame >= segmentEndFrame && !isSpring) {
    inProgress = 1;
  } else if (isSpring) {
    inProgress = createSpring({
      frame: currentFrame - segmentStartFrame,
      fps,
      preset: springPreset,
    });
  } else {
    inProgress = interpolateValue({
      frame: currentFrame,
      inputRange: [segmentStartFrame, segmentEndFrame],
      outputRange: [0, 1],
      easing: resolveEasing(easing),
    });
  }

  // 2. Exit Progress (0..1)
  let outProgress = 0;
  const hasExit = direction !== 'in' && typeof timing.exitStartFrame === 'number';
  const exitStart = timing.exitStartFrame ?? Infinity;
  const exitEnd = timing.exitEndFrame ?? Infinity;
  const exitDur = timing.exitDuration ?? 0;

  if (hasExit && currentFrame >= exitStart) {
    if (exitDur === 0) {
      outProgress = 1;
    } else if (currentFrame >= exitEnd) {
      outProgress = 1;
    } else {
      outProgress = interpolateValue({
        frame: currentFrame,
        inputRange: [exitStart, exitEnd],
        outputRange: [0, 1],
        easing: resolveEasing(easing),
      });
    }
  }

  // 3. Lifecycle Visibility Boundaries
  if (direction !== 'out' && currentFrame < segmentStartFrame) {
    return {
      opacity: 0,
      transform: undefined,
      filter: undefined,
      visibility: 'hidden',
    };
  }

  if (hasExit && currentFrame >= exitEnd) {
    return {
      opacity: 0,
      transform: undefined,
      filter: undefined,
      visibility: 'hidden',
    };
  }

  // 4. Style Transformations per Variant
  const p = inProgress;
  const outP = outProgress;
  const effectiveAlpha = Math.max(0, p * (1 - outP));

  let transform: string | undefined = undefined;
  let filter: string | undefined = undefined;
  let transformOrigin: string | undefined = undefined;

  switch (variant) {
    case 'fade': {
      // Opacity only
      break;
    }

    case 'slide-up':
    case 'random-stagger': {
      const yIn = (1 - p) * distance;
      const yOut = outP * -distance;
      const currentY = yIn + yOut;
      transform = `translateY(${currentY.toFixed(2)}px)`;
      break;
    }

    case 'slide-down': {
      const yIn = -(1 - p) * distance;
      const yOut = outP * distance;
      const currentY = yIn + yOut;
      transform = `translateY(${currentY.toFixed(2)}px)`;
      break;
    }

    case 'slide-left': {
      const xIn = (1 - p) * distance;
      const xOut = outP * -distance;
      const currentX = xIn + xOut;
      transform = `translateX(${currentX.toFixed(2)}px)`;
      break;
    }

    case 'slide-right': {
      const xIn = -(1 - p) * distance;
      const xOut = outP * distance;
      const currentX = xIn + xOut;
      transform = `translateX(${currentX.toFixed(2)}px)`;
      break;
    }

    case 'scale':
    case 'pop': {
      const currentScale = initialScale + (1 - initialScale) * p - outP * 0.15;
      transform = `scale(${Math.max(0, currentScale).toFixed(3)})`;
      break;
    }

    case 'rotate': {
      const currentRot = (1 - p) * initialRotation + outP * initialRotation;
      transform = `rotate(${currentRot.toFixed(2)}deg)`;
      break;
    }

    case 'blur': {
      const blurVal = (1 - p) * initialBlur + outP * initialBlur;
      if (blurVal > 0.05) {
        filter = `blur(${blurVal.toFixed(2)}px)`;
      }
      break;
    }

    case 'flip-up': {
      const rotX = (1 - p) * -80 + outP * 80;
      const yOffset = (1 - p) * (distance * 0.4);
      transform = `perspective(600px) rotateX(${rotX.toFixed(2)}deg) translateY(${yOffset.toFixed(2)}px)`;
      transformOrigin = '50% 100%';
      break;
    }

    case 'flip-down': {
      const rotX = (1 - p) * 80 - outP * 80;
      const yOffset = -(1 - p) * (distance * 0.4);
      transform = `perspective(600px) rotateX(${rotX.toFixed(2)}deg) translateY(${yOffset.toFixed(2)}px)`;
      transformOrigin = '50% 0%';
      break;
    }

    case 'stagger': {
      const currentY = (1 - p) * distance + outP * -distance;
      const currentScale = 0.92 + 0.08 * p - outP * 0.08;
      transform = `translateY(${currentY.toFixed(2)}px) scale(${currentScale.toFixed(3)})`;
      break;
    }

    case 'wave': {
      const waveDisplacement = Math.sin(p * Math.PI) * -distance;
      const verticalSettle = (1 - p) * (distance * 0.5) + outP * -distance;
      const currentY = waveDisplacement + verticalSettle;
      transform = `translateY(${currentY.toFixed(2)}px)`;
      break;
    }
  }

  return {
    opacity: Number(effectiveAlpha.toFixed(3)),
    transform,
    filter,
    transformOrigin,
    visibility: effectiveAlpha > 0 ? 'visible' : 'hidden',
  };
};
