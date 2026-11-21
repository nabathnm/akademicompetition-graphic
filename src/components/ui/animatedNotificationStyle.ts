/**
 * AnimatedNotification Style & Motion Calculations
 * Pure mathematical functions determining notification semantic themes, positioning styles,
 * layout variants, progress bar synchronization, and entrance/exit motion transforms.
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  MessageSquare,
  Bell,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type {
  AnimatedNotificationType,
  AnimatedNotificationVariant,
  AnimatedNotificationPosition,
  AnimatedNotificationEntrance,
  AnimatedNotificationExit,
} from './types.ts';
import { Colors } from '../../styles/colors.ts';
import { Spacing } from '../../styles/spacing.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { easeOutCubic } from '../../utils/animation/easing.ts';
import { createSpring } from '../../utils/animation/spring.ts';

export interface NotificationTheme {
  accentColor: string;
  bgTint: string;
  borderColor: string;
  iconColor: string;
  defaultIcon: LucideIcon;
}

/**
 * Resolves semantic color tokens, borders, and default icons for notification types.
 */
export const getNotificationTypeTheme = (
  type: AnimatedNotificationType = 'info',
  customAccent?: string
): NotificationTheme => {
  switch (type) {
    case 'success':
      return {
        accentColor: Colors.accent.emerald,
        bgTint: 'rgba(14, 131, 69, 0.12)',
        borderColor: 'rgba(14, 131, 69, 0.35)',
        iconColor: Colors.accent.emerald,
        defaultIcon: CheckCircle2,
      };

    case 'warning':
      return {
        accentColor: Colors.accent.amber,
        bgTint: 'rgba(255, 192, 67, 0.12)',
        borderColor: 'rgba(255, 192, 67, 0.35)',
        iconColor: Colors.accent.amber,
        defaultIcon: AlertTriangle,
      };

    case 'error':
      return {
        accentColor: Colors.accent.crimson,
        bgTint: 'rgba(225, 25, 0, 0.12)',
        borderColor: 'rgba(225, 25, 0, 0.35)',
        iconColor: Colors.accent.crimson,
        defaultIcon: AlertCircle,
      };

    case 'message':
      return {
        accentColor: Colors.accent.brandLight,
        bgTint: 'rgba(39, 110, 241, 0.12)',
        borderColor: 'rgba(39, 110, 241, 0.35)',
        iconColor: Colors.accent.brandLight,
        defaultIcon: MessageSquare,
      };

    case 'custom':
      return {
        accentColor: customAccent || Colors.accent.brand,
        bgTint: 'rgba(255, 255, 255, 0.06)',
        borderColor: Colors.border.strong,
        iconColor: customAccent || Colors.accent.brand,
        defaultIcon: Bell,
      };

    case 'info':
    default:
      return {
        accentColor: Colors.accent.cyan,
        bgTint: 'rgba(0, 209, 255, 0.12)',
        borderColor: 'rgba(0, 209, 255, 0.35)',
        iconColor: Colors.accent.cyan,
        defaultIcon: Info,
      };
  }
};

/**
 * Calculates absolute layout position coordinates relative to canvas boundaries.
 */
export const getNotificationPositionStyles = (
  position: AnimatedNotificationPosition = 'top-right'
): React.CSSProperties => {
  const margin = Spacing.scale.md;

  switch (position) {
    case 'top':
      return {
        top: margin,
        left: '50%',
        transform: 'translateX(-50%)',
      };

    case 'top-left':
      return {
        top: margin,
        left: margin,
      };

    case 'center':
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };

    case 'bottom':
      return {
        bottom: margin,
        left: '50%',
        transform: 'translateX(-50%)',
      };

    case 'bottom-left':
      return {
        bottom: margin,
        left: margin,
      };

    case 'bottom-right':
      return {
        bottom: margin,
        right: margin,
      };

    case 'top-right':
    default:
      return {
        top: margin,
        right: margin,
      };
  }
};

export interface NotificationVariantLayout {
  borderRadius: number | string;
  padding: string | number;
  boxShadow: string;
  maxWidth: number | string;
  borderLeft?: string;
  fontSize: number;
  iconSize: number;
}

/**
 * Resolves dimensional layout properties for visual variants.
 */
export const getNotificationVariantStyles = (
  variant: AnimatedNotificationVariant = 'toast',
  theme: NotificationTheme
): NotificationVariantLayout => {
  switch (variant) {
    case 'toast':
      return {
        borderRadius: Spacing.radius.full,
        padding: '10px 18px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
        maxWidth: 420,
        fontSize: 13,
        iconSize: 16,
      };

    case 'banner':
      return {
        borderRadius: Spacing.radius.xs,
        padding: '12px 24px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        maxWidth: '100%',
        borderLeft: `4px solid ${theme.accentColor}`,
        fontSize: 14,
        iconSize: 18,
      };

    case 'floating':
      return {
        borderRadius: Spacing.radius.md,
        padding: '14px 20px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.55)',
        maxWidth: 440,
        fontSize: 14,
        iconSize: 20,
      };

    case 'compact':
      return {
        borderRadius: Spacing.radius.sm,
        padding: '8px 14px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        maxWidth: 360,
        fontSize: 12,
        iconSize: 15,
      };

    case 'card':
    default:
      return {
        borderRadius: Spacing.radius.md,
        padding: '16px 20px',
        boxShadow: '0 10px 28px rgba(0, 0, 0, 0.4)',
        maxWidth: 460,
        fontSize: 14,
        iconSize: 20,
      };
  }
};

