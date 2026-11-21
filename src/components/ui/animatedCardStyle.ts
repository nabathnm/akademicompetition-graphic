/**
 * AnimatedCard Style & Motion Calculations
 * Pure mathematical functions determining card size metrics, visual styles, interaction states,
 * and 12 distinct animation variants (entrance & exit).
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import type {
  AnimatedCardAnimation,
  AnimatedCardVariant,
  AnimatedCardState,
  AnimatedCardSize,
} from './types.ts';
import { Colors } from '../../styles/colors.ts';
import { Spacing } from '../../styles/spacing.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { resolveEasing, easeOutCubic, type EasingPresetName, type EasingFunction } from '../../utils/animation/easing.ts';
import { createSpring } from '../../utils/animation/spring.ts';
import type { SpringPresetName } from '../../styles/motion.ts';

export interface CardStateOptions {
  currentFrame: number;
  explicitState?: AnimatedCardState;
  focusFrame?: number;
  selectFrame?: number;
  highlightFrame?: number;
  expandFrame?: number;
  collapseFrame?: number;
}

/**
 * Resolves the card interaction state deterministically based on frame timeline milestones.
 */
export const deriveAnimatedCardState = ({
  currentFrame,
  explicitState,
  focusFrame,
  selectFrame,
  highlightFrame,
  expandFrame,
  collapseFrame,
}: CardStateOptions): AnimatedCardState => {
  if (explicitState) {
    return explicitState;
  }

  if (typeof collapseFrame === 'number' && currentFrame >= collapseFrame) {
    return 'collapsed';
  }

  if (typeof expandFrame === 'number' && currentFrame >= expandFrame) {
    return 'expanded';
  }

  if (typeof highlightFrame === 'number' && currentFrame >= highlightFrame) {
    return 'highlighted';
  }

  if (typeof selectFrame === 'number' && currentFrame >= selectFrame) {
    return 'selected';
  }

  if (typeof focusFrame === 'number' && currentFrame >= focusFrame) {
    return 'focused';
  }

  return 'idle';
};

export interface CardSizeMetrics {
  padding: number;
  titleSize: number;
  descSize: number;
  iconSize: number;
  borderRadius: number;
  badgeSize: number;
  gap: number;
}

/**
 * Normalizes size string into 'sm' | 'md' | 'lg'.
 */
export const normalizeCardSize = (size: AnimatedCardSize = 'md'): 'sm' | 'md' | 'lg' => {
  if (size === 'small' || size === 'sm') return 'sm';
  if (size === 'large' || size === 'lg') return 'lg';
  return 'md';
};

/**
 * Resolves layout metrics based on proportional size presets and visual variant.
 */
export const getCardSizeMetrics = (
  size: AnimatedCardSize = 'md',
  variant: AnimatedCardVariant = 'default'
): CardSizeMetrics => {
  const norm = normalizeCardSize(size);
  const isCompact = variant === 'compact';

  switch (norm) {
    case 'sm':
      return {
        padding: isCompact ? Spacing.scale.xs + 2 : Spacing.scale.sm,
        titleSize: 14,
        descSize: 12,
        iconSize: 16,
        borderRadius: Spacing.radius.sm,
        badgeSize: 10,
        gap: 6,
      };

    case 'lg':
      return {
        padding: isCompact ? Spacing.scale.md : Spacing.scale.xl,
        titleSize: 20,
        descSize: 15,
        iconSize: 24,
        borderRadius: Spacing.radius.lg,
        badgeSize: 12,
        gap: 14,
      };

    case 'md':
    default:
      return {
        padding: isCompact ? Spacing.scale.sm + 2 : Spacing.scale.lg,
        titleSize: 16,
        descSize: 14,
        iconSize: 20,
        borderRadius: Spacing.radius.md,
        badgeSize: 11,
        gap: 10,
      };
  }
};

export interface CardVisualOptions {
  variant?: AnimatedCardVariant;
  state?: AnimatedCardState;
  metrics: CardSizeMetrics;
  customBg?: string;
  customBorder?: string;
  customRadius?: number | string;
  customShadow?: string;
  customPadding?: number | string;
  width?: number | string;
  height?: number | string;
}

export interface CardVisualResult {
  containerStyle: React.CSSProperties;
  titleColor: string;
  descColor: string;
}

/**
 * Computes base visual styles, backgrounds, borders, shadows, and state transforms.
 */
