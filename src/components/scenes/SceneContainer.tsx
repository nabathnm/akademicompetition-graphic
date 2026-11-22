/**
 * SceneContainer Component
 * Foundational container for all scenes in the Remotion Motion Graphics Framework.
 * Standardizes scene dimensions, layout, background, content positioning, safe area, and scene-level kinematics.
 * Layer 3 of the Motion Graphics Framework.
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneContainerProps } from './types.ts';
import {
  calculateSceneAnimationMetrics,
  DEFAULT_SAFE_AREA_PX,
  resolveSceneDimension,
  resolveSceneLayoutStyles,
  resolveScenePadding,
} from './sceneContainerStyle.ts';

export const SceneContainer: React.FC<SceneContainerProps> = ({
  width,
  height,
  background,
  backgroundColor,
  backgroundImage,
  backgroundContent,
  layout = 'centered',
  horizontalAlignment,
  verticalAlignment,
  alignment,
  padding,
  safeArea = false,
  overflow = 'hidden',
  sceneId,
  debug = false,
  durationInFrames,
  delay = 0,
  animation = 'none',
  style,
  className,
  children,
}) => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();

  // Resolve Dimensions
  const resolvedWidth = resolveSceneDimension(width, videoConfig?.width ?? '100%');
  const resolvedHeight = resolveSceneDimension(height, videoConfig?.height ?? '100%');

  // Resolve Padding & Safe Area
  const resolvedPadding = useMemo(() => resolveScenePadding(padding, safeArea), [padding, safeArea]);

  // Resolve Layout Styles
  const layoutStyles = useMemo(
    () => resolveSceneLayoutStyles(layout, alignment, horizontalAlignment, verticalAlignment),
    [layout, alignment, horizontalAlignment, verticalAlignment],
  );

  // Compute Scene Animation Metrics
  const animMetrics = useMemo(
    () =>
      calculateSceneAnimationMetrics({
        frame,
        durationInFrames: durationInFrames ?? videoConfig?.durationInFrames,
        delay,
        animation,
      }),
    [frame, durationInFrames, videoConfig?.durationInFrames, delay, animation],
  );

  // Build Background Styles
  const bgStyles: React.CSSProperties = useMemo(() => {
    const s: React.CSSProperties = {};
    if (backgroundColor) s.backgroundColor = backgroundColor;
    if (background) s.background = background;
    if (backgroundImage) {
      s.backgroundImage = backgroundImage.startsWith('url(') ? backgroundImage : `url(${backgroundImage})`;
      s.backgroundSize = 'cover';
      s.backgroundPosition = 'center';
      s.backgroundRepeat = 'no-repeat';
    }
    return s;
  }, [background, backgroundColor, backgroundImage]);

  const safeMarginPx = safeArea === true ? DEFAULT_SAFE_AREA_PX : typeof safeArea === 'number' ? safeArea : 0;

  return (
    <div
      data-scene-id={sceneId}
      className={className}
      style={{
        width: resolvedWidth,
        height: resolvedHeight,
        position: 'relative',
        overflow,
        opacity: animMetrics.opacity,
        transform: `translate(${animMetrics.translateX}px, ${animMetrics.translateY}px) scale(${animMetrics.scale})`,
        ...bgStyles,
        ...style,
      }}
    >
      {/* Background Visual Layer */}
      {backgroundContent && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {backgroundContent}
        </div>
      )}

      {/* Main Content Area with Padding & Layout */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          paddingTop: resolvedPadding.paddingTop,
          paddingBottom: resolvedPadding.paddingBottom,
          paddingLeft: resolvedPadding.paddingLeft,
          paddingRight: resolvedPadding.paddingRight,
          zIndex: 1,
          ...layoutStyles,
        }}
      >
        {children}
      </div>

      {/* Debug Overlay */}
      {debug && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 9999,
            border: '1px dashed rgba(6, 182, 212, 0.4)',
          }}
        >
          {/* Safe Area Guide Box */}
          {safeMarginPx > 0 && (
            <div
              style={{
                position: 'absolute',
                top: safeMarginPx,
                bottom: safeMarginPx,
                left: safeMarginPx,
                right: safeMarginPx,
                border: '1px dotted rgba(236, 72, 153, 0.6)',
                boxSizing: 'border-box',
              }}
            />
          )}

          {/* Telemetry Pill */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              border: '1px solid rgba(6, 182, 212, 0.5)',
              borderRadius: 4,
              padding: '4px 8px',
              fontFamily: 'ui-monospace, monospace',
              fontSize: 10,
              color: '#06b6d4',
              display: 'flex',
              gap: 8,
            }}
          >
            <span>SCENE: {sceneId ?? 'unnamed'}</span>
            <span>|</span>
            <span>
              DIM: {resolvedWidth}x{resolvedHeight}
            </span>
            <span>|</span>
            <span>LAYOUT: {layout}</span>
            <span>|</span>
            <span>FRAME: {frame}</span>
            <span>|</span>
            <span>PHASE: {animMetrics.phase}</span>
          </div>
        </div>
      )}
    </div>
  );
};
