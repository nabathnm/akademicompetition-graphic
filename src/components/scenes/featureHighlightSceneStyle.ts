/**
 * FeatureHighlightScene Mathematical and Layout Engine
 * Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import type {
  FeatureAnnotationItem,
  FeatureHighlightAnimationConfig,
  FeatureHighlightLayout,
} from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { easeOut } from '../../utils/animation/easing.ts';

export interface FeatureHighlightSlotMetrics {
  opacity: number;
  translateY: number;
  scale: number;
  progress: number;
  isSettled: boolean;
}

export interface FeatureHighlightKinematics {
  title: FeatureHighlightSlotMetrics;
  description: FeatureHighlightSlotMetrics;
  label: FeatureHighlightSlotMetrics;
  benefit: FeatureHighlightSlotMetrics;
  visual: FeatureHighlightSlotMetrics;
  annotations: FeatureHighlightSlotMetrics[];
  benefitPulse: number;
}

export interface FeatureHighlightKinematicsOptions {
  frame: number;
  delay?: number;
  staggerDelay?: number;
  animation?: FeatureHighlightAnimationConfig;
  annotationCount?: number;
}

/**
 * Calculates deterministic kinematics for feature visual, headline, benefit pill, and annotations.
 */
export function calculateFeatureHighlightKinematics(
  options: FeatureHighlightKinematicsOptions,
): FeatureHighlightKinematics {
  const { frame, delay = 0, staggerDelay: globalStagger = 4, animation, annotationCount = 0 } = options;

  const config = animation ?? {};
  const stagger = config.staggerDelay ?? globalStagger;
  const visualAnim = config.visualAnimation ?? 'slide-up';
  const textAnim = config.textAnimation ?? 'slide-up';
  const annoAnim = config.annotationAnimation ?? 'pop';

  const labelStart = delay;
  const titleStart = delay + (config.titleDelay ?? stagger * 1);
  const descStart = delay + (config.descriptionDelay ?? stagger * 2);
  const benefitStart = delay + (config.benefitDelay ?? stagger * 3);
  const visualStart = delay + (config.visualDelay ?? stagger * 1);
  const annoStart = delay + (config.annotationsDelay ?? stagger * 4);

  const computeSlot = (
    startFrame: number,
    animType: 'slide-up' | 'scale' | 'pop' | 'fade' | 'slide' | 'none',
    duration = 18,
    slideDistance = 30,
  ): FeatureHighlightSlotMetrics => {
    if (animType === 'none') {
      return { opacity: 1, translateY: 0, scale: 1, progress: 1, isSettled: true };
    }

    if (frame < startFrame) {
      return {
        opacity: 0,
        translateY: animType === 'slide-up' || animType === 'slide' ? slideDistance : 0,
        scale: animType === 'scale' || animType === 'pop' ? 0.75 : 1,
        progress: 0,
        isSettled: false,
      };
    }

    const raw = clamp((frame - startFrame) / duration, 0, 1);
    const progress = easeOut(raw);

    return {
      opacity: progress,
      translateY: animType === 'slide-up' || animType === 'slide' ? slideDistance * (1 - progress) : 0,
      scale: animType === 'scale' || animType === 'pop' ? 0.75 + 0.25 * progress : 1,
      progress,
      isSettled: raw >= 1,
    };
  };

  // Benefit badge pulse
  const benefitPulse = config.highlightPulse !== false ? 1 + Math.sin(frame * 0.1) * 0.03 : 1;

  // Staggered annotations
  const annotationSlots: FeatureHighlightSlotMetrics[] = [];
  for (let i = 0; i < annotationCount; i++) {
    annotationSlots.push(computeSlot(annoStart + i * stagger, annoAnim, 16, 20));
  }

  return {
    label: computeSlot(labelStart, textAnim, 16, 20),
    title: computeSlot(titleStart, textAnim, 20, 35),
    description: computeSlot(descStart, textAnim, 18, 20),
    benefit: computeSlot(benefitStart, textAnim, 18, 20),
    visual: computeSlot(visualStart, visualAnim, 22, 40),
    annotations: annotationSlots,
    benefitPulse,
  };
}

/**
 * Computes container and column layout styles for feature highlight variations.
 */
export function resolveFeatureHighlightLayout(layout: FeatureHighlightLayout = 'text-left'): {
  containerStyle: React.CSSProperties;
  textColStyle: React.CSSProperties;
  visualColStyle: React.CSSProperties;
} {
  switch (layout) {
    case 'text-right':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          gap: '60px',
        },
        visualColStyle: {
          flex: '1 1 50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        },
        textColStyle: {
          flex: '1 1 50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          maxWidth: '650px',
        },
      };

    case 'centered':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: '36px',
          textAlign: 'center',
        },
        textColStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '820px',
          zIndex: 2,
        },
        visualColStyle: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: '100%',
          maxWidth: '750px',
          zIndex: 1,
        },
      };

    case 'full-visual':
      return {
        containerStyle: {
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        },
        visualColStyle: {
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        textColStyle: {
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'rgba(9, 13, 22, 0.82)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '40px 48px',
          maxWidth: '650px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        },
      };

    case 'with-annotations':
    case 'text-left':
    default:
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          gap: '60px',
        },
        textColStyle: {
          flex: '1 1 50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          maxWidth: '650px',
        },
        visualColStyle: {
          flex: '1 1 50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        },
      };
  }
}

/**
 * Computes CSS positioning for feature annotations.
 */
export function resolveAnnotationPosition(item: FeatureAnnotationItem): React.CSSProperties {
  if (item.x !== undefined && item.y !== undefined) {
    return {
      position: 'absolute',
      left: `${item.x}%`,
      top: `${item.y}%`,
    };
  }

  switch (item.position) {
    case 'top':
      return { position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)' };
    case 'bottom':
      return { position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)' };
    case 'left':
      return { position: 'absolute', top: '50%', left: '0%', transform: 'translateY(-50%)' };
    case 'right':
    default:
      return { position: 'absolute', top: '50%', right: '0%', transform: 'translateY(-50%)' };
  }
}