export const calculateCardVisualStyles = ({
  variant = 'default',
  state = 'idle',
  metrics,
  customBg,
  customBorder,
  customRadius,
  customShadow,
  customPadding,
  width,
  height,
}: CardVisualOptions): CardVisualResult => {
  let bg: string = Colors.dark.surface1;
  let border: string = `1px solid ${Colors.border.default}`;
  let shadow: string | undefined = '0 4px 16px rgba(0, 0, 0, 0.25)';
  const radius: number | string = customRadius !== undefined ? customRadius : metrics.borderRadius;
  const padding: number | string = customPadding !== undefined ? customPadding : metrics.padding;
  let stateTransform: string | undefined = undefined;
  let opacity: number = 1;

  // 1. Foundation by Variant
  switch (variant) {
    case 'outlined':
      bg = Colors.dark.surface1;
      border = `1px solid ${Colors.border.strong}`;
      shadow = 'none';
      break;

    case 'elevated':
      bg = Colors.dark.surface2;
      border = `1px solid ${Colors.border.subtle}`;
      shadow = '0 12px 36px rgba(0, 0, 0, 0.45)';
      break;

    case 'flat':
      bg = Colors.dark.surface1;
      border = '1px solid transparent';
      shadow = 'none';
      break;

    case 'image-card':
      bg = Colors.dark.surface1;
      border = `1px solid ${Colors.border.default}`;
      shadow = '0 8px 24px rgba(0, 0, 0, 0.35)';
      break;

    case 'horizontal':
      bg = Colors.dark.surface1;
      border = `1px solid ${Colors.border.default}`;
      shadow = '0 4px 16px rgba(0, 0, 0, 0.25)';
      break;

    case 'compact':
      bg = Colors.dark.surface1;
      border = `1px solid ${Colors.border.default}`;
      shadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
      break;

    case 'default':
    default:
      bg = Colors.dark.surface1;
      border = `1px solid ${Colors.border.default}`;
      shadow = '0 4px 16px rgba(0, 0, 0, 0.25)';
      break;
  }

  // 2. State Modifications
  switch (state) {
    case 'focused':
      border = `1px solid ${Colors.accent.brandLight}`;
      shadow = '0 0 0 2px rgba(39, 110, 241, 0.35), 0 8px 24px rgba(0, 0, 0, 0.3)';
      break;

    case 'selected':
      bg = 'rgba(39, 110, 241, 0.12)';
      border = `1px solid ${Colors.accent.brand}`;
      stateTransform = 'scale(1.02)';
      break;

    case 'highlighted':
      border = `1px solid ${Colors.accent.emerald}`;
      shadow = '0 0 16px rgba(14, 131, 69, 0.35)';
      stateTransform = 'scale(1.03)';
      break;

    case 'expanded':
      stateTransform = 'scale(1.04)';
      shadow = '0 16px 40px rgba(0, 0, 0, 0.5)';
      break;

    case 'collapsed':
      stateTransform = 'scale(0.96)';
      opacity = 0.85;
      break;

    case 'disabled':
      opacity = 0.45;
      break;

    case 'idle':
    default:
      break;
  }

  // 3. User Custom Overrides
  if (customBg) bg = customBg;
  if (customBorder) border = `1px solid ${customBorder}`;
  if (customShadow !== undefined) shadow = customShadow;

  return {
    containerStyle: {
      backgroundColor: bg,
      border,
      boxShadow: shadow,
      borderRadius: radius,
      padding,
      width: width !== undefined ? width : 'auto',
      height: height !== undefined ? height : 'auto',
      opacity,
      cursor: state === 'disabled' ? 'not-allowed' : 'default',
      transform: stateTransform,
      overflow: variant === 'image-card' ? 'hidden' : 'visible',
      boxSizing: 'border-box',
    },
    titleColor: Colors.text.primary,
    descColor: Colors.text.secondary,
  };
};

export interface CardMotionOptions {
  currentFrame: number;
  startFrame?: number;
  durationInFrames?: number;
  exitFrame?: number;
  exitDurationInFrames?: number;
  delay?: number;
  animation?: AnimatedCardAnimation;
  easing?: EasingPresetName | EasingFunction;
  springPreset?: SpringPresetName;
  distance?: number;
  initialScale?: number;
  initialRotation?: number;
  fps?: number;
}

export interface CardMotionResult {
  opacity: number;
  transform?: string;
  filter?: string;
  visibility: 'visible' | 'hidden';
}

/**
 * Computes deterministic entrance & exit motion transforms across all 12 supported animation variants.
 */
