/**
 * WordReveal Style & Timing Calculations
 * Pure mathematical functions determining word segmentation, timing offsets, and styles for WordReveal.
 * Separated from JSX to allow deterministic testing and maximum reusability.
 */

import type {
  SegmentedWordToken,
  WordRevealStyleOptions,
  WordRevealTiming,
} from './types.ts';
import {
  calculateAnimatedTextStyle,
  type CalculatedAnimatedStyle,
} from './animatedTextStyle.ts';
import { MOTION } from '../../styles/motion.ts';

export type { CalculatedAnimatedStyle };

/**
 * Predictable word segmentation function.
 * Splits text into word tokens and whitespace tokens, preserving punctuation, multiple spaces, and newlines.
 */
export const segmentText = (
  text: string,
  separator: string | RegExp = /\s+/,
  preserveWhitespace = true
): SegmentedWordToken[] => {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const tokens: SegmentedWordToken[] = [];
  let wordCounter = 0;

  // Case 1: Default whitespace separator
  const isDefaultWhitespace =
    separator instanceof RegExp
      ? separator.source === '\\s+' || separator.source === '\\s'
      : false;

  if (isDefaultWhitespace) {
    // Splitting with capturing group /(\s+)/ keeps both words and whitespaces
    const parts = text.split(/(\s+)/);
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part === '') continue;

      const isWhitespace = /^\s+$/.test(part);
      if (isWhitespace) {
        if (preserveWhitespace) {
          tokens.push({
            id: `space-${tokens.length}`,
            text: part,
            isWord: false,
            wordIndex: -1,
          });
        } else if (tokens.length > 0 && !tokens[tokens.length - 1].text.endsWith(' ')) {
          tokens.push({
            id: `space-${tokens.length}`,
            text: ' ',
            isWord: false,
            wordIndex: -1,
          });
        }
      } else {
        tokens.push({
          id: `word-${wordCounter}`,
          text: part,
          isWord: true,
          wordIndex: wordCounter++,
        });
      }
    }
    return tokens;
  }

  // Case 2: Custom string separator
  if (typeof separator === 'string') {
    const parts = text.split(separator);
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.length > 0) {
        tokens.push({
          id: `word-${wordCounter}`,
          text: part,
          isWord: true,
          wordIndex: wordCounter++,
        });
      }
      if (i < parts.length - 1 && preserveWhitespace) {
        tokens.push({
          id: `sep-${tokens.length}`,
          text: separator,
          isWord: false,
          wordIndex: -1,
        });
      }
    }
    return tokens;
  }

  // Case 3: Custom RegExp
  const regex = new RegExp(`(${separator.source})`, separator.flags.includes('g') ? separator.flags : separator.flags + 'g');
  const parts = text.split(regex);
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === '') continue;
    const isSep = separator.test(part);
    if (isSep) {
      if (preserveWhitespace) {
        tokens.push({
          id: `sep-${tokens.length}`,
          text: part,
          isWord: false,
          wordIndex: -1,
        });
      }
    } else {
      tokens.push({
        id: `word-${wordCounter}`,
        text: part,
        isWord: true,
        wordIndex: wordCounter++,
      });
    }
  }

  return tokens;
};

export interface WordRevealTimingOptions {
  startFrame?: number;
  delay?: number;
  staggerDelay?: number;
  wordDuration?: number;
  durationInFrames?: number;
  reverse?: boolean;
  exitFrame?: number;
  exitDurationInFrames?: number;
  exitStaggerDelay?: number;
}

export interface WordRevealTimingResult {
  totalWords: number;
  computedWordDuration: number;
  effectiveBaseStart: number;
  totalEntranceSpan: number;
  totalDurationInFrames: number;
  getWordTiming: (wordIndex: number) => WordRevealTiming;
}

/**
 * Calculates start, end, and duration frame timings for all words and individual word indices.
 */
export const calculateWordRevealTiming = (
  totalWords: number,
  options: WordRevealTimingOptions = {}
): WordRevealTimingResult => {
  const {
    startFrame = 0,
    delay = 0,
    staggerDelay = 3,
    wordDuration,
    durationInFrames,
    reverse = false,
  } = options;

  const effectiveBaseStart = startFrame + delay;
  const computedWordDuration =
    wordDuration ??
    (durationInFrames !== undefined
      ? Math.max(1, durationInFrames - Math.max(0, totalWords - 1) * staggerDelay)
      : MOTION.duration.normal);

  const totalEntranceSpan =
    totalWords <= 0
      ? 0
      : Math.max(0, totalWords - 1) * staggerDelay + computedWordDuration;

  const totalDuration = durationInFrames ?? totalEntranceSpan;

  const getWordTiming = (wordIndex: number): WordRevealTiming => {
    if (wordIndex < 0 || wordIndex >= totalWords) {
      return {
        totalWords,
        wordStartFrame: effectiveBaseStart,
        wordDuration: computedWordDuration,
        wordEndFrame: effectiveBaseStart + computedWordDuration,
        totalDurationInFrames: totalDuration,
      };
    }

    const effectiveIndex = reverse ? totalWords - 1 - wordIndex : wordIndex;
    const wordStart = effectiveBaseStart + effectiveIndex * staggerDelay;
    const wordEnd = wordStart + computedWordDuration;

    return {
      totalWords,
      wordStartFrame: wordStart,
      wordDuration: computedWordDuration,
      wordEndFrame: wordEnd,
      totalDurationInFrames: totalDuration,
    };
  };

  return {
    totalWords,
    computedWordDuration,
    effectiveBaseStart,
    totalEntranceSpan,
    totalDurationInFrames: totalDuration,
    getWordTiming,
  };
};

/**
 * Calculates the exact style and transformation for an individual word at the current frame.
 */
export const calculateWordRevealStyle = ({
  currentFrame,
  fps,
  totalWords,
  wordIndex,
  variant = 'fade-slide-up',
  startFrame = 0,
  durationInFrames,
  staggerDelay = 3,
  wordDuration,
  exitFrame,
  exitDurationInFrames = MOTION.duration.fast,
  exitStaggerDelay,
  delay = 0,
  easing = 'easeOutCubic',
  springPreset = 'snappy',
  distance = 30,
  initialScale = 0.85,
  initialRotation = -8,
  initialBlur = 10,
  reverse = false,
  direction = 'both',
}: WordRevealStyleOptions): CalculatedAnimatedStyle => {
  const timing = calculateWordRevealTiming(totalWords, {
    startFrame,
    delay,
    staggerDelay,
    wordDuration,
    durationInFrames,
    reverse,
    exitFrame,
    exitDurationInFrames,
    exitStaggerDelay,
  });

  const wordTiming = timing.getWordTiming(wordIndex);

  // Exit calculation
  let wordExitStart: number | undefined = undefined;
  if (typeof exitFrame === 'number') {
    const effectiveExitStagger = exitStaggerDelay ?? staggerDelay;
    const effectiveExitIndex = reverse ? totalWords - 1 - wordIndex : wordIndex;
    wordExitStart = exitFrame + effectiveExitIndex * effectiveExitStagger;
  }

  return calculateAnimatedTextStyle({
    currentFrame,
    fps,
    variant,
    startFrame: wordTiming.wordStartFrame,
    durationInFrames: wordTiming.wordDuration,
    exitFrame: wordExitStart,
    exitDurationInFrames,
    delay: 0,
    easing,
    springPreset,
    distance,
    initialScale,
    initialRotation,
    initialBlur,
    direction,
  });
};
