/**
 * Typography Component Prop Types
 */

import React from 'react';
import { BaseMotionProps } from '../types';
import { EasingPresetName, EasingFunction } from '../../utils/animation/easing';
import { SpringPresetName } from '../../styles/motion';

export type AnimatedTextVariant =
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale'
  | 'pop'
  | 'blur'
  | 'rotate'
  | 'fade-slide-up';

export type WordRevealVariant = AnimatedTextVariant;

export type CharacterRevealVariant =
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale'
  | 'pop'
  | 'blur'
  | 'rotate'
  | 'fade-slide-up'
  | 'elastic'
  | 'wave';

export interface CharacterToken {
  id: string;
  char: string;
  isWhitespace: boolean;
  charIndex: number;
  wordIndex: number;
}

export interface WordGroup {
  id: string;
  wordText: string;
  characters: CharacterToken[];
  trailingSpace?: string;
}

export interface CharacterSegmentationResult {
  tokens: CharacterToken[];
  wordGroups: WordGroup[];
  totalAnimatableChars: number;
}

export interface CharacterRevealTiming {
  totalChars: number;
  charStartFrame: number;
  charDuration: number;
  charEndFrame: number;
  totalDurationInFrames: number;
}

export interface CharacterRevealProps {
  /** The text string to animate character by character */
  text: string;
  /** Animation preset variant (default: 'fade-slide-up') */
  variant?: CharacterRevealVariant;
  /** Frame at which the first character entrance begins (default: 0) */
  startFrame?: number;
  /** Total animation duration in frames. If provided without characterDuration, characterDuration is derived */
  durationInFrames?: number;
  /** Frame delay between each consecutive character reveal (default: 1) */
  staggerDelay?: number;
  /** Duration of animation for each individual character (default: 14) */
  characterDuration?: number;
  /** Optional frame at which exit animation starts */
  exitFrame?: number;
  /** Duration of exit animation per character in frames (default: 10) */
  exitDurationInFrames?: number;
  /** Frame delay between consecutive characters during exit (default: staggerDelay) */
  exitStaggerDelay?: number;
  /** Additional frame delay added to startFrame (default: 0) */
  delay?: number;
  /** Easing curve for interpolation (default: 'easeOutCubic') */
  easing?: EasingPresetName | EasingFunction;
  /** Spring physics preset when using spring-based variant 'pop' or 'elastic' (default: 'snappy') */
  springPreset?: SpringPresetName;
  /** Distance in pixels for translation and wave variants (default: 24) */
  distance?: number;
  /** Starting scale for scale and pop variants (default: 0.8) */
  initialScale?: number;
  /** Starting rotation in degrees for rotate variant (default: -15) */
  initialRotation?: number;
  /** Starting blur radius in pixels for blur variant (default: 8) */
  initialBlur?: number;
  /** Amplitude displacement in pixels for wave variant (default: 24) */
  waveAmplitude?: number;
  /** Frequency multiplier for wave variant (default: 0.4) */
  waveFrequency?: number;
  /** If true, characters animate in reverse sequence (last character reveals first; default: false) */
  reverse?: boolean;
  /** If true, reverses the visual rendering order of characters (default: false) */
  reverseVisualOrder?: boolean;
  /** Direction mode: 'in' (entrance only), 'out' (exit only), 'both' (entrance and exit) */
  direction?: 'in' | 'out' | 'both';
  /** Whether to preserve multiple consecutive spaces and newlines (default: true) */
  preserveWhitespace?: boolean;
  /** Whether whitespace characters are animated as visible characters (default: false) */
  animateSpaces?: boolean;
  /** Custom inline style overrides for the outer container */
  style?: React.CSSProperties;
  /** Custom inline style overrides for each character element, or a function returning styles per character */
  characterStyle?: React.CSSProperties | ((char: string, index: number) => React.CSSProperties);
  /** Custom CSS class name for the outer container */
  className?: string;
  /** Custom CSS class name for characters, or a function returning class per character */
  characterClassName?: string | ((char: string, index: number) => string);
  /** HTML tag to render as the container element (default: 'div') */
  as?: React.ElementType;
  /** Text alignment (default: 'left') */
  align?: 'left' | 'center' | 'right' | 'justify';
}

export interface CharacterRevealStyleOptions {
  currentFrame: number;
  fps: number;
  totalChars: number;
  charIndex: number;
  variant?: CharacterRevealVariant;
  startFrame?: number;
  durationInFrames?: number;
  staggerDelay?: number;
  characterDuration?: number;
  exitFrame?: number;
  exitDurationInFrames?: number;
  exitStaggerDelay?: number;
  delay?: number;
  easing?: EasingPresetName | EasingFunction;
  springPreset?: SpringPresetName;
  distance?: number;
  initialScale?: number;
  initialRotation?: number;
  initialBlur?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  reverse?: boolean;
  direction?: 'in' | 'out' | 'both';
}

export interface SegmentedWordToken {
  id: string;
  text: string;
  isWord: boolean;
  wordIndex: number;
}

export interface WordRevealTiming {
  totalWords: number;
  wordStartFrame: number;
  wordDuration: number;
  wordEndFrame: number;
  totalDurationInFrames: number;
}

