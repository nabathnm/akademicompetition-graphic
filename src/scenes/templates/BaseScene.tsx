/**
 * BaseScene Template Component
 * Foundational container providing layered structure, safe areas, and timing management.
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { BaseSceneProps } from '../types';
import { Colors } from '../../styles/colors';
import { Spacing } from '../../styles/spacing';

export const BaseScene: React.FC<BaseSceneProps> = ({
  sceneId,
  title,
  timing,
  background = { type: 'solid', color: Colors.dark.bgPrimary },
  children,
  overlay,
  safeAreaPadding = Spacing.canvas.actionSafePadding,
}) => {
  const frame = useCurrentFrame();
  const sceneProgress = timing.durationInFrames > 0
    ? Math.min(1, Math.max(0, frame / timing.durationInFrames))
    : 1;

  // Background style calculation
  const getBackgroundStyle = (): React.CSSProperties => {
    switch (background.type) {
      case 'gradient':
        return {
          background: background.gradient || 'linear-gradient(180deg, #121214 0%, #000000 100%)',
        };
      case 'solid':
      default:
        return {
          backgroundColor: background.color || Colors.dark.bgPrimary,
        };
    }
  };

  return (
    <div
      data-scene-id={sceneId}
      data-scene-title={title}
      data-scene-duration={timing.durationInFrames}
      data-scene-progress={sceneProgress.toFixed(2)}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...getBackgroundStyle(),
      }}
    >
      {/* Background Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: Spacing.zIndex.background,
        }}
      />

      {/* Main Content Safe Area Layer */}
      <div
        style={{
          position: 'absolute',
          top: safeAreaPadding,
          left: safeAreaPadding,
          right: safeAreaPadding,
          bottom: safeAreaPadding,
          zIndex: Spacing.zIndex.content,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </div>

      {/* Foreground Overlay Layer */}
      {overlay && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: Spacing.zIndex.overlay,
            pointerEvents: 'none',
          }}
        >
          {overlay}
        </div>
      )}
    </div>
  );
};
