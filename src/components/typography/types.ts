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

export type TextMaskVariant =
  | 'bottom-reveal'
  | 'top-reveal'
  | 'left-reveal'
  | 'right-reveal'
  | 'center-reveal'
  | 'center-collapse'
  | 'vertical-wipe'
  | 'horizontal-wipe'
  | 'diagonal-wipe'
  | 'line-reveal'
  | 'mask-slide-up';

export type TextHighlightVariant =
  | 'background'
  | 'underline'
  | 'marker'
  | 'box'
  | 'circle'
  | 'strike'
  | 'gradient'
  | 'glow'
  | 'border-bottom'
  | 'bracket';

export type TextHighlightDirection = 'left-to-right' | 'right-to-left' | 'center';

export type SplitTextMode = 'line' | 'word' | 'character' | 'sentence' | 'custom';

export type SplitTextVariant =
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale'
  | 'pop'
  | 'rotate'
  | 'blur'
  | 'flip-up'
  | 'flip-down'
  | 'stagger'
  | 'wave'
  | 'random-stagger';

export interface SplitTextCustomSegment {
  text: string;
  id?: string;
  style?: React.CSSProperties;
  className?: string;
  duration?: number;
  delay?: number;
  [key: string]: unknown;
}

export interface SplitTextSegment {
  id: string;
  text: string;
  index: number;
  wordIndex?: number;
  lineIndex?: number;
  sentenceIndex?: number;
  trailingSpace?: string;
  isNewline?: boolean;
  customData?: Record<string, unknown>;
}

export interface SplitTextProps {
  /** Text string to split and animate */
  text?: string;
  /** Custom segments when splitBy is 'custom' */
  segments?: SplitTextCustomSegment[];
  /** Splitting strategy (default: 'word') */
  splitBy?: SplitTextMode;
  /** Animation preset variant (default: 'slide-up') */
  variant?: SplitTextVariant;
  /** Frame at which the animation sequence begins (default: 0) */
  startFrame?: number;
  /** Total animation duration in frames */
  durationInFrames?: number;
  /** Delay in frames between consecutive segments (default: 2) */
  staggerDelay?: number;
  /** Duration in frames for each individual segment animation (default: 16) */
  segmentDuration?: number;
  /** Frame at which exit animation starts (optional) */
  exitFrame?: number;
  /** Duration in frames for each segment exit animation (default: 12) */
  exitDurationInFrames?: number;
  /** Stagger delay between segments during exit */
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
  /** Starting rotation in degrees for rotate variant (default: -10) */
  initialRotation?: number;
  /** Starting blur radius in pixels for blur variant (default: 8) */
  initialBlur?: number;
  /** Whether to animate segments in reverse sequence (default: false) */
  reverse?: boolean;
  /** Direction mode: 'in' (entrance only), 'out' (exit only), 'both' (entrance and exit) */
  direction?: 'in' | 'out' | 'both';
  /** Deterministic seed for random-stagger variant (number or string, default: 42) */
  seed?: number | string;
  /** Custom inline style overrides for the outer container */
  style?: React.CSSProperties;
  /** Custom inline style overrides for each segment, or a function returning styles per segment */
  segmentStyle?: React.CSSProperties | ((segment: SplitTextSegment, index: number) => React.CSSProperties);
  /** Custom CSS class name for the outer container */
  className?: string;
  /** Custom CSS class name for segments, or a function returning class per segment */
  segmentClassName?: string | ((segment: SplitTextSegment, index: number) => string);
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';
  /** Whether to preserve multiple consecutive spaces and newlines (default: true) */
  preserveWhitespace?: boolean;
  /** HTML tag for the container (default: 'div') */
  as?: React.ElementType;
}

export interface SplitTextStyleOptions {
  currentFrame: number;
  fps: number;
  totalSegments: number;
  segmentIndex: number;
  variant?: SplitTextVariant;
  startFrame?: number;
  durationInFrames?: number;
  staggerDelay?: number;
  segmentDuration?: number;
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
  seed?: number | string;
  shuffledIndices?: number[];
}

export interface SplitTextTiming {
  segmentStartFrame: number;
  segmentEndFrame: number;
  segmentDuration: number;
  exitStartFrame?: number;
  exitEndFrame?: number;
  exitDuration?: number;
  totalDurationInFrames: number;
}

export interface TextSegment {
  text: string;
  highlighted?: boolean;
}

