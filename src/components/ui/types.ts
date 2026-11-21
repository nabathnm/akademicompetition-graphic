/**
 * UI Component Prop Types
 */

import { LucideIcon } from 'lucide-react';
import { BaseMotionProps } from '../types';
import { EasingPresetName, EasingFunction } from '../../utils/animation/easing';
import { SpringPresetName } from '../../styles/motion';

export interface BadgeProps extends BaseMotionProps {
  label: string;
  variant?: 'brand' | 'success' | 'warning' | 'neutral';
  icon?: LucideIcon;
}

export interface ButtonProps extends BaseMotionProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'glass';
  icon?: LucideIcon;
}

export interface MetricCardProps extends BaseMotionProps {
  label: string;
  value: string | number;
  changePercent?: number;
  icon?: LucideIcon;
}

export interface ProgressBarProps extends BaseMotionProps {
  progress: number; // 0 to 1
  color?: string;
  trackColor?: string;
  height?: number;
}

export type AnimatedInputState =
  | 'idle'
  | 'focus'
  | 'typing'
  | 'filled'
  | 'submitted'
  | 'error'
  | 'disabled';

export type AnimatedInputVariant =
  | 'outlined'
  | 'filled'
  | 'minimal'
  | 'underline'
  | 'rounded';

export type AnimatedInputSize = 'sm' | 'md' | 'lg';

export type AnimatedInputEntrance = 'fade' | 'slide-up' | 'scale-in' | 'none';

export interface AnimatedInputProps {
  /** The target string to type */
  value?: string;
  /** Placeholder text shown when input is empty */
  placeholder?: string;
  /** Optional field label positioned above the input */
  label?: string;
  /** Optional helper text or error message displayed below the input */
  helperText?: string;
  /** Starting frame for the component entrance animation (default: 0) */
  startFrame?: number;
  /** Frame at which input acquires focus (default: 10) */
  focusFrame?: number;
  /** Frame at which character typing begins (default: 16) */
  typingStartFrame?: number;
  /** Frames per character typed (default: 2) */
  typingSpeed?: number;
  /** Number of characters revealed per typing step (default: 1) */
  charactersPerStep?: number;
  /** Optional frame at which text deletion begins */
  deleteStartFrame?: number;
  /** Optional frame at which input transitions to submitted state */
  submittedFrame?: number;
  /** Optional frame at which input transitions to error state */
  errorFrame?: number;
  /** Visual presentation variant (default: 'outlined') */
  variant?: AnimatedInputVariant;
  /** Input size preset (default: 'md') */
  size?: AnimatedInputSize;
  /** Forced interaction state. If omitted, state is determined by currentFrame */
  state?: AnimatedInputState;
  /** Whether to show the blinking text cursor (default: true) */
  showCursor?: boolean;
  /** Frames per cursor blink half-cycle (default: 16) */
  cursorBlinkInterval?: number;
  /** Whether to show leading icon (default: false) */
  showLeadingIcon?: boolean;
  /** Whether to show trailing icon (default: false) */
  showTrailingIcon?: boolean;
  /** Leading icon component or element */
  leadingIcon?: LucideIcon | React.ReactNode;
  /** Trailing icon component or element */
  trailingIcon?: LucideIcon | React.ReactNode;
  /** Border & ring color when focused (default: '#00D1FF') */
  focusColor?: string;
  /** Accent color in error state (default: '#E11900') */
  errorColor?: string;
  /** Accent color in submitted / success state (default: '#0E8345') */
  successColor?: string;
  /** Container border radius override */
  borderRadius?: number | string;
  /** Container padding override */
  padding?: string | number;
  /** Container width override (default: '100%') */
  width?: string | number;
  /** Container height override */
  height?: string | number;
  /** Entrance animation preset (default: 'slide-up') */
  entrance?: AnimatedInputEntrance;
  /** Duration of entrance animation in frames (default: 14) */
  entranceDuration?: number;
  /** Container style overrides */
  style?: React.CSSProperties;
  /** Input field text style overrides */
  inputStyle?: React.CSSProperties;
  /** Blinking cursor style overrides */
  cursorStyle?: React.CSSProperties;
  /** Placeholder style overrides */
  placeholderStyle?: React.CSSProperties;
  /** Label style overrides */
  labelStyle?: React.CSSProperties;
  /** Helper text style overrides */
  helperTextStyle?: React.CSSProperties;
  /** Container CSS class name */
  className?: string;
}

