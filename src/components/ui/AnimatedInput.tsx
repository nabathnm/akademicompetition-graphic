/**
 * AnimatedInput Component
 * Reusable Remotion UI component that simulates realistic input field interactions for product ads and UI demos.
 * Supports frame-based typing, focus, cursor blinking, placeholder transitions, and state feedback.
 * Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LucideIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { AnimatedInputProps } from './types';
import {
  deriveAnimatedInputState,
  getInputSizeMetrics,
  calculateInputVisualStyles,
  calculateInputEntrance,
  isCursorVisible,
  calculateErrorShake,
} from './animatedInputStyle';
import { useTyping } from '../../hooks/useTyping';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';

export {
  deriveAnimatedInputState,
  getInputSizeMetrics,
  calculateInputVisualStyles,
  calculateInputEntrance,
  isCursorVisible,
  calculateErrorShake,
};

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  value = '',
  placeholder = 'Enter text...',
  label,
  helperText,
  startFrame = 0,
  focusFrame = 10,
  typingStartFrame = 16,
  typingSpeed = 2,
  charactersPerStep = 1,
  deleteStartFrame,
  submittedFrame,
  errorFrame,
  variant = 'outlined',
  size = 'md',
  state: explicitState,
  showCursor = true,
  cursorBlinkInterval = 16,
  showLeadingIcon = false,
  showTrailingIcon = false,
  leadingIcon,
  trailingIcon,
  focusColor = Colors.accent.cyan,
  errorColor = Colors.accent.crimson,
  successColor = Colors.accent.emerald,
  borderRadius,
  padding,
  width = '100%',
  height,
  entrance = 'slide-up',
  entranceDuration = 14,
  style,
  inputStyle,
  cursorStyle,
  placeholderStyle,
  labelStyle,
  helperTextStyle,
  className,
}) => {
  const currentFrame = useCurrentFrame();

  // 1. Text Deletion & Typing Engine (reusing useTyping hook)
  const isDeleting = typeof deleteStartFrame === 'number' && currentFrame >= deleteStartFrame;
  const effectiveTypingStart = isDeleting ? (deleteStartFrame as number) : typingStartFrame;

  const typingResult = useTyping({
    text: value,
    startFrame: effectiveTypingStart,
    framesPerCharacter: typingSpeed,
    charactersPerStep,
    reverse: isDeleting,
    cursor: false, // We control the dedicated cursor element explicitly
  });

  const displayedText = typingResult.displayedText;
  const hasContent = displayedText.length > 0;

  // 2. Derive Current Interaction State
  const activeState = deriveAnimatedInputState({
    currentFrame,
    startFrame,
    focusFrame,
    typingStartFrame,
    isTyping: typingResult.isTyping,
    isComplete: typingResult.isComplete,
    hasContent,
    submittedFrame,
    errorFrame,
    explicitState,
  });

  // 3. Proportional Size Metrics & Visual Styling
  const metrics = getInputSizeMetrics(size);
  const visualStyles = calculateInputVisualStyles({
    state: activeState,
    variant,
    size,
    focusColor,
    errorColor,
    successColor,
    borderRadiusOverride: borderRadius,
    paddingOverride: padding,
  });

  // 4. Entrance Motion Style
  const entranceMotion = calculateInputEntrance({
    currentFrame,
    startFrame,
    duration: entranceDuration,
    entrance,
  });

  // 5. Error Shake Vibration
  const shakeX = calculateErrorShake(currentFrame, errorFrame);

  // 6. Cursor Visibility
  const isFocusedOrTyping = activeState === 'focus' || activeState === 'typing' || activeState === 'filled';
  const shouldRenderCursor =
    showCursor &&
    activeState !== 'disabled' &&
    activeState !== 'submitted' &&
    (explicitState === 'focus' || explicitState === 'typing' || isFocusedOrTyping);

  const cursorVisible = shouldRenderCursor && isCursorVisible(currentFrame, cursorBlinkInterval);

  // Helper renderer for Leading Icon
  const renderLeadingIcon = () => {
    if (!showLeadingIcon && !leadingIcon) return null;

    const iconColor = visualStyles.isFocused ? focusColor : Colors.text.tertiary;

    if (React.isValidElement(leadingIcon)) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: 2 }}>
          {leadingIcon}
        </span>
      );
    }

    if (typeof leadingIcon === 'function') {
      const IconComponent = leadingIcon as LucideIcon;
      return <IconComponent size={metrics.iconSize} color={iconColor} />;
    }

    return null;
  };

  // Helper renderer for Trailing Icon / Feedback Icon
  const renderTrailingIcon = () => {
    // Priority: Submitted checkmark or Error alert if applicable
    if (activeState === 'submitted') {
      return <CheckCircle2 size={metrics.iconSize} color={successColor} />;
    }

    if (activeState === 'error') {
      return <AlertCircle size={metrics.iconSize} color={errorColor} />;
    }

    if (!showTrailingIcon && !trailingIcon) return null;

    if (React.isValidElement(trailingIcon)) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 2 }}>
          {trailingIcon}
        </span>
      );
    }

    if (typeof trailingIcon === 'function') {
      const IconComponent = trailingIcon as LucideIcon;
      return (
        <IconComponent
          size={metrics.iconSize}
          color={visualStyles.isFocused ? focusColor : Colors.text.tertiary}
        />
      );
    }

    return null;
  };

  // Combine entrance transform with shake
  let combinedTransform = entranceMotion.transform;
  if (shakeX !== 0) {
    combinedTransform = combinedTransform
      ? `${combinedTransform} translateX(${shakeX.toFixed(2)}px)`
      : `translateX(${shakeX.toFixed(2)}px)`;
  }

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        width,
        opacity: entranceMotion.opacity,
        transform: combinedTransform,
        visibility: entranceMotion.visibility,
        fontFamily: Typography.fontFamily.sans,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* 1. Optional Field Label */}
      {label && (
        <label
          style={{
            fontSize: metrics.labelSize,
            fontWeight: 600,
            color: activeState === 'error' ? errorColor : Colors.text.secondary,
            letterSpacing: '0.01em',
            fontFamily: Typography.fontFamily.sans,
            ...labelStyle,
          }}
        >
          {label}
        </label>
      )}

      {/* 2. Interactive Input Frame */}
      <div
        style={{
          ...visualStyles.containerStyle,
          height: height || visualStyles.containerStyle.minHeight,
        }}
      >
        {renderLeadingIcon()}

        {/* Content Viewport */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Displayed Typed Text */}
          {displayedText.length > 0 ? (
            <span
              style={{
                color: visualStyles.inputColor,
                fontSize: metrics.fontSize,
                fontWeight: 500,
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
                whiteSpace: 'pre',
                ...inputStyle,
              }}
            >
              {displayedText}
            </span>
          ) : (
            /* Placeholder Text */
            <span
              style={{
                color: Colors.text.tertiary,
                fontSize: metrics.fontSize,
                fontWeight: 400,
                lineHeight: 1.2,
                userSelect: 'none',
                opacity: visualStyles.isFocused ? 0.6 : 0.85,
                ...placeholderStyle,
              }}
            >
              {placeholder}
            </span>
          )}

          {/* Blinking Cursor */}
          {shouldRenderCursor && (
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                width: 2,
                height: Math.round(metrics.fontSize * 1.25),
                backgroundColor: activeState === 'error' ? errorColor : focusColor,
                marginLeft: displayedText.length > 0 ? 1 : 2,
                opacity: cursorVisible ? 1 : 0,
                borderRadius: 1,
                verticalAlign: 'middle',
                ...cursorStyle,
              }}
            />
          )}
        </div>

        {renderTrailingIcon()}
      </div>

      {/* 3. Optional Helper / Error Text */}
      {helperText && (
        <span
          style={{
            fontSize: metrics.helperSize,
            color: activeState === 'error' ? errorColor : Colors.text.tertiary,
            fontFamily: Typography.fontFamily.sans,
            marginTop: 2,
            ...helperTextStyle,
          }}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};
