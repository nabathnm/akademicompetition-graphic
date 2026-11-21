/**
 * AnimatedToggle Style & Motion Calculations
 * Pure mathematical functions determining toggle size metrics, state resolution,
 * spring & easing thumb trajectories, color interpolation, and layout styles.
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { interpolateColors } from 'remotion';
import type {
  AnimatedToggleVisualVariant,
  AnimatedToggleAnimationVariant,
  AnimatedToggleVariant,
  AnimatedToggleSize,
  AnimatedToggleState,
  ToggleSizeMetrics,
} from './types.ts';
import { Colors } from '../../styles/colors.ts';
import { Spacing } from '../../styles/spacing.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { resolveEasing, easeInOutCubic, easeOutCubic } from '../../utils/animation/easing.ts';
import type { EasingPresetName, EasingFunction } from '../../utils/animation/easing.ts';
import { createSpring } from '../../utils/animation/spring.ts';
import type { SpringPresetName } from '../../styles/motion.ts';

const ANIMATION_VARIANTS: ReadonlyArray<AnimatedToggleAnimationVariant> = [
  'slide',
  'scale',
  'spring',
  'elastic',
  'fade',
  'color-transition',
  'combined',
];

const VISUAL_VARIANTS: ReadonlyArray<AnimatedToggleVisualVariant> = [
  'default',
  'minimal',
  'outlined',
  'filled',
  'labeled',
];

/**
 * Resolves visual variant from primary or explicit variant props.
 */
export function resolveToggleVisualVariant(
  variant?: AnimatedToggleVariant,
  visualVariant?: AnimatedToggleVisualVariant
): AnimatedToggleVisualVariant {
  if (visualVariant) return visualVariant;
  if (variant && (VISUAL_VARIANTS as readonly string[]).includes(variant)) {
    return variant as AnimatedToggleVisualVariant;
  }
  return 'default';
}

/**
 * Resolves animation variant from primary or explicit variant props.
 */
export function resolveToggleAnimationVariant(
  variant?: AnimatedToggleVariant,
  animationVariant?: AnimatedToggleAnimationVariant
): AnimatedToggleAnimationVariant {
  if (animationVariant) return animationVariant;
  if (variant && (ANIMATION_VARIANTS as readonly string[]).includes(variant)) {
    return variant as AnimatedToggleAnimationVariant;
  }
  return 'combined';
}

/**
 * Normalizes size preset and computes proportional layout metrics.
 */
export function resolveToggleSize(
  size: AnimatedToggleSize = 'medium',
  customWidth?: number,
  customHeight?: number,
  customThumbSize?: number,
  customPadding?: number
): ToggleSizeMetrics {
  const normalized = size === 'sm' || size === 'small'
    ? 'small'
    : size === 'lg' || size === 'large'
      ? 'large'
      : 'medium';

  let trackWidth = 48;
  let trackHeight = 26;
  let thumbSize = 20;
  let padding = 3;
  let fontSize = 13;
  let labelGap = 10;
  let iconSize = 16;

  if (normalized === 'small') {
    trackWidth = 36;
    trackHeight = 20;
    thumbSize = 16;
    padding = 2;
    fontSize = 11;
    labelGap = 8;
    iconSize = 14;
  } else if (normalized === 'large') {
    trackWidth = 64;
    trackHeight = 34;
    thumbSize = 26;
    padding = 4;
    fontSize = 15;
    labelGap = 14;
    iconSize = 20;
  }

  const finalWidth = customWidth ?? trackWidth;
  const finalHeight = customHeight ?? trackHeight;
  const finalPadding = customPadding ?? padding;
  const finalThumbSize = customThumbSize ?? thumbSize;
  const travelDistance = Math.max(0, finalWidth - finalThumbSize - finalPadding * 2);

  return {
    trackWidth: finalWidth,
    trackHeight: finalHeight,
    thumbSize: finalThumbSize,
    padding: finalPadding,
    travelDistance,
    fontSize,
    labelGap,
    iconSize,
  };
}

