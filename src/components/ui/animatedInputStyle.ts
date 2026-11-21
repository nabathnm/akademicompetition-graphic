/**
 * AnimatedInput Style & State Calculations
 * Pure mathematical functions determining input interaction states, sizes, focus rings,
 * entrance transforms, and visual styles for AnimatedInput.
 * Separated from JSX to allow deterministic testing and maximum reusability.
 */

import React from 'react';
import type {
  AnimatedInputState,
  AnimatedInputVariant,
  AnimatedInputSize,
  AnimatedInputEntrance,
} from './types.ts';
import { Colors } from '../../styles/colors.ts';
import { Spacing } from '../../styles/spacing.ts';
import { Typography } from '../../styles/typography.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { resolveEasing } from '../../utils/animation/easing.ts';

export interface StateDeterminationOptions {
  currentFrame: number;
  startFrame?: number;
  focusFrame?: number;
  typingStartFrame?: number;
  isTyping?: boolean;
  isComplete?: boolean;
  hasContent?: boolean;
  submittedFrame?: number;
  errorFrame?: number;
  explicitState?: AnimatedInputState;
}

/**
 * Determines the interaction state of the input deterministically based on frame timeline.
 */
export const deriveAnimatedInputState = ({
  currentFrame,
  focusFrame = 10,
  typingStartFrame = 16,
  isTyping = false,
  isComplete = false,
  hasContent = false,
  submittedFrame,
  errorFrame,
  explicitState,
}: StateDeterminationOptions): AnimatedInputState => {
  // Explicit state overrides all dynamic timelines
  if (explicitState) {
    return explicitState;
  }

  // Error milestone
  if (typeof errorFrame === 'number' && currentFrame >= errorFrame) {
    return 'error';
  }

  // Submitted milestone
  if (typeof submittedFrame === 'number' && currentFrame >= submittedFrame) {
    return 'submitted';
  }

  // Active typing
  if (isTyping) {
    return 'typing';
  }

  // Filled after typing completes
  if ((isComplete || hasContent) && currentFrame >= typingStartFrame) {
    return 'filled';
  }

  // Focus acquired
  if (currentFrame >= focusFrame) {
    return 'focus';
  }

  // Initial state
  return 'idle';
};

export interface SizeMetrics {
  height: number;
  fontSize: number;
  paddingX: number;
  paddingY: number;
  iconSize: number;
  labelSize: number;
  helperSize: number;
  borderRadius: number;
}

/**
 * Provides proportional typography and layout metrics for each input size.
 */
export const getInputSizeMetrics = (size: AnimatedInputSize = 'md'): SizeMetrics => {
  switch (size) {
    case 'sm':
      return {
        height: 36,
        fontSize: 13,
        paddingX: 12,
        paddingY: 6,
        iconSize: 15,
        labelSize: 11,
        helperSize: 11,
        borderRadius: Spacing.radius.sm,
      };
    case 'lg':
      return {
        height: 52,
        fontSize: 17,
        paddingX: 20,
        paddingY: 14,
        iconSize: 20,
        labelSize: 14,
        helperSize: 12,
        borderRadius: Spacing.radius.md,
      };
    case 'md':
    default:
      return {
        height: 44,
        fontSize: 15,
        paddingX: 16,
        paddingY: 10,
        iconSize: 18,
        labelSize: 12,
        helperSize: 11,
        borderRadius: Spacing.radius.md,
      };
  }
};

export interface InputStyleOptions {
  state: AnimatedInputState;
  variant: AnimatedInputVariant;
  size: AnimatedInputSize;
  focusColor?: string;
  errorColor?: string;
  successColor?: string;
  borderRadiusOverride?: number | string;
  paddingOverride?: string | number;
}

export interface CalculatedInputContainerStyle {
  containerStyle: React.CSSProperties;
  inputColor: string;
  borderColor: string;
  ringColor?: string;
  isFocused: boolean;
}

/**
 * Computes exact background, border, and glow ring styles for the input container.
 */
