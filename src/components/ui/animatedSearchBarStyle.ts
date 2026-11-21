/**
 * AnimatedSearchBar Style & State Calculations
 * Pure mathematical functions determining search bar interaction stages, layout metrics,
 * container entrances, suggestion staggering, and result card transforms.
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import type {
  AnimatedSearchBarStage,
  AnimatedSearchBarVariant,
  AnimatedSearchBarSize,
  AnimatedSearchBarContainerEntrance,
  AnimatedInputVariant,
} from './types.ts';
import { Colors } from '../../styles/colors.ts';
import { Spacing } from '../../styles/spacing.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { easeOutCubic } from '../../utils/animation/easing.ts';

export interface SearchBarStageOptions {
  currentFrame: number;
  startFrame?: number;
  focusFrame?: number;
  typingStartFrame?: number;
  suggestionStartFrame?: number;
  selectionFrame?: number;
  submitFrame?: number;
  loadingStartFrame?: number;
  resultsStartFrame?: number;
}

/**
 * Resolves the deterministic interaction stage of the search bar based on timeline milestones.
 */
export const deriveSearchBarStage = ({
  currentFrame,
  startFrame = 0,
  focusFrame = 10,
  typingStartFrame = 16,
  suggestionStartFrame,
  selectionFrame,
  submitFrame,
  loadingStartFrame,
  resultsStartFrame,
}: SearchBarStageOptions): AnimatedSearchBarStage => {
  if (currentFrame < startFrame) {
    return 'idle';
  }

  // Stage 8: Results revealed
  if (typeof resultsStartFrame === 'number' && currentFrame >= resultsStartFrame) {
    return 'results';
  }

  // Stage 7: Loading feedback
  if (typeof loadingStartFrame === 'number' && currentFrame >= loadingStartFrame) {
    return 'loading';
  }

  // Stage 6: Search submission
  if (typeof submitFrame === 'number' && currentFrame >= submitFrame) {
    return 'submitted';
  }

  // Stage 5: Suggestion selected
  if (typeof selectionFrame === 'number' && currentFrame >= selectionFrame) {
    return 'selected';
  }

  // Stage 4: Suggestions displayed
  if (typeof suggestionStartFrame === 'number' && currentFrame >= suggestionStartFrame) {
    return 'suggestions';
  }

  // Stage 3: Typing query
  if (currentFrame >= typingStartFrame) {
    return 'typing';
  }

  // Stage 2: Input focused
  if (currentFrame >= focusFrame) {
    return 'focus';
  }

  // Stage 1: Container resting / idle
  return 'idle';
};

export interface SearchBarSizeMetrics {
  height: number;
  fontSize: number;
  iconSize: number;
  padding: number;
  gap: number;
  borderRadius: number;
  pillRadius: number;
  dropdownOffset: number;
  cardPadding: number;
}

/**
 * Resolves layout metrics based on proportional size presets.
 */
export const getSearchBarMetrics = (
  size: AnimatedSearchBarSize = 'md'
): SearchBarSizeMetrics => {
  switch (size) {
    case 'sm':
      return {
        height: 36,
        fontSize: 13,
        iconSize: 14,
        padding: Spacing.scale.xs,
        gap: Spacing.scale.xs,
        borderRadius: Spacing.radius.sm,
        pillRadius: Spacing.radius.full,
        dropdownOffset: Spacing.scale.xs,
        cardPadding: Spacing.scale.sm,
      };

    case 'lg':
      return {
        height: 52,
        fontSize: 17,
        iconSize: 20,
        padding: Spacing.scale.md,
        gap: Spacing.scale.md,
        borderRadius: Spacing.radius.lg,
        pillRadius: Spacing.radius.full,
        dropdownOffset: Spacing.scale.md,
        cardPadding: Spacing.scale.lg,
      };

    case 'md':
    default:
      return {
        height: 44,
        fontSize: 15,
        iconSize: 16,
        padding: Spacing.scale.sm,
        gap: Spacing.scale.sm,
        borderRadius: Spacing.radius.md,
        pillRadius: Spacing.radius.full,
        dropdownOffset: Spacing.scale.sm,
        cardPadding: Spacing.scale.md,
      };
  }
};

/**
 * Maps search bar visual variant to inner AnimatedInput variant.
 */
export const mapSearchBarVariantToInput = (
  variant: AnimatedSearchBarVariant = 'outlined'
): AnimatedInputVariant => {
  switch (variant) {
    case 'minimal':
      return 'minimal';
    case 'filled':
      return 'filled';
    case 'rounded':
      return 'rounded';
    case 'expanded':
    case 'outlined':
    default:
      return 'outlined';
  }
};

export interface ContainerEntranceOptions {
  currentFrame: number;
  startFrame?: number;
  entrance?: AnimatedSearchBarContainerEntrance;
  duration?: number;
  width?: string | number;
  maxWidth?: string | number;
}