export interface ToggleMotionOptions {
  currentFrame: number;
  fps?: number;
  checked?: boolean;
  defaultChecked?: boolean;
  startFrame?: number;
  toggleFrame?: number;
  durationInFrames?: number;
  animationVariant?: AnimatedToggleAnimationVariant;
  springPreset?: SpringPresetName;
  easing?: EasingPresetName | EasingFunction;
  state?: AnimatedToggleState;
  sizeMetrics: ToggleSizeMetrics;
}

export interface ToggleMotionResult {
  /** Normalized progression from 0 (OFF) to 1 (ON), can overshoot with springs */
  progress: number;
  /** Clamped 0..1 progress for color interpolation */
  clampedProgress: number;
  /** Thumb horizontal pixel offset relative to track left padding */
  thumbX: number;
  /** Thumb X scale stretch */
  thumbScaleX: number;
  /** Thumb Y scale stretch */
  thumbScaleY: number;
  /** Logical effective state based on current progress */
  effectiveChecked: boolean;
  /** Whether the toggle is currently actively in motion */
  isTransitioning: boolean;
  /** Label fade opacity for ON label */
  onLabelOpacity: number;
  /** Label fade opacity for OFF label */
  offLabelOpacity: number;
}

/**
 * Evaluates deterministic frame-based toggle thumb kinematics, scaling, and progress.
 */
