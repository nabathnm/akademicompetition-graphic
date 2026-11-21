/**
 * AnimatedTextShowcase Component
 * Interactive showcase and diagnostic harness for the AnimatedText component.
 * Demonstrates all 10 variants, speed comparisons, easing & spring curves, delay/exit lifecycles, and typography scales.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { AnimatedText } from '../../components/typography/AnimatedText';
import { AnimatedTextVariant } from '../../components/typography/types';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { formatTimecode } from '../../utils/timing/frame';

const ALL_VARIANTS: Array<{ variant: AnimatedTextVariant; label: string; desc: string }> = [
  { variant: 'fade', label: '1. Fade', desc: 'Pure opacity alpha transition' },
  { variant: 'slide-up', label: '2. Slide Up', desc: 'Vertical entry from bottom (Y+40 → 0)' },
  { variant: 'slide-down', label: '3. Slide Down', desc: 'Vertical entry from top (Y-40 → 0)' },
  { variant: 'slide-left', label: '4. Slide Left', desc: 'Horizontal entry from right (X+40 → 0)' },
  { variant: 'slide-right', label: '5. Slide Right', desc: 'Horizontal entry from left (X-40 → 0)' },
  { variant: 'scale', label: '6. Scale', desc: 'Linear/eased scale from 0.75 → 1.0' },
  { variant: 'pop', label: '7. Pop (Spring)', desc: 'Spring physics with snappy bounce' },
  { variant: 'blur', label: '8. Blur', desc: 'Gaussian blur-to-clear (12px → 0px)' },
  { variant: 'rotate', label: '9. Rotate', desc: 'Subtle angular entrance (-10° → 0°)' },
  { variant: 'fade-slide-up', label: '10. Fade + Slide', desc: 'Coordinated opacity and vertical rise' },
];

export const AnimatedTextShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: Spacing.scale.xl,
        width: '100%',
        color: Colors.text.primary,
        fontFamily: Typography.fontFamily.sans,
      }}
    >
      {/* SECTION 1: Telemetry Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${Spacing.scale.sm}px ${Spacing.scale.md}px`,
          backgroundColor: Colors.dark.surface1,
          border: `1px solid ${Colors.border.default}`,
          borderRadius: Spacing.radius.md,
          fontFamily: Typography.fontFamily.mono,
          fontSize: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.sm }}>
          <span style={{ color: Colors.accent.brand, fontWeight: 700 }}>● ANIMATED TEXT SUITE</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>10 DETERMINISTIC VARIANTS</span>
        </div>
        <div style={{ display: 'flex', gap: Spacing.scale.md }}>
          <span>FRAME: <strong style={{ color: Colors.accent.cyan }}>{currentFrame} / {durationInFrames}</strong></span>
          <span>TIMECODE: <strong style={{ color: Colors.accent.amber }}>{formatTimecode(currentFrame, fps)}</strong></span>
        </div>
      </div>

      {/* SECTION 2: Grid of All 10 Animation Variants */}
      <div>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
          ALL 10 ANIMATION VARIANTS (TRIGGER: FRAME 5 · DURATION: 25f)
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {ALL_VARIANTS.map((item) => (
            <div
              key={item.variant}
              style={{
                backgroundColor: Colors.dark.surface1,
                border: `1px solid ${Colors.border.default}`,
                borderRadius: Spacing.radius.md,
                padding: Spacing.scale.md,
                display: 'flex',
                flexDirection: 'column',
                gap: Spacing.scale.sm,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: Colors.text.primary }}>
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: Typography.fontFamily.mono,
                    padding: '1px 6px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: Colors.dark.surface2,
                    color: Colors.accent.brandLight,
                  }}
                >
                  {item.variant}
                </span>
              </div>

              {/* Preview Box */}
              <div
                style={{
                  height: 72,
                  backgroundColor: Colors.dark.bgPrimary,
                  borderRadius: Spacing.radius.sm,
                  border: `1px solid ${Colors.border.subtle}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <AnimatedText
                  variant={item.variant}
                  startFrame={5}
                  durationInFrames={25}
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: Colors.text.primary,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Uber Mobility
                </AnimatedText>
              </div>

              <span style={{ fontSize: 11, color: Colors.text.tertiary, lineHeight: 1.3 }}>
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Speed & Duration Comparison */}
      <div
        style={{
          backgroundColor: Colors.dark.surface1,
          border: `1px solid ${Colors.border.default}`,
          borderRadius: Spacing.radius.md,
          padding: Spacing.scale.md,
        }}
      >
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald, marginBottom: Spacing.scale.sm }}>
          ANIMATION SPEEDS (VARIANT: SLIDE-UP · TRIGGER: FRAME 10)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: Spacing.scale.md }}>
          {[
            { speed: 'Fast (10f)', frames: 10, color: Colors.accent.amber },
            { speed: 'Normal (18f)', frames: 18, color: Colors.accent.brand },
            { speed: 'Slow (36f)', frames: 36, color: Colors.accent.electricViolet },
          ].map((item) => (
            <div
              key={item.speed}
              style={{
                backgroundColor: Colors.dark.surface2,
                borderRadius: Spacing.radius.sm,
                padding: Spacing.scale.md,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: Typography.fontFamily.mono }}>
                <span>{item.speed}</span>
                <span style={{ color: item.color }}>duration: {item.frames}f</span>
              </div>
              <div
                style={{
                  height: 60,
                  backgroundColor: Colors.dark.bgPrimary,
                  borderRadius: Spacing.radius.xs,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AnimatedText
                  variant="slide-up"
                  startFrame={10}
                  durationInFrames={item.frames}
                  style={{ fontSize: 16, fontWeight: 700, color: item.color }}
                >
                  Precision Speed
                </AnimatedText>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Delayed Entrance & Exit Lifecycle */}
      <div
        style={{
          backgroundColor: Colors.dark.surface1,
          border: `1px solid ${Colors.border.default}`,
          borderRadius: Spacing.radius.md,
          padding: Spacing.scale.md,
        }}
      >
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.amber, marginBottom: Spacing.scale.sm }}>
          LIFECYCLE: DELAYED ENTRANCE + EXIT TRANSITION
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Spacing.scale.md }}>
          {/* Card A: Delayed Entrance */}
          <div
            style={{
              backgroundColor: Colors.dark.surface2,
              borderRadius: Spacing.radius.sm,
              padding: Spacing.scale.md,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: Typography.fontFamily.mono }}>
              <span>Delayed Entrance</span>
              <span style={{ color: Colors.accent.brand }}>start: 0f · delay: 20f</span>
            </div>
            <div
              style={{
                height: 70,
                backgroundColor: Colors.dark.bgPrimary,
                borderRadius: Spacing.radius.xs,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AnimatedText
                variant="fade-slide-up"
                startFrame={0}
                delay={20}
                durationInFrames={20}
                style={{ fontSize: 18, fontWeight: 700 }}
              >
                Delayed Arrival (At 20f)
              </AnimatedText>
            </div>
            <span style={{ fontSize: 11, color: Colors.text.tertiary }}>
              Remains hidden until frame 20, then smoothly animates in.
            </span>
          </div>

          {/* Card B: Entrance + Exit Lifecycle */}
          <div
            style={{
              backgroundColor: Colors.dark.surface2,
              borderRadius: Spacing.radius.sm,
              padding: Spacing.scale.md,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: Typography.fontFamily.mono }}>
              <span>Entrance & Exit Lifecycle</span>
              <span style={{ color: Colors.accent.cyan }}>in: 0..20f · out: 50..65f</span>
            </div>
            <div
              style={{
                height: 70,
                backgroundColor: Colors.dark.bgPrimary,
                borderRadius: Spacing.radius.xs,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AnimatedText
                variant="fade-slide-up"
                startFrame={0}
                durationInFrames={20}
                exitFrame={50}
                exitDurationInFrames={15}
                style={{ fontSize: 18, fontWeight: 700, color: Colors.accent.cyan }}
              >
                Temporary Message
              </AnimatedText>
            </div>
            <span style={{ fontSize: 11, color: Colors.text.tertiary }}>
              Slides up at frame 0, holds until frame 50, then exits smoothly.
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 5: Typography Scale Hierarchy */}
      <div
        style={{
          backgroundColor: Colors.dark.surface1,
          border: `1px solid ${Colors.border.default}`,
          borderRadius: Spacing.radius.md,
          padding: Spacing.scale.md,
        }}
      >
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.brand, marginBottom: Spacing.scale.sm }}>
          TYPOGRAPHY HIERARCHY INTEGRATION
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
          <AnimatedText
            as="h1"
            variant="fade-slide-up"
            startFrame={5}
            durationInFrames={25}
            style={{ ...Typography.display.display2, color: Colors.text.primary }}
          >
            Next-Gen Urban Transit
          </AnimatedText>

          <AnimatedText
            as="h3"
            variant="slide-up"
            startFrame={15}
            durationInFrames={20}
            style={{ ...Typography.headline.h3, color: Colors.accent.brandLight }}
          >
            Deterministic motion system for commercial advertising.
          </AnimatedText>

          <AnimatedText
            as="p"
            variant="fade"
            startFrame={25}
            durationInFrames={20}
            style={{ ...Typography.body.medium, color: Colors.text.secondary, maxWidth: 640 }}
          >
            Built on pure frame-based interpolation, spring presets, and modular typography layers.
            Supports arbitrary HTML elements and fluid responsive sizing.
          </AnimatedText>

          <AnimatedText
            as="span"
            variant="pop"
            startFrame={35}
            springPreset="bouncy"
            style={{
              ...Typography.caption.eyebrow,
              color: Colors.accent.emerald,
              backgroundColor: 'rgba(14, 131, 69, 0.15)',
              padding: '4px 10px',
              borderRadius: Spacing.radius.xs,
              border: '1px solid rgba(14, 131, 69, 0.3)',
              width: 'fit-content',
            }}
          >
            ● PRODUCTION READY COMPONENT
          </AnimatedText>
        </div>
      </div>
    </div>
  );
};