export interface ContainerEntranceResult {
  opacity: number;
  transform?: string;
  visibility: 'visible' | 'hidden';
  width: string | number;
  maxWidth: string | number;
}

/**
 * Computes deterministic container entrance styles.
 */
export const calculateContainerEntranceStyles = ({
  currentFrame,
  startFrame = 0,
  entrance = 'fade-in',
  duration = 12,
  width = '100%',
  maxWidth = 640,
}: ContainerEntranceOptions): ContainerEntranceResult => {
  if (entrance === 'none') {
    return {
      opacity: 1,
      visibility: 'visible',
      width,
      maxWidth,
    };
  }

  if (currentFrame < startFrame) {
    return {
      opacity: 0,
      visibility: 'hidden',
      width,
      maxWidth,
    };
  }

  const safeDuration = Math.max(1, duration);
  const rawProgress = clamp((currentFrame - startFrame) / safeDuration, 0, 1);
  const progress = easeOutCubic(rawProgress);

  switch (entrance) {
    case 'slide-in': {
      const yOffset = (1 - progress) * -16;
      return {
        opacity: progress,
        transform: `translateY(${yOffset.toFixed(2)}px)`,
        visibility: 'visible',
        width,
        maxWidth,
      };
    }

    case 'scale-in': {
      const scale = 0.94 + 0.06 * progress;
      return {
        opacity: progress,
        transform: `scale(${scale.toFixed(3)})`,
        visibility: 'visible',
        width,
        maxWidth,
      };
    }

    case 'expand-width': {
      const scaleX = 0.65 + 0.35 * progress;
      return {
        opacity: Math.min(1, 0.3 + 0.7 * progress),
        transform: `scaleX(${scaleX.toFixed(3)})`,
        visibility: 'visible',
        width,
        maxWidth,
      };
    }

    case 'fade-in':
    default: {
      return {
        opacity: progress,
        visibility: 'visible',
        width,
        maxWidth,
      };
    }
  }
};

export interface DropdownEntranceOptions {
  currentFrame: number;
  startFrame: number;
  duration?: number;
}

/**
 * Computes dropdown panel entrance animation styles.
 */
export const calculateDropdownEntranceStyles = ({
  currentFrame,
  startFrame,
  duration = 10,
}: DropdownEntranceOptions): React.CSSProperties => {
  if (currentFrame < startFrame) {
    return { opacity: 0, visibility: 'hidden' };
  }

  const safeDuration = Math.max(1, duration);
  const raw = clamp((currentFrame - startFrame) / safeDuration, 0, 1);
  const progress = easeOutCubic(raw);
  const yOffset = (1 - progress) * -8;

  return {
    opacity: progress,
    transform: `translateY(${yOffset.toFixed(2)}px)`,
    visibility: 'visible',
  };
};

export interface SuggestionItemStyleOptions {
  index: number;
  currentFrame: number;
  startFrame: number;
  staggerDelay?: number;
  isSelected?: boolean;
}

/**
 * Computes staggered suggestion item style and selection highlight.
 */
export const calculateSuggestionItemStyles = ({
  index,
  currentFrame,
  startFrame,
  staggerDelay = 3,
  isSelected = false,
}: SuggestionItemStyleOptions): React.CSSProperties => {
  const itemStart = startFrame + index * staggerDelay;
  if (currentFrame < itemStart) {
    return {
      opacity: 0,
      transform: 'translateY(-4px)',
      visibility: 'hidden',
    };
  }

  const raw = clamp((currentFrame - itemStart) / 8, 0, 1);
  const progress = easeOutCubic(raw);
  const yOffset = (1 - progress) * -4;

  const bg: string = isSelected ? 'rgba(39, 110, 241, 0.16)' : 'transparent';
  const border: string = isSelected ? `1px solid ${Colors.accent.brand}` : '1px solid transparent';
  const textColor: string = isSelected ? Colors.text.primary : Colors.text.secondary;

  return {
    opacity: progress,
    transform: `translateY(${yOffset.toFixed(2)}px)`,
    backgroundColor: bg,
    border,
    color: textColor,
    visibility: 'visible',
  };
};

export interface ResultCardStyleOptions {
  index: number;
  currentFrame: number;
  resultsStartFrame: number;
  staggerDelay?: number;
}

/**
 * Computes staggered result card animation styles.
 */
export const calculateResultCardStyles = ({
  index,
  currentFrame,
  resultsStartFrame,
  staggerDelay = 4,
}: ResultCardStyleOptions): React.CSSProperties => {
  const cardStart = resultsStartFrame + index * staggerDelay;
  if (currentFrame < cardStart) {
    return {
      opacity: 0,
      transform: 'translateY(12px)',
      visibility: 'hidden',
    };
  }

  const raw = clamp((currentFrame - cardStart) / 10, 0, 1);
  const progress = easeOutCubic(raw);
  const yOffset = (1 - progress) * 12;

  return {
    opacity: progress,
    transform: `translateY(${yOffset.toFixed(2)}px)`,
    visibility: 'visible',
  };
};
