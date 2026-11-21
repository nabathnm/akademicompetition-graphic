/**
 * AnimatedArrow Component
 * Reusable Remotion graphic component providing frame-accurate, deterministic SVG arrows
 * supporting straight, diagonal, and curved Bezier paths, single/double arrowheads,
 * customizable arrowhead styles (triangle, chevron, stealth, barb, circle), and sequenced reveals.
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { AnimatedArrowProps } from './types.ts';
import {
  resolveArrowCoordinates,
  resolveArrowAnimationConfig,
  describeArrowPath,
  calculateArrowheadPath,
  calculateArrowBoundingBox,
  calculateArrowMotion,
} from './animatedArrowStyle.ts';
import { Colors } from '../../styles/colors.ts';

export const AnimatedArrow: React.FC<AnimatedArrowProps> = (props) => {
  const {
    arrowheadStyle = 'triangle',
    arrowheadPlacement = 'end',
    arrowheadSize = 14,
    arrowheadAngle = 32,
    arrowheadFill,
    stroke = Colors.accent.brand,
    strokeWidth = 2,
    strokeLinecap = 'round',
    strokeLinejoin = 'round',
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
    className,
  } = props;

  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Resolve geometry, curvature, and tangent orientation
  const coords = resolveArrowCoordinates(props);

  // 2. Resolve animation parameters
  const config = resolveArrowAnimationConfig(props);

  // 3. Compute SVG container dimensions and viewport bounds
  const bbox = calculateArrowBoundingBox({
    coords,
    arrowheadSize,
    strokeWidth,
    width,
    height,
  });

  // 4. Calculate frame-accurate motion kinetics
  const motion = calculateArrowMotion({
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

  // Arrow shaft path
  const shaftPath = describeArrowPath(coords);

  // Whether the arrowhead style has solid fill
  const isClosedHead = arrowheadStyle !== 'chevron';
  const effectiveHeadFill = isClosedHead ? (arrowheadFill ?? stroke) : 'none';

  // End arrowhead path
  const hasEndHead = arrowheadPlacement === 'end' || arrowheadPlacement === 'both';
  const endHeadPath = hasEndHead
    ? calculateArrowheadPath({
        tipX: coords.x2,
        tipY: coords.y2,
        angleInDegrees: coords.endAngle,
        size: arrowheadSize,
        flareAngle: arrowheadAngle,
        style: arrowheadStyle,
      })
    : '';

  // Start arrowhead path (for double-headed arrows)
  const hasStartHead = arrowheadPlacement === 'start' || arrowheadPlacement === 'both';
  const startHeadPath = hasStartHead
    ? calculateArrowheadPath({
        tipX: coords.x1,
        tipY: coords.y1,
        angleInDegrees: coords.startAngle,
        size: arrowheadSize,
        flareAngle: arrowheadAngle,
        style: arrowheadStyle,
      })
    : '';

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        {/* Arrow Shaft */}
        <path
          d={shaftPath}
          fill="none"
          stroke={stroke}
          strokeWidth={motion.effectiveStrokeWidth}
          strokeLinecap={strokeLinecap}
          strokeLinejoin={strokeLinejoin}
          strokeDasharray={motion.strokeDasharray}
          strokeDashoffset={motion.strokeDashoffset}
          strokeOpacity={strokeOpacity}
        />

        {/* End Arrowhead */}
        {hasEndHead && (
          <path
            d={endHeadPath}
            fill={effectiveHeadFill}
            stroke={stroke}
            strokeWidth={isClosedHead ? 1 : motion.effectiveStrokeWidth}
            strokeLinecap={strokeLinecap}
            strokeLinejoin={strokeLinejoin}
            strokeOpacity={strokeOpacity}
            opacity={motion.headOpacity}
            transform={`translate(${coords.x2} ${coords.y2}) scale(${motion.headScale}) translate(${-coords.x2} ${-coords.y2})`}
          />
        )}

        {/* Start Arrowhead (Double-Headed) */}
        {hasStartHead && (
          <path
            d={startHeadPath}
            fill={effectiveHeadFill}
            stroke={stroke}
            strokeWidth={isClosedHead ? 1 : motion.effectiveStrokeWidth}
            strokeLinecap={strokeLinecap}
            strokeLinejoin={strokeLinejoin}
            strokeOpacity={strokeOpacity}
            opacity={motion.headOpacity}
            transform={`translate(${coords.x1} ${coords.y1}) scale(${motion.headScale}) translate(${-coords.x1} ${-coords.y1})`}
          />
        )}
      </svg>

      {children}
    </div>
  );
};
