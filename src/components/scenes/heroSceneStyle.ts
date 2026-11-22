/**
 * HeroScene Layout and Stagger Kinematics Engine
 * Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import type { HeroSceneAnimationConfig, HeroSceneLayout } from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { easeOut } from '../../utils/animation/easing.ts';

export interface HeroStaggerSlotMetrics {
  opacity: number;
  translateY: number;
  scale: number;
  progress: number;
  isSettled: boolean;
}

export interface HeroStaggerMetrics {
  eyebrow: HeroStaggerSlotMetrics;
  headline: HeroStaggerSlotMetrics;
  subtitle: HeroStaggerSlotMetrics;
  description: HeroStaggerSlotMetrics;
  cta: HeroStaggerSlotMetrics;
  visual: HeroStaggerSlotMetrics;
  decorations: HeroStaggerSlotMetrics;
  floatOffset: number;
}

export interface HeroStaggerOptions {
  frame: number;
  delay?: number;
  staggerDelay?: number;
  animation?: HeroSceneAnimationConfig;
}

/**
 * Calculates deterministic staggered entrance metrics for all hero scene slots.
 */
export function calculateHeroStaggerMetrics(options: HeroStaggerOptions): HeroStaggerMetrics {
  const { frame, delay = 0, staggerDelay: globalStagger = 4, animation } = options;

  const config = animation ?? {};
  const baseStagger = config.staggerDelay ?? globalStagger;
  const textAnimStyle = config.textAnimation ?? 'slide-up';
  const visualAnimStyle = config.visualAnimation ?? 'scale';

  // Helper to compute slot metrics
  const computeSlot = (
    startFrame: number,
    animType: 'slide-up' | 'scale' | 'fade' | 'none',
    duration = 18,
    slideDistance = 30,
  ): HeroStaggerSlotMetrics => {
    if (animType === 'none') {
      return { opacity: 1, translateY: 0, scale: 1, progress: 1, isSettled: true };
    }

    if (frame < startFrame) {
      return {
        opacity: 0,
        translateY: animType === 'slide-up' ? slideDistance : 0,
        scale: animType === 'scale' ? 0.85 : 1,
        progress: 0,
        isSettled: false,
      };
    }

    const rawProgress = clamp((frame - startFrame) / duration, 0, 1);
    const progress = easeOut(rawProgress);

    const opacity = progress;
    const translateY = animType === 'slide-up' ? slideDistance * (1 - progress) : 0;
    const scale = animType === 'scale' ? 0.85 + 0.15 * progress : 1;

    return {
      opacity,
      translateY,
      scale,
      progress,
      isSettled: rawProgress >= 1,
    };
  };

  const eyebrowStart = delay + (config.eyebrowDelay ?? 0);
  const headlineStart = delay + (config.headlineDelay ?? baseStagger * 1);
  const subtitleStart = delay + (config.subtitleDelay ?? baseStagger * 2);
  const descriptionStart = delay + (config.descriptionDelay ?? baseStagger * 3);
  const ctaStart = delay + (config.ctaDelay ?? baseStagger * 4);
  const visualStart = delay + (config.visualDelay ?? baseStagger * 2);
  const decoStart = delay + (config.decorativeDelay ?? 0);

  // Subtle floating sine wave for decorative elements
  const floatOffset = config.floatingDecorations !== false ? Math.sin(frame * 0.08) * 8 : 0;

  return {
    eyebrow: computeSlot(eyebrowStart, textAnimStyle, 16, 20),
    headline: computeSlot(headlineStart, textAnimStyle, 20, 35),
    subtitle: computeSlot(subtitleStart, textAnimStyle, 18, 25),
    description: computeSlot(descriptionStart, textAnimStyle, 18, 20),
    cta: computeSlot(ctaStart, textAnimStyle, 18, 20),
    visual: computeSlot(visualStart, visualAnimStyle, 24, 40),
    decorations: computeSlot(decoStart, 'fade', 20, 0),
    floatOffset,
  };
}

/**
 * Returns grid and flex arrangements for different hero scene layout variations.
 */
export function resolveHeroLayoutStyles(layout: HeroSceneLayout = 'split-left'): {
  containerStyle: React.CSSProperties;
  textColStyle: React.CSSProperties;
  visualColStyle: React.CSSProperties;
} {
  switch (layout) {
    case 'centered':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          height: '100%',
          gap: '40px',
        },
        textColStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '850px',
        },
        visualColStyle: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '750px',
        },
      };

    case 'split-right':
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
        textColStyle: {
          flex: '1 1 50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          maxWidth: '680px',
        },
        visualColStyle: {
          flex: '1 1 50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '700px',
        },
      };

    case 'full-screen-visual':
      return {
        containerStyle: {
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        },
        textColStyle: {
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'rgba(10, 15, 26, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '48px',
          maxWidth: '650px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
        },
        visualColStyle: {
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      };

    case 'custom':
      return {
        containerStyle: {
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'block',
        },
        textColStyle: { position: 'relative', zIndex: 2 },
        visualColStyle: { position: 'relative', zIndex: 1 },
      };

    case 'split-left':
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
          maxWidth: '680px',
        },
        visualColStyle: {
          flex: '1 1 50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '700px',
        },
      };
  }
}