export function calculateToggleMotion({
  currentFrame,
  fps = 30,
  checked,
  defaultChecked,
  toggleFrame,
  durationInFrames = 12,
  animationVariant = 'combined',
  springPreset = 'snappy',
  easing = 'easeInOutCubic',
  state,
  sizeMetrics,
}: ToggleMotionOptions): ToggleMotionResult {
  const { travelDistance } = sizeMetrics;

  // Handle explicit non-interactive states
  if (state === 'disabled') {
    const isTargetOn = checked ?? defaultChecked ?? false;
    const progress = isTargetOn ? 1 : 0;
    return {
      progress,
      clampedProgress: progress,
      thumbX: progress * travelDistance,
      thumbScaleX: 1,
      thumbScaleY: 1,
      effectiveChecked: isTargetOn,
      isTransitioning: false,
      onLabelOpacity: progress,
      offLabelOpacity: 1 - progress,
    };
  }

  // Determine initial and target states
  const initialChecked = defaultChecked !== undefined
    ? defaultChecked
    : checked !== undefined && toggleFrame !== undefined
      ? !checked
      : (checked ?? false);

  const targetChecked = checked !== undefined
    ? checked
    : !initialChecked;

  const fromVal = initialChecked ? 1 : 0;
  const toVal = targetChecked ? 1 : 0;

  // Static toggle when toggleFrame is omitted
  if (toggleFrame === undefined) {
    const effectiveStatic = state === 'on' ? true : state === 'off' ? false : (checked ?? defaultChecked ?? false);
    const progress = effectiveStatic ? 1 : 0;
    return {
      progress,
      clampedProgress: progress,
      thumbX: progress * travelDistance,
      thumbScaleX: 1,
      thumbScaleY: 1,
      effectiveChecked: effectiveStatic,
      isTransitioning: false,
      onLabelOpacity: progress,
      offLabelOpacity: 1 - progress,
    };
  }

  // Pre-toggle state
  if (currentFrame < toggleFrame) {
    return {
      progress: fromVal,
      clampedProgress: fromVal,
      thumbX: fromVal * travelDistance,
      thumbScaleX: 1,
      thumbScaleY: 1,
      effectiveChecked: initialChecked,
      isTransitioning: false,
      onLabelOpacity: fromVal,
      offLabelOpacity: 1 - fromVal,
    };
  }

  // Active transition
  const elapsed = currentFrame - toggleFrame;
  const duration = Math.max(1, durationInFrames);
  const normLinear = clamp(elapsed / duration, 0, 1);
  const isTransitioning = elapsed >= 0 && elapsed <= duration * 1.5;

  let progress = toVal;
  let thumbScaleX = 1;
  let thumbScaleY = 1;

  switch (animationVariant) {
    case 'slide': {
      const easingFn = resolveEasing(easing) ?? easeInOutCubic;
      const factor = easingFn(normLinear);
      progress = fromVal + (toVal - fromVal) * factor;
      break;
    }
    case 'scale': {
      const factor = easeOutCubic(normLinear);
      progress = fromVal + (toVal - fromVal) * factor;
      // Mid-flight stretch along movement direction
      const stretch = Math.sin(normLinear * Math.PI) * 0.28;
      thumbScaleX = 1 + stretch;
      thumbScaleY = 1 - stretch * 0.15;
      break;
    }
    case 'spring': {
      const springVal = createSpring({
        frame: currentFrame,
        fps,
        delay: toggleFrame,
        preset: springPreset,
        from: 0,
        to: 1,
      });
      progress = fromVal + (toVal - fromVal) * springVal;
      break;
    }
    case 'elastic': {
      const springVal = createSpring({
        frame: currentFrame,
        fps,
        delay: toggleFrame,
        preset: 'bouncy',
        config: { damping: 9, stiffness: 240, mass: 0.7 },
        from: 0,
        to: 1,
      });
      progress = fromVal + (toVal - fromVal) * springVal;
      const wobble = Math.sin(Math.max(0, elapsed) * 0.8) * Math.exp(-elapsed * 0.14) * 0.22;
      thumbScaleX = 1 + wobble;
      thumbScaleY = 1 - wobble;
      break;
    }
    case 'fade': {
      const factor = easeInOutCubic(normLinear);
      progress = fromVal + (toVal - fromVal) * factor;
      break;
    }
    case 'color-transition': {
      const factor = easeInOutCubic(normLinear);
      progress = fromVal + (toVal - fromVal) * factor;
      break;
    }
    case 'combined':
    default: {
      const springVal = createSpring({
        frame: currentFrame,
        fps,
        delay: toggleFrame,
        preset: springPreset,
        from: 0,
        to: 1,
      });
      progress = fromVal + (toVal - fromVal) * springVal;
      const stretch = Math.sin(normLinear * Math.PI) * 0.24;
      thumbScaleX = 1 + stretch;
      thumbScaleY = 1 - stretch * 0.12;
      break;
    }
  }

  const thumbX = progress * travelDistance;
  const clampedProgress = clamp(progress, 0, 1);
  const effectiveChecked = progress >= 0.5;

  // Label opacity fade calculations
  const onLabelOpacity = clamp(progress * 2 - 0.2, 0, 1);
  const offLabelOpacity = clamp((1 - progress) * 2 - 0.2, 0, 1);

  return {
    progress,
    clampedProgress,
    thumbX,
    thumbScaleX,
    thumbScaleY,
    effectiveChecked,
    isTransitioning,
    onLabelOpacity,
    offLabelOpacity,
  };
}

/**
 * Calculates track background color safely blending off and on colors.
 */
export function getTrackColor(
  clampedProgress: number,
  offColor: string = Colors.dark.surface3,
  onColor: string = Colors.accent.emerald
): string {
  try {
    return interpolateColors(clampedProgress, [0, 1], [offColor, onColor]);
  } catch {
    return clampedProgress >= 0.5 ? onColor : offColor;
  }
}

/**
 * Calculates thumb color blending off and on thumb colors.
 */
export function getThumbColor(
  clampedProgress: number,
  thumbOffColor: string = Colors.white,
  thumbOnColor?: string
): string {
  if (!thumbOnColor || thumbOffColor === thumbOnColor) {
    return thumbOffColor;
  }
  try {
    return interpolateColors(clampedProgress, [0, 1], [thumbOffColor, thumbOnColor]);
  } catch {
    return clampedProgress >= 0.5 ? thumbOnColor : thumbOffColor;
  }
}

