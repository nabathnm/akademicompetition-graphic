/**
 * SceneContainer Mathematical and Layout Styling Engine
 * Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import type {
  SceneAlignment,
  SceneAnimationConfig,
  SceneAnimationMetrics,
  SceneAnimationType,
  SceneHorizontalAlignment,
  SceneLayoutMode,
  ScenePadding,
  SceneSlideDirection,
  SceneVerticalAlignment,
} from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { easeOut, resolveEasing } from '../../utils/animation/easing.ts';

export const DEFAULT_SAFE_AREA_PX = 60;

/**
 * Resolves width and height into valid CSS dimension values.
 */
export function resolveSceneDimension(dim?: number | string, fallback: number | string = '100%'): string | number {
  if (dim === undefined || dim === null) return fallback;
  if (typeof dim === 'number') return `${dim}px`;
  return dim;
}

/**
 * Formats padding values into uniform or directional CSS pixel values.
 */
export function resolveScenePadding(
  padding?: ScenePadding,
  safeArea?: boolean | number,
): {
  paddingTop: number | string;
  paddingBottom: number | string;
  paddingLeft: number | string;
  paddingRight: number | string;
} {
  const safeMargin = safeArea === true ? DEFAULT_SAFE_AREA_PX : typeof safeArea === 'number' ? safeArea : 0;

  let top = 0;
  let bottom = 0;
  let left = 0;
  let right = 0;

  if (typeof padding === 'number') {
    top = padding;
    bottom = padding;
    left = padding;
    right = padding;
  } else if (typeof padding === 'string') {
    // If string padding is supplied, return directly
    return {
      paddingTop: safeMargin ? `calc(${padding} + ${safeMargin}px)` : padding,
      paddingBottom: safeMargin ? `calc(${padding} + ${safeMargin}px)` : padding,
      paddingLeft: safeMargin ? `calc(${padding} + ${safeMargin}px)` : padding,
      paddingRight: safeMargin ? `calc(${padding} + ${safeMargin}px)` : padding,
    };
  } else if (padding && typeof padding === 'object') {
    const parseVal = (v?: number | string) => (typeof v === 'number' ? v : 0);
    top = parseVal(padding.top);
    bottom = parseVal(padding.bottom);
    left = parseVal(padding.left);
    right = parseVal(padding.right);
  }

  return {
    paddingTop: top + safeMargin,
    paddingBottom: bottom + safeMargin,
    paddingLeft: left + safeMargin,
    paddingRight: right + safeMargin,
  };
}

/**
 * Resolves flexbox alignItems and justifyContent for given horizontal and vertical alignments.
 */
export function resolveAlignmentProperties(
  horizontal?: SceneHorizontalAlignment,
  vertical?: SceneVerticalAlignment,
  layout: SceneLayoutMode = 'centered',
): {
  alignItems: string;
  justifyContent: string;
} {
  let alignItems = 'center';
  let justifyContent = 'center';

  if (layout === 'top-aligned') {
    justifyContent = 'flex-start';
  } else if (layout === 'bottom-aligned') {
    justifyContent = 'flex-end';
  }

  if (horizontal) {
    if (horizontal === 'left') alignItems = 'flex-start';
    else if (horizontal === 'right') alignItems = 'flex-end';
    else if (horizontal === 'center') alignItems = 'center';
  }

  if (vertical) {
    if (vertical === 'top') justifyContent = 'flex-start';
    else if (vertical === 'bottom') justifyContent = 'flex-end';
    else if (vertical === 'center') justifyContent = 'center';
    else if (vertical === 'space-between') justifyContent = 'space-between';
  }

  return { alignItems, justifyContent };
}

/**
 * Computes container layout styles based on layout mode and alignments.
 */
export function resolveSceneLayoutStyles(
  layout: SceneLayoutMode = 'centered',
  alignment?: SceneAlignment,
  horizontalAlignment?: SceneHorizontalAlignment,
  verticalAlignment?: SceneVerticalAlignment,
): React.CSSProperties {
  const hAlign = horizontalAlignment ?? alignment?.horizontal;
  const vAlign = verticalAlignment ?? alignment?.vertical;
  const { alignItems, justifyContent } = resolveAlignmentProperties(hAlign, vAlign, layout);

  switch (layout) {
    case 'full-bleed':
      return {
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'block',
      };

    case 'split':
      return {
        display: 'flex',
        flexDirection: 'row',
        alignItems: alignItems || 'center',
        justifyContent: vAlign ? justifyContent : 'space-between',
        width: '100%',
        height: '100%',
        gap: '48px',
      };

    case 'top-aligned':
      return {
        display: 'flex',
        flexDirection: 'column',
        alignItems,
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
      };

    case 'bottom-aligned':
      return {
        display: 'flex',
        flexDirection: 'column',
        alignItems,
        justifyContent: 'flex-end',
        width: '100%',
        height: '100%',
      };

    case 'custom':
      return {
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'block',
      };

    case 'centered':
    default:
      return {
        display: 'flex',
        flexDirection: 'column',
        alignItems,
        justifyContent,
        width: '100%',
        height: '100%',
      };
  }
}

