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
  /** Delay in frames before entrance begins (alias for startFrame) */
  delay?: number;
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
  /** Delay in frames before entrance begins (alias for startFrame) */
  delay?: number;
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
  /** Delay in frames before entrance begins (alias for startFrame) */
  delay?: number;
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

// ---------------------------------------------------------------------------
// AnimatedCard Types
// ---------------------------------------------------------------------------

export type AnimatedCardAnimation =
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale'
  | 'pop'
  | 'flip'
  | 'blur'
  | 'float'
  | 'expand'
  | 'collapse';

export type AnimatedCardVariant =
  | 'default'
  | 'outlined'
  | 'elevated'
  | 'flat'
  | 'image-card'
  | 'horizontal'
  | 'compact';

export type AnimatedCardState =
  | 'idle'
  | 'focused'
  | 'selected'
  | 'highlighted'
  | 'expanded'
  | 'collapsed'
  | 'disabled';

export type AnimatedCardSize = 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';

export interface AnimatedCardProps {
  /** Optional custom React children rendered inside the content area */
  children?: React.ReactNode;
  /** Primary card headline or title */
  title?: string | React.ReactNode;
  /** Secondary card description or body text */
  description?: string | React.ReactNode;
  /** Visual presentation style (default: 'default') */
  variant?: AnimatedCardVariant;
  /** Proportional size preset (default: 'md') */
  size?: AnimatedCardSize;
  /** Entrance animation variant (default: 'fade') */
  animation?: AnimatedCardAnimation;
  /** Starting frame for entrance animation (default: 0) */
  startFrame?: number;
  /** Duration in frames for entrance animation (default: 14) */
  durationInFrames?: number;
  /** Frame at which exit animation begins */
  exitFrame?: number;
  /** Duration in frames for exit animation (default: 12) */
  exitDurationInFrames?: number;
  /** Additional frame delay offset (e.g. for collection stagger) */
  delay?: number;
  /** Easing curve for transitions (default: 'easeOutCubic') */
  easing?: EasingPresetName | EasingFunction;
  /** Spring physics preset for pop / bounce animation (default: 'snappy') */
  springPreset?: SpringPresetName;
  /** Translation distance in pixels for slide/float animations (default: 24) */
  distance?: number;
  /** Initial scale factor for scale/pop/expand animations (default: 0.92) */
  initialScale?: number;
  /** Initial rotation in degrees for flip animations (default: 15) */
  initialRotation?: number;
  /** Explicit interaction state override */
  state?: AnimatedCardState;
  /** Frame at which focused state activates */
  focusFrame?: number;
  /** Frame at which selected state activates */
  selectFrame?: number;
  /** Frame at which highlighted state activates */
  highlightFrame?: number;
  /** Frame at which expanded state activates */
  expandFrame?: number;
  /** Frame at which collapsed state activates */
  collapseFrame?: number;
  /** Custom background color override */
  backgroundColor?: string;
  /** Custom border color override */
  borderColor?: string;
  /** Custom border radius override */
  borderRadius?: number | string;
  /** Custom box shadow override */
  shadow?: string;
  /** Custom padding override */
  padding?: number | string;
  /** Custom card width override */
  width?: number | string;
  /** Custom card height override */
  height?: number | string;
  /** Image URL or image element */
  image?: string | React.ReactNode;
  /** Image layout positioning (default: 'top') */
  imagePosition?: 'top' | 'left' | 'right' | 'bottom' | 'cover';
  /** Card icon element or Lucide icon */
  icon?: LucideIcon | React.ReactNode;
  /** Optional corner or header status badge */
  badge?: string | React.ReactNode;
  /** Background color for status badge */
  badgeColor?: string;
  /** Custom header element */
  header?: React.ReactNode;
  /** Custom footer element */
  footer?: React.ReactNode;
  /** Custom action element (e.g. CTA button) */
  action?: React.ReactNode;
  /** Outer container style overrides */
  style?: React.CSSProperties;
  /** Content area style overrides */
  contentStyle?: React.CSSProperties;
  /** Title typography style overrides */
  titleStyle?: React.CSSProperties;
  /** Description typography style overrides */
  descriptionStyle?: React.CSSProperties;
  /** CSS class name */
  className?: string;
}

// ---------------------------------------------------------------------------
// AnimatedNotification Types
// ---------------------------------------------------------------------------

export type AnimatedNotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'message'
  | 'custom';

export type AnimatedNotificationVariant =
  | 'toast'
  | 'banner'
  | 'floating'
  | 'compact'
  | 'card';

export type AnimatedNotificationPosition =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'center'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right';

export type AnimatedNotificationEntrance =
  | 'fade-in'
  | 'slide-down'
  | 'slide-up'
  | 'slide-left'
  | 'slide-right'
  | 'scale-in'
  | 'pop-in'
  | 'expand';

export type AnimatedNotificationExit =
  | 'fade-out'
  | 'slide-out'
  | 'scale-out'
  | 'collapse';

