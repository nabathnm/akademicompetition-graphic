/**
 * OutroScene Showcase
 * Interactive motion graphics playground demonstrating OutroScene:
 * - Brand logo marks with continuous harmonic hover physics
 * - Taglines, website pills, and social media handles
 * - Closing CTA buttons and legal/copyright credentials
 * - 6 Layout variations: Centered Brand, Logo Above Tagline, Tagline Above Logo, Left Aligned, Brand with CTA, Full Screen Logo
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Compass,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';
import { OutroScene } from '../../components/scenes/OutroScene.tsx';
import type {
  OutroSceneLayout,
} from '../../components/scenes/types.ts';

export const OutroSceneShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // State
  const [layout, setLayout] = useState<OutroSceneLayout>('centered-brand');
  const [enableFloating, setEnableFloating] = useState<boolean>(true);
  const [showWebsite, setShowWebsite] = useState<boolean>(true);
  const [staggerDelay, setStaggerDelay] = useState<number>(5);

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
            <Compass size={20} color={Colors.accent.cyan} />
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: Colors.text.primary,
                fontFamily: Typography.fontFamily.sans,
              }}
            >
              OutroScene
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
            Memorable brand closing scenes establishing identity, logo marks, taglines, and social credentials.
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
              { id: 'centered-brand', label: 'Centered' },
              { id: 'logo-above-tagline', label: 'Logo Top' },
              { id: 'tagline-above-logo', label: 'Tagline Top' },
              { id: 'brand-with-cta', label: 'Brand + CTA' },
              { id: 'left-aligned', label: 'Left' },
              { id: 'full-screen-logo', label: 'Full Logo' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setLayout(btn.id as OutroSceneLayout)}
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
            <Sparkles size={13} color="#10b981" />
            ANIMATION & METRICS
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: Colors.text.secondary }}>
              <input
                type="checkbox"
                checked={enableFloating}
                onChange={(e) => setEnableFloating(e.target.checked)}
              />
              Floating Logo
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: Colors.text.secondary }}>
              <input
                type="checkbox"
                checked={showWebsite}
                onChange={(e) => setShowWebsite(e.target.checked)}
              />
              Website Pill
            </label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              Stagger: {staggerDelay}f
            </span>
            <input
              type="range"
              min={2}
              max={10}
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
        <OutroScene
          layout={layout}
          logo={
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                backgroundColor: '#09152b',
                border: `2px solid ${Colors.accent.cyan}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 32px ${Colors.accent.cyan}30`,
              }}
            >
              <ShieldCheck size={36} color={Colors.accent.cyan} />
            </div>
          }
          brandName="ANTIGRAVITY"
          tagline="The Autonomous Video Intelligence Platform"
          website={showWebsite ? 'antigravity.io' : undefined}
          socialHandle="@antigravity_ai"
          supportingText="© 2026 Antigravity Systems Inc. All rights reserved."
          animation={{
            floatingLogo: enableFloating,
            staggerDelay: staggerDelay,
          }}
          safeArea={false}
          padding={32}
          background="radial-gradient(ellipse at 50% 35%, #0d1a33 0%, #03060f 100%)"
        />
      </div>
    </div>
  );
};
