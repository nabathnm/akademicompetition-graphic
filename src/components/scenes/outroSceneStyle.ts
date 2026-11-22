/**
 * OutroScene Mathematical and Layout Engine
 * Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import type {
  OutroSceneAnimationConfig,
  OutroSceneLayout,
} from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { easeOut } from '../../utils/animation/easing.ts';

export interface OutroSlotMetrics {
  opacity: number;
  translateY: number;
  scale: number;
  progress: number;
  isSettled: boolean;
}

export interface OutroSceneKinematics {
  logo: OutroSlotMetrics;
  brand: OutroSlotMetrics;
  tagline: OutroSlotMetrics;
  meta: OutroSlotMetrics;
  logoFloating: number;
}

export interface OutroSceneKinematicsOptions {
  frame: number;
  delay?: number;
  staggerDelay?: number;
  animation?: OutroSceneAnimationConfig;
}

/**
 * Calculates deterministic kinematics for brand logo, brand name, tagline, links, and floating motion.
 */
export function calculateOutroSceneKinematics(
  options: OutroSceneKinematicsOptions,
): OutroSceneKinematics {
  const { frame, delay = 0, staggerDelay: globalStagger = 5, animation } = options;

  const config = animation ?? {};
  const stagger = config.staggerDelay ?? globalStagger;
  const logoAnim = config.logoAnimation ?? 'scale';
  const brandAnim = config.brandAnimation ?? 'slide-up';
  const taglineAnim = config.taglineAnimation ?? 'slide-up';

  const logoStart = delay + (config.logoDelay ?? 0);
  const brandStart = delay + (config.brandDelay ?? stagger * 1);
  const taglineStart = delay + (config.taglineDelay ?? stagger * 2);
  const metaStart = delay + (config.metaDelay ?? stagger * 3);

  const computeSlot = (
    startFrame: number,
    animType: 'scale' | 'pop' | 'slide-up' | 'fade' | 'word-reveal' | 'none' = 'slide-up',
    duration = 18,
    slideDistance = 24,
  ): OutroSlotMetrics => {
    if (animType === 'none') {
      return { opacity: 1, translateY: 0, scale: 1, progress: 1, isSettled: true };
    }

    if (frame < startFrame) {
      return {
        opacity: 0,
        translateY: animType === 'slide-up' ? slideDistance : 0,
        scale: animType === 'scale' || animType === 'pop' ? 0.75 : 1,
        progress: 0,
        isSettled: false,
      };
    }

    const raw = clamp((frame - startFrame) / duration, 0, 1);
    const progress = easeOut(raw);

    return {
      opacity: progress,
      translateY: animType === 'slide-up' ? slideDistance * (1 - progress) : 0,
      scale: animType === 'scale' || animType === 'pop' ? 0.75 + 0.25 * progress : 1,
      progress,
      isSettled: raw >= 1,
    };
  };

  // Continuous subtle logo hover
  const logoFloating = config.floatingLogo !== false ? Math.sin(frame * 0.05) * 6 : 0;

  return {
    logo: computeSlot(logoStart, logoAnim, 22, 28),
    brand: computeSlot(brandStart, brandAnim, 18, 20),
    tagline: computeSlot(taglineStart, taglineAnim, 18, 18),
    meta: computeSlot(metaStart, 'fade', 16, 12),
    logoFloating,
  };
}

export interface OutroResolvedLayout {
  containerStyle: React.CSSProperties;
  logoWrapperStyle: React.CSSProperties;
  brandBlockStyle: React.CSSProperties;
  metaBlockStyle: React.CSSProperties;
  isSplit: boolean;
}

/**
 * Resolves CSS layout styles for the 7 OutroScene layouts.
 */
export function resolveOutroSceneLayout(
  layout: OutroSceneLayout = 'centered-brand',
): OutroResolvedLayout {
  switch (layout) {
    case 'left-aligned':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          textAlign: 'left',
          width: '100%',
          maxWidth: 960,
          margin: '0 auto',
          gap: 20,
        },
        logoWrapperStyle: { marginBottom: 12 },
        brandBlockStyle: { display: 'flex', flexDirection: 'column', gap: 12 },
        metaBlockStyle: { display: 'flex', gap: 20, alignItems: 'center', marginTop: 16 },
        isSplit: false,
      };

    case 'brand-with-cta':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: 1100,
          margin: '0 auto',
          gap: 60,
        },
        logoWrapperStyle: { marginBottom: 16 },
        brandBlockStyle: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          gap: 12,
        },
        metaBlockStyle: {
          flex: 0.9,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 16,
        },
        isSplit: true,
      };

    case 'full-screen-logo':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          height: '100%',
          gap: 24,
        },
        logoWrapperStyle: { transform: 'scale(1.4)', marginBottom: 20 },
        brandBlockStyle: { display: 'flex', flexDirection: 'column', gap: 8 },
        metaBlockStyle: { display: 'flex', gap: 24, alignItems: 'center', marginTop: 12 },
        isSplit: false,
      };

    case 'tagline-above-logo':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          maxWidth: 900,
          margin: '0 auto',
          gap: 20,
        },
        logoWrapperStyle: { order: 2, marginTop: 16 },
        brandBlockStyle: { order: 1, display: 'flex', flexDirection: 'column', gap: 8 },
        metaBlockStyle: { order: 3, display: 'flex', gap: 24, alignItems: 'center', marginTop: 16 },
        isSplit: false,
      };

    case 'logo-above-tagline':
    case 'centered-brand':
    default:
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          maxWidth: 900,
          margin: '0 auto',
          gap: 20,
        },
        logoWrapperStyle: { marginBottom: 12 },
        brandBlockStyle: { display: 'flex', flexDirection: 'column', gap: 10 },
        metaBlockStyle: { display: 'flex', gap: 24, alignItems: 'center', marginTop: 16 },
        isSplit: false,
      };
  }
}
