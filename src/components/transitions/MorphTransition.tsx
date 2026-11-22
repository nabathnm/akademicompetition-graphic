/**
 * MorphTransition Component
 * Configurable, frame-accurate Remotion transition component that visually
 * morphs one 2D SVG graphic shape into another.
 * Supports:
 * - Circle to Rectangle / Rounded Rectangle
 * - Polygon transformations (Triangle, Diamond, Star, Pentagon, Hexagon)
 * - Complex SVG Path transformations (Heart, Cloud, Check, Cross, Play, Arrow)
 * - Arbitrary compatible custom SVG path data strings
 * - Fill color interpolation
 * - Stroke color and stroke width interpolation
 * - Opacity, scale, and rotational kinematics
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { MorphTransitionProps } from './types.ts';
import { calculateMorphMetrics } from './morphTransitionStyle.ts';

export const MorphTransition: React.FC<MorphTransitionProps> = ({
  fromPath,
  toPath,
  duration = 30,
  durationInFrames,
  delay = 0,
  easing = 'easeInOut',
  fromFill = '#06b6d4',
  toFill = '#ec4899',
  fromStroke = 'transparent',
  toStroke = 'transparent',
  fromStrokeWidth = 0,
  toStrokeWidth = 0,
  fromOpacity = 1.0,
  toOpacity = 1.0,
  initialRotation = 0,
  finalRotation = 0,
  initialScale = 1.0,
  finalScale = 1.0,
  transformOrigin = 'center',
  width = 200,
  height = 200,
  viewBox = '0 0 100 100',
  samplePoints = 48,
  spring,
  springPreset,
  overshoot,
  reverse = false,
  style,
  className,
  children,
}) => {
  const currentFrame = useCurrentFrame();

  const metrics = calculateMorphMetrics({
    currentFrame,
    fromPath,
    toPath,
    duration,
    durationInFrames,
    delay,
    easing,
    fromFill,
    toFill,
    fromStroke,
    toStroke,
    fromStrokeWidth,
    toStrokeWidth,
    fromOpacity,
    toOpacity,
    initialRotation,
    finalRotation,
    initialScale,
    finalScale,
    samplePoints,
    viewBox,
    spring,
    springPreset,
    overshoot,
    reverse,
  });

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        ...style,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={metrics.viewBox}
        style={{
          overflow: 'visible',
          transform: `rotate(${metrics.rotation}deg) scale(${metrics.scale})`,
          transformOrigin,
          opacity: metrics.opacity,
          willChange: 'transform, opacity',
        }}
      >
        <path
          d={metrics.d}
          fill={metrics.fill}
          stroke={metrics.stroke}
          strokeWidth={metrics.strokeWidth}
        />
        {children}
      </svg>
    </div>
  );
};
