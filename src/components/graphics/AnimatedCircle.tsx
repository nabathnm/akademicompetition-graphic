/**
 * AnimatedCircle Component
 * Reusable Remotion graphic component providing frame-accurate, deterministic SVG circles,
 * rings, arcs, circular progress indicators, and concentric compositions.
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { AnimatedCircleProps } from './types.ts';
import {
  resolveCircleDimensions,
  resolveCircleAnimationConfig,
  calculateCircleMotion,
  describeArcPath,
} from './animatedCircleStyle.ts';
import { Colors } from '../../styles/colors.ts';

export const AnimatedCircle: React.FC<AnimatedCircleProps> = (props) => {
  const {
    fill = 'transparent',
    stroke = Colors.accent.brand,
    strokeWidth = 2,
    strokeLinecap = 'round',
    strokeDasharray: userDasharray,
    strokeDashoffset: userDashoffset,
    strokeOpacity = 1,
    opacity = 1,
    rotation = 0,
    startAngle = 0,
    endAngle = 360,
    progress,
    showTrack = false,
    trackStroke = 'rgba(255, 255, 255, 0.1)',
    trackStrokeWidth,
    closed = false,
    transformOrigin = 'center center',
    x = 0,
    y = 0,
    scale = 1,
    scaleX = 1,
    scaleY = 1,
    exitFrame,
    exitDurationInFrames = 12,
    exitAnimation = 'fade-out',
    children,
    style,
    svgStyle,
    className,
  } = props;

  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Resolve circle dimensions (radius, size, cx, cy, circumference)
  const dimensions = resolveCircleDimensions(props);
  const { size, cx, cy } = dimensions;

  // 2. Resolve animation parameters
  const config = resolveCircleAnimationConfig(props);

  // 3. Calculate deterministic frame-accurate motion kinetics
  const motion = calculateCircleMotion({
    currentFrame,
    fps,
    dimensions,
    strokeWidth,
    userDasharray,
    userDashoffset,
    baseOpacity: opacity,
    baseRotation: rotation,
    baseX: x,
    baseY: y,
    baseScale: scale,
    baseScaleX: scaleX,
    baseScaleY: scaleY,
    startAngle,
    endAngle,
    progress,
    config,
    exitFrame,
    exitDurationInFrames,
    exitAnimation,
  });

  const transform = `translate3d(${motion.translateX}px, ${motion.translateY}px, 0) rotate(${motion.rotation}deg) scale(${motion.scaleX}, ${motion.scaleY})`;

  // Determine if this is a partial arc/wedge or full circular path
  const isPartialArc =
    (motion.effectiveStartAngle !== 0 || motion.effectiveEndAngle !== 360) &&
    config.type !== 'progress';

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: size,
        height: size,
        opacity: motion.opacity,
        transform,
        transformOrigin,
        pointerEvents: 'none',
        userSelect: 'none',
        willChange: 'transform, opacity',
        ...style,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          display: 'block',
          overflow: 'visible',
          ...svgStyle,
        }}
      >
        {/* Optional Background Track */}
        {showTrack && (
          <circle
            cx={cx}
            cy={cy}
            r={motion.effectiveRadius}
            fill="none"
            stroke={trackStroke}
            strokeWidth={trackStrokeWidth ?? strokeWidth}
          />
        )}

        {/* Primary Circle / Arc Geometry */}
        {isPartialArc ? (
          <path
            d={describeArcPath(
              cx,
              cy,
              motion.effectiveRadius,
              motion.effectiveStartAngle,
              motion.effectiveEndAngle,
              closed
            )}
            fill={fill}
            stroke={stroke}
            strokeWidth={motion.effectiveStrokeWidth}
            strokeLinecap={strokeLinecap}
            strokeDasharray={motion.strokeDasharray}
            strokeDashoffset={motion.strokeDashoffset}
            strokeOpacity={strokeOpacity}
          />
        ) : (
          <circle
            cx={cx}
            cy={cy}
            r={motion.effectiveRadius}
            fill={fill}
            stroke={stroke}
            strokeWidth={motion.effectiveStrokeWidth}
            strokeLinecap={strokeLinecap}
            strokeDasharray={motion.strokeDasharray}
            strokeDashoffset={motion.strokeDashoffset}
            strokeOpacity={strokeOpacity}
            transform={`rotate(${startAngle - 90} ${cx} ${cy})`}
          />
        )}
      </svg>

      {/* Centered Children Overlay */}
      {children && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
