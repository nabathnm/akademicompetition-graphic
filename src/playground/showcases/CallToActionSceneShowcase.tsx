/**
 * CallToActionScene Showcase
 * Interactive motion graphics playground demonstrating CallToActionScene:
 * - High-impact CTA headlines with kinetic typography
 * - Interactive AnimatedButton integration with continuous harmonic pulse physics
 * - Product visual and device mockup pairings
 * - 5 Layout variations: Centered, Left Aligned, CTA with Product, CTA with Device, Full Screen Typography
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  MousePointerClick,
  Layers,
  Sparkles,
  ArrowRight,
  Download,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';
import { CallToActionScene } from '../../components/scenes/CallToActionScene.tsx';
import { SmartphoneMockup } from '../../components/mockups/SmartphoneMockup.tsx';
import type {
  CallToActionSceneLayout,
} from '../../components/scenes/types.ts';

export const CallToActionSceneShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // State
  const [layout, setLayout] = useState<CallToActionSceneLayout>('centered');
  const [enablePulse, setEnablePulse] = useState<boolean>(true);
  const [showSecondary, setShowSecondary] = useState<boolean>(true);
  const [staggerDelay, setStaggerDelay] = useState<number>(4);

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
            <MousePointerClick size={20} color={Colors.accent.cyan} />
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: Colors.text.primary,
                fontFamily: Typography.fontFamily.sans,
              }}
            >
              CallToActionScene
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
            Direct viewer focus to a primary conversion action with animated kinetic buttons and optional product viewports.
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
              { id: 'centered', label: 'Centered' },
              { id: 'left-aligned', label: 'Left' },
              { id: 'cta-with-product', label: 'Product' },
              { id: 'cta-with-device', label: 'Device' },
              { id: 'full-screen-typography', label: 'Oversized' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setLayout(btn.id as CallToActionSceneLayout)}
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
            BUTTON KINEMATICS
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: Colors.text.secondary }}>
              <input
                type="checkbox"
                checked={enablePulse}
                onChange={(e) => setEnablePulse(e.target.checked)}
              />
              Breathing Pulse
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: Colors.text.secondary }}>
              <input
                type="checkbox"
                checked={showSecondary}
                onChange={(e) => setShowSecondary(e.target.checked)}
              />
              Secondary CTA
            </label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              Stagger: {staggerDelay}f
            </span>
            <input
              type="range"
              min={2}
              max={8}
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
        <CallToActionScene
          layout={layout}
          brand="ANTIGRAVITY OS"
          headline="Experience Autonomous Synthesis"
          description="Build professional-grade motion graphics pipelines with sub-frame accuracy and zero runtime drift."
          primaryAction={{
            label: 'Start Free Trial',
            variant: 'primary',
            icon: <ArrowRight size={16} />,
          }}
          secondaryAction={
            showSecondary
              ? {
                  label: 'Documentation',
                  variant: 'outline',
                  icon: <Download size={16} />,
                }
              : undefined
          }
          deviceMockup={
            layout === 'cta-with-device' ? (
              <SmartphoneMockup
                width={220}
                height={450}
                deviceColor="#090e1c"
                screenContent={
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#050a16',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 16,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 10, color: Colors.accent.cyan, fontWeight: 700 }}>
                      ONE-CLICK DEPLOY
                    </div>
                    <div style={{ fontSize: 16, color: '#ffffff', fontWeight: 800, marginTop: 6 }}>
                      Instant Access
                    </div>
                  </div>
                }
                animate={false}
              />
            ) : undefined
          }
          productVisual={
            layout === 'cta-with-product' ? (
              <div
                style={{
                  width: 320,
                  height: 240,
                  backgroundColor: '#081224',
                  border: `1px solid ${Colors.accent.cyan}50`,
                  borderRadius: 16,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: `0 0 32px ${Colors.accent.cyan}18`,
                }}
              >
                <div style={{ fontSize: 12, color: Colors.accent.cyan, fontWeight: 700 }}>
                  ● ENTERPRISE LICENSE
                </div>
                <div style={{ fontSize: 24, color: '#ffffff', fontWeight: 800 }}>
                  Full Source Code
                </div>
                <div style={{ fontSize: 11, color: Colors.text.tertiary }}>
                  100% Deterministic • Royalty Free
                </div>
              </div>
            ) : undefined
          }
          animation={{
            buttonPulse: enablePulse,
            staggerDelay: staggerDelay,
          }}
          safeArea={false}
          padding={32}
          background="radial-gradient(ellipse at 50% 30%, #0d1e38 0%, #03060f 100%)"
        />
      </div>
    </div>
  );
};
