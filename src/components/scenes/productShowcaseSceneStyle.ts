/**
 * ProductShowcaseScene Mathematical and Layout Engine
 * Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import type {
  ProductDetailItem,
  ProductShowcaseAnimationConfig,
  ProductShowcaseLayout,
} from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { easeOut } from '../../utils/animation/easing.ts';

export interface ProductShowcaseSlotMetrics {
  opacity: number;
  translateY: number;
  scale: number;
  progress: number;
  isSettled: boolean;
}

export interface ProductShowcaseKinematics {
  product: ProductShowcaseSlotMetrics;
  title: ProductShowcaseSlotMetrics;
  subtitle: ProductShowcaseSlotMetrics;
  description: ProductShowcaseSlotMetrics;
  label: ProductShowcaseSlotMetrics;
  supportingText: ProductShowcaseSlotMetrics;
  details: ProductShowcaseSlotMetrics[];
  floatY: number;
  tiltAngle: number;
}

export interface ProductShowcaseKinematicsOptions {
  frame: number;
  delay?: number;
  animation?: ProductShowcaseAnimationConfig;
  detailCount?: number;
}

/**
 * Calculates deterministic kinematics for product visual, typography, and detail badges.
 */
export function calculateProductShowcaseKinematics(
  options: ProductShowcaseKinematicsOptions,
): ProductShowcaseKinematics {
  const { frame, delay = 0, animation, detailCount = 0 } = options;

  const config = animation ?? {};
  const stagger = config.staggerDelay ?? 4;
  const prodAnim = config.productEntrance ?? 'scale';
  const prodDuration = config.productDuration ?? 20;
  const textAnim = config.textEntrance ?? 'slide-up';
  const textStart = delay + (config.textDelay ?? 0);
  const detailsStart = delay + (config.detailsDelay ?? stagger * 3);

  // Helper for computing slot metrics
  const computeSlot = (
    startFrame: number,
    animType: 'slide-up' | 'scale' | 'fade' | 'none',
    duration = 18,
    slideDistance = 30,
  ): ProductShowcaseSlotMetrics => {
    if (animType === 'none') {
      return { opacity: 1, translateY: 0, scale: 1, progress: 1, isSettled: true };
    }

    if (frame < startFrame) {
      return {
        opacity: 0,
        translateY: animType === 'slide-up' ? slideDistance : 0,
        scale: animType === 'scale' ? 0.8 : 1,
        progress: 0,
        isSettled: false,
      };
    }

    const raw = clamp((frame - startFrame) / duration, 0, 1);
    const progress = easeOut(raw);

    return {
      opacity: progress,
      translateY: animType === 'slide-up' ? slideDistance * (1 - progress) : 0,
      scale: animType === 'scale' ? 0.8 + 0.2 * progress : 1,
      progress,
      isSettled: raw >= 1,
    };
  };

  // Product visual entrance
  const productSlot = computeSlot(delay, prodAnim, prodDuration, 40);

  // Continuous floating hover sine wave
  const floatingOffset = config.floatingOffset ?? 10;
  const floatingSpeed = config.floatingSpeed ?? 0.06;
  const floatY = config.productFloating !== false ? Math.sin(frame * floatingSpeed) * floatingOffset : 0;

  // Continuous subtle tilt angle
  const tiltAngle = config.productRotation ? Math.sin(frame * 0.04) * 2.5 : 0;

  // Typography stagger
  const labelSlot = computeSlot(textStart, textAnim, 16, 20);
  const titleSlot = computeSlot(textStart + stagger * 1, textAnim, 20, 35);
  const subtitleSlot = computeSlot(textStart + stagger * 2, textAnim, 18, 25);
  const descriptionSlot = computeSlot(textStart + stagger * 3, textAnim, 18, 20);
  const supportingSlot = computeSlot(textStart + stagger * 4, textAnim, 16, 15);

  // Floating detail badges stagger
  const detailsSlots: ProductShowcaseSlotMetrics[] = [];
  for (let i = 0; i < detailCount; i++) {
    detailsSlots.push(computeSlot(detailsStart + i * stagger, 'scale', 16, 15));
  }

  return {
    product: productSlot,
    title: titleSlot,
    subtitle: subtitleSlot,
    description: descriptionSlot,
    label: labelSlot,
    supportingText: supportingSlot,
    details: detailsSlots,
    floatY,
    tiltAngle,
  };
}

/**
 * Computes container and column layout styles for different showcase layouts.
 */
export function resolveProductShowcaseLayout(layout: ProductShowcaseLayout = 'center-product'): {
  containerStyle: React.CSSProperties;
  textColStyle: React.CSSProperties;
  visualColStyle: React.CSSProperties;
} {
  switch (layout) {
    case 'product-left':
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

    case 'product-right':
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

    case 'full-screen':
      return {
        containerStyle: {
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
          backgroundColor: 'rgba(9, 13, 22, 0.8)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '36px 48px',
          maxWidth: '700px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
      };

    case 'floating-details':
    case 'center-product':
    default:
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: '32px',
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
  }
}

/**
 * Returns absolute CSS coordinates for a floating detail badge based on its preset position.
 */
export function resolveDetailBadgePosition(
  item: ProductDetailItem,
): React.CSSProperties {
  if (item.x !== undefined && item.y !== undefined) {
    return {
      position: 'absolute',
      left: `${item.x}%`,
      top: `${item.y}%`,
    };
  }

  switch (item.position) {
    case 'top-left':
      return { position: 'absolute', top: '10%', left: '0%' };
    case 'top-right':
      return { position: 'absolute', top: '10%', right: '0%' };
    case 'bottom-left':
      return { position: 'absolute', bottom: '10%', left: '0%' };
    case 'bottom-right':
    default:
      return { position: 'absolute', bottom: '10%', right: '0%' };
  }
}
