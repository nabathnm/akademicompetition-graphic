/**
 * AnimatedCard Component
 * Reusable Remotion UI component providing flexible card layouts, 12 animation variants,
 * 7 interaction states, and 7 visual presentation styles for product demos and commercial motion graphics.
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { LucideIcon } from 'lucide-react';
import { AnimatedCardProps } from './types.ts';
import {
  deriveAnimatedCardState,
  getCardSizeMetrics,
  calculateCardVisualStyles,
  calculateCardMotion,
} from './animatedCardStyle.ts';
import { Colors } from '../../styles/colors.ts';
import { Spacing } from '../../styles/spacing.ts';
import { Typography } from '../../styles/typography.ts';

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  title,
  description,
  variant = 'default',
  size = 'md',
  animation = 'fade',
  startFrame = 0,
  durationInFrames = 14,
  exitFrame,
  exitDurationInFrames = 12,
  delay = 0,
  easing = 'easeOutCubic',
  springPreset = 'snappy',
  distance = 24,
  initialScale = 0.92,
  initialRotation = 15,
  state: explicitState,
  focusFrame,
  selectFrame,
  highlightFrame,
  expandFrame,
  collapseFrame,
  backgroundColor,
  borderColor,
  borderRadius,
  shadow,
  padding,
  width,
  height,
  image,
  imagePosition = 'top',
  icon,
  badge,
  badgeColor,
  header,
  footer,
  action,
  style,
  contentStyle,
  titleStyle,
  descriptionStyle,
  className,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Derive Active Interaction State
  const activeState = deriveAnimatedCardState({
    currentFrame,
    explicitState,
    focusFrame,
    selectFrame,
    highlightFrame,
    expandFrame,
    collapseFrame,
  });

  // 2. Metrics & Visual Foundations
  const metrics = getCardSizeMetrics(size, variant);
  const visuals = calculateCardVisualStyles({
    variant,
    state: activeState,
    metrics,
    customBg: backgroundColor,
    customBorder: borderColor,
    customRadius: borderRadius,
    customShadow: shadow,
    customPadding: padding,
    width,
    height,
  });

  // 3. Animation & Motion Transforms
  const motion = calculateCardMotion({
    currentFrame,
    startFrame,
    durationInFrames,
    exitFrame,
    exitDurationInFrames,
    delay,
    animation,
    easing,
    springPreset,
    distance,
    initialScale,
    initialRotation,
    fps,
  });

  // Helper renderer for Icon
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return icon;
    }
    if (typeof icon === 'function') {
      const IconComponent = icon as LucideIcon;
      return <IconComponent size={metrics.iconSize} color={Colors.accent.brandLight} />;
    }
    return null;
  };

  // Helper renderer for Image
  const renderImage = () => {
    if (!image) return null;

    const imgHeight = variant === 'compact' ? 80 : 140;

    if (React.isValidElement(image)) {
      return image;
    }

    if (typeof image === 'string') {
      return (
        <div
          style={{
            width: imagePosition === 'left' || imagePosition === 'right' ? 120 : '100%',
            height: imagePosition === 'left' || imagePosition === 'right' ? '100%' : imgHeight,
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius:
              imagePosition === 'top'
                ? `${metrics.borderRadius}px ${metrics.borderRadius}px 0 0`
                : imagePosition === 'left'
                ? `${metrics.borderRadius}px 0 0 ${metrics.borderRadius}px`
                : `${metrics.borderRadius}px`,
            flexShrink: 0,
          }}
        />
      );
    }

    return null;
  };

  const isHorizontal = variant === 'horizontal' || imagePosition === 'left' || imagePosition === 'right';

  return (
    <div
      className={className}
      data-state={activeState}
      data-variant={variant}
      data-animation={animation}
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        ...visuals.containerStyle,
        opacity: motion.opacity,
        transform: [visuals.containerStyle.transform, motion.transform]
          .filter(Boolean)
          .join(' ') || undefined,
        filter: motion.filter,
        visibility: motion.visibility,
        ...style,
      }}
    >
      {/* ── Optional Leading Image ── */}
      {(imagePosition === 'top' || imagePosition === 'left') && renderImage()}

      {/* ── Main Card Body Area ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: metrics.gap,
          minWidth: 0,
        }}
      >
        {/* Header / Top Meta Bar */}
        {(header || badge || icon) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: Spacing.scale.xs,
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
              {renderIcon()}
              {header}
            </div>

            {badge && (
              <span
                style={{
                  fontSize: metrics.badgeSize,
                  fontFamily: Typography.fontFamily.mono,
                  padding: '2px 8px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: badgeColor || 'rgba(39, 110, 241, 0.15)',
                  color: Colors.accent.brandLight,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  flexShrink: 0,
                }}
              >
                {badge}
              </span>
            )}
          </div>
        )}

        {/* Content Body: Title, Description, or Children */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            ...contentStyle,
          }}
        >
          {title && (
            <h3
              style={{
                margin: 0,
                fontSize: metrics.titleSize,
                fontWeight: Typography.fontWeight.semibold,
                fontFamily: Typography.fontFamily.sans,
                color: visuals.titleColor,
                lineHeight: 1.3,
                ...titleStyle,
              }}
            >
              {title}
            </h3>
          )}

          {description && (
            <p
              style={{
                margin: 0,
                fontSize: metrics.descSize,
                fontFamily: Typography.fontFamily.sans,
                color: visuals.descColor,
                lineHeight: 1.45,
                ...descriptionStyle,
              }}
            >
              {description}
            </p>
          )}

          {children}
        </div>

        {/* Optional Action or Footer Area */}
        {(action || footer) && (
          <div
            style={{
              marginTop: 'auto',
              paddingTop: metrics.gap,
              display: 'flex',
              alignItems: 'center',
              justifyContent: action && footer ? 'space-between' : action ? 'flex-end' : 'flex-start',
              gap: Spacing.scale.sm,
            }}
          >
            {footer}
            {action}
          </div>
        )}
      </div>

      {/* ── Optional Trailing Image ── */}
      {(imagePosition === 'bottom' || imagePosition === 'right') && renderImage()}
    </div>
  );
};