export type AnimatedButtonState =
  | 'idle'
  | 'hover'
  | 'pressed'
  | 'released'
  | 'loading'
  | 'success'
  | 'error'
  | 'disabled';

export type AnimatedButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'text'
  | 'icon-only';

export type AnimatedButtonSize = 'small' | 'medium' | 'large' | 'sm' | 'md' | 'lg';

export type AnimatedButtonEntrance =
  | 'fade-in'
  | 'slide-up'
  | 'scale-in'
  | 'pop-in'
  | 'none';

export type AnimatedButtonExit =
  | 'fade-out'
  | 'slide-out'
  | 'scale-out'
  | 'none';

export interface AnimatedButtonProps {
  /** Optional React children (overrides or complements label) */
  children?: React.ReactNode;
  /** Primary text label for the button */
  label?: string;
  /** Visual presentation style (default: 'primary') */
  variant?: AnimatedButtonVariant;
  /** Button dimensions and padding preset (default: 'medium') */
  size?: AnimatedButtonSize;
  /** Forced interaction state. If omitted, state is derived dynamically by frame timeline */
  state?: AnimatedButtonState;
  /** Starting frame for entrance animation (default: 0) */
  startFrame?: number;
  /** Total animation duration in frames (optional) */
  durationInFrames?: number;
  /** Frame at which hover interaction begins */
  hoverFrame?: number;
  /** Frame at which press interaction begins */
  pressFrame?: number;
  /** Frame at which press interaction is released */
  releaseFrame?: number;
  /** Frame at which loading state begins */
  loadingStartFrame?: number;
  /** Frame at which success state begins */
  successFrame?: number;
  /** Frame at which error state begins */
  errorFrame?: number;
  /** Frame at which exit animation begins */
  exitFrame?: number;
  /** Exit animation duration in frames (default: 12) */
  exitDurationInFrames?: number;
  /** Entrance animation preset (default: 'scale-in') */
  entrance?: AnimatedButtonEntrance;
  /** Duration of entrance animation in frames (default: 12) */
  entranceDuration?: number;
  /** Exit animation preset (default: 'none') */
  exit?: AnimatedButtonExit;
  /** Spring physics preset for pop and press release settle (default: 'snappy') */
  springPreset?: SpringPresetName;
  /** Easing curve for transitions (default: 'easeOutCubic') */
  easing?: EasingPresetName | EasingFunction;
  /** Scale compression factor when button is pressed (default: 0.94) */
  scaleOnPress?: number;
  /** Background color override */
  backgroundColor?: string;
  /** Text and icon color override */
  textColor?: string;
  /** Border color override */
  borderColor?: string;
  /** Border radius override */
  borderRadius?: number | string;
  /** Padding override */
  padding?: string | number;
  /** Width override (e.g. '100%', 200, 'auto') */
  width?: string | number;
  /** Height override */
  height?: string | number;
  /** Optional primary icon (used in icon-only or as default leading icon) */
  icon?: LucideIcon | React.ReactNode;
  /** Optional leading icon (component or element) */
  leadingIcon?: LucideIcon | React.ReactNode;
  /** Whether to show leading icon (default: true if leadingIcon is provided) */
  showLeadingIcon?: boolean;
  /** Optional trailing icon (component or element) */
  trailingIcon?: LucideIcon | React.ReactNode;
  /** Whether to show trailing icon (default: true if trailingIcon is provided) */
  showTrailingIcon?: boolean;
  /** Label displayed when in loading state (default: 'Loading...') */
  loadingLabel?: string;
  /** Label displayed when in success state */
  successLabel?: string;
  /** Label displayed when in error state */
  errorLabel?: string;
  /** Whether to show spinning loader during loading state (default: true) */
  showSpinner?: boolean;
  /** Optional notification / count badge text or element */
  badge?: string | number | React.ReactNode;
  /** Outer container style overrides */
  style?: React.CSSProperties;
  /** Label typography style overrides */
  labelStyle?: React.CSSProperties;
  /** CSS class name */
  className?: string;
}

