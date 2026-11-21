/**
 * AnimatedCheckbox Style & Motion Calculations
 * Pure mathematical functions determining checkbox size metrics, state resolution,
 * deterministic SVG checkmark stroke dash offsets, color blending, and layout styles.
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { interpolateColors } from 'remotion';
import type {
  AnimatedCheckboxVisualVariant,
  AnimatedCheckboxAnimationVariant,
  AnimatedCheckboxVariant,
  AnimatedCheckboxSize,
  AnimatedCheckboxState,
  CheckboxSizeMetrics,
} from './types.ts';
import { Colors } from '../../styles/colors.ts';
import { Spacing } from '../../styles/spacing.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { resolveEasing, easeInOutCubic, easeOutCubic } from '../../utils/animation/easing.ts';
import type { EasingPresetName, EasingFunction } from '../../utils/animation/easing.ts';
import { createSpring } from '../../utils/animation/spring.ts';
import type { SpringPresetName } from '../../styles/motion.ts';

const CHECKBOX_ANIMATION_VARIANTS: ReadonlyArray<AnimatedCheckboxAnimationVariant> = [
  'scale',
  'pop',
  'check-draw',
  'fill',
  'border',
  'fade',
  'bounce',
  'combined',
];

const CHECKBOX_VISUAL_VARIANTS: ReadonlyArray<AnimatedCheckboxVisualVariant> = [
  'default',
  'rounded',
  'square',
  'filled',
  'outlined',
  'minimal',
];

export const CHECKMARK_PATH = 'M 5 12.5 L 9.5 17 L 19 7.5';
export const CHECKMARK_TOTAL_LENGTH = 24;

export const INDETERMINATE_PATH = 'M 6 12 L 18 12';
export const INDETERMINATE_TOTAL_LENGTH = 12;

/**
 * Resolves visual variant from variant prop shorthand or explicit visualVariant.
 */
export function resolveCheckboxVisualVariant(
  variant?: AnimatedCheckboxVariant,
  visualVariant?: AnimatedCheckboxVisualVariant
): AnimatedCheckboxVisualVariant {
  if (visualVariant) return visualVariant;
  if (variant && (CHECKBOX_VISUAL_VARIANTS as readonly string[]).includes(variant)) {
    return variant as AnimatedCheckboxVisualVariant;
  }
  return 'default';
}

/**
 * Resolves animation variant from variant prop shorthand or explicit animationVariant.
 */
export function resolveCheckboxAnimationVariant(
  variant?: AnimatedCheckboxVariant,
  animationVariant?: AnimatedCheckboxAnimationVariant
): AnimatedCheckboxAnimationVariant {
  if (animationVariant) return animationVariant;
  if (variant && (CHECKBOX_ANIMATION_VARIANTS as readonly string[]).includes(variant)) {
    return variant as AnimatedCheckboxAnimationVariant;
  }
  return 'combined';
}

/**
 * Normalizes size preset and computes proportional layout metrics.
 */
export function resolveCheckboxSize(
  size: AnimatedCheckboxSize = 'medium',
  visualVariant: AnimatedCheckboxVisualVariant = 'default',
  customBoxSize?: number,
  customRadius?: number | string
): CheckboxSizeMetrics {
  const normalized = size === 'sm' || size === 'small'
    ? 'small'
    : size === 'lg' || size === 'large'
      ? 'large'
      : 'medium';

  let boxSize = 24;
  let borderRadius: number | string = 6;
  let strokeWidth = 3.0;
  let fontSize = 14;
  let labelGap = 10;
  let iconSize = 16;

  if (normalized === 'small') {
    boxSize = 18;
    borderRadius = 4;
    strokeWidth = 2.6;
    fontSize = 12;
    labelGap = 8;
    iconSize = 14;
  } else if (normalized === 'large') {
    boxSize = 32;
    borderRadius = 8;
    strokeWidth = 3.5;
    fontSize = 16;
    labelGap = 12;
    iconSize = 20;
  }

  if (visualVariant === 'rounded') {
    borderRadius = Spacing.radius.full;
  } else if (visualVariant === 'square') {
    borderRadius = 2;
  }

  return {
    boxSize: customBoxSize ?? boxSize,
    borderRadius: customRadius ?? borderRadius,
    strokeWidth,
    fontSize,
    labelGap,
    iconSize,
  };
}

