/**
 * SplitTransition Component
 * Configurable, frame-accurate Remotion transition component that divides
 * visual content into multiple sections and animates them independently.
 * Supports:
 * - Two horizontal panels (top/bottom)
 * - Two vertical panels (left/right)
 * - Four quadrants (2x2 grid)
 * - Multiple horizontal or vertical strips
 * - Custom grid rows and columns
 * - Movement behaviors: Outward, Inward, Opposite / Alternating, Directional (Left, Right, Up, Down)
 * - Staggered sequential reveals & simultaneous transitions
 * - Modes: Enter, Exit, Enter-Exit envelope, Replace (cross-split)
 * Layer 2 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { SplitTransitionProps } from './types.ts';
import { calculateSplitMetrics, normalizeSplitMode } from './splitTransitionStyle.ts';

export const SplitTransition: React.FC<SplitTransitionProps> = ({
  splitDirection = 'vertical',
  panelCount,
  rows,
  cols,
  mode = 'enter',
  movementDirection = 'outward',
  distance = '100%',
  panelGap = 0,
  staggerDelay = 0,
  staggerOrder = 'start-to-end',
  duration,
  durationInFrames,
  delay = 0,
  easing = 'easeOut',
  fade = false,
  fromOpacity,
  toOpacity,
  spring,
  springPreset,
  overshoot,
  reverse = false,
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

  const metrics = calculateSplitMetrics({
    currentFrame,
    splitDirection,
    panelCount,
    rows,
    cols,
    mode,
    movementDirection,
    distance,
    panelGap,
    staggerDelay,
    staggerOrder,
    duration,
    durationInFrames,
    delay,
    easing,
    fade,
    fromOpacity,
    toOpacity,
    spring,
    springPreset,
    overshoot,
    reverse,
    inDuration,
    holdDuration,
    outDuration,
  });

  const normalizedMode = normalizeSplitMode(mode);

  // -------------------------------------------------------------------------
  // Replace Mode (Cross-Split Dual Layer)
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
        {/* Base Layer: Incoming Content revealed beneath parting panels */}
        {incoming && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            {incoming}
          </div>
        )}

        {/* Top Layer: Outgoing Content partitioned and splitting apart */}
        {outgoing &&
          metrics.panels.map((panel) => (
            <div
              key={`split-out-${panel.index}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                clipPath: panel.clipPath,
                WebkitClipPath: panel.clipPath,
                transform: `translate(${panel.translateX}, ${panel.translateY})`,
                WebkitTransform: `translate(${panel.translateX}, ${panel.translateY})`,
                opacity: panel.opacity,
                willChange: 'transform, opacity',
              }}
            >
              {outgoing}
            </div>
          ))}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Standard Modes (Enter, Exit, Enter-Exit)
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
      {metrics.panels.map((panel) => (
        <div
          key={`split-panel-${panel.index}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            clipPath: panel.clipPath,
            WebkitClipPath: panel.clipPath,
            transform: `translate(${panel.translateX}, ${panel.translateY})`,
            WebkitTransform: `translate(${panel.translateX}, ${panel.translateY})`,
            opacity: panel.opacity,
            willChange: 'transform, opacity',
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
};
