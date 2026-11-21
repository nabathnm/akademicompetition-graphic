/**
 * AnimatedButton Style & State Calculations
 * Pure mathematical functions determining button interaction states, sizes, press physics,
 * entrance/exit transforms, loading spinner rotations, and visual styles for AnimatedButton.
 * Separated from JSX to allow deterministic testing and maximum reusability.
 */

import React from 'react';
import type {
  AnimatedButtonState,
  AnimatedButtonVariant,
  AnimatedButtonSize,
  AnimatedButtonEntrance,
  AnimatedButtonExit,
} from './types.ts';
import { Colors } from '../../styles/colors.ts';
import { Spacing } from '../../styles/spacing.ts';
import { Typography } from '../../styles/typography.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { resolveEasing, type EasingPresetName, type EasingFunction } from '../../utils/animation/easing.ts';
import { createSpring } from '../../utils/animation/spring.ts';
import type { SpringPresetName } from '../../styles/motion.ts';

export interface ButtonStateDeterminationOptions {
  currentFrame: number;
  startFrame?: number;
  pressFrame?: number;
  releaseFrame?: number;
  loadingStartFrame?: number;
  successFrame?: number;
  errorFrame?: number;
  explicitState?: AnimatedButtonState;
}

/**
 * Determines the interaction state of the button deterministically based on frame timeline milestones.
 */
export const deriveAnimatedButtonState = ({
  currentFrame,
  pressFrame,
  releaseFrame,
  loadingStartFrame,
  successFrame,
  errorFrame,
  explicitState,
}: ButtonStateDeterminationOptions): AnimatedButtonState => {
  // Explicit state overrides all dynamic timelines
  if (explicitState) {
    return explicitState;
  }

  // Error milestone
  if (typeof errorFrame === 'number' && currentFrame >= errorFrame) {
    return 'error';
  }

  // Success milestone
  if (typeof successFrame === 'number' && currentFrame >= successFrame) {
    return 'success';
  }

  // Loading milestone
  if (typeof loadingStartFrame === 'number' && currentFrame >= loadingStartFrame) {
    return 'loading';
  }

  // Press & Release milestone
  if (typeof releaseFrame === 'number' && currentFrame >= releaseFrame) {
    return 'released';
  }

  if (typeof pressFrame === 'number' && currentFrame >= pressFrame) {
    return 'pressed';
  }

  return 'idle';
};

export interface ButtonSizeMetrics {
  height: number;
  fontSize: number;
  paddingX: number;
  paddingY: number;
  iconSize: number;
  badgeSize: number;
  borderRadius: number;
}

/**
 * Normalizes size string to 'sm' | 'md' | 'lg'.
 */
export const normalizeButtonSize = (size: AnimatedButtonSize = 'medium'): 'sm' | 'md' | 'lg' => {
  if (size === 'small' || size === 'sm') return 'sm';
  if (size === 'large' || size === 'lg') return 'lg';
  return 'md';
};

/**
 * Returns proportional metrics for the button size preset.
 */
export const getButtonSizeMetrics = (size: AnimatedButtonSize = 'medium'): ButtonSizeMetrics => {
  const norm = normalizeButtonSize(size);
  switch (norm) {
    case 'sm':
      return {
        height: 34,
        fontSize: 12,
        paddingX: 14,
        paddingY: 6,
        iconSize: 14,
        badgeSize: 10,
        borderRadius: Spacing.radius.sm,
      };
    case 'lg':
      return {
        height: 52,
        fontSize: 16,
        paddingX: 26,
        paddingY: 14,
        iconSize: 20,
        badgeSize: 12,
        borderRadius: Spacing.radius.md,
      };
    case 'md':
    default:
      return {
        height: 44,
        fontSize: 14,
        paddingX: 20,
        paddingY: 10,
        iconSize: 17,
        badgeSize: 11,
        borderRadius: Spacing.radius.md,
      };
  }
};

export interface ButtonVisualOptions {
  state: AnimatedButtonState;
  variant: AnimatedButtonVariant;
  size: AnimatedButtonSize;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: number | string;
  padding?: string | number;
  width?: string | number;
  height?: string | number;
}

export interface CalculatedButtonStyles {
  containerStyle: React.CSSProperties;
  textColor: string;
  iconSize: number;
  fontSize: number;
  isClickable: boolean;
}

/**
 * Computes exact background, border, padding, and text colors based on variant and state.
 */
