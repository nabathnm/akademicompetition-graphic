/**
 * AnimatedNotification Component
 * Reusable Remotion UI component providing frame-based simulated toast messages,
 * banners, alerts, and floating system notifications.
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AnimatedNotificationProps } from './types.ts';
import {
  getNotificationTypeTheme,
  getNotificationPositionStyles,
  getNotificationVariantStyles,
  calculateNotificationMotion,
  calculateProgressBarWidth,
} from './animatedNotificationStyle.ts';
import { AnimatedButton } from './AnimatedButton.tsx';
import { Colors } from '../../styles/colors.ts';
import { Spacing } from '../../styles/spacing.ts';
import { Typography } from '../../styles/typography.ts';

const AnimatedNotificationBase: React.FC<AnimatedNotificationProps> = ({
  type = 'info',
  variant = 'toast',
  title,
  description,
  icon,
  timestamp,
  actionLabel,
  action,
  startFrame = 0,
  delay,
  durationInFrames = 12,
  displayDuration = 50,
  exitFrame: explicitExitFrame,
  exitDurationInFrames = 12,
  entranceVariant = 'slide-down',
  exitVariant = 'fade-out',
  position = 'top-right',
  width,
  backgroundColor,
  textColor,
  accentColor,
  borderRadius,
  showCloseButton = true,
  showProgress = true,
  progressDuration,
  style,
  contentStyle,
  className,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const effectiveStartFrame = delay !== undefined && startFrame === 0 ? delay : startFrame;

  // 1. Resolve Effective Exit Frame
  const exitFrame = explicitExitFrame !== undefined ? explicitExitFrame : effectiveStartFrame + displayDuration;
  const effectiveProgressDuration = progressDuration !== undefined ? progressDuration : displayDuration;

  // 2. Resolve Semantic Theme & Layout Styles
  const theme = getNotificationTypeTheme(type, accentColor);
  const posStyles = getNotificationPositionStyles(position);
  const layout = getNotificationVariantStyles(variant, theme);

  // 3. Calculate Deterministic Motion
  const motion = calculateNotificationMotion({
    currentFrame,
    startFrame: effectiveStartFrame,
    durationInFrames,
    exitFrame,
    exitDurationInFrames,
    entranceVariant,
    exitVariant,
    position,
    type,
    fps,
  });

  // 4. Calculate Synchronized Linear Progress
  const progressPercent = calculateProgressBarWidth(
    currentFrame,
    startFrame,
    effectiveProgressDuration
  );

  // Helper renderer for Notification Icon
  const renderIcon = () => {
    if (icon === null) return null;

    let iconElement: React.ReactNode = null;
    if (React.isValidElement(icon)) {
      iconElement = icon;
    } else if (typeof icon === 'function') {
      const CustomIcon = icon as LucideIcon;
      iconElement = <CustomIcon size={layout.iconSize} color={theme.iconColor} />;
    } else {
      const DefaultIcon = theme.defaultIcon;
      iconElement = <DefaultIcon size={layout.iconSize} color={theme.iconColor} />;
    }

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: layout.iconSize + 10,
          height: layout.iconSize + 10,
          borderRadius: Spacing.radius.xs,
          backgroundColor: theme.bgTint,
          flexShrink: 0,
        }}
      >
        {iconElement}
      </div>
    );
  };

  const isBanner = variant === 'banner';
  const isCompact = variant === 'compact';
  const isToast = variant === 'toast';

  const containerBg = backgroundColor || Colors.dark.surface1;
  const containerBorder = layout.borderLeft
    ? undefined
    : `1px solid ${theme.borderColor}`;
  const containerRadius = borderRadius !== undefined ? borderRadius : layout.borderRadius;

  return (
    <div
      className={className}
      data-type={type}
      data-variant={variant}
      data-position={position}
      style={{
        position: 'absolute',
        ...posStyles,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: containerBg,
        border: containerBorder,
        borderLeft: layout.borderLeft,
        borderRadius: containerRadius,
        boxShadow: layout.boxShadow,
        width: width !== undefined ? width : isBanner ? '100%' : 'auto',
        maxWidth: isBanner ? '100%' : layout.maxWidth,
        opacity: motion.opacity,
        transform: motion.transform,
        visibility: motion.visibility,
        overflow: 'hidden',
        boxSizing: 'border-box',
        zIndex: Spacing.zIndex.floatingUI,
        ...style,
      }}
    >
      {/* ── Main Notification Content Row ── */}
      <div
        style={{
          display: 'flex',
          alignItems: isCompact ? 'center' : 'flex-start',
          gap: Spacing.scale.sm,
          padding: layout.padding,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {renderIcon()}

        {/* Content Column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            gap: 2,
            minWidth: 0,
            ...contentStyle,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: Spacing.scale.xs,
              width: '100%',
            }}
          >
            {title && (
              <span
                style={{
                  fontSize: layout.fontSize,
                  fontWeight: Typography.fontWeight.semibold,
                  fontFamily: Typography.fontFamily.sans,
                  color: textColor || Colors.text.primary,
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </span>
            )}

            {timestamp && !isCompact && (
              <span
                style={{
                  fontSize: 10,
                  fontFamily: Typography.fontFamily.mono,
                  color: Colors.text.tertiary,
                  flexShrink: 0,
                }}
              >
                {timestamp}
              </span>
            )}
          </div>

          {description && (
            <span
              style={{
                fontSize: layout.fontSize - 1,
                fontFamily: Typography.fontFamily.sans,
                color: Colors.text.secondary,
                lineHeight: 1.4,
              }}
            >
              {description}
            </span>
          )}

          {/* Optional Action CTA */}
          {(actionLabel || action) && (
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center' }}>
              {action ? (
                action
              ) : (
                <AnimatedButton
                  label={actionLabel || 'View'}
                  variant="primary"
                  size="sm"
                  startFrame={startFrame}
                  style={{
                    height: 26,
                    padding: '0 10px',
                    fontSize: 11,
                    backgroundColor: theme.accentColor,
                    borderColor: theme.accentColor,
                  }}
                />
              )}
            </div>
          )}
        </div>

        {/* Optional Close Icon Button */}
        {showCloseButton && !isToast && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 2,
              borderRadius: Spacing.radius.xs,
              color: Colors.text.tertiary,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={14} />
          </div>
        )}
      </div>

      {/* ── Synchronized Determinate Linear Progress Bar ── */}
      {showProgress && (
        <div
          data-testid="notification-progress-bar"
          style={{
            width: '100%',
            height: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: `${progressPercent.toFixed(2)}%`,
              height: '100%',
              backgroundColor: theme.accentColor,
            }}
          />
        </div>
      )}
    </div>
  );
};

export const AnimatedNotification = React.memo(AnimatedNotificationBase);
