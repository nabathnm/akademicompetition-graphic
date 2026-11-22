/**
 * CallToActionScene Mathematical and Layout Engine
 * Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import type {
  CallToActionAnimationConfig,
  CallToActionSceneLayout,
} from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { easeOut } from '../../utils/animation/easing.ts';

export interface CallToActionSlotMetrics {
  opacity: number;
  translateY: number;
  scale: number;
  progress: number;
  isSettled: boolean;
}

export interface CallToActionSceneKinematics {
  brand: CallToActionSlotMetrics;
  headline: CallToActionSlotMetrics;
  description: CallToActionSlotMetrics;
  buttons: CallToActionSlotMetrics;
  visual: CallToActionSlotMetrics;
  buttonPulse: number;
}

export interface CallToActionSceneKinematicsOptions {
  frame: number;
  delay?: number;
  staggerDelay?: number;
  animation?: CallToActionAnimationConfig;
}

/**
 * Calculates deterministic kinematics for brand, headline, description, action buttons, and product visual.
 */
export function calculateCallToActionSceneKinematics(
  options: CallToActionSceneKinematicsOptions,
): CallToActionSceneKinematics {
  const { frame, delay = 0, staggerDelay: globalStagger = 4, animation } = options;

  const config = animation ?? {};
  const stagger = config.staggerDelay ?? globalStagger;
  const btnAnim = config.buttonAnimation ?? 'pop';
  const visualAnim = config.visualAnimation ?? 'scale';

  const brandStart = delay;
  const headlineStart = delay + (config.headlineDelay ?? stagger * 1);
  const descStart = delay + (config.descriptionDelay ?? stagger * 2);
  const btnStart = delay + (config.buttonDelay ?? stagger * 3);
  const visualStart = delay + (config.visualDelay ?? stagger * 2);

  const computeSlot = (
    startFrame: number,
    animType: 'slide-up' | 'pop' | 'scale' | 'fade' | 'none' = 'slide-up',
    duration = 18,
    slideDistance = 24,
  ): CallToActionSlotMetrics => {
    if (animType === 'none') {
      return { opacity: 1, translateY: 0, scale: 1, progress: 1, isSettled: true };
    }

    if (frame < startFrame) {
      return {
        opacity: 0,
        translateY: animType === 'slide-up' ? slideDistance : 0,
        scale: animType === 'pop' || animType === 'scale' ? 0.75 : 1,
        progress: 0,
        isSettled: false,
      };
    }

    const raw = clamp((frame - startFrame) / duration, 0, 1);
    const progress = easeOut(raw);

    return {
      opacity: progress,
      translateY: animType === 'slide-up' ? slideDistance * (1 - progress) : 0,
      scale: animType === 'pop' || animType === 'scale' ? 0.75 + 0.25 * progress : 1,
      progress,
      isSettled: raw >= 1,
    };
  };

  // Button pulse harmonic sine wave
  const buttonPulse = config.buttonPulse !== false ? 1 + Math.sin(frame * 0.1) * 0.025 : 1;

  return {
    brand: computeSlot(brandStart, 'fade', 14, 12),
    headline: computeSlot(headlineStart, 'slide-up', 20, 30),
    description: computeSlot(descStart, 'slide-up', 18, 20),
    buttons: computeSlot(btnStart, btnAnim, 18, 24),
    visual: computeSlot(visualStart, visualAnim, 22, 30),
    buttonPulse,
  };
}

export interface CallToActionResolvedLayout {
  containerStyle: React.CSSProperties;
  textColStyle: React.CSSProperties;
  visualColStyle?: React.CSSProperties;
  buttonGroupStyle: React.CSSProperties;
  isSplit: boolean;
}

/**
 * Resolves CSS layout styles for the 6 CallToActionScene layouts.
 */
export function resolveCallToActionSceneLayout(
  layout: CallToActionSceneLayout = 'centered',
): CallToActionResolvedLayout {
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
        },
        textColStyle: { display: 'flex', flexDirection: 'column', gap: 20 },
        buttonGroupStyle: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          marginTop: 12,
        },
        isSplit: false,
      };

    case 'cta-with-product':
    case 'cta-with-device':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          gap: 60,
        },
        textColStyle: {
          flex: 1.1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          gap: 20,
        },
        visualColStyle: {
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        },
        buttonGroupStyle: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          marginTop: 12,
        },
        isSplit: true,
      };

    case 'full-screen-typography':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          gap: 32,
        },
        textColStyle: { display: 'flex', flexDirection: 'column', gap: 16 },
        buttonGroupStyle: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
        },
        isSplit: false,
      };

    case 'custom':
      return {
        containerStyle: { display: 'flex', width: '100%', height: '100%' },
        textColStyle: {},
        buttonGroupStyle: { display: 'flex', gap: 16 },
        isSplit: false,
      };

    case 'centered':
    default:
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          maxWidth: 960,
          margin: '0 auto',
          gap: 24,
        },
        textColStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        },
        buttonGroupStyle: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          marginTop: 12,
        },
        isSplit: false,
      };
  }
}