export const calculateInputVisualStyles = ({
  state,
  variant,
  size,
  focusColor = Colors.accent.cyan,
  errorColor = Colors.accent.crimson,
  successColor = Colors.accent.emerald,
  borderRadiusOverride,
  paddingOverride,
}: InputStyleOptions): CalculatedInputContainerStyle => {
  const metrics = getInputSizeMetrics(size);
  const isFocused = state === 'focus' || state === 'typing';
  const isError = state === 'error';
  const isSubmitted = state === 'submitted';
  const isDisabled = state === 'disabled';

  let borderColor = Colors.border.default;
  let ringColor: string | undefined = undefined;
  let backgroundColor: string = Colors.dark.surface1;

  // Determine active border & ring color
  if (isError) {
    borderColor = errorColor;
    ringColor = `${errorColor}33`;
  } else if (isSubmitted) {
    borderColor = successColor;
    ringColor = `${successColor}33`;
  } else if (isFocused) {
    borderColor = focusColor;
    ringColor = `${focusColor}33`;
  } else {
    borderColor = variant === 'filled' ? Colors.border.subtle : Colors.border.default;
  }

  // Variant specific properties
  let radius: number | string = borderRadiusOverride !== undefined ? borderRadiusOverride : metrics.borderRadius;
  let borderStyle = `1px solid ${borderColor}`;

  if (variant === 'rounded') {
    radius = borderRadiusOverride !== undefined ? borderRadiusOverride : 9999;
    backgroundColor = isFocused ? Colors.dark.surface2 : Colors.dark.surface1;
  } else if (variant === 'filled') {
    backgroundColor = isFocused ? Colors.dark.surface3 : Colors.dark.surface2;
    borderStyle = `1px solid ${borderColor}`;
  } else if (variant === 'minimal') {
    backgroundColor = isFocused ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)';
    borderStyle = isFocused ? `1px solid ${borderColor}` : '1px solid transparent';
  } else if (variant === 'underline') {
    backgroundColor = 'transparent';
    borderStyle = 'none';
    radius = 0;
  } else {
    // outlined default
    backgroundColor = isFocused ? Colors.dark.surface2 : Colors.dark.surface1;
    borderStyle = `1px solid ${borderColor}`;
  }

  const paddingVal = paddingOverride !== undefined
    ? paddingOverride
    : `${metrics.paddingY}px ${metrics.paddingX}px`;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: Spacing.scale.sm,
    width: '100%',
    minHeight: metrics.height,
    padding: paddingVal,
    backgroundColor,
    border: variant === 'underline' ? undefined : borderStyle,
    borderBottom: variant === 'underline' ? `2px solid ${borderColor}` : undefined,
    borderRadius: radius,
    boxShadow: ringColor ? `0 0 0 3px ${ringColor}` : undefined,
    opacity: isDisabled ? 0.45 : 1,
    cursor: isDisabled ? 'not-allowed' : 'text',
    position: 'relative',
    boxSizing: 'border-box',
    fontFamily: Typography.fontFamily.sans,
  };

  const inputColor = isDisabled ? Colors.text.tertiary : Colors.text.primary;

  return {
    containerStyle,
    inputColor,
    borderColor,
    ringColor,
    isFocused,
  };
};

export interface EntranceOptions {
  currentFrame: number;
  startFrame?: number;
  duration?: number;
  entrance?: AnimatedInputEntrance;
}

export interface CalculatedEntranceStyle {
  opacity: number;
  transform?: string;
  visibility: 'visible' | 'hidden';
}

/**
 * Calculates deterministic entrance animation (fade, slide-up, scale-in, none).
 */
export const calculateInputEntrance = ({
  currentFrame,
  startFrame = 0,
  duration = 14,
  entrance = 'slide-up',
}: EntranceOptions): CalculatedEntranceStyle => {
  if (entrance === 'none') {
    return { opacity: 1, visibility: 'visible' };
  }

  if (currentFrame < startFrame) {
    return { opacity: 0, visibility: 'hidden' };
  }

  const safeDuration = Math.max(1, duration);
  const rawProgress = clamp((currentFrame - startFrame) / safeDuration, 0, 1);
  const progress = resolveEasing('easeOutCubic')(rawProgress);

  let transform: string | undefined = undefined;

  switch (entrance) {
    case 'slide-up': {
      const yOffset = (1 - progress) * 16;
      transform = `translateY(${yOffset.toFixed(2)}px)`;
      break;
    }
    case 'scale-in': {
      const scale = 0.95 + 0.05 * progress;
      transform = `scale(${scale.toFixed(3)})`;
      break;
    }
    case 'fade':
    default:
      break;
  }

  return {
    opacity: Number(progress.toFixed(3)),
    transform,
    visibility: progress > 0 ? 'visible' : 'hidden',
  };
};

/**
 * Calculates cursor visibility based on half-cycle blink interval.
 */
export const isCursorVisible = (
  currentFrame: number,
  blinkInterval = 16
): boolean => {
  const halfCycle = Math.max(1, Math.floor(blinkInterval / 2));
  return Math.floor(currentFrame / halfCycle) % 2 === 0;
};

/**
 * Calculates horizontal vibration shake for error feedback.
 */
export const calculateErrorShake = (
  currentFrame: number,
  errorFrame?: number,
  shakeDuration = 14
): number => {
  if (typeof errorFrame !== 'number' || currentFrame < errorFrame) {
    return 0;
  }

  const elapsed = currentFrame - errorFrame;
  if (elapsed >= shakeDuration) {
    return 0;
  }

  const decay = 1 - elapsed / shakeDuration;
  // Sinusoidal oscillation
  return Math.sin(elapsed * 1.8) * 5 * decay;
};
