/**
 * CharacterReveal Style & Timing Calculations
 * Pure mathematical functions for grapheme-aware character segmentation, timing offsets, and styles.
 * Separated from JSX to allow deterministic testing and maximum reusability.
 */

import type {
  CharacterToken,
  WordGroup,
  CharacterSegmentationResult,
  CharacterRevealStyleOptions,
  CharacterRevealTiming,
} from './types.ts';
import {
  calculateAnimatedTextStyle,
  type CalculatedAnimatedStyle,
} from './animatedTextStyle.ts';
import { createSpring } from '../../utils/animation/spring.ts';
import { interpolateValue } from '../../utils/animation/interpolate.ts';
import { resolveEasing } from '../../utils/animation/easing.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { MOTION } from '../../styles/motion.ts';

export type { CalculatedAnimatedStyle };

/**
 * Grapheme-aware character segmenter.
 * Uses Intl.Segmenter with grapheme granularity when available, preserving:
 * - Accented characters (e.g. é, ü, ñ)
 * - Combining diacritical marks
 * - Multi-codepoint Emoji (e.g. 👍🏽, 👨‍👩‍👧‍👦, 🚀)
 * - Multilingual alphabets (Arabic, Japanese, Hindi, Cyrillic)
 */
export const getGraphemes = (text: string): string[] => {
  if (!text || typeof text !== 'string') {
    return [];
  }

  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      type IntlSegmenterConstructor = new (
        locales?: string | string[],
        options?: { granularity?: 'grapheme' | 'word' | 'sentence' }
      ) => {
        segment: (input: string) => Iterable<{ segment: string }>;
      };

      const SegmenterClass = (Intl as unknown as { Segmenter: IntlSegmenterConstructor }).Segmenter;
      const segmenter = new SegmenterClass(undefined, { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), (s: { segment: string }) => s.segment);
    } catch {
      // Fallback below
    }
  }

  // Fallback handles basic surrogate pairs
  return Array.from(text);
};

export interface SegmentCharactersOptions {
  preserveWhitespace?: boolean;
  animateSpaces?: boolean;
}

/**
 * Segments text into structured WordGroups containing individual CharacterTokens.
 * Grouping characters by word with whiteSpace: 'nowrap' prevents the browser from
 * ever breaking a word in half across lines, while preserving natural spaces and newlines.
 */
export const segmentCharacters = (
  text: string,
  options: SegmentCharactersOptions = {}
): CharacterSegmentationResult => {
  const { preserveWhitespace = true, animateSpaces = false } = options;

  if (!text || typeof text !== 'string') {
    return { tokens: [], wordGroups: [], totalAnimatableChars: 0 };
  }

  const graphemes = getGraphemes(text);
  const tokens: CharacterToken[] = [];
  const wordGroups: WordGroup[] = [];

  let currentCharIndex = 0;
  let currentWordIndex = 0;
  let currentWordChars: CharacterToken[] = [];
  let currentWordText = '';

  for (let i = 0; i < graphemes.length; i++) {
    const char = graphemes[i];
    const isWhitespace = /^\s+$/.test(char);

    if (!isWhitespace) {
      // Animatable character in current word
      const token: CharacterToken = {
        id: `char-${tokens.length}`,
        char,
        isWhitespace: false,
        charIndex: currentCharIndex++,
        wordIndex: currentWordIndex,
      };
      tokens.push(token);
      currentWordChars.push(token);
      currentWordText += char;
    } else {
      // Whitespace grapheme
      if (animateSpaces) {
        const token: CharacterToken = {
          id: `char-${tokens.length}`,
          char,
          isWhitespace: true,
          charIndex: currentCharIndex++,
          wordIndex: currentWordIndex,
        };
        tokens.push(token);
        currentWordChars.push(token);
        currentWordText += char;
      } else {
        // Space is not animated as a character:
        // Finalize current word if it has characters
        if (currentWordChars.length > 0) {
          wordGroups.push({
            id: `word-${currentWordIndex}`,
            wordText: currentWordText,
            characters: currentWordChars,
            trailingSpace: char,
          });
          currentWordIndex++;
          currentWordChars = [];
          currentWordText = '';
        } else if (wordGroups.length > 0) {
          // Consecutive whitespace (e.g. multi-spaces or newlines), append to previous group
          const prevGroup = wordGroups[wordGroups.length - 1];
          if (preserveWhitespace) {
            prevGroup.trailingSpace = (prevGroup.trailingSpace || '') + char;
          }
        } else {
          // Leading whitespace before the first word
          wordGroups.push({
            id: `word-leading-${wordGroups.length}`,
            wordText: '',
            characters: [],
            trailingSpace: char,
          });
        }
      }
    }
  }

  // Finalize any trailing word
  if (currentWordChars.length > 0) {
    wordGroups.push({
      id: `word-${currentWordIndex}`,
      wordText: currentWordText,
      characters: currentWordChars,
      trailingSpace: '',
    });
  }

  return {
    tokens,
    wordGroups,
    totalAnimatableChars: currentCharIndex,
  };
};

