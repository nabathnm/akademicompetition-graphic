/**
 * MaskTransition Component
 * Configurable, frame-accurate Remotion transition component that reveals or hides
 * visual content using custom geometric masks and SVG paths.
 * Supports:
 * - 6 Mask Types: rectangle, rounded-rectangle, circle, ellipse, polygon, custom SVG path
 * - Modes: reveal, hide, reveal-hide (envelope), replace (dual-layer cross-mask)
 * - Built-in SVG path presets (heart, star, diamond, badge, cloud, flower) or arbitrary SVG path strings
 * - Polygon shapes: triangle, star, diamond, hexagon, pentagon, or custom point strings
 * - Custom origin points (center, top, bottom, left, right, top-left, etc.)
 * - Dynamic rotation and combined opacity fade
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { MaskTransitionProps } from './types.ts';
import { calculateMaskMetrics, normalizeMaskMode } from './maskTransitionStyle.ts';

export const MaskTransition: React.FC<MaskTransitionProps> = ({
  maskType = 'circle',
  mode = 'reveal',
  duration,
  durationInFrames,
  delay = 0,
  easing = 'easeInOut',
  origin = 'center',
  maskOrigin,
  shape = 'star',
  polygonPoints,
  pathData,
  d,
  pathViewBox = '0 0 100 100',
  cornerRadius,
  rotation = 0,
  initialRotation,
  finalRotation,
  scaleMultiplier = 1.0,
  maxScale,
  fade = false,
  fromOpacity,
  toOpacity,
  spring,
  springPreset,
  overshoot,
  reverse = false,
  clipId: customClipId,
  overflow = 'hidden',
  inDuration,
  holdDuration,
  outDuration,
  fromContent,
  outgoingContent,
  toContent,
  incomingContent,
  backgroundColor,
  style,
  className,
  children,
}) => {
  const currentFrame = useCurrentFrame();
  const reactId = React.useId().replace(/[:]/g, '');
  const activeClipId = customClipId || `mask-clip-${reactId}`;

  const metrics = calculateMaskMetrics({
    currentFrame,
    maskType,
    mode,
    duration,
    durationInFrames,
    delay,
    easing,
    origin,
    maskOrigin,
    shape,
    polygonPoints,
    pathData,
    d,
    pathViewBox,
    cornerRadius,
    rotation,
    initialRotation,
    finalRotation,
    scaleMultiplier,
    maxScale,
    fade,
    fromOpacity,
    toOpacity,
    spring,
    springPreset,
    overshoot,
    reverse,
    clipId: activeClipId,
    inDuration,
    holdDuration,
    outDuration,
  });

  const normalizedMode = normalizeMaskMode(mode);

  // Helper to render the geometric shape inside the clipPath
  const renderShapeElement = () => {
    switch (metrics.shape.type) {
      case 'circle':
        return <circle cx={0} cy={0} r={0.5} />;
      case 'ellipse':
        return <ellipse cx={0} cy={0} rx={0.5} ry={0.35} />;
      case 'rectangle':
        return (
          <rect
            x={-0.5}
            y={-0.5}
            width={1}
            height={1}
            rx={metrics.shape.rx ?? 0}
            ry={metrics.shape.ry ?? 0}
          />
        );
      case 'rounded-rectangle':
        return (
          <rect
            x={-0.5}
            y={-0.5}
            width={1}
            height={1}
            rx={metrics.shape.rx ?? 0.1}
            ry={metrics.shape.ry ?? 0.1}
          />
        );
      case 'polygon':
        return <polygon points={metrics.shape.points} />;
      case 'path':
        return (
          <g transform={metrics.shape.pathTransform}>
            <path d={metrics.shape.d} />
          </g>
        );
      default:
        return <circle cx={0} cy={0} r={0.5} />;
    }
  };

  // SVG ClipPath Definition
  const clipPathDefinition = (
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <defs>
        <clipPath id={metrics.clipId} clipPathUnits="objectBoundingBox">
          <g transform={metrics.transform}>{renderShapeElement()}</g>
        </clipPath>
      </defs>
    </svg>
  );

  // -------------------------------------------------------------------------
  // Replace Mode (Dual-Layer Cross-Mask)
  // -------------------------------------------------------------------------
  if (normalizedMode === 'replace') {
    const childrenArray = React.Children.toArray(children);
    const outgoing = fromContent ?? outgoingContent ?? childrenArray[0] ?? null;
    const incoming = toContent ?? incomingContent ?? childrenArray[1] ?? null;

    return (
      <div
        className={className}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow,
          backgroundColor,
          ...style,
        }}
      >
        {clipPathDefinition}

        {/* Base Layer: Outgoing Content */}
        {outgoing && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: metrics.outgoingOpacity,
            }}
          >
            {outgoing}
          </div>
        )}

        {/* Masked Top Layer: Incoming Content */}
        {incoming && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              clipPath: metrics.clipPath,
              WebkitClipPath: metrics.clipPath,
              opacity: metrics.incomingOpacity,
            }}
          >
            {incoming}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Standard Modes (Reveal, Hide, Reveal-Hide)
  // -------------------------------------------------------------------------
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow,
        backgroundColor,
        ...style,
      }}
    >
      {clipPathDefinition}

      <div
        style={{
          width: '100%',
          height: '100%',
          clipPath: metrics.clipPath,
          WebkitClipPath: metrics.clipPath,
          opacity: metrics.opacity,
        }}
      >
        {children}
      </div>
    </div>
  );
};