export const calculateButtonVisualStyles = ({
  state,
  variant,
  size,
  backgroundColor: customBg,
  textColor: customText,
  borderColor: customBorder,
  borderRadius: customRadius,
  padding: customPadding,
  width,
  height,
}: ButtonVisualOptions): CalculatedButtonStyles => {
  const metrics = getButtonSizeMetrics(size);
  const isIconOnly = variant === 'icon-only';
  const isPressed = state === 'pressed';
  const isHover = state === 'hover';
  const isLoading = state === 'loading';
  const isSuccess = state === 'success';
  const isError = state === 'error';
  const isDisabled = state === 'disabled';

  let bg = Colors.accent.brand;
  let text = Colors.text.primary;
  let border = '1px solid transparent';
  let shadow: string | undefined = '0 2px 6px rgba(0, 0, 0, 0.2)';

  // 1. Variant Foundations
  switch (variant) {
    case 'secondary':
      bg = isPressed ? Colors.dark.surface1 : isHover ? Colors.dark.surface3 : Colors.dark.surface2;
      text = Colors.text.primary;
      border = `1px solid ${Colors.border.default}`;
      shadow = 'none';
      break;

    case 'outline':
      bg = isPressed ? 'rgba(255, 255, 255, 0.08)' : isHover ? 'rgba(255, 255, 255, 0.04)' : 'transparent';
      text = Colors.text.primary;
      border = `1px solid ${isPressed ? Colors.text.primary : Colors.border.default}`;
      shadow = 'none';
      break;

    case 'ghost':
      bg = isPressed ? 'rgba(255, 255, 255, 0.1)' : isHover ? 'rgba(255, 255, 255, 0.05)' : 'transparent';
      text = Colors.text.primary;
      border = '1px solid transparent';
      shadow = 'none';
      break;

    case 'text':
      bg = isPressed ? 'rgba(255, 255, 255, 0.06)' : 'transparent';
      text = Colors.accent.brandLight;
      border = 'none';
      shadow = 'none';
      break;

    case 'icon-only':
      bg = isPressed ? Colors.dark.surface3 : isHover ? Colors.dark.surface2 : Colors.dark.surface1;
      text = Colors.text.primary;
      border = `1px solid ${Colors.border.default}`;
      shadow = 'none';
      break;

    case 'primary':
    default:
      bg = isPressed ? Colors.accent.brandDark : isHover ? Colors.accent.brandLight : Colors.accent.brand;
      text = '#FFFFFF';
      border = '1px solid transparent';
      shadow = isPressed ? 'none' : '0 2px 8px rgba(39, 110, 241, 0.35)';
      break;
  }

  // 2. State Overrides (Success, Error, Loading, Disabled)
  if (isSuccess) {
    bg = Colors.accent.emerald;
    text = '#FFFFFF';
    border = '1px solid transparent';
    shadow = '0 2px 8px rgba(14, 131, 69, 0.35)';
  } else if (isError) {
    bg = Colors.accent.crimson;
    text = '#FFFFFF';
    border = '1px solid transparent';
    shadow = '0 2px 8px rgba(225, 25, 0, 0.35)';
  }

  // 3. Custom Color Overrides
  if (customBg) bg = customBg;
  if (customText) text = customText;
  if (customBorder) border = `1px solid ${customBorder}`;

  // Dimensions & Padding
  const btnHeight = height !== undefined ? height : metrics.height;
  let btnWidth = width !== undefined ? width : 'auto';
  if (isIconOnly && width === undefined) {
    btnWidth = btnHeight;
  }

  const paddingVal = customPadding !== undefined
    ? customPadding
    : isIconOnly
    ? 0
    : variant === 'text'
    ? `${metrics.paddingY}px 8px`
    : `${metrics.paddingY}px ${metrics.paddingX}px`;

  const radiusVal = customRadius !== undefined ? customRadius : metrics.borderRadius;

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.scale.xs + 2,
    height: btnHeight,
    width: btnWidth,
    padding: paddingVal,
    backgroundColor: bg,
    color: text,
    border,
    borderRadius: radiusVal,
    boxShadow: shadow,
    opacity: isDisabled ? 0.45 : 1,
    cursor: isDisabled ? 'not-allowed' : isLoading ? 'wait' : 'pointer',
    fontFamily: Typography.fontFamily.sans,
    fontSize: metrics.fontSize,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    userSelect: 'none',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
    verticalAlign: 'middle',
  };

  return {
    containerStyle,
    textColor: text,
    iconSize: metrics.iconSize,
    fontSize: metrics.fontSize,
    isClickable: !isDisabled && !isLoading,
  };
};

export interface PressScaleOptions {
  currentFrame: number;
  pressFrame?: number;
  releaseFrame?: number;
  scaleOnPress?: number;
  fps?: number;
  springPreset?: SpringPresetName;
}

/**
 * Computes deterministic scale compression on press and spring overshoot on release.
 */