export interface AnimatedNotificationProps {
  /** Notification semantic category (default: 'info') */
  type?: AnimatedNotificationType;
  /** Visual presentation style (default: 'toast') */
  variant?: AnimatedNotificationVariant;
  /** Primary headline or title text */
  title?: string | React.ReactNode;
  /** Secondary body description */
  description?: string | React.ReactNode;
  /** Custom icon or Lucide icon */
  icon?: LucideIcon | React.ReactNode;
  /** Timestamp string (e.g. 'Just now', '2m ago') */
  timestamp?: string;
  /** Text label for optional action button */
  actionLabel?: string;
  /** Optional custom action node or CTA */
  action?: React.ReactNode;
  /** Starting frame for entrance animation (default: 0) */
  startFrame?: number;
  /** Delay in frames before entrance begins (alias for startFrame) */
  delay?: number;
  /** Duration in frames for entrance animation (default: 12) */
  durationInFrames?: number;
  /** Display duration before exit animation begins (default: 50) */
  displayDuration?: number;
  /** Explicit frame at which exit begins (overrides startFrame + displayDuration) */
  exitFrame?: number;
  /** Duration in frames for exit animation (default: 12) */
  exitDurationInFrames?: number;
  /** Entrance animation variant (default: 'slide-down') */
  entranceVariant?: AnimatedNotificationEntrance;
  /** Exit animation variant (default: 'fade-out') */
  exitVariant?: AnimatedNotificationExit;
  /** Canvas relative position preset (default: 'top-right') */
  position?: AnimatedNotificationPosition;
  /** Custom width override */
  width?: number | string;
  /** Custom background color override */
  backgroundColor?: string;
  /** Custom text color override */
  textColor?: string;
  /** Custom accent highlight color override */
  accentColor?: string;
  /** Custom border radius override */
  borderRadius?: number | string;
  /** Whether to show close icon button (default: true) */
  showCloseButton?: boolean;
  /** Whether to show linear progress indicator (default: true) */
  showProgress?: boolean;
  /** Total frame duration for progress bar completion (defaults to display duration) */
  progressDuration?: number;
  /** Custom style for the notification container */
  style?: React.CSSProperties;
  /** Custom style for content area */
  contentStyle?: React.CSSProperties;
  /** CSS class name */
  className?: string;
}

// ---------------------------------------------------------------------------
// AnimatedToggle Types
// ---------------------------------------------------------------------------

export type AnimatedToggleVisualVariant =
  | 'default'
  | 'minimal'
  | 'outlined'
  | 'filled'
  | 'labeled';

export type AnimatedToggleAnimationVariant =
  | 'slide'
  | 'scale'
  | 'spring'
  | 'elastic'
  | 'fade'
  | 'color-transition'
  | 'combined';

export type AnimatedToggleVariant =
  | AnimatedToggleVisualVariant
  | AnimatedToggleAnimationVariant;

export type AnimatedToggleSize =
  | 'small'
  | 'medium'
  | 'large'
  | 'sm'
  | 'md'
  | 'lg';

export type AnimatedToggleState = 'off' | 'on' | 'disabled' | 'loading';

export interface ToggleSizeMetrics {
  trackWidth: number;
  trackHeight: number;
  thumbSize: number;
  padding: number;
  travelDistance: number;
  fontSize: number;
  labelGap: number;
  iconSize: number;
}

export interface AnimatedToggleProps {
  /** Target or active checked state. When toggleFrame is set, switches to this state */
  checked?: boolean;
  /** Initial checked state prior to toggleFrame */
  defaultChecked?: boolean;
  /** Starting baseline frame (default: 0) */
  startFrame?: number;
  /** Delay in frames before entrance begins (alias for startFrame) */
  delay?: number;
  /** Frame at which toggle transition occurs */
  toggleFrame?: number;
  /** Duration in frames for transition animation (default: 12) */
  durationInFrames?: number;
  /** Visual presentation style or animation variant shorthand (default: 'default') */
  variant?: AnimatedToggleVariant;
  /** Explicit visual variant */
  visualVariant?: AnimatedToggleVisualVariant;
  /** Explicit animation behavior variant (default: 'combined') */
  animationVariant?: AnimatedToggleAnimationVariant;
  /** Size preset (default: 'medium') */
  size?: AnimatedToggleSize;
  /** Explicit interaction state override */
  state?: AnimatedToggleState;
  /** Custom easing function or preset name */
  easing?: EasingPresetName | EasingFunction;
  /** Spring preset key */
  springPreset?: SpringPresetName;
  /** Track color when toggle is ON (default: emerald #0E8345) */
  onColor?: string;
  /** Track color when toggle is OFF (default: surface3 #2E2E33) */
  offColor?: string;
  /** Thumb color (default: #FFFFFF) */
  thumbColor?: string;
  /** Thumb color when toggle is ON (defaults to thumbColor) */
  thumbOnColor?: string;
  /** Disabled track/thumb color */
  disabledColor?: string;
  /** Custom border radius override */
  borderRadius?: number | string;
  /** Custom track width override */
  trackWidth?: number;
  /** Custom track height override */
  trackHeight?: number;
  /** Custom thumb size override */
  thumbSize?: number;
  /** Whether to show text label (default: true if label is provided) */
  showLabel?: boolean;
  /** Text label displayed inside or beside track when ON (default: 'ON') */
  onLabel?: string;
  /** Text label displayed inside or beside track when OFF (default: 'OFF') */
  offLabel?: string;
  /** Primary label text */
  label?: string | React.ReactNode;
  /** Secondary description text */
  description?: string | React.ReactNode;
  /** Leading icon placed before label or track */
  leadingIcon?: LucideIcon | React.ReactNode;
  /** Position of the external label relative to toggle track ('left' | 'right', default: 'right') */
  labelPosition?: 'left' | 'right';
  /** Outer container style overrides */
  style?: React.CSSProperties;
  /** Track style overrides */
  trackStyle?: React.CSSProperties;
  /** Thumb style overrides */
  thumbStyle?: React.CSSProperties;
  /** Label typography style overrides */
  labelStyle?: React.CSSProperties;
  /** Description typography style overrides */
  descriptionStyle?: React.CSSProperties;
  /** CSS class name */
  className?: string;
}

