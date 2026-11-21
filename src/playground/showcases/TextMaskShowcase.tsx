/**
 * TextMaskShowcase Component
 * Interactive showcase and diagnostic harness for the TextMask component.
 * Demonstrates all 11 masking variants, directional wipes, diagonal polygon clipping,
 * line-by-line editorial reveals, mask bounds inspection, and typography scales.
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { TextMask } from '../../components/typography/TextMask';
import { TextMaskVariant } from '../../components/typography/types';
import { EasingPresetName } from '../../utils/animation/easing';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { formatTimecode } from '../../utils/timing/frame';

const ALL_VARIANTS: Array<{ variant: TextMaskVariant; label: string; desc: string }> = [
  { variant: 'bottom-reveal', label: '1. Bottom Reveal', desc: 'Text reveals upward from bottom edge' },
  { variant: 'top-reveal', label: '2. Top Reveal', desc: 'Text reveals downward from top edge' },
  { variant: 'left-reveal', label: '3. Left Reveal', desc: 'Text reveals rightward from left edge' },
  { variant: 'right-reveal', label: '4. Right Reveal', desc: 'Text reveals leftward from right edge' },
  { variant: 'center-reveal', label: '5. Center Reveal', desc: 'Clipping expands outward from center' },
  { variant: 'center-collapse', label: '6. Center Collapse', desc: 'Clipping reveals inward from outer edges' },
  { variant: 'vertical-wipe', label: '7. Vertical Wipe', desc: 'Full-height linear vertical wipe' },
  { variant: 'horizontal-wipe', label: '8. Horizontal Wipe', desc: 'Full-width linear horizontal wipe' },
  { variant: 'diagonal-wipe', label: '9. Diagonal Wipe', desc: '45-degree angular polygon wipe' },
  { variant: 'line-reveal', label: '10. Line Reveal', desc: 'Individual lines with staggered timing' },
  { variant: 'mask-slide-up', label: '11. Mask Slide Up', desc: 'Classic editorial slide behind clipping box' },
];

export const TextMaskShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Interactive controls
  const [selectedVariant, setSelectedVariant] = useState<TextMaskVariant>('bottom-reveal');
  const [duration, setDuration] = useState<number>(20);
  const [easing, setEasing] = useState<EasingPresetName>('easeOutCubic');
  const [isReverse, setIsReverse] = useState<boolean>(false);
  const [showBounds, setShowBounds] = useState<boolean>(true);

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
          <span style={{ color: Colors.accent.amber, fontWeight: 700 }}>● TEXT MASK SUITE</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>11 CLIPPING & EDITORIAL VARIANTS</span>
        </div>
        <div style={{ display: 'flex', gap: Spacing.scale.md }}>
          <span>FRAME: <strong style={{ color: Colors.accent.cyan }}>{currentFrame} / {durationInFrames}</strong></span>
          <span>TIMECODE: <strong style={{ color: Colors.accent.amber }}>{formatTimecode(currentFrame, fps)}</strong></span>
        </div>
      </div>

      {/* SECTION 2: Interactive Playground Sandbox */}
      <div
        style={{
          backgroundColor: Colors.dark.surface1,
          border: `1px solid ${Colors.border.default}`,
          borderRadius: Spacing.radius.lg,
          padding: Spacing.scale.lg,
          display: 'flex',
          flexDirection: 'column',
          gap: Spacing.scale.md,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.scale.sm }}>
          <div>
            <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.amber }}>
              EDITORIAL CLIPPING & MASK HARNESS
            </span>
            <h3 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 2 }}>
              Dynamic Mask Boundary Inspection
            </h3>
          </div>

          {/* Quick-toggle parameter pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.sm, flexWrap: 'wrap' }}>
            {/* Show Mask Bounds Toggle */}
            <button
              onClick={() => setShowBounds(!showBounds)}
              style={{
                padding: '6px 12px',
                backgroundColor: showBounds ? Colors.accent.cyan : Colors.dark.surface2,
                border: `1px solid ${showBounds ? Colors.accent.cyan : Colors.border.default}`,
                borderRadius: Spacing.radius.sm,
                color: showBounds ? '#000' : Colors.text.primary,
                fontWeight: 700,
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {showBounds ? 'Mask Bounds: VISIBLE' : 'Mask Bounds: HIDDEN'}
            </button>

            {/* Reverse Toggle */}
            <button
              onClick={() => setIsReverse(!isReverse)}
              style={{
                padding: '6px 12px',
                backgroundColor: isReverse ? Colors.accent.brand : Colors.dark.surface2,
                border: `1px solid ${isReverse ? Colors.accent.brandLight : Colors.border.default}`,
                borderRadius: Spacing.radius.sm,
                color: isReverse ? '#000' : Colors.text.primary,
                fontWeight: 600,
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {isReverse ? 'Reverse: ON' : 'Reverse: OFF'}
            </button>

            {/* Duration Pills */}
            {[
              { label: 'Snappy (12f)', val: 12 },
              { label: 'Standard (20f)', val: 20 },
              { label: 'Cinematic (32f)', val: 32 },
            ].map((d) => (
              <button
                key={d.val}
                onClick={() => setDuration(d.val)}
                style={{
                  padding: '6px 10px',
                  backgroundColor: duration === d.val ? Colors.accent.amber : Colors.dark.surface2,
                  border: `1px solid ${duration === d.val ? Colors.accent.amber : Colors.border.default}`,
                  borderRadius: Spacing.radius.sm,
                  color: duration === d.val ? '#000' : Colors.text.secondary,
                  fontWeight: 600,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                {d.label}
              </button>
            ))}

            {/* Easing Pills */}
            {[
              { label: 'easeOutCubic', val: 'easeOutCubic' as EasingPresetName },
              { label: 'easeOutExpo', val: 'easeOutExpo' as EasingPresetName },
              { label: 'easeInOutCubic', val: 'easeInOutCubic' as EasingPresetName },
            ].map((e) => (
              <button
                key={e.val}
                onClick={() => setEasing(e.val)}
                style={{
                  padding: '6px 10px',
                  backgroundColor: easing === e.val ? Colors.accent.emerald : Colors.dark.surface2,
                  border: `1px solid ${easing === e.val ? Colors.accent.emerald : Colors.border.default}`,
                  borderRadius: Spacing.radius.sm,
                  color: easing === e.val ? '#000' : Colors.text.secondary,
                  fontWeight: 600,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Stage Display */}
        <div
          style={{
            minHeight: 140,
            backgroundColor: Colors.dark.surface2,
            borderRadius: Spacing.radius.md,
            border: `1px solid ${Colors.border.subtle}`,
            padding: Spacing.scale.xl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <TextMask
            key={`${selectedVariant}-${duration}-${easing}-${isReverse}-${showBounds}`}
            text="ENGINEERED TO MOVE CITIES"
            variant={selectedVariant}
            startFrame={5}
            durationInFrames={duration}
            easing={easing}
            reverse={isReverse}
            showMaskBounds={showBounds}
            style={{
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: Colors.text.primary,
              textAlign: 'center',
            }}
          />
        </div>
      </div>

      {/* SECTION 3: Grid of All 11 Animation Variants */}
      <div>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
          ALL 11 MASK & CLIPPING VARIANTS (TRIGGER: FRAME 5 · DURATION: 20f)
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {ALL_VARIANTS.map((item) => (
            <div
              key={item.variant}
              onClick={() => setSelectedVariant(item.variant)}
              style={{
                backgroundColor: selectedVariant === item.variant ? Colors.dark.surface2 : Colors.dark.surface1,
                border: `1px solid ${selectedVariant === item.variant ? Colors.accent.amber : Colors.border.default}`,
                borderRadius: Spacing.radius.md,
                padding: Spacing.scale.md,
                display: 'flex',
                flexDirection: 'column',
                gap: Spacing.scale.sm,
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: Colors.text.primary }}>
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: Typography.fontFamily.mono,
                    padding: '2px 6px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: selectedVariant === item.variant ? Colors.accent.amber : Colors.dark.surface3,
                    color: selectedVariant === item.variant ? '#000' : Colors.text.tertiary,
                    fontWeight: 700,
                  }}
                >
                  {item.variant.toUpperCase()}
                </span>
              </div>

              <span style={{ fontSize: 11, color: Colors.text.secondary, minHeight: 28 }}>
                {item.desc}
              </span>

              {/* Rendered Live Component */}
              <div
                style={{
                  height: 60,
                  backgroundColor: Colors.dark.bgPrimary,
                  borderRadius: Spacing.radius.sm,
                  border: `1px solid ${Colors.border.subtle}`,
                  display: 'flex',
                  alignItems: 'center',
                  padding: `0 ${Spacing.scale.md}px`,
                  overflow: 'hidden',
                }}
              >
                <TextMask
                  text="PRECISION CLIPPED"
                  variant={item.variant}
                  startFrame={5}
                  durationInFrames={20}
                  showMaskBounds={showBounds}
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: Colors.text.primary,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Line-by-Line Editorial Reveals */}
      <div>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald, marginBottom: Spacing.scale.sm }}>
          LINE-BY-LINE EDITORIAL HEADLINES (VARIANT: LINE-REVEAL)
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {/* Normal Sequential Lines */}
          <div
            style={{
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              padding: Spacing.scale.md,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.xs,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: Colors.text.primary }}>
                Sequential Line Cascade
              </span>
              <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.accent.emerald }}>
                stagger: 4f · duration: 18f
              </span>
            </div>
            <span style={{ fontSize: 11, color: Colors.text.secondary }}>
              Each line translates out of its dedicated overflow mask in sequential order.
            </span>
            <div
              style={{
                backgroundColor: Colors.dark.bgPrimary,
                borderRadius: Spacing.radius.sm,
                border: `1px solid ${Colors.border.subtle}`,
                padding: Spacing.scale.md,
                marginTop: Spacing.scale.xs,
              }}
            >
              <TextMask
                variant="line-reveal"
                text={'Autonomous Fleets.\nIntelligent Logistics.\nGlobal Scale.'}
                startFrame={5}
                staggerDelay={4}
                lineDuration={18}
                showMaskBounds={showBounds}
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  lineHeight: 1.35,
                  color: Colors.accent.cyan,
                }}
              />
            </div>
          </div>

          {/* Reverse Line Cascade */}
          <div
            style={{
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              padding: Spacing.scale.md,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.xs,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: Colors.text.primary }}>
                Reverse Line Cascade (reverse: true)
              </span>
              <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.accent.brand }}>
                Bottom Line First
              </span>
            </div>
            <span style={{ fontSize: 11, color: Colors.text.secondary }}>
              Bottom line reveals first, working upward to the headline anchor.
            </span>
            <div
              style={{
                backgroundColor: Colors.dark.bgPrimary,
                borderRadius: Spacing.radius.sm,
                border: `1px solid ${Colors.border.subtle}`,
                padding: Spacing.scale.md,
                marginTop: Spacing.scale.xs,
              }}
            >
              <TextMask
                variant="line-reveal"
                text={'Autonomous Fleets.\nIntelligent Logistics.\nGlobal Scale.'}
                startFrame={5}
                staggerDelay={4}
                lineDuration={18}
                reverse={true}
                showMaskBounds={showBounds}
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  lineHeight: 1.35,
                  color: Colors.accent.amber,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: Specialized Geometry (Center Reveal & Diagonal Wipe) */}
      <div>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.electricViolet, marginBottom: Spacing.scale.sm }}>
          SPECIALIZED GEOMETRY: CENTER EXPANSION & DIAGONAL POLYGON
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {/* Center Reveal */}
          <div
            style={{
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              padding: Spacing.scale.md,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.xs,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: Colors.text.primary }}>
                Center Reveal (variant: center-reveal)
              </span>
              <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.accent.cyan }}>
                inset(0% 50% → 0% 0%)
              </span>
            </div>
            <span style={{ fontSize: 11, color: Colors.text.secondary }}>
              Clipping plane expands symmetrically from the horizontal center outward.
            </span>
            <div
              style={{
                height: 64,
                backgroundColor: Colors.dark.bgPrimary,
                borderRadius: Spacing.radius.sm,
                border: `1px solid ${Colors.border.subtle}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: `0 ${Spacing.scale.md}px`,
                marginTop: Spacing.scale.xs,
              }}
            >
              <TextMask
                variant="center-reveal"
                text="EXPAND FROM CENTER"
                startFrame={5}
                durationInFrames={22}
                showMaskBounds={showBounds}
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  color: Colors.accent.cyan,
                }}
              />
            </div>
          </div>

          {/* Diagonal Wipe */}
          <div
            style={{
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              padding: Spacing.scale.md,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.xs,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: Colors.text.primary }}>
                Diagonal Wipe (variant: diagonal-wipe)
              </span>
              <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.accent.electricViolet }}>
                polygon 45-degree angle
              </span>
            </div>
            <span style={{ fontSize: 11, color: Colors.text.secondary }}>
              Dynamic 45-degree polygon knife edge cutting across text boundaries.
            </span>
            <div
              style={{
                height: 64,
                backgroundColor: Colors.dark.bgPrimary,
                borderRadius: Spacing.radius.sm,
                border: `1px solid ${Colors.border.subtle}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: `0 ${Spacing.scale.md}px`,
                marginTop: Spacing.scale.xs,
              }}
            >
              <TextMask
                variant="diagonal-wipe"
                text="DIAGONAL SLICE MASK"
                startFrame={5}
                durationInFrames={22}
                showMaskBounds={showBounds}
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  color: Colors.accent.electricViolet,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: Typography Scale Matrix */}
      <div>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.text.secondary, marginBottom: Spacing.scale.sm }}>
          TYPOGRAPHY SCALE HIERARCHY WITH DESCENDER SAFETY
        </div>

        <div
          style={{
            backgroundColor: Colors.dark.surface1,
            border: `1px solid ${Colors.border.default}`,
            borderRadius: Spacing.radius.md,
            padding: Spacing.scale.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: Spacing.scale.lg,
          }}
        >
          {/* Display */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              DISPLAY HERO (40px · MASK SLIDE UP · DESCENDERS: g, y, p, q)
            </span>
            <TextMask
              variant="mask-slide-up"
              text="Going everywhere with agility"
              startFrame={5}
              durationInFrames={22}
              showMaskBounds={showBounds}
              style={{
                fontSize: 40,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: Colors.text.primary,
              }}
            />
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              HEADLINE (26px · BOTTOM REVEAL)
            </span>
            <TextMask
              variant="bottom-reveal"
              text="Every journey calculated with millisecond accuracy"
              startFrame={8}
              durationInFrames={20}
              showMaskBounds={showBounds}
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: Colors.text.secondary,
              }}
            />
          </div>

          {/* Subhead */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              SUBHEAD (16px · LEFT REVEAL)
            </span>
            <TextMask
              variant="left-reveal"
              text="Urban mobility infrastructure powering 10,000+ cities worldwide."
              startFrame={12}
              durationInFrames={18}
              showMaskBounds={showBounds}
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: Colors.accent.emerald,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
