/**
 * AnimatedShape Component
 * Reusable Remotion graphic component providing frame-accurate, deterministic geometric shapes
 * with customizable fills, borders, SVG stroke drawing reveals, and spring-based physical transforms.
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { AnimatedShapeProps, ShapeType } from './types.ts';
import {
  resolveShapeAnimationConfig,
  calculateShapeMotion,
  calculatePolygonPoints,
  calculateStarPoints,
} from './animatedShapeStyle.ts';
import { Colors } from '../../styles/colors.ts';
import { clamp } from '../../utils/animation/clamp.ts';

export interface ShapeSvgElementProps {
  shape: ShapeType;
  width: number;
  height: number;
  strokeWidth: number;
  borderRadius?: number;
  sides?: number;
  starPoints?: number;
  starInnerRatio?: number;
  pointsString?: string;
  fill: string;
  stroke: string;
  strokeDasharray?: string | number;
  strokeDashoffset?: number;
  strokeLinecap?: 'round' | 'butt' | 'square';
  strokeLinejoin?: 'round' | 'miter' | 'bevel';
}

/**
 * Returns the appropriate SVG geometry node for the specified ShapeType.
 */
export function renderSvgShapeGeometry({
  shape,
  width,
  height,
  strokeWidth,
  borderRadius = 12,
  sides = 6,
  starPoints = 5,
  starInnerRatio = 0.45,
  pointsString,
  fill,
  stroke,
  strokeDasharray,
  strokeDashoffset,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
}: ShapeSvgElementProps): React.ReactElement {
  const halfStroke = strokeWidth / 2;
  const innerW = Math.max(1, width - strokeWidth);
  const innerH = Math.max(1, height - strokeWidth);

  const commonProps = {
    fill,
    stroke,
    strokeWidth,
    strokeDasharray,
    strokeDashoffset,
    strokeLinecap,
    strokeLinejoin,
  };

  switch (shape) {
    case 'rectangle':
      return (
        <rect
          x={halfStroke}
          y={halfStroke}
          width={innerW}
          height={innerH}
          {...commonProps}
        />
      );

    case 'rounded-rectangle': {
      const maxR = Math.min(innerW / 2, innerH / 2);
      const r = clamp(borderRadius, 0, maxR);
      return (
        <rect
          x={halfStroke}
          y={halfStroke}
          width={innerW}
          height={innerH}
          rx={r}
          ry={r}
          {...commonProps}
        />
      );
    }

    case 'circle':
    case 'ellipse':
      return (
        <ellipse
          cx={width / 2}
          cy={height / 2}
          rx={innerW / 2}
          ry={innerH / 2}
          {...commonProps}
        />
      );

    case 'triangle': {
      const pts = pointsString ?? calculatePolygonPoints(width, height, 3, strokeWidth);
      return <polygon points={pts} {...commonProps} />;
    }

    case 'polygon': {
      const pts = pointsString ?? calculatePolygonPoints(width, height, sides, strokeWidth);
      return <polygon points={pts} {...commonProps} />;
    }

    case 'star': {
      const pts = pointsString ?? calculateStarPoints(width, height, starPoints, starInnerRatio, strokeWidth);
      return <polygon points={pts} {...commonProps} />;
    }

    default:
      return (
        <rect
          x={halfStroke}
          y={halfStroke}
          width={innerW}
          height={innerH}
          {...commonProps}
        />
      );
  }
}

const AnimatedShapeBase: React.FC<AnimatedShapeProps> = (props) => {
  const {
    shape = 'rectangle',
    width = 100,
    height = 100,
    fill = 'rgba(39, 110, 241, 0.2)',
    stroke = Colors.accent.brand,
    strokeWidth = 2,
    strokeDasharray: userDasharray,
    strokeLinecap = 'round',
    strokeLinejoin = 'round',
    borderRadius = 12,
    opacity = 1,
    rotation = 0,
    x = 0,
    y = 0,
    scale = 1,
    scaleX = 1,
    scaleY = 1,
    transformOrigin = 'center center',
    sides = 6,
    starPoints = 5,
    starInnerRadiusRatio = 0.45,
    points,
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

  const config = resolveShapeAnimationConfig(props);

  const motion = calculateShapeMotion({
    currentFrame,
    fps,
    shape,
    width,
    height,
    sides,
    borderRadius,
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

  // Calculate strokeDasharray and strokeDashoffset
  // If animation is 'draw' or 'combined', use the perimeter calculated by motion engine
  const isDrawAnimation = config.type === 'draw' || config.type === 'combined';
  const effectiveDasharray = userDasharray ?? (isDrawAnimation ? motion.perimeter : undefined);
  const effectiveDashoffset = isDrawAnimation ? motion.strokeDashoffset : undefined;

  const transform = `translate3d(${motion.translateX}px, ${motion.translateY}px, 0) rotate(${motion.rotation}deg) scale(${motion.scaleX}, ${motion.scaleY})`;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width,
        height,
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
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          display: 'block',
          overflow: 'visible',
          ...svgStyle,
        }}
      >
        {renderSvgShapeGeometry({
          shape,
          width,
          height,
          strokeWidth,
          borderRadius,
          sides,
          starPoints,
          starInnerRatio: starInnerRadiusRatio,
          pointsString: points,
          fill,
          stroke,
          strokeDasharray: effectiveDasharray,
          strokeDashoffset: effectiveDashoffset,
          strokeLinecap,
          strokeLinejoin,
        })}
      </svg>
      {children}
    </div>
  );
};

export const AnimatedShape = React.memo(AnimatedShapeBase);
