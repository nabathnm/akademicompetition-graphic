/**
 * AnimatedLine Component
 * Reusable Remotion graphic component providing frame-accurate, deterministic vector lines
 * supporting horizontal, vertical, diagonal, and custom endpoint geometries with
 * SVG stroke-drawing reveals, thickness dynamics, length expansion, and exit transitions.
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { AnimatedLineProps } from './types.ts';
import {
  resolveLineCoordinates,
  resolveLineAnimationConfig,
  calculateLineBoundingBox,
  calculateLineMotion,
} from './animatedLineStyle.ts';
import { Colors } from '../../styles/colors.ts';

const AnimatedLineBase: React.FC<AnimatedLineProps> = (props) => {
  const {
    stroke = Colors.accent.brand,
    strokeWidth = 2,
    strokeLinecap = 'round',
    strokeDasharray: userDasharray,
    strokeDashoffset: userDashoffset,
    strokeOpacity = 1,
    opacity = 1,
    rotation = 0,
    transformOrigin = 'center center',
    x = 0,
    y = 0,
    scale = 1,
    scaleX = 1,
    scaleY = 1,
    width,
    height,
    exitFrame,
    exitDurationInFrames = 12,
    exitAnimation = 'fade-out',
    children,
    style,
    svgStyle,
    lineStyle,
    className,
  } = props;

  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Resolve coordinates (horizontal, vertical, diagonal, or custom)
  const coords = resolveLineCoordinates(props);

  // 2. Resolve animation parameters
  const config = resolveLineAnimationConfig(props);

  // 3. Compute SVG container dimensions and viewport bounds
  const bbox = calculateLineBoundingBox({
    x1: coords.x1,
    y1: coords.y1,
    x2: coords.x2,
    y2: coords.y2,
    strokeWidth,
    width,
    height,
  });

  // 4. Calculate frame-accurate motion kinetics
  const motion = calculateLineMotion({
    currentFrame,
    fps,
    coords,
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
    config,
    exitFrame,
    exitDurationInFrames,
    exitAnimation,
  });

  const transform = `translate3d(${motion.translateX}px, ${motion.translateY}px, 0) rotate(${motion.rotation}deg) scale(${motion.scaleX}, ${motion.scaleY})`;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        position: 'relative',
        width: bbox.boxWidth,
        height: bbox.boxHeight,
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
        width={bbox.boxWidth}
        height={bbox.boxHeight}
        viewBox={bbox.viewBox}
        style={{
          display: 'block',
          overflow: 'visible',
          ...svgStyle,
        }}
      >
        <line
          x1={motion.effectiveX1}
          y1={motion.effectiveY1}
          x2={motion.effectiveX2}
          y2={motion.effectiveY2}
          stroke={stroke}
          strokeWidth={motion.effectiveStrokeWidth}
          strokeLinecap={strokeLinecap}
          strokeDasharray={motion.strokeDasharray}
          strokeDashoffset={motion.strokeDashoffset}
          strokeOpacity={strokeOpacity}
          style={lineStyle}
        />
      </svg>
      {children}
    </div>
  );
};

export const AnimatedLine = React.memo(AnimatedLineBase);