export interface ToggleTrackStyleOptions {
  visualVariant: AnimatedToggleVisualVariant;
  sizeMetrics: ToggleSizeMetrics;
  clampedProgress: number;
  state?: AnimatedToggleState;
  onColor?: string;
  offColor?: string;
  disabledColor?: string;
  borderRadius?: number | string;
  customStyle?: React.CSSProperties;
}

/**
 * Resolves CSS styling for the toggle track container.
 */
export function getToggleTrackStyles({
  visualVariant,
  sizeMetrics,
  clampedProgress,
  state,
  onColor = Colors.accent.emerald,
  offColor = Colors.dark.surface3,
  disabledColor = Colors.dark.surface2,
  borderRadius,
  customStyle,
}: ToggleTrackStyleOptions): React.CSSProperties {
  const { trackWidth, trackHeight, padding } = sizeMetrics;
  const isDisabled = state === 'disabled';
  const defaultRadius = borderRadius ?? (visualVariant === 'filled' ? 8 : Spacing.radius.full);

  const baseTrackColor = isDisabled
    ? disabledColor
    : getTrackColor(clampedProgress, offColor, onColor);

  let height = trackHeight;
  let border = `1px solid ${Colors.border.default}`;
  let backgroundColor = baseTrackColor;

  if (visualVariant === 'minimal') {
    height = Math.round(trackHeight * 0.52);
    border = 'none';
  } else if (visualVariant === 'outlined') {
    backgroundColor = clampedProgress > 0.5 ? `${onColor}26` : 'transparent';
    border = `2px solid ${isDisabled ? Colors.text.muted : baseTrackColor}`;
  } else if (visualVariant === 'filled') {
    border = 'none';
  }

  return {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: trackWidth,
    height,
    padding,
    backgroundColor,
    borderRadius: defaultRadius,
    border,
    boxSizing: 'border-box',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.55 : 1,
    overflow: 'hidden',
    userSelect: 'none',
    ...customStyle,
  };
}

export interface ToggleThumbStyleOptions {
  visualVariant: AnimatedToggleVisualVariant;
  sizeMetrics: ToggleSizeMetrics;
  thumbX: number;
  thumbScaleX: number;
  thumbScaleY: number;
  clampedProgress: number;
  state?: AnimatedToggleState;
  thumbColor?: string;
  thumbOnColor?: string;
  borderRadius?: number | string;
  customStyle?: React.CSSProperties;
}

/**
 * Resolves CSS styling for the moving thumb element.
 */
export function getToggleThumbStyles({
  visualVariant,
  sizeMetrics,
  thumbX,
  thumbScaleX,
  thumbScaleY,
  clampedProgress,
  state,
  thumbColor = Colors.white,
  thumbOnColor,
  borderRadius,
  customStyle,
}: ToggleThumbStyleOptions): React.CSSProperties {
  const { thumbSize, padding } = sizeMetrics;
  const isMinimal = visualVariant === 'minimal';
  const finalThumbColor = getThumbColor(clampedProgress, thumbColor, thumbOnColor);
  const defaultRadius = borderRadius ?? (visualVariant === 'filled' ? 6 : Spacing.radius.full);

  return {
    position: 'absolute',
    left: padding,
    top: '50%',
    width: thumbSize,
    height: thumbSize,
    backgroundColor: state === 'disabled' ? Colors.text.muted : finalThumbColor,
    borderRadius: defaultRadius,
    boxShadow: isMinimal
      ? '0 2px 6px rgba(0, 0, 0, 0.45)'
      : '0 2px 5px rgba(0, 0, 0, 0.35)',
    transform: `translate3d(${thumbX}px, -50%, 0) scale(${thumbScaleX}, ${thumbScaleY})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    willChange: 'transform',
    ...customStyle,
  };
}