// ---------------------------------------------------------------------------
// AnimatedCheckbox Types
// ---------------------------------------------------------------------------

export type AnimatedCheckboxVisualVariant =
  | 'default'
  | 'rounded'
  | 'square'
  | 'filled'
  | 'outlined'
  | 'minimal';

export type AnimatedCheckboxAnimationVariant =
  | 'scale'
  | 'pop'
  | 'check-draw'
  | 'fill'
  | 'border'
  | 'fade'
  | 'bounce'
  | 'combined';

export type AnimatedCheckboxVariant =
  | AnimatedCheckboxVisualVariant
  | AnimatedCheckboxAnimationVariant;

export type AnimatedCheckboxSize =
  | 'small'
  | 'medium'
  | 'large'
  | 'sm'
  | 'md'
  | 'lg';

export type AnimatedCheckboxState =
  | 'unchecked'
  | 'checked'
  | 'indeterminate'
  | 'disabled'
  | 'error';

export interface CheckboxSizeMetrics {
  boxSize: number;
  borderRadius: number | string;
  strokeWidth: number;
  fontSize: number;
  labelGap: number;
  iconSize: number;
}

export interface AnimatedCheckboxProps {
  /** Target or active checked state. Switches to this state at checkFrame */
  checked?: boolean;
  /** Initial checked state prior to checkFrame */
  defaultChecked?: boolean;
  /** Whether the checkbox is in an indeterminate state */
  indeterminate?: boolean;
  /** Starting baseline frame (default: 0) */
  startFrame?: number;
  /** Delay in frames before entrance begins (alias for startFrame) */
  delay?: number;
  /** Frame at which checkbox state transition occurs */
  checkFrame?: number;
  /** Duration in frames for the transition animation (default: 12) */
  durationInFrames?: number;
  /** Visual presentation style or animation variant shorthand (default: 'default') */
  variant?: AnimatedCheckboxVariant;
  /** Explicit visual styling variant */
  visualVariant?: AnimatedCheckboxVisualVariant;
  /** Explicit animation behavior variant (default: 'combined') */
  animationVariant?: AnimatedCheckboxAnimationVariant;
  /** Size preset (default: 'medium') */
  size?: AnimatedCheckboxSize;
  /** Explicit interaction state override */
  state?: AnimatedCheckboxState;
  /** Custom easing function or preset name */
  easing?: EasingPresetName | EasingFunction;
  /** Spring preset key */
  springPreset?: SpringPresetName;
  /** Checkmark stroke color (default: #FFFFFF) */
  checkColor?: string;
  /** Background color when unchecked */
  uncheckedColor?: string;
  /** Background color when checked (default: emerald #0E8345) */
  checkedColor?: string;
  /** Border color when unchecked */
  borderColor?: string;
  /** Border color when checked */
  checkedBorderColor?: string;
  /** Disabled color */
  disabledColor?: string;
  /** Error color (default: crimson #E11900) */
  errorColor?: string;
  /** Primary label text */
  label?: string | React.ReactNode;
  /** Secondary description text */
  description?: string | React.ReactNode;
  /** Whether to show text label (default: true if label is provided) */
  showLabel?: boolean;
  /** Whether to show description text (default: true if description is provided) */
  showDescription?: boolean;
  /** Custom border radius override */
  borderRadius?: number | string;
  /** Custom box size override */
  boxSize?: number;
  /** Leading icon placed before label or box */
  leadingIcon?: LucideIcon | React.ReactNode;
  /** Position of the external label relative to checkbox ('left' | 'right', default: 'right') */
  labelPosition?: 'left' | 'right';
  /** Optional custom content rendered inside the checkbox box */
  children?: React.ReactNode;
  /** Outer container style overrides */
  style?: React.CSSProperties;
  /** Checkbox box style overrides */
  boxStyle?: React.CSSProperties;
  /** Checkmark SVG path style overrides */
  checkmarkStyle?: React.CSSProperties;
  /** Label typography style overrides */
  labelStyle?: React.CSSProperties;
  /** Description typography style overrides */
  descriptionStyle?: React.CSSProperties;
  /** CSS class name */
  className?: string;
}