export interface TextHighlightProps {
  /** Optional React children to highlight */
  children?: React.ReactNode;
  /** Complete text string to render */
  text?: string;
  /** Targeted word, phrase, array of keywords, or regex to highlight within text */
  highlight?: string | string[] | RegExp;
  /** Structured array of text segments for explicit type-safe targeting */
  segments?: TextSegment[];
  /** Highlight emphasis variant (default: 'background') */
  variant?: TextHighlightVariant;
  /** Frame at which the highlight animation begins (default: 0) */
  startFrame?: number;
  /** Delay in frames before highlight begins (alias for startFrame) */
  delay?: number;
  /** Duration of highlight entrance animation in frames (default: 18) */
  durationInFrames?: number;
  /** Frame at which exit animation starts (optional) */
  exitFrame?: number;
  /** Duration of exit animation in frames (default: 12) */
  exitDurationInFrames?: number;
  /** Easing curve for interpolation (default: 'easeOutCubic') */
  easing?: EasingPresetName | EasingFunction;
  /** Primary accent color used for highlight */
  color?: string;
  /** Background highlight fill color (used for 'background', 'marker', 'gradient') */
  backgroundColor?: string;
  /** Border outline color (used for 'box', 'circle', 'bracket', 'border-bottom') */
  borderColor?: string;
  /** Stroke / underline / border thickness in pixels or string (default: 3) */
  thickness?: number | string;
  /** Padding around the highlighted text (default: '0.1em 0.3em') */
  padding?: number | string;
  /** Border radius for background, box, and marker highlights (default: 4) */
  borderRadius?: number | string;
  /** Vertical offset below baseline for underline and border-bottom (default: 2) */
  underlineOffset?: number | string;
  /** Custom width override for the highlight */
  highlightWidth?: number | string;
  /** Custom height override for the highlight */
  highlightHeight?: number | string;
  /** Reveal sweep direction (default: 'left-to-right') */
  direction?: 'left-to-right' | 'right-to-left' | 'center';
  /** Inverts reveal animation (default: false) */
  reverse?: boolean;
  /** Custom inline style overrides for the outer container */
  style?: React.CSSProperties;
  /** Custom inline style overrides for the highlighted span element */
  highlightStyle?: React.CSSProperties;
  /** Custom CSS class name for outer container */
  className?: string;
  /** Custom CSS class name for highlighted span */
  highlightClassName?: string;
  /** HTML tag for the container (default: 'span') */
  as?: React.ElementType;
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';
}

export interface TextHighlightStyleOptions {
  currentFrame: number;
  fps: number;
  variant?: TextHighlightVariant;
  startFrame?: number;
  durationInFrames?: number;
  exitFrame?: number;
  exitDurationInFrames?: number;
  easing?: EasingPresetName | EasingFunction;
  direction?: 'left-to-right' | 'right-to-left' | 'center';
  reverse?: boolean;
}

export interface CalculatedHighlightStyle {
  progress: number;
  outProgress: number;
  clipPath?: string;
  transform?: string;
  opacity: number;
  strokeDashoffset?: number;
  visibility: React.CSSProperties['visibility'];
}

export interface TextMaskProps {
  /** Optional React children to mask */
  children?: React.ReactNode;
  /** Optional plain text content to mask */
  text?: string;
  /** Animation preset variant (default: 'bottom-reveal') */
  variant?: TextMaskVariant;
  /** Frame at which the reveal animation starts (default: 0) */
  startFrame?: number;
  /** Delay in frames before reveal begins (alias for startFrame) */
  delay?: number;
  /** Duration of reveal animation in frames (default: 20) */
  durationInFrames?: number;
  /** Frame at which exit animation starts (optional) */
  exitFrame?: number;
  /** Duration of exit animation in frames (default: 14) */
  exitDurationInFrames?: number;
  /** Easing curve for interpolation (default: 'easeOutCubic') */
  easing?: EasingPresetName | EasingFunction;
  /** Direction mode: 'in' (entrance only), 'out' (exit only), 'both' (entrance and exit) */
  direction?: 'in' | 'out' | 'both';
  /** Distance or percentage offset for slide variants (default: '100%') */
  distance?: number | string;
  /** Frame delay between consecutive lines for 'line-reveal' (default: 4) */
  staggerDelay?: number;
  /** Animation duration per line for 'line-reveal' (default: 18) */
  lineDuration?: number;
  /** Inverts reveal direction (default: false) */
  reverse?: boolean;
  /** Container overflow setting (default: 'hidden') */
  overflow?: 'hidden' | 'visible';
  /** Color of optional overlay wipe block (optional) */
  maskColor?: string;
  /** When true, renders a dashed boundary around the clipping container for visual inspection */
  showMaskBounds?: boolean;
  /** Optional explicit array of text lines for 'line-reveal' */
  lines?: string[];
  /** Custom inline styles for the clipping container */
  style?: React.CSSProperties;
  /** Custom inline styles for the inner animated content */
  contentStyle?: React.CSSProperties;
  /** Custom CSS class name */
  className?: string;
  /** HTML tag for the container (default: 'div') */
  as?: React.ElementType;
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';
}

export interface TextMaskStyleOptions {
  currentFrame: number;
  fps: number;
  variant?: TextMaskVariant;
  startFrame?: number;
  durationInFrames?: number;
  exitFrame?: number;
  exitDurationInFrames?: number;
  easing?: EasingPresetName | EasingFunction;
  direction?: 'in' | 'out' | 'both';
  distance?: number | string;
  reverse?: boolean;
}

export interface CalculatedMaskStyle {
  clipPath?: string;
  transform?: string;
  opacity: number;
  visibility: React.CSSProperties['visibility'];
}

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
  /** Plain text string to animate (alternative or fallback to children) */
  text?: string;
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