export interface CheckboxMotionOptions {
  currentFrame: number;
  fps?: number;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  startFrame?: number;
  checkFrame?: number;
  durationInFrames?: number;
  animationVariant?: AnimatedCheckboxAnimationVariant;
  springPreset?: SpringPresetName;
  easing?: EasingPresetName | EasingFunction;
  state?: AnimatedCheckboxState;
}

export interface CheckboxMotionResult {
  /** Normalized progress from 0 (unchecked) to 1 (checked/indeterminate) */
  progress: number;
  /** Clamped progress between 0 and 1 */
  clampedProgress: number;
  /** Normalized checkmark progressive drawing (0 = hidden, 1 = fully drawn) */
  checkDrawProgress: number;
  /** Visual scale multiplier of the checkbox container */
  scale: number;
  /** Logical effective state */
  effectiveChecked: boolean;
  /** Whether the checkbox is actively in an indeterminate state */
  effectiveIndeterminate: boolean;
  /** Whether the checkbox is currently transitioning */
  isTransitioning: boolean;
  /** Attention shake horizontal pixel displacement for error state */
  errorShakeX: number;
  /** Checkmark alpha opacity */
  checkmarkOpacity: number;
}

/**
 * Evaluates frame-based checkbox motion, progressive stroke drawing, and spring feedback.
 */