export interface CharacterRevealTimingOptions {
  startFrame?: number;
  delay?: number;
  staggerDelay?: number;
  characterDuration?: number;
  durationInFrames?: number;
  reverse?: boolean;
}

export interface CharacterRevealTimingResult {
  totalChars: number;
  computedCharDuration: number;
  effectiveBaseStart: number;
  totalEntranceSpan: number;
  totalDurationInFrames: number;
  getCharTiming: (charIndex: number) => CharacterRevealTiming;
}

/**
 * Calculates start, end, and duration frame timings for all characters.
 */
export const calculateCharacterRevealTiming = (
  totalChars: number,
  options: CharacterRevealTimingOptions = {}
): CharacterRevealTimingResult => {
  const {
    startFrame = 0,
    delay = 0,
    staggerDelay = 1,
    characterDuration,
    durationInFrames,
    reverse = false,
  } = options;

  const effectiveBaseStart = startFrame + delay;
  const computedCharDuration =
    characterDuration ??
    (durationInFrames !== undefined
      ? Math.max(1, durationInFrames - Math.max(0, totalChars - 1) * staggerDelay)
      : 14);

  const totalEntranceSpan =
    totalChars <= 0
      ? 0
      : Math.max(0, totalChars - 1) * staggerDelay + computedCharDuration;

  const totalDuration = durationInFrames ?? totalEntranceSpan;

  const getCharTiming = (charIndex: number): CharacterRevealTiming => {
    if (charIndex < 0 || charIndex >= totalChars) {
      return {
        totalChars,
        charStartFrame: effectiveBaseStart,
        charDuration: computedCharDuration,
        charEndFrame: effectiveBaseStart + computedCharDuration,
        totalDurationInFrames: totalDuration,
      };
    }

    const effectiveIndex = reverse ? totalChars - 1 - charIndex : charIndex;
    const charStart = effectiveBaseStart + effectiveIndex * staggerDelay;
    const charEnd = charStart + computedCharDuration;

    return {
      totalChars,
      charStartFrame: charStart,
      charDuration: computedCharDuration,
      charEndFrame: charEnd,
      totalDurationInFrames: totalDuration,
    };
  };

  return {
    totalChars,
    computedCharDuration,
    effectiveBaseStart,
    totalEntranceSpan,
    totalDurationInFrames: totalDuration,
    getCharTiming,
  };
};

/**
 * Calculates the exact style and transformation for an individual character at the current frame.
 * Includes performance early-exit optimization for large text.
 */