export const calculateCardMotion = ({
  currentFrame,
  startFrame = 0,
  durationInFrames = 14,
  exitFrame,
  exitDurationInFrames = 12,
  delay = 0,
  animation = 'fade',
  easing = 'easeOutCubic',
  springPreset = 'snappy',
  distance = 24,
  initialScale = 0.92,
  initialRotation = 15,
  fps = 30,
}: CardMotionOptions): CardMotionResult => {
  const effectiveStart = startFrame + delay;

  if (currentFrame < effectiveStart) {
    return {
      opacity: 0,
      visibility: 'hidden',
    };
  }

  // 1. Entrance Progress Calculation
  const elapsedIn = currentFrame - effectiveStart;
  const safeInDuration = Math.max(1, durationInFrames);
  const easingFn = resolveEasing(easing) ?? easeOutCubic;

  let inProgress = 1;
  if (animation === 'pop') {
    inProgress = createSpring({
      frame: elapsedIn,
      fps,
      preset: springPreset,
    });
  } else {
    const rawIn = clamp(elapsedIn / safeInDuration, 0, 1);
    inProgress = easingFn(rawIn);
  }

  // 2. Exit Progress Calculation
  let outProgress = 0;
  if (typeof exitFrame === 'number' && currentFrame >= exitFrame) {
    const elapsedOut = currentFrame - exitFrame;
    const safeOutDuration = Math.max(1, exitDurationInFrames);
    const rawOut = clamp(elapsedOut / safeOutDuration, 0, 1);
    outProgress = easingFn(rawOut);
  }

  // Combined Opacity
  const baseAlpha = animation === 'pop' ? clamp(inProgress * 1.5, 0, 1) : inProgress;
  const alpha = Math.max(0, baseAlpha * (1 - outProgress));

  let transform: string | undefined = undefined;
  let filter: string | undefined = undefined;

  // 3. Variant Transforms
  switch (animation) {
    case 'slide-up': {
      const yIn = (1 - inProgress) * distance;
      const yOut = outProgress * -distance;
      transform = `translateY(${(yIn + yOut).toFixed(2)}px)`;
      break;
    }

    case 'slide-down': {
      const yIn = (1 - inProgress) * -distance;
      const yOut = outProgress * distance;
      transform = `translateY(${(yIn + yOut).toFixed(2)}px)`;
      break;
    }

    case 'slide-left': {
      const xIn = (1 - inProgress) * distance;
      const xOut = outProgress * -distance;
      transform = `translateX(${(xIn + xOut).toFixed(2)}px)`;
      break;
    }

    case 'slide-right': {
      const xIn = (1 - inProgress) * -distance;
      const xOut = outProgress * distance;
      transform = `translateX(${(xIn + xOut).toFixed(2)}px)`;
      break;
    }

    case 'scale': {
      const sIn = initialScale + (1 - initialScale) * inProgress;
      const s = Math.max(0, sIn - outProgress * 0.1);
      transform = `scale(${s.toFixed(3)})`;
      break;
    }

    case 'pop': {
      const s = Math.max(0, inProgress - outProgress * 0.15);
      transform = `scale(${s.toFixed(3)})`;
      break;
    }

    case 'flip': {
      const deg = (1 - inProgress) * initialRotation - outProgress * initialRotation;
      transform = `perspective(800px) rotateX(${deg.toFixed(2)}deg)`;
      break;
    }

    case 'blur': {
      const blurAmount = (1 - inProgress) * 12 + outProgress * 12;
      filter = `blur(${blurAmount.toFixed(1)}px)`;
      break;
    }

    case 'float': {
      const isSettled = inProgress >= 1 && outProgress === 0;
      const floatOffset = isSettled
        ? Math.sin((currentFrame - effectiveStart) * 0.08) * 6
        : (1 - inProgress) * distance;
      transform = `translateY(${floatOffset.toFixed(2)}px)`;
      break;
    }

    case 'expand': {
      const sIn = (initialScale || 0.88) + (1 - (initialScale || 0.88)) * inProgress;
      const s = Math.max(0, sIn - outProgress * 0.1);
      transform = `scale(${s.toFixed(3)})`;
      break;
    }

    case 'collapse': {
      const sIn = 1.08 - 0.08 * inProgress;
      const s = Math.max(0, sIn - outProgress * 0.1);
      transform = `scale(${s.toFixed(3)})`;
      break;
    }

    case 'fade':
    default:
      break;
  }

  return {
    opacity: alpha,
    transform,
    filter,
    visibility: alpha > 0 ? 'visible' : 'hidden',
  };
};

/**
 * Calculates start delay for staggered card collections.
 */
export const calculateCardCollectionStagger = (
  itemIndex: number,
  staggerDelay: number = 4,
  baseStartFrame: number = 0,
  reverseOrder: boolean = false,
  totalCount: number = 1
): number => {
  const index = reverseOrder ? Math.max(0, totalCount - 1 - itemIndex) : itemIndex;
  return baseStartFrame + index * staggerDelay;
};
