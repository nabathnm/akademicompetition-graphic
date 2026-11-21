/**
 * PlaygroundShell Component
 * Premium dark layout providing navigation, telemetry, category filtering, and stage preview area.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { MotionPlaygroundProps } from '../types';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { formatTimecode } from '../../utils/timing/frames';
import { ComponentCategory } from '../../components/types';

export interface PlaygroundShellProps extends MotionPlaygroundProps {
  children?: React.ReactNode;
}

const CATEGORIES: Array<{ id: ComponentCategory | 'all'; label: string }> = [
  { id: 'all', label: 'All Components' },
  { id: 'motion', label: 'Motion Primitives' },
  { id: 'typography', label: 'Typography' },
  { id: 'ui', label: 'UI Components' },
  { id: 'mockups', label: 'Mockups' },
  { id: 'graphics', label: 'Graphics' },
  { id: 'transitions', label: 'Transitions' },
];

export const PlaygroundShell: React.FC<PlaygroundShellProps> = ({
  selectedCategory = 'all',
  viewMode = 'overview',
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: Colors.dark.bgPrimary,
        color: Colors.text.primary,
        fontFamily: Typography.fontFamily.sans,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Top Header & Telemetry Bar */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `0 ${Spacing.scale.xl}px`,
          height: 64,
          backgroundColor: Colors.dark.surface1,
          borderBottom: `1px solid ${Colors.border.default}`,
          zIndex: Spacing.zIndex.floatingUI,
        }}
      >
        {/* Brand Lockup */}
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.md }}>
          <div
            style={{
              width: 12,
              height: 12,
              backgroundColor: Colors.accent.brand,
              borderRadius: 2,
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em' }}>
                MOTION PLAYGROUND
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: Typography.fontFamily.mono,
                  padding: '1px 6px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: 'rgba(39, 110, 241, 0.15)',
                  color: Colors.accent.brandLight,
                  border: `1px solid ${Colors.accent.brand}40`,
                }}
              >
                LAYER 1
              </span>
            </div>
            <div style={{ fontSize: 10, color: Colors.text.tertiary, marginTop: -2 }}>
              Component Benchmark & Evaluation Engine
            </div>
          </div>
        </div>

        {/* View Mode Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: Colors.dark.surface2,
            padding: '3px 4px',
            borderRadius: Spacing.radius.sm,
            border: `1px solid ${Colors.border.subtle}`,
            fontSize: 11,
            fontFamily: Typography.fontFamily.mono,
          }}
        >
          <span
            style={{
              padding: '3px 10px',
              borderRadius: Spacing.radius.xs,
              backgroundColor: viewMode === 'overview' ? Colors.dark.surfaceElevated : 'transparent',
              color: viewMode === 'overview' ? Colors.text.primary : Colors.text.tertiary,
              fontWeight: viewMode === 'overview' ? 600 : 400,
            }}
          >
            Overview
          </span>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: Spacing.radius.xs,
              backgroundColor: viewMode === 'utilities' ? Colors.dark.surfaceElevated : 'transparent',
              color: viewMode === 'utilities' ? Colors.accent.cyan : Colors.text.tertiary,
              fontWeight: viewMode === 'utilities' ? 600 : 400,
            }}
          >
            Utilities & Hooks
          </span>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: Spacing.radius.xs,
              backgroundColor: viewMode === 'typography' ? Colors.dark.surfaceElevated : 'transparent',
              color: viewMode === 'typography' ? Colors.accent.brandLight : Colors.text.tertiary,
              fontWeight: viewMode === 'typography' ? 600 : 400,
            }}
          >
            AnimatedText
          </span>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: Spacing.radius.xs,
              backgroundColor: viewMode === 'comparison' ? Colors.dark.surfaceElevated : 'transparent',
              color: viewMode === 'comparison' ? Colors.text.primary : Colors.text.tertiary,
              fontWeight: viewMode === 'comparison' ? 600 : 400,
            }}
          >
            Variant A/B
          </span>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: Spacing.radius.xs,
              backgroundColor: viewMode === 'isolated' ? Colors.dark.surfaceElevated : 'transparent',
              color: viewMode === 'isolated' ? Colors.text.primary : Colors.text.tertiary,
              fontWeight: viewMode === 'isolated' ? 600 : 400,
            }}
          >
            Isolated
          </span>
        </div>

        {/* Telemetry Counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: Spacing.scale.md,
            fontFamily: Typography.fontFamily.mono,
            fontSize: 11,
            color: Colors.text.secondary,
          }}
        >
          <span>{width}x{height}</span>
          <span style={{ color: Colors.border.default }}>|</span>
          <span>{fps} FPS</span>
          <span style={{ color: Colors.border.default }}>|</span>
          <span style={{ color: Colors.accent.cyan }}>
            FRAME: {frame}/{durationInFrames}
          </span>
          <span style={{ color: Colors.border.default }}>|</span>
          <span>{formatTimecode(frame, fps)}</span>
        </div>
      </header>

      {/* Category Filter Navigation Bar */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: Spacing.scale.xs,
          padding: `0 ${Spacing.scale.xl}px`,
          height: 48,
          backgroundColor: Colors.dark.surface2,
          borderBottom: `1px solid ${Colors.border.subtle}`,
          zIndex: Spacing.zIndex.floatingUI - 1,
        }}
      >
        <span
          style={{
            ...Typography.caption.eyebrow,
            color: Colors.text.tertiary,
            marginRight: Spacing.scale.xs,
          }}
        >
          CATEGORY:
        </span>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              style={{
                padding: '4px 12px',
                borderRadius: Spacing.radius.full,
                fontSize: 11,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? Colors.text.primary : Colors.text.secondary,
                backgroundColor: isActive ? Colors.accent.brand : Colors.dark.surface3,
                border: `1px solid ${isActive ? Colors.accent.brandLight : 'transparent'}`,
              }}
            >
              {cat.label}
            </div>
          );
        })}
      </nav>

      {/* Main Showcase Stage Workspace */}
      <main
        style={{
          flex: 1,
          padding: Spacing.scale.lg,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: Spacing.scale.xl,
        }}
      >
        {children}
      </main>

      {/* Architecture Footer Status Bar */}
      <footer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `0 ${Spacing.scale.xl}px`,
          height: 36,
          backgroundColor: Colors.dark.surface1,
          borderTop: `1px solid ${Colors.border.subtle}`,
          fontSize: 10,
          fontFamily: Typography.fontFamily.mono,
          color: Colors.text.tertiary,
          zIndex: Spacing.zIndex.floatingUI,
        }}
      >
        <div style={{ display: 'flex', gap: Spacing.scale.lg }}>
          <span style={{ color: Colors.accent.brand }}>
            ● [L1] Motion Playground
          </span>
          <span>→ [L2] Component Library</span>
          <span>→ [L3] Scene Library</span>
          <span>→ [L4] Ad Composition</span>
        </div>
        <div>
          <span>FRAME-DETERMINISTIC · ZERO CSS-ANIMATION TIMING DEPENDENCY</span>
        </div>
      </footer>
    </div>
  );
};
