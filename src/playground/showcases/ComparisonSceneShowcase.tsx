/**
 * ComparisonScene Showcase
 * Interactive motion graphics playground demonstrating ComparisonScene:
 * - Before & After comparisons with animated center divider line
 * - Side-by-Side and Top-and-Bottom product & UI comparisons
 * - Synchronized and sequential panel reveal animations
 * - Accent side highlighting and status badges
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Columns,
  Layers,
  Sparkles,
  Sliders,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';
import { ComparisonScene } from '../../components/scenes/ComparisonScene.tsx';
import type {
  ComparisonSceneLayout,
} from '../../components/scenes/types.ts';

export const ComparisonSceneShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // State
  const [layout, setLayout] = useState<ComparisonSceneLayout>('side-by-side');
  const [sequential, setSequential] = useState<boolean>(true);
  const [highlightSide, setHighlightSide] = useState<'left' | 'right' | 'none'>('right');
  const [showDivider, setShowDivider] = useState<boolean>(true);
  const [staggerDelay, setStaggerDelay] = useState<number>(6);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: Spacing.scale.lg,
        width: '100%',
        backgroundColor: Colors.dark.surface1,
        borderRadius: Spacing.radius.lg,
        padding: Spacing.scale.xl,
        border: `1px solid ${Colors.border.default}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: Spacing.scale.md,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.sm }}>
            <Columns size={20} color={Colors.accent.cyan} />
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: Colors.text.primary,
                fontFamily: Typography.fontFamily.sans,
              }}
            >
              ComparisonScene
            </span>
            <span
              style={{
                fontSize: 10,
                fontFamily: Typography.fontFamily.mono,
                backgroundColor: `${Colors.accent.cyan}20`,
                color: Colors.accent.cyan,
                padding: '2px 8px',
                borderRadius: 4,
                border: `1px solid ${Colors.accent.cyan}40`,
              }}
            >
              LAYER 3 TEMPLATE
            </span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: Colors.text.secondary,
              marginTop: 4,
              fontFamily: Typography.fontFamily.sans,
            }}
          >
            Clear visual separation between two product states, feature tiers, or before/after paradigms.
          </div>
        </div>

        <div
          style={{
            fontFamily: Typography.fontFamily.mono,
            fontSize: 11,
            color: Colors.text.tertiary,
            backgroundColor: Colors.dark.surface2,
            padding: '4px 10px',
            borderRadius: Spacing.radius.xs,
            border: `1px solid ${Colors.border.default}`,
          }}
        >
          FRAME {frame} • {fps} FPS
        </div>
      </div>

      {/* Control Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: Spacing.scale.md,
          backgroundColor: Colors.dark.surface2,
          padding: Spacing.scale.md,
          borderRadius: Spacing.radius.md,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        {/* Layout Mode */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontFamily: Typography.fontFamily.mono,
              color: Colors.text.secondary,
              marginBottom: 6,
            }}
          >
            <Layers size={13} color={Colors.accent.cyan} />
            LAYOUT
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {[
              { id: 'side-by-side', label: 'Side by Side' },
              { id: 'before-and-after', label: 'Before/After' },
              { id: 'top-and-bottom', label: 'Top/Bottom' },
              { id: 'left-and-right', label: 'Asymmetric' },
              { id: 'split-screen', label: 'Split' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setLayout(btn.id as ComparisonSceneLayout)}
                style={{
                  padding: '4px 8px',
                  borderRadius: Spacing.radius.xs,
                  border: `1px solid ${layout === btn.id ? Colors.accent.cyan : Colors.border.default}`,
                  backgroundColor: layout === btn.id ? `${Colors.accent.cyan}25` : Colors.dark.surface1,
                  color: layout === btn.id ? Colors.accent.cyan : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: layout === btn.id ? 700 : 500,
                  cursor: 'pointer',
                  fontFamily: Typography.fontFamily.mono,
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Highlight Side */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontFamily: Typography.fontFamily.mono,
              color: Colors.text.secondary,
              marginBottom: 6,
            }}
          >
            <Sparkles size={13} color="#10b981" />
            HIGHLIGHT SIDE
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {[
              { id: 'none', label: 'None' },
              { id: 'left', label: 'Left Side' },
              { id: 'right', label: 'Right Side' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setHighlightSide(btn.id as 'left' | 'right' | 'none')}
                style={{
                  padding: '4px 8px',
                  borderRadius: Spacing.radius.xs,
                  border: `1px solid ${highlightSide === btn.id ? '#10b981' : Colors.border.default}`,
                  backgroundColor: highlightSide === btn.id ? '#10b98125' : Colors.dark.surface1,
                  color: highlightSide === btn.id ? '#10b981' : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: highlightSide === btn.id ? 700 : 500,
                  cursor: 'pointer',
                  fontFamily: Typography.fontFamily.mono,
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontFamily: Typography.fontFamily.mono,
              color: Colors.text.secondary,
              marginBottom: 6,
            }}
          >
            <Sliders size={13} color="#ec4899" />
            TIMING & DIVIDER
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: Colors.text.secondary }}>
              <input
                type="checkbox"
                checked={sequential}
                onChange={(e) => setSequential(e.target.checked)}
              />
              Sequential Reveal
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: Colors.text.secondary }}>
              <input
                type="checkbox"
                checked={showDivider}
                onChange={(e) => setShowDivider(e.target.checked)}
              />
              Divider Line
            </label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              Stagger: {staggerDelay}f
            </span>
            <input
              type="range"
              min={2}
              max={12}
              value={staggerDelay}
              onChange={(e) => setStaggerDelay(Number(e.target.value))}
              style={{ width: 80 }}
            />
          </div>
        </div>
      </div>

      {/* Live Preview Canvas */}
      <div
        style={{
          width: '100%',
          height: 480,
          borderRadius: Spacing.radius.md,
          overflow: 'hidden',
          border: `1px solid ${Colors.border.default}`,
          backgroundColor: '#040711',
          position: 'relative',
        }}
      >
        <ComparisonScene
          layout={layout}
          label="PERFORMANCE BENCHMARK"
          title="Legacy Pipeline vs Autonomous Engine"
          subtitle="Experience 120 FPS sub-frame precision with zero hydration jitter"
          leftLabel="LEGACY PIPELINE"
          leftIcon={<XCircle size={16} color="#ef4444" />}
          leftDescription="Non-deterministic timers, browser drift, and desynchronized audio."
          leftContent={
            <div
              style={{
                backgroundColor: '#0a0d16',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 12,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ fontSize: 12, color: '#ef4444', fontFamily: Typography.fontFamily.mono, fontWeight: 700 }}>
                ● HIGH DRIFT DETECTED
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#ffffff' }}>
                450 ms
              </div>
              <div style={{ fontSize: 11, color: Colors.text.tertiary }}>
                Frame drops: 14% on complex transforms
              </div>
            </div>
          }
          rightLabel="ANTIGRAVITY ENGINE"
          rightIcon={<CheckCircle size={16} color="#10b981" />}
          rightDescription="Sub-frame deterministic rendering with hardware acceleration."
          rightContent={
            <div
              style={{
                backgroundColor: '#071626',
                border: `1px solid ${Colors.accent.cyan}60`,
                borderRadius: 12,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                boxShadow: `0 0 24px ${Colors.accent.cyan}18`,
              }}
            >
              <div style={{ fontSize: 12, color: '#10b981', fontFamily: Typography.fontFamily.mono, fontWeight: 700 }}>
                ● 100% DETERMINISTIC
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: Colors.accent.cyan }}>
                0.0 ms Jitter
              </div>
              <div style={{ fontSize: 11, color: Colors.text.secondary }}>
                Frame drops: 0% verified at 120 FPS
              </div>
            </div>
          }
          divider={
            showDivider
              ? {
                  thickness: 2,
                  color: 'rgba(255, 255, 255, 0.15)',
                  label: 'VS',
                }
              : false
          }
          animation={{
            sequentialReveal: sequential,
            highlightSide: highlightSide,
            staggerDelay: staggerDelay,
          }}
          safeArea={false}
          padding={28}
          background="radial-gradient(ellipse at 50% 25%, #0c1833 0%, #03060e 100%)"
        />
      </div>
    </div>
  );
};
