/**
 * AnimatedText Component
 * Foundational typography component providing deterministic entrance, exit, and emphasis animations.
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { AnimatedTextProps } from './types';
import { calculateAnimatedTextStyle, CalculatedAnimatedStyle } from './animatedTextStyle';
import { MOTION } from '../../styles/motion';

export { calculateAnimatedTextStyle };
export type { CalculatedAnimatedStyle };

const AnimatedTextBase: React.FC<AnimatedTextProps> = ({
  children,
  text,
  variant = 'fade',
  startFrame = 0,
  durationInFrames = MOTION.duration.normal,
  exitFrame,
  exitDurationInFrames = MOTION.duration.fast,
  delay = 0,
  easing = 'easeOutCubic',
  springPreset = 'snappy',
  distance = 40,
  initialScale = 0.85,
  initialRotation = -8,
  initialBlur = 10,
  style,
  className,
  as: Component = 'div',
  align,
  direction = 'both',
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const motionStyle = calculateAnimatedTextStyle({
    currentFrame,
    fps,
    variant,
    startFrame,
    durationInFrames,
    exitFrame,
    exitDurationInFrames,
    delay,
    easing,
    springPreset,
    distance,
    initialScale,
    initialRotation,
    initialBlur,
    direction,
  });

  // Compose user transform and filter if provided
  const combinedTransform = [style?.transform, motionStyle.transform].filter(Boolean).join(' ') || undefined;
  const combinedFilter = [style?.filter, motionStyle.filter].filter(Boolean).join(' ') || undefined;
  const combinedOpacity = style?.opacity !== undefined ? Number(style.opacity) * motionStyle.opacity : motionStyle.opacity;

  // Inlined display check: ensure transforms take effect on inline elements
  const defaultDisplay = Component === 'span' ? 'inline-block' : undefined;

  const elementStyle: React.CSSProperties = {
    display: defaultDisplay,
    textAlign: align,
    ...style,
    opacity: combinedOpacity,
    transform: combinedTransform,
    filter: combinedFilter,
    visibility: motionStyle.visibility,
  };

  return (
    <Component className={className} style={elementStyle}>
      {children ?? text}
    </Component>
  );
};

export const AnimatedText = React.memo(AnimatedTextBase);
