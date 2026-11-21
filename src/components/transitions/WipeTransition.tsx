/**
 * WipeTransition Component
 * Configurable, frame-accurate Remotion transition component that reveals or hides
 * visual content through directional, center, diagonal, or radial clipping boundaries.
 * Supports:
 * - Directions: left-to-right, right-to-left, top-to-bottom, bottom-to-top, center-out, center-in, diagonal, radial
 * - Modes: reveal, hide, reveal-hide, replace (cross-wipe)
 * - Optional visual leading edge bar styling (color, width, glow)
 * - Optional combined opacity fade
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { WipeTransitionProps } from './types.ts';
import { calculateWipeMetrics, normalizeWipeMode } from './wipeTransitionStyle.ts';

export const WipeTransition: React.FC<WipeTransitionProps> = ({
  direction = 'left-to-right',
  mode = 'reveal',
  duration,
  durationInFrames,
  delay = 0,
  easing = 'easeInOut',
  revealOrigin = 'center',
  fade = false,
  fromOpacity,
  toOpacity,
  reverse = false,
  edgeStyle,
  edgeColor,
  edgeWidth,
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

  const resolvedEdgeWidth = edgeStyle?.width ?? edgeWidth ?? 2;
  const resolvedEdgeColor = edgeStyle?.color ?? edgeColor;
  const hasEdge = Boolean(resolvedEdgeColor);

  const metrics = calculateWipeMetrics({
    currentFrame,
    direction,
    mode,
    duration,
    durationInFrames,
    delay,
    easing,
    revealOrigin,
    fade,
    fromOpacity,
    toOpacity,
    reverse,
    edgeWidth: resolvedEdgeWidth,
    inDuration,
    holdDuration,
    outDuration,
  });

  const normalizedMode = normalizeWipeMode(mode);

  // -------------------------------------------------------------------------
  // Replace Mode (Dual-Layer Cross-Wipe)
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
          overflow: 'hidden',
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
              clipPath: metrics.outgoingClipPath,
              WebkitClipPath: metrics.outgoingClipPath,
              opacity: metrics.outgoingOpacity,
              pointerEvents: metrics.outgoingOpacity <= 0 ? 'none' : undefined,
              visibility: metrics.outgoingOpacity <= 0 ? 'hidden' : 'visible',
              zIndex: 1,
              willChange: 'clip-path, opacity',
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
              clipPath: metrics.incomingClipPath,
              WebkitClipPath: metrics.incomingClipPath,
              opacity: metrics.incomingOpacity,
              pointerEvents: metrics.incomingOpacity <= 0 ? 'none' : undefined,
              visibility: metrics.incomingOpacity <= 0 ? 'hidden' : 'visible',
              zIndex: 2,
              willChange: 'clip-path, opacity',
            }}
          >
            {incoming}
          </div>
        )}

        {/* Optional Leading Edge Bar */}
        {hasEdge && resolvedEdgeColor && metrics.edgePosition?.visible && (
          <div
            style={{
              position: 'absolute',
              top: metrics.edgePosition.y ?? 0,
              left: metrics.edgePosition.x ?? 0,
              width: metrics.edgePosition.width ?? `${resolvedEdgeWidth}px`,
              height: metrics.edgePosition.height ?? '100%',
              backgroundColor: resolvedEdgeColor,
              boxShadow: edgeStyle?.glow !== false ? `0 0 10px ${resolvedEdgeColor}` : undefined,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        )}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Single-Layer Modes ('reveal' | 'hide' | 'reveal-hide')
  // -------------------------------------------------------------------------
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor,
        ...style,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          clipPath: metrics.clipPath,
          WebkitClipPath: metrics.clipPath,
          opacity: metrics.opacity,
          pointerEvents: metrics.opacity <= 0 ? 'none' : undefined,
          visibility: metrics.opacity <= 0 ? 'hidden' : 'visible',
          willChange: 'clip-path, opacity',
        }}
      >
        {children}
      </div>

      {/* Optional Leading Edge Bar */}
      {hasEdge && resolvedEdgeColor && metrics.edgePosition?.visible && (
        <div
          style={{
            position: 'absolute',
            top: metrics.edgePosition.y ?? 0,
            left: metrics.edgePosition.x ?? 0,
            width: metrics.edgePosition.width ?? `${resolvedEdgeWidth}px`,
            height: metrics.edgePosition.height ?? '100%',
            backgroundColor: resolvedEdgeColor,
            boxShadow: edgeStyle?.glow !== false ? `0 0 10px ${resolvedEdgeColor}` : undefined,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
};