// ---------------------------------------------------------------------------
// AnimatedSearchBar Types
// ---------------------------------------------------------------------------

export interface SearchSuggestion {
  id: string | number;
  text: string;
  category?: string;
  icon?: LucideIcon | React.ReactNode;
}

export interface SearchResult {
  id: string | number;
  title: string;
  description?: string;
  category?: string;
  badge?: string;
  icon?: LucideIcon | React.ReactNode;
  metadata?: string;
}

export type AnimatedSearchBarVariant =
  | 'minimal'
  | 'outlined'
  | 'filled'
  | 'rounded'
  | 'expanded';

export type AnimatedSearchBarSize = 'sm' | 'md' | 'lg';

export type AnimatedSearchBarContainerEntrance =
  | 'fade-in'
  | 'slide-in'
  | 'expand-width'
  | 'scale-in'
  | 'none';

export type AnimatedSearchBarStage =
  | 'idle'
  | 'focus'
  | 'typing'
  | 'suggestions'
  | 'selected'
  | 'submitted'
  | 'loading'
  | 'results';

export interface AnimatedSearchBarProps {
  /** Target text string to type into the search bar */
  value?: string;
  /** Placeholder text shown when input is empty (default: 'Search...') */
  placeholder?: string;
  /** List of static search suggestions */
  suggestions?: SearchSuggestion[];
  /** List of static search results */
  results?: SearchResult[];
  /** Starting frame for container entrance animation (default: 0) */
  startFrame?: number;
  /** Frame at which search input acquires focus (default: 10) */
  focusFrame?: number;
  /** Frame at which character typing begins (default: 16) */
  typingStartFrame?: number;
  /** Frame at which suggestions dropdown appears (default: 28) */
  suggestionStartFrame?: number;
  /** Frame at which suggestion item is highlighted/selected (default: 48) */
  selectionFrame?: number;
  /** Index of suggestion to highlight/select (default: 0) */
  selectedIndex?: number;
  /** Frame at which search query is submitted (default: 60) */
  submitFrame?: number;
  /** Frame at which loading indicator activates (default: 64) */
  loadingStartFrame?: number;
  /** Frame at which search results stagger in (default: 80) */
  resultsStartFrame?: number;
  /** Frames per character during typing simulation (default: 2) */
  typingSpeed?: number;
  /** Frame offset between consecutive suggestions and results (default: 3) */
  staggerDelay?: number;
  /** Visual presentation variant (default: 'outlined') */
  variant?: AnimatedSearchBarVariant;
  /** Size preset (default: 'md') */
  size?: AnimatedSearchBarSize;
  /** Container entrance animation preset (default: 'fade-in') */
  containerEntrance?: AnimatedSearchBarContainerEntrance;
  /** Duration of container entrance in frames (default: 12) */
  entranceDuration?: number;
  /** Whether to show clear button icon when text is entered (default: true) */
  showClearButton?: boolean;
  /** Whether to display suggestions dropdown (default: true) */
  showSuggestions?: boolean;
  /** Whether to display results area (default: true) */
  showResults?: boolean;
  /** Whether to display submit button (default: true) */
  showSubmitButton?: boolean;
  /** Custom leading search icon */
  searchIcon?: LucideIcon | React.ReactNode;
  /** Label for submit button (default: 'Search') */
  submitLabel?: string;
  /** Message displayed when results list is empty */
  emptyResultsMessage?: string;
  /** Overall container width (default: '100%') */
  width?: string | number;
  /** Overall container max-width (default: 640) */
  maxWidth?: string | number;
  /** Custom styles for outer container */
  style?: React.CSSProperties;
  /** Custom styles for inner input */
  inputStyle?: React.CSSProperties;
  /** Custom styles for suggestion items */
  suggestionStyle?: React.CSSProperties;
  /** Custom styles for result cards */
  resultStyle?: React.CSSProperties;
  /** CSS class name */
  className?: string;
}


