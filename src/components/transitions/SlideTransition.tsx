/**
 * SlideTransition Component
 * Configurable, frame-accurate Remotion transition component that moves visual content
 * into or out of the composition across 8 cardinal and diagonal directions.
 * Supports:
 * - Directions: left, right, top, bottom, top-left, top-right, bottom-left, bottom-right
 * - Modes: enter, exit, enter-exit, replace (cross-slide)
 * - Movement: interpolation with custom easing or physics-based spring with overshoot
 * - Optional combined opacity fade and boundary clipping
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SlideTransitionProps } from './types.ts';
import { calculateSlideMetrics, normalizeSlideMode } from './slideTransitionStyle.ts';

export const SlideTransition: React.FC<SlideTransitionProps> = ({
  direction = 'left',
  mode = 'enter',
  distance = '100%',
  startPosition,
  endPosition,
  duration,
  durationInFrames,
  delay = 0,
  easing = 'easeOut',
  fade = false,
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

  const metrics = calculateSlideMetrics({
    currentFrame,
    fps,
    direction,
    mode,
    distance,
    duration,
    durationInFrames,
    delay,
    easing,
    fade,
    spring,
    springPreset,
    overshoot,
    reverse,
    inDuration,
    holdDuration,
    outDuration,
    startPosition,
    endPosition,
  });

  const normalizedMode = normalizeSlideMode(mode);
  const containerOverflow = overflow ?? (clip ? 'hidden' : 'visible');

  // -------------------------------------------------------------------------
  // Replace Mode (Dual-Layer Push / Cross-Slide)
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
              transform: `translate3d(${metrics.outgoingTranslateX}, ${metrics.outgoingTranslateY}, 0)`,
              opacity: metrics.outgoingOpacity,
              pointerEvents: metrics.outgoingOpacity <= 0 ? 'none' : undefined,
              willChange: 'transform, opacity',
              zIndex: 1,
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
              transform: `translate3d(${metrics.incomingTranslateX}, ${metrics.incomingTranslateY}, 0)`,
              opacity: metrics.incomingOpacity,
              pointerEvents: metrics.incomingOpacity <= 0 ? 'none' : undefined,
              willChange: 'transform, opacity',
              zIndex: 2,
            }}
          >
            {incoming}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Single Layer Mode (enter, exit, enter-exit)
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
          transform: `translate3d(${metrics.translateX}, ${metrics.translateY}, 0)`,
          opacity: metrics.opacity,
          willChange: 'transform, opacity',
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
};
