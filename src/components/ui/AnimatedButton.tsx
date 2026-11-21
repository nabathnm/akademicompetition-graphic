/**
 * AnimatedButton Component
 * Reusable Remotion UI component that simulates interactive button press feedback,
 * state transitions, loading spinners, and visual feedback for product advertisements.
 * Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { LucideIcon, Loader2, Check, AlertTriangle } from 'lucide-react';
import { AnimatedButtonProps } from './types';
import {
  deriveAnimatedButtonState,
  getButtonSizeMetrics,
  calculateButtonVisualStyles,
  calculatePressScale,
  calculateButtonMotion,
  calculateSpinnerAngle,
  calculateButtonShake,
} from './animatedButtonStyle';

export {
  deriveAnimatedButtonState,
  getButtonSizeMetrics,
  calculateButtonVisualStyles,
  calculatePressScale,
  calculateButtonMotion,
  calculateSpinnerAngle,
  calculateButtonShake,
};

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  label,
  variant = 'primary',
  size = 'medium',
  state: explicitState,
  startFrame = 0,
  hoverFrame,
  pressFrame,
  releaseFrame,
  loadingStartFrame,
  successFrame,
  errorFrame,
  exitFrame,
  exitDurationInFrames = 12,
  entrance = 'scale-in',
  entranceDuration = 12,
  exit = 'none',
  springPreset = 'snappy',
  easing = 'easeOutCubic',
  scaleOnPress = 0.94,
  backgroundColor,
  textColor,
  borderColor,
  borderRadius,
  padding,
  width,
  height,
  icon,
  leadingIcon,
  showLeadingIcon = true,
  trailingIcon,
  showTrailingIcon = true,
  loadingLabel = 'Loading...',
  successLabel,
  errorLabel,
  showSpinner = true,
  badge,
  style,
  labelStyle,
  className,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Derive Current Interaction State
  const activeState = deriveAnimatedButtonState({
    currentFrame,
    startFrame,
    hoverFrame,
    pressFrame,
    releaseFrame,
    loadingStartFrame,
    successFrame,
    errorFrame,
    explicitState,
  });

  const isLoading = activeState === 'loading';
  const isSuccess = activeState === 'success';
  const isError = activeState === 'error';
  const isIconOnly = variant === 'icon-only';

  // 2. Compute Proportional Visual Styles & Colors
  const metrics = getButtonSizeMetrics(size);
  const visuals = calculateButtonVisualStyles({
    state: activeState,
    variant,
    size,
    backgroundColor,
    textColor,
    borderColor,
    borderRadius,
    padding,
    width,
    height,
  });

  // 3. Compute Press & Release Physics Compression
  const pressScale = calculatePressScale({
    currentFrame,
    pressFrame,
    releaseFrame,
    scaleOnPress,
    fps,
    springPreset,
  });

  // 4. Compute Entrance and Exit Transforms
  const motion = calculateButtonMotion({
    currentFrame,
    startFrame,
    entrance,
    entranceDuration,
    exitFrame,
    exit,
    exitDurationInFrames,
    fps,
    springPreset,
    easing,
  });

  // 5. Spinner Rotation Angle & Error Shake Displacement
  const spinnerAngle = calculateSpinnerAngle(currentFrame);
  const shakeX = calculateButtonShake(currentFrame, errorFrame);

  // Combine transforms: entrance/exit motion * press compression * shake
  const transformParts: string[] = [];
  if (motion.transform) transformParts.push(motion.transform);
  if (pressScale !== 1.0) transformParts.push(`scale(${pressScale.toFixed(3)})`);
  if (shakeX !== 0) transformParts.push(`translateX(${shakeX.toFixed(2)}px)`);

  const combinedTransform = transformParts.length > 0 ? transformParts.join(' ') : undefined;

  // Helper renderer for Leading Icon / Spinner
  const renderLeadingIcon = () => {
    // If loading, show rotating spinner
    if (isLoading && showSpinner) {
      return (
        <Loader2
          size={visuals.iconSize}
          color={visuals.textColor}
          style={{
            transform: `rotate(${spinnerAngle}deg)`,
            display: 'inline-block',
          }}
        />
      );
    }

    // If success, show checkmark
    if (isSuccess) {
      return <Check size={visuals.iconSize} color={visuals.textColor} />;
    }

    // If error, show warning triangle
    if (isError) {
      return <AlertTriangle size={visuals.iconSize} color={visuals.textColor} />;
    }

    // Otherwise render leadingIcon or icon
    if (!showLeadingIcon) return null;
    const targetIcon = leadingIcon || (isIconOnly ? icon : undefined);
    if (!targetIcon) return null;

    if (React.isValidElement(targetIcon)) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          {targetIcon}
        </span>
      );
    }

    if (typeof targetIcon === 'function') {
      const IconComponent = targetIcon as LucideIcon;
      return <IconComponent size={visuals.iconSize} color={visuals.textColor} />;
    }

    return null;
  };

  // Helper renderer for Trailing Icon
  const renderTrailingIcon = () => {
    if (isLoading || isSuccess || isError) return null;
    if (!showTrailingIcon || !trailingIcon) return null;

    if (React.isValidElement(trailingIcon)) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          {trailingIcon}
        </span>
      );
    }

    if (typeof trailingIcon === 'function') {
      const IconComponent = trailingIcon as LucideIcon;
      return <IconComponent size={visuals.iconSize} color={visuals.textColor} />;
    }

    return null;
  };

  // Text label content resolution based on state
  const resolvedLabel = isLoading
    ? loadingLabel
    : isSuccess
    ? successLabel || label
    : isError
    ? errorLabel || label
    : label;

  return (
    <button
      type="button"
      className={className}
      disabled={activeState === 'disabled'}
      style={{
        ...visuals.containerStyle,
        opacity: motion.opacity,
        transform: combinedTransform,
        visibility: motion.visibility,
        ...style,
      }}
    >
      {renderLeadingIcon()}

      {!isIconOnly && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            lineHeight: 1,
            ...labelStyle,
          }}
        >
          {children || resolvedLabel}
        </span>
      )}

      {renderTrailingIcon()}

      {/* Optional Badge Indicator */}
      {badge !== undefined && !isIconOnly && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: metrics.badgeSize,
            fontWeight: 700,
            lineHeight: 1,
            padding: '2px 6px',
            borderRadius: 9999,
            backgroundColor: 'rgba(255, 255, 255, 0.22)',
            color: visuals.textColor,
            marginLeft: 2,
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
};