export interface NotificationMotionOptions {
  currentFrame: number;
  startFrame?: number;
  durationInFrames?: number;
  exitFrame?: number;
  exitDurationInFrames?: number;
  entranceVariant?: AnimatedNotificationEntrance;
  exitVariant?: AnimatedNotificationExit;
  position?: AnimatedNotificationPosition;
  type?: AnimatedNotificationType;
  fps?: number;
}

export interface NotificationMotionResult {
  opacity: number;
  transform?: string;
  visibility: 'visible' | 'hidden';
}

/**
 * Computes deterministic entrance, exit, and shake motion transforms.
 */
export const calculateNotificationMotion = ({
  currentFrame,
  startFrame = 0,
  durationInFrames = 12,
  exitFrame,
  exitDurationInFrames = 12,
  entranceVariant = 'slide-down',
  exitVariant = 'fade-out',
  position = 'top-right',
  type = 'info',
  fps = 30,
}: NotificationMotionOptions): NotificationMotionResult => {
  if (currentFrame < startFrame) {
    return {
      opacity: 0,
      visibility: 'hidden',
    };
  }

  // 1. Entrance Progress
  const elapsedIn = currentFrame - startFrame;
  const safeInDuration = Math.max(1, durationInFrames);

  let inProgress = 1;
  if (entranceVariant === 'pop-in') {
    inProgress = createSpring({
      frame: elapsedIn,
      fps,
      preset: 'snappy',
    });
  } else {
    const rawIn = clamp(elapsedIn / safeInDuration, 0, 1);
    inProgress = easeOutCubic(rawIn);
  }

  // 2. Exit Progress
  let outProgress = 0;
  if (typeof exitFrame === 'number' && currentFrame >= exitFrame) {
    const elapsedOut = currentFrame - exitFrame;
    const safeOutDuration = Math.max(1, exitDurationInFrames);
    const rawOut = clamp(elapsedOut / safeOutDuration, 0, 1);
    outProgress = easeOutCubic(rawOut);
  }

  // Combined Opacity
  const baseAlpha = entranceVariant === 'pop-in' ? clamp(inProgress * 1.5, 0, 1) : inProgress;
  const alpha = Math.max(0, baseAlpha * (1 - outProgress));

  // Determine baseline translation direction
  const isCentered = position === 'top' || position === 'bottom' || position === 'center';
  const isCenterMiddle = position === 'center';
  const basePositionTransform = isCenterMiddle
    ? 'translate(-50%, -50%)'
    : isCentered
    ? 'translateX(-50%)'
    : '';

  const transforms: string[] = [];
  if (basePositionTransform) {
    transforms.push(basePositionTransform);
  }

  // Entrance and Exit Transforms
  switch (entranceVariant) {
    case 'slide-down': {
      const yIn = (1 - inProgress) * -20;
      const yOut = exitVariant === 'slide-out' ? outProgress * -20 : 0;
      transforms.push(`translateY(${(yIn + yOut).toFixed(2)}px)`);
      break;
    }

    case 'slide-up': {
      const yIn = (1 - inProgress) * 20;
      const yOut = exitVariant === 'slide-out' ? outProgress * 20 : 0;
      transforms.push(`translateY(${(yIn + yOut).toFixed(2)}px)`);
      break;
    }

    case 'slide-left': {
      const xIn = (1 - inProgress) * 24;
      const xOut = exitVariant === 'slide-out' ? outProgress * 24 : 0;
      transforms.push(`translateX(${(xIn + xOut).toFixed(2)}px)`);
      break;
    }

    case 'slide-right': {
      const xIn = (1 - inProgress) * -24;
      const xOut = exitVariant === 'slide-out' ? outProgress * -24 : 0;
      transforms.push(`translateX(${(xIn + xOut).toFixed(2)}px)`);
      break;
    }

    case 'scale-in':
    case 'pop-in': {
      const sIn = 0.92 + 0.08 * inProgress;
      const sOut = exitVariant === 'scale-out' ? outProgress * 0.15 : 0;
      transforms.push(`scale(${Math.max(0, sIn - sOut).toFixed(3)})`);
      break;
    }

    case 'expand': {
      const sIn = 0.86 + 0.14 * inProgress;
      const sOut = exitVariant === 'collapse' ? outProgress * 0.14 : 0;
      transforms.push(`scale(${Math.max(0, sIn - sOut).toFixed(3)})`);
      break;
    }

    case 'fade-in':
    default:
      if (exitVariant === 'scale-out' && outProgress > 0) {
        transforms.push(`scale(${Math.max(0, 1 - outProgress * 0.15).toFixed(3)})`);
      } else if (exitVariant === 'collapse' && outProgress > 0) {
        transforms.push(`scale(${Math.max(0, 1 - outProgress * 0.15).toFixed(3)})`);
      }
      break;
  }

  // Subtle alert shake for error and warning types
  if ((type === 'error' || type === 'warning') && inProgress >= 0.7 && inProgress <= 1.0 && outProgress === 0) {
    const shakeProgress = clamp((currentFrame - startFrame - 8) / 8, 0, 1);
    if (shakeProgress > 0 && shakeProgress < 1) {
      const shakeX = Math.sin((currentFrame - startFrame) * 2.2) * 3;
      transforms.push(`translateX(${shakeX.toFixed(2)}px)`);
    }
  }

  return {
    opacity: alpha,
    transform: transforms.length > 0 ? transforms.join(' ') : undefined,
    visibility: alpha > 0 ? 'visible' : 'hidden',
  };
};

/**
 * Computes linear percentage progress for notification auto-dismiss indicator.
 */
export const calculateProgressBarWidth = (
  currentFrame: number,
  startFrame: number = 0,
  progressDuration: number = 50
): number => {
  if (currentFrame < startFrame) return 0;
  const safeDur = Math.max(1, progressDuration);
  return clamp((currentFrame - startFrame) / safeDur, 0, 1) * 100;
};
