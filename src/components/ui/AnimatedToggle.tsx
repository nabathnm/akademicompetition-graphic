/**
 * AnimatedToggle Component
 * Reusable Remotion UI component providing frame-accurate, deterministic toggle
 * and switch interactions commonly found in mobile applications and product interfaces.
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { AnimatedToggleProps } from './types.ts';
import {
  resolveToggleVisualVariant,
  resolveToggleAnimationVariant,
  resolveToggleSize,
  calculateToggleMotion,
  getToggleTrackStyles,
  getToggleThumbStyles,
} from './animatedToggleStyle.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';

export const AnimatedToggle: React.FC<AnimatedToggleProps> = ({
  checked,
  defaultChecked,
  startFrame = 0,
  toggleFrame,
  durationInFrames = 12,
  variant,
  visualVariant,
  animationVariant,
  size = 'medium',
  state,
  easing,
  springPreset,
  onColor = Colors.accent.emerald,
  offColor = Colors.dark.surface3,
  thumbColor = Colors.white,
  thumbOnColor,
  disabledColor = Colors.dark.surface2,
  borderRadius,
  trackWidth,
  trackHeight,
  thumbSize,
  showLabel = true,
  onLabel = 'ON',
  offLabel = 'OFF',
  label,
  description,
  leadingIcon: LeadingIconProp,
  labelPosition = 'right',
  style,
  trackStyle,
  thumbStyle,
  labelStyle,
  descriptionStyle,
  className,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const finalVisualVariant = resolveToggleVisualVariant(variant, visualVariant);
  const finalAnimationVariant = resolveToggleAnimationVariant(variant, animationVariant);

  const sizeMetrics = resolveToggleSize(size, trackWidth, trackHeight, thumbSize);

  const motion = calculateToggleMotion({
    currentFrame,
    fps,
    checked,
    defaultChecked,
    startFrame,
    toggleFrame,
    durationInFrames,
    animationVariant: finalAnimationVariant,
    springPreset,
    easing,
    state,
    sizeMetrics,
  });

  const finalTrackStyle = getToggleTrackStyles({
    visualVariant: finalVisualVariant,
    sizeMetrics,
    clampedProgress: motion.clampedProgress,
    state,
    onColor,
    offColor,
    disabledColor,
    borderRadius,
    customStyle: trackStyle,
  });

  const finalThumbStyle = getToggleThumbStyles({
    visualVariant: finalVisualVariant,
    sizeMetrics,
    thumbX: motion.thumbX,
    thumbScaleX: motion.thumbScaleX,
    thumbScaleY: motion.thumbScaleY,
    clampedProgress: motion.clampedProgress,
    state,
    thumbColor,
    thumbOnColor,
    borderRadius,
    customStyle: thumbStyle,
  });

  const hasExternalLabel = Boolean(label || description) && showLabel;

  // Render leading icon if provided
  const renderIcon = () => {
    if (!LeadingIconProp) return null;
    const IconNode = LeadingIconProp as React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
    if (typeof LeadingIconProp === 'function' || (typeof LeadingIconProp === 'object' && 'render' in LeadingIconProp)) {
      return (
        <IconNode
          size={sizeMetrics.iconSize}
          color={motion.effectiveChecked ? onColor : Colors.text.secondary}
          style={{ flexShrink: 0 }}
        />
      );
    }
    return <span style={{ flexShrink: 0 }}>{LeadingIconProp as React.ReactNode}</span>;
  };

  // Render internal track labels for 'labeled' variant
  const renderInternalTrackLabels = () => {
    if (finalVisualVariant !== 'labeled') return null;

    const miniFontSize = Math.max(8, Math.round(sizeMetrics.fontSize * 0.7));

    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `0 ${sizeMetrics.padding + 3}px`,
          pointerEvents: 'none',
          boxSizing: 'border-box',
        }}
      >
        {/* Left slot (ON text) */}
        <span
          style={{
            fontSize: miniFontSize,
            fontWeight: 800,
            fontFamily: Typography.fontFamily.mono,
            color: Colors.white,
            opacity: motion.onLabelOpacity,
            lineHeight: 1,
            transform: `scale(${0.8 + motion.onLabelOpacity * 0.2})`,
          }}
        >
          {onLabel}
        </span>

        {/* Right slot (OFF text) */}
        <span
          style={{
            fontSize: miniFontSize,
            fontWeight: 800,
            fontFamily: Typography.fontFamily.mono,
            color: Colors.text.tertiary,
            opacity: motion.offLabelOpacity,
            lineHeight: 1,
            transform: `scale(${0.8 + motion.offLabelOpacity * 0.2})`,
          }}
        >
          {offLabel}
        </span>
      </div>
    );
  };

  // Render loading spinner inside thumb when state is 'loading'
  const renderThumbContent = () => {
    if (state !== 'loading') return null;

    const spinnerSize = Math.max(8, Math.round(sizeMetrics.thumbSize * 0.65));
    const angle = (currentFrame * 14) % 360;

    return (
      <svg
        width={spinnerSize}
        height={spinnerSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke={motion.effectiveChecked ? onColor : Colors.text.tertiary}
        strokeWidth="3.5"
        strokeLinecap="round"
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: 'center center',
        }}
      >
        <path d="M12 2a10 10 0 0 1 10 10" />
      </svg>
    );
  };

  // Toggle switch element
  const toggleElement = (
    <div
      style={finalTrackStyle}
      role="switch"
      aria-checked={motion.effectiveChecked}
      aria-disabled={state === 'disabled'}
    >
      {renderInternalTrackLabels()}
      <div style={finalThumbStyle}>{renderThumbContent()}</div>
    </div>
  );

  if (!hasExternalLabel && !LeadingIconProp) {
    return (
      <div
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          ...style,
        }}
      >
        {toggleElement}
      </div>
    );
  }

  const textContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        opacity: state === 'disabled' ? 0.5 : 1,
        userSelect: 'none',
        ...labelStyle,
      }}
    >
      {label && (
        <span
          style={{
            fontSize: sizeMetrics.fontSize,
            fontWeight: 600,
            color: Colors.text.primary,
            lineHeight: 1.25,
          }}
        >
          {label}
        </span>
      )}
      {description && (
        <span
          style={{
            fontSize: Math.max(10, sizeMetrics.fontSize - 2),
            color: Colors.text.secondary,
            lineHeight: 1.2,
            ...descriptionStyle,
          }}
        >
          {description}
        </span>
      )}
    </div>
  );

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizeMetrics.labelGap,
        cursor: state === 'disabled' ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {renderIcon()}
      {labelPosition === 'left' && textContent}
      {toggleElement}
      {labelPosition === 'right' && textContent}
    </div>
  );
};