export function calculateCheckboxMotion({
  currentFrame,
  fps = 30,
  checked,
  defaultChecked,
  indeterminate,
  checkFrame,
  durationInFrames = 12,
  animationVariant = 'combined',
  springPreset = 'snappy',
  easing = 'easeInOutCubic',
  state,
}: CheckboxMotionOptions): CheckboxMotionResult {
  const isIndeterminateExplicit = state === 'indeterminate' || Boolean(indeterminate);
  const isDisabled = state === 'disabled';
  const isError = state === 'error';

  // Static state if checkFrame is not specified or non-interactive state
  if (checkFrame === undefined || isDisabled) {
    const isTargetChecked = state === 'checked' ? true : state === 'unchecked' ? false : (checked ?? defaultChecked ?? false);
    const progress = isTargetChecked || isIndeterminateExplicit ? 1 : 0;
    const errorShakeX = isError ? Math.sin(currentFrame * 1.5) * 3 : 0;

    return {
      progress,
      clampedProgress: progress,
      checkDrawProgress: progress,
      scale: 1,
      effectiveChecked: isTargetChecked,
      effectiveIndeterminate: isIndeterminateExplicit,
      isTransitioning: false,
      errorShakeX,
      checkmarkOpacity: progress,
    };
  }

  // Determine transition endpoints
  const initialChecked = defaultChecked !== undefined
    ? defaultChecked
    : checked !== undefined && checkFrame !== undefined
      ? !checked
      : (checked ?? false);

  const targetChecked = checked !== undefined
    ? checked
    : !initialChecked;

  const fromVal = initialChecked ? 1 : 0;
  const toVal = targetChecked ? 1 : 0;

  // Pre-transition state
  if (currentFrame < checkFrame) {
    const errorShakeX = isError ? Math.sin(currentFrame * 1.5) * 3 : 0;
    return {
      progress: fromVal,
      clampedProgress: fromVal,
      checkDrawProgress: fromVal,
      scale: 1,
      effectiveChecked: initialChecked,
      effectiveIndeterminate: isIndeterminateExplicit,
      isTransitioning: false,
      errorShakeX,
      checkmarkOpacity: fromVal,
    };
  }

  // Active transition
  const elapsed = currentFrame - checkFrame;
  const duration = Math.max(1, durationInFrames);
  const normLinear = clamp(elapsed / duration, 0, 1);
  const isTransitioning = elapsed >= 0 && elapsed <= duration * 1.5;

  let progress = toVal;
  let checkDrawProgress = toVal;
  let scale = 1;
  let checkmarkOpacity = 1;

  switch (animationVariant) {
    case 'check-draw': {
      const drawFactor = easeOutCubic(normLinear);
      progress = fromVal + (toVal - fromVal) * normLinear;
      checkDrawProgress = fromVal + (toVal - fromVal) * drawFactor;
      checkmarkOpacity = checkDrawProgress > 0 ? 1 : 0;
      break;
    }
    case 'scale': {
      const factor = easeOutCubic(normLinear);
      progress = fromVal + (toVal - fromVal) * factor;
      checkDrawProgress = progress;
      scale = 1 + Math.sin(normLinear * Math.PI) * 0.16;
      checkmarkOpacity = checkDrawProgress;
      break;
    }
    case 'pop': {
      const springVal = createSpring({
        frame: currentFrame,
        fps,
        delay: checkFrame,
        preset: 'bouncy',
        from: 0,
        to: 1,
      });
      progress = fromVal + (toVal - fromVal) * springVal;
      checkDrawProgress = clamp(fromVal + (toVal - fromVal) * easeOutCubic(normLinear), 0, 1);
      scale = 1 + Math.sin(normLinear * Math.PI) * 0.22;
      checkmarkOpacity = checkDrawProgress;
      break;
    }
    case 'fill': {
      const easingFn = resolveEasing(easing) ?? easeInOutCubic;
      const factor = easingFn(normLinear);
      progress = fromVal + (toVal - fromVal) * factor;
      checkDrawProgress = progress;
      checkmarkOpacity = progress;
      break;
    }
    case 'border': {
      const factor = easeOutCubic(normLinear);
      progress = fromVal + (toVal - fromVal) * factor;
      checkDrawProgress = progress;
      checkmarkOpacity = progress;
      break;
    }
    case 'fade': {
      const factor = easeInOutCubic(normLinear);
      progress = fromVal + (toVal - fromVal) * factor;
      checkDrawProgress = toVal; // Full path, fade opacity
      checkmarkOpacity = fromVal + (toVal - fromVal) * factor;
      break;
    }
    case 'bounce': {
      const springVal = createSpring({
        frame: currentFrame,
        fps,
        delay: checkFrame,
        preset: springPreset,
        from: 0,
        to: 1,
      });
      progress = fromVal + (toVal - fromVal) * springVal;
      checkDrawProgress = clamp(progress, 0, 1);
      scale = 1 + Math.sin(normLinear * Math.PI) * 0.12;
      checkmarkOpacity = clamp(checkDrawProgress, 0, 1);
      break;
    }
    case 'combined':
    default: {
      const springVal = createSpring({
        frame: currentFrame,
        fps,
        delay: checkFrame,
        preset: springPreset,
        from: 0,
        to: 1,
      });
      const drawFactor = easeOutCubic(normLinear);
      progress = fromVal + (toVal - fromVal) * springVal;
      checkDrawProgress = fromVal + (toVal - fromVal) * drawFactor;
      scale = 1 + Math.sin(normLinear * Math.PI) * 0.18;
      checkmarkOpacity = clamp(checkDrawProgress, 0, 1);
      break;
    }
  }

  const clampedProgress = clamp(progress, 0, 1);
  const effectiveChecked = progress >= 0.5;
  const errorShakeX = isError && elapsed < 16 ? Math.sin(elapsed * 1.5) * 3 : 0;

  return {
    progress,
    clampedProgress,
    checkDrawProgress: clamp(checkDrawProgress, 0, 1),
    scale,
    effectiveChecked,
    effectiveIndeterminate: isIndeterminateExplicit,
    isTransitioning,
    errorShakeX,
    checkmarkOpacity: clamp(checkmarkOpacity, 0, 1),
  };
}

/**
 * Calculates checkmark or indeterminate line SVG stroke dash offset.
 */