export const calculateCharacterRevealStyle = ({
  currentFrame,
  fps,
  totalChars,
  charIndex,
  variant = 'fade-slide-up',
  startFrame = 0,
  durationInFrames,
  staggerDelay = 1,
  characterDuration,
  exitFrame,
  exitDurationInFrames = MOTION.duration.fast,
  exitStaggerDelay,
  delay = 0,
  easing = 'easeOutCubic',
  springPreset = 'snappy',
  distance = 24,
  initialScale = 0.8,
  initialRotation = -15,
  initialBlur = 8,
  waveAmplitude = 24,
  reverse = false,
  direction = 'both',
}: CharacterRevealStyleOptions): CalculatedAnimatedStyle => {
  const timing = calculateCharacterRevealTiming(totalChars, {
    startFrame,
    delay,
    staggerDelay,
    characterDuration,
    durationInFrames,
    reverse,
  });

  const charTiming = timing.getCharTiming(charIndex);
  const effectiveStart = charTiming.charStartFrame;
  const effectiveDuration = charTiming.charDuration;

  // Exit calculation
  let charExitStart: number | undefined = undefined;
  if (typeof exitFrame === 'number') {
    const effectiveExitStagger = exitStaggerDelay ?? staggerDelay;
    const effectiveExitIndex = reverse ? totalChars - 1 - charIndex : charIndex;
    charExitStart = exitFrame + effectiveExitIndex * effectiveExitStagger;
  }

  // Performance optimization: fast early-exit when character is inactive
  const hasExit =
    direction !== 'in' &&
    typeof charExitStart === 'number' &&
    (direction === 'out' || charExitStart >= effectiveStart);

  const effectiveExitDuration = Math.max(0, exitDurationInFrames);

  // Before entrance: fully hidden
  if (direction !== 'out' && currentFrame < effectiveStart) {
    return { opacity: 0, visibility: 'hidden' };
  }

  // After exit: fully hidden
  if (hasExit && currentFrame >= (charExitStart as number) + effectiveExitDuration) {
    return { opacity: 0, visibility: 'hidden' };
  }

  // 1. If standard variant, reuse core calculateAnimatedTextStyle
  if (variant !== 'elastic' && variant !== 'wave') {
    return calculateAnimatedTextStyle({
      currentFrame,
      fps,
      variant,
      startFrame: effectiveStart,
      durationInFrames: effectiveDuration,
      exitFrame: charExitStart,
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
  }

  // 2. Specialized Variants: 'elastic' and 'wave'
  // Calculate entrance progress
  let inProgress = 0;
  if (direction === 'out') {
    inProgress = 1;
  } else if (effectiveDuration === 0) {
    inProgress = currentFrame >= effectiveStart ? 1 : 0;
  } else if (currentFrame >= effectiveStart + effectiveDuration) {
    inProgress = 1;
  } else {
    inProgress = interpolateValue({
      frame: currentFrame,
      inputRange: [effectiveStart, effectiveStart + effectiveDuration],
      outputRange: [0, 1],
      easing: resolveEasing(easing),
    });
  }

  // Calculate exit progress
  let outProgress = 0;
  if (hasExit && charExitStart !== undefined) {
    if (currentFrame < charExitStart) {
      outProgress = 0;
    } else if (effectiveExitDuration === 0) {
      outProgress = currentFrame >= charExitStart ? 1 : 0;
    } else if (currentFrame >= charExitStart + effectiveExitDuration) {
      outProgress = 1;
    } else {
      outProgress = interpolateValue({
        frame: currentFrame,
        inputRange: [charExitStart, charExitStart + effectiveExitDuration],
        outputRange: [0, 1],
        easing: resolveEasing(easing),
      });
    }
  }

  let calculatedOpacity = clamp((direction === 'out' ? 1 : inProgress) * (1 - outProgress), 0, 1);
  let calculatedTransform: string | undefined = undefined;

  if (variant === 'elastic') {
    // Underdamped spring oscillation with overshoot bounce
    const springVal = createSpring({
      frame: currentFrame,
      fps,
      delay: effectiveStart,
      config: {
        damping: 9,
        mass: 0.7,
        stiffness: 240,
      },
      from: 0,
      to: 1,
    });

    const currentY = (1 - springVal) * distance - outProgress * distance;
    const currentScale = Math.max(0, initialScale + (1 - initialScale) * springVal - outProgress * (1 - initialScale));
    calculatedTransform = `translateY(${currentY.toFixed(2)}px) scale(${currentScale.toFixed(3)})`;
    calculatedOpacity = clamp((direction === 'out' ? 1 : Math.min(1, springVal)) * (1 - outProgress), 0, 1);
  } else if (variant === 'wave') {
    // Undulating sinusoidal wave trajectory across staggered characters
    // During entrance (0..1), rises into a wave crest at progress ~ 0.5 then settles at 0
    const waveCrest = Math.sin(Math.PI * inProgress) * waveAmplitude;
    const currentY = (1 - inProgress) * distance - waveCrest - outProgress * distance;
    calculatedTransform = `translateY(${currentY.toFixed(2)}px)`;
  }

  return {
    opacity: Number(calculatedOpacity.toFixed(3)),
    transform: calculatedTransform,
    visibility: calculatedOpacity > 0 ? 'visible' : 'hidden',
  };
};
