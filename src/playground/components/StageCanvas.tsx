/**
 * StageCanvas Component
 * Neutral, high-contrast preview canvas with subtle grid and safe margin indicators.
 */

import React from 'react';
import { Colors } from '../../styles/colors';
import { Spacing } from '../../styles/spacing';

export interface StageCanvasProps {
  children?: React.ReactNode;
  showGrid?: boolean;
  aspectRatioLabel?: string;
  style?: React.CSSProperties;
}

export const StageCanvas: React.FC<StageCanvasProps> = ({
  children,
  showGrid = true,
  aspectRatioLabel = '16:9 SAFE STAGE',
  style,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: Colors.dark.bgSecondary,
        borderRadius: Spacing.radius.lg,
        border: `1px solid ${Colors.border.default}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {/* Subtle background grid pattern */}
      {showGrid && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle, ${Colors.border.subtle} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            opacity: 0.8,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Stage Safe Area Indicator Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${Spacing.scale.xs}px ${Spacing.scale.md}px`,
          borderBottom: `1px solid ${Colors.border.subtle}`,
          backgroundColor: Colors.dark.surface1,
          fontSize: 11,
          fontFamily: 'ui-monospace, monospace',
          color: Colors.text.tertiary,
          zIndex: Spacing.zIndex.content,
        }}
      >
        <span>{aspectRatioLabel}</span>
        <span>DETERMINISTIC PREVIEW</span>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: Spacing.scale.xl,
          zIndex: Spacing.zIndex.content,
        }}
      >
        {children}
      </div>
    </div>
  );
};
