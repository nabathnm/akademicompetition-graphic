/**
 * AnimatedCheckbox Component
 * Reusable Remotion UI component providing frame-accurate, deterministic checkbox selection
 * interactions with progressive SVG checkmark stroke drawing and spring feedback.
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { AnimatedCheckboxProps } from './types.ts';
import {
  resolveCheckboxVisualVariant,
  resolveCheckboxAnimationVariant,
  resolveCheckboxSize,
  calculateCheckboxMotion,
  getCheckmarkStrokeParams,
  getCheckboxBoxStyles,
} from './animatedCheckboxStyle.ts';
import { Colors } from '../../styles/colors.ts';

export const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({
  checked,
  defaultChecked,
  indeterminate,
  startFrame = 0,
  checkFrame,
  durationInFrames = 12,
  variant,
  visualVariant,
  animationVariant,
  size = 'medium',
  state,
  easing,
  springPreset,
  checkColor = Colors.white,
  uncheckedColor = 'transparent',
  checkedColor = Colors.accent.emerald,
  borderColor = Colors.border.default,
  checkedBorderColor,
  disabledColor = Colors.dark.surface2,
  errorColor = Colors.accent.crimson,
  label,
  description,
  showLabel = true,
  showDescription = true,
  borderRadius,
  boxSize,
  leadingIcon: LeadingIconProp,
  labelPosition = 'right',
  children,
  style,
  boxStyle,
  checkmarkStyle,
  labelStyle,
  descriptionStyle,
  className,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const finalVisualVariant = resolveCheckboxVisualVariant(variant, visualVariant);
  const finalAnimationVariant = resolveCheckboxAnimationVariant(variant, animationVariant);

  const sizeMetrics = resolveCheckboxSize(size, finalVisualVariant, boxSize, borderRadius);

  const motion = calculateCheckboxMotion({
    currentFrame,
    fps,
    checked,
    defaultChecked,
    indeterminate,
    startFrame,
    checkFrame,
    durationInFrames,
    animationVariant: finalAnimationVariant,
    springPreset,
    easing,
    state,
  });

  const finalBoxStyle = getCheckboxBoxStyles({
    visualVariant: finalVisualVariant,
    sizeMetrics,
    clampedProgress: motion.clampedProgress,
    scale: motion.scale,
    errorShakeX: motion.errorShakeX,
    state,
    checkColor,
    uncheckedColor,
    checkedColor,
    borderColor,
    checkedBorderColor,
    disabledColor,
    errorColor,
    customStyle: boxStyle,
  });

  const strokeParams = getCheckmarkStrokeParams(
    motion.checkDrawProgress,
    motion.effectiveIndeterminate,
    motion.checkmarkOpacity
  );

  const hasExternalLabel = Boolean(label || description) && showLabel;

  // Render leading icon if provided
  const renderIcon = () => {
    if (!LeadingIconProp) return null;
    const IconNode = LeadingIconProp as React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
    if (typeof LeadingIconProp === 'function' || (typeof LeadingIconProp === 'object' && 'render' in LeadingIconProp)) {
      return (
        <IconNode
          size={sizeMetrics.iconSize}
          color={motion.effectiveChecked ? checkedColor : Colors.text.secondary}
          style={{ flexShrink: 0 }}
        />
      );
    }
    return <span style={{ flexShrink: 0 }}>{LeadingIconProp as React.ReactNode}</span>;
  };

  // Render SVG checkmark or indeterminate mark
  const renderCheckmark = () => {
    if (children) return children;

    // Determine stroke color
    let stroke = checkColor;
    if (finalVisualVariant === 'outlined' || finalVisualVariant === 'minimal') {
      stroke = checkedColor;
    }
    if (state === 'disabled') {
      stroke = Colors.text.muted;
    }

    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        style={{
          width: '70%',
          height: '70%',
          opacity: strokeParams.opacity,
          pointerEvents: 'none',
          ...checkmarkStyle,
        }}
      >
        <path
          d={strokeParams.path}
          stroke={stroke}
          strokeWidth={sizeMetrics.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={strokeParams.strokeDasharray}
          strokeDashoffset={strokeParams.strokeDashoffset}
        />
      </svg>
    );
  };

  // Checkbox box element
  const checkboxBox = (
    <div
      style={finalBoxStyle}
      role="checkbox"
      aria-checked={motion.effectiveIndeterminate ? 'mixed' : motion.effectiveChecked}
      aria-disabled={state === 'disabled'}
    >
      {renderCheckmark()}
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
        {checkboxBox}
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
            fontWeight: motion.effectiveChecked ? 600 : 500,
            color: motion.effectiveChecked ? Colors.text.primary : Colors.text.secondary,
            lineHeight: 1.25,
          }}
        >
          {label}
        </span>
      )}
      {description && showDescription && (
        <span
          style={{
            fontSize: Math.max(10, sizeMetrics.fontSize - 2),
            color: Colors.text.tertiary,
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
      {checkboxBox}
      {labelPosition === 'right' && textContent}
    </div>
  );
};