export const calculatePressScale = ({
  currentFrame,
  pressFrame,
  releaseFrame,
  scaleOnPress = 0.94,
  fps = 30,
  springPreset = 'snappy',
}: PressScaleOptions): number => {
  if (typeof pressFrame !== 'number' || currentFrame < pressFrame) {
    return 1.0;
  }

  // Phase A: Active Press (scale down from 1.0 to scaleOnPress)
  if (typeof releaseFrame !== 'number' || currentFrame < releaseFrame) {
    const elapsed = currentFrame - pressFrame;
    // Compresses over 3 frames
    const pressProgress = clamp(elapsed / 3, 0, 1);
    return 1.0 - (1.0 - scaleOnPress) * pressProgress;
  }

  // Phase B: Release Settle (spring physics overshoot from scaleOnPress back to 1.0)
  const elapsedSinceRelease = currentFrame - releaseFrame;
  const springProgress = createSpring({
    frame: elapsedSinceRelease,
    fps,
    preset: springPreset,
  });

  // Interpolate from scaleOnPress to 1.0 with physics overshoot
  return scaleOnPress + (1.0 - scaleOnPress) * springProgress;
};

export interface ButtonEntranceExitOptions {
  currentFrame: number;
  startFrame?: number;
  entrance?: AnimatedButtonEntrance;
  entranceDuration?: number;
  exitFrame?: number;
  exit?: AnimatedButtonExit;
  exitDurationInFrames?: number;
  fps?: number;
  springPreset?: SpringPresetName;
  easing?: EasingPresetName | EasingFunction;
}

export interface CalculatedButtonMotion {
  opacity: number;
  transform?: string;
  visibility: 'visible' | 'hidden';
}

/**
 * Calculates entrance and exit transforms deterministically.
 */
export const calculateButtonMotion = ({
  currentFrame,
  startFrame = 0,
  entrance = 'scale-in',
  entranceDuration = 12,
  exitFrame,
  exit = 'none',
  exitDurationInFrames = 12,
  fps = 30,
  springPreset = 'snappy',
  easing = 'easeOutCubic',
}: ButtonEntranceExitOptions): CalculatedButtonMotion => {
  // Before entrance starts
  if (currentFrame < startFrame) {
    return { opacity: 0, visibility: 'hidden' };
  }

  // Exit lifecycle
  const hasExit = typeof exitFrame === 'number' && exit !== 'none';
  if (hasExit && currentFrame >= (exitFrame as number) + exitDurationInFrames) {
    return { opacity: 0, visibility: 'hidden' };
  }

  let inProgress = 1;
  const elapsedIn = currentFrame - startFrame;
  const safeInDuration = Math.max(1, entranceDuration);

  if (entrance === 'pop-in') {
    inProgress = createSpring({
      frame: elapsedIn,
      fps,
      preset: springPreset,
    });
  } else if (entrance !== 'none') {
    const raw = clamp(elapsedIn / safeInDuration, 0, 1);
    inProgress = resolveEasing(easing)(raw);
  }

  let outProgress = 0;
  if (hasExit && currentFrame >= (exitFrame as number)) {
    const elapsedOut = currentFrame - (exitFrame as number);
    const safeOutDur = Math.max(1, exitDurationInFrames);
    const raw = clamp(elapsedOut / safeOutDur, 0, 1);
    outProgress = resolveEasing(easing)(raw);
  }

  const alpha = Math.max(0, inProgress * (1 - outProgress));
  let transform: string | undefined = undefined;

  // Entrance transforms
  if (entrance === 'slide-up') {
    const yIn = (1 - inProgress) * 18;
    const yOut = outProgress * -18;
    transform = `translateY(${(yIn + yOut).toFixed(2)}px)`;
  } else if (entrance === 'scale-in' || entrance === 'pop-in') {
    const scale = Math.max(0, (0.92 + 0.08 * inProgress) - outProgress * 0.1);
    transform = `scale(${scale.toFixed(3)})`;
  }

  if (hasExit && exit === 'slide-out') {
    const yOut = outProgress * -20;
    transform = transform ? `${transform} translateY(${yOut.toFixed(2)}px)` : `translateY(${yOut.toFixed(2)}px)`;
  } else if (hasExit && exit === 'scale-out') {
    const scaleOut = Math.max(0, 1 - outProgress * 0.2);
    transform = transform ? `${transform} scale(${scaleOut.toFixed(3)})` : `scale(${scaleOut.toFixed(3)})`;
  }

  return {
    opacity: Number(alpha.toFixed(3)),
    transform,
    visibility: alpha > 0 ? 'visible' : 'hidden',
  };
};

/**
 * Computes continuous spinner angle in degrees.
 */
export const calculateSpinnerAngle = (
  currentFrame: number,
  degreesPerFrame = 12
): number => {
  return (currentFrame * degreesPerFrame) % 360;
};

/**
 * Computes decaying horizontal shake for error feedback.
 */
export const calculateButtonShake = (
  currentFrame: number,
  errorFrame?: number,
  shakeDuration = 12
): number => {
  if (typeof errorFrame !== 'number' || currentFrame < errorFrame) {
    return 0;
  }
  const elapsed = currentFrame - errorFrame;
  if (elapsed >= shakeDuration) {
    return 0;
  }
  const decay = 1 - elapsed / shakeDuration;
  return Math.sin(elapsed * 1.8) * 4 * decay;
};
