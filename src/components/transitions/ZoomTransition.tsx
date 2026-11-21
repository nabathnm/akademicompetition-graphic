/**
 * ZoomTransition Component
 * Configurable, frame-accurate Remotion transition component that scales visual content
 * into or out of view, hyper-zooms through space, or conducts dual-layer zoom replacements.
 * Supports:
 * - Modes: in (zoom-in), out (zoom-out), in-out (zoom-in-out), through (hyper-zoom), replace (cross-zoom)
 * - Motion: interpolation with custom easing curves or physics-based spring with overshoot
 * - Custom transform origin pivot points ('center', 'top left', '50% 50%', etc.)
 * - Optional rotation and synchronized opacity fade combination
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { ZoomTransitionProps } from './types.ts';
import { calculateZoomMetrics, normalizeZoomMode } from './zoomTransitionStyle.ts';

export const ZoomTransition: React.FC<ZoomTransitionProps> = ({
  mode = 'in',
  initialScale,
  finalScale,
  throughScale,
  outgoingScale,
  incomingScale,
  transformOrigin = 'center',
  duration,
  durationInFrames,
  delay = 0,
  easing = 'easeOut',
  fade = false,
  fromOpacity,
  toOpacity,
  rotation = 0,
  initialRotation = 0,
  finalRotation,
  spring = false,
  springPreset,
  overshoot = false,
  reverse = false,
  clip = true,
  overflow,
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
  const { fps } = useVideoConfig();

  const metrics = calculateZoomMetrics({
    currentFrame,
    fps,
    mode,
    initialScale,
    finalScale,
    throughScale,
    outgoingScale,
    incomingScale,
    transformOrigin,
    duration,
    durationInFrames,
    delay,
    easing,
    fade,
    fromOpacity,
    toOpacity,
    rotation,
    initialRotation,
    finalRotation,
    spring,
    springPreset,
    overshoot,
    reverse,
    inDuration,
    holdDuration,
    outDuration,
  });

  const normalizedMode = normalizeZoomMode(mode);
  const containerOverflow = overflow ?? (clip ? 'hidden' : 'visible');

  // -------------------------------------------------------------------------
  // Replace Mode (Dual-Layer Zoom Replace / Cross-Zoom)
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
          overflow: containerOverflow,
          backgroundColor,
          ...style,
        }}
      >
        {/* Outgoing Content Layer */}
        {outgoing && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transform: metrics.outgoingTransform,
              transformOrigin: metrics.transformOrigin,
              opacity: metrics.outgoingOpacity,
              pointerEvents: metrics.outgoingOpacity <= 0 ? 'none' : undefined,
              visibility: metrics.outgoingOpacity <= 0 ? 'hidden' : 'visible',
              zIndex: 1,
              willChange: 'transform, opacity',
            }}
          >
            {outgoing}
          </div>
        )}

        {/* Incoming Content Layer */}
        {incoming && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transform: metrics.incomingTransform,
              transformOrigin: metrics.transformOrigin,
              opacity: metrics.incomingOpacity,
              pointerEvents: metrics.incomingOpacity <= 0 ? 'none' : undefined,
              visibility: metrics.incomingOpacity <= 0 ? 'hidden' : 'visible',
              zIndex: 2,
              willChange: 'transform, opacity',
            }}
          >
            {incoming}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Single-Layer Modes ('in' | 'out' | 'in-out' | 'through')
  // -------------------------------------------------------------------------
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: containerOverflow,
        backgroundColor,
        ...style,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: metrics.transform,
          transformOrigin: metrics.transformOrigin,
          opacity: metrics.opacity,
          pointerEvents: metrics.opacity <= 0 ? 'none' : undefined,
          visibility: metrics.opacity <= 0 ? 'hidden' : 'visible',
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </div>
    </div>
  );
};
