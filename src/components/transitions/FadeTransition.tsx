/**
 * FadeTransition Component
 * Reusable Remotion transition component for smooth opacity fades and dual-layer crossfades.
 * Supports:
 * - mode='in': fade from invisible to visible
 * - mode='out': fade from visible to invisible
 * - mode='in-out': entrance fade, plateau hold, and exit fade envelope
 * - mode='crossfade': simultaneous cross-dissolve between outgoing and incoming content layers
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { FadeTransitionProps } from './types.ts';
import { calculateFadeOpacity } from './fadeTransitionStyle.ts';

export const FadeTransition: React.FC<FadeTransitionProps> = ({
  mode = 'in',
  direction,
  duration,
  durationInFrames,
  delay = 0,
  fromOpacity = 0,
  toOpacity = 1,
  reverse = false,
  easing = 'easeInOut',
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

  const metrics = calculateFadeOpacity({
    currentFrame,
    mode,
    direction,
    duration,
    durationInFrames,
    delay,
    fromOpacity,
    toOpacity,
    reverse,
    easing,
    inDuration,
    holdDuration,
    outDuration,
  });

  const resolvedMode = mode ?? (direction === 'out' ? 'out' : 'in');

  // -------------------------------------------------------------------------
  // Crossfade Rendering (Dual Layer)
  // -------------------------------------------------------------------------
  if (resolvedMode === 'crossfade') {
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
          backgroundColor,
          overflow: 'hidden',
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
              opacity: metrics.outgoingOpacity,
              pointerEvents: metrics.outgoingOpacity <= 0 ? 'none' : undefined,
              visibility: metrics.outgoingOpacity <= 0 ? 'hidden' : 'visible',
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
              opacity: metrics.incomingOpacity,
              pointerEvents: metrics.incomingOpacity <= 0 ? 'none' : undefined,
              visibility: metrics.incomingOpacity <= 0 ? 'hidden' : 'visible',
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
  // Single Content Layer Rendering (in, out, in-out)
  // -------------------------------------------------------------------------
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        opacity: metrics.opacity,
        pointerEvents: metrics.opacity <= 0 ? 'none' : undefined,
        visibility: metrics.opacity <= 0 ? 'hidden' : 'visible',
        backgroundColor,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
