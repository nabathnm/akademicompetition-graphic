/**
 * AnimatedPath Component
 * Reusable Remotion graphic component providing frame-accurate, deterministic SVG path rendering
 * supporting custom vector paths, path drawing/retracting, progressive and reverse reveals,
 * fill reveals, and deterministic motion-along-path tracking without browser DOM or CSS motion paths.
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { AnimatedPathProps, PathFollowerConfig, PathPoint } from './types.ts';
import {
  parseSvgPath,
  calculatePathBoundingBox,
  resolvePathAnimationConfig,
  calculatePathMotion,
} from './animatedPathStyle.ts';
import { Colors } from '../../styles/colors.ts';

export const AnimatedPath: React.FC<AnimatedPathProps> = (props) => {
  const {
    d,
    fill = 'none',
    fillRule = 'nonzero',
    fillOpacity = 1,
    stroke = Colors.accent.brand,
    strokeWidth = 2,
    strokeLinecap = 'round',
    strokeLinejoin = 'round',
    strokeMiterlimit = 4,
    strokeDasharray: userDasharray,
    strokeDashoffset: userDashoffset,
    strokeOpacity = 1,
    opacity = 1,
    pathLength: userPathLength,
    viewBox,
    width,
    height,
    preserveAspectRatio = 'xMidYMid meet',
    x = 0,
    y = 0,
    rotation = 0,
    transformOrigin = 'center center',
    scale = 1,
    scaleX = 1,
    scaleY = 1,
    fillRevealTiming = 'with-draw',
    fillDelay = 0,
    fillDurationInFrames = 20,
    showFollower = false,
    follower,
    followerSize = 6,
    followerColor,
    followerStroke,
    followerStrokeWidth = 1.5,
    autoRotateFollower = true,
    followerDelay = 0,
    followerDurationInFrames,
    followerLoop,
    followerProgress: followerProgressOverride,
    renderFollower,
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

  // 1. Parse SVG path geometry and segments
  const parsed = React.useMemo(() => parseSvgPath(d), [d]);
  const totalLength = userPathLength !== undefined && userPathLength > 0 ? userPathLength : parsed.totalLength;

  // 2. Resolve animation parameters
  const config = React.useMemo(() => resolvePathAnimationConfig(props), [props]);

  // 3. Compute SVG container dimensions and viewport bounds
  const bbox = React.useMemo(
    () =>
      calculatePathBoundingBox({
        parsed,
        strokeWidth,
        width,
        height,
        viewBox,
      }),
    [parsed, strokeWidth, width, height, viewBox]
  );

  // 4. Merge follower configuration
  const mergedFollowerConfig: PathFollowerConfig = React.useMemo(() => {
    return {
      enabled: showFollower || (follower?.enabled ?? false),
      size: follower?.size ?? followerSize,
      color: follower?.color ?? followerColor ?? stroke,
      stroke: follower?.stroke ?? followerStroke ?? '#ffffff',
      strokeWidth: follower?.strokeWidth ?? followerStrokeWidth,
      autoRotate: follower?.autoRotate ?? autoRotateFollower,
      offsetAngle: follower?.offsetAngle ?? 0,
      delay: follower?.delay ?? followerDelay,
      duration: follower?.duration ?? followerDurationInFrames,
      loop: follower?.loop ?? followerLoop,
      easing: follower?.easing,
      customElement: follower?.customElement,
    };
  }, [
    showFollower,
    follower,
    followerSize,
    followerColor,
    stroke,
    followerStroke,
    followerStrokeWidth,
    autoRotateFollower,
    followerDelay,
    followerDurationInFrames,
    followerLoop,
  ]);

  // 5. Calculate frame-accurate motion kinetics
  const motion = calculatePathMotion({
    currentFrame,
    fps,
    totalLength,
    segments: parsed.segments,
    strokeWidth,
    userDasharray,
    userDashoffset,
    baseFillOpacity: fillOpacity,
    baseStrokeOpacity: strokeOpacity,
    baseOpacity: opacity,
    baseRotation: rotation,
    baseX: x,
    baseY: y,
    baseScale: scale,
    baseScaleX: scaleX,
    baseScaleY: scaleY,
    config,
    fillRevealTiming,
    fillDelay,
    fillDurationInFrames,
    showFollower: mergedFollowerConfig.enabled,
    followerConfig: mergedFollowerConfig,
    followerProgressOverride,
    exitFrame,
    exitDurationInFrames,
    exitAnimation,
  });

  const transform = `translate3d(${motion.translateX}px, ${motion.translateY}px, 0) rotate(${motion.rotation}deg) scale(${motion.scaleX}, ${motion.scaleY})`;

  const effectiveFollowerSize = mergedFollowerConfig.size ?? 6;
  const effectiveFollowerColor = mergedFollowerConfig.color ?? stroke;
  const effectiveFollowerStroke = mergedFollowerConfig.stroke ?? '#ffffff';
  const effectiveFollowerStrokeWidth = mergedFollowerConfig.strokeWidth ?? 1.5;

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: width ?? bbox.boxWidth,
        height: height ?? bbox.boxHeight,
        opacity: motion.opacity,
        transformOrigin,
        transform,
        pointerEvents: 'none',
        ...style,
      }}
    >
      <svg
        viewBox={bbox.viewBox}
        width={width ?? bbox.boxWidth}
        height={height ?? bbox.boxHeight}
        preserveAspectRatio={preserveAspectRatio}
        style={{
          display: 'block',
          overflow: 'visible',
          ...svgStyle,
        }}
      >
        {/* Core Vector Path */}
        <path
          d={d}
          fill={fill === 'none' ? 'none' : fill}
          fillRule={fillRule}
          fillOpacity={fill === 'none' ? 0 : motion.fillOpacity}
          stroke={stroke}
          strokeWidth={motion.effectiveStrokeWidth}
          strokeLinecap={strokeLinecap}
          strokeLinejoin={strokeLinejoin}
          strokeMiterlimit={strokeMiterlimit}
          strokeOpacity={motion.strokeOpacity}
          strokeDasharray={motion.strokeDasharray}
          strokeDashoffset={motion.strokeDashoffset}
        />

        {/* Optional Follower Marker / Traveling Indicator */}
        {motion.followerPoint && mergedFollowerConfig.enabled && (
          <g>
            {renderFollower ? (
              renderFollower(motion.followerPoint)
            ) : typeof mergedFollowerConfig.customElement === 'function' ? (
              mergedFollowerConfig.customElement(motion.followerPoint)
            ) : mergedFollowerConfig.customElement ? (
              <g
                transform={`translate(${motion.followerPoint.x}, ${motion.followerPoint.y}) rotate(${
                  mergedFollowerConfig.autoRotate ? motion.followerPoint.angle : 0
                })`}
              >
                {mergedFollowerConfig.customElement}
              </g>
            ) : (
              <g
                transform={`translate(${motion.followerPoint.x}, ${motion.followerPoint.y}) rotate(${
                  mergedFollowerConfig.autoRotate ? motion.followerPoint.angle : 0
                })`}
              >
                {/* Subtle outer beacon halo */}
                <circle
                  r={effectiveFollowerSize * 1.6}
                  fill={effectiveFollowerColor}
                  fillOpacity={0.25}
                />
                {/* Center marker bead */}
                <circle
                  r={effectiveFollowerSize}
                  fill={effectiveFollowerColor}
                  stroke={effectiveFollowerStroke}
                  strokeWidth={effectiveFollowerStrokeWidth}
                />
              </g>
            )}
          </g>
        )}
      </svg>

      {/* Children overlay or custom render callback */}
      {typeof children === 'function'
        ? (children as (point: PathPoint) => React.ReactNode)(
            motion.followerPoint ?? {
              x: 0,
              y: 0,
              angle: 0,
              distance: 0,
              progress: motion.strokeProgress,
            }
          )
        : children}
    </div>
  );
};