export interface SceneAnimationCalculationOptions {
  frame: number;
  durationInFrames?: number;
  delay?: number;
  animation?: SceneAnimationConfig | SceneAnimationType;
}

/**
 * Calculates deterministic frame-accurate scene entrance and exit animation metrics.
 */
export function calculateSceneAnimationMetrics(options: SceneAnimationCalculationOptions): SceneAnimationMetrics {
  const { frame, durationInFrames, delay = 0, animation } = options;

  let animConfig: SceneAnimationConfig = {};
  if (typeof animation === 'string') {
    animConfig = { type: animation };
  } else if (animation && typeof animation === 'object') {
    animConfig = animation;
  }

  const {
    type = 'none',
    enterDuration = 15,
    enterDelay = 0,
    exitDuration = 0,
    slideDirection = 'bottom' as SceneSlideDirection,
    slideDistance = 60,
    initialScale = type === 'zoom' ? 0.5 : 0.9,
    finalScale = 1.0,
    initialOpacity = 0,
    easing,
  } = animConfig;

  if (type === 'none') {
    return {
      opacity: 1,
      translateX: 0,
      translateY: 0,
      scale: 1,
      progress: 1,
      phase: 'active',
    };
  }

  const easeFn = (typeof easing === 'function' ? easing : resolveEasing(easing ?? easeOut)) ?? easeOut;
  const startFrame = delay + enterDelay;
  const enterEndFrame = startFrame + enterDuration;

  let exitStartFrame = Infinity;
  let exitEndFrame = Infinity;
  if (durationInFrames && exitDuration > 0) {
    exitEndFrame = delay + durationInFrames;
    exitStartFrame = exitEndFrame - exitDuration;
  }

  // Phase Determination
  let phase: SceneAnimationMetrics['phase'] = 'active';
  if (frame < startFrame) {
    phase = 'pending';
  } else if (frame < enterEndFrame) {
    phase = 'enter';
  } else if (frame >= exitEndFrame) {
    phase = 'complete';
  } else if (frame >= exitStartFrame) {
    phase = 'exit';
  } else {
    phase = 'active';
  }

  // Pending
  if (phase === 'pending') {
    let pendingTx = 0;
    let pendingTy = 0;
    if (type === 'slide') {
      if (slideDirection === 'bottom') pendingTy = slideDistance;
      else if (slideDirection === 'top') pendingTy = -slideDistance;
      else if (slideDirection === 'left') pendingTx = -slideDistance;
      else if (slideDirection === 'right') pendingTx = slideDistance;
    }
    return {
      opacity: initialOpacity,
      translateX: pendingTx,
      translateY: pendingTy,
      scale: type === 'scale' || type === 'zoom' ? initialScale : 1,
      progress: 0,
      phase: 'pending',
    };
  }

  // Complete
  if (phase === 'complete') {
    return {
      opacity: 0,
      translateX: 0,
      translateY: 0,
      scale: 1,
      progress: 1,
      phase: 'complete',
    };
  }

  // Exit Animation
  if (phase === 'exit') {
    const rawExitProgress = clamp((frame - exitStartFrame) / exitDuration, 0, 1);
    const exitProgress = easeFn(rawExitProgress);
    const opacity = 1 - exitProgress;
    let translateX = 0;
    let translateY = 0;
    let scale = 1;

    if (type === 'slide') {
      if (slideDirection === 'bottom') translateY = -slideDistance * exitProgress;
      else if (slideDirection === 'top') translateY = slideDistance * exitProgress;
      else if (slideDirection === 'left') translateX = slideDistance * exitProgress;
      else if (slideDirection === 'right') translateX = -slideDistance * exitProgress;
    } else if (type === 'scale' || type === 'zoom') {
      scale = 1 - (1 - initialScale) * exitProgress;
    }

    return {
      opacity,
      translateX,
      translateY,
      scale,
      progress: exitProgress,
      phase: 'exit',
    };
  }

  // Enter Animation
  if (phase === 'enter') {
    const rawProgress = clamp((frame - startFrame) / enterDuration, 0, 1);
    const enterProgress = easeFn(rawProgress);

    const opacity = initialOpacity + (1 - initialOpacity) * enterProgress;
    let translateX = 0;
    let translateY = 0;
    let scale = 1;

    if (type === 'slide') {
      if (slideDirection === 'bottom') translateY = slideDistance * (1 - enterProgress);
      else if (slideDirection === 'top') translateY = -slideDistance * (1 - enterProgress);
      else if (slideDirection === 'left') translateX = -slideDistance * (1 - enterProgress);
      else if (slideDirection === 'right') translateX = slideDistance * (1 - enterProgress);
    } else if (type === 'scale' || type === 'zoom') {
      scale = initialScale + (finalScale - initialScale) * enterProgress;
    }

    return {
      opacity,
      translateX,
      translateY,
      scale,
      progress: enterProgress,
      phase: 'enter',
    };
  }

  // Active / Settled
  return {
    opacity: 1,
    translateX: 0,
    translateY: 0,
    scale: finalScale,
    progress: 1,
    phase: 'active',
  };
}