export function getCheckmarkStrokeParams(
  checkDrawProgress: number,
  isIndeterminate: boolean,
  checkmarkOpacity: number
): {
  path: string;
  totalLength: number;
  strokeDasharray: number;
  strokeDashoffset: number;
  opacity: number;
} {
  const path = isIndeterminate ? INDETERMINATE_PATH : CHECKMARK_PATH;
  const totalLength = isIndeterminate ? INDETERMINATE_TOTAL_LENGTH : CHECKMARK_TOTAL_LENGTH;
  const strokeDashoffset = (1 - checkDrawProgress) * totalLength;

  return {
    path,
    totalLength,
    strokeDasharray: totalLength,
    strokeDashoffset,
    opacity: checkmarkOpacity,
  };
}

export interface CheckboxBoxStyleOptions {
  visualVariant: AnimatedCheckboxVisualVariant;
  sizeMetrics: CheckboxSizeMetrics;
  clampedProgress: number;
  scale: number;
  errorShakeX: number;
  state?: AnimatedCheckboxState;
  checkColor?: string;
  uncheckedColor?: string;
  checkedColor?: string;
  borderColor?: string;
  checkedBorderColor?: string;
  disabledColor?: string;
  errorColor?: string;
  customStyle?: React.CSSProperties;
}

/**
 * Resolves CSS styling for the checkbox box container.
 */
export function getCheckboxBoxStyles({
  visualVariant,
  sizeMetrics,
  clampedProgress,
  scale,
  errorShakeX,
  state,
  uncheckedColor = 'transparent',
  checkedColor = Colors.accent.emerald,
  borderColor = Colors.border.default,
  checkedBorderColor,
  disabledColor = Colors.dark.surface2,
  errorColor = Colors.accent.crimson,
  customStyle,
}: CheckboxBoxStyleOptions): React.CSSProperties {
  const { boxSize, borderRadius } = sizeMetrics;
  const isDisabled = state === 'disabled';
  const isError = state === 'error';

  const finalCheckedBorder = checkedBorderColor ?? checkedColor;

  let bg = uncheckedColor;
  let border = `1.5px solid ${borderColor}`;

  if (isError) {
    border = `1.5px solid ${errorColor}`;
    bg = 'rgba(225, 25, 0, 0.08)';
  } else if (isDisabled) {
    border = `1.5px solid ${Colors.border.subtle}`;
    bg = disabledColor;
  } else {
    try {
      bg = interpolateColors(clampedProgress, [0, 1], [uncheckedColor, checkedColor]);
      const currentBorder = interpolateColors(clampedProgress, [0, 1], [borderColor, finalCheckedBorder]);
      border = `1.5px solid ${currentBorder}`;
    } catch {
      bg = clampedProgress >= 0.5 ? checkedColor : uncheckedColor;
      border = `1.5px solid ${clampedProgress >= 0.5 ? finalCheckedBorder : borderColor}`;
    }
  }

  if (visualVariant === 'outlined') {
    bg = clampedProgress > 0.5 ? `${checkedColor}1A` : 'transparent';
    border = `2px solid ${clampedProgress > 0.5 ? finalCheckedBorder : borderColor}`;
  } else if (visualVariant === 'minimal') {
    border = clampedProgress > 0.5 ? 'none' : `1px solid ${Colors.border.subtle}`;
    bg = clampedProgress > 0.5 ? `${checkedColor}26` : 'transparent';
  } else if (visualVariant === 'filled') {
    if (clampedProgress < 0.5 && !isError && !isDisabled) {
      bg = Colors.dark.surface3;
      border = `1px solid ${Colors.border.default}`;
    }
  }

  const transform = `translate3d(${errorShakeX}px, 0, 0) scale(${scale})`;

  return {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: boxSize,
    height: boxSize,
    borderRadius,
    backgroundColor: bg,
    border,
    boxSizing: 'border-box',
    transform,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    flexShrink: 0,
    willChange: 'transform',
    userSelect: 'none',
    ...customStyle,
  };
}

/**
 * Calculates deterministic staggered check frames for multiple checkboxes.
 */
export function calculateCheckboxStaggerFrames(
  count: number,
  baseFrame = 12,
  staggerDelay = 6,
  reverse = false
): number[] {
  return Array.from({ length: count }, (_, idx) => {
    const order = reverse ? count - 1 - idx : idx;
    return baseFrame + order * staggerDelay;
  });
}