export interface WordRevealProps {
  /** The text string to animate word by word */
  text: string;
  /** Animation preset variant (default: 'fade-slide-up') */
  variant?: WordRevealVariant;
  /** Frame at which the first word entrance begins (default: 0) */
  startFrame?: number;
  /** Total animation duration in frames. If provided without wordDuration, wordDuration is derived */
  durationInFrames?: number;
  /** Frame delay between each consecutive word reveal (default: 3) */
  staggerDelay?: number;
  /** Duration of animation for each individual word (default: 18) */
  wordDuration?: number;
  /** Optional frame at which exit animation starts */
  exitFrame?: number;
  /** Duration of exit animation per word in frames (default: 12) */
  exitDurationInFrames?: number;
  /** Frame delay between consecutive words during exit (default: staggerDelay) */
  exitStaggerDelay?: number;
  /** Additional frame delay added to startFrame (default: 0) */
  delay?: number;
  /** Easing curve for interpolation (default: 'easeOutCubic') */
  easing?: EasingPresetName | EasingFunction;
  /** Spring physics preset when using spring-based variant 'pop' (default: 'snappy') */
  springPreset?: SpringPresetName;
  /** Distance in pixels for translation variants (default: 30) */
  distance?: number;
  /** Starting scale for scale and pop variants (default: 0.85) */
  initialScale?: number;
  /** Starting rotation in degrees for rotate variant (default: -8) */
  initialRotation?: number;
  /** Starting blur radius in pixels for blur variant (default: 10) */
  initialBlur?: number;
  /** If true, words animate in reverse sequence (last word reveals first; default: false) */
  reverse?: boolean;
  /** If true, reverses the visual rendering order of words (default: false) */
  reverseVisualOrder?: boolean;
  /** Direction mode: 'in' (entrance only), 'out' (exit only), 'both' (entrance and exit) */
  direction?: 'in' | 'out' | 'both';
  /** Whether to preserve multiple consecutive spaces and newlines (default: true) */
  preserveWhitespace?: boolean;
  /** Custom separator string or regex to segment text (default: /\s+/) */
  separator?: string | RegExp;
  /** Custom inline style overrides for the outer container */
  style?: React.CSSProperties;
  /** Custom inline style overrides for each word element, or a function returning styles per word */
  wordStyle?: React.CSSProperties | ((word: string, index: number) => React.CSSProperties);
  /** Custom CSS class name for the outer container */
  className?: string;
  /** Custom CSS class name for words, or a function returning class per word */
  wordClassName?: string | ((word: string, index: number) => string);
  /** HTML tag to render as the container element (default: 'div') */
  as?: React.ElementType;
  /** Text alignment (default: 'left') */
  align?: 'left' | 'center' | 'right' | 'justify';
}

export interface WordRevealStyleOptions {
  currentFrame: number;
  fps: number;
  totalWords: number;
  wordIndex: number;
  variant?: WordRevealVariant;
  startFrame?: number;
  durationInFrames?: number;
  staggerDelay?: number;
  wordDuration?: number;
  exitFrame?: number;
  exitDurationInFrames?: number;
  exitStaggerDelay?: number;
  delay?: number;
  easing?: EasingPresetName | EasingFunction;
  springPreset?: SpringPresetName;
  distance?: number;
  initialScale?: number;
  initialRotation?: number;
  initialBlur?: number;
  reverse?: boolean;
  direction?: 'in' | 'out' | 'both';
}

export interface AnimatedTextProps {
  /** The text content or child elements to animate */
  children?: React.ReactNode;
  /** Animation preset variant (default: 'fade') */
  variant?: AnimatedTextVariant;
  /** Frame at which the entrance animation starts (default: 0) */
  startFrame?: number;
  /** Duration of entrance animation in frames (default: 18) */
  durationInFrames?: number;
  /** Frame at which exit animation starts (optional) */
  exitFrame?: number;
  /** Duration of exit animation in frames (default: 12) */
  exitDurationInFrames?: number;
  /** Additional frame delay added to startFrame (default: 0) */
  delay?: number;
  /** Easing curve for interpolation-based variants (default: 'easeOutCubic') */
  easing?: EasingPresetName | EasingFunction;
  /** Spring physics preset when using spring-based variant 'pop' (default: 'snappy') */
  springPreset?: SpringPresetName;
  /** Distance in pixels for slide and movement variants (default: 40) */
  distance?: number;
  /** Starting scale for scale and pop variants (default: 0.85) */
  initialScale?: number;
  /** Starting rotation in degrees for rotate variant (default: -8) */
  initialRotation?: number;
  /** Starting blur radius in pixels for blur variant (default: 10) */
  initialBlur?: number;
  /** Custom inline style overrides */
  style?: React.CSSProperties;
  /** Custom CSS class name */
  className?: string;
  /** HTML tag or React component to render as (default: 'div') */
  as?: React.ElementType;
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';
  /** Direction mode: 'in' (entrance only), 'out' (exit only), 'both' (entrance and exit) */
  direction?: 'in' | 'out' | 'both';
}

export interface AnimatedTextStyleOptions {
  currentFrame: number;
  fps: number;
  variant?: AnimatedTextVariant;
  startFrame?: number;
  durationInFrames?: number;
  exitFrame?: number;
  exitDurationInFrames?: number;
  delay?: number;
  easing?: EasingPresetName | EasingFunction;
  springPreset?: SpringPresetName;
  distance?: number;
  initialScale?: number;
  initialRotation?: number;
  initialBlur?: number;
  direction?: 'in' | 'out' | 'both';
}

export interface HeadlineProps extends BaseMotionProps {
  text: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4';
  color?: string;
  animate?: boolean;
}

export interface DisplayHeroProps extends BaseMotionProps {
  title: string;
  subtitle?: string;
  highlightWords?: string[];
  highlightColor?: string;
}

export interface AnimatedCounterProps extends BaseMotionProps {
  fromValue: number;
  toValue: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  color?: string;
}

export interface KineticTextProps extends BaseMotionProps {
  text: string;
  splitBy?: 'words' | 'characters' | 'lines';
  staggerFrames?: number;
}
