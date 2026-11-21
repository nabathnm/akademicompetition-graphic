/**
 * AnimatedText Style Calculation
 * Pure mathematical functions determining visual styles and transforms for AnimatedText.
 */

import React from 'react';
import type { AnimatedTextStyleOptions } from './types.ts';
import { interpolateValue } from '../../utils/animation/interpolate.ts';
import { createSpring } from '../../utils/animation/spring.ts';
import { resolveEasing } from '../../utils/animation/easing.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { MOTION } from '../../styles/motion.ts';

export interface CalculatedAnimatedStyle {
  opacity: number;
  transform?: string;
  filter?: string;
  visibility?: React.CSSProperties['visibility'];
}

/**
 * Pure calculation function determining visual style transformations for AnimatedText.
 * Separated from React JSX to enable deterministic unit testing and framework reusability.
 */
export const calculateAnimatedTextStyle = ({
  currentFrame,
  fps,
  variant = 'fade',
  startFrame = 0,
  durationInFrames = MOTION.duration.normal,
  exitFrame,
  exitDurationInFrames = MOTION.duration.fast,
  delay = 0,
  easing = 'easeOutCubic',
  springPreset = 'snappy',
  distance = 40,
  initialScale = 0.85,
  initialRotation = -8,
  initialBlur = 10,
  direction = 'both',
}: AnimatedTextStyleOptions): CalculatedAnimatedStyle => {
  const effectiveStart = startFrame + delay;
  const effectiveDuration = Math.max(0, durationInFrames);

  // 1. Entrance Progress Calculation (0..1)
  let inProgress = 0;

  if (direction === 'out') {
    inProgress = 1;
  } else if (effectiveDuration === 0) {
    inProgress = currentFrame >= effectiveStart ? 1 : 0;
  } else if (currentFrame < effectiveStart) {
    inProgress = 0;
  } else if (currentFrame >= effectiveStart + effectiveDuration) {
    inProgress = 1;
  } else if (variant === 'pop') {
    // Spring physics entrance
    inProgress = createSpring({
      frame: currentFrame,
      fps,
      delay: effectiveStart,
      preset: springPreset,
      from: 0,
      to: 1,
    });
  } else {
    inProgress = interpolateValue({
      frame: currentFrame,
      inputRange: [effectiveStart, effectiveStart + effectiveDuration],
      outputRange: [0, 1],
      easing: resolveEasing(easing),
    });
  }

  // 2. Exit Progress Calculation (0..1)
  let outProgress = 0;
  const hasExit =
    direction !== 'in' &&
    typeof exitFrame === 'number' &&
    (direction === 'out' || exitFrame >= effectiveStart);

  const effectiveExitStart = hasExit ? (exitFrame as number) : Infinity;
  const effectiveExitDuration = Math.max(0, exitDurationInFrames);

  if (!hasExit || currentFrame < effectiveExitStart) {
    outProgress = 0;
  } else if (effectiveExitDuration === 0) {
    outProgress = currentFrame >= effectiveExitStart ? 1 : 0;
  } else if (currentFrame >= effectiveExitStart + effectiveExitDuration) {
    outProgress = 1;
  } else {
    outProgress = interpolateValue({
      frame: currentFrame,
      inputRange: [effectiveExitStart, effectiveExitStart + effectiveExitDuration],
      outputRange: [0, 1],
      easing: resolveEasing(easing),
    });
  }

  // 3. Lifecycle visibility window
  const isBeforeEntrance = direction !== 'out' && currentFrame < effectiveStart;
  const isAfterExit = hasExit && currentFrame >= effectiveExitStart + effectiveExitDuration;

  if (isBeforeEntrance || isAfterExit) {
    return {
      opacity: 0,
      visibility: 'hidden',
    };
  }

  // 4. Variant Transformations
  let calculatedOpacity = clamp((direction === 'out' ? 1 : inProgress) * (1 - outProgress), 0, 1);
  let calculatedTransform: string | undefined = undefined;
  let calculatedFilter: string | undefined = undefined;

  switch (variant) {
    case 'slide-up': {
      const currentY = (1 - inProgress) * distance - outProgress * distance;
      calculatedTransform = `translateY(${currentY.toFixed(2)}px)`;
      break;
    }

    case 'slide-down': {
      const currentY = (inProgress - 1) * distance + outProgress * distance;
      calculatedTransform = `translateY(${currentY.toFixed(2)}px)`;
      break;
    }

    case 'slide-left': {
      const currentX = (1 - inProgress) * distance - outProgress * distance;
      calculatedTransform = `translateX(${currentX.toFixed(2)}px)`;
      break;
    }

    case 'slide-right': {
      const currentX = (inProgress - 1) * distance + outProgress * distance;
      calculatedTransform = `translateX(${currentX.toFixed(2)}px)`;
      break;
    }

    case 'scale': {
      const scaleVal = initialScale + (1 - initialScale) * inProgress - outProgress * (1 - initialScale);
      calculatedTransform = `scale(${Math.max(0, scaleVal).toFixed(3)})`;
      break;
    }

    case 'pop': {
      const springVal = createSpring({
        frame: currentFrame,
        fps,
        delay: effectiveStart,
        preset: springPreset,
        from: initialScale,
        to: 1,
      });
      const popScale = Math.max(0, springVal * (1 - outProgress * (1 - initialScale)));
      calculatedTransform = `scale(${popScale.toFixed(3)})`;
      calculatedOpacity = clamp(1 - outProgress, 0, 1);
      break;
    }

    case 'blur': {
      const currentBlur = initialBlur * (1 - inProgress) + initialBlur * outProgress;
      if (currentBlur > 0.05) {
        calculatedFilter = `blur(${currentBlur.toFixed(2)}px)`;
      }
      break;
    }

    case 'rotate': {
      const currentRot = initialRotation * (1 - inProgress) - initialRotation * outProgress;
      calculatedTransform = `rotate(${currentRot.toFixed(2)}deg)`;
      break;
    }

    case 'fade-slide-up': {
      const currentY = (1 - inProgress) * distance - outProgress * distance;
      calculatedTransform = `translateY(${currentY.toFixed(2)}px)`;
      break;
    }

    case 'fade':
    default: {
      // Pure opacity fade, no transforms
      break;
    }
  }

  return {
    opacity: Number(calculatedOpacity.toFixed(3)),
    transform: calculatedTransform,
    filter: calculatedFilter,
    visibility: calculatedOpacity > 0 ? 'visible' : 'hidden',
  };
};
